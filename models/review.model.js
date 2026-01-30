const mongoose = require('mongoose')
const Tour = require('./tour.model');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: 'Review can not be empty!',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: 'Review must be belong to a tour!'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'Review must be belong to a user!'
  },
}, {
  timestamps: true,
  toJson: { virtuals: true },
  toObject: { virtuals: true }
});

// INDEXES
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// QUERY MIDDLEWARES
reviewSchema.pre(/^find/, function (next) {
  this.populate({ 
    path: 'user', 
    select: 'name photo'
  });

  next();
})

// STATICS METHOD
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' } 
      }
    },
    {
      $sort: {
        avgRating: -1
      }
    }
  ]);

  if (stats.length) {
    await Tour.findByIdAndUpdate(tourId, { 
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, { 
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating
    });
  }
}

reviewSchema.post('save', function () {
  // this points to current review
  // Review.calcAverageRatings(this.tour);
  this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function () {
  // this.findOne() not working in new version mongoose
  // solution for this is clone() query
  this.r = await this.clone().findOne();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(): does NOT work here, query already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = Review;

