const httpStatus = require('http-status');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');
const baseService = require('./base.service');

const filterObj = (obj, ...allowedFields) => {
  return Object.keys(obj).reduce((acc, cur) => {
    if (allowedFields.includes(cur)) {
      acc[cur] = obj[cur];
    }

    return acc;
  }, {});
};

exports.getUsers = baseService.getAll(User); 
exports.getUser = baseService.getOne(User); 

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email }).select('+password');
  return user;
};

exports.getUserByToken = async (token) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');
  return user;
};

exports.createUser = baseService.createOne(User); 

exports.updateUser = baseService.updateOne(User); 

/**
 * Update a current user info
 * @param {String} email or Name
 * @return {Object} document
 **/
exports.updateMeInfo = async (userId, data) => {
  // 1) Create error if user POSTs password data
  if (data.password || data.passwordConfirm) {
    throw new AppError(
      'This route is not for password updates. Please use /update-password!',
      httpStatus.BAD_REQUEST,
    );
  }

  // 2) Update user document
  const filteredData = filterObj(data, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

exports.deleteMe = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { active: false },
    { new: true },
  );
  return user;
};

exports.deleteUser = baseService.deleteById(User);
