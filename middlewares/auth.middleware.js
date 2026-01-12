const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const httpStatus = require('http-status');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const tokenService = require('../services/token.service');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new AppError(
        'Your are not logged in!  Please log in to get access.',
        httpStatus.UNAUTHORIZED,
      ),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        httpStatus.UNAUTHORIZED,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  console.log(decoded);
  if (currentUser.isChangedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please log in again.',
        httpStatus.UNAUTHORIZED,
      ),
    );
  }

  next();

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
});
