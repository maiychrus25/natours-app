const express = require('express');

const router = express.Router();

const reviewRouter = require('./review.route');
const tourController = require('../controllers/tour.controller');
const tourMiddleware = require('../middlewares/tour.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// router.param('id', tourMiddlewares.checkID);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourMiddleware.aliasTopTours, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authMiddleware.auth('guide', 'lead-guide', 'admin'),
    tourController.getMonthlyPlan,
  );

// /tours-within/:distance/center/latlng/unit/:unit
// /tours-within/500/center/34.02047895,-118.4117326/unit/mi 

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/').get(tourController.getTours).post(
  authMiddleware.auth('lead-guide', 'admin'),
  // authMiddleware.restrictTo('lead-guide', 'admin'),
  tourController.createTour,
);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authMiddleware.auth('lead-guide', 'admin'), tourController.updateTour)
  .delete(
    authMiddleware.auth('lead-guide', 'admin'),
    tourController.deleteTour,
  );

// Nested Router Review --> Simple for Reference
// router.route('/:tourId/reviews/:reviewId')
//   .get(authMiddleware.auth(), tourController.getReview)
//
// router.route('/:tourId/reviews')
//   .get(authMiddleware.auth(), tourController.getReviews)
//   .post(authMiddleware.auth(), tourController.createReview)
//

module.exports = router;
