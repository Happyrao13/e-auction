# CarScout - Car Sales Platform

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

## Features

### Core Features
- **Clustering**: Multi-process server utilizing all CPU cores for better performance
- **Photo Upload**: Support for uploading up to 5 images per car listing (JPEG, PNG, GIF, WebP, max 5MB)
- **Payment Processing**: Stripe integration for secure payment handling
- **User Management**: User registration and profile management
- **Car Listings**: Create, read, update, and delete car listings with photos
- **CORS Support**: Cross-origin requests enabled for frontend integration

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
