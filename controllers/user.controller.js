const userServices = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await userServices.getAllUser(req.query);

  res.status(200).json({
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
    return next(new AppError('No user found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await userServices.createUser(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userServices.updateUser(req.params.id, req.body);

  if (!user) {
    return next(new AppError('No user found to update!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userServices.deleteUser(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Deleted a user successfully!',
    data: null,
  });
});
