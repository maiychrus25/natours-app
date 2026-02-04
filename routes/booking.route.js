const express = require('express');
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/checkout-session/:tourId', 
  authMiddleware.auth(), 
  bookingController.getCheckoutSession
);

module.exports = router;
