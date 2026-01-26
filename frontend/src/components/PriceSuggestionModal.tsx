import React, { useState, useEffect, useCallback } from 'react';
import { Product, PriceSuggestionResponse } from '../types';
import { geminiAI } from '../services/gemini';

interface PriceSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAcceptPrice?: (newPrice: number) => void;
}

const PriceSuggestionModal: React.FC<PriceSuggestionModalProps> = ({
  isOpen,
  onClose,
  product,
  onAcceptPrice
}) => {
  const [suggestion, setSuggestion] = useState<PriceSuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(product.price);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const fetchPriceSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiAI.getPriceSuggestion({
        product_name: product.name,
        quantity: product.quantity,
        current_price: product.price,
        location: 'India',
        language: product.language // Pass product language for localized reasoning
      });

      if (response.success) {
        setSuggestion(response.data);
        setCustomPrice(response.data.recommended_price);
      } else {
        setError(response.message || 'Failed to get price suggestion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get price suggestion');
    } finally {
      setLoading(false);
    }
  }, [product.name, product.quantity, product.price, product.language]);

  useEffect(() => {
    if (isOpen && product) {
      fetchPriceSuggestion();
    }
  }, [isOpen, product, fetchPriceSuggestion]);

  const handleAcceptPrice = (price: number) => {
    if (onAcceptPrice) {
      onAcceptPrice(price);
    }
    onClose();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 sm:rounded-t-2xl flex-shrink-0 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">💰 Price Suggestion</h2>
              <p className="text-emerald-100 text-sm">AI-powered insights for {product.name}</p>
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

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-hide">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Getting AI price suggestions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 mb-6 animate-shake">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Price Fetch Error</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchPriceSuggestion}
                className="mt-4 w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {suggestion && (
            <div className="space-y-6 animate-fade-in">
              {/* Current vs Suggested Chips */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current</p>
                  <p className="text-xl font-black text-gray-700">₹{product.price}</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Suggested</p>
                  <p className="text-xl font-black text-emerald-600">₹{suggestion.recommended_price}</p>
                </div>
              </div>

              {/* Range Visualization */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-2">
                  <span>📊</span> Recommended Price Range
                </h3>

                <div className="relative pt-2 pb-6">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-400 w-1/4"></div>
                    <div className="h-full bg-emerald-400 flex-1"></div>
                    <div className="h-full bg-blue-400 w-1/4"></div>
                  </div>

                  {/* Current Price Marker */}
                  <div
                    className="absolute top-0 flex flex-col items-center transition-all duration-700 ease-out"
                    style={{
                      left: `${Math.min(Math.max(((product.price - suggestion.min_price) / (suggestion.max_price - suggestion.min_price)) * 100, 0), 100)}%`
                    }}
                  >
                    <div className="w-1.5 h-6 bg-gray-900 rounded-full shadow-sm"></div>
                    <div className="text-[8px] font-black text-gray-900 mt-1 uppercase">Current</div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Min</p>
                      <p className="text-sm font-bold text-gray-700">₹{suggestion.min_price}</p>
                    </div>
                    <div className="text-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-0.5">Recommended</p>
                      <p className="text-base font-black text-emerald-700">₹{suggestion.recommended_price}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Max</p>
                      <p className="text-sm font-bold text-gray-700">₹{suggestion.max_price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Card */}
              <div className="bg-white border-2 border-gray-50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                    {getTrendIcon(suggestion.market_trend)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Market Trend</h3>
                    <p className={`text-lg font-black tracking-tight capitalize ${getTrendColor(suggestion.market_trend)}`}>
                      {suggestion.market_trend} Trend
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
                  <p className="text-sm text-gray-600 leading-relaxed italic font-medium">
                    &ldquo;{suggestion.reasoning}&rdquo;
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Confidence</span>
                    <span className="text-xs font-black text-emerald-600">{Math.round(suggestion.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Input Card */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Set Your Final Price</h3>
                <div className="flex items-end gap-6 sm:gap-8">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Price per kg</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-white/30">₹</span>
                      <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-4 bg-white/10 border-2 border-white/10 rounded-2xl focus:border-emerald-500 focus:bg-white/20 transition-all outline-none text-2xl font-black text-white"
                        min="1"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="text-right pb-2">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Total Valuation</p>
                    <p className="text-xl font-black text-emerald-400">
                      ₹{(customPrice * product.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-4 sm:p-6 bg-white border-t border-gray-50 flex flex-col sm:flex-row gap-3 flex-shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          {suggestion && (
            <button
              onClick={() => handleAcceptPrice(suggestion.recommended_price)}
              className="group flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>🎯</span>
              <span>Accept AI Suggestion</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">₹{suggestion.recommended_price}</span>
            </button>
          )}
          <button
            onClick={() => handleAcceptPrice(customPrice)}
            className="flex-1 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-gray-200 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>✏️</span>
            <span>Use My Price</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">₹{customPrice}</span>
          </button>
          <button
            onClick={onClose}
            className="py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all sm:px-8 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceSuggestionModal;