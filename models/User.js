/**
 * User Model
 * Mongoose schema for regular users in the RepairO system
 * Handles user registration, authentication, and profile management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents
 */
const userSchema = new mongoose.Schema({
  // User's first name - required field with length validation
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true, // Remove whitespace
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  // User's last name - required field with length validation
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  // User's email address - unique identifier with email validation
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no duplicate emails
    lowercase: true, // Convert to lowercase
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // User's password - will be hashed before saving
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // User's phone number - required for contact information
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // User's physical address - required for service location
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  
  // User's postal code - required for service area
  postcode: {
    type: String,
    required: [true, 'Postcode is required'],
    trim: true
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
userSchema.pre('save', async function(next) {
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
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Convert user document to JSON without password
 * Ensures password is never sent in API responses
 * @returns {Object} - User object without password field
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // Remove password from response
  return user;
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
