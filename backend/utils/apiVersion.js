const semver = require('semver');
const { API_VERSIONS, DEFAULT_API_VERSION } = require('../config/constants');

/**
 * Get the latest API version
 * @returns {string} Latest API version
 */
const getLatestVersion = () => {
  return API_VERSIONS[API_VERSIONS.length - 1];
};

/**
 * Check if a version is supported
 * @param {string} version - Version to check
 * @returns {boolean} True if version is supported
 */
const isVersionSupported = (version) => {
  return API_VERSIONS.some(v => semver.eq(v, version));
};

/**
 * Get the best matching API version based on the request
 * @param {string} requestedVersion - Requested API version
 * @returns {string} Best matching API version
 */
const getBestMatchVersion = (requestedVersion) => {
  if (!requestedVersion) return DEFAULT_API_VERSION;
  
  // If exact match exists, return it
  if (isVersionSupported(requestedVersion)) {
    return requestedVersion;
  }
  
  // Try to find the highest version that satisfies the requested version
  const matchedVersion = semver.maxSatisfying(API_VERSIONS, requestedVersion);
  
  return matchedVersion || DEFAULT_API_VERSION;
};

/**
 * Middleware to handle API versioning
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const apiVersionMiddleware = (req, res, next) => {
  // Get version from Accept header (e.g., application/vnd.quizbuzz.v1+json)
  const acceptHeader = req.get('Accept') || '';
  const versionMatch = acceptHeader.match(/application\/vnd\.quizbuzz\.(v\d+(\.\d+){0,2})\+json/);
  
  // Get version from URL parameter
  const urlVersion = req.params.apiVersion;
  
  // Get version from query parameter
  const queryVersion = req.query.v;
  
  // Priority: URL param > Query param > Accept header > Default
  let requestedVersion = urlVersion || queryVersion || (versionMatch ? versionMatch[1] : null);
  
  // If no version specified, use default
  if (!requestedVersion) {
    req.apiVersion = DEFAULT_API_VERSION;
    return next();
  }
  
  // Normalize version (add patch version if missing)
  if (requestedVersion.match(/^v\d+$/)) {
    requestedVersion += '.0.0';
  } else if (requestedVersion.match(/^v\d+\.\d+$/)) {
    requestedVersion += '.0';
  }
  
  // Get best matching version
  const matchedVersion = getBestMatchVersion(requestedVersion);
  
  // Add version to request object
  req.apiVersion = matchedVersion;
  
  // Add version to response headers
  res.set('API-Version', matchedVersion);
  
  // If requested version doesn't match exactly, add a warning header
  if (requestedVersion !== matchedVersion) {
    res.set('Warning', `299 - "Version ${requestedVersion} not found, using ${matchedVersion}"`);
  }
  
  next();
};

/**
 * Route wrapper to handle version-specific routes
 * @param {Object} versions - Object mapping versions to route handlers
 * @returns {Function} Express middleware function
 */
const versionedRoute = (versions) => {
  return (req, res, next) => {
    const version = req.apiVersion;
    const handler = versions[version] || versions[DEFAULT_API_VERSION];
    
    if (handler) {
      return handler(req, res, next);
    }
    
    // No handler for this version
    const error = new Error(`API version ${version} not implemented for this route`);
    error.status = 501; // Not Implemented
    next(error);
  };
};

module.exports = {
  getLatestVersion,
  isVersionSupported,
  getBestMatchVersion,
  apiVersionMiddleware,
  versionedRoute
};
