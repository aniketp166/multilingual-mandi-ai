import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Play, Package, IndianRupee, Scale, MessageSquare, Globe, AlertTriangle, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Layout from '../src/components/Layout';
import ProductCard from '../src/components/ProductCard';

const AddProductModal = dynamic(() => import('../src/components/AddProductModal'), { ssr: false });
const PriceSuggestionModal = dynamic(() => import('../src/components/PriceSuggestionModal'), { ssr: false });
const NegotiationChat = dynamic(() => import('../src/components/NegotiationChat'), { ssr: false });
import { storage } from '../src/utils/storage';
import { Product, ProductInput, ChatSession, Message } from '../src/types';
import { config } from '../src/config';

import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPriceSuggestionModalOpen, setIsPriceSuggestionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);
  const [vendorLanguage, setVendorLanguage] = useState('en');
  const [isChatListModalOpen, setIsChatListModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedProducts = storage.getProducts();
        setProducts(storedProducts);

        const allSessions = storage.getChatSessions();
        const activeSessions = allSessions
          .filter(s => s.status === 'active' && s.messages.length > 0 && storedProducts.some(p => p.id === s.product_id))
          .sort((a, b) => {
            const timeA = new Date(a.messages[a.messages.length - 1]?.timestamp || 0).getTime();
            const timeB = new Date(b.messages[b.messages.length - 1]?.timestamp || 0).getTime();
            return timeB - timeA;
          });

        setChatSessions(activeSessions);

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

    // Listen for changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'multilingual-mandi-data') {
        loadData();
      }
    };

    // Listen for changes from the same tab (dispatched by storage utility)
    const handleLocalStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleLocalStorageChange);
    };
  }, []); // Only run on mount

  useEffect(() => {
    const pollInterval = setInterval(() => {
      const allSessions = storage.getChatSessions();
      const activeSessions = allSessions.filter(s => s.status === 'active' && s.messages.length > 0);

      const hasUpdates = activeSessions.some(newSession => {
        const oldSession = chatSessions.find(s => s.id === newSession.id);
        return !oldSession || oldSession.messages.length !== newSession.messages.length;
      });

      if (hasUpdates || activeSessions.length !== chatSessions.length) {
        setChatSessions(activeSessions);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [chatSessions]);

  const handleLanguageChange = (newLanguage: string) => {
    setVendorLanguage(newLanguage);
    storage.updateUserPreferences({ language: newLanguage });
    i18n.changeLanguage(newLanguage);
  };

  const handleAddProduct = async (productInput: ProductInput) => {
    if (isAddingProduct) return;

    if (editingProduct) {
      try {
        const updatedProduct = {
          ...editingProduct,
          ...productInput,
          updated_at: new Date().toISOString()
        };

        const success = storage.updateProductByObject(updatedProduct);

        if (success) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
          setEditingProduct(null);
        } else {
          alert('Failed to update product');
        }
      } catch (error) {
        console.error('Error updating product:', error);
        alert(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
      }
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
      throw error;
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
    if (confirm('Are you sure you want to delete this product? All active chats for this product will also be archived.')) {
      const success = storage.deleteProduct(productId);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        const allSessions = storage.getChatSessions();
        allSessions.forEach(session => {
          if (session.product_id === productId) {
            storage.updateChatSession(session.id, { status: 'archived' });
          }
        });
        setChatSessions(prev => prev.filter(s => s.product_id !== productId));
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
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
      const allSessions = storage.getChatSessions();
      const latestSession = allSessions.find(s => s.id === session.id);
      setSelectedProduct(product);
      setActiveChatSession(latestSession || session);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChatSession || !selectedProduct) return;

    setIsSending(true);
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      sender: 'vendor',
      text: messageText,
      language: vendorLanguage,
      timestamp: new Date().toISOString()
    };

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
          newMessage.translated_text = data.data.translated_text;
        }
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    const updatedMessages = [...activeChatSession.messages, newMessage];
    const updatedSession = storage.updateChatSession(activeChatSession.id, {
      messages: updatedMessages
    });

    if (updatedSession) {
      setActiveChatSession(updatedSession);
      setChatSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === updatedSession.id);
        if (existingIndex >= 0) {
          return prev.map(s => s.id === updatedSession.id ? updatedSession : s);
        } else {
          return [...prev, updatedSession];
        }
      });
    }
    setIsSending(false);
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
      setChatSessions(prev => prev.filter(s => s.id !== updatedSession.id));
      setActiveChatSession(null);
      setSelectedProduct(null);
    }
  };

  const storageInfo = storage.getStorageInfo();
  const storageUsedPercent = (storageInfo.used / storageInfo.total) * 100;

  if (loading) {
    return (
      <Layout title="Dashboard - Multilingual Mandi">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-text-secondary font-medium">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Vendor Dashboard - Multilingual Mandi" description="Manage your products and get AI-powered insights">
      <div className="min-h-screen bg-background-secondary font-sans selection:bg-primary-100 selection:text-primary-dark">
        {/* Hero Section */}
        <div className="bg-primary-dark text-text-inverse relative overflow-hidden font-display">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-saffron/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 py-14 relative">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
              <div className="flex-1 space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-text-inverse/10 backdrop-blur-md px-3 py-1 rounded-xl border border-text-inverse/10 shadow-lg">
                    <LayoutDashboard className="w-3.5 h-3.5 text-primary-200" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-100">Vendor Command Center</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none">
                    Market <span className="text-primary-200">Overview</span>
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-text-inverse/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-text-inverse/20 shadow-lg">
                    <Globe className="w-4 h-4 text-primary-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-inverse/80">Market Language</span>
                    <select
                      value={vendorLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-transparent text-text-inverse font-black text-xs focus:outline-none cursor-pointer outline-none"
                    >
                      <option value="en" className="bg-surface text-text-primary">English</option>
                      <option value="hi" className="bg-surface text-text-primary">हिंदी (Hindi)</option>
                      <option value="ta" className="bg-surface text-text-primary">தமிழ் (Tamil)</option>
                      <option value="te" className="bg-surface text-text-primary">తెలుగు (Telugu)</option>
                      <option value="bn" className="bg-surface text-text-primary">বাংলা (Bengali)</option>
                      <option value="mr" className="bg-surface text-text-primary">मराठी (Marathi)</option>
                      <option value="gu" className="bg-surface text-text-primary">ગુજરાતી (Gujarati)</option>
                      <option value="kn" className="bg-surface text-text-primary">ಕನ್ನಡ (Kannada)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-text-inverse text-primary-dark font-black rounded-xl shadow-lg hover:shadow-primary-dark/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-xs uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD LISTING</span>
                </button>
                <button
                  onClick={addSampleProduct}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-primary/40 backdrop-blur-xl text-text-inverse font-black rounded-xl border border-text-inverse/10 hover:bg-primary/60 transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>DEMO DATA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Stats Cards */}
        {products.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 -mt-4 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Inventory', value: products.length, sub: 'Active Items', icon: Package, color: 'text-primary', bg: 'bg-primary-50' },
                { label: 'Total Value', value: `₹${products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}`, sub: 'Estimated Worth', icon: IndianRupee, color: 'text-primary', bg: 'bg-primary-50' },
                { label: 'Stock Level', value: `${products.reduce((sum, p) => sum + p.quantity, 0)}kg`, sub: 'Total Quantity', icon: Scale, color: 'text-info', bg: 'bg-info-light/10' },
                { label: 'Active Chats', value: chatSessions.length, sub: 'Customer Queries', icon: MessageSquare, color: 'text-secondary', bg: 'bg-secondary-50', action: () => chatSessions.length > 0 && setIsChatListModalOpen(true) }
              ].map((stat, i) => (
                <div
                  key={i}
                  onClick={stat.action}
                  className={`group bg-surface rounded-[1.5rem] p-6 shadow-lg border border-border-light hover:border-primary-200 transition-all duration-500 hover:-translate-y-1 ${stat.action ? 'cursor-pointer hover:shadow-primary-100/30' : 'cursor-default'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 ${stat.bg} rounded-xl group-hover:scale-105 transition-transform duration-500`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.15em] mb-1">{stat.label}</h3>
                    <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                    <p className="text-[10px] font-bold text-text-tertiary mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          {/* Storage Usage Indicator */}
          {storageUsedPercent > 50 && (
            <div className="bg-warning-light/10 border border-warning-light/30 rounded-2xl p-6 mb-8 animate-fade-in">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-warning-light/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-warning-dark">
                      Storage Usage: {storageUsedPercent.toFixed(1)}%
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {(storageInfo.used / 1024).toFixed(1)} KB used of {(storageInfo.total / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-32 h-3 bg-surface rounded-full overflow-hidden border border-border-light">
                  <div
                    className="h-full bg-warning transition-all duration-500"
                    style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 scale-110">
                    <Package className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
                  </div>
                  <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-secondary animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight font-display">
                    Start Your Digital <span className="text-primary">Mandi</span>
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed px-4">
                    Join thousands of local vendors using AI to break language barriers and grow their business globally.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-10 py-5 bg-primary text-text-inverse font-black rounded-2xl shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-2 text-lg active:scale-95"
                  >
                    🚀 CREATE FIRST LISTING
                  </button>
                  <button
                    onClick={addSampleProduct}
                    className="w-full sm:w-auto px-10 py-5 bg-surface text-text-secondary font-black rounded-2xl border border-border hover:bg-surface-secondary transition-all duration-300 text-lg active:scale-95"
                  >
                    EXPLORE DEMO
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight font-display">Your Inventory</h2>
                  <p className="text-text-secondary text-lg">Manage listings and monitor AI-powered insights</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-surface px-4 py-2 rounded-xl border border-border-light shadow-sm">
                    <span className="text-sm font-black text-primary uppercase tracking-wider">{products.length} Items</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, i) => (
                  <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
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

          {/* Development Tools Enhanced */}
          {config.app.environment === 'development' && (
            <div className="mt-24 bg-surface rounded-[2rem] p-8 border border-border shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
              <h4 className="text-xl font-black mb-6 text-text-primary flex items-center gap-3 font-display">
                <span className="bg-primary/10 p-2 rounded-lg">🛠️</span>
                <span>Command Center (Dev)</span>
              </h4>
              <div className="flex flex-wrap gap-4 relative z-10">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-primary text-text-inverse rounded-xl hover:bg-primary-dark transition-all font-black text-sm active:scale-95 shadow-lg shadow-primary/20"
                >
                  ADD PRODUCT
                </button>
                <button
                  onClick={addSampleProduct}
                  className="px-6 py-3 bg-info text-text-inverse rounded-xl hover:bg-info-dark transition-all font-black text-sm active:scale-95 shadow-lg shadow-info/20"
                >
                  INJECT SAMPLE
                </button>
                <button
                  onClick={() => {
                    const data = storage.exportData();
                    navigator.clipboard.writeText(data);
                    alert('Data exported to clipboard!');
                  }}
                  className="px-6 py-3 bg-surface text-text-primary border border-border rounded-xl hover:bg-surface-secondary transition-all font-black text-sm active:scale-95"
                >
                  EXPORT JSON
                </button>
                <button
                  onClick={() => {
                    if (confirm('Wipe everything?')) {
                      storage.clearAllData();
                      setProducts([]);
                    }
                  }}
                  className="px-6 py-3 bg-error text-text-inverse rounded-xl hover:bg-error-dark transition-all font-black text-sm active:scale-95 shadow-lg shadow-error/20"
                >
                  PURGE DATA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-primary text-text-inverse rounded-full shadow-2xl hover:shadow-primary-dark/40 transition-all duration-300 transform hover:scale-110 active:scale-90 z-40 flex items-center justify-center lg:hidden hover:rotate-90"
          aria-label="Add new product"
        >
          <Plus className="w-10 h-10" />
        </button>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleAddProduct}
          defaultLanguage={vendorLanguage}
          editProduct={editingProduct}
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

        {/* Chat List Modal Enhanced */}
        {isChatListModalOpen && (
          <div className="fixed inset-0 bg-text-primary/60 backdrop-blur-md flex items-center justify-center z-[9998] p-4 animate-fade-in">
            <div className="bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] animate-scale-in border border-text-inverse/10">
              <div className="p-8 border-b border-border-light flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary font-display">Active Chats</h3>
                </div>
                <button onClick={() => setIsChatListModalOpen(false)} className="text-text-tertiary hover:text-text-primary transition-colors text-3xl font-light">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-text-tertiary">No active conversations found.</p>
                  </div>
                ) : (
                  chatSessions.map(session => {
                    const product = products.find(p => p.id === session.product_id);
                    const lastMessage = session.messages[session.messages.length - 1];
                    return (
                      <div
                        key={session.id}
                        onClick={() => {
                          handleOpenChat(session);
                          setIsChatListModalOpen(false);
                        }}
                        className="p-5 bg-surface-secondary rounded-2xl border border-border-light hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer group flex items-center gap-4"
                      >
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-primary truncate pr-2">{product?.name || 'Deleted Product'}</span>
                            <span className="text-[10px] font-black text-text-tertiary whitespace-nowrap">
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-1 italic group-hover:text-primary-dark">
                            &quot;{lastMessage.text}&quot;
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
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
            isSending={isSending}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
