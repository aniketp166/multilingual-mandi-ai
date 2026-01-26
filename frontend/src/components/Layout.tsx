import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Multilingual Mandi - AI-Powered Local Trade',
  description = 'Empowering local markets with AI-driven translation, pricing, and negotiation assistance',
  className = ''
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Multilingual Mandi" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="/og-image.jpg" />
      </Head>

      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 ${className}`}>
        <Navbar />
        
        <main className="relative">
          {children}
        </main>

        {/* Mobile-Optimized Footer */}
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 py-8 lg:py-12">
            {/* Mobile-First Grid */}
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
              {/* Brand Section - Full width on mobile */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">🛒</span>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">मल्टीलिंगुअल मंडी</h3>
                    <p className="text-gray-400 text-sm">Multilingual Mandi</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 text-sm lg:text-base leading-relaxed">
                  Empowering local markets with AI-driven translation, pricing, and negotiation assistance. 
                  Breaking language barriers in trade across India.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-gray-800">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links - Mobile optimized */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="/" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>🏠</span><span>Home</span></a></li>
                  <li><a href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>📊</span><span>Dashboard</span></a></li>
                  <li><a href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>ℹ️</span><span>About Us</span></a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>📞</span><span>Contact</span></a></li>
                </ul>
              </div>

              {/* Support - Mobile optimized */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>❓</span><span>Help Center</span></a></li>
                  <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>🔒</span><span>Privacy Policy</span></a></li>
                  <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>📋</span><span>Terms of Service</span></a></li>
                  <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm lg:text-base flex items-center space-x-2 py-1"><span>📚</span><span>API Docs</span></a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar - Mobile optimized */}
            <div className="border-t border-gray-700 mt-8 pt-6 space-y-4 lg:space-y-0 lg:flex lg:justify-between lg:items-center">
              <p className="text-gray-400 text-xs lg:text-sm text-center lg:text-left">
                © 2024 Multilingual Mandi. Built for 26 Jan Prompt Challenge - Viksit Bharat 🇮🇳
              </p>
              <div className="flex items-center justify-center lg:justify-end space-x-4">
                <span className="text-gray-400 text-xs lg:text-sm">Powered by AI</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs lg:text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;