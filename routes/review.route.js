const express = require('express');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware.auth(), reviewController.getReviews)
  .post(authMiddleware.auth(), reviewController.createReview)

module.exports = router;
