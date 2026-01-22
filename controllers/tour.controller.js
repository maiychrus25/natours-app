const httpStatus = require('http-status');
const tourService = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTour = catchAsync(async (req, res, next) => {
  const tours = await tourService.getAllTour(req.query);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.getTour(req.params.id);

  if (!tour) {
    return next(
      new AppError('No tour found with that ID!', httpStatus.NOT_FOUND),
    );
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const tour = await tourService.createTour(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.updateTour(req.params.id, req.body);

  if (!tour) {
    return next(new AppError('No tour found to update!', httpStatus.NOT_FOUND));
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.deleteTour(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID!', 404));
  }

  res.status(httpStatus.NO_CONTENT).json({
    status: 'success',
    message: 'Deleted a tour successfully!',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const tourStats = await tourService.getTourStats();

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      stats: tourStats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await tourService.getMonthlyPlan(req.params.year * 1);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: plan.length,
    data: {
      plan: plan,
    },
  });
});


// HANDLE REVIEWS
exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await tourService.getReviews(req.user.id, req.params.tourId);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    }
  })
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await tourService.getReview(req.user.id, req.params.tourId, req.params.reviewId);
  
  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      review: review,
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const data = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.params.tourId,
    user: req.user.id,
  }

  const newReview = await tourService.createReview(data);
  
  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      review: newReview,
    }
  });
});
