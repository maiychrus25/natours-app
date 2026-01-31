const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
    session: false,
  }), authController.authGoogle
);


module.exports = router;
