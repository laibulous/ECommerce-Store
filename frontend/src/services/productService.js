// ============================================
// src/services/productService.js
// ============================================
import api from './api';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get('/products/brands/list');
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured/list', {
      params: { limit },
    });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (id, limit = 4) => {
    const response = await api.get(`/products/${id}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Admin: Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

