const express = require('express');
const viewsController = require('../controllers/views.controller');

const router = express.Router();

router.get('/', viewsController.renderOverview);
router.get('/tour', viewsController.renderTour);

module.exports = router;
