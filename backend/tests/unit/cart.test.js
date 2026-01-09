
// ============================================
// backend/tests/unit/cart.test.js
// ============================================
const request = require('supertest');
const express = require('express');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const authRoutes = require('../../routes/authRoutes');
const cartRoutes = require('../../routes/cartRoutes');
//const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
//app.use(errorHandler);

describe('Cart Tests', () => {
  let userToken;
  let testProduct;

  beforeEach(async () => {
    // Create user and get token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Cart Test User',
        email: 'cart@test.com',
        password: 'password123'
      });
    
    userToken = userRes.body.data.token;

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'For cart testing',
      price: 99.99,
      category: 'Electronics',
      stock: 50
    });
  });

  describe('GET /api/cart - Get Cart', () => {
    it('should get empty cart for new user', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cart.items).toHaveLength(0);
      expect(res.body.data.cart.totalPrice).toBe(0);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/cart/add - Add to Cart', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 2
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cart.items).toHaveLength(1);
      expect(res.body.data.cart.items[0].quantity).toBe(2);
      expect(res.body.data.cart.totalPrice).toBe(199.98); // 99.99 * 2
    });

    it('should merge quantities for duplicate items', async () => {
      // Add first time
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 2
        });

      // Add again
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 3
        })
        .expect(200);

      expect(res.body.data.cart.items).toHaveLength(1);
      expect(res.body.data.cart.items[0].quantity).toBe(5); // 2 + 3
    });

    it('should validate stock availability', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 100 // More than available stock (50)
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('available');
    });

    it('should validate product exists', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: '507f1f77bcf86cd799439011', // Random valid ObjectId
          quantity: 1
        })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('PUT /api/cart/update - Update Cart Item', () => {
    beforeEach(async () => {
      // Add item to cart first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 2
        });
    });

    it('should update item quantity', async () => {
      const res = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 5
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cart.items[0].quantity).toBe(5);
      expect(res.body.data.cart.totalPrice).toBe(499.95); // 99.99 * 5
    });

    it('should validate new quantity against stock', async () => {
      const res = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 100
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cart/remove/:productId - Remove from Cart', () => {
    beforeEach(async () => {
      // Add item to cart first
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 2
        });
    });

    it('should remove item from cart', async () => {
      const res = await request(app)
        .delete(`/api/cart/remove/${testProduct._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cart.items).toHaveLength(0);
      expect(res.body.data.cart.totalPrice).toBe(0);
    });
  });

  describe('DELETE /api/cart/clear - Clear Cart', () => {
    beforeEach(async () => {
      // Add multiple items
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: testProduct._id.toString(),
          quantity: 2
        });
    });

    it('should clear entire cart', async () => {
      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cart.items).toHaveLength(0);
    });
  });
});