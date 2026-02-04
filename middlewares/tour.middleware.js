const httpStatus = require('http-status');
const AppError = require('../utils/appError');
const Booking = require('../models/booking.model');

/**
 * Handle add fields for req object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express middleware function
 * @returns {null}
 **/
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.setBookingUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
}

exports.canReviewTour = async (req, res, next) => {
  const booking = await Booking.findOne({
    user: req.user.id,
    tour: req.params.id
  });

  if (!booking) {
    return next(new AppError('You must book this tour before reviewing!', httpStatus.FORBIDDEN));
  } 

  next();
}
