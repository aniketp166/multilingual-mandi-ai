import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Globe, MessageSquare, Package, IndianRupee, Languages, Sparkles } from 'lucide-react';
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
  const [isSending, setIsSending] = useState(false);

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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'multilingual-mandi-data') {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const pollInterval = setInterval(() => {
      if (activeChatSession) {
        const allSessions = storage.getChatSessions();
        const updatedSession = allSessions.find(s => s.id === activeChatSession.id);

        if (updatedSession && updatedSession.messages.length !== activeChatSession.messages.length) {
          setActiveChatSession(updatedSession);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [activeChatSession]);

  const loadProducts = () => {
    const allProducts = storage.getProducts();
    setProducts(allProducts);
  };

  const handleStartChat = (product: Product) => {
    setSelectedProduct(product);
    const existingSessions = storage.getChatSessions();
    const existingSession = existingSessions.find(
      session => session.product_id === product.id && session.status === 'active'
    );

    if (existingSession) {
      setActiveChatSession(existingSession);
    } else {
      const newSession = storage.addChatSession({
        product_id: product.id,
        vendor_id: 'vendor_1',
        buyer_id: 'buyer_1',
        messages: [],
        status: 'active'
      });
      setActiveChatSession(newSession);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChatSession || !selectedProduct) return;

    setIsSending(true);
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      sender: 'buyer',
      text: messageText,
      language: buyerLanguage,
      timestamp: new Date().toISOString()
    };

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

    const updatedMessages = [...activeChatSession.messages, newMessage];
    const updatedSession = storage.updateChatSession(activeChatSession.id, {
      messages: updatedMessages
    });

    if (updatedSession) {
      setActiveChatSession(updatedSession);
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
      setActiveChatSession(null);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Browse Marketplace - Multilingual Mandi" description="Discover fresh products in your local language">
      <div className="min-h-screen bg-background-secondary font-sans selection:bg-primary-100 selection:text-primary-dark">
        {/* Hero Section */}
        <div className="bg-primary-dark text-text-inverse relative overflow-hidden font-display">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-light/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-6 py-6 lg:py-8 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
              <div className="flex-1 space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-text-inverse/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-text-inverse/10 shadow-xl">
                    <ShoppingBag className="w-5 h-5 text-primary-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-100">Live Marketplace</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.9]">
                    Find Fresh <span className="text-primary-200">Produce</span>
                  </h1>
                  <p className="text-text-inverse/80 text-lg max-w-2xl font-medium leading-relaxed italic">
                    Discover products from local vendors and negotiate in your heart&apos;s language.
                  </p>
                </div>
              </div>

              {/* Language Selector Enhanced */}
              <div className="flex flex-col gap-4 animate-slide-up">
                <div className="relative group">
                  <div className="absolute inset-0 bg-text-inverse/5 rounded-2xl blur-xl group-hover:bg-text-inverse/10 transition-colors"></div>
                  <div className="relative flex items-center gap-4 bg-text-inverse/10 backdrop-blur-xl rounded-2xl p-2 pl-5 border border-text-inverse/20 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary-200" />
                      <span className="text-xs font-black uppercase tracking-widest text-text-inverse/70">Your Language</span>
                    </div>
                    <select
                      value={buyerLanguage}
                      onChange={(e) => setBuyerLanguage(e.target.value)}
                      className="appearance-none bg-text-inverse text-primary-dark px-6 py-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 cursor-pointer shadow-lg outline-none"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          {/* Enhanced Search Bar */}
          <div className="mb-16 animate-fade-in">
            <div className="relative group max-w-2xl">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-tertiary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="What are you looking for today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-6 pl-16 bg-surface border border-border-light rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-xl shadow-gray-200/50 text-lg font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 sm:py-32">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-primary-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl scale-110">
                    <Search className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-text-primary tracking-tight font-display">
                    {searchQuery ? `No matches for "${searchQuery}"` : "The Mandi is Empty"}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    Try adjusting your search or check back later. Products are added every minute!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-12 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-text-primary font-display tracking-tight">Market Offerings</h2>
                  <p className="text-text-secondary font-medium">Found {filteredProducts.length} fresh products available now</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="group relative bg-surface rounded-[2.5rem] shadow-xl border border-border-light overflow-hidden hover:border-primary-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                    {/* Header */}
                    <div className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <Package className="w-8 h-8 text-primary" />
                        </div>
                        <div className="px-3 py-1.5 bg-secondary-50 border border-secondary-100 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Languages className="w-3 h-3 text-secondary" />
                          <span className="text-[10px] font-black text-secondary-dark uppercase tracking-widest">
                            {getLanguageName(product.language)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-text-primary group-hover:text-primary transition-colors font-display truncate">
                        {product.name}
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="px-8 py-6 flex flex-col gap-4">
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-text-tertiary uppercase tracking-widest">Price / KG</p>
                          <div className="flex items-baseline gap-1">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            <p className="text-4xl font-black text-primary tracking-tighter">
                              {product.price}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[11px] font-black text-text-tertiary uppercase tracking-widest">Availability</p>
                          <p className="text-xl font-black text-text-primary">{product.quantity} KG</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartChat(product)}
                        className="group/btn w-full mt-4 flex items-center justify-center gap-3 px-6 py-5 bg-primary text-text-inverse font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-95 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-text-inverse/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <MessageSquare className="w-6 h-6 relative z-10 group-hover/btn:rotate-12 transition-transform" />
                        <span className="relative z-10 uppercase tracking-[0.1em] text-sm">Negotiate Deal</span>
                        <Sparkles className="w-4 h-4 text-secondary-light absolute top-2 right-4 animate-pulse" />
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
            onClearMessages={handleClearChatMessages}
            userRole="buyer"
            userLanguage={buyerLanguage}
            isSending={isSending}
          />
        )}
      </div>
    </Layout>
  );
}
