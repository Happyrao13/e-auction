*e-auction - Car Sales Platform

A modern car marketplace application built with Node.js/Express backend and MongoDB database.

## Project Structure

```
carscout/
├── BACKEND/
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main entry point
│   ├── package.json
│   └── .env.example
├── FRONTEND/            # (To be implemented)
└── README.md
```

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/carscout
   NODE_ENV=development
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

5. **Get Stripe Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Create a free account
   - Find your API keys in the Developers section
   - Copy the Secret Key and Publishable Key to `.env`

### Running the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `DELETE /api/auth/account` - Delete account (soft delete, protected)
- `DELETE /api/auth/account/permanent` - Permanently delete account (protected)

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create a new car with photos (multipart/form-data)
- `PUT /api/cars/:id` - Update a car (can include new photos)
- `POST /api/cars/:id/upload-photos` - Upload additional photos to existing car
- `DELETE /api/cars/:id` - Delete a car

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment after Stripe processing
- `GET /api/payments/:id` - Get payment details by ID
- `GET /api/payments/user/:userId` - Get all payments for a user (buyer or seller)
- `GET /api/payments` - Get all payments (admin)

## Health Check
- `GET /health` - Server health status with worker process ID

## Authentication Usage

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "1234567890",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response includes a JWT token** - use this token for protected endpoints

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile (Protected)
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "0987654321",
    "address": "456 Oak Ave"
  }'
```

### Delete Account (Protected)
```bash
curl -X DELETE http://localhost:5000/api/auth/account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Features

### Core Features
- **Authentication**: Secure user registration, login, logout with JWT tokens
- **Password Security**: Bcrypt password hashing for secure password storage
- **User Management**: Update profile, view account details, delete account
- **Clustering**: Multi-process server utilizing all CPU cores for better performance
- **Photo Upload**: Support for uploading up to 5 images per car listing (JPEG, PNG, GIF, WebP, max 5MB)
- **Payment Processing**: Stripe integration for secure payment handling
- **Car Listings**: Create, read, update, and delete car listings with photos
- **CORS Support**: Cross-origin requests enabled for frontend integration

### Security Features
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes (requires authentication)
- Soft delete option for accounts (data preservation)
- Permanent delete option for complete data removal

### Architecture Improvements
- Multi-process clustering for scalability
- File upload middleware with image validation
- Payment tracking and history
- Automatic worker process recovery

## Technologies Used
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, dotenv
- **Dev Tools**: Nodemon

## License
ISC
