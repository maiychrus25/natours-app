const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/mailtrap');

const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

exports.authGoogle = (req, res) => {
  const token = jwt.sign({ id: req.user._id, type: 'access' }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const cookieOptions = {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // NOTE: must have (OAuth + redirect)
    sameSite: 'lax'
  };

  res.cookie("jwt", token, cookieOptions);
  res.cookie("notify", JSON.stringify({
    status: 'success',
    message: `Welcome back, ${req.user.name}!`
  }), {
    maxAge: 10 * 1000,
    httpOnly: false,
    sameSite: 'strict',
  });
  
  res.redirect("/");
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await authService.handleSignUp(req.body);

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

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

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    maxAge: 10 * 1000,
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully!',
  });
}

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
    req.params.token,
    req.body.password,
  );
  tokenService.createSendToken(user, httpStatus.OK, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await authService.updatePasword(
    req.user.email,
    req.body.passwordCurrent,
    req.body.password,
    req.body.passwordConfirm,
  );
  tokenService.createSendToken(user, httpStatus.OK, req, res);
});
