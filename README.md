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
   ```

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
- `POST /api/cars` - Create a new car
- `PUT /api/cars/:id` - Update a car
- `DELETE /api/cars/:id` - Delete a car

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Health Check
- `GET /health` - Server health status

## Future Enhancements
- [ ] Authentication & JWT tokens
- [ ] Password hashing with bcrypt
- [ ] Input validation
- [ ] Image upload for cars
- [ ] Search and filter functionality
- [ ] Frontend application
- [ ] Deployment configuration
- [ ] Unit and integration tests

## Technologies Used
- **Backend**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, dotenv
- **Dev Tools**: Nodemon

## License
ISC
