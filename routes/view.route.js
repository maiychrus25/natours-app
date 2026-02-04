const express = require('express');
const viewsController = require('../controllers/views.controller');
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', viewsController.renderLogin);

router.get('/auth/signup', viewsController.renderSignUp);

router.get('/tour/:slug', authMiddleware.isLoggedIn, viewsController.renderTour);

router.get('/me', authMiddleware.auth(), viewsController.renderAccount);

router.get('/my-tours', authMiddleware.auth(), viewsController.renderMyTours);

router.get('/', 
  bookingController.createBookingCheckout,
  authMiddleware.isLoggedIn, 
  viewsController.renderOverview
);

module.exports = router;
