const httpStatus = require('http-status');
const handlerFactory = require('./handlerFactory.controller');
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUser(req.query);

  res.status(httpStatus.OK).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUser(req.params.id);

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
  const newUser = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);

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

exports.updateMeInfo = catchAsync(async (req, res, next) => {
  const user = await userService.updateMeInfo(req.user.id, req.body);

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteUser = handlerFactory.deleteOne(userService.deleteUser); 

exports.deleteMe = handlerFactory.deleteOne(userService.deleteMe); 
