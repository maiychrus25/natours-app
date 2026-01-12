const User = require('../models/user.model');

exports.handleSignUp = async (data) => {
  return await User.create(data);
};
