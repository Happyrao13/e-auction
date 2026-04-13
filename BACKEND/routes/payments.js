const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Confirm payment
router.post('/confirm', paymentController.confirmPayment);

// Get payment by ID
router.get('/:id', paymentController.getPayment);

// Get user payments
router.get('/user/:userId', paymentController.getUserPayments);

// Get all payments (admin)
router.get('/', paymentController.getAllPayments);

module.exports = router;
