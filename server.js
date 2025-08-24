/**
 * RepairO Builder User Management Microservice
 * Main server file for the Express.js application
 * Handles server setup, middleware configuration, and route registration
 */

// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceProviderRoutes = require('./routes/serviceProviders');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE CONFIGURATION =====

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON payloads in request bodies
app.use(express.json());

// Parse URL-encoded payloads in request bodies
app.use(express.urlencoded({ extended: true }));

// ===== DATABASE CONNECTION =====

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// ===== ROUTE REGISTRATION =====

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RepairO User Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      serviceProviders: '/api/service-providers'
    },
    documentation: 'API endpoints for user and service provider management'
  });
});

// Register API routes with their respective prefixes
app.use('/api/auth', authRoutes);           // Authentication routes
app.use('/api/users', userRoutes);          // User management routes
app.use('/api/service-providers', serviceProviderRoutes); // Service provider routes



// ===== ERROR HANDLING MIDDLEWARE =====

// Global error handler for unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ===== SERVER STARTUP =====

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}`);
});
