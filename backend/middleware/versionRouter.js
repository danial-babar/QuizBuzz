const express = require('express');
const { versionedRoute } = require('../utils/apiVersion');

/**
 * Create a versioned router
 * @param {Object} versions - Object mapping versions to route handlers
 * @returns {Function} Express router
 */
const createVersionedRouter = (versions) => {
  const router = express.Router();
  
  // Add all HTTP methods to the router
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'all'];
  
  methods.forEach(method => {
    const originalMethod = router[method].bind(router);
    
    // Override the method to handle versioning
    router[method] = function(path, ...handlers) {
      // Create a route handler that processes versioning
      const versionedHandler = (req, res, next) => {
        const version = req.apiVersion;
        const versionHandlers = {};
        
        // Map versions to their respective handlers
        Object.entries(versions).forEach(([v, handler]) => {
          versionHandlers[v] = handler;
        });
        
        // Use the versioned route handler
        versionedRoute(versionHandlers)(req, res, next);
      };
      
      // Apply any additional middleware and the versioned handler
      originalMethod(path, ...handlers, versionedHandler);
      return router;
    };
  });
  
  return router;
};

/**
 * Middleware to handle versioned API routes
 * @param {string} basePath - Base path for the API (e.g., '/api')
 * @returns {Function} Express middleware function
 */
const versionedApiRouter = (basePath = '/api') => {
  return (req, res, next) => {
    // Check if the request path starts with the base path
    if (!req.path.startsWith(basePath)) {
      return next();
    }
    
    // Extract the version from the URL (e.g., /api/v1/... -> v1)
    const pathParts = req.path.split('/');
    const versionIndex = pathParts.findIndex(part => part === 'v1' || part === 'v2' || part === 'v3');
    
    if (versionIndex !== -1) {
      const version = pathParts[versionIndex];
      const versionNumber = version.replace('v', '');
      
      // Remove the version from the path
      pathParts.splice(versionIndex, 1);
      req.url = pathParts.join('/') || '/';
      
      // Set the API version in the request
      req.apiVersion = versionNumber + '.0.0';
    }
    
    next();
  };
};

module.exports = {
  createVersionedRouter,
  versionedApiRouter
};
