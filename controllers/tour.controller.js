const tourServices = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');

exports.getAllTour = catchAsync(async (req, res) => {
  const tours = await tourServices.getAllTour();

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await tourServices.getTour(req.params.id);

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

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await tourServices.updateTour(req.params.id, req.body);

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
