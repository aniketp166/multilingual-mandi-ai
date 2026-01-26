import React from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout';

const Home: React.FC = () => {
  return (
    <Layout
      title="Multilingual Mandi - AI-Powered Local Trade Platform"
      description="Breaking language barriers in Indian markets with AI-powered translation, pricing, and negotiation tools"
    >
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden pt-20 md:pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-bold text-sm">26 Jan Prompt Challenge • Viksit Bharat</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-green-200">
                  मल्टीलिंगुअल
                </span>
                <span className="block text-white drop-shadow-2xl">
                  MANDI
                </span>
              </h1>
              <p className="text-xl md:text-3xl font-bold text-white/90 mb-6">
                Breaking Language Barriers in Local Trade
              </p>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4">
                Empowering India&apos;s vendors and buyers with AI-powered multilingual chat, 
                smart pricing, and real-time negotiations across 8+ Indian languages
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="group relative w-full sm:w-auto px-10 py-5 bg-white text-orange-600 font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-3xl">🏪</span>
                  <span className="text-lg">I&apos;m a Vendor</span>
                </span>
              </Link>

              <Link
                href="/buyer"
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-3xl">🛒</span>
                  <span className="text-lg">I&apos;m a Buyer</span>
                </span>
              </Link>
            </div>

            {/* Language Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
              {['हिंदी', 'English', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ'].map((lang) => (
                <div key={lang} className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-sm font-semibold">
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section - Card Style */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to succeed in India&apos;s digital marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-purple-100">
              <div className="absolute top-6 right-6 w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-12">
                Real-Time Chat
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Instant messaging between buyers and vendors with automatic translation
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-100">
              <div className="absolute top-6 right-6 w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🗣️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-12">
                8+ Languages
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Communicate in Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-100">
              <div className="absolute top-6 right-6 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-12">
                Smart Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered price suggestions based on market trends and product data
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-100">
              <div className="absolute top-6 right-6 w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-12">
                AI Negotiation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Smart reply suggestions to help vendors negotiate better deals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 px-4">
              Simple steps to start trading across language barriers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Choose Your Role
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Select whether you&apos;re a vendor selling products or a buyer looking to purchase
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Start Chatting
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Connect with buyers or vendors and communicate in your preferred language
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Close Deals
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Negotiate prices with AI assistance and complete transactions seamlessly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Built for Viksit Bharat 🇮🇳
            </h2>
            <p className="text-xl text-white/90 px-4">
              Empowering local markets with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                8+
              </div>
              <div className="text-lg font-semibold text-white/90">Indian Languages</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                100%
              </div>
              <div className="text-lg font-semibold text-white/90">Mobile Ready</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                AI
              </div>
              <div className="text-lg font-semibold text-white/90">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black mb-4">
                ⚡
              </div>
              <div className="text-lg font-semibold text-white/90">Real-Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-8">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-orange-600">Ready to Transform Your Business?</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 px-4">
              Join the Digital Mandi Revolution
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed px-4">
              Break language barriers, get fair prices, and negotiate like a pro. 
              Start using AI-powered tools designed for India&apos;s local markets today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                href="/dashboard"
                className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🏪</span>
                  <span className="text-lg">Start as Vendor</span>
                </span>
              </Link>

              <Link
                href="/buyer"
                className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🛒</span>
                  <span className="text-lg">Start as Buyer</span>
                </span>
              </Link>
            </div>

            <p className="mt-10 text-gray-500 px-4">
              No credit card required • Free to use • Made with ❤️ for India
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
