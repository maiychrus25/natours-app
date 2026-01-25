const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getReviews(req.user.id, req.params.tourId);

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

exports.createReview = catchAsync(async (req, res, next) => {
  let tourId = req.body.tour;
  let userId = req.body.user;
  if (!userId) userId = req.user.id;
  if (!tourId) tourId = req.params.tourId;

  const data = {
    review: req.body.review,
    rating: req.body.rating,
    tour: tourId,
    user: userId,
  }

  const newReview = await reviewService.createReview(data);
  
  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      review: newReview,
    }
  });
});
