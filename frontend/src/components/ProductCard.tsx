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
    <div className="card p-4 hover:transform hover:shadow-lg transition-all">
      {/* Product Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" role="img" aria-label={product.name}>
            {getProductEmoji(product.name)}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-primary truncate">
              {product.name}
            </h3>
            <p className="text-xs text-tertiary">
              Updated {formatDate(product.updated_at)}
            </p>
          </div>
        </div>
        
        {/* Language Badge */}
        <span className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-lg font-medium">
          {product.language.toUpperCase()}
        </span>
      </div>

      {/* Product Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">Price per kg:</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">Quantity:</span>
          <span className="text-sm font-medium text-primary">
            {product.quantity} kg
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary">Total Value:</span>
          <span className="text-sm font-semibold text-success">
            {formatPrice(product.price * product.quantity, product.currency)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        {/* Primary Action - Price Suggestion */}
        <button
          onClick={onPriceSuggest}
          className="btn-base btn-md btn-primary w-full touch-target"
          aria-label={`Get price suggestion for ${product.name}`}
        >
          <span className="mr-2">💡</span>
          Get Price Suggestion
        </button>
        
        {/* Secondary Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="btn-base btn-sm btn-secondary flex-1 touch-target"
            aria-label={`Edit ${product.name}`}
          >
            <span className="mr-1">✏️</span>
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="btn-base btn-sm bg-error text-inverse hover:bg-error-dark flex-1 touch-target"
            aria-label={`Delete ${product.name}`}
          >
            <span className="mr-1">🗑️</span>
            Delete
          </button>
        </div>
      </div>

      {/* Mobile-specific enhancements */}
      <div className="mt-3 pt-3 border-t border-light sm:hidden">
        <div className="flex items-center justify-between text-xs text-tertiary">
          <span>Tap to negotiate</span>
          <span>💬</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;