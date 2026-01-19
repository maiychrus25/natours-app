const Review = require('../models/review.model');

exports.getReviews = async () => {
  const reviews = await Review.find({});
  return reviews;
}

exports.createReview = async (data) => {
  const review = await Review.create(data);
  return review;
}
