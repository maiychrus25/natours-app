const httpStatus = require('http-status');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const helmet = require('helmet');
const xss = require('xss-clean')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')

const jwtStrategy = require('./config/passport');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const AppError = require('./utils/appError');
const globalErrorHandle = require('./services/error.service');

const tourRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');

const app = express();

// =====================================
// 1. GLOBAL MIDDLEWARESi              # 
// ====================================

// Set Security HTTP Headers
// Giup che giau thong tin server va ngan chan cac ma doc
app.use(helmet())

// 1) Cau hinh trust proxy (rat qun trong khi deploy len heroku, vercel, AWS, ...)
// Neu khong co dong nay, limiter se chan nham IP cua server proxy thay vi IP user 
app.set('trust proxy', 1);
app.use('/api', globalLimiter);

// Development logging 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
// Gioi han du lieu gui len la 10kb de tranh treo server
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL injection
// Example: '$', { email: { $gt: '' }}
app.use(mongoSanitize())

// Data Sanitization against XSS Attack
app.use(xss())

// Prevent parameter pollution
// Ngan chan loi khi user gui 2 tham so giong nhau(Ex: ?sort=duration&sort=price)
/// whitelist: cac tham so cho phep trung lap 
/app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ],
  })
);

// ===============================
// 2. AUTHENTICATION CONFIG      =
// ==============================

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// =============================
// 3. ROUTES                   =
// ============================

// Routers
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// ============================
// 4. ERROR HANDLING          =
// ===========================

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can not find ${req.originalUrl} on this server!`,
      httpStatus.NOT_FOUND,
    ),
  );
});

app.use(globalErrorHandle);

module.exports = app;
