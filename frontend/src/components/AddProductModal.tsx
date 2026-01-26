import React, { useState } from 'react';
import { ProductInput, SAMPLE_PRODUCTS, SUPPORTED_LANGUAGES } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
  defaultLanguage?: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit, defaultLanguage = 'en' }) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    quantity: 1,
    price: 1,
    language: defaultLanguage
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);

      // Reset form and close modal only after successful submission
      setFormData({ name: '', quantity: 1, price: 1, language: defaultLanguage });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      // Don't close modal on error - let user see the error and try again
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSampleSelect = (sampleName: string) => {
    const samplePrices: Record<string, number> = {
      'Tomato': 40,
      'Onion': 35,
      'Potato': 25,
      'Banana': 60,
      'Apple': 120
    };

    setFormData({
      ...formData,
      name: sampleName,
      price: samplePrices[sampleName] || 30
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 sm:rounded-t-2xl flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">📦 Add Product</h2>
              <p className="text-emerald-100 text-sm">List your product for sale</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all active:scale-90"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-4 right-6 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
          {/* Sample Products */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Quick Suggestions
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {SAMPLE_PRODUCTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSampleSelect(sample)}
                  className="flex-shrink-0 px-4 py-2 text-sm bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-xl transition-all border border-gray-100 hover:border-emerald-200 font-medium active:scale-95"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none ${errors.name ? 'border-red-200 bg-red-50' : 'border-gray-50 focus:border-emerald-500'
                  }`}
                placeholder="e.g., Fresh Tomatoes"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none ${errors.quantity ? 'border-red-200 bg-red-50' : 'border-gray-50 focus:border-emerald-500'
                    }`}
                  min="0.1"
                  step="0.1"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">{errors.quantity}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price / kg (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none ${errors.price ? 'border-red-200 bg-red-50' : 'border-gray-50 focus:border-emerald-500'
                    }`}
                  min="0.1"
                  step="0.1"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">{errors.price}</p>}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="text-emerald-700 font-medium text-sm">Total Value</span>
              <span className="text-emerald-700 font-bold text-lg">₹{(formData.price * formData.quantity).toLocaleString()}</span>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Selling Language
            </label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-50 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none font-medium text-gray-700"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-50 bg-white sm:rounded-b-2xl flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-[2] px-6 py-4 ${isSubmitting
              ? 'bg-gray-300 cursor-not-allowed shadow-none'
              : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100 active:scale-95'
              } text-white font-bold rounded-xl transition-all duration-200 transform`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </span>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;