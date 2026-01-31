import { useState, useEffect, useRef } from 'react';
import { Send, X, Trash2, Sparkles, MessageSquare, ChevronRight, Languages, Zap, IndianRupee } from 'lucide-react';
import { ChatSession, Product } from '../types';

interface NegotiationChatProps {
  chatSession: ChatSession;
  product: Product;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onClearMessages?: () => void;
  userRole: 'vendor' | 'buyer';
  userLanguage: string;
  isSending?: boolean;
}

export default function NegotiationChat({
  chatSession,
  product,
  onSendMessage,
  onClose,
  onClearMessages,
  userRole,
  userLanguage,
  isSending = false
}: NegotiationChatProps) {
  const [messageText, setMessageText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedMessageId = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSession.messages]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (userRole === 'vendor' && chatSession.messages.length > 0) {
      const lastMessage = chatSession.messages[chatSession.messages.length - 1];

      if (lastMessage.sender === 'buyer' && lastMessage.id !== lastProcessedMessageId.current) {
        lastProcessedMessageId.current = lastMessage.id;
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
        const rawSuggestions = data.data.suggestions || [];
        const sanitized = rawSuggestions.map((s: any) => {
          if (typeof s === 'string') return s;
          if (s && typeof s === 'object') {
            const obj = s as Record<string, any>;
            return String(obj.response || obj.text || obj.suggestion || JSON.stringify(s));
          }
          return String(s || '');
        });
        setSuggestions(sanitized);
      } else {
        setSuggestions([
          "Is that your best price?",
          "Can you do it for a bit less?",
          "I'm interested in buying more."
        ]);
      }
    } catch (error) {
      console.error('Error fetching negotiation suggestions:', error);
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
    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in font-sans">
      <div className="bg-surface rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-border-light">
        {/* Chat Header */}
        <div className="bg-primary text-text-inverse p-5 flex justify-between items-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-text-inverse/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-text-inverse/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-text-inverse/20 group-hover:rotate-6 transition-transform">
              <Zap className="w-6 h-6 text-primary-200" />
            </div>
            <div className="space-y-0.5 font-display">
              <h2 className="text-xl font-black tracking-tight">{product.name}</h2>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-text-inverse/70">
                <span className="bg-text-inverse/20 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                  <IndianRupee className="w-2.5 h-2.5" /> {product.price}/kg
                </span>
                <span className="w-1 h-1 bg-text-inverse/40 rounded-full"></span>
                <span>{product.quantity}kg Stock</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {onClearMessages && chatSession.messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all messages in this chat?')) {
                    onClearMessages();
                  }
                }}
                className="text-text-inverse hover:bg-text-inverse/20 rounded-xl p-3 transition-all active:scale-90"
                aria-label="Clear messages"
                title="Clear all messages"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-text-inverse hover:bg-text-inverse/20 rounded-xl p-3 transition-all active:scale-90"
              aria-label="Close chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background-secondary scrollbar-hide min-h-0">
          {chatSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center shadow-xl border border-border-light animate-bounce-gentle">
                <MessageSquare className="w-10 h-10 text-primary-200" />
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-text-primary uppercase tracking-tight font-display">No messages yet</p>
                <p className="text-sm text-text-tertiary font-medium">Start the negotiation now!</p>
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
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-slide-up group`}
                  >
                    <div className={`max-w-[85%] sm:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'} space-y-2`}>
                      <div
                        className={`px-5 py-4 shadow-md transition-all duration-300 ${isCurrentUser
                          ? 'bg-primary text-text-inverse rounded-3xl rounded-br-none shadow-primary/20'
                          : 'bg-surface text-text-primary border border-border-light rounded-3xl rounded-bl-none shadow-md'
                          }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
                          {(() => {
                            const textToDisplay = isCurrentUser
                              ? (displayingOriginal ? (message.translated_text || message.text) : message.text)
                              : (displayingOriginal ? message.text : (message.translated_text || message.text));

                            if (typeof textToDisplay === 'object') {
                              return JSON.stringify(textToDisplay);
                            }
                            return textToDisplay;
                          })()}
                        </p>
                      </div>
                      <div className={`flex items-center gap-3 px-1 ${isCurrentUser ? 'justify-end' : 'justify-start'} transition-opacity group-hover:opacity-100`}>
                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{formatTime(message.timestamp)}</span>
                        {message.translated_text && (
                          <button
                            onClick={() => toggleShowOriginal(message.id)}
                            className="bg-primary-50 text-[10px] font-black text-primary hover:bg-primary-100 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 uppercase tracking-[0.1em]"
                          >
                            <Languages className="w-3 h-3" />
                            {isCurrentUser
                              ? (displayingOriginal ? 'Original' : 'Translated')
                              : (displayingOriginal ? 'Translated' : 'Original')
                            }
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

        {/* AI Suggestions Section */}
        {userRole === 'vendor' && (loadingSuggestions || suggestions.length > 0) && (
          <div className="border-t border-border-light p-5 bg-surface max-h-48 overflow-y-auto flex-shrink-0">
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="p-2 bg-secondary-50 border border-secondary-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              </div>
              <p className="text-xs font-black text-secondary-dark uppercase tracking-[0.2em] font-display">
                {loadingSuggestions ? 'AI Crafting Replies...' : 'AI Negotiator Ready'}
              </p>
            </div>
            {loadingSuggestions ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseSuggestion(suggestion)}
                    className="w-full text-left text-xs sm:text-sm px-5 py-4 bg-background-secondary border border-border-light text-text-primary rounded-2xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-300 shadow-sm active:scale-[0.98] leading-relaxed relative group/sugg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="relative z-10 font-bold pr-4">
                        {suggestion}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-tertiary group-hover/sugg:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border-light p-5 sm:p-6 bg-surface relative z-20">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                placeholder={isSending ? "Translating..." : "Ask your price..."}
                disabled={isSending}
                className={`w-full px-6 py-5 bg-background-secondary border-none rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-surface border border-transparent focus:border-primary-100 transition-all text-sm sm:text-base outline-none shadow-inner font-medium placeholder:text-text-tertiary ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending}
              className="bg-primary hover:bg-primary-dark active:bg-primary-dark/80 text-text-inverse p-5 rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100 transition-all duration-300 group active:scale-95 flex items-center justify-center min-w-[60px] sm:min-w-[70px]"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-text-inverse border-t-transparent"></div>
              ) : (
                <Send className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
