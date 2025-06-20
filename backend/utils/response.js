const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Success response formatter
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @param {Object} pagination - Pagination metadata (optional)
 * @returns {Object} Formatted success response
 */
const successResponse = (res, data = null, message = SUCCESS_MESSAGES.SUCCESS, statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response formatter
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object|Array} errors - Additional error details (optional)
 * @param {string} code - Error code (optional)
 * @returns {Object} Formatted error response
 */
const errorResponse = (res, message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR, statusCode = 500, errors = null, code = null) => {
  const response = {
    success: false,
    message,
    code: code || `ERR_${statusCode}`,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

/**
 * Validation error response formatter
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors from express-validator
 * @returns {Object} Formatted validation error response
 */
const validationError = (res, errors) => {
  const formattedErrors = {};
  
  errors.array().forEach(error => {
    const field = error.param;
    
    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }
    
    formattedErrors[field].push(error.msg);
  });

  return errorResponse(
    res,
    ERROR_MESSAGES.VALIDATION_ERROR,
    400,
    formattedErrors,
    'ERR_VALIDATION'
  );
};

/**
 * Not found response formatter
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource not found
 * @returns {Object} Formatted not found response
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(
    res,
    `${resource} not found`,
    404,
    null,
    'ERR_NOT_FOUND'
  );
};

/**
 * Unauthorized response formatter
 * @param {Object} res - Express response object
 * @param {string} message - Custom unauthorized message (optional)
 * @returns {Object} Formatted unauthorized response
 */
const unauthorizedResponse = (res, message = ERROR_MESSAGES.UNAUTHORIZED) => {
  return errorResponse(
    res,
    message,
    401,
    null,
    'ERR_UNAUTHORIZED'
  );
};

/**
 * Forbidden response formatter
 * @param {Object} res - Express response object
 * @param {string} message - Custom forbidden message (optional)
 * @returns {Object} Formatted forbidden response
 */
const forbiddenResponse = (res, message = ERROR_MESSAGES.FORBIDDEN) => {
  return errorResponse(
    res,
    message,
    403,
    null,
    'ERR_FORBIDDEN'
  );
};

/**
 * Rate limit exceeded response formatter
 * @param {Object} res - Express response object
 * @param {string} message - Custom rate limit message (optional)
 * @returns {Object} Formatted rate limit response
 */
const rateLimitExceededResponse = (res, message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED) => {
  return errorResponse(
    res,
    message,
    429,
    null,
    'ERR_RATE_LIMIT_EXCEEDED'
  );
};

/**
 * Bad request response formatter
 * @param {Object} res - Express response object
 * @param {string} message - Custom error message
 * @param {Object|Array} errors - Additional error details (optional)
 * @returns {Object} Formatted bad request response
 */
const badRequestResponse = (res, message = ERROR_MESSAGES.BAD_REQUEST, errors = null) => {
  return errorResponse(
    res,
    message,
    400,
    errors,
    'ERR_BAD_REQUEST'
  );
};

/**
 * Conflict response formatter (e.g., duplicate entry)
 * @param {Object} res - Express response object
 * @param {string} message - Custom conflict message
 * @param {Object|Array} errors - Additional error details (optional)
 * @returns {Object} Formatted conflict response
 */
const conflictResponse = (res, message = ERROR_MESSAGES.CONFLICT, errors = null) => {
  return errorResponse(
    res,
    message,
    409,
    errors,
    'ERR_CONFLICT'
  );
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitExceededResponse,
  badRequestResponse,
  conflictResponse
};
