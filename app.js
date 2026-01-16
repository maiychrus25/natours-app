const httpStatus = require('http-status');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const jwtStrategy = require('./config/passport');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');

const AppError = require('./utils/appError');
const globalErrorHandle = require('./services/error.service');

const app = express();

// 1) Cau hinh trust proxy (rat qun trong khi deploy len heroku, vercel, AWS, ...)
// Neu khong co dong nay, limiter se chan nham IP cua server proxy thay vi IP user 
app.set('trust proxy', 1);

app.use('/api', globalLimiter);

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Routers
const tourRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

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
