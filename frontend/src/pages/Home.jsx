// ============================================
// src/pages/Home.jsx
// ============================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Shield, Truck, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getFeaturedProducts(8);
      setFeaturedProducts(data.data.products);
    } catch (err) {
      setError('Failed to load featured products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to SimpleFinds
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Your go-to destination for quality products at unbeatable prices.
            </p>
              <Link to="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Check out our top picks for you</p>
            </div>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </div>
      </section>
            {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Brands</h3>
              <p className="text-gray-600">From trusted sellers</p>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Electronics', icon: '📱', color: 'bg-primary-100 hover:bg-blue-200' },
              { name: 'Clothing', icon: '👕', color: 'bg-primary-100 hover:bg-purple-200' },
              { name: 'Books', icon: '📚', color: 'bg-primary-100 hover:bg-green-200' },
              { name: 'Sports', icon: '⚽', color: 'bg-primary-100 hover:bg-orange-200' },
              { name: 'Home & Garden', icon: '🏡', color: 'bg-primary-100 hover:bg-pink-200' },
              { name: 'Beauty', icon: '💄', color: 'bg-primary-100 hover:bg-red-200' },
              { name: 'Toys', icon: '🧸', color: 'bg-primary-100 hover:bg-yellow-200' },
              { name: 'Other', icon: '🎁', color: 'bg-primary-100 hover:bg-gray-200' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className={`${category.color} rounded-lg p-6 text-center transition-colors`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;