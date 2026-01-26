import React, { useState, useEffect } from 'react';
import { ProductInput, SAMPLE_PRODUCTS, SUPPORTED_LANGUAGES } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
  suggestedProducts?: string[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  suggestedProducts = SAMPLE_PRODUCTS
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    quantity: 1,
    price: 0,
    language: 'en'
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        quantity: 1,
        price: 0,
        language: 'en'
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle form field changes
  const handleInputChange = (field: keyof ProductInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle numeric input changes
  const handleNumericChange = (field: 'quantity' | 'price', value: string) => {
    const numericValue = parseFloat(value) || 0;
    handleInputChange(field, numericValue);
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (formData.quantity > 10000) {
      newErrors.quantity = 'Quantity cannot exceed 10,000 kg';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 100000) {
      newErrors.price = 'Price cannot exceed ₹1,00,000 per kg';
    }

    if (!formData.language) {
      newErrors.language = 'Language selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Trim and format the data
      const productData: ProductInput = {
        name: formData.name.trim(),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        language: formData.language
      };

      onSubmit(productData);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle submission error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle suggested product selection
  const handleSuggestedProductSelect = (productName: string) => {
    setFormData(prev => ({
      ...prev,
      name: productName
    }));
    
    // Clear name error if it exists
    if (errors.name) {
      setErrors(prev => ({
        ...prev,
        name: undefined
      }));
    }
  };

  // Get product emoji
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

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Modal Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">➕</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h2>
              <p className="text-gray-500 text-sm">
                Create a new product listing for your inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            aria-label="Close modal"
          >
            <span className="text-lg">×</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Suggested Products */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Quick Select (Optional)</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedProducts.map((product) => (
                <button
                  key={product}
                  type="button"
                  onClick={() => handleSuggestedProductSelect(product)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    formData.name === product
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{getProductEmoji(product)}</span>
                    <span>{product}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center space-x-2">
                <span>📝</span>
                <span>Product Name *</span>
              </span>
            </label>
            <input
              id="productName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-emerald-500'
              }`}
              placeholder="Enter product name (e.g., Fresh Tomatoes)"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Quantity and Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <span>⚖️</span>
                  <span>Quantity (kg) *</span>
                </span>
              </label>
              <input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleNumericChange('quantity', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                  errors.quantity 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-emerald-500'
                }`}
                placeholder="0"
                min="1"
                max="10000"
                step="1"
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.quantity}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>Price per kg (₹) *</span>
                </span>
              </label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleNumericChange('price', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                  errors.price 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-emerald-500'
                }`}
                placeholder="0.00"
                min="0.01"
                max="100000"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.price}</span>
                </p>
              )}
            </div>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center space-x-2">
                <span>🌐</span>
                <span>Language *</span>
              </span>
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                errors.language 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-emerald-500'
              }`}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
            {errors.language && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.language}</span>
              </p>
            )}
          </div>

          {/* Preview Card */}
          {formData.name && formData.quantity > 0 && formData.price > 0 && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center space-x-2">
                <span>👀</span>
                <span>Preview</span>
              </h4>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getProductEmoji(formData.name)}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{formData.name}</h5>
                    <p className="text-xs text-gray-500">{formData.language.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">₹{formData.price}</span> per kg × <span className="font-medium">{formData.quantity} kg</span> = <span className="font-bold text-emerald-600">₹{(formData.price * formData.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Add Product</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;