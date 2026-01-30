const Review = require('../models/review.model');
const baseService = require('./base.service');

exports.getReviews = baseService.getAll(Review); 
exports.getReview = baseService.getOne(Review);
exports.createReview = baseService.createOne(Review); 
exports.updateReview = baseService.updateOne(Review);
exports.deleteReview = baseService.deleteById(Review);
