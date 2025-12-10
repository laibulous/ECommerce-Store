
// ============================================
// src/components/products/ProductFilters.jsx
// ============================================
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { productService } from '../../services/productService';

const ProductFilters = ({ filters, updateFilters }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handlePriceChange = (e) => {
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
    });
  };

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => updateFilters({ category: '' })}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => updateFilters({ category })}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
            <input
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="$0"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
            <input
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Any"
              className="input-field"
            />
          </div>
          <button onClick={applyPriceFilter} className="btn-primary w-full">
            Apply
          </button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!filters.minRating}
              onChange={() => updateFilters({ minRating: '' })}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">Any Rating</span>
          </label>
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === String(rating)}
                onChange={() => updateFilters({ minRating: String(rating) })}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-700 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : '' })}
            className="text-primary-600 focus:ring-primary-500 rounded"
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;