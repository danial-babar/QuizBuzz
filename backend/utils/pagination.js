const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../config/constants');

/**
 * Generate pagination parameters from request query
 * @param {Object} query - Express request query object
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (query = {}) => {
  let { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sort, fields } = query;

  // Convert page and limit to numbers
  page = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE);
  limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT));

  // Calculate skip value
  const skip = (page - 1) * limit;

  // Parse sort fields
  let sortBy = {};
  if (sort) {
    sort.split(',').forEach(field => {
      const sortOrder = field.startsWith('-') ? -1 : 1;
      const fieldName = field.replace(/^-/, '');
      sortBy[fieldName] = sortOrder;
    });
  } else {
    // Default sorting
    sortBy = { createdAt: -1 };
  }

  // Parse field selection
  let select = {};
  if (fields) {
    fields.split(',').forEach(field => {
      select[field] = 1;
    });
  }

  return {
    page,
    limit,
    skip,
    sort: sortBy,
    select: Object.keys(select).length > 0 ? select : null,
    query: { ...query, page: undefined, limit: undefined, sort: undefined, fields: undefined }
  };
};

/**
 * Generate pagination metadata
 * @param {number} total - Total number of documents
 * @param {number} page - Current page
 * @param {number} limit - Number of items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Format paginated response
 * @param {Array} data - Array of documents
 * @param {Object} meta - Pagination metadata
 * @returns {Object} Formatted paginated response
 */
const formatPaginatedResponse = (data, meta) => ({
  success: true,
  count: data.length,
  pagination: {
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.totalPages,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,
    nextPage: meta.nextPage,
    prevPage: meta.prevPage
  },
  data
});

/**
 * Middleware to handle pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const paginationMiddleware = (req, res, next) => {
  // Get pagination params from query
  const { page, limit, skip, sort, select } = getPaginationParams(req.query);
  
  // Add pagination to request object
  req.pagination = {
    page,
    limit,
    skip,
    sort,
    select
  };
  
  // Clean up query params
  req.query = { ...req.query, page: undefined, limit: undefined, sort: undefined, fields: undefined };
  
  next();
};

module.exports = {
  getPaginationParams,
  getPaginationMeta,
  formatPaginatedResponse,
  paginationMiddleware
};
