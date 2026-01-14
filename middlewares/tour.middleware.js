const httpStatus = require('http-status');
const AppError = require('../utils/appError');

/**
 * Handle add fields for req object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express middleware function
 * @returns {null}
 **/
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
