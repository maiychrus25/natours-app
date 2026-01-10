const httpStatus = require('http-status');

module.exports = (err, req, res, next) => {
  err.status = err.status || 'fail';
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
