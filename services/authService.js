/**
 * Authentication Service
 * Handles user and service provider authentication business logic
 * Manages JWT token generation and user verification
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const emailService = require('./emailService');

/**
 * Authentication Service Class
 * Contains all authentication-related business logic
 */
class AuthService {
  
  /**
   * Generate JWT token for authenticated users
   * @param {string} userId - The user's ID to encode in the token
   * @returns {string} - JWT token string
   */
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * Register a new user in the system
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.lastName - User's last name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password (will be hashed)
   * @param {string} userData.phoneNumber - User's phone number
   * @param {string} userData.address - User's address
   * @param {string} userData.postcode - User's postcode
   * @returns {Promise<Object>} - Registration result with message and userId
   * @throws {Error} - If user already exists or validation fails
   */
  static async registerUser(userData) {
    try {
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user instance and save to database
      const user = new User(userData);
      await user.save();

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Return success response
      return {
        message: 'User registered successfully',
        userId: user._id
      };
    } catch (error) {
      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  /**
   * Register a new service provider in the system
   * @param {Object} providerData - Service provider registration data
   * @param {string} providerData.firstName - Provider's first name
   * @param {string} providerData.lastName - Provider's last name
   * @param {string} providerData.email - Provider's email address
   * @param {string} providerData.password - Provider's password (will be hashed)
   * @param {string} providerData.phoneNumber - Provider's phone number
   * @param {string} providerData.address - Provider's address
   * @param {string} providerData.postcode - Provider's postcode
   * @param {Array<string>} providerData.expertise - Provider's expertise categories
   * @param {string} providerData.businessBio - Provider's business description
   * @returns {Promise<Object>} - Registration result with message and serviceProviderId
   * @throws {Error} - If service provider already exists or validation fails
   */
  static async registerServiceProvider(providerData) {
    try {
      // Check if service provider with this email already exists
      const existingProvider = await ServiceProvider.findOne({ email: providerData.email });
      if (existingProvider) {
        throw new Error('Service provider with this email already exists');
      }

      // Create new service provider instance and save to database
      const serviceProvider = new ServiceProvider(providerData);
      await serviceProvider.save();

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(serviceProvider);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Return success response
      return {
        message: 'Service provider registered successfully',
        serviceProviderId: serviceProvider._id
      };
    } catch (error) {
      // Handle MongoDB duplicate key errors
      if (error.code === 11000) {
        throw new Error('Service provider with this email already exists');
      }
      throw error;
    }
  }

  /**
   * Authenticate user or service provider login
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Login result with token and user/serviceProvider data
   * @throws {Error} - If credentials are invalid
   */
  static async login(email, password) {
    try {
      // Try to find user in users collection first
      let user = await User.findOne({ email });
      let userType = 'user';

      // If not found in users, try service providers collection
      if (!user) {
        user = await ServiceProvider.findOne({ email });
        userType = 'serviceProvider';
      }

      // If no user found in either collection, throw error
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password using bcrypt comparison
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token for successful authentication
      const token = this.generateToken(user._id);

      // Return token, user type, and user data (password excluded via toJSON method)
      return {
        token,
        userType,
        [userType]: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all available expertise categories for service providers
   * @returns {Array<string>} - Array of expertise category names
   */
  static getExpertiseCategories() {
    return ServiceProvider.getExpertiseCategories();
  }

  /**
   * Generate password reset token and send forgot password email
   * @param {string} email - User's email address
   * @returns {Promise<Object>} - Result with message
   * @throws {Error} - If user not found
   */
  static async forgotPassword(email) {
    try {
      // Try to find user in users collection first
      let user = await User.findOne({ email });
      let userType = 'user';

      // If not found in users, try service providers collection
      if (!user) {
        user = await ServiceProvider.findOne({ email });
        userType = 'serviceProvider';
      }

      // If no user found in either collection, throw error
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

              // Generate reset URL - pointing to the API with reset parameters
        const resetUrl = `${process.env.API_URL || 'http://localhost:3000'}?reset=true&token=${resetToken}&type=${userType}`;

      // Send forgot password email
      await emailService.sendForgotPasswordEmail(user, resetToken, resetUrl);

      return {
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password using reset token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @param {string} userType - Type of user ('user' or 'serviceProvider')
   * @returns {Promise<Object>} - Result with message
   * @throws {Error} - If token invalid or expired
   */
  static async resetPassword(token, newPassword, userType) {
    try {
      // Select the appropriate model based on user type
      const Model = userType === 'serviceProvider' ? ServiceProvider : User;

      // Find user with valid reset token
      const user = await Model.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return {
        message: 'Password reset successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export the AuthService class
module.exports = AuthService;
