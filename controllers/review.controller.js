const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');
const handlerFactory = require('./handlerFactory.controller');

exports.getReviews = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;
  const reviews = await reviewService.getReviews(filter);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    }
  })
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.getReview(req.user.id, req.params.tourId, req.params.reviewId);
  
  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      review: review,
    }
  });
});

exports.setUserTourIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
}

exports.createReview = handlerFactory.createOne(reviewService.createReview); 
exports.updateReview = handlerFactory.updateOne(reviewService.updateReview);
exports.deleteReview = handlerFactory.deleteOne(reviewService.deleteReview); 
