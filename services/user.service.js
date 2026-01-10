const User = require('../models/user.model');

exports.getAllUser = async () => {
  const users = await User.find({});
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
