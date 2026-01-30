const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Please tell us your name!',
      trim: true,
      minlength: [6, 'A user name must have more or equal then 6 characters!'],
      maxlength: [
        40,
        'A user name must have less or equal then 40 characters!',
      ],
    },
    email: {
      type: String,
      required: 'Please provide your email!',
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email!',
      },
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      required: 'A user must have a role!',
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return this.provider !== 'google'; 
      },
      minLength: 8,
      trim: true,
      validate: {
        // eslint-disable-next-line arrow-body-style
        validator: (val) => val.match(/\d/) || !val.match(/[a-zA-Z]/),
        message: 'Password must contain at least one letter and one number!',
      },
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: function () {
        return this.provider !== 'google';
      },
      validate: {
        // This only works on CREATE and SAVE method!!
        validator: function(el) {
          if (!this.password) return true;
          return this.password === el;
        },
        message: 'Passwords are not the same!',
      },
    },
    slug: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise <boolean>}
 **/
userSchema.statics.isEmailTaken = async function(email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, replacement: '-' });
  next();
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (this.password && user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    user.passwordConfirm = undefined;
  }

  next();
});

userSchema.pre('save', function(next) {
  if (this.password && this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 8);
  }

  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  this.start = Date.now();
  next();
});

userSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
  next();
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 **/
userSchema.methods.isCorrectPassword = async function(
  candidatePassword,
  userPassword,
) {
  // Because password field is select by false
  // then this.password not effect
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check password changed after time point
 * @param {string} JWTTimestamp
 * @returns {boolean}
 **/
userSchema.methods.isChangedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

/**
 * Create reset password token
 * @returns {string} reset password token
 **/
userSchema.methods.createResetPasswordToken = function() {
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(
    { resetPasswordToken },
    { passwordResetTokenHash: this.passwordResetToken },
  );

  return resetPasswordToken;
};

userSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
  console.log(this.pipeline());
  next();
});

/**
 * @typedef User
 **/
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
