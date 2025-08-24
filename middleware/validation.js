/**
 * Validation Middleware
 * Provides comprehensive input validation using express-validator
 * Ensures data integrity and security for all API endpoints
 */

const { body, validationResult } = require('express-validator');

// ===== VALIDATION RULES =====

/**
 * Validation rules for user registration
 * Ensures all required fields are present and properly formatted
 */
const validateUserRegistration = [
  // First name validation
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1 and 50 characters'),
  
  // Last name validation
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1 and 50 characters'),
  
  // Email validation with normalization
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  // Password validation
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  // Phone number validation
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  
  // Address validation
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  // Postcode validation
  body('postcode')
    .trim()
    .notEmpty()
    .withMessage('Postcode is required')
];

/**
 * Validation rules for service provider registration
 * Includes all user validation plus expertise and business bio
 */
const validateServiceProviderRegistration = [
  // First name validation
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1 and 50 characters'),
  
  // Last name validation
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1 and 50 characters'),
  
  // Email validation with normalization
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  // Password validation
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  // Phone number validation
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  
  // Address validation
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  // Postcode validation
  body('postcode')
    .trim()
    .notEmpty()
    .withMessage('Postcode is required'),
  
  // Expertise validation - must be array with at least one item
  body('expertise')
    .isArray({ min: 1 })
    .withMessage('At least one expertise category is required'),
  
  // Expertise categories validation - must be from predefined list
  body('expertise.*')
    .isIn([
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Roofing',
      'Painting & Decorating',
      'Flooring & Tiling',
      'Appliance Repair',
      'Handyman Services',
      'Locksmith & Security',
      'HVAC & Heating',
      'Gardening & Landscaping',
      'Cleaning Services'
    ])
    .withMessage('Invalid expertise category'),
  
  // Business bio validation
  body('businessBio')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Business bio is required and must be between 1 and 500 characters')
];

/**
 * Validation rules for login
 * Ensures email and password are provided
 */
const validateLogin = [
  // Email validation
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  // Password validation
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for forgot password
 * Ensures email is provided and valid
 */
const validateForgotPassword = [
  // Email validation
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

/**
 * Validation rules for reset password
 * Ensures token, new password, and user type are provided
 */
const validateResetPassword = [
  // Token validation
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  // New password validation
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  
  // User type validation
  body('userType')
    .isIn(['user', 'serviceProvider'])
    .withMessage('User type must be either "user" or "serviceProvider"')
];

/**
 * Validation rules for user profile updates
 * All fields are optional but must be valid if provided
 */
const validateUserUpdate = [
  // First name validation (optional)
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  // Last name validation (optional)
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  // Phone number validation (optional)
  body('phoneNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  
  // Address validation (optional)
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),
  
  // Postcode validation (optional)
  body('postcode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Postcode cannot be empty')
];

/**
 * Validation rules for service provider profile updates
 * Includes all user update validation plus expertise and business bio
 */
const validateServiceProviderUpdate = [
  // First name validation (optional)
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  // Last name validation (optional)
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  // Phone number validation (optional)
  body('phoneNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  
  // Address validation (optional)
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),
  
  // Postcode validation (optional)
  body('postcode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Postcode cannot be empty'),
  
  // Expertise validation (optional)
  body('expertise')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one expertise category is required'),
  
  // Expertise categories validation (optional)
  body('expertise.*')
    .optional()
    .isIn([
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Roofing',
      'Painting & Decorating',
      'Flooring & Tiling',
      'Appliance Repair',
      'Handyman Services',
      'Locksmith & Security',
      'HVAC & Heating',
      'Gardening & Landscaping',
      'Cleaning Services'
    ])
    .withMessage('Invalid expertise category'),
  
  // Business bio validation (optional)
  body('businessBio')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Business bio must be between 1 and 500 characters')
];

// ===== ERROR HANDLING =====

/**
 * Middleware to handle validation errors
 * Collects all validation errors and returns them in a structured format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  // Get all validation errors from the request
  const errors = validationResult(req);
  
  // If there are validation errors, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  // If no errors, continue to the next middleware
  next();
};

// Export all validation functions
module.exports = {
  validateUserRegistration,
  validateServiceProviderRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUserUpdate,
  validateServiceProviderUpdate,
  handleValidationErrors
};
