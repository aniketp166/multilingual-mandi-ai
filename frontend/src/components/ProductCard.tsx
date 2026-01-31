import React from 'react';
import { Trash2, Edit3, Sparkles, Package, TrendingUp, IndianRupee, Languages } from 'lucide-react';
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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.round(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getProductEmoji = (name: string) => {
    const emojiMap: { [key: string]: string } = {
      'tomato': '🍅',
      'onion': '🧅',
      'potato': '🥔',
      'banana': '🍌',
      'apple': '🍎',
    };
    return emojiMap[name.toLowerCase()] || '📦';
  };

  const languages: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'kn': 'Kannada'
  };

  return (
    <div className="group relative bg-surface rounded-2xl border border-border-light p-2 hover:border-primary-light transition-all duration-500 hover:shadow-xl overflow-hidden font-sans">
      {/* Subtle Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-light/5 blur-3xl group-hover:bg-primary-light/10 transition-colors duration-500"></div>

      <div className="relative p-3.5 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="absolute inset-0 bg-primary-50 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-surface rounded-xl shadow-sm flex items-center justify-center border border-primary-100 group-hover:-translate-y-1 transition-transform duration-500">
                <span className="text-3xl" role="img" aria-label={product.name}>
                  {getProductEmoji(product.name)}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 font-display">
              <h3 className="text-base font-black text-text-primary group-hover:text-primary transition-colors truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                  Updated {formatDate(product.updated_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 py-1 bg-primary-50 border border-primary-100/50 rounded-full flex items-center gap-1.5">
            <Languages className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              {languages[product.language] || product.language}
            </span>
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 bg-background-secondary rounded-xl border border-border-light flex items-center justify-between group/row hover:bg-surface hover:border-primary-100 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-50 rounded-md group-hover/row:scale-110 transition-transform">
                <IndianRupee className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-wider">Price/kg</span>
            </div>
            <span className="text-xl font-black text-primary">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-surface border border-border-light rounded-xl space-y-0.5 hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-1.5 text-text-tertiary">
                <Package className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-wider">Stock</span>
              </div>
              <p className="text-base font-black text-text-primary">{product.quantity} kg</p>
            </div>

            <div className="p-3 bg-surface border border-border-light rounded-xl space-y-0.5 hover:border-primary-100 transition-colors">
              <div className="flex items-center gap-1.5 text-text-tertiary">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-wider">Worth</span>
              </div>
              <p className="text-base font-black text-primary">
                {formatPrice(product.price * product.quantity, product.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPriceSuggest}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-text-inverse rounded-xl font-black text-xs shadow-lg shadow-primary/10 hover:shadow-primary/20 group/btn transition-all duration-300 hover:-translate-y-0.5 active:scale-95 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-text-inverse/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            <span className="relative z-10 uppercase tracking-widest text-[10px]">AI Insights</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border text-text-secondary rounded-xl font-black text-[10px] hover:border-primary hover:text-primary transition-all active:scale-95 uppercase tracking-wider"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-error-light/10 border border-error-light/30 text-error rounded-xl font-black text-[10px] hover:bg-error hover:text-text-inverse hover:border-error transition-all active:scale-95 uppercase tracking-wider"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;