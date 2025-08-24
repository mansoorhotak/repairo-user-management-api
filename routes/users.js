/**
 * User Routes
 * Defines API endpoints for user profile management
 * All routes require JWT authentication
 */

const express = require('express');
const router = express.Router();

// Import controller and middleware
const UserController = require('../controllers/userController');
const { auth, isUser } = require('../middleware/auth');
const {
  validateUserUpdate,
  handleValidationErrors
} = require('../middleware/validation');

// ===== USER PROFILE ROUTES (AUTHENTICATED) =====

/**
 * Get current user's profile
 * GET /api/users/profile
 * Headers: Authorization: Bearer <token>
 * Response: { user }
 */
router.get('/profile', 
  auth,                              // Verify JWT token
  isUser,                            // Ensure user is regular user (not service provider)
  UserController.getUserProfile       // Return user profile
);

/**
 * Update current user's profile
 * PUT /api/users/profile
 * Headers: Authorization: Bearer <token>
 * Body: { firstName?, lastName?, phoneNumber?, address?, postcode? }
 * Response: { message, user }
 */
router.put('/profile', 
  auth,                              // Verify JWT token
  isUser,                            // Ensure user is regular user
  validateUserUpdate,                // Validate update data
  handleValidationErrors,            // Handle validation errors
  UserController.updateUserProfile    // Update user profile
);

/**
 * Delete current user's account
 * DELETE /api/users/profile
 * Headers: Authorization: Bearer <token>
 * Response: { message }
 */
router.delete('/profile', 
  auth,                              // Verify JWT token
  isUser,                            // Ensure user is regular user
  UserController.deleteUser           // Delete user account
);

// ===== ADMIN ROUTES (AUTHENTICATED) =====

/**
 * Get user by ID (for admin purposes)
 * GET /api/users/:id
 * Headers: Authorization: Bearer <token>
 * Response: { user }
 */
router.get('/:id', 
  auth,                              // Verify JWT token
  UserController.getUserById          // Return user by ID
);

/**
 * Get all users (for admin purposes)
 * GET /api/users
 * Headers: Authorization: Bearer <token>
 * Response: { users }
 */
router.get('/', 
  auth,                              // Verify JWT token
  UserController.getAllUsers          // Return all users
);

// Export the router
module.exports = router;
