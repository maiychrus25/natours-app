const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const authService = require('../services/auth.service');
// const tokenService = require('../services/token.service');
const userService = require('../services/user.service');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
