const redis = require('redis');
const { promisify } = require('util');
const logger = require('./logger');

class Cache {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis server connection refused');
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined; // End reconnecting with built in error
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      },
    });

    // Promisify Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.flushdbAsync = promisify(this.client.flushdb).bind(this.client);
    this.quitAsync = promisify(this.client.quit).bind(this.client);

    // Handle Redis connection events
    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });
  }

  /**
   * Get a value from cache by key
   * @param {string} key - Cache key
   * @returns {Promise<*>} - Cached value or null if not found
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache (will be stringified)
   * @param {number} [ttl=3600] - Time to live in seconds (default: 1 hour)
   * @returns {Promise<boolean>} - True if successful
   */
  async set(key, value, ttl = 3600) {
    try {
      const stringValue = JSON.stringify(value);
      await this.setAsync(key, stringValue, 'EX', ttl);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} - True if successful
   */
  async del(key) {
    try {
      await this.delAsync(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all keys in the current database
   * @returns {Promise<boolean>} - True if successful
   */
  async clear() {
    try {
      await this.flushdbAsync();
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Close the Redis connection
   * @returns {Promise<void>}
   */
  async close() {
    try {
      await this.quitAsync();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }

  /**
   * Generate a cache key from a request object
   * @param {Object} req - Express request object
   * @returns {string} - Generated cache key
   */
  static generateCacheKey(req) {
    const path = req.originalUrl || req.url;
    const query = JSON.stringify(req.query);
    const body = req.body && Object.keys(req.body).length > 0 
      ? JSON.stringify(req.body) 
      : '';
    return `${req.method}:${path}:${query}:${body}`;
  }
}

// Create a singleton instance
const cache = new Cache();

// Handle process termination
process.on('SIGINT', async () => {
  await cache.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cache.close();
  process.exit(0);
});

module.exports = cache;
