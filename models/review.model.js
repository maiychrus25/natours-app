const mongoose = require('mongoose')

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
  }
}, {
  timestamp: true,
  toJson: { virtuals: true },
  toObject: { virtuals: true }
});

const Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = Review;
