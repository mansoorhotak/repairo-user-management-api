/**
 * User Service
 * Handles user-related business logic and database operations
 * Provides CRUD operations for user management
 */

const User = require('../models/User');

/**
 * User Service Class
 * Contains all user-related business logic
 */
class UserService {
  
  /**
   * Get user by ID
   * @param {string} userId - The user's unique identifier
   * @returns {Promise<Object>} - User object without password
   * @throws {Error} - If user not found
   */
  static async getUserById(userId) {
    try {
      // Find user by ID in the database
      const user = await User.findById(userId);
      
      // Check if user exists
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile information
   * @param {string} userId - The user's unique identifier
   * @param {Object} updateData - Object containing fields to update
   * @param {string} [updateData.firstName] - User's first name
   * @param {string} [updateData.lastName] - User's last name
   * @param {string} [updateData.phoneNumber] - User's phone number
   * @param {string} [updateData.address] - User's address
   * @param {string} [updateData.postcode] - User's postcode
   * @returns {Promise<Object>} - Updated user object without password
   * @throws {Error} - If user not found or validation fails
   */
  static async updateUser(userId, updateData) {
    try {
      // Find and update user with new data
      // new: true returns the updated document
      // runValidators: true ensures validation runs on update
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // Check if user exists
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user account permanently
   * @param {string} userId - The user's unique identifier
   * @returns {Promise<Object>} - Success message
   * @throws {Error} - If user not found
   */
  static async deleteUser(userId) {
    try {
      // Find and delete user from database
      const user = await User.findByIdAndDelete(userId);
      
      // Check if user existed
      if (!user) {
        throw new Error('User not found');
      }
      
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users in the system (for admin purposes)
   * @returns {Promise<Array>} - Array of all users without passwords
   * @throws {Error} - If database operation fails
   */
  static async getAllUsers() {
    try {
      // Find all users and exclude password field from results
      const users = await User.find({}).select('-password');
      return users;
    } catch (error) {
      throw error;
    }
  }
}

// Export the UserService class
module.exports = UserService;
