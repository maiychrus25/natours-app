const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getReviews();
  
  res.status(httpStatus.OK).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews 
    }
  })
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.createReview(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      review: review,
    }
  })
});
