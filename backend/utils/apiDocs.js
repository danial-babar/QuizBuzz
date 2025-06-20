const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerJsdoc = require('swagger-jsdoc');
const { ENV, API_VERSIONS } = require('../config/constants');

/**
 * Load OpenAPI specification from a YAML file
 * @param {string} filePath - Path to the YAML file
 * @returns {Object} Parsed OpenAPI specification
 */
const loadOpenAPISpec = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    throw new Error(`Failed to load OpenAPI specification: ${error.message}`);
  }
};

/**
 * Generate OpenAPI specification from JSDoc comments
 * @param {Object} options - Swagger JSDoc options
 * @returns {Object} OpenAPI specification
 */
const generateOpenAPISpec = (options) => {
  try {
    return swaggerJsdoc(options);
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    throw new Error(`Failed to generate OpenAPI specification: ${error.message}`);
  }
};

/**
 * Get the OpenAPI specification for a specific API version
 * @param {string} version - API version (e.g., '1.0.0')
 * @returns {Object} OpenAPI specification for the specified version
 */
const getOpenAPISpec = (version = '1.0.0') => {
  const versionDir = `v${version.split('.')[0]}`;
  const specPath = path.join(__dirname, '..', 'api', versionDir, 'openapi.yaml');
  
  try {
    return loadOpenAPISpec(specPath);
  } catch (error) {
    console.warn(`No OpenAPI spec found for version ${version}, falling back to generated spec`);
    
    // Fall back to generating the spec from JSDoc comments
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: `QuizBuzz API v${version}`, 
          version,
          description: 'QuizBuzz API Documentation',
          contact: {
            name: 'QuizBuzz Support',
            email: 'support@quizbuzz.com',
          },
        },
        servers: [
          {
            url: `${ENV.API_URL || 'http://localhost:5000'}/api/${versionDir}`,
            description: `${ENV.NODE_ENV || 'Development'} server`,
          },
        ],
      },
      apis: [
        path.join(__dirname, '..', 'routes', '**', '*.js'),
        path.join(__dirname, '..', 'models', '**', '*.js'),
      ],
    };
    
    return generateOpenAPISpec(options);
  }
};

/**
 * Get the latest OpenAPI specification
 * @returns {Object} Latest OpenAPI specification
 */
const getLatestOpenAPISpec = () => {
  return getOpenAPISpec(API_VERSIONS[API_VERSIONS.length - 1]);
};

/**
 * Get OpenAPI specifications for all API versions
 * @returns {Object} Object mapping versions to their OpenAPI specifications
 */
const getAllOpenAPISpecs = () => {
  const specs = {};
  
  API_VERSIONS.forEach(version => {
    try {
      specs[version] = getOpenAPISpec(version);
    } catch (error) {
      console.error(`Error loading OpenAPI spec for version ${version}:`, error);
    }
  });
  
  return specs;
};

/**
 * Serve OpenAPI UI for API documentation
 * @param {Object} app - Express app
 * @param {string} [route='/api-docs'] - Route path for the API docs
 */
const serveOpenAPIUI = (app, route = '/api-docs') => {
  const swaggerUi = require('swagger-ui-express');
  
  // Serve UI for all versions
  API_VERSIONS.forEach(version => {
    const versionRoute = `${route}/v${version.split('.')[0]}`;
    const spec = getOpenAPISpec(version);
    
    app.use(versionRoute, swaggerUi.serve, swaggerUi.setup(spec, {
      explorer: true,
      customSiteTitle: `QuizBuzz API v${version} Documentation`,
      customCss: '.swagger-ui .topbar { display: none }',
    }));
  });
  
  // Redirect root to latest version
  app.get(route, (req, res) => {
    const latestVersion = API_VERSIONS[API_VERSIONS.length - 1];
    res.redirect(`${route}/v${latestVersion.split('.')[0]}`);
  });
};

module.exports = {
  loadOpenAPISpec,
  generateOpenAPISpec,
  getOpenAPISpec,
  getLatestOpenAPISpec,
  getAllOpenAPISpecs,
  serveOpenAPIUI,
};
