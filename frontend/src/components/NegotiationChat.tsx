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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSession.messages]);

  // Fetch AI suggestions when buyer sends a message (for vendor)
  useEffect(() => {
    if (userRole === 'vendor' && chatSession.messages.length > 0) {
      const lastMessage = chatSession.messages[chatSession.messages.length - 1];
      if (lastMessage.sender === 'buyer') {
        fetchNegotiationSuggestions(lastMessage.text);
      }
    }
  }, [chatSession.messages, userRole]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-sm text-emerald-100">
              ₹{product.price}/kg • {product.quantity}kg available
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-emerald-700 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {chatSession.messages.map((message) => {
            const isCurrentUser = message.sender === userRole;
            const displayingOriginal = showOriginal[message.id];

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-xl ${
                      isCurrentUser
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">
                      {displayingOriginal && message.translated_text
                        ? message.text
                        : message.translated_text || message.text}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    {message.translated_text && (
                      <button
                        onClick={() => toggleShowOriginal(message.id)}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
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
          <div className="border-t border-gray-200 p-3 bg-emerald-50">
            <p className="text-xs font-semibold text-emerald-700 mb-2">
              💡 AI Suggestions:
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleUseSuggestion(suggestion)}
                  className="w-full text-left text-sm p-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
