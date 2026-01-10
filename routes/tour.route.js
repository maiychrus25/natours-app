const express = require('express');

const router = express.Router();

const tourControllers = require('../controllers/tour.controller');
const tourMiddlewares = require('../middlewares/tour.middleware');

// router.param('id', tourMiddlewares.checkID);

router
  .route('/top-5-cheap')
  .get(tourMiddlewares.aliasTopTours, tourControllers.getAllTour);

router.route('/tour-stats').get(tourControllers.getTourStats);

router
  .route('/')
  .get(tourControllers.getAllTour)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
