# RepairO - User Management API

A comprehensive Node.js + Express.js API for user and service provider management in the RepairO project. Features JWT authentication, MongoDB integration, and RESTful API endpoints.

## 🚀 Features

- **User Management**: Register, login, profile management for regular users
- **Service Provider Management**: Specialized registration and management for service providers
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **Input Validation**: Comprehensive validation using express-validator
- **RESTful API**: Clean, well-structured API endpoints
- **Expertise Categories**: Predefined service categories for providers
- **Profile Management**: View, edit, and delete user accounts
- **Email Integration**: Welcome emails and forgot password functionality using SendPulse API
- **Error Handling**: Proper HTTP status codes and error messages

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UserManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create a .env file with your settings
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/repairo_users
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   SMTP_USER=your_gmail_address@gmail.com
   SMTP_PASS=your_gmail_app_password
   SENDER_NAME=RepairO Team
   API_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the API**
   - API Base URL: http://localhost:3000
   - API Documentation: http://localhost:3000

## 🏗️ Project Structure

```
UserManagement/
├── models/
│   ├── User.js                 # User model with Mongoose schema
│   └── ServiceProvider.js      # Service provider model
├── controllers/
│   ├── authController.js       # Authentication logic
│   ├── userController.js       # User management
│   └── serviceProviderController.js # Service provider management
├── services/
│   ├── authService.js          # Authentication business logic
│   ├── userService.js          # User business logic
│   ├── serviceProviderService.js # Service provider business logic
│   └── emailService.js         # Email functionality using SendPulse API
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── users.js                # User routes
│   └── serviceProviders.js     # Service provider routes
├── middleware/
│   ├── auth.js                 # JWT authentication middleware
│   └── validation.js           # Input validation middleware

├── server.js                   # Main server file
├── package.json                # Dependencies and scripts
├── config.env                  # Environment variables
└── README.md                   # This file
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/register-provider` | Register a new service provider | No |
| POST | `/api/auth/login` | Login user or service provider | No |
| POST | `/api/auth/forgot-password` | Send forgot password email | No |
| POST | `/api/auth/reset-password` | Reset password using token | No |
| GET | `/api/auth/expertise-categories` | Get expertise categories | No |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| DELETE | `/api/users/profile` | Delete user account | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| GET | `/api/users` | Get all users | Yes |

### Service Provider Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/service-providers/profile` | Get service provider profile | Yes |
| PUT | `/api/service-providers/profile` | Update service provider profile | Yes |
| DELETE | `/api/service-providers/profile` | Delete service provider account | Yes |
| GET | `/api/service-providers/:id` | Get service provider by ID | Yes |
| GET | `/api/service-providers` | Get all service providers | Yes |
| GET | `/api/service-providers/expertise/:expertise` | Get providers by expertise | No |
| GET | `/api/service-providers/expertise/categories` | Get expertise categories | No |

## 📝 Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "postcode": "12345"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Register Service Provider
```http
POST /api/auth/register-provider
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "456 Oak Ave",
  "postcode": "67890",
  "expertise": ["Plumbing", "Electrical"],
  "businessBio": "Professional plumber with 10 years of experience"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "address": "123 Main St",
    "postcode": "12345",
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```



## 🔧 Expertise Categories

Service providers can select from these predefined categories:
- Plumbing
- Electrical
- Carpentry
- Roofing
- Painting & Decorating
- Flooring & Tiling
- Appliance Repair
- Handyman Services
- Locksmith & Security
- HVAC & Heating
- Gardening & Landscaping
- Cleaning Services

## 📧 Email Functionality

The application integrates with Nodemailer and Gmail SMTP to provide email services:

### Welcome Emails
- Automatically sent to new users and service providers upon registration
- Professional email templates with RepairO branding
- Includes helpful information about getting started
- **Fallback mechanism**: Registration continues even if email fails

### Forgot Password Emails
- Secure password reset functionality
- Time-limited reset tokens (1 hour expiration)
- Professional email templates with clear instructions
- Support for both users and service providers

### Email Configuration
- Uses Gmail SMTP for reliable email delivery
- Environment variables for SMTP credentials
- Comprehensive error handling with specific error messages
- Fallback handling if email service is unavailable

### Setup Required
**Important**: Before emails can be sent, you must configure Gmail SMTP:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for the application
3. Set environment variables: `SMTP_USER` and `SMTP_PASS`
4. See `GMAIL_SMTP_SETUP.md` for detailed instructions

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Comprehensive validation on all endpoints
- **Error Handling**: Proper HTTP status codes
- **CORS Support**: Cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **Email Security**: Secure password reset tokens with expiration

## 🚀 Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Structure
- **Models**: Mongoose schemas with validation
- **Controllers**: Request/response handling
- **Services**: Business logic layer
- **Routes**: API endpoint definitions
- **Middleware**: Authentication and validation
- **API**: RESTful endpoints for user and service provider management

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  address: String,
  postcode: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Provider Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  address: String,
  postcode: String,
  expertise: [String],
  businessBio: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Version History

- **v1.0.0**: Initial release with complete user management system
- Features: User/Service Provider registration, authentication, profile management
- Backend: Express.js with MongoDB, JWT authentication, comprehensive validation
