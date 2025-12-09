// ============================================
// src/services/paymentService.js
// ============================================
import api from './api';

export const paymentService = {
  // Get Stripe config
  getConfig: async () => {
    const response = await api.get('/payment/config');
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (orderId) => {
    const response = await api.post('/payment/create-intent', { orderId });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, orderId) => {
    const response = await api.post('/payment/confirm', {
      paymentIntentId,
      orderId,
    });
    return response.data;
  },
};