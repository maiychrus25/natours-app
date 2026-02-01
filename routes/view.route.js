const express = require('express');
const viewsController = require('../controllers/views.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', viewsController.renderLogin);

router.use(authMiddleware.isLoggedIn);

router.get('/', viewsController.renderOverview);
router.get('/tour/:slug', viewsController.renderTour);

module.exports = router;
