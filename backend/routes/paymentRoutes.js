// ============================================
// backend/routes/paymentRoutes.js
// ============================================
const express = require('express');
const { body } = require('express-validator');
const {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');

const router = express.Router();

// Validation rules
const paymentIntentValidation = [
  body('orderId')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid Order ID')
];

const confirmPaymentValidation = [
  body('paymentIntentId').notEmpty().withMessage('Payment Intent ID is required'),
  body('orderId')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid Order ID')
];

// Public routes
router.get('/config', getStripeConfig);

// NOTE: Webhook route is handled in server.js before JSON body parser
// because Stripe needs the raw body for signature verification

// Protected routes
router.post('/create-intent', protect, paymentIntentValidation, validate, createPaymentIntent);
router.post('/confirm', protect, confirmPaymentValidation, validate, confirmPayment);

module.exports = router;