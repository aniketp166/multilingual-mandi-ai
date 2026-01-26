import React, { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';
import ProductCard from '../src/components/ProductCard';
import AddProductModal from '../src/components/AddProductModal';
import PriceSuggestionModal from '../src/components/PriceSuggestionModal';
import { storage } from '../src/utils/storage';
import { Product, ProductInput } from '../src/types';
import { config } from '../src/config';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPriceSuggestionModalOpen, setIsPriceSuggestionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Load products from storage on component mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = storage.getProducts();
        setProducts(storedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Add new product with duplicate prevention
  const handleAddProduct = (productInput: ProductInput) => {
    console.log('🔵 handleAddProduct called with:', productInput);
    console.log('🔵 isAddingProduct state:', isAddingProduct);
    console.log('🔵 Current products count:', products.length);
    
    if (isAddingProduct) {
      console.log('🔴 Already adding product, ignoring duplicate request');
      return;
    }
    
    // Check for duplicate product names
    const existingProduct = products.find(p => 
      p.name.toLowerCase().trim() === productInput.name.toLowerCase().trim()
    );
    
    if (existingProduct) {
      console.log('🔴 Duplicate product name found:', existingProduct);
      alert(`A product named "${productInput.name}" already exists. Please use a different name.`);
      return;
    }
    
    console.log('🟡 Setting isAddingProduct to true');
    setIsAddingProduct(true);
    
    try {
      console.log('🟢 Adding product to storage:', productInput);
      
      const newProduct = storage.addProduct({
        ...productInput,
        currency: config.defaults.currency,
      });

      console.log('🟢 Product added to storage successfully:', newProduct);
      console.log('🟢 Reloading products from storage to ensure consistency...');
      
      // Instead of manually updating state, reload from storage to ensure consistency
      const updatedProducts = storage.getProducts();
      console.log('🟢 Reloaded products from storage:', updatedProducts.length);
      setProducts(updatedProducts);
      
    } catch (error) {
      console.error('🔴 Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      // Reset the flag after a short delay to prevent rapid double-clicks
      console.log('🟡 Resetting isAddingProduct flag in 500ms');
      setTimeout(() => {
        console.log('🟡 Resetting isAddingProduct to false');
        setIsAddingProduct(false);
      }, 500);
    }
  };

  // Add sample product for demo
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

  // Handle product deletion
  const handleDeleteProduct = (productId: string) => {
    const success = storage.deleteProduct(productId);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Handle product editing (placeholder)
  const handleEditProduct = (product: Product) => {
    // TODO: Open edit modal
    console.log('Edit product:', product);
  };

  // Handle price suggestion
  const handlePriceSuggest = (product: Product) => {
    setSelectedProduct(product);
    setIsPriceSuggestionModalOpen(true);
  };

  // Handle price acceptance from modal
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

  // Get storage info
  const storageInfo = storage.getStorageInfo();
  const storageUsedPercent = (storageInfo.used / storageInfo.total) * 100;

  if (loading) {
    return (
      <Layout title="Dashboard - Multilingual Mandi" description="Manage your products and get AI-powered insights">
        <div className="container mx-auto px-4 py-16">
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-hero text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 lg:py-20 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0 animate-slide-up">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🛒</span>
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                      Welcome to Your Dashboard
                    </h1>
                    <p className="text-white/80 text-sm font-medium">
                      मल्टीलिंगुअल मंडी • Multilingual Mandi
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Manage your products, get AI-powered pricing insights, and communicate with buyers across language barriers. 
                  <span className="block mt-2 text-white/70 text-base">
                    🇮🇳 Empowering local markets with cutting-edge technology
                  </span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-down">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:animate-bounce">➕</span>
                    <span>Add Product</span>
                  </span>
                </button>
                <button
                  onClick={addSampleProduct}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">🎯</span>
                    <span>Try Sample</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {products.length > 0 && (
          <div className="container mx-auto px-4 -mt-12 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-slide-up hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Products</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{products.length}</p>
                    <p className="text-emerald-600 text-sm font-medium mt-1">Active listings</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📦</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-slide-up hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Value</p>
                    <p className="text-4xl font-bold text-emerald-600 mt-2">
                      ₹{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                    </p>
                    <p className="text-gray-600 text-sm font-medium mt-1">Inventory worth</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-slide-up hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Quantity</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                      {products.reduce((sum, p) => sum + p.quantity, 0)} kg
                    </p>
                    <p className="text-gray-600 text-sm font-medium mt-1">Available stock</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">⚖️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Storage Usage Indicator */}
          {storageUsedPercent > 50 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">
                      Storage Usage: {storageUsedPercent.toFixed(1)}%
                    </h3>
                    <p className="text-amber-700">
                      {(storageInfo.used / 1024).toFixed(1)} KB used of {(storageInfo.total / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="w-32 h-3 bg-amber-200 rounded-full overflow-hidden">
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
            <div className="text-center py-24 animate-fade-in">
              <div className="max-w-lg mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce-gentle">
                  <span className="text-6xl">📦</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Ready to start selling?
                </h3>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                  Create your first product listing and join thousands of vendors using AI-powered tools to grow their business. 
                  <span className="block mt-2 text-emerald-600 font-semibold">
                    🚀 Get started in seconds!
                  </span>
                </p>
                <div className="space-y-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-2 text-lg"
                  >
                    <span className="flex items-center justify-center space-x-3">
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
              <div className="flex items-center justify-between mb-10 animate-slide-down">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Products</h2>
                  <p className="text-gray-600 text-lg">Manage your inventory and get AI insights</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
                    {products.length} products
                  </span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <span className="flex items-center space-x-2">
                      <span>➕</span>
                      <span>Add Product</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
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
            <div className="mt-16 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
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
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center lg:hidden animate-bounce-gentle"
          aria-label="Add new product"
        >
          <span className="text-2xl">➕</span>
        </button>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
        />

        {/* Price Suggestion Modal */}
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
      </div>
    </Layout>
  );
};

export default Dashboard;