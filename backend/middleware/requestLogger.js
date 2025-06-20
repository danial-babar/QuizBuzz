const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;
const { v4: uuidv4 } = require('uuid');
const { ENV } = require('../../config/constants');

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, requestId }) => {
  return `${timestamp} [${level}] [${requestId || 'NO_REQUEST_ID'}] ${message}`;
});

// Create a logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  defaultMeta: { service: 'api-request-logger' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to `combined.log`
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console as well
if (ENV.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
    level: 'debug',
  }));
}

/**
 * Middleware to log API requests and responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const requestLogger = (req, res, next) => {
  // Generate a unique request ID
  const requestId = uuidv4();
  
  // Add request ID to request and response objects
  req.requestId = requestId;
  res.set('X-Request-ID', requestId);
  
  // Log request start
  const startTime = process.hrtime();
  
  // Log request details
  logger.info({
    message: 'Request received',
    requestId,
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    query: req.query,
    params: req.params,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      'x-api-version': req.headers['x-api-version'],
    },
    body: req.body,
    timestamp: new Date().toISOString(),
  });
  
  // Store the original response methods
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Override response methods to log the response
  res.send = function (body) {
    logResponse(this, body);
    return originalSend.call(this, body);
  };
  
  res.json = function (body) {
    logResponse(this, body);
    return originalJson.call(this, body);
  };
  
  // Log response details
  function logResponse(response, body) {
    const endTime = process.hrtime(startTime);
    const responseTime = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2); // in ms
    
    // Log response details
    logger.info({
      message: 'Response sent',
      requestId,
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      responseTime: `${responseTime}ms`,
      headers: response.getHeaders(),
      body: response.statusCode >= 400 ? body : undefined, // Only log error response bodies
      timestamp: new Date().toISOString(),
    });
  }
  
  // Handle request errors
  req.on('error', (error) => {
    logger.error({
      message: 'Request error',
      requestId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  });
  
  // Handle response finish
  res.on('finish', () => {
    const endTime = process.hrtime(startTime);
    const responseTime = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2); // in ms
    
    // Log request completion
    logger.info({
      message: 'Request completed',
      requestId,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  });
  
  next();
};

/**
 * Middleware to log unhandled errors
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorLogger = (error, req, res, next) => {
  const requestId = req.requestId || 'NO_REQUEST_ID';
  
  logger.error({
    message: 'Unhandled error',
    requestId,
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  
  next(error);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};
