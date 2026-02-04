const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bookingService = require('../services/booking.service');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const session = await bookingService.getCheckoutSession(req.params.tourId, req.user.email, req.protocol, req.get('host'));

  res.status(httpStatus.OK).json({
    status: 'success',
    session
  });
});
