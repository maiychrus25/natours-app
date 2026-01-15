const httpStatus = require('http-status');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');

const filterObj = (obj, ...allowedFields) => {
  return Object.keys(obj).reduce((acc, cur) => {
    if (allowedFields.includes(cur)) {
      acc[cur] = obj[cur];
    }

    return acc;
  }, {});
};

exports.getAllUser = async (queryString) => {
  // 1) Count total documents matching filter
  const filterObj = { ...queryString };
  const excludedFields = ['limit', 'page', 'sort', 'fields'];

  excludedFields.forEach((el) => {
    delete filterObj[el];
  });

  let filterStr = JSON.stringify(filterObj);
  // eslint-disable-next-line arrow-body-style
  filterStr = filterStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);

  const totalDocs = await User.countDocuments(JSON.parse(filterStr));

  // 2) Apply features
  const features = new APIFeatures(
    User.find(JSON.parse(filterStr)),
    queryString,
  );
  const users = await features.limitFields().sort().paginate().query;

  // 3) Pagination check
  const limit = queryString.limit * 1 || 5;
  const page = queryString.page * 1 || 1;

  const totalPages = Math.ceil(totalDocs / limit);
  if (page > totalPages && totalDocs > 0) {
    throw new Error('This page does not exist!');
  }

  return users || [];
};

exports.getUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

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

exports.createUser = async (data) => {
  const newUser = await User.create(data);
  return newUser;
};

exports.updateUser = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data);
  return user;
};

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

exports.deleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { active: false },
    { new: true },
  );
  return user;
};
