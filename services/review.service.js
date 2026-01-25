const httpStatus = require('http-status');
const Review = require('../models/review.model');
const AppError = require('../utils/appError');

exports.getReviews = async (tourId, userId) => {
  const reviews = await Review.find({ user: userId, tour: tourId }); 
  return reviews;
}

exports.getReview = async (userId, tourId, reviewId) => {
  const review = await Review.findOne({ user: userId, tour: tourId, _id: reviewId })
  if (!review) {
    throw new AppError('Can not find review with that ID!', httpStatus.NOT_FOUND);
  }

  return review;
}

exports.createReview = async (data) => {
  const newReview = await Review.create(data);
  return newReview;
}
