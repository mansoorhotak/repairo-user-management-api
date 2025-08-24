/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 * Provides role-based access control for users and service providers
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

/**
 * Main authentication middleware
 * Verifies JWT token and attaches user information to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token format)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify JWT token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find user in users collection first
    let user = await User.findById(decoded.userId);
    let userType = 'user';
    
    // If user not found, try service providers collection
    if (!user) {
      user = await ServiceProvider.findById(decoded.userId);
      userType = 'serviceProvider';
      
      // If neither user nor service provider found, token is invalid
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }
    }

    // Attach user information to request object for use in route handlers
    req.user = user;
    req.userType = userType;
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    // Handle other errors
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Middleware to restrict access to service providers only
 * Must be used after the main auth middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isServiceProvider = (req, res, next) => {
  if (req.userType !== 'serviceProvider') {
    return res.status(403).json({ message: 'Access denied. Service provider only.' });
  }
  next();
};

/**
 * Middleware to restrict access to regular users only
 * Must be used after the main auth middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isUser = (req, res, next) => {
  if (req.userType !== 'user') {
    return res.status(403).json({ message: 'Access denied. User only.' });
  }
  next();
};

// Export middleware functions
module.exports = { auth, isServiceProvider, isUser };
