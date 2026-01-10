const tourServices = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTour = catchAsync(async (req, res) => {
  // 1A) Filtering
  const filter = { ...req.query };
  const excludedFields = ['limit', 'page', 'sort', 'fields'];

  excludedFields.forEach((el) => {
    delete filter[el];
  });

  // 1B) Advanced Filtering
  let filterStr = JSON.stringify(filter);

  // eslint-disable-next-line arrow-body-style
  filterStr = filterStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

  // 2) Sorting
  const options = {};
  if (req.query && req.query.sort) {
    options.sortBy = req.query.sort.split(',').join(' ');
  } else {
    options.sortBy = '-createdAt';
  }

  // 3) Pagination
  if (req.query && req.query.page) {
    options.page = req.query.page;
  } else {
    options.page = 1;
  }

  if (req.query && req.query.limit) {
    options.limit = req.query.limit;
  } else {
    options.limit = 5;
  }

  // 4) Limit fields
  if (req.query && req.query.fields) {
    options.fields = req.query.fields.split(',').join(' ');
  } else {
    options.fields = '-__v';
  }

  const tours = await tourServices.getAllTour(JSON.parse(filterStr), options);

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
