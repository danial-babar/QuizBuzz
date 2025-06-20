const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { ErrorResponse } = require('./errorResponse');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

/**
 * Upload a file to Google Cloud Storage
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder path in the bucket (e.g., 'avatars', 'quiz-images')
 * @returns {Promise<Object>} - Public URL and file metadata
 */
const uploadFile = (file, folder = '') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Generate a unique filename
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${folder}/${uuidv4()}${ext}`;
    
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    blobStream.on('error', (err) => {
      reject(new Error(`Unable to upload file: ${err.message}`));
    });

    blobStream.on('finish', () => {
      // Make the file public
      blob.makePublic()
        .then(() => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve({
            url: publicUrl,
            filename: blob.name,
            contentType: file.mimetype,
            size: file.size,
          });
        })
        .catch(err => {
          reject(new Error(`Error making file public: ${err.message}`));
        });
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Delete a file from Google Cloud Storage
 * @param {string} filename - The filename in the bucket
 * @returns {Promise<boolean>} - True if deleted successfully
 */
const deleteFile = async (filename) => {
  try {
    if (!filename) {
      throw new Error('No filename provided');
    }

    await bucket.file(filename).delete();
    return true;
  } catch (error) {
    // If the file doesn't exist, we consider it a success
    if (error.code === 404) {
      return true;
    }
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

/**
 * Get a signed URL for a file (for temporary access to private files)
 * @param {string} filename - The filename in the bucket
 * @param {number} expiresIn - Expiration time in seconds (default: 15 minutes)
 * @returns {Promise<string>} - Signed URL
 */
const getSignedUrl = async (filename, expiresIn = 15 * 60) => {
  try {
    if (!filename) {
      throw new Error('No filename provided');
    }

    const [url] = await bucket.file(filename).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  } catch (error) {
    throw new Error(`Error generating signed URL: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getSignedUrl,
};
