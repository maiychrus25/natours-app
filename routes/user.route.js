const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

// Not login dont protect
router.post('/signup', authController.signup);
router.post('/signin', authLimiter, authController.login);

// Not login dont protect
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.patch('/reset-password/:token', authLimiter, authController.resetPassword);

// Login need protect
router.patch(
  '/update-password',
  authLimiter,
  authMiddleware.auth(),
  authController.updatePassword,
);

router
  .route('/:id')
  .get(
    authMiddleware.auth('guide', 'lead-guide', 'admin'),
    userController.getUser,
  )
  .patch(authMiddleware.auth('admin'), userController.updateUser)
  .delete(authMiddleware.auth('admin'), userController.deleteUser);

router
  .route('/')
  .get(
    authMiddleware.auth('admin', 'lead-guide', 'guide'),
    userController.getAllUser,
  )
  .post(authMiddleware.auth('admin'), userController.createUser);

// route for personal user
router.patch(
  '/update-me-info',
  authLimiter,
  authMiddleware.auth(),
  userController.updateMeInfo,
);

router.delete('/delete-me', authMiddleware.auth(), userController.deleteMe);

module.exports = router;
