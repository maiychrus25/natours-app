const httpStatus = require('http-status');

const authServices = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = authServices.handleSignUp(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
