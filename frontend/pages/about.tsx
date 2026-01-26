import React from 'react';
import Layout from '../src/components/Layout';

const About: React.FC = () => {
  return (
    <Layout
      title="About - Multilingual Mandi"
      description="Learn about Multilingual Mandi - Breaking language barriers in local trade"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white pt-20 pb-28 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl lg:text-5xl">ℹ️</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              About Multilingual Mandi
            </h1>
            <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed">
              Empowering India&apos;s local vendors with AI-driven tools that break language barriers
              and enable fair, transparent trade across diverse communities.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To democratize technology for India&apos;s local markets, making advanced AI
                  accessible to traditional traders and fostering inclusive economic growth
                  across all communities.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A Viksit Bharat where every trader, regardless of language or location,
                  can participate in fair and transparent commerce with AI assistance
                  and digital empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Key Features
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
                  Instant translation between Hindi, English, and regional languages.
                  Communicate seamlessly with customers across linguistic boundaries.
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
                  Smart pricing recommendations based on real-time market data.
                  Ensure fair pricing and maximize your business potential.
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
                  Build stronger customer relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Viksit Bharat Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Built for Viksit Bharat
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                This platform was created as part of the 26 Jan Prompt Challenge, with a focus on
                building technology that serves every Indian trader.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 lg:p-12 mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🇮🇳</span>
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6">
                Our Approach Prioritizes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Multilingual Support by Design</h4>
                    <p className="text-gray-600 text-sm">Native support for Indian languages</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Simple Interfaces</h4>
                    <p className="text-gray-600 text-sm">Designed for traditional traders</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cultural Sensitivity</h4>
                    <p className="text-gray-600 text-sm">Respect for Indian trading customs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Mobile Accessibility</h4>
                    <p className="text-gray-600 text-sm">Works on basic smartphones</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fair Trade Focus</h4>
                    <p className="text-gray-600 text-sm">Transparent and ethical pricing</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Offline Capability</h4>
                    <p className="text-gray-600 text-sm">Works with slow internet connections</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 lg:p-12 text-white text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🙏</span>
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                🇮🇳 Jai Hind! Building for a Viksit Bharat
              </h3>
              <p className="text-emerald-100 text-lg leading-relaxed">
                &quot;Empowering local markets, one conversation at a time&quot; - Where technology
                serves every Indian trader with dignity, respect, and cultural understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;