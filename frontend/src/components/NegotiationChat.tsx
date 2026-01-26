import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Message, Product } from '../types';

interface NegotiationChatProps {
  chatSession: ChatSession;
  product: Product;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  userRole: 'vendor' | 'buyer';
  userLanguage: string;
}

export default function NegotiationChat({
  chatSession,
  product,
  onSendMessage,
  onClose,
  userRole,
  userLanguage
}: NegotiationChatProps) {
  const [messageText, setMessageText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedMessageId = useRef<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSession.messages]);

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Fetch AI suggestions when buyer sends a message (for vendor)
  useEffect(() => {
    if (userRole === 'vendor' && chatSession.messages.length > 0) {
      const lastMessage = chatSession.messages[chatSession.messages.length - 1];
      
      // Only fetch if it's a buyer message AND we haven't processed it yet
      if (lastMessage.sender === 'buyer' && lastMessage.id !== lastProcessedMessageId.current) {
        lastProcessedMessageId.current = lastMessage.id;
        fetchNegotiationSuggestions(lastMessage.text);
      }
    }
  }, [chatSession.messages.length, userRole]); // Only depend on message count, not the array itself

  const fetchNegotiationSuggestions = async (buyerMessage: string) => {
    setLoadingSuggestions(true);
    try {
      const response = await fetch('/api/ai/negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            name: product.name,
            price: product.price,
            quantity: product.quantity
          },
          buyer_message: buyerMessage,
          vendor_language: userLanguage,
          conversation_history: chatSession.messages
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSuggestions(data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching negotiation suggestions:', error);
      setSuggestions([
        "Thank you for your interest in our products.",
        "Let me see what I can offer you.",
        "I appreciate your business."
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
      setSuggestions([]);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setMessageText(suggestion);
  };

  const toggleShowOriginal = (messageId: string) => {
    setShowOriginal(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-0 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col my-auto transition-all duration-300 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 sm:p-6 sm:rounded-t-2xl flex justify-between items-center shadow-lg relative z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{product.name}</h2>
            <p className="text-sm text-emerald-100 flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded">₹{product.price}/kg</span>
              <span>•</span>
              <span>{product.quantity}kg available</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2.5 transition-all duration-200 active:scale-90"
            aria-label="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 scrollbar-hide">
          {chatSession.messages.map((message) => {
            const isCurrentUser = message.sender === userRole;
            const displayingOriginal = showOriginal[message.id];

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div className={`max-w-[85%] sm:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 shadow-sm ${isCurrentUser
                      ? 'bg-emerald-500 text-white rounded-2xl rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-none'
                      }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed">
                      {displayingOriginal && message.translated_text
                        ? message.text
                        : message.translated_text || message.text}
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 mt-1.5 px-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-400">{formatTime(message.timestamp)}</span>
                    {message.translated_text && (
                      <button
                        onClick={() => toggleShowOriginal(message.id)}
                        className="text-[10px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider"
                      >
                        {displayingOriginal ? 'Show translation' : 'Show original'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestions (for vendor only) */}
        {userRole === 'vendor' && suggestions.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-emerald-50/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-xl animate-bounce-gentle">💡</span>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                AI Suggested Replies
              </p>
            </div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-hide">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleUseSuggestion(suggestion)}
                  className="w-full text-left text-xs sm:text-sm px-4 py-3 bg-white/80 border border-emerald-100/50 text-emerald-900 rounded-2xl hover:bg-white hover:border-emerald-300 transition-all duration-200 shadow-sm active:scale-[0.98] leading-relaxed relative group"
                >
                  <span className="relative z-10">{suggestion}</span>
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl transition-colors"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4 sm:p-6 bg-white sm:rounded-b-2xl shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full pl-4 pr-12 py-3 sm:py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm sm:text-base outline-none shadow-inner"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white p-3 sm:p-4 rounded-2xl shadow-lg shadow-emerald-200 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100 transition-all duration-200 group active:scale-95"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
