const httpStatus = require('http-status');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const tourService = require('../services/tour.service');
const handlerFactory = require('./handlerFactory.controller');

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

exports.createTour = handlerFactory.createOne(tourService.createTour); 

exports.updateTour = handlerFactory.updateOne(tourService.updateTour); 

exports.deleteTour = handlerFactory.deleteOne(tourService.deleteTour); 

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await tourService.deleteTour(req.params.id);
//
//   if (!tour) {
//     return next(new AppError('No tour found with that ID!', 404));
//   }
//
//   res.status(httpStatus.NO_CONTENT).json({
//     status: 'success',
//     message: 'Deleted a tour successfully!',
//     data: null,
//   });
// });

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



