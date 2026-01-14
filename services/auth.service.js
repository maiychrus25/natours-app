const httpStatus = require('http-status');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const userService = require('./user.service');
const sendEmail = require('../utils/mailtrap.js');

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
exports.forgotPassword = async (email, resetURL) => {
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
  resetURL = resetURL.replace('<RESET_TOKEN>', resetPasswordToken);
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: email,
      subject: 'Your password reset token (valid for 10 min)!',
      message: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    throw new AppError(
      'There was an error sending the email. Try again later!',
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return 'OK';
};
