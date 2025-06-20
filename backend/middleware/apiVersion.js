const { API_VERSIONS, DEFAULT_API_VERSION } = require('../config/constants');
const { getBestMatchVersion } = require('../utils/apiVersion');

/**
 * Middleware to handle API versioning via headers
 * Extracts version from Accept header or custom header and sets it on the request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const apiVersionMiddleware = (req, res, next) => {
  // Default to the latest version
  let version = DEFAULT_API_VERSION;
  
  // Check for version in Accept header (e.g., application/vnd.quizbuzz.v1+json)
  const acceptHeader = req.get('Accept') || '';
  const acceptMatch = acceptHeader.match(/application\/vnd\.quizbuzz\.(v\d+(\.\d+){0,2})\+json/);
  
  if (acceptMatch && acceptMatch[1]) {
    version = acceptMatch[1].replace('v', '');
  } 
  // Check for version in custom header (X-API-Version)
  else if (req.headers['x-api-version']) {
    version = req.headers['x-api-version'];
  }
  // Check for version in query parameter
  else if (req.query.api_version) {
    version = req.query.api_version;
  }
  
  // Get the best matching version
  const matchedVersion = getBestMatchVersion(version);
  
  // Set version on request object
  req.apiVersion = matchedVersion;
  
  // Add version to response headers
  res.set('X-API-Version', `v${matchedVersion}`);
  
  // If requested version doesn't match exactly, add a warning header
  if (version !== matchedVersion) {
    res.set('Warning', `299 - "Version ${version} not found, using v${matchedVersion}"`);
  }
  
  next();
};

/**
 * Route handler for versioned routes
 * @param {Object} versions - Object mapping version numbers to route handlers
 * @returns {Function} Express middleware function
 */
const versionedRoute = (versions) => {
  return (req, res, next) => {
    const version = req.apiVersion;
    const handler = versions[version] || versions[DEFAULT_API_VERSION];
    
    if (typeof handler === 'function') {
      return handler(req, res, next);
    }
    
    // No handler for this version
    const error = new Error(`API version ${version} not implemented for this route`);
    error.status = 501; // Not Implemented
    next(error);
  };
};

/**
 * Middleware to require a specific API version
 * @param {string|string[]} requiredVersions - Required API version(s)
 * @returns {Function} Express middleware function
 */
const requireApiVersion = (requiredVersions) => {
  const versions = Array.isArray(requiredVersions) ? requiredVersions : [requiredVersions];
  
  return (req, res, next) => {
    if (!versions.includes(req.apiVersion)) {
      const error = new Error(`This endpoint requires API version(s): ${versions.join(', ')}`);
      error.status = 400; // Bad Request
      return next(error);
    }
    next();
  };
};

module.exports = {
  apiVersionMiddleware,
  versionedRoute,
  requireApiVersion,
};
