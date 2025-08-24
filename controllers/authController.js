/**
 * Authentication Controller
 * Handles HTTP requests for user and service provider authentication
 * Manages registration, login, and expertise category retrieval
 */

const AuthService = require('../services/authService');

/**
 * Authentication Controller Class
 * Contains all authentication-related HTTP request handlers
 */
class AuthController {
  
  /**
   * Register a new user
   * POST /api/auth/register
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async registerUser(req, res) {
    try {
      // Call service to register user with request body data
      const result = await AuthService.registerUser(req.body);
      
      // Return success response with 201 status (Created)
      res.status(201).json(result);
    } catch (error) {
      // Handle specific error for existing user
      if (error.message.includes('already exists')) {
        return res.status(400).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  /**
   * Register a new service provider
   * POST /api/auth/register-provider
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async registerServiceProvider(req, res) {
    try {
      // Call service to register service provider with request body data
      const result = await AuthService.registerServiceProvider(req.body);
      
      // Return success response with 201 status (Created)
      res.status(201).json(result);
    } catch (error) {
      // Handle specific error for existing service provider
      if (error.message.includes('already exists')) {
        return res.status(400).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error registering service provider' });
    }
  }

  /**
   * Login user or service provider
   * POST /api/auth/login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async login(req, res) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
      
      // Call service to authenticate user
      const result = await AuthService.login(email, password);
      
      // Return success response with token and user data
      res.status(200).json(result);
    } catch (error) {
      // Handle authentication errors
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error during login' });
    }
  }

  /**
   * Get all available expertise categories
   * GET /api/auth/expertise-categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getExpertiseCategories(req, res) {
    try {
      // Call service to get expertise categories
      const categories = AuthService.getExpertiseCategories();
      
      // Return categories in response
      res.status(200).json({ categories });
    } catch (error) {
      // Handle errors with 500 status
      res.status(500).json({ message: 'Error fetching expertise categories' });
    }
  }

  /**
   * Send forgot password email
   * POST /api/auth/forgot-password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      // Call service to send forgot password email
      const result = await AuthService.forgotPassword(email);
      
      // Return success response
      res.status(200).json(result);
    } catch (error) {
      // Handle specific error for user not found
      if (error.message.includes('No account found')) {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error sending forgot password email' });
    }
  }

  /**
   * Reset password using token
   * POST /api/auth/reset-password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword, userType } = req.body;
      
      // Call service to reset password
      const result = await AuthService.resetPassword(token, newPassword, userType);
      
      // Return success response
      res.status(200).json(result);
    } catch (error) {
      // Handle specific error for invalid token
      if (error.message.includes('Invalid or expired')) {
        return res.status(400).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error resetting password' });
    }
  }
}

// Export the AuthController class
module.exports = AuthController;
