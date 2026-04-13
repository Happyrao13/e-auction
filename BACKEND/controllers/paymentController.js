const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');
const Payment = require('../models/Payment');
const Car = require('../models/Car');
const User = require('../models/User');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { carId, buyerId, amount } = req.body;

    // Validate inputs
    if (!carId || !buyerId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find car and buyer
    const car = await Car.findById(carId).populate('owner');
    const buyer = await User.findById(buyerId);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        carId: carId,
        buyerId: buyerId,
        sellerId: car.owner._id.toString()
      }
    });

    // Create payment record in database
    const payment = new Payment({
      stripePaymentId: paymentIntent.id,
      amount: amount,
      currency: 'usd',
      car: carId,
      buyer: buyerId,
      seller: car.owner._id,
      status: 'pending'
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntentId },
      {
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    res.status(200).json({
      message: 'Payment confirmed',
      payment: payment,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment by ID
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('car', 'make model year price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments for a user
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const payments = await Payment.find({
      $or: [
        { buyer: userId },
        { seller: userId }
      ]
    })
      .populate('car', 'make model year price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all payments (admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('car', 'make model year price')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
