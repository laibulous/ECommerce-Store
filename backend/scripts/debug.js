// backend/scripts/debug.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@ecommerce.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Hashed Password:', admin.password);
    console.log('Password starts with $2a or $2b?', admin.password.startsWith('$2'));
    console.log('\n---Testing password comparison---');
    
    // Test password comparison
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`Password "${testPassword}" matches:`, isMatch);
    
    // Also test the user method
    const isMatchMethod = await admin.comparePassword(testPassword);
    console.log(`Using comparePassword method:`, isMatchMethod);
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debug();