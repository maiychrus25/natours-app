const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Each route not can access to params another router 
// --> mergeParams allow it.
const router = express.Router({ mergeParams: true });

// router.route('/:reviewId')
//   .get(authMiddleware.auth(), reviewController.getReviewOnTour)

router.route('/')
  .get(reviewController.getReviews)
  .post(authMiddleware.auth(), reviewController.setUserTourIds, reviewController.createReview)

router.route('/:id')
  .get(reviewController.getReview)
  .patch(authMiddleware.auth(), authMiddleware.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(authMiddleware.auth(), authMiddleware.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
