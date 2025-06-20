const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { format } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  
  // Add metadata if it exists
  if (Object.keys(meta).length > 0) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return log;
});

// Create a format for log files
const fileFormat = combine(
  timestamp(),
  json()
);

// Create a format for console output
const consoleLogFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  consoleFormat
);

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  defaultMeta: { service: 'quizbuzz-api' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  exitOnError: false
});

// If we're not in production, log to the `console` with a custom format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleLogFormat,
    handleExceptions: true,
    handleRejections: true
  }));
}

// Create a stream for morgan to use for HTTP request logging
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

module.exports = logger;
