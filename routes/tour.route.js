const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tour.controller');
const tourMiddleware = require('../middlewares/tour.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// router.param('id', tourMiddlewares.checkID);

router
  .route('/top-5-cheap')
  .get(tourMiddleware.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authMiddleware.protect, tourController.getAllTour)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
