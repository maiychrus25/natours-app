const userServices = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  // 1A) Filtering
  const filter = { ...req.query };
  const excludedFields = ['limit', 'page', 'sort', 'fields'];

  excludedFields.forEach((el) => {
    delete filter[el];
  });

  // 1B) Advanced Filtering
  let filterStr = JSON.stringify(filter);

  // eslint-disable-next-line arrow-body-style
  filterStr = filterStr.replace(/\b(lte|gte|lt|gt)\b/g, (match) => `$${match}`);

  // 2) Sorting
  const options = {};
  if (req.query && req.query.sort) {
    options.sortBy = req.query.sort.split(',').join(' ');
  } else {
    options.sortBy = '-createdAt _id';
  }

  // 3) Pagination
  if (req.query && req.query.page) {
    options.page = req.query.page * 1;
  } else {
    options.page = 1;
  }

  if (req.query && req.query.limit) {
    options.limit = req.query.limit * 1;
  } else {
    options.limit = 5;
  }

  // 4) Limiting fields
  if (req.query && req.query.fields) {
    options.fields = req.query.fields.split(',').join(' ');
  } else {
    options.fields = '-__v';
  }

  const users = await userServices.getAllUser(JSON.parse(filterStr), options);

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
