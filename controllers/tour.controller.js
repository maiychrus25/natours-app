const tourServices = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTour = catchAsync(async (req, res) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['limit', 'page', 'sort'];

  excludedFields.forEach((el) => {
    delete queryObj[el];
  });

  // 2) Advanced Filtering
  let queryStr = JSON.stringify(queryObj);

  // eslint-disable-next-line arrow-body-style
  queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

  const tours = await tourServices.getAllTour(JSON.parse(queryStr));

  res.status(200).json({
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
    return next(new AppError('No tour found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const tour = await tourServices.createTour(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourServices.updateTour(req.params.id, req.body);

  if (!tour) {
    return next(new AppError('No tour found to update!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  await tourServices.deleteTour(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Deleted a tour successfully!',
    data: null,
  });
});
