// ============================================
// src/services/orderService.js
// ============================================
import api from './api';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user orders
  getMyOrders: async (page = 1, limit = 10) => {
    const response = await api.get('/orders/myorders', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Admin: Get all orders
  getAllOrders: async (page = 1, limit = 20) => {
    const response = await api.get('/orders', {
        params: { page, limit },
    });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
