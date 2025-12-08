// ============================================
// backend/tests/unit/product.test.js
// ============================================
const request = require('supertest');
const express = require('express');
const Product = require('../../models/Product');
const User = require('../../models/User');
const productRoutes = require('../../routes/productRoutes');
const authRoutes = require('../../routes/authRoutes');
const { errorHandler } = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use(errorHandler);

describe('Product Tests', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123'
      });
    
    // Manually set admin role
    await User.findByIdAndUpdate(adminRes.body.data.user.id, { role: 'admin' });
    
    // Login as admin to get fresh token with admin role
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      });
    
    adminToken = adminLogin.body.data.token;

    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'user123'
      });
    
    userToken = userRes.body.data.token;
  });

  describe('POST /api/products - Create Product', () => {
    const validProduct = {
      name: 'Test Product',
      description: 'Test description',
      price: 99.99,
      category: 'Electronics',
      brand: 'TestBrand',
      stock: 50
    };

    it('should create product as admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProduct)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.product.name).toBe(validProduct.name);
      expect(res.body.data.product.price).toBe(validProduct.price);
    });

    it('should not create product without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should not create product as regular user', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('admin');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/products - Get Products', () => {
    beforeEach(async () => {
      // Create test products
      await Product.create([
        {
          name: 'iPhone 15',
          description: 'Latest iPhone',
          price: 999,
          category: 'Electronics',
          stock: 50,
          rating: 4.8
        },
        {
          name: 'Samsung Galaxy',
          description: 'Android phone',
          price: 899,
          category: 'Electronics',
          stock: 30,
          rating: 4.5
        },
        {
          name: 'Nike Shoes',
          description: 'Running shoes',
          price: 129,
          category: 'Clothing',
          stock: 100,
          rating: 4.2
        }
      ]);
    });

    it('should get all products', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.products).toHaveLength(3);
      expect(res.body.pagination.totalProducts).toBe(3);
    });

    it('should filter products by category', async () => {
      const res = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.products).toHaveLength(2);
    });

    it('should filter products by price range', async () => {
      const res = await request(app)
        .get('/api/products?minPrice=500&maxPrice=1000')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.products).toHaveLength(2);
    });

    it('should paginate products', async () => {
      const res = await request(app)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(res.body.data.products).toHaveLength(2);
      expect(res.body.pagination.totalPages).toBe(2);
    });
  });

  describe('PUT /api/products/:id - Update Product', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Original Name',
        description: 'Original description',
        price: 99.99,
        category: 'Electronics',
        stock: 50
      });
      productId = product._id;
    });

    it('should update product as admin', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 79.99, stock: 30 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.product.price).toBe(79.99);
      expect(res.body.data.product.stock).toBe(30);
    });

    it('should not update product as regular user', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 79.99 })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id - Delete Product', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'To Delete',
        description: 'Will be deleted',
        price: 99.99,
        category: 'Electronics',
        stock: 50
      });
      productId = product._id;
    });

    it('should delete product as admin', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify deletion
      const product = await Product.findById(productId);
      expect(product).toBeNull();
    });

    it('should not delete product as regular user', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});

