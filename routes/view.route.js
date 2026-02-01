const express = require('express');
const viewsController = require('../controllers/views.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', viewsController.renderLogin);

router.get('/', viewsController.renderOverview);
router.get('/tour/:slug', authMiddleware.auth(), viewsController.renderTour);

module.exports = router;
