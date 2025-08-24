/**
 * Service Provider Controller
 * Handles HTTP requests for service provider profile management
 * Manages service provider profile operations and expertise-based queries
 */

const ServiceProviderService = require('../services/serviceProviderService');

/**
 * Service Provider Controller Class
 * Contains all service provider-related HTTP request handlers
 */
class ServiceProviderController {
  
  /**
   * Get current service provider's profile
   * GET /api/service-providers/profile
   * @param {Object} req - Express request object (contains user info from auth middleware)
   * @param {Object} res - Express response object
   */
  static async getServiceProviderProfile(req, res) {
    try {
      // Get service provider profile using ID from authenticated request
      const serviceProvider = await ServiceProviderService.getServiceProviderById(req.userId);
      
      // Return service provider profile data
      res.status(200).json({ serviceProvider });
    } catch (error) {
      // Handle service provider not found error
      if (error.message === 'Service provider not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error fetching service provider profile' });
    }
  }

  /**
   * Update current service provider's profile
   * PUT /api/service-providers/profile
   * @param {Object} req - Express request object (contains user info and update data)
   * @param {Object} res - Express response object
   */
  static async updateServiceProviderProfile(req, res) {
    try {
      // Update service provider profile using ID from authenticated request and request body data
      const updatedServiceProvider = await ServiceProviderService.updateServiceProvider(req.userId, req.body);
      
      // Return success response with updated service provider data
      res.status(200).json({
        message: 'Service provider profile updated successfully',
        serviceProvider: updatedServiceProvider
      });
    } catch (error) {
      // Handle service provider not found error
      if (error.message === 'Service provider not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error updating service provider profile' });
    }
  }

  /**
   * Delete current service provider's account
   * DELETE /api/service-providers/profile
   * @param {Object} req - Express request object (contains user info)
   * @param {Object} res - Express response object
   */
  static async deleteServiceProvider(req, res) {
    try {
      // Delete service provider account using ID from authenticated request
      const result = await ServiceProviderService.deleteServiceProvider(req.userId);
      
      // Return success message
      res.status(200).json(result);
    } catch (error) {
      // Handle service provider not found error
      if (error.message === 'Service provider not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error deleting service provider' });
    }
  }

  /**
   * Get service provider by ID (for admin purposes)
   * GET /api/service-providers/:id
   * @param {Object} req - Express request object (contains provider ID in params)
   * @param {Object} res - Express response object
   */
  static async getServiceProviderById(req, res) {
    try {
      // Get service provider profile using ID from request parameters
      const serviceProvider = await ServiceProviderService.getServiceProviderById(req.params.id);
      
      // Return service provider profile data
      res.status(200).json({ serviceProvider });
    } catch (error) {
      // Handle service provider not found error
      if (error.message === 'Service provider not found') {
        return res.status(404).json({ message: error.message });
      }
      
      // Handle other errors with 500 status
      res.status(500).json({ message: 'Error fetching service provider' });
    }
  }

  /**
   * Get all service providers in the system (for admin purposes)
   * GET /api/service-providers
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllServiceProviders(req, res) {
    try {
      // Get all service providers from the system
      const serviceProviders = await ServiceProviderService.getAllServiceProviders();
      
      // Return array of all service providers
      res.status(200).json({ serviceProviders });
    } catch (error) {
      // Handle errors with 500 status
      res.status(500).json({ message: 'Error fetching service providers' });
    }
  }

  /**
   * Get service providers by specific expertise category
   * GET /api/service-providers/expertise/:expertise
   * @param {Object} req - Express request object (contains expertise in params)
   * @param {Object} res - Express response object
   */
  static async getServiceProvidersByExpertise(req, res) {
    try {
      // Extract expertise category from request parameters
      const { expertise } = req.params;
      
      // Get service providers with matching expertise
      const serviceProviders = await ServiceProviderService.getServiceProvidersByExpertise(expertise);
      
      // Return array of matching service providers
      res.status(200).json({ serviceProviders });
    } catch (error) {
      // Handle errors with 500 status
      res.status(500).json({ message: 'Error fetching service providers by expertise' });
    }
  }

  /**
   * Get all available expertise categories
   * GET /api/service-providers/expertise/categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getExpertiseCategories(req, res) {
    try {
      // Get all expertise categories from the service
      const categories = ServiceProviderService.getExpertiseCategories();
      
      // Return array of expertise categories
      res.status(200).json({ categories });
    } catch (error) {
      // Handle errors with 500 status
      res.status(500).json({ message: 'Error fetching expertise categories' });
    }
  }
}

// Export the ServiceProviderController class
module.exports = ServiceProviderController;
