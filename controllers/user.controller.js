const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory.controller');
const userService = require('../services/user.service');

exports.updateMeInfo = catchAsync(async (req, res, next) => {
  const user = await userService.updateMeInfo(req.user.id, req.body);

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});


exports.getAllUser = handlerFactory.getAll(userService.getUsers);

exports.getUser = handlerFactory.getOne(userService.getUser); 

exports.createUser = handlerFactory.createOne(userService.createUser); 

exports.updateUser = handlerFactory.updateOne(userService.updateUser); 

exports.deleteUser = handlerFactory.deleteOne(userService.deleteUser); 

exports.deleteMe = handlerFactory.deleteOne(userService.deleteMe); 
