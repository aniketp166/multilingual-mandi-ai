import { useState, useEffect, useRef } from 'react';
import { ChatSession, Message, Product } from '../types';

interface NegotiationChatProps {
  chatSession: ChatSession;
  product: Product;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onClearMessages?: () => void;
  userRole: 'vendor' | 'buyer';
  userLanguage: string;
}

export default function NegotiationChat({
  chatSession,
  product,
  onSendMessage,
  onClose,
  onClearMessages,
  userRole,
  userLanguage
}: NegotiationChatProps) {
  const [messageText, setMessageText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedMessageId = useRef<string | null>(null);

  console.log('🔵 NegotiationChat component rendered');
  console.log('🔵 Props:', { userRole, userLanguage, productName: product.name });
  console.log('🔵 Chat session:', chatSession);

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
    console.log('🔵 NegotiationChat useEffect triggered');
    console.log('🔵 userRole:', userRole);
    console.log('🔵 chatSession.messages.length:', chatSession.messages.length);
    console.log('🔵 chatSession.messages:', chatSession.messages);

    if (userRole === 'vendor' && chatSession.messages.length > 0) {
      const lastMessage = chatSession.messages[chatSession.messages.length - 1];
      console.log('🔵 Last message:', lastMessage);
      console.log('🔵 lastProcessedMessageId.current:', lastProcessedMessageId.current);

      // Fetch suggestions if:
      // 1. It's a buyer message
      // 2. We haven't processed this message yet
      if (lastMessage.sender === 'buyer' && lastMessage.id !== lastProcessedMessageId.current) {
        console.log('🟢 Fetching suggestions for buyer message');
        lastProcessedMessageId.current = lastMessage.id;
        fetchNegotiationSuggestions(lastMessage.text);
      } else {
        console.log('🔴 Not fetching suggestions:', {
          isBuyerMessage: lastMessage.sender === 'buyer',
          alreadyProcessed: lastMessage.id === lastProcessedMessageId.current,
          lastMessageId: lastMessage.id,
          lastProcessedId: lastProcessedMessageId.current
        });
      }
    } else {
      console.log('🔴 Not vendor or no messages');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSession.messages, userRole]); // Watch the messages array itself

  const fetchNegotiationSuggestions = async (buyerMessage: string) => {
    setLoadingSuggestions(true);
    try {
      console.log('Fetching negotiation suggestions for:', buyerMessage);
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

      console.log('Negotiation API response status:', response.status);
      const data = await response.json();
      console.log('Negotiation API response data:', data);

      if (data.success && data.data) {
        setSuggestions(data.data.suggestions || []);
      } else {
        console.error('Negotiation API returned unsuccessful response:', data);
        setSuggestions([
          "Thank you for your interest in our products.",
          "Let me see what I can offer you.",
          "I appreciate your business."
        ]);
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
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold">{product.name}</h2>
            <p className="text-sm text-emerald-100 flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded">₹{product.price}/kg</span>
              <span>•</span>
              <span>{product.quantity}kg available</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onClearMessages && chatSession.messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all messages in this chat?')) {
                    onClearMessages();
                  }
                }}
                className="text-white hover:bg-white/20 rounded-full p-2.5 transition-all duration-200 active:scale-90"
                aria-label="Clear messages"
                title="Clear all messages"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
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
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 scrollbar-hide min-h-0">
          {chatSession.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation</p>
              </div>
            </div>
          ) : (
            <>
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
                        <p className="text-sm sm:text-base leading-relaxed break-words">
                          {(() => {
                            const textToDisplay = displayingOriginal && message.translated_text
                              ? message.text
                              : message.translated_text || message.text;

                            // Ensure we're rendering a string, not an object
                            if (typeof textToDisplay === 'object') {
                              console.error('Message text is an object:', textToDisplay);
                              return JSON.stringify(textToDisplay);
                            }
                            return textToDisplay;
                          })()}
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
            </>
          )}
        </div>

        {/* AI Suggestions (for vendor only) */}
        {userRole === 'vendor' && (loadingSuggestions || suggestions.length > 0) && (
          <div className="border-t border-gray-100 p-4 bg-emerald-50/40 backdrop-blur-sm max-h-64 overflow-y-auto flex-shrink-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-xl animate-bounce-gentle">💡</span>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                {loadingSuggestions ? 'Getting AI Suggestions...' : 'AI Suggested Replies'}
              </p>
            </div>
            {loadingSuggestions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseSuggestion(typeof suggestion === 'string' ? suggestion : (suggestion as any).response || JSON.stringify(suggestion))}
                    className="w-full text-left text-xs sm:text-sm px-4 py-3 bg-white/80 border border-emerald-100/50 text-emerald-900 rounded-2xl hover:bg-white hover:border-emerald-300 transition-all duration-200 shadow-sm active:scale-[0.98] leading-relaxed relative group"
                  >
                    <span className="relative z-10">
                      {typeof suggestion === 'string'
                        ? suggestion
                        : (suggestion as any).response || (suggestion as any).text || JSON.stringify(suggestion)}
                    </span>
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl transition-colors"></div>
                  </button>
                ))}
              </div>
            )}
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
