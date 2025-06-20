const { API_VERSIONS } = require('../config/constants');

/**
 * Middleware to mark an endpoint as deprecated
 * @param {Object} options - Deprecation options
 * @param {string} options.since - Version when the endpoint was deprecated (e.g., '1.0.0')
 * @param {string} [options.removal] - Version when the endpoint will be removed (optional)
 * @param {string} [options.alternative] - Alternative endpoint to use (optional)
 * @param {string} [options.link] - URL with more information (optional)
 * @returns {Function} Express middleware function
 */
const deprecated = (options = {}) => {
  const { since, removal, alternative, link } = options;
  
  if (!since) {
    throw new Error('Deprecation version (since) is required');
  }

  return (req, res, next) => {
    // Add deprecation header
    let deprecationHeader = `deprecated; since="${since}"`;
    
    if (removal) {
      deprecationHeader += `; removal="${removal}"`;
    }
    
    res.set('Deprecation', deprecationHeader);
    
    // Add link header if provided
    if (link) {
      let linkHeader = `</${link.replace(/^\//, '')}>; rel="deprecation"`;
      
      if (alternative) {
        linkHeader += `, </${alternative.replace(/^\//, '')}>; rel="alternate"`;
      }
      
      res.set('Link', linkHeader);
    }
    
    // Add warning header
    let warningMessage = `299 - "This endpoint is deprecated since version ${since}"`;
    
    if (removal) {
      warningMessage += ` and will be removed in version ${removal}`;
    }
    
    if (alternative) {
      warningMessage += `. Please use ${alternative} instead.`;
    }
    
    res.set('Warning', warningMessage);
    
    next();
  };
};

/**
 * Middleware to check for sunset headers for removed endpoints
 * @param {Object} options - Sunset options
 * @param {string} options.removedIn - Version when the endpoint was removed (e.g., '2.0.0')
 * @param {string} [options.alternative] - Alternative endpoint to use (required if endpoint is removed)
 * @param {string} [options.link] - URL with more information (optional)
 * @returns {Function} Express middleware function
 */
const sunset = (options = {}) => {
  const { removedIn, alternative, link } = options;
  
  if (!removedIn) {
    throw new Error('Removal version (removedIn) is required');
  }
  
  return (req, res, next) => {
    // Add Sunset header (RFC 8594)
    const sunsetDate = new Date();
    sunsetDate.setFullYear(sunsetDate.getFullYear() + 1); // Default to 1 year from now
    
    res.set('Sunset', sunsetDate.toUTCString());
    
    // Add Link header with sunset information
    let linkHeader = '';
    
    if (alternative) {
      linkHeader += `</${alternative.replace(/^\//, '')}>; rel="alternate"`;
    }
    
    if (link) {
      if (linkHeader) linkHeader += ', ';
      linkHeader += `</${link.replace(/^\//, '')}>; rel="sunset"; type="text/html"`;
    }
    
    if (linkHeader) {
      res.set('Link', linkHeader);
    }
    
    // Add warning header
    let warningMessage = `299 - "This endpoint was removed in version ${removedIn}`;
    
    if (alternative) {
      warningMessage += `. Please use ${alternative} instead.`;
    } else {
      warningMessage += ' and is no longer available.';
    }
    
    res.set('Warning', warningMessage);
    
    // Send 410 Gone status for removed endpoints
    return res.status(410).json({
      success: false,
      error: {
        code: 'ENDPOINT_REMOVED',
        message: `This endpoint was removed in version ${removedIn}`,
        ...(alternative && { alternative }),
        ...(link && { info: link })
      }
    });
  };
};

/**
 * Middleware to check if an endpoint is still available in the requested API version
 * @param {Object} options - Version check options
 * @param {string} options.removedIn - Version when the endpoint was/will be removed (e.g., '2.0.0')
 * @param {string} [options.alternative] - Alternative endpoint to use (optional)
 * @returns {Function} Express middleware function
 */
const checkApiVersion = (options = {}) => {
  const { removedIn, alternative } = options;
  
  if (!removedIn) {
    throw new Error('Removal version (removedIn) is required');
  }
  
  return (req, res, next) => {
    const requestedVersion = req.apiVersion || API_VERSIONS[0];
    
    // Check if the requested version is greater than or equal to the removal version
    const isRemoved = API_VERSIONS.indexOf(removedIn) <= API_VERSIONS.indexOf(requestedVersion);
    
    if (isRemoved) {
      // Endpoint is removed in this version, send 410 Gone
      return sunset({ removedIn, alternative })(req, res, next);
    }
    
    // Endpoint is still available, but might be deprecated
    const removalIndex = API_VERSIONS.indexOf(removedIn);
    const currentIndex = API_VERSIONS.indexOf(requestedVersion);
    const versionsUntilRemoval = removalIndex - currentIndex;
    
    if (versionsUntilRemoval <= 2) { // Warn if removal is in the next 2 versions
      const warningMessage = `299 - "This endpoint is deprecated and will be removed in version ${removedIn}` +
        (alternative ? `. Please use ${alternative} instead.` : '');
      
      res.set('Warning', warningMessage);
      res.set('Deprecation', `deprecated; removal="${removedIn}"`);
      
      if (alternative) {
        res.set('Link', `</${alternative.replace(/^\//, '')}>; rel="alternate"`);
      }
    }
    
    next();
  };
};

module.exports = {
  deprecated,
  sunset,
  checkApiVersion,
};
