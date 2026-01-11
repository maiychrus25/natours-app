const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = `Invalid ${err.path}: ${err.value}!`;

  return new AppError(message, statusCode);
};

const handleDuplicateFields = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, statusCode);
};

const handleErrorValidation = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const data = Object.entries(err.errors)[0];
  const message = `Invalid ${data[0]}: ${data[1]}!`;

  return new AppError(message, statusCode);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client!
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details to client!
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  console.log(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // handle error from mongoDB
    if (error.code === 11000) {
      error = handleDuplicateFields(error);
    }

    if (error.errors) {
      error = handleErrorValidation(error);
    }

    if (!error.CastError && error.path) {
      error = handleCastErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
