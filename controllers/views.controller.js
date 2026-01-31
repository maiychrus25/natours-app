const httpStatus = require('http-status');
const tourService = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');

exports.renderOverview = catchAsync(async (req, res, next) => {
  const tours = await tourService.getTours({ ...req.query, limit: 10 });

  res.status(httpStatus.OK).render('overview', {
    title: 'All tours',
    tours: tours
  });
});

exports.renderTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.getTourBySlug(req.params.slug);

  res.status(httpStatus.OK).render('tour', {
    title: tour.name,
    tour: tour
  });
});

exports.renderLogin = (req, res) => {
  res.status(httpStatus.OK).render('login', {
    title: 'Log into your account',
  });
}
