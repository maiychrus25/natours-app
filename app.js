const path = require('path');
const httpStatus = require('http-status');
const express = require('express');
const morgan = require('morgan');

const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');

const passport = require('./config/passport');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const AppError = require('./utils/appError');
const globalErrorHandle = require('./services/error.service');

const tourRoutes = require('./routes/tour.route');
const userRoutes = require('./routes/user.route');
const reviewRoutes = require('./routes/review.route');
const bookingRoutes = require('./routes/booking.route');
const authRoutes = require('./routes/auth.route');
const viewRoutes = require('./routes/view.route');
const bookingController = require('./controllers/booking.controller');

const app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// =====================================
// 1. GLOBAL MIDDLEWARE:              #
// ====================================
// Implement CORS
// app.use(cors({
// origin: "https://www.natours.app"
// }));
// Access-Control-Allow-Origin
app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
// Giup che giau thong tin server va ngan chan cac ma doc
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://*.stripe.com', 'https://*.mapbox.com', 'https://*.stripe.network'],
        scriptSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://*.stripe.com',
          'https://cdnjs.cloudflare.com',
          'https://cdn.jsdelivr.net',
          'https://unpkg.com',
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://fonts.googleapis.com',
          'https://*.stripe.com',
          'https://*.stripe.network',
          "'unsafe-inline'",
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.mapbox.com',
          'https://res.cloudinary.com',
          'https://*.stripe.com',
          'https://*.googleusercontent.com',
        ],
        connectSrc: [
          "'self'",
          'blob:',
          'https://*.mapbox.com',
          'https://*.stripe.com',
          'https://events.mapbox.com',
          'ws://localhost:*',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        frameSrc: ["'self'", 'https://*.stripe.com', 'https://*.stripe.network'],
        childSrc: ["'self'", 'blob:'],
        workerSrc: ["'self'", 'blob:'],
        upgradeInsecureRequests: true 
      },
    },
  }),
);

// 1) Cau hinh trust proxy (rat qun trong khi deploy len heroku, vercel, AWS, ...)
// Neu khong co dong nay, limiter se chan nham IP cua server proxy thay vi IP user
app.set('trust proxy', 1);
app.use('/api', globalLimiter);
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
// Gioi han du lieu gui len la 10kb de tranh treo server
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
// Example: '$', { email: { $gt: '' }}
app.use(mongoSanitize());

// Data Sanitization against XSS Attack
app.use(xss());

// Prevent parameter pollution
// Ngan chan loi khi user gui 2 tham so giong nhau(Ex: ?sort=duration&sort=price)
/// whitelist: cac tham so cho phep trung lap
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// ===============================
// 2. AUTHENTICATION CONFIG      =
// ==============================

// JWT authentication
app.use(passport.initialize());

// =============================
// 3. ROUTES                   =
// ============================

// Routers API
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/auth/google', authRoutes);

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
