const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tour.controller');
const tourMiddleware = require('../middlewares/tour.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// router.param('id', tourMiddlewares.checkID);

router
  .route('/top-5-cheap')
  .get(
    authMiddleware.protect,
    tourMiddleware.aliasTopTours,
    tourController.getAllTour,
  );

router
  .route('/tour-stats')
  .get(authMiddleware.protect, tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('guide', 'lead-guide', 'admin'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(authMiddleware.protect, tourController.getAllTour)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('lead-guide', 'admin'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(authMiddleware.protect, tourController.getTour)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('lead-guide', 'admin'),
    tourController.updateTour,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guidle'),
    tourController.deleteTour,
  );

module.exports = router;
