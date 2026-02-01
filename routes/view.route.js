const express = require('express');
const viewsController = require('../controllers/views.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', viewsController.renderLogin);

router.use(authMiddleware.isLoggedIn);

router.get('/tour/:slug', viewsController.renderTour);

router.get('/', viewsController.renderOverview);

module.exports = router;
