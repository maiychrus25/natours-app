const httpStatus = require('http-status');
const tourService = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.renderOverview = catchAsync(async (req, res, next) => {
  const tours = await tourService.getTours({ ...req.query, limit: 10 });

  res.status(httpStatus.OK).render('overview', {
    title: 'All tours',
    tours: tours
  });
});

exports.renderTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.getTourBySlug(req.params.slug);

  if (!tour) {
    return next(new AppError('There is no tour with that name!', httpStatus.NOT_FOUND));
  }

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

exports.renderAccount = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).render('account', {
    title: 'My account'
  });
});

