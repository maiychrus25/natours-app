const express = require('express');
const viewsController = require('../controllers/views.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', viewsController.renderLogin);

router.get('/tour/:slug', authMiddleware.isLoggedIn, viewsController.renderTour);

router.get('/me', authMiddleware.auth(), viewsController.renderAccount);

router.get('/', authMiddleware.isLoggedIn, viewsController.renderOverview);

module.exports = router;
