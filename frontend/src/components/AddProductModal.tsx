import React, { useState } from 'react';
import { ProductInput, SAMPLE_PRODUCTS, SUPPORTED_LANGUAGES } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    quantity: 1,
    price: 1,
    language: 'en'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    console.log('🔵 Modal handleSubmit called');
    console.log('🔵 isSubmitting state:', isSubmitting);
    
    if (isSubmitting) {
      console.log('🔴 Already submitting, ignoring duplicate submission');
      return;
    }
    
    if (!validateForm()) {
      console.log('🔴 Form validation failed');
      return;
    }
    
    console.log('🟡 Setting isSubmitting to true');
    setIsSubmitting(true);
    
    try {
      console.log('🟢 Modal submitting product:', formData);
      await onSubmit(formData);
      
      console.log('🟢 Product submitted successfully, resetting form');
      // Reset form and close modal only after successful submission
      setFormData({ name: '', quantity: 1, price: 1, language: 'en' });
      setErrors({});
      console.log('🟢 Closing modal');
      onClose();
    } catch (error) {
      console.error('🔴 Error submitting product:', error);
    } finally {
      console.log('🟡 Resetting isSubmitting to false');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">📦 Add New Product</h2>
              <p className="text-emerald-100">List your product for sale</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sample Products */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick Select (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PRODUCTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSampleSelect(sample)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors border border-gray-200 hover:border-emerald-300"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Fresh Tomatoes"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity (kg) *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
              step="0.1"
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price per kg (₹) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0.01"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Total value: ₹{(formData.price * formData.quantity).toFixed(2)}
            </p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-4 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-xl hover:-translate-y-1'
              } text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </span>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;