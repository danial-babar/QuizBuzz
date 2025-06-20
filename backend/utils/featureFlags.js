const { API_VERSIONS } = require('../config/constants');

/**
 * Feature flag configuration
 * Each feature can have:
 * - enabled: Boolean or function that returns boolean
 * - description: Description of the feature
 * - enabledForVersions: Array of API versions where this feature is enabled
 * - enabledForRoles: Array of user roles that can access this feature
 */
const FEATURE_FLAGS = {
  // Example feature flags
  QUIZ_ANALYTICS: {
    enabled: true,
    description: 'Enable detailed quiz analytics',
    enabledForVersions: ['1.1.0', '2.0.0'],
    enabledForRoles: ['admin', 'premium']
  },
  
  USER_ACHIEVEMENTS: {
    enabled: true,
    description: 'Enable user achievements system',
    enabledForVersions: ['1.0.0', '1.1.0', '2.0.0']
  },
  
  ADVANCED_QUIZ_EDITOR: {
    enabled: false, // Disabled by default
    description: 'Enable advanced quiz editor with rich text and media support',
    enabledForVersions: ['2.0.0'],
    enabledForRoles: ['admin', 'creator']
  },
  
  // Add more feature flags as needed
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @param {Object} context - Context object with user and request info
 * @returns {boolean} True if the feature is enabled for the given context
 */
const isFeatureEnabled = (featureName, context = {}) => {
  const feature = FEATURE_FLAGS[featureName];
  
  if (!feature) {
    console.warn(`Feature flag '${featureName}' not found`);
    return false;
  }
  
  // If feature is explicitly disabled
  if (feature.enabled === false) {
    return false;
  }
  
  // If feature is explicitly enabled and no version/role restrictions
  if (feature.enabled === true && 
      !feature.enabledForVersions && 
      !feature.enabledForRoles) {
    return true;
  }
  
  const { user = null, apiVersion = null } = context;
  
  // Check version restrictions
  if (feature.enabledForVersions && apiVersion) {
    const versionMatch = feature.enabledForVersions.some(v => 
      v === apiVersion || 
      (v.endsWith('.0') && apiVersion.startsWith(v.split('.')[0] + '.'))
    );
    
    if (!versionMatch) {
      return false;
    }
  }
  
  // Check role restrictions
  if (feature.enabledForRoles && user && user.role) {
    const hasRequiredRole = feature.enabledForRoles.includes(user.role);
    if (!hasRequiredRole) {
      return false;
    }
  }
  
  // If feature has a custom enabled function
  if (typeof feature.enabled === 'function') {
    return feature.enabled(context);
  }
  
  return !!feature.enabled;
};

/**
 * Middleware to check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {Function} Express middleware function
 */
const requireFeature = (featureName) => {
  return (req, res, next) => {
    const isEnabled = isFeatureEnabled(featureName, {
      user: req.user,
      apiVersion: req.apiVersion,
      req
    });
    
    if (!isEnabled) {
      const error = new Error(`Feature '${featureName}' is not available`);
      error.status = 403; // Forbidden
      return next(error);
    }
    
    next();
  };
};

/**
 * Get all enabled features for the current context
 * @param {Object} context - Context object with user and request info
 * @returns {Object} Object with feature flags and their enabled status
 */
const getEnabledFeatures = (context = {}) => {
  const enabledFeatures = {};
  
  Object.entries(FEATURE_FLAGS).forEach(([name, config]) => {
    enabledFeatures[name] = isFeatureEnabled(name, context);
  });
  
  return enabledFeatures;
};

/**
 * Middleware to add enabled features to the response locals
 * @returns {Function} Express middleware function
 */
const addFeaturesToLocals = () => {
  return (req, res, next) => {
    res.locals.features = getEnabledFeatures({
      user: req.user,
      apiVersion: req.apiVersion,
      req
    });
    next();
  };
};

module.exports = {
  FEATURE_FLAGS,
  isFeatureEnabled,
  requireFeature,
  getEnabledFeatures,
  addFeaturesToLocals,
};
