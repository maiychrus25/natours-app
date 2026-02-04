const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bookingService = require('../services/booking.service');
const Booking = require('../models/booking.model');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const session = await bookingService.getCheckoutSession(req.params.tourId, req.user, req.protocol, req.get('host'));

  res.status(httpStatus.OK).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can making bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
  // res.redirect('/');
};
