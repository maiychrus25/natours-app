const express = require('express');
const bookingController = require('../controllers/booking.controller');
const tourMiddleware = require('../middlewares/tour.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.auth());

router.get(
  '/checkout-session/:tourId',
  authMiddleware.auth(),
  bookingController.getCheckoutSession,
);

router.use(authMiddleware.restrictTo('admin', 'lead-guide'));

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router
  .route('/')
  .get(bookingController.getBookings)
  .post(tourMiddleware.setBookingUserId, bookingController.createBooking);

module.exports = router;
