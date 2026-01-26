import React, { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import ProductCard from '../src/components/ProductCard';
import AddProductModal from '../src/components/AddProductModal';
import PriceSuggestionModal from '../src/components/PriceSuggestionModal';
import NegotiationChat from '../src/components/NegotiationChat';
import { storage } from '../src/utils/storage';
import { Product, ProductInput, ChatSession, Message } from '../src/types';
import { config } from '../src/config';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPriceSuggestionModalOpen, setIsPriceSuggestionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);
  const [vendorLanguage, setVendorLanguage] = useState('en');

  useEffect(() => {
    const loadData = () => {
      try {
        const storedProducts = storage.getProducts();
        setProducts(storedProducts);
        const storedChatSessions = storage.getChatSessions();
        setChatSessions(storedChatSessions.filter(s => s.status === 'active' && s.messages.length > 0));

        const prefs = storage.getUserPreferences();
        if (prefs.language) {
          setVendorLanguage(prefs.language);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Sync with other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'multilingual-mandi-data') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Background poll for all updates
    const globalPoll = setInterval(() => {
      const allSessions = storage.getChatSessions();
      const activeSessions = allSessions.filter(s => s.status === 'active' && s.messages.length > 0);

      setChatSessions(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(activeSessions)) {
          return activeSessions;
        }
        return prev;
      });

      if (activeChatSession) {
        const updatedSession = allSessions.find(s => s.id === activeChatSession.id);
        if (updatedSession && updatedSession.messages.length !== activeChatSession.messages.length) {
          setActiveChatSession(updatedSession);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(globalPoll);
    };
  }, [activeChatSession]);

  // Poll for new chat sessions even when no chat is active
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const allSessions = storage.getChatSessions();
      const activeSessions = allSessions.filter(s => s.status === 'active' && s.messages.length > 0);

      // Check if there are new messages in any session
      const hasUpdates = activeSessions.some(newSession => {
        const oldSession = chatSessions.find(s => s.id === newSession.id);
        return !oldSession || oldSession.messages.length !== newSession.messages.length;
      });

      if (hasUpdates || activeSessions.length !== chatSessions.length) {
        console.log('🔄 Chat sessions list updated');
        setChatSessions(activeSessions);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [chatSessions]);

  const handleLanguageChange = (newLanguage: string) => {
    setVendorLanguage(newLanguage);
    storage.updateUserPreferences({ language: newLanguage });
  };

  const handleAddProduct = async (productInput: ProductInput) => {
    if (isAddingProduct) {
      return;
    }

    const existingProduct = products.find(p =>
      p.name.toLowerCase().trim() === productInput.name.toLowerCase().trim()
    );

    if (existingProduct) {
      alert(`A product named "${productInput.name}" already exists. Please use a different name.`);
      return;
    }

    setIsAddingProduct(true);

    try {
      const newProduct = storage.addProduct({
        ...productInput,
        currency: config.defaults.currency,
      });

      setProducts(prev => [...prev, newProduct]);

    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw so modal knows there was an error
    } finally {
      setTimeout(() => {
        setIsAddingProduct(false);
      }, 500);
    }
  };

  const addSampleProduct = () => {
    const sampleProducts = [
      { name: 'Tomato', quantity: 50, price: 40, language: 'en' },
      { name: 'Onion', quantity: 30, price: 35, language: 'hi' },
      { name: 'Potato', quantity: 100, price: 25, language: 'en' },
      { name: 'Banana', quantity: 25, price: 60, language: 'ta' },
      { name: 'Apple', quantity: 20, price: 120, language: 'en' },
    ];

    const randomSample = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];

    const newProduct = storage.addProduct({
      ...randomSample,
      currency: config.defaults.currency,
    });

    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (productId: string) => {
    const success = storage.deleteProduct(productId);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log('Edit product:', product);
  };

  const handlePriceSuggest = (product: Product) => {
    setSelectedProduct(product);
    setIsPriceSuggestionModalOpen(true);
  };

  const handleAcceptPrice = (newPrice: number) => {
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, price: newPrice, updated_at: new Date().toISOString() };
      const success = storage.updateProductByObject(updatedProduct);

      if (success) {
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      }
    }
    setIsPriceSuggestionModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenChat = (session: ChatSession) => {
    const product = products.find(p => p.id === session.product_id);
    if (product) {
      // Refresh the session from storage to get latest messages
      const allSessions = storage.getChatSessions();
      const latestSession = allSessions.find(s => s.id === session.id);

      setSelectedProduct(product);
      setActiveChatSession(latestSession || session);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChatSession || !selectedProduct) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      sender: 'vendor',
      text: messageText,
      language: vendorLanguage,
      timestamp: new Date().toISOString()
    };

    // Translate message to buyer's language if different
    // For now, we'll assume buyer language from the last buyer message
    const lastBuyerMessage = activeChatSession.messages
      .filter(m => m.sender === 'buyer')
      .pop();

    if (lastBuyerMessage && lastBuyerMessage.language !== vendorLanguage) {
      try {
        const response = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: messageText,
            source_language: vendorLanguage,
            target_language: lastBuyerMessage.language
          })
        });

        const data = await response.json();
        if (data.success && data.data) {
          // Ensure translated_text is a string, not an object
          const translatedText = data.data.translated_text;
          if (typeof translatedText === 'string') {
            newMessage.translated_text = translatedText;
          } else if (translatedText && typeof translatedText === 'object') {
            // Handle case where API returns an object instead of string
            newMessage.translated_text = (translatedText as any).response || (translatedText as any).text || JSON.stringify(translatedText);
          } else {
            newMessage.translated_text = String(translatedText || messageText);
          }
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
      // Update or add to chat sessions list
      setChatSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === updatedSession.id);
        if (existingIndex >= 0) {
          return prev.map(s => s.id === updatedSession.id ? updatedSession : s);
        } else {
          return [...prev, updatedSession];
        }
      });
    }
  };

  const handleCloseChat = () => {
    setActiveChatSession(null);
    setSelectedProduct(null);
  };

  const handleClearChatMessages = () => {
    if (!activeChatSession) return;

    const updatedSession = storage.updateChatSession(activeChatSession.id, {
      messages: []
    });

    if (updatedSession) {
      // Remove from active chats list since it has no messages
      setChatSessions(prev => prev.filter(s => s.id !== updatedSession.id));
      // Close the chat
      setActiveChatSession(null);
      setSelectedProduct(null);
    }
  };

  const storageInfo = storage.getStorageInfo();
  const storageUsedPercent = (storageInfo.used / storageInfo.total) * 100;

  if (loading) {
    return (
      <Layout title="Dashboard - Multilingual Mandi" description="Manage your products and get AI-powered insights">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Vendor Dashboard - Multilingual Mandi" description="Manage your products and get AI-powered insights">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-orange-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl sm:text-4xl">🛒</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                      Welcome to Your Dashboard
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base font-medium mt-1">
                      मल्टीलिंगुअल मंडी • Multilingual Mandi
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl mb-4">
                  Manage your products, get AI-powered pricing insights, and communicate with buyers across language barriers.
                  <span className="block mt-2 text-white/70 text-sm sm:text-base">
                    🇮🇳 Empowering local markets with cutting-edge technology
                  </span>
                </p>

                {/* Language Selector */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md">
                  <span className="text-white/90 font-semibold text-sm">Your Language:</span>
                  <select
                    value={vendorLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
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

              <div className="flex flex-col gap-3 lg:flex-shrink-0 lg:w-64">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full px-6 py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all duration-200 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">➕</span>
                    <span>Add Product</span>
                  </span>
                </button>
                <button
                  onClick={addSampleProduct}
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span>Try Sample</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {products.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 -mt-8 sm:-mt-10 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Total Products</p>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-emerald-600 text-sm font-medium mt-1">Active listings</p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Total Value</p>
                    <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                      ₹{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm font-medium mt-1">Inventory worth</p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Total Quantity</p>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                      {products.reduce((sum, p) => sum + p.quantity, 0)} kg
                    </p>
                    <p className="text-gray-600 text-sm font-medium mt-1">Available stock</p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">⚖️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200 cursor-pointer" onClick={() => chatSessions.length > 0 && handleOpenChat(chatSessions[0])}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Active Chats</p>
                    <p className="text-3xl sm:text-4xl font-bold text-orange-600">
                      {chatSessions.length}
                    </p>
                    <p className="text-gray-600 text-sm font-medium mt-1">
                      {chatSessions.length > 0 ? 'Click to view' : 'No messages'}
                    </p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">💬</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          {/* Storage Usage Indicator */}
          {storageUsedPercent > 50 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">
                      Storage Usage: {storageUsedPercent.toFixed(1)}%
                    </h3>
                    <p className="text-sm text-amber-700">
                      {(storageInfo.used / 1024).toFixed(1)} KB used of {(storageInfo.total / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-3 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <span className="text-5xl sm:text-6xl">📦</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Ready to start selling?
                </h3>
                <p className="text-gray-600 mb-10 leading-relaxed text-base sm:text-lg px-4">
                  Create your first product listing and join thousands of vendors using AI-powered tools to grow their business.
                  <span className="block mt-2 text-emerald-600 font-semibold">
                    🚀 Get started in seconds!
                  </span>
                </p>
                <div className="space-y-4 px-4">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-2 text-lg"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-2xl">🚀</span>
                      <span>Add Your First Product</span>
                    </span>
                  </button>
                  <p className="text-sm text-gray-500">
                    Or try a <button onClick={addSampleProduct} className="text-emerald-600 hover:text-emerald-700 font-semibold underline decoration-2 underline-offset-2">sample product</button> to explore features
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Products</h2>
                  <p className="text-gray-600 text-base sm:text-lg">Manage your inventory and get AI insights</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full font-medium">
                    {products.length} products
                  </span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="hidden sm:flex px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 items-center gap-2"
                  >
                    <span>➕</span>
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id}>
                    <ProductCard
                      product={product}
                      onDelete={() => handleDeleteProduct(product.id)}
                      onEdit={() => handleEditProduct(product)}
                      onPriceSuggest={() => handlePriceSuggest(product)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Development Tools */}
          {config.app.environment === 'development' && (
            <div className="mt-16 bg-gray-100 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span>🛠️</span>
                <span>Development Tools</span>
              </h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Add Product
                </button>
                <button
                  onClick={addSampleProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add Sample
                </button>
                <button
                  onClick={() => {
                    const data = storage.exportData();
                    console.log('Exported data:', data);
                    navigator.clipboard.writeText(data);
                    alert('Data exported to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Export Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Clear all data? This cannot be undone.')) {
                      storage.clearAllData();
                      setProducts([]);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center lg:hidden"
          aria-label="Add new product"
        >
          <span className="text-2xl">➕</span>
        </button>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
          defaultLanguage={vendorLanguage}
        />

        {selectedProduct && (
          <PriceSuggestionModal
            isOpen={isPriceSuggestionModalOpen}
            onClose={() => {
              setIsPriceSuggestionModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onAcceptPrice={handleAcceptPrice}
          />
        )}

        {/* Chat Modal */}
        {activeChatSession && selectedProduct && (
          <NegotiationChat
            chatSession={activeChatSession}
            product={selectedProduct}
            onSendMessage={handleSendMessage}
            onClose={handleCloseChat}
            onClearMessages={handleClearChatMessages}
            userRole="vendor"
            userLanguage={vendorLanguage}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
