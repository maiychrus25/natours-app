const httpStatus = require('http-status');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

const verifyCallback =
  (req, res, resolve, reject, allowedFields) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new AppError('Please authenticate!', httpStatus.UNAUTHORIZED),
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    res.locals.user = user;

    if (allowedFields.length) {
      const userRole = user.role;
      if (!allowedFields.includes(userRole)) {
        return reject(
          new AppError(
            'You do not have permission to perform this action!',
            httpStatus.FORBIDDEN,
          ),
        );
      }
    }

    // All passed
    resolve();
  };

/**
 * Protect routes is authentication token ser is correct
 * @param {Object} req - Express request
 * param {Object} res - Express response
 * return {null}
 **/
exports.auth = (...allowedFields) =>
  catchAsync(async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, res, resolve, reject, allowedFields),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  });

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) return next();

  // 1) Verify token
  const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET_KEY);

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) { 
    return next();
  }
  
  // 3) Check if user changed password after the token was issued
  if (currentUser.isChangedPasswordAfter(decoded.iat)) {
    return next();
  }

  // THERE IS A LOGGED IN USER 
  res.locals.user = currentUser;
  next();
});

/**
 * Handle check current user have permission
 * @param {Array} roles - roles have permission
 * @returns {Callback}
 **/
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'] -> currentUser.role = 'user' -> not permission
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return next(
        new AppError(
          'You do not have permission to perform this action!',
          httpStatus.FORBIDDEN,
        ),
      );
    }

    next();
  };
};
