// Security constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_RESET_TOKEN_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds
export const EMAIL_VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per window per IP

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 1 day
};

// Allowed file upload MIME types
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed HTML tags and attributes for rich text content
export const ALLOWED_HTML_TAGS = {
  a: ['href', 'title', 'target', 'rel'],
  b: [],
  blockquote: ['cite'],
  br: [],
  code: [],
  del: [],
  em: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  hr: [],
  i: [],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  strong: [],
  sub: [],
  sup: [],
  table: [],
  tbody: [],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
  thead: [],
  tr: [],
  ul: [],
};

export const ALLOWED_HTML_ATTR = ['href', 'title', 'target', 'rel', 'colspan', 'rowspan'];

// Quiz constants
export const QUIZ_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];
export const QUIZ_DEFAULT_TIME_LIMIT = 300; // 5 minutes in seconds
export const QUIZ_MIN_QUESTIONS = 1;
export const QUIZ_MAX_QUESTIONS = 100;
export const QUIZ_OPTIONS_MIN = 2;
export const QUIZ_OPTIONS_MAX = 10;

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Achievement types
export const ACHIEVEMENT_TYPES = {
  QUIZ_TAKEN: 'quiz_taken',
  HIGH_SCORE: 'high_score',
  PERFECT_SCORE: 'perfect_score',
  CATEGORY_MASTER: 'category_master',
  EARLY_ADOPTER: 'early_adopter',
  STREAK: 'streak',
};

// Notification types
export const NOTIFICATION_TYPES = {
  QUIZ_ATTEMPTED: 'quiz_attempted',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  NEW_QUIZ_AVAILABLE: 'new_quiz_available',
  QUIZ_INVITATION: 'quiz_invitation',
  SYSTEM_ALERT: 'system_alert',
};

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Not authorized to access this route',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  QUIZ_NOT_FOUND: 'Quiz not found',
  RESOURCE_NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  INVALID_TOKEN: 'Invalid or expired token',
  EMAIL_ALREADY_EXISTS: 'Email is already in use',
  INVALID_EMAIL: 'Please provide a valid email',
  INVALID_PASSWORD: 'Password must be at least 8 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  ACCOUNT_LOCKED: 'Account is locked. Please try again later or reset your password',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
};

// Success messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  QUIZ_CREATED: 'Quiz created successfully',
  QUIZ_UPDATED: 'Quiz updated successfully',
  QUIZ_DELETED: 'Quiz deleted successfully',
  QUIZ_SUBMITTED: 'Quiz submitted successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFICATION_SENT: 'Verification email sent',
  EMAIL_VERIFIED: 'Email verified successfully',
};

// API Versioning
export const API_VERSIONS = ['1.0.0', '1.1.0', '2.0.0']; // Add new versions here as they're released
export const DEFAULT_API_VERSION = '1.0.0';

// Environment variables with defaults
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/quizbuzz',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30, // days
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@quizbuzz.com',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  GOOGLE_CLOUD_STORAGE_BUCKET: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

// Export all constants as default
export default {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RESET_TOKEN_EXPIRY,
  EMAIL_VERIFICATION_TOKEN_EXPIRY,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_WINDOW,
  CACHE_TTL,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  ALLOWED_HTML_TAGS,
  ALLOWED_HTML_ATTR,
  QUIZ_DIFFICULTY_LEVELS,
  QUIZ_DEFAULT_TIME_LIMIT,
  QUIZ_MIN_QUESTIONS,
  QUIZ_MAX_QUESTIONS,
  QUIZ_OPTIONS_MIN,
  QUIZ_OPTIONS_MAX,
  USER_ROLES,
  ACHIEVEMENT_TYPES,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENV,
};
