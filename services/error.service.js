const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = `Invalid ${err.path}: ${err.value}!`;

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

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // handle error from mongoDB
    if (!error.CastError || error.name === 'CastError') {
      error = handleCastErrorDB(error);
      console.log(error);
    }

    sendErrorProd(error, res);
  }
};
