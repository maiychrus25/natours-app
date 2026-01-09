const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user.controller');

router
  .route('/')
  .get(userControllers.getAllUser)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
