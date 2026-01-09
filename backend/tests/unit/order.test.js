const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

const User = require('../../models/User');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');

const authRoutes = require('../../routes/authRoutes');
const orderRoutes = require('../../routes/orderRoutes');
const cartRoutes = require('../../routes/cartRoutes');
//const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
//app.use(errorHandler);

describe('Order Tests', () => {
  let token;
  let user;
  let product;

  beforeEach(async () => {
    // Register user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Order User',
        email: 'order@test.com',
        password: 'password123'
      });

    token = res.body.data.token;
    user = res.body.data.user;

    // Create product directly in DB
    product = await Product.create({
        name: 'Test Product',
        description: 'This is a test product', 
        category: 'Electronics',               
        price: 50,
        stock: 10,
        images: ['https://via.placeholder.com/400']
    });


    // Add product to cart
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product._id,
        quantity: 2
      });
  });

  describe('POST /api/orders', () => {
    it('should create an order from cart', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Street',
            city: 'Lahore',
            state: 'Punjab',
            zipCode: '54000',
            country: 'Pakistan'
          },
          paymentMethod: 'Stripe'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.order).toHaveProperty('_id');
      expect(res.body.data.order.orderItems.length).toBe(1);
      expect(res.body.data.order.itemsPrice).toBe(100);
    });

    it('should not create order if cart is empty', async () => {
      await Cart.deleteMany();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Street',
            city: 'Lahore',
            state: 'Punjab',
            zipCode: '54000',
            country: 'Pakistan'
          }
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Cart is empty');
    });

    it('should validate shipping address', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/orders/myorders', () => {
    it('should get logged-in user orders', async () => {
      // Create order first
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Street',
            city: 'Lahore',
            state: 'Punjab',
            zipCode: '54000',
            country: 'Pakistan'
          }
        });

      const res = await request(app)
        .get('/api/orders/myorders')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.orders.length).toBe(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should get order by ID', async () => {
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Street',
            city: 'Lahore',
            state: 'Punjab',
            zipCode: '54000',
            country: 'Pakistan'
          }
        });

      const orderId = orderRes.body.data.order._id;

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.order._id).toBe(orderId);
    });

    it('should not allow accessing another user’s order', async () => {
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Street',
            city: 'Lahore',
            state: 'Punjab',
            zipCode: '54000',
            country: 'Pakistan'
          }
        });

      const orderId = orderRes.body.data.order._id;

      // Create second user
      const otherUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Other User',
          email: 'other@test.com',
          password: 'password123'
        });

      const otherToken = otherUserRes.body.data.token;

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
  describe('PUT /api/orders/:id/pay - Mark as Paid', () => {
  let orderId;

  beforeEach(async () => {
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddress: {
          street: '123 Street',
          city: 'Lahore',
          state: 'Punjab',
          zipCode: '54000',
          country: 'Pakistan'
        }
      });

    orderId = orderRes.body.data.order._id;
  });

  it('should mark order as paid', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'pi_test_123',
        status: 'succeeded',
        update_time: '2026-01-01',
        email_address: 'buyer@test.com'
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.order.isPaid).toBe(true);
    expect(res.body.data.order.status).toBe('Processing');
  });

  it('should return 404 for non-existing order', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/orders/${fakeId}/pay`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(404);

    expect(res.body.success).toBe(false);
  });
  });

});
