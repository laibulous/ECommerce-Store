// ============================================
// backend/routes/cartRoutes.js
// ============================================
const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validateRequest');

const router = express.Router();

// Validation rules
const cartItemValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('quantity')
   .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// All routes are protected (require authentication)
router.get('/', protect, getCart);
router.post('/add', protect, cartItemValidation, validate, addToCart);
router.put('/update', protect, cartItemValidation, validate, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;


