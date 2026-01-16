const httpStatus = require('http-status');
const rateLimit = require('express-rate-limit')
const AppError = require('../utils/appError');

const createLimiter = (minutes, maxRequests, message) => {
  return rateLimit({
    max: maxRequests,
    windowMs: minutes * 60 * 1000, // convert minute to milisecond
    standardHeaders: true, // return header 'RateLimit-*'
    legacyHeaders: false, // turn off old header 'X-Ratelimit-*

    // custom error when over max request 
    handler: (req, res, next, options) => {
      next(new AppError(message || `To many requests from this IP, please try again after ${minutes} minutes!`,
        httpStatus.TOO_MANY_REQUESTS // 429 
      )
    );
    },

    // bo qua request thanh cong (tuy chon, thuong khong dung cho IP bao mat)
    skipSuccessfulRequests: false
  });
};

// 1) Limiter for global API
exports.globalLimiter = createLimiter(15, 100, 'To many requests from this IP, please try again in an hour!');

// 2) Limiter for auth
exports.authLimiter = createLimiter(15, 5, 'Too many login attemps, please try again later!');
