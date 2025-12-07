// ============================================
// backend/scripts/seed.js
// ============================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const products = [
  // Electronics
  { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone with A17 chip and titanium design', price: 999.99, category: 'Electronics', subcategory: 'Smartphones', brand: 'Apple', stock: 50, rating: 4.8, numReviews: 120, featured: true, tags: ['phone', 'apple', 'premium'] },
  { name: 'Samsung Galaxy S24', description: 'Flagship Android phone with AI features', price: 899.99, category: 'Electronics', subcategory: 'Smartphones', brand: 'Samsung', stock: 45, rating: 4.7, numReviews: 98 },
  { name: 'MacBook Pro M3', description: '14-inch laptop with M3 chip, perfect for professionals', price: 1999.99, category: 'Electronics', subcategory: 'Laptops', brand: 'Apple', stock: 30, rating: 4.9, numReviews: 85, featured: true },
  { name: 'Dell XPS 13', description: 'Ultra-portable Windows laptop with stunning display', price: 1299.99, category: 'Electronics', subcategory: 'Laptops', brand: 'Dell', stock: 25, rating: 4.6, numReviews: 67 },
  { name: 'Sony WH-1000XM5', description: 'Premium noise-cancelling headphones', price: 399.99, category: 'Electronics', subcategory: 'Audio', brand: 'Sony', stock: 60, rating: 4.8, numReviews: 145 },
  { name: 'AirPods Pro 2', description: 'Wireless earbuds with active noise cancellation', price: 249.99, category: 'Electronics', subcategory: 'Audio', brand: 'Apple', stock: 80, rating: 4.7, numReviews: 210 },
  { name: 'iPad Air', description: 'Versatile tablet with M1 chip', price: 599.99, category: 'Electronics', subcategory: 'Tablets', brand: 'Apple', stock: 40, rating: 4.7, numReviews: 92 },
  { name: 'Canon EOS R6', description: 'Professional mirrorless camera', price: 2499.99, category: 'Electronics', subcategory: 'Cameras', brand: 'Canon', stock: 15, rating: 4.9, numReviews: 54 },
  { name: 'PlayStation 5', description: 'Next-gen gaming console', price: 499.99, category: 'Electronics', subcategory: 'Gaming', brand: 'Sony', stock: 20, rating: 4.8, numReviews: 178, featured: true },
  { name: 'Nintendo Switch OLED', description: 'Hybrid gaming console with OLED screen', price: 349.99, category: 'Electronics', subcategory: 'Gaming', brand: 'Nintendo', stock: 35, rating: 4.7, numReviews: 134 },
  
  // Clothing
  { name: 'Levi\'s 501 Jeans', description: 'Classic straight fit denim jeans', price: 89.99, category: 'Clothing', subcategory: 'Pants', brand: 'Levi\'s', stock: 100, rating: 4.5, numReviews: 89 },
  { name: 'Nike Air Max 90', description: 'Iconic running shoes with Air cushioning', price: 129.99, category: 'Clothing', subcategory: 'Shoes', brand: 'Nike', stock: 75, rating: 4.6, numReviews: 156 },
  { name: 'Adidas Ultraboost', description: 'Premium running shoes with Boost technology', price: 179.99, category: 'Clothing', subcategory: 'Shoes', brand: 'Adidas', stock: 60, rating: 4.7, numReviews: 123 },
  { name: 'North Face Jacket', description: 'Waterproof winter jacket', price: 249.99, category: 'Clothing', subcategory: 'Outerwear', brand: 'The North Face', stock: 45, rating: 4.8, numReviews: 78, featured: true },
  { name: 'Ralph Lauren Polo Shirt', description: 'Classic polo shirt in various colors', price: 79.99, category: 'Clothing', subcategory: 'Shirts', brand: 'Ralph Lauren', stock: 120, rating: 4.4, numReviews: 94 },
  { name: 'Under Armour Hoodie', description: 'Comfortable athletic hoodie', price: 64.99, category: 'Clothing', subcategory: 'Sportswear', brand: 'Under Armour', stock: 85, rating: 4.5, numReviews: 67 },
  { name: 'Zara Dress', description: 'Elegant evening dress', price: 99.99, category: 'Clothing', subcategory: 'Dresses', brand: 'Zara', stock: 50, rating: 4.3, numReviews: 45 },
  { name: 'H&M T-Shirt Pack', description: 'Pack of 3 basic cotton t-shirts', price: 29.99, category: 'Clothing', subcategory: 'Shirts', brand: 'H&M', stock: 200, rating: 4.2, numReviews: 312 },
  { name: 'Timberland Boots', description: 'Durable waterproof boots', price: 189.99, category: 'Clothing', subcategory: 'Shoes', brand: 'Timberland', stock: 40, rating: 4.6, numReviews: 87 },
  { name: 'Ray-Ban Sunglasses', description: 'Classic aviator sunglasses', price: 159.99, category: 'Clothing', subcategory: 'Accessories', brand: 'Ray-Ban', stock: 70, rating: 4.7, numReviews: 201 },
  
  // Books
  { name: 'Atomic Habits', description: 'Self-help book by James Clear', price: 16.99, category: 'Books', subcategory: 'Self-Help', brand: 'Penguin', stock: 150, rating: 4.8, numReviews: 2345 },
  { name: 'The Hobbit', description: 'Fantasy classic by J.R.R. Tolkien', price: 14.99, category: 'Books', subcategory: 'Fiction', brand: 'HarperCollins', stock: 120, rating: 4.9, numReviews: 4567 },
  { name: 'Sapiens', description: 'Brief history of humankind by Yuval Noah Harari', price: 18.99, category: 'Books', subcategory: 'Non-Fiction', brand: 'Vintage', stock: 100, rating: 4.7, numReviews: 1876 },
  { name: 'Clean Code', description: 'Programming best practices by Robert Martin', price: 39.99, category: 'Books', subcategory: 'Technology', brand: 'Prentice Hall', stock: 80, rating: 4.8, numReviews: 567 },
  { name: 'The Psychology of Money', description: 'Financial wisdom by Morgan Housel', price: 17.99, category: 'Books', subcategory: 'Finance', brand: 'Harriman House', stock: 95, rating: 4.7, numReviews: 892 },
  
  // Home & Garden
  { name: 'Dyson V15 Vacuum', description: 'Cordless vacuum with laser detection', price: 649.99, category: 'Home & Garden', subcategory: 'Appliances', brand: 'Dyson', stock: 25, rating: 4.8, numReviews: 234, featured: true },
  { name: 'KitchenAid Stand Mixer', description: 'Professional 5-quart stand mixer', price: 379.99, category: 'Home & Garden', subcategory: 'Kitchen', brand: 'KitchenAid', stock: 30, rating: 4.9, numReviews: 456 },
  { name: 'Instant Pot Duo', description: '7-in-1 electric pressure cooker', price: 99.99, category: 'Home & Garden', subcategory: 'Kitchen', brand: 'Instant Pot', stock: 60, rating: 4.7, numReviews: 3421 },
  { name: 'Casper Mattress', description: 'Memory foam mattress, Queen size', price: 895.00, category: 'Home & Garden', subcategory: 'Bedroom', brand: 'Casper', stock: 20, rating: 4.6, numReviews: 678 },
  { name: 'Philips Hue Starter Kit', description: 'Smart LED lighting system', price: 199.99, category: 'Home & Garden', subcategory: 'Smart Home', brand: 'Philips', stock: 45, rating: 4.7, numReviews: 892 },
  
  // Sports
  { name: 'Peloton Bike', description: 'Connected fitness bike with live classes', price: 1445.00, category: 'Sports', subcategory: 'Fitness Equipment', brand: 'Peloton', stock: 10, rating: 4.8, numReviews: 1234 },
  { name: 'Bowflex Dumbbells', description: 'Adjustable dumbbells 5-52.5 lbs', price: 349.99, category: 'Sports', subcategory: 'Fitness Equipment', brand: 'Bowflex', stock: 35, rating: 4.7, numReviews: 567 },
  { name: 'Yoga Mat Premium', description: 'Non-slip exercise mat', price: 39.99, category: 'Sports', subcategory: 'Yoga', brand: 'Manduka', stock: 100, rating: 4.6, numReviews: 234 },
  { name: 'Wilson Tennis Racket', description: 'Professional tennis racket', price: 199.99, category: 'Sports', subcategory: 'Tennis', brand: 'Wilson', stock: 40, rating: 4.5, numReviews: 123 },
  { name: 'Spalding Basketball', description: 'Official size basketball', price: 29.99, category: 'Sports', subcategory: 'Basketball', brand: 'Spalding', stock: 80, rating: 4.6, numReviews: 345 },
  
  // Toys
  { name: 'LEGO Star Wars Set', description: 'Millennium Falcon building set', price: 169.99, category: 'Toys', subcategory: 'Building', brand: 'LEGO', stock: 50, rating: 4.9, numReviews: 678 },
  { name: 'Barbie Dreamhouse', description: 'Large dollhouse with furniture', price: 199.99, category: 'Toys', subcategory: 'Dolls', brand: 'Barbie', stock: 30, rating: 4.7, numReviews: 456 },
  { name: 'Hot Wheels Track Set', description: 'Ultimate garage playset', price: 79.99, category: 'Toys', subcategory: 'Vehicles', brand: 'Hot Wheels', stock: 45, rating: 4.6, numReviews: 234 },
  { name: 'Nerf Elite Blaster', description: 'Foam dart blaster', price: 49.99, category: 'Toys', subcategory: 'Action', brand: 'Nerf', stock: 70, rating: 4.5, numReviews: 567 },
  { name: 'Monopoly Board Game', description: 'Classic family board game', price: 24.99, category: 'Toys', subcategory: 'Board Games', brand: 'Hasbro', stock: 90, rating: 4.4, numReviews: 890 },
  
  // Beauty
  { name: 'Dyson Airwrap', description: 'Multi-styler hair tool', price: 599.99, category: 'Beauty', subcategory: 'Hair Care', brand: 'Dyson', stock: 20, rating: 4.8, numReviews: 1234, featured: true },
  { name: 'Olaplex Hair Treatment', description: 'Bond building hair treatment', price: 28.00, category: 'Beauty', subcategory: 'Hair Care', brand: 'Olaplex', stock: 100, rating: 4.7, numReviews: 2345 },
  { name: 'Fenty Beauty Foundation', description: 'Pro Filt\'r foundation, multiple shades', price: 39.00, category: 'Beauty', subcategory: 'Makeup', brand: 'Fenty Beauty', stock: 150, rating: 4.6, numReviews: 3456 },
  { name: 'The Ordinary Serum Set', description: 'Skincare serum collection', price: 45.00, category: 'Beauty', subcategory: 'Skincare', brand: 'The Ordinary', stock: 120, rating: 4.7, numReviews: 1890 },
  { name: 'Chanel No. 5 Perfume', description: 'Classic luxury fragrance', price: 135.00, category: 'Beauty', subcategory: 'Fragrance', brand: 'Chanel', stock: 40, rating: 4.9, numReviews: 567 },
  { name: 'Tatcha The Water Cream', description: 'Oil-free, anti-aging moisturizer for balanced skin', price: 69.00, category: 'Beauty', subcategory: 'Skincare', brand: 'Tatcha', stock: 75, rating: 4.5, numReviews: 950, featured: true },
  { name: 'Urban Decay Naked Palette', description: 'Neutral eyeshadow palette with 12 shades', price: 54.00, category: 'Beauty', subcategory: 'Makeup', brand: 'Urban Decay', stock: 110, rating: 4.8, numReviews: 4100, featured: false },
  { name: 'Revlon One-Step Hair Dryer Brush', description: 'Hot air brush for drying and styling', price: 45.99, category: 'Beauty', subcategory: 'Hair Tools', brand: 'Revlon', stock: 180, rating: 4.6, numReviews: 6800, featured: true },
  { name: 'Le Labo Santal 33', description: 'Sandalwood and leather unisex eau de parfum', price: 280.00, category: 'Beauty', subcategory: 'Fragrance', brand: 'Le Labo', stock: 30, rating: 4.9, numReviews: 850, featured: true },
  { name: 'CeraVe Hydrating Cleanser', description: 'Gentle, non-foaming cleanser for normal to dry skin', price: 15.99, category: 'Beauty', subcategory: 'Skincare', brand: 'CeraVe', stock: 250, rating: 4.7, numReviews: 5200, featured: false }
];

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    console.log('Deleting existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    console.log('✓ Existing data deleted\n');
    
    console.log('Creating users with hashed passwords...');
    
    // Prepare user data with pre-hashed passwords
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: await hashPassword('admin123'),
        role: 'admin',
        phone: '+1234567890'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567891'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567892'
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567893'
      },
      {
        name: 'Bob Williams',
        email: 'bob@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567894'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567895'
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567896'
      },
      {
        name: 'Eve Davis',
        email: 'eve@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567897'
      },
      {
        name: 'Frank Miller',
        email: 'frank@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567898'
      },
      {
        name: 'Grace Lee',
        email: 'grace@example.com',
        password: await hashPassword('password123'),
        role: 'customer',
        phone: '+1234567899'
      }
    ];
    
    // Use insertMany to bypass pre-save middleware
    const createdUsers = await User.insertMany(usersData);
    console.log(`✓ ${createdUsers.length} users created\n`);
    
    console.log('Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✓ ${createdProducts.length} products created\n`);
    
    console.log('✅ Database seeded successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('   Admin: admin@ecommerce.com / admin123');
    console.log('   User:  john@example.com / password123\n');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
