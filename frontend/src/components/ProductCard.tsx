import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
  onPriceSuggest: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  onEdit,
  onPriceSuggest
}) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProductEmoji = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      'tomato': '🍅',
      'onion': '🧅',
      'potato': '🥔',
      'banana': '🍌',
      'apple': '🍎',
    };
    return emojiMap[name.toLowerCase()] || '🛒';
  };

  return (
    <div className="product-card-enhanced relative">
      {/* Product Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:via-emerald-300 group-hover:to-emerald-400 transition-all duration-300 shadow-lg">
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={product.name}>
                {getProductEmoji(product.name)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200 truncate">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Updated {formatDate(product.updated_at)}</span>
              </p>
            </div>
          </div>
          
          {/* Language Badge */}
          <div className="flex flex-col items-end space-y-2">
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 text-xs rounded-full font-semibold shadow-sm">
              {product.language.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600">Price per kg:</span>
            <span className="text-xl font-bold text-emerald-600">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {product.quantity}
              </div>
              <div className="text-xs text-blue-700 font-medium">kg Available</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-xl font-bold text-green-600 mb-1">
                {formatPrice(product.price * product.quantity, product.currency)}
              </div>
              <div className="text-xs text-green-700 font-medium">Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {/* Primary Action - Price Suggestion */}
        <button
          onClick={onPriceSuggest}
          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1 group touch-target"
          aria-label={`Get price suggestion for ${product.name}`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span className="text-lg group-hover:animate-bounce">💡</span>
            <span>Get AI Price Suggestion</span>
          </span>
        </button>
        
        {/* Secondary Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group touch-target"
            aria-label={`Edit ${product.name}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-sm group-hover:scale-110 transition-transform">✏️</span>
              <span>Edit</span>
            </span>
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl border-2 border-red-200 hover:border-red-300 hover:bg-red-100 transition-all duration-200 group touch-target"
            aria-label={`Delete ${product.name}`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-sm group-hover:scale-110 transition-transform">🗑️</span>
              <span>Delete</span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile-specific enhancements */}
      <div className="px-6 pb-4 pt-2 border-t border-gray-100 bg-gradient-to-r from-gray-50 via-emerald-50/50 to-gray-50 lg:hidden">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center space-x-2">
            <span className="text-lg">💬</span>
            <span className="font-medium">Tap to negotiate</span>
          </span>
          <div className="flex items-center space-x-2">
            <div className="status-online"></div>
            <span className="text-emerald-600 font-semibold">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;