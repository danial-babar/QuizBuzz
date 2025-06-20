const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { ErrorResponse } = require('./errorResponse');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

// Middleware to handle file upload
const uploadFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorResponse('File size too large. Maximum 5MB allowed.', 400));
      }
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(err.message, 500));
    }
    
    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    next();
  });
};

// Function to delete a file
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '../public', filePath);
  
  // Check if file exists before trying to delete
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
