// ============================================
// src/context/CartContext.jsx
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
    };

  const removeFromCart = async (productId) => {
    try {
      const data = await cartService.removeFromCart(productId);
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartCount: getCartCount(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};