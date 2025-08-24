/**
 * Authentication Routes
 * Defines API endpoints for user and service provider authentication
 * Handles registration, login, and expertise category retrieval
 */

const express = require('express');
const router = express.Router();

// Import controller and validation middleware
const AuthController = require('../controllers/authController');
const {
  validateUserRegistration,
  validateServiceProviderRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors
} = require('../middleware/validation');

// ===== AUTHENTICATION ROUTES =====

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { firstName, lastName, email, password, phoneNumber, address, postcode }
 * Response: { message, userId }
 */
router.post('/register', 
  validateUserRegistration,           // Validate input data
  handleValidationErrors,             // Handle validation errors
  AuthController.registerUser         // Process registration
);

/**
 * Register a new service provider
 * POST /api/auth/register-provider
 * Body: { firstName, lastName, email, password, phoneNumber, address, postcode, expertise, businessBio }
 * Response: { message, serviceProviderId }
 */
router.post('/register-provider', 
  validateServiceProviderRegistration, // Validate input data
  handleValidationErrors,              // Handle validation errors
  AuthController.registerServiceProvider // Process registration
);

/**
 * Login user or service provider
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { token, user/serviceProvider }
 */
router.post('/login', 
  validateLogin,                      // Validate input data
  handleValidationErrors,             // Handle validation errors
  AuthController.login                // Process login
);

/**
 * Get all available expertise categories
 * GET /api/auth/expertise-categories
 * Response: { categories: Array<string> }
 */
router.get('/expertise-categories', 
  AuthController.getExpertiseCategories // Return expertise categories
);

/**
 * Send forgot password email
 * POST /api/auth/forgot-password
 * Body: { email }
 * Response: { message }
 */
router.post('/forgot-password',
  validateForgotPassword,      // Validate email
  handleValidationErrors,      // Handle validation errors
  AuthController.forgotPassword // Send forgot password email
);

/**
 * Reset password using token
 * POST /api/auth/reset-password
 * Body: { token, newPassword, userType }
 * Response: { message }
 */
router.post('/reset-password',
  validateResetPassword,       // Validate input data
  handleValidationErrors,      // Handle validation errors
  AuthController.resetPassword // Reset password
);

// Export the router
module.exports = router;
