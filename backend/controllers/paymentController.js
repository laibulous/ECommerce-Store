// ============================================
// backend/controllers/paymentController.js
// ============================================
const stripe = require('../config/stripe');
const Order = require('../models/Order');

// @desc    Create payment intent for order
// @route   POST /api/payment/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Get order
    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Check if already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment intent
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: 'usd',
        payment_method_types: ['card'],  // ← Use this instead
        metadata: {
            orderId: order._id.toString(),
            userId: req.user.id
        },
    });
    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        amount: order.totalPrice
      }
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    next(error);
  }
};

// @desc    Handle successful payment
// @route   POST /api/payment/confirm
// @access  Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID and Order ID are required'
      });
    }
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }

    // Update order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date(paymentIntent.created * 1000).toISOString(),
      email_address: paymentIntent.receipt_email || req.user.email
    };
    order.status = 'Processing';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and order updated',
      data: { order }
    });
    } catch (error) {
    console.error('Payment Confirmation Error:', error);
    next(error);
  }
};
// @desc    Stripe webhook handler
// @route   POST /api/payment/webhook
// @access  Public (Stripe only)
exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order in database
      try {
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findById(orderId);
        
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date(paymentIntent.created * 1000).toISOString(),
            email_address: paymentIntent.receipt_email
          };
          order.status = 'Processing';
          await order.save();
          
          console.log(`Order ${orderId} marked as paid via webhook`);
        }
      } catch (error) {
        console.error('Error updating order from webhook:', error);
      }
      break;
      case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
// @desc    Get Stripe publishable key
// @route   GET /api/payment/config
// @access  Public
exports.getStripeConfig = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    });
  } catch (error) {
    next(error);
  }
};