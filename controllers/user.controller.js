const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory.controller');
const userService = require('../services/user.service');

exports.getAllUser = handlerFactory.getAll(userService.getUsers);

exports.getUser = handlerFactory.getOne(userService.getUser); 

exports.createUser = handlerFactory.createOne(userService.createUser); 

exports.updateUser = handlerFactory.updateOne(userService.updateUser); 

exports.deleteUser = handlerFactory.deleteOne(userService.deleteUser); 

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.updateMeInfo = catchAsync(async (req, res, next) => {
  const user = await userService.updateMeInfo(req.user.id, req.body);

  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Account updated successfully!',
    data: {
      user: user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userService.deleteMe(req.user.id);

  res.status(httpStatus.NO_CONTENT).json({
    status: 'success',
    data: null
  })
})
