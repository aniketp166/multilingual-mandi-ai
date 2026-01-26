import React, { useState, useEffect } from 'react';
import { Product, ChatSession, Message } from '../src/types';
import { storage } from '../src/utils/storage';
import Layout from '../src/components/Layout';
import NegotiationChat from '../src/components/NegotiationChat';

export default function BuyerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);
  const [buyerLanguage, setBuyerLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'हिंदी',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'bn': 'বাংলা',
      'mr': 'मराठी',
      'gu': 'ગુજરાતી',
      'kn': 'ಕನ್ನಡ'
    };
    return languages[code] || code.toUpperCase();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = storage.getProducts();
    setProducts(allProducts);
  };

  const handleStartChat = (product: Product) => {
    setSelectedProduct(product);
    
    // Check if there's an existing chat session for this product
    const existingSessions = storage.getChatSessions();
    const existingSession = existingSessions.find(
      session => session.product_id === product.id && session.status === 'active'
    );

    if (existingSession) {
      setActiveChatSession(existingSession);
    } else {
      // Create new chat session
      const newSession = storage.addChatSession({
        product_id: product.id,
        vendor_id: 'vendor_1', // In a real app, this would be dynamic
        buyer_id: 'buyer_1', // In a real app, this would be the logged-in buyer
        messages: [],
        status: 'active'
      });
      setActiveChatSession(newSession);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChatSession || !selectedProduct) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'buyer',
      text: messageText,
      language: buyerLanguage,
      timestamp: new Date().toISOString()
    };

    // Translate message to vendor's language if different
    if (buyerLanguage !== selectedProduct.language) {
      try {
        console.log('Translating buyer message from', buyerLanguage, 'to', selectedProduct.language);
        const response = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: messageText,
            source_language: buyerLanguage,
            target_language: selectedProduct.language
          })
        });

        console.log('Translation API response status:', response.status);
        const data = await response.json();
        console.log('Translation API response data:', data);
        
        if (data.success && data.data) {
          newMessage.translated_text = data.data.translated_text;
        } else {
          console.error('Translation API returned unsuccessful response:', data);
        }
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    // Update chat session with new message
    const updatedMessages = [...activeChatSession.messages, newMessage];
    const updatedSession = storage.updateChatSession(activeChatSession.id, {
      messages: updatedMessages
    });

    if (updatedSession) {
      setActiveChatSession(updatedSession);
    }
  };

  const handleCloseChat = () => {
    setActiveChatSession(null);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-orange-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl sm:text-4xl">🛒</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                      Browse Products
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base font-medium mt-1">
                      Find fresh products from local vendors
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Connect with local vendors and negotiate in your preferred language.
                  <span className="block mt-2 text-white/70 text-sm sm:text-base">
                    🇮🇳 Breaking language barriers in local markets
                  </span>
                </p>
              </div>
              
              {/* Language Selector */}
              <div className="flex flex-col gap-3 lg:flex-shrink-0 lg:w-80">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <span className="text-white/90 font-semibold text-sm whitespace-nowrap">Your Language:</span>
                  <select
                    value={buyerLanguage}
                    onChange={(e) => setBuyerLanguage(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                  >
                    <option value="en" className="text-gray-900">English</option>
                    <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
                    <option value="ta" className="text-gray-900">தமிழ் (Tamil)</option>
                    <option value="te" className="text-gray-900">తెలుగు (Telugu)</option>
                    <option value="bn" className="text-gray-900">বাংলা (Bengali)</option>
                    <option value="mr" className="text-gray-900">मराठी (Marathi)</option>
                    <option value="gu" className="text-gray-900">ગુજરાતી (Gujarati)</option>
                    <option value="kn" className="text-gray-900">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-base"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <span className="text-5xl sm:text-6xl">🛒</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  No products found
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg px-4">
                  {searchQuery ? `No products match "${searchQuery}". Try a different search term.` : 'No products available at the moment. Check back later!'}
                  <span className="block mt-2 text-emerald-600 font-semibold">
                    🌟 New products added daily
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    {/* Product Header */}
                    <div className="bg-gradient-to-br from-emerald-50 to-orange-50 p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            <span>🗣️</span>
                            <span>{getLanguageName(product.language)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <p className="text-3xl font-bold text-emerald-600">
                            ₹{product.price}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">per kilogram</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{product.quantity} kg</p>
                          <p className="text-xs text-gray-500">available</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartChat(product)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">💬</span>
                        <span>Contact Vendor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chat Modal */}
        {activeChatSession && selectedProduct && (
          <NegotiationChat
            chatSession={activeChatSession}
            product={selectedProduct}
            onSendMessage={handleSendMessage}
            onClose={handleCloseChat}
            userRole="buyer"
            userLanguage={buyerLanguage}
          />
        )}
      </div>
    </Layout>
  );
}
