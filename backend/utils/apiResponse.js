/**
 * Success Response Handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @param {Object} pagination - Pagination information (optional)
 * @returns {Object} JSON response
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}, pagination = null) => {
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
 * Error Response Handler
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Additional error details (optional)
 * @returns {Object} JSON response
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length === 0 ? undefined : errors
  });
};

/**
 * Validation Error Response Handler
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors from express-validator
 * @returns {Object} JSON response with 400 status code
 */
const validationError = (res, errors) => {
  const formattedErrors = {};
  
  errors.array().forEach(error => {
    if (!formattedErrors[error.param]) {
      formattedErrors[error.param] = [];
    }
    formattedErrors[error.param].push(error.msg);
  });

  return errorResponse(
    res,
    400,
    'Validation Error',
    formattedErrors
  );
};

/**
 * Not Found Response Handler
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource not found
 * @returns {Object} JSON response with 404 status code
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(
    res,
    404,
    `${resource} not found`
  );
};

/**
 * Unauthorized Response Handler
 * @param {Object} res - Express response object
 * @param {string} message - Custom unauthorized message (optional)
 * @returns {Object} JSON response with 401 status code
 */
const unauthorizedResponse = (res, message = 'Not authorized to access this route') => {
  return errorResponse(
    res,
    401,
    message
  );
};

/**
 * Forbidden Response Handler
 * @param {Object} res - Express response object
 * @param {string} message - Custom forbidden message (optional)
 * @returns {Object} JSON response with 403 status code
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(
    res,
    403,
    message
  );
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse
};
