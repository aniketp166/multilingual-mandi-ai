import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '../src/components/ProductCard';
import { storage } from '../src/utils/storage';
import { Product } from '../src/types';
import { config } from '../src/config';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    setSelectedProduct(product);
    // TODO: Open edit modal
    console.log('Edit product:', product);
  };

  // Handle price suggestion (placeholder)
  const handlePriceSuggest = (product: Product) => {
    // TODO: Call price suggestion API
    console.log('Get price suggestion for:', product);
    alert(`Price suggestion for ${product.name} - Coming soon!`);
  };

  // Get storage info
  const storageInfo = storage.getStorageInfo();
  const storageUsedPercent = (storageInfo.used / storageInfo.total) * 100;

  if (loading) {
    return (
      <>
        <Head>
          <title>Dashboard - Multilingual Mandi</title>
        </Head>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="spinner"></div>
            <span className="ml-3 text-secondary">Loading dashboard...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Vendor Dashboard - Multilingual Mandi</title>
        <meta name="description" content="Manage your products and get AI-powered insights" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="bg-surface border-b border-default sticky top-0 z-30">
          <div className="container">
            <nav className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-primary">
                  🛒 मल्टीलिंगुअल मंडी
                </h1>
                <span className="text-sm text-secondary hidden sm:block">
                  Multilingual Mandi
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast">
                  Home
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary-dark transition-fast">
                  Dashboard
                </Link>
                <Link href="/about" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast hidden sm:block">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast hidden sm:block">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="container py-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-secondary">
              Manage your products and get AI-powered insights
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="text-sm text-tertiary">
              {products.length} products
            </div>
            <button
              onClick={addSampleProduct}
              className="btn-base btn-md btn-primary"
            >
              <span className="mr-2">➕</span>
              Add Sample Product
            </button>
          </div>
        </div>

        {/* Storage Usage Indicator */}
        {storageUsedPercent > 50 && (
          <div className="card p-4 mb-6 bg-warning-light">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-warning-dark">
                  Storage Usage: {storageUsedPercent.toFixed(1)}%
                </h3>
                <p className="text-xs text-warning-dark">
                  {(storageInfo.used / 1024).toFixed(1)} KB used of {(storageInfo.total / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="w-24 h-2 bg-warning-dark rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all"
                  style={{ width: `${Math.min(storageUsedPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No products yet
            </h3>
            <p className="text-tertiary mb-6">
              Add your first product to get started with AI-powered pricing and negotiations
            </p>
            <button
              onClick={addSampleProduct}
              className="btn-base btn-lg btn-primary"
            >
              <span className="mr-2">🚀</span>
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={() => handleDeleteProduct(product.id)}
                onEdit={() => handleEditProduct(product)}
                onPriceSuggest={() => handlePriceSuggest(product)}
              />
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {products.length}
              </div>
              <div className="text-sm text-secondary">Total Products</div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                ₹{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
              </div>
              <div className="text-sm text-secondary">Total Inventory Value</div>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-2xl font-bold text-info mb-1">
                {products.reduce((sum, p) => sum + p.quantity, 0)} kg
              </div>
              <div className="text-sm text-secondary">Total Quantity</div>
            </div>
          </div>
        )}

        {/* Development Info */}
        {config.app.environment === 'development' && (
          <div className="mt-8 p-4 bg-background-secondary rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-secondary">
              Development Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const data = storage.exportData();
                  console.log('Exported data:', data);
                  navigator.clipboard.writeText(data);
                  alert('Data exported to clipboard!');
                }}
                className="btn-base btn-sm btn-secondary"
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
                className="btn-base btn-sm bg-error text-inverse hover:bg-error-dark"
              >
                Clear All Data
              </button>
            </div>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={addSampleProduct}
          className="fab sm:hidden"
          aria-label="Add new product"
        >
          <span className="text-xl">➕</span>
        </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface-secondary border-t border-default mt-auto">
          <div className="container py-6">
            <div className="text-center text-sm text-secondary">
              <p>🇮🇳 Built for 26 Jan Prompt Challenge - Viksit Bharat</p>
              <p className="mt-2">Empowering Local Markets with AI</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;