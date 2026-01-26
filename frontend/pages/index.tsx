import React from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout';
import { config } from '../src/config';

const Home: React.FC = () => {
  return (
    <Layout 
      title="Multilingual Mandi - Empowering India's Local Markets"
      description="Breaking language barriers, enabling fair pricing, and smart negotiations for vendors across India"
    >
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8 animate-slide-down">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl lg:text-5xl">🛒</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                  मल्टीलिंगुअल मंडी
                </h1>
                <p className="text-white/80 text-lg lg:text-xl">
                  Multilingual Mandi
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl lg:text-4xl font-bold mb-6 animate-slide-up">
              🇮🇳 Empowering India's Local Markets with AI
            </h2>
            
            <p className="text-white/90 text-lg lg:text-xl mb-8 leading-relaxed animate-fade-in">
              Breaking language barriers, enabling fair pricing, and smart negotiations 
              for vendors across India. Built for the 26 Jan Prompt Challenge - Viksit Bharat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <span>Open Dashboard</span>
                </span>
              </Link>
              
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 text-center"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">ℹ️</span>
                  <span>Learn More</span>
                </span>
              </Link>
            </div>

            {/* App Status */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-white/90 font-medium">🟢 Ready to Use</span>
              <span className="text-white/70 text-sm">
                v{config.app.version} • Frontend-Only
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Powerful AI Features for Local Trade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed specifically for Indian markets with cultural sensitivity and multilingual support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-4xl lg:text-5xl">🗣️</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Real-time Translation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Communicate in Hindi, English, and regional languages with instant AI translation. 
                Break language barriers and connect with customers across India.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-4xl lg:text-5xl">💰</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                AI Price Discovery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get fair market prices and smart recommendations based on real-time data. 
                Ensure competitive pricing and maximize your profits.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-4xl lg:text-5xl">🤝</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Smart Negotiations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered negotiation assistance for better deals and professional communication. 
                Close more sales with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Viksit Bharat
            </h2>
            <p className="text-xl text-gray-600">
              Empowering local markets with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">8+</div>
              <div className="text-gray-600 font-medium">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Mobile Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">AI</div>
              <div className="text-gray-600 font-medium">Powered Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">🇮🇳</div>
              <div className="text-gray-600 font-medium">Made in India</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the digital revolution in local trade. Start using AI-powered tools today.
          </p>
          
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="text-2xl">🚀</span>
            <span>Get Started Now</span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;