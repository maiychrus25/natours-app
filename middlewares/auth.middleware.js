const httpStatus = require('http-status');
const passport = require('passport');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
