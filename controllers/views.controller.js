const httpStatus = require('http-status');
const tourService = require('../services/tour.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a comfirmation. If your booking doesn't show up here immediatly, please come back later.";
  }

  next();
};

exports.renderOverview = catchAsync(async (req, res, next) => {
  const tours = await tourService.getTours({ ...req.query, limit: 10 });

  res.status(httpStatus.OK).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.renderTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.getTourBySlug(req.params.slug);

  if (!tour) {
    return next(
      new AppError('There is no tour with that name!', httpStatus.NOT_FOUND),
    );
  }

  res.status(httpStatus.OK).render('tour', {
    title: tour.name,
    tour: tour,
  });
});

exports.renderLogin = (req, res) => {
  res.status(httpStatus.OK).render('login', {
    title: 'Log into your account',
  });
};

exports.renderAccount = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).render('account', {
    title: 'My account',
  });
});

exports.renderMyTours = catchAsync(async (req, res) => {
  const tours = await tourService.getMyTours(req.user.id);

  res.status(httpStatus.OK).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.renderSignUp = (req, res) => {
  res.status(httpStatus.OK).render('signup', {
    title: 'Create your account!',
  });
};
