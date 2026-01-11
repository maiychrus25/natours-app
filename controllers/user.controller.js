const httpStatus = require('http-status');
const userServices = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await userServices.getAllUser(req.query);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userServices.getUser(req.params.id);

  if (!user) {
    return next(
      new AppError('No user found with that ID!', httpStatus.NOT_FOUND),
    );
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await userServices.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userServices.updateUser(req.params.id, req.body);

  if (!user) {
    return next(new AppError('No user found to update!', httpStatus.NOT_FOUND));
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const tour = await userServices.deleteUser(req.params.id);

  if (!tour) {
    return next(new AppError('No user with that ID!', 404));
  }

  res.status(httpStatus.NO_CONTENT).json({
    status: 'success',
    message: 'Deleted a user successfully!',
    data: null,
  });
});
