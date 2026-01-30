const reviewService = require('../services/review.service');
const handlerFactory = require('./handlerFactory.controller');

<<<<<<< HEAD
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
=======
exports.setUserTourIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
}
>>>>>>> refactor/mvc-service-layer

exports.getReviews = handlerFactory.getAll(reviewService.getReviews); 
exports.getReview = handlerFactory.getOne(reviewService.getReview);
exports.createReview = handlerFactory.createOne(reviewService.createReview); 
exports.updateReview = handlerFactory.updateOne(reviewService.updateReview);
exports.deleteReview = handlerFactory.deleteOne(reviewService.deleteReview); 
