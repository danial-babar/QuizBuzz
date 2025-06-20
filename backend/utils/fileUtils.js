const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const { ENV, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config/constants');
const { ErrorResponse } = require('./errorResponse');

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);
const readdirAsync = promisify(fs.readdir);

/**
 * Generate a unique filename with extension
 * @param {string} originalname - Original filename
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  return `${uuidv4()}${ext}`;
};

/**
 * Validate file type
 * @param {string} mimetype - File MIME type
 * @returns {boolean} True if file type is allowed
 */
const isValidFileType = (mimetype) => {
  return ALLOWED_FILE_TYPES.includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @returns {boolean} True if file size is within limits
 */
const isValidFileSize = (size) => {
  return size <= MAX_FILE_SIZE;
};

/**
 * Get file extension from MIME type
 * @param {string} mimetype - File MIME type
 * @returns {string} File extension with dot (e.g., '.jpg')
 */
const getFileExtension = (mimetype) => {
  const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  };
  return extMap[mimetype] || '';
};

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath - Directory path
 * @returns {Promise<void>}
 */
const ensureDirectoryExists = async (dirPath) => {
  try {
    await statAsync(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdirAsync(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
};

/**
 * Save file to disk
 * @param {Object} file - File object with buffer and originalname
 * @param {string} destination - Destination directory
 * @returns {Promise<Object>} File information
 */
const saveFile = async (file, destination) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const { buffer, originalname, mimetype, size } = file;

    // Validate file type
    if (!isValidFileType(mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }

    // Validate file size
    if (!isValidFileSize(size)) {
      throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Ensure destination directory exists
    await ensureDirectoryExists(destination);

    // Generate unique filename
    const filename = generateUniqueFilename(originalname);
    const filepath = path.join(destination, filename);

    // Write file to disk
    await fs.promises.writeFile(filepath, buffer);

    // Return file information
    return {
      filename,
      originalname,
      mimetype,
      size,
      path: filepath,
      url: `${ENV.CLIENT_URL}/uploads/${filename}`,
    };
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
};

/**
 * Delete file from disk
 * @param {string} filepath - Path to the file
 * @returns {Promise<boolean>} True if file was deleted
 */
const deleteFile = async (filepath) => {
  try {
    if (!filepath) return true;
    
    const fullPath = path.isAbsolute(filepath) 
      ? filepath 
      : path.join(process.cwd(), filepath);
    
    try {
      await statAsync(fullPath);
    } catch (error) {
      // File doesn't exist
      return true;
    }
    
    await unlinkAsync(fullPath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filepath}:`, error);
    return false;
  }
};

/**
 * Get file stats
 * @param {string} filepath - Path to the file
 * @returns {Promise<Object>} File stats
 */
const getFileStats = async (filepath) => {
  try {
    return await statAsync(filepath);
  } catch (error) {
    throw new Error(`File not found: ${filepath}`);
  }
};

/**
 * List files in a directory
 * @param {string} dirPath - Directory path
 * @returns {Promise<Array>} List of files
 */
const listFiles = async (dirPath) => {
  try {
    await ensureDirectoryExists(dirPath);
    return await readdirAsync(dirPath);
  } catch (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

/**
 * Read file as base64
 * @param {string} filepath - Path to the file
 * @returns {Promise<string>} Base64 encoded file content
 */
const readFileAsBase64 = async (filepath) => {
  try {
    const data = await fs.promises.readFile(filepath);
    return data.toString('base64');
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
};

module.exports = {
  generateUniqueFilename,
  isValidFileType,
  isValidFileSize,
  getFileExtension,
  ensureDirectoryExists,
  saveFile,
  deleteFile,
  getFileStats,
  listFiles,
  readFileAsBase64,
};
