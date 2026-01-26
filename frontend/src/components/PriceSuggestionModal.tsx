import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen && product) {
      fetchPriceSuggestion();
    }
  }, [isOpen, product]);

  const fetchPriceSuggestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await geminiAI.getPriceSuggestion({
        product_name: product.name,
        quantity: product.quantity,
        current_price: product.price,
        location: 'India'
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
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">💰 Price Suggestion</h2>
              <p className="text-emerald-100">AI-powered pricing for {product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Getting AI price suggestions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchPriceSuggestion}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {suggestion && (
            <div className="space-y-6">
              {/* Current vs Suggested */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">AI Suggested</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{suggestion.recommended_price}</p>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Recommended Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Minimum</span>
                    <span className="font-semibold text-red-600">₹{suggestion.min_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Recommended</span>
                    <span className="font-semibold text-emerald-600">₹{suggestion.recommended_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Maximum</span>
                    <span className="font-semibold text-green-600">₹{suggestion.max_price}</span>
                  </div>
                </div>

                {/* Visual Price Bar */}
                <div className="mt-4 relative">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-400 via-emerald-400 to-green-400"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹{suggestion.min_price}</span>
                    <span>₹{suggestion.max_price}</span>
                  </div>
                </div>
              </div>

              {/* Market Trend */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getTrendIcon(suggestion.market_trend)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Market Trend</h3>
                    <p className={`font-medium capitalize ${getTrendColor(suggestion.market_trend)}`}>
                      {suggestion.market_trend}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{suggestion.reasoning}</p>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Confidence:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Custom Price Input */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Set Your Price</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2">Price per kg (₹)</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Total Value</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ₹{(customPrice * product.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAcceptPrice(suggestion.recommended_price)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎯</span>
                    <span>Use AI Suggestion (₹{suggestion.recommended_price})</span>
                  </span>
                </button>
                <button
                  onClick={() => handleAcceptPrice(customPrice)}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>✏️</span>
                    <span>Use Custom Price (₹{customPrice})</span>
                  </span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceSuggestionModal;