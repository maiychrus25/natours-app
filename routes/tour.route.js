const express = require('express');
const router = express.Router();

const tourControllers = require('../controllers/tour.controller');
const tourMiddlewares = require('../middlewares/tour.middleware');

router.param('id', tourMiddlewares.checkID);

router
  .route('/')
  .get(tourControllers.getAllTour)
  .post(tourMiddlewares.checkBody, tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
