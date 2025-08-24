/**
 * Service Provider Service
 * Handles service provider-related business logic and database operations
 * Provides CRUD operations and expertise-based queries for service providers
 */

const ServiceProvider = require('../models/ServiceProvider');

/**
 * Service Provider Service Class
 * Contains all service provider-related business logic
 */
class ServiceProviderService {
  
  /**
   * Get service provider by ID
   * @param {string} providerId - The service provider's unique identifier
   * @returns {Promise<Object>} - Service provider object without password
   * @throws {Error} - If service provider not found
   */
  static async getServiceProviderById(providerId) {
    try {
      // Find service provider by ID in the database
      const serviceProvider = await ServiceProvider.findById(providerId);
      
      // Check if service provider exists
      if (!serviceProvider) {
        throw new Error('Service provider not found');
      }
      
      return serviceProvider;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service provider profile information
   * @param {string} providerId - The service provider's unique identifier
   * @param {Object} updateData - Object containing fields to update
   * @param {string} [updateData.firstName] - Provider's first name
   * @param {string} [updateData.lastName] - Provider's last name
   * @param {string} [updateData.phoneNumber] - Provider's phone number
   * @param {string} [updateData.address] - Provider's address
   * @param {string} [updateData.postcode] - Provider's postcode
   * @param {Array<string>} [updateData.expertise] - Provider's expertise categories
   * @param {string} [updateData.businessBio] - Provider's business description
   * @returns {Promise<Object>} - Updated service provider object without password
   * @throws {Error} - If service provider not found or validation fails
   */
  static async updateServiceProvider(providerId, updateData) {
    try {
      // Find and update service provider with new data
      // new: true returns the updated document
      // runValidators: true ensures validation runs on update
      const serviceProvider = await ServiceProvider.findByIdAndUpdate(
        providerId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // Check if service provider exists
      if (!serviceProvider) {
        throw new Error('Service provider not found');
      }

      return serviceProvider;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete service provider account permanently
   * @param {string} providerId - The service provider's unique identifier
   * @returns {Promise<Object>} - Success message
   * @throws {Error} - If service provider not found
   */
  static async deleteServiceProvider(providerId) {
    try {
      // Find and delete service provider from database
      const serviceProvider = await ServiceProvider.findByIdAndDelete(providerId);
      
      // Check if service provider existed
      if (!serviceProvider) {
        throw new Error('Service provider not found');
      }
      
      return { message: 'Service provider deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all service providers in the system (for admin purposes)
   * @returns {Promise<Array>} - Array of all service providers without passwords
   * @throws {Error} - If database operation fails
   */
  static async getAllServiceProviders() {
    try {
      // Find all service providers and exclude password field from results
      const serviceProviders = await ServiceProvider.find({}).select('-password');
      return serviceProviders;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service providers by specific expertise category
   * Useful for finding providers with particular skills
   * @param {string} expertise - The expertise category to search for
   * @returns {Promise<Array>} - Array of service providers with matching expertise
   * @throws {Error} - If database operation fails
   */
  static async getServiceProvidersByExpertise(expertise) {
    try {
      // Find service providers that have the specified expertise
      // $in operator matches any value in the expertise array
      const serviceProviders = await ServiceProvider.find({
        expertise: { $in: [expertise] }
      }).select('-password');
      
      return serviceProviders;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all available expertise categories
   * Used for populating dropdown menus and validation
   * @returns {Array<string>} - Array of all expertise category names
   */
  static getExpertiseCategories() {
    return ServiceProvider.getExpertiseCategories();
  }
}

// Export the ServiceProviderService class
module.exports = ServiceProviderService;
