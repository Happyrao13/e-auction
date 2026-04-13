require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cluster = require('cluster');
const os = require('os');
const path = require('path');

const numCPUs = os.cpus().length;

// Clustering Logic
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} starting...`);
  console.log(`Number of CPUs: ${numCPUs}`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  // Worker process
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // MongoDB Connection
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carscout')
    .then(() => console.log(`Worker ${process.pid}: MongoDB connected`))
    .catch(err => console.error('MongoDB connection error:', err));

  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/cars', require('./routes/cars'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/payments', require('./routes/payments'));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      message: 'Server is running', 
      pid: process.pid,
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });
}
