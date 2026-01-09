const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routers
const tourRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
