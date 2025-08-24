/**
 * Service Provider Model
 * Mongoose schema for service providers in the RepairO system
 * Extends user functionality with expertise categories and business information
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Predefined expertise categories for service providers
 * These categories help customers find providers with specific skills
 */
const EXPERTISE_CATEGORIES = [
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
];

/**
 * Service Provider Schema Definition
 * Extends user schema with service provider specific fields
 */
const serviceProviderSchema = new mongoose.Schema({
  // Service provider's first name - required field with length validation
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true, // Remove whitespace
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  // Service provider's last name - required field with length validation
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  // Service provider's email address - unique identifier with email validation
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no duplicate emails
    lowercase: true, // Convert to lowercase
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Service provider's password - will be hashed before saving
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // Service provider's phone number - required for contact information
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Service provider's physical address - required for service location
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  
  // Service provider's postal code - required for service area
  postcode: {
    type: String,
    required: [true, 'Postcode is required'],
    trim: true
  },
  
  // Service provider's areas of expertise - array of predefined categories
  expertise: {
    type: [String],
    required: [true, 'At least one expertise category is required'],
    validate: {
      validator: function(expertise) {
        // Ensure at least one expertise is selected and all are valid categories
        return expertise.length > 0 && expertise.every(exp => EXPERTISE_CATEGORIES.includes(exp));
      },
      message: 'Expertise must contain valid categories from the predefined list'
    }
  },
  
  // Service provider's business description - helps customers understand services
  businessBio: {
    type: String,
    required: [true, 'Business bio is required'],
    trim: true,
    maxlength: [500, 'Business bio cannot exceed 500 characters']
  },
  
  // Password reset token for forgot password functionality
  resetPasswordToken: {
    type: String,
    default: null
  },
  
  // Password reset token expiry
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true
});

// ===== MIDDLEWARE FUNCTIONS =====

/**
 * Pre-save middleware to hash password before saving
 * Only hashes password if it has been modified
 */
serviceProviderSchema.pre('save', async function(next) {
  // Skip password hashing if password hasn't been modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt with 10 rounds for security
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ===== INSTANCE METHODS =====

/**
 * Compare password method
 * Compares a candidate password with the stored hashed password
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
serviceProviderSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Convert service provider document to JSON without password
 * Ensures password is never sent in API responses
 * @returns {Object} - Service provider object without password field
 */
serviceProviderSchema.methods.toJSON = function() {
  const serviceProvider = this.toObject();
  delete serviceProvider.password; // Remove password from response
  return serviceProvider;
};

// ===== STATIC METHODS =====

/**
 * Get all available expertise categories
 * Used for populating dropdown menus and validation
 * @returns {Array<string>} - Array of all expertise categories
 */
serviceProviderSchema.statics.getExpertiseCategories = function() {
  return EXPERTISE_CATEGORIES;
};

// Export the ServiceProvider model
module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
