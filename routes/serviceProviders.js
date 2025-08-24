/**
 * Service Provider Routes
 * Defines API endpoints for service provider profile management
 * Includes expertise-based queries and admin operations
 */

const express = require('express');
const router = express.Router();

// Import controller and middleware
const ServiceProviderController = require('../controllers/serviceProviderController');
const { auth, isServiceProvider } = require('../middleware/auth');
const {
  validateServiceProviderUpdate,
  handleValidationErrors
} = require('../middleware/validation');

// ===== SERVICE PROVIDER PROFILE ROUTES (AUTHENTICATED) =====

/**
 * Get current service provider's profile
 * GET /api/service-providers/profile
 * Headers: Authorization: Bearer <token>
 * Response: { serviceProvider }
 */
router.get('/profile', 
  auth,                                      // Verify JWT token
  isServiceProvider,                         // Ensure user is service provider
  ServiceProviderController.getServiceProviderProfile // Return service provider profile
);

/**
 * Update current service provider's profile
 * PUT /api/service-providers/profile
 * Headers: Authorization: Bearer <token>
 * Body: { firstName?, lastName?, phoneNumber?, address?, postcode?, expertise?, businessBio? }
 * Response: { message, serviceProvider }
 */
router.put('/profile', 
  auth,                                      // Verify JWT token
  isServiceProvider,                         // Ensure user is service provider
  validateServiceProviderUpdate,             // Validate update data
  handleValidationErrors,                    // Handle validation errors
  ServiceProviderController.updateServiceProviderProfile // Update service provider profile
);

/**
 * Delete current service provider's account
 * DELETE /api/service-providers/profile
 * Headers: Authorization: Bearer <token>
 * Response: { message }
 */
router.delete('/profile', 
  auth,                                      // Verify JWT token
  isServiceProvider,                         // Ensure user is service provider
  ServiceProviderController.deleteServiceProvider // Delete service provider account
);

// ===== EXPERTISE-BASED ROUTES =====

/**
 * Get all available expertise categories
 * GET /api/service-providers/expertise/categories
 * Response: { categories: Array<string> }
 */
router.get('/expertise/categories', 
  ServiceProviderController.getExpertiseCategories // Return expertise categories
);

/**
 * Get service providers by specific expertise category
 * GET /api/service-providers/expertise/:expertise
 * Response: { serviceProviders }
 */
router.get('/expertise/:expertise', 
  ServiceProviderController.getServiceProvidersByExpertise // Return service providers by expertise
);

// ===== ADMIN ROUTES (AUTHENTICATED) =====

/**
 * Get service provider by ID (for admin purposes)
 * GET /api/service-providers/:id
 * Headers: Authorization: Bearer <token>
 * Response: { serviceProvider }
 */
router.get('/:id', 
  auth,                                      // Verify JWT token
  ServiceProviderController.getServiceProviderById // Return service provider by ID
);

/**
 * Get all service providers (for admin purposes)
 * GET /api/service-providers
 * Headers: Authorization: Bearer <token>
 * Response: { serviceProviders }
 */
router.get('/', 
  auth,                                      // Verify JWT token
  ServiceProviderController.getAllServiceProviders // Return all service providers
);

// Export the router
module.exports = router;
