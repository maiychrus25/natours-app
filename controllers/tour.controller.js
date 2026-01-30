const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const tourService = require('../services/tour.service');
const handlerFactory = require('./handlerFactory.controller');

exports.getTours = handlerFactory.getAll(tourService.getTours); 

exports.getTour = handlerFactory.getOne(tourService.getTour);

exports.createTour = handlerFactory.createOne(tourService.createTour); 

exports.updateTour = handlerFactory.updateOne(tourService.updateTour); 

exports.deleteTour = handlerFactory.deleteOne(tourService.deleteTour); 

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(new AppError('Plesae provde latituter and longitude in the format lat, lng!', httpStatus.BAD_REQUEST));
  }

  const tours = await tourService.getToursWithin(Number(distance), lat, lng, unit);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

