const httpStatus = require('http-status');
const tourServices = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTour = catchAsync(async (req, res) => {
  const tours = await tourServices.getAllTour(req.query);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourServices.getTour(req.params.id);

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
  const tour = await tourServices.createTour(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourServices.updateTour(req.params.id, req.body);

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

exports.deleteTour = catchAsync(async (req, res) => {
  await tourServices.deleteTour(req.params.id);

  res.status(httpStatus.NO_CONTENT).json({
    status: 'success',
    message: 'Deleted a tour successfully!',
    data: null,
  });
});
