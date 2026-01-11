const User = require('../models/user.model');
const APIFeatures = require('../utils/APIFeatures');

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

exports.createUser = async (data) => {
  const newUser = await User.create(data);
  return newUser;
};

exports.updateUser = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
  return user;
};

exports.deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
