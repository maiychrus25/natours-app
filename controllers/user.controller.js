const userServices = require('../services/user.service');

exports.getAllUser = (req, res) => {
  const data = userServices.getAllUser();

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      users: data,
    },
  });
};

exports.getUser = (req, res) => {
  const data = userServices.getUser(req.params.id);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found!',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: data,
    },
  });
};

exports.createUser = (req, res) => {
  const data = userServices.createUser(req.body);

  res.status(201).json({
    status: 'success',
    message: 'User created successfully!',
    data: {
      user: data,
    },
  });
};

exports.updateUser = (req, res) => {
  const data = userServices.updateUser(req.params.id, req.body);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: ' not found!',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully!',
    data: {
      user: data,
    },
  });
};

exports.deleteUser = (req, res) => {
  const data = userServices.deleteUser(req.params.id);

  if (data === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found!',
      data: null,
    });
  }

  res.status(204).json({
    status: 'success',
    message: 'User deleted successfully!',
    data: null,
  });
};
