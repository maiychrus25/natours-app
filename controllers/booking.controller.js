const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const bookingService = require('../services/booking.service');
const userService = require('../services/user.service');
const factoryHandler = require('./handlerFactory.controller');
const Booking = require('../models/booking.model');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const session = await bookingService.getCheckoutSession(
    req.params.tourId,
    req.user,
    req.protocol,
    req.get('host'),
  );

  res.status(httpStatus.OK).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can making bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) {
//     return next();
//   }

//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
//   // res.redirect('/');
// };

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const userObj = await userService.getUserByEmail(session.customer_email);
  const user = userObj.id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log('Webhook Signature Error: ', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingCheckout(event.data.object);
  }

  res.status(200).json({
    received: true,
  });
};

exports.createBooking = factoryHandler.createOne(bookingService.createBooking);
exports.getBookings = factoryHandler.getAll(bookingService.getBookings);
exports.getBooking = factoryHandler.getOne(bookingService.getBooking);
exports.updateBooking = factoryHandler.updateOne(bookingService.updateOne);
exports.deleteBooking = factoryHandler.deleteOne(bookingService.deleteOne);
