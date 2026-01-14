const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const message = `Invalid ${err.path}: ${err.value}!`;

  return new AppError(message, statusCode);
};

const handleDuplicateFields = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  const value = err.message.match(/name:\s*"([^"]+)/)?.[1];
  const message = `Duplicate field value: ${value}!. Please use another value!`;

  return new AppError(message, statusCode);
};

const handleValidationErrorDB = (err) => {
  const statusCode = httpStatus.BAD_REQUEST;
  // eslint-disable-next-line arrow-body-style
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}!`;

  return new AppError(message, statusCode);
};

const handleJWTError = () => {
  const statusCode = httpStatus.UNAUTHORIZED;
  const message = 'Invalid token! Please log in again.';

  return new AppError(message, statusCode);
};

const handleJWTExpiredError = () => {
  const statusCode = httpStatus.UNAUTHORIZED;
  const message = 'Your token has expired! Please log in again.';

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
    error.name = err.name;
    error.message = err.message;

    // handle error from mongoDB
    if (error.code === 11000) {
      error = handleDuplicateFields(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};
