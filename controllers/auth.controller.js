const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await authService.handleSignUp(req.body);
  // const url = `${req.protocol}://${req.get('host')}/me`;
  tokenService.createSendToken(newUser, httpStatus.CREATED, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError(
        'Please provide email and password!',
        httpStatus.BAD_REQUEST,
      ),
    );
  }

  // 2) Check if user exists && password is correct
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // 3) If everything ok, send token to client
  tokenService.createSendToken(user, httpStatus.OK, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/<RESET_TOKEN>`;

  await authService.forgotPassword(req.body.email, resetURL);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await authService.resetPassword(
    req.body.token,
    req.body.password,
  );
  tokenService.createSendToken(user, httpStatus.OK, req, res);
});
