/**
 * User Controller
 * Handles HTTP requests for user profile management
 * Manages user profile retrieval, updates, and deletion
 */

const UserService = require('../services/userService');

/**
 * User Controller Class
 * Contains all user-related HTTP request handlers
 */
class UserController {
  
  /**
   * Get current user's profile
   * GET /api/users/profile
   * @param {Object} req - Express request object (contains user info from auth middleware)
   * @param {Object} res - Express response object
   */
  static async getUserProfile(req, res) {
    try {
      // Get user profile using ID from authenticated request
      const user = await UserService.getUserById(req.userId);
      
      // Return user profile data
      res.status(200).json({ user });
    } catch (error) {
      // Handle user not found error
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  }

  /**
   * Update current user's profile
   * PUT /api/users/profile
   * @param {Object} req - Express request object (contains user info and update data)
   * @param {Object} res - Express response object
   */
  static async updateUserProfile(req, res) {
    try {
      // Update user profile using ID from authenticated request and request body data
      const updatedUser = await UserService.updateUser(req.userId, req.body);
      
      // Return success response with updated user data
      res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      // Handle user not found error
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error updating user profile' });
    }
  }

  /**
   * Delete current user's account
   * DELETE /api/users/profile
   * @param {Object} req - Express request object (contains user info)
   * @param {Object} res - Express response object
   */
  static async deleteUser(req, res) {
    try {
      // Delete user account using ID from authenticated request
      const result = await UserService.deleteUser(req.userId);
      
      // Return success message
      res.status(200).json(result);
    } catch (error) {
      // Handle user not found error
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  /**
   * Get user by ID (for admin purposes)
   * GET /api/users/:id
   * @param {Object} req - Express request object (contains user ID in params)
   * @param {Object} res - Express response object
   */
  static async getUserById(req, res) {
    try {
      // Get user profile using ID from request parameters
      const user = await UserService.getUserById(req.params.id);
      
      // Return user profile data
      res.status(200).json({ user });
    } catch (error) {
      // Handle user not found error
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  /**
   * Get all users in the system (for admin purposes)
   * GET /api/users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllUsers(req, res) {
    try {
      // Get all users from the system
      const users = await UserService.getAllUsers();
      
      // Return array of all users
      res.status(200).json({ users });
    } catch (error) {
      // Handle errors with 500 status
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
}

// Export the UserController class
module.exports = UserController;
