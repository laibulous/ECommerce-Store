// ============================================
// src/components/products/ProductCard.jsx
// ============================================
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100 aspect-square">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.numReviews})</span>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`p-2 rounded-lg transition ${
                product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {adding ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;