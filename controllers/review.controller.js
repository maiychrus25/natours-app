const reviewService = require('../services/review.service');
const handlerFactory = require('./handlerFactory.controller');

exports.setUserTourIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
}

exports.getReviews = handlerFactory.getAll(reviewService.getReviews); 
exports.getReview = handlerFactory.getOne(reviewService.getReview);
exports.createReview = handlerFactory.createOne(reviewService.createReview); 
exports.updateReview = handlerFactory.updateOne(reviewService.updateReview);
exports.deleteReview = handlerFactory.deleteOne(reviewService.deleteReview); 
