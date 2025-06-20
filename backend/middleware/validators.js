const { check, validationResult } = require('express-validator');
const { ErrorResponse } = require('../utils/errorResponse');

// Custom validation result formatter
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  
  return next(new ErrorResponse('Validation failed', 400, {
    errors: extractedErrors
  }));
};

// User validation rules
const userValidationRules = {
  register: [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  
  login: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  
  updateDetails: [
    check('name', 'Name is required').optional().not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').optional().isEmail().normalizeEmail()
  ],
  
  updatePassword: [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ]
};

// Quiz validation rules
const quizValidationRules = {
  create: [
    check('title', 'Title is required').not().isEmpty().trim().escape(),
    check('description', 'Description is required').not().isEmpty().trim().escape(),
    check('category', 'Category is required').not().isEmpty().trim().escape(),
    check('difficulty', 'Difficulty must be easy, medium, or hard').isIn(['easy', 'medium', 'hard']),
    check('timeLimit', 'Time limit must be a positive number').optional().isInt({ min: 30 }),
    check('questions', 'Questions must be an array').isArray({ min: 1 }),
    check('questions.*.question', 'Question text is required').not().isEmpty().trim().escape(),
    check('questions.*.options', 'At least 2 options are required').isArray({ min: 2 }),
    check('questions.*.options.*.text', 'Option text is required').not().isEmpty().trim().escape(),
    check('questions.*.correctAnswer', 'Correct answer index is required').isInt({ min: 0 })
  ],
  
  update: [
    check('title', 'Title is required').optional().not().isEmpty().trim().escape(),
    check('description', 'Description is required').optional().not().isEmpty().trim().escape(),
    check('category', 'Category is required').optional().not().isEmpty().trim().escape(),
    check('difficulty', 'Difficulty must be easy, medium, or hard').optional().isIn(['easy', 'medium', 'hard']),
    check('timeLimit', 'Time limit must be a positive number').optional().isInt({ min: 30 }),
    check('questions', 'Questions must be an array').optional().isArray({ min: 1 })
  ],
  
  submit: [
    check('answers', 'Answers must be an array').isArray({ min: 1 }),
    check('answers.*.questionId', 'Question ID is required').isMongoId(),
    check('answers.*.selectedOption', 'Selected option is required').isInt({ min: 0 }),
    check('answers.*.timeTaken', 'Time taken is required').isInt({ min: 0 })
  ]
};

// User management validation rules (admin)
const userManagementValidationRules = {
  create: [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role must be either user or admin').isIn(['user', 'admin'])
  ],
  
  update: [
    check('name', 'Name is required').optional().not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
    check('role', 'Role must be either user or admin').optional().isIn(['user', 'admin'])
  ]
};

// Pagination and filtering validation
const paginationValidation = [
  check('page', 'Page must be a positive integer').optional().isInt({ min: 1 }).toInt(),
  check('limit', 'Limit must be a positive integer').optional().isInt({ min: 1, max: 100 }).toInt(),
  check('sort', 'Invalid sort field').optional().trim().escape(),
  check('fields', 'Invalid field selection').optional().trim().escape()
];

module.exports = {
  validate,
  userValidationRules,
  quizValidationRules,
  userManagementValidationRules,
  paginationValidation
};
