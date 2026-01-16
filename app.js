const httpStatus = require('http-status');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const jwtStrategy = require('./config/passport');

const AppError = require('./utils/appError');
const globalErrorHandle = require('./services/error.service');

const app = express();

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
