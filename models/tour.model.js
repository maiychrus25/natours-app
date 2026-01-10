const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'A tour must have a name!',
      trim: true,
      unique: true,
      minlength: [
        10,
        'A tour name must have more or equal then 10 characters!',
      ],
      maxlength: [
        40,
        'A tour name must have less or equal then 40 characters!',
      ],
      // validate: {
      //   validator: validator.isAlpha,
      //   message: 'Tour name ({VALUE}) must only contain characters!',
      // },
    },
    duration: {
      type: Number,
      requied: 'A tour must have a durations!',
    },
    maxGroupSize: {
      type: Number,
      required: 'A tour must have a group size!',
    },
    difficulty: {
      type: String,
      required: 'A tour must have a difficulty!',
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult!',
      },
    },
    price: {
      type: Number,
      required: 'A tour must have a price!',
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: (props) =>
          // eslint-disable-next-line arrow-body-style
          `${props.value} is not a valid number, Discount price should be below regular price!`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: 'A tour must have a description!',
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0!'],
      max: [5, 'Rating must be below 5.0!'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: 'A tour must have a cover image!',
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
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

tourSchema.virtual('weeklyDuration').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: run before save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: '-' });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post('find', function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

/**
 * @typedef Tour
 **/
const Tour = mongoose.model('Tour', tourSchema, 'tours');

module.exports = Tour;
