const xss = require('xss');
const { ALLOWED_HTML_TAGS, ALLOWED_HTML_ATTR } = require('../config/constants');

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The HTML string to sanitize
 * @param {Object} options - Additional options for XSS filtering
 * @returns {string} Sanitized HTML
 */
const sanitizeHTML = (dirty, options = {}) => {
  if (!dirty) return '';
  
  const defaultOptions = {
    whiteList: options.whiteList || ALLOWED_HTML_TAGS,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
    ...options
  };

  return xss(dirty, defaultOptions);
};

/**
 * Sanitize a plain text string by escaping HTML special characters
 * @param {string} str - The string to escape
 * @returns {string} Escaped string
 */
const escapeHTML = (str) => {
  if (!str) return '';
  
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize an object's string values recursively
 * @param {Object|Array} obj - The object or array to sanitize
 * @param {boolean} escape - Whether to escape HTML (true) or sanitize HTML (false)
 * @returns {Object|Array} Sanitized object or array
 */
const sanitizeObject = (obj, escape = true) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, escape));
  }

  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      sanitized[key] = escape ? escapeHTML(value) : sanitizeHTML(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, escape);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Middleware to sanitize request body, query, and params
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const sanitizeRequest = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body, false);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query, true);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params, true);
  }

  next();
};

module.exports = {
  sanitizeHTML,
  escapeHTML,
  sanitizeObject,
  sanitizeRequest
};
