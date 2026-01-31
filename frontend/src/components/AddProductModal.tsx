import React, { useState } from 'react';
import { Package, Edit3, X, ChevronDown, Zap, IndianRupee, Globe } from 'lucide-react';
import { Product, ProductInput, SAMPLE_PRODUCTS, SUPPORTED_LANGUAGES } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => void;
  defaultLanguage?: string;
  editProduct?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultLanguage = 'en',
  editProduct = null
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: editProduct?.name || '',
    quantity: editProduct?.quantity || 1,
    price: editProduct?.price || 1,
    language: editProduct?.language || defaultLanguage
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editProduct?.name || '',
        quantity: editProduct?.quantity || 1,
        price: editProduct?.price || 1,
        language: editProduct?.language || defaultLanguage
      });
      setErrors({});
    }
  }, [isOpen, editProduct, defaultLanguage]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductInput, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be > 0';
    if (formData.price <= 0) newErrors.price = 'Price must be > 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', quantity: 1, price: 1, language: defaultLanguage });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSampleSelect = (sampleName: string) => {
    const samplePrices: Record<string, number> = {
      'Tomato': 40, 'Onion': 35, 'Potato': 25, 'Banana': 60, 'Apple': 120
    };
    setFormData({ ...formData, name: sampleName, price: samplePrices[sampleName] || 30 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in font-sans">
      <div className="bg-surface rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-border-light">
        {/* Header */}
        <div className="bg-primary text-text-inverse p-6 flex-shrink-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-text-inverse/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-text-inverse/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-text-inverse/20 group-hover:rotate-6 transition-transform">
                {editProduct ? <Edit3 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
              </div>
              <div className="font-display">
                <h2 className="text-xl font-black tracking-tight uppercase">
                  {editProduct ? 'Update Listing' : 'New Listing'}
                </h2>
                <p className="text-primary-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {editProduct ? 'Refine your product details' : 'Post your product to the mandi'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-text-inverse/10 hover:bg-text-inverse/20 rounded-lg flex items-center justify-center transition-all active:scale-90 border border-text-inverse/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
          {/* Quick Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Zap className="w-3.5 h-3.5 text-secondary" />
              <label className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">
                Quick Market Suggestions
              </label>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {SAMPLE_PRODUCTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSampleSelect(sample)}
                  className="flex-shrink-0 px-4 py-2 text-[10px] bg-background-secondary hover:bg-primary-50 text-text-primary hover:text-primary rounded-lg transition-all border border-border-light hover:border-primary-200 font-black uppercase tracking-wider active:scale-95 shadow-sm"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="px-1 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Product Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-6 py-5 bg-background-secondary border-2 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-lg ${errors.name ? 'border-error-light/30 bg-error-light/5' : 'border-transparent focus:border-primary-100 focus:bg-surface'
                    }`}
                  placeholder="e.g., Organic Red Tomatoes"
                />
                {errors.name && <p className="text-error text-[10px] font-black uppercase mt-1.5 ml-1 tracking-wider">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Quantity */}
              <div className="space-y-2">
                <label className="px-1 text-[11px] font-black text-text-secondary uppercase tracking-widest">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className={`w-full px-6 py-5 bg-background-secondary border-2 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-lg ${errors.quantity ? 'border-error-light/30 bg-error-light/5' : 'border-transparent focus:border-primary-100 focus:bg-surface'
                    }`}
                  min="0.1"
                  step="0.1"
                />
                {errors.quantity && <p className="text-error text-[10px] font-black uppercase mt-1.5 ml-1 tracking-wider">{errors.quantity}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="px-1 text-[11px] font-black text-text-secondary uppercase tracking-widest">
                  Price / kg (₹)
                </label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-text-tertiary">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full px-6 py-5 pl-10 bg-background-secondary border-2 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-lg ${errors.price ? 'border-error-light/30 bg-error-light/5' : 'border-transparent focus:border-primary-100 focus:bg-surface'
                      }`}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                {errors.price && <p className="text-error text-[10px] font-black uppercase mt-1.5 ml-1 tracking-wider">{errors.price}</p>}
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary-100 flex items-center justify-between group transition-all hover:bg-primary-50">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-5 h-5 text-primary" />
                <span className="text-primary-dark font-black text-xs uppercase tracking-[0.2em]">Total Market Value</span>
              </div>
              <span className="text-primary-dark font-black text-2xl font-display">₹{(formData.price * formData.quantity).toLocaleString()}</span>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="px-1 text-[11px] font-black text-text-secondary uppercase tracking-widest">
              Selling Language
            </label>
            <div className="relative group">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-6 py-5 pl-16 bg-background-secondary border-2 border-transparent focus:border-primary-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-surface transition-all outline-none appearance-none font-bold text-lg text-text-primary"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary group-hover:translate-y-[-40%] transition-transform">
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border-light bg-surface flex gap-3 flex-shrink-0 relative z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-background-secondary text-text-secondary font-black rounded-xl hover:bg-surface-secondary transition-all border border-border-light active:scale-95 uppercase tracking-widest text-[10px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-[2] px-6 py-4 relative overflow-hidden group/submit ${isSubmitting
              ? 'bg-text-tertiary cursor-not-allowed shadow-none'
              : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/10 active:scale-95'
              } text-text-inverse font-black rounded-xl transition-all duration-300 transform uppercase tracking-[0.2em] text-[10px]`}
          >
            <div className="absolute inset-0 bg-text-inverse/10 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-300"></div>
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2 relative z-10">
                <div className="w-4 h-4 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </span>
            ) : (
              <span className="relative z-10">{editProduct ? 'Update Listing' : 'Confirm Listing'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;