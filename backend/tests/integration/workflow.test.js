const request = require('supertest');
const express = require('express');
const Product = require('../../models/Product');
const authRoutes = require('../../routes/authRoutes');
const productRoutes = require('../../routes/productRoutes');
const cartRoutes = require('../../routes/cartRoutes');
const orderRoutes = require('../../routes/orderRoutes');
//const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
//app.use(errorHandler);

describe('Integration Tests - Complete User Journey', () => {
  let userToken;
  let adminToken;
  let productId;
  let orderId;

  // Test 1: Complete Checkout Flow
  it('should complete full checkout flow from cart to order', async () => {
    // Register
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration User',
        email: 'integration@test.com',
        password: 'test123'
      })
      .expect(201);

    userToken = registerRes.body.data.token;

    // Create product
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test',
      price: 100,
      category: 'Electronics',
      stock: 10
    });
    productId = product._id;

    // Add to cart
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 2 })
      .expect(200);

    // Create order
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        shippingAddress: {
          street: '123 St',
          city: 'NYC',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      })
      .expect(201);

    expect(orderRes.body.data.order.totalPrice).toBeGreaterThan(0);
    expect(orderRes.body.data.order.orderItems).toHaveLength(1);
  }, 30000);

  // Test 2: Admin Order Management
  it('should allow admin to manage orders', async () => {
    // Create admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123'
      });
    
    const User = require('../../models/User');
    await User.findByIdAndUpdate(adminRes.body.data.user.id, { role: 'admin' });
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    
    adminToken = loginRes.body.data.token;

    // Create order first
    const product = await Product.create({
      name: 'Admin Test',
      description: 'Test',
      price: 50,
      category: 'Books',
      stock: 5
    });

    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Buyer',
        email: 'buyer@test.com',
        password: 'buyer123'
      });

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${userRes.body.data.token}`)
      .send({ productId: product._id, quantity: 1 });

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userRes.body.data.token}`)
      .send({
        shippingAddress: {
          street: '456 Ave',
          city: 'LA',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        }
      });

    orderId = orderRes.body.data.order._id;

    // Admin updates status
    const updateRes = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' })
      .expect(200);

    expect(updateRes.body.data.order.status).toBe('Shipped');
  }, 30000);

  // Test 3: Product Search and Filter Flow
  it('should search and filter products correctly', async () => {
    await Product.create([
      { name: 'iPhone 15', description: 'Apple phone', price: 999, category: 'Electronics', brand: 'Apple', stock: 5, rating: 4.8 },
      { name: 'Samsung S24', description: 'Samsung phone', price: 899, category: 'Electronics', brand: 'Samsung', stock: 3, rating: 4.5 },
      { name: 'Nike Shoes', description: 'Running shoes', price: 120, category: 'Clothing', brand: 'Nike', stock: 10, rating: 4.2 }
    ]);

    // Search
    const searchRes = await request(app)
      .get('/api/products?search=phone')
      .expect(200);
    expect(searchRes.body.data.products.length).toBeGreaterThanOrEqual(2);

    // Filter by category
    const categoryRes = await request(app)
      .get('/api/products?category=Electronics')
      .expect(200);
    expect(categoryRes.body.data.products.length).toBeGreaterThanOrEqual(2);

    // Filter by price
    const priceRes = await request(app)
      .get('/api/products?minPrice=500&maxPrice=1000')
      .expect(200);
    expect(priceRes.body.data.products.length).toBeGreaterThanOrEqual(2);
  }, 30000);

  // Test 4: Cart Operations Flow
  it('should handle cart operations correctly', async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Cart User',
        email: 'cart@test.com',
        password: 'cart123'
      });

    const token = userRes.body.data.token;

    const product = await Product.create({
      name: 'Cart Item',
      description: 'Test',
      price: 25,
      category: 'Toys',
      stock: 20
    });

    // Add item
    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 3 })
      .expect(200);

    // Update quantity
    await request(app)
      .put('/api/cart/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 5 })
      .expect(200);

    // Remove item
    const removeRes = await request(app)
      .delete(`/api/cart/remove/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(removeRes.body.data.cart.items).toHaveLength(0);
  }, 30000);

  // Test 5: Profile Update Flow
  it('should update user profile and password', async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Profile User',
        email: 'profile@test.com',
        password: 'profile123'
      });

    const token = userRes.body.data.token;

    // Update profile
    const profileRes = await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        phone: '+1234567890'
      })
      .expect(200);

    expect(profileRes.body.data.user.name).toBe('Updated Name');

    // Update password
    await request(app)
      .put('/api/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'profile123',
        newPassword: 'newpass123'
      })
      .expect(200);

    // Login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'profile@test.com',
        password: 'newpass123'
      })
      .expect(200);

    expect(loginRes.body.data.token).toBeDefined();
  }, 30000);
});