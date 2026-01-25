const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Each route not can access to params another router 
// --> mergeParams allow it.
const router = express.Router({ mergeParams: true });

router.route('/:reviewId')
  .get(authMiddleware.auth(), reviewController.getReview)

router.route('/')
  .get(authMiddleware.auth(), reviewController.getReviews)
  .post(authMiddleware.auth(), reviewController.setUserTourIds, reviewController.createReview)

router.route('/:id')
  .patch(authMiddleware.auth(), reviewController.updateReview)
  .delete(authMiddleware.auth(), reviewController.deleteReview);

module.exports = router;
