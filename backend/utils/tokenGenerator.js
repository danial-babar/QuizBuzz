const crypto = require('crypto');
const { promisify } = require('util');

// Convert crypto.randomBytes to use promises
const randomBytes = promisify(crypto.randomBytes);

/**
 * Generate a cryptographically secure random token
 * @param {number} [bytes=32] - Number of bytes to generate (default: 32)
 * @returns {Promise<string>} - A promise that resolves to a hex-encoded token
 */
const generateToken = async (bytes = 32) => {
  const buffer = await randomBytes(bytes);
  return buffer.toString('hex');
};

/**
 * Generate a reset token and its hashed version for database storage
 * @returns {Object} An object containing the plain token and hashed token
 */
const generateResetToken = async () => {
  // Generate a random token
  const resetToken = await generateToken(32);
  
  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return {
    resetToken,
    hashedToken
  };
};

/**
 * Generate an email verification token and its hashed version for database storage
 * @returns {Object} An object containing the plain token and hashed token
 */
const generateEmailVerificationToken = async () => {
  // Generate a random token
  const verificationToken = await generateToken(32);
  
  // Hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return {
    verificationToken,
    hashedToken
  };
};

/**
 * Generate a JWT secret key
 * @returns {string} A base64url-encoded random string suitable for JWT secret
 */
const generateJwtSecret = () => {
  return crypto.randomBytes(64).toString('base64')
    .replace(/\+/g, '-')  // Replace '+' with '-'
    .replace(/\//g, '_')  // Replace '/' with '_'
    .replace(/=+$/, '');  // Remove trailing '='
};

module.exports = {
  generateToken,
  generateResetToken,
  generateEmailVerificationToken,
  generateJwtSecret
};
