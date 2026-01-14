const httpStatus = require('http-status');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const userService = require('./user.service');

/**
 * Create a user
 * @param {Object} - UserData
 * @returns {Object} - newUser
 **/
exports.handleSignUp = async (data) => {
  return await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });
};

/**
 * Login gin with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise <User>}
 **/
exports.loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isCorrectPassword(user.password, password))) {
    throw new AppError('Incorrect email or password!', httpStatus.UNAUTHORIZED);
  }
  return user;
};

/**
 * Forgot password
 * @param {string} email
 * @return {Promise}
 **/
exports.forgotPassword = async (email) => {
  // 1) Get user based on POSTed email
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new AppError(
      'There is no user with email address!',
      httpStatus.NOT_FOUND,
    );
  }

  // 2) Generate the random reset password token
  const resetPasswordToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
};
