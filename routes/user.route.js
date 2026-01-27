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

router.use(authMiddleware.auth());

// Login need protect
// route for personal user
router.patch(
  '/update-password',
  authLimiter,
  authController.updatePassword,
);

router.get('/me', userController.getMe, userController.getUser);

router.patch(
  '/update-me-info',
  authLimiter,
  userController.updateMeInfo,
);

router.delete('/delete-me', userController.deleteMe);

router.use(authMiddleware.restrictTo('admin'));

router
  .route('/:id')
  .get(
    userController.getUser,
  )
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/')
  .get(
    authMiddleware.auth('admin', 'lead-guide', 'guide'),
    userController.getAllUser,
  )
  .post(authMiddleware.auth('admin'), userController.createUser);


module.exports = router;
