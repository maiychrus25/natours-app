const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
      required: 'A user must have a role!',
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
      required: 'Pleease provide a password!',
      minLength: 8,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    slug: {
      type: String,
      default: '',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: '-' });
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  this.start = Date.now();
  next();
});

userSchema.post('find', function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
  console.log(this.pipeline());
  next();
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
