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
        const response = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: messageText,
            source_language: buyerLanguage,
            target_language: selectedProduct.language
          })
        });

        const data = await response.json();
        if (data.success && data.data) {
          newMessage.translated_text = data.data.translated_text;
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
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🛒 Browse Products
            </h1>
            <p className="text-gray-600">
              Find fresh products from local vendors
            </p>
          </div>

          {/* Language Selector */}
          <div className="mb-6 flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Your Language:
            </label>
            <select
              value={buyerLanguage}
              onChange={(e) => setBuyerLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          🗣️ Vendor speaks: {getLanguageName(product.language)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{product.price}
                      </p>
                      <p className="text-xs text-gray-500">per kg</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Available:</span>
                      <span className="font-semibold">{product.quantity} kg</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartChat(product)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  >
                    💬 Contact Vendor
                  </button>
                </div>
              ))}
            </div>
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
