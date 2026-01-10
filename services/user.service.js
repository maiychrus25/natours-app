const User = require('../models/user.model');

exports.getAllUser = async (filter, options) => {
  const numUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(numUsers / options.limit);

  if (options.page > totalPages) {
    throw new Error('This page does not exist!');
  }

  const skip = (options.page - 1) * options.limit;

  const users = await User.find(filter)
    .select(options.fields)
    .sort(options.sortBy)
    .skip(skip)
    .limit(options.limit);

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
  await User.findByIdAndDelete(userId);
};
