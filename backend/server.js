const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const { specs, swaggerUi } = require('./utils/swagger');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'duration',
      'maxGroupSize',
      'price'
    ]
  })
);

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { 
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'QuizBuzz API Documentation'
}));

// Apply rate limiting to auth routes
app.use('/api/v1/auth', authLimiter);

// Apply rate limiting to all other API routes
app.use('/api/v1', apiLimiter);

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/users', userRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'))
  );
}

// Error handling middleware (must be after all other middleware and routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
