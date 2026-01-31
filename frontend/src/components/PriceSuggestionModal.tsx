import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, X, IndianRupee, Sparkles, ShieldCheck } from 'lucide-react';
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
        language: product.language
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
      case 'rising': return <TrendingUp className="w-6 h-6 text-success" />;
      case 'falling': return <TrendingDown className="w-6 h-6 text-error" />;
      default: return <BarChart3 className="w-6 h-6 text-info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-success';
      case 'falling': return 'text-error';
      default: return 'text-info';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in font-sans">
      <div className="bg-surface rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-border-light">
        {/* Header */}
        <div className="bg-primary text-text-inverse p-6 flex-shrink-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-text-inverse/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-text-inverse/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-text-inverse/20 group-hover:rotate-6 transition-transform">
                <Sparkles className="w-6 h-6 text-primary-200" />
              </div>
              <div className="font-display">
                <h2 className="text-xl font-black tracking-tight uppercase">AI Insights</h2>
                <p className="text-primary-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">Price analysis for {product.name}</p>
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

        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide space-y-6">
          {loading && (
            <div className="text-center py-16 space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
              </div>
              <p className="text-text-secondary font-black uppercase tracking-widest text-sm animate-pulse">Consulting AI Mandi Experts...</p>
            </div>
          )}

          {error && (
            <div className="bg-error-light/10 border-2 border-error-light/30 rounded-3xl p-8 animate-fade-in">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-10 h-10 text-error flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-black text-error uppercase tracking-tight font-display text-xl">Insight Error</h3>
                  <p className="text-text-secondary text-sm font-medium leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchPriceSuggestion}
                className="mt-6 w-full py-4 bg-error text-text-inverse rounded-2xl font-black shadow-xl shadow-error/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {suggestion && (
            <div className="animate-fade-in space-y-8">
              {/* Quick Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-secondary rounded-2xl p-4 border border-border-light text-center transition-all hover:border-primary-100">
                  <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1.5">Current Price</p>
                  <p className="text-xl font-black text-text-primary font-display">₹{product.price}</p>
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-200 text-center transition-all hover:bg-primary-100">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">AI Recommended</p>
                  <p className="text-xl font-black text-primary-dark font-display">₹{suggestion.recommended_price}</p>
                </div>
              </div>

              {/* Price Range Visualizer */}
              <div className="bg-surface rounded-3xl p-6 border border-border-light shadow-xl shadow-gray-200/50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] font-display">Market Range</h3>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-success" />
                </div>

                <div className="relative h-4 bg-background-secondary rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-error-light/40 w-1/4"></div>
                  <div className="h-full bg-success-light/40 flex-1"></div>
                  <div className="h-full bg-info-light/40 w-1/4"></div>

                  {/* Current Position Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-2 bg-text-primary shadow-xl z-10 transition-all duration-1000 ease-out flex flex-col items-center"
                    style={{ left: `${Math.min(Math.max(((product.price - suggestion.min_price) / (suggestion.max_price - suggestion.min_price)) * 100, 0), 100)}%` }}
                  >
                    <div className="absolute -top-1 w-3 h-3 bg-text-primary rounded-full"></div>
                  </div>
                </div>

                <div className="flex justify-between items-start pt-2">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-black text-error uppercase tracking-widest">Floor</span>
                    <p className="text-base font-black text-text-primary">₹{suggestion.min_price}</p>
                  </div>
                  <div className="text-center bg-primary p-3 px-5 rounded-2xl transform scale-110 shadow-xl shadow-primary/20">
                    <span className="text-[9px] font-black text-text-inverse uppercase tracking-widest">Optimal</span>
                    <p className="text-xl font-black text-text-inverse">₹{suggestion.recommended_price}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-black text-info uppercase tracking-widest">Cap</span>
                    <p className="text-base font-black text-text-primary">₹{suggestion.max_price}</p>
                  </div>
                </div>
              </div>

              {/* Reasoning Card */}
              <div className="bg-background-secondary rounded-3xl p-6 border border-border-light space-y-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center shadow-md border border-border-light group-hover:rotate-6 transition-transform">
                    {getTrendIcon(suggestion.market_trend)}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Market Status</h3>
                    <p className={`text-lg font-black tracking-tight capitalize ${getTrendColor(suggestion.market_trend)}`}>
                      {suggestion.market_trend} Momentum
                    </p>
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-5 border border-border-light relative overflow-hidden">
                  <span className="absolute top-2 left-2 text-4xl text-primary/5 font-serif">“</span>
                  <p className="text-sm text-text-secondary leading-relaxed font-bold italic z-10 relative">
                    {suggestion.reasoning}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Analysis Confidence</span>
                    <span className="text-xs font-black text-primary font-display">{Math.round(suggestion.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden border border-border-light">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(5,150,105,0.2)]"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="bg-text-primary rounded-3xl p-6 text-text-inverse shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-150"></div>
                <div className="flex flex-col sm:flex-row items-end gap-6 relative z-10">
                  <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black text-text-inverse/50 uppercase tracking-[0.2em] px-1">Overwrite Market Price</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-200" />
                      <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                        className="w-full bg-text-inverse/10 border-2 border-text-inverse/10 rounded-xl px-6 py-4 pl-14 text-2xl font-black focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="text-right space-y-0.5 pb-2">
                    <p className="text-[8px] font-black text-text-inverse/40 uppercase tracking-widest whitespace-nowrap">Potenital Value</p>
                    <p className="text-xl font-black text-primary-200 font-display">₹{(customPrice * product.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-surface border-t border-border-light flex flex-col sm:flex-row gap-3 relative z-20">
          <button
            onClick={() => handleAcceptPrice(customPrice)}
            className="flex-[2] py-4 bg-primary text-text-inverse font-black rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-2 relative overflow-hidden group/accept"
          >
            <div className="absolute inset-0 bg-text-inverse/10 translate-y-full group-hover/accept:translate-y-0 transition-transform duration-300"></div>
            <Target className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Deploy New Price (₹{customPrice})</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-background-secondary text-text-secondary font-black rounded-xl hover:bg-surface-secondary transition-all border border-border-light active:scale-95 uppercase tracking-widest text-[10px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceSuggestionModal;