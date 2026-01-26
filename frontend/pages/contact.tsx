import React, { useState } from 'react';
import Layout from '../src/components/Layout';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout 
      title="Contact - Multilingual Mandi" 
      description="Get in touch with the Multilingual Mandi team"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-20 relative">
          <div className="text-center animate-slide-up">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📞</span>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                  Contact Us
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  मल्टीलिंगुअल मंडी • Multilingual Mandi
                </p>
              </div>
            </div>
            <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or suggestions? We&apos;d love to hear from you!
              <span className="block mt-2 text-white/70 text-base">
                🇮🇳 Building the future of local commerce together
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Send us a message</h2>
                    <p className="text-gray-600">We&apos;ll get back to you within 24 hours</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>👤</span>
                        <span>Name *</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 touch-target"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>Email *</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 touch-target"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>💬</span>
                        <span>Subject *</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 touch-target"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center space-x-2">
                        <span>📝</span>
                        <span>Message *</span>
                      </span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 resize-none transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 touch-target"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-1 touch-target"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <span className="text-xl">🚀</span>
                      <span>Send Message</span>
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-xl p-8 border border-emerald-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🇮🇳</span>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-emerald-800">
                      26 Jan Prompt Challenge
                    </h3>
                    <p className="text-emerald-600 text-sm font-medium">Viksit Bharat Initiative</p>
                  </div>
                </div>
                <p className="text-emerald-700 leading-relaxed">
                  This project is part of the 26 Jan Prompt Challenge - Viksit Bharat, 
                  focused on building AI solutions for India&apos;s local markets and empowering 
                  vendors with cutting-edge technology.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Open Source
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">Community Driven</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Multilingual Mandi is built with open source technologies and 
                  welcomes contributions from the community.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Frontend</p>
                    <p className="text-xs text-gray-600">Next.js, TypeScript, Tailwind CSS</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-1">AI Integration</p>
                    <p className="text-xs text-gray-600">Google Gemini API</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 sm:col-span-2">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Deployment</p>
                    <p className="text-xs text-gray-600">Vercel Platform</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Feedback Welcome
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">Help us improve</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We value feedback from traders, developers, and anyone interested 
                  in making local commerce more inclusive and efficient.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Collaboration
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">Join our mission</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Interested in collaborating or contributing to the project? 
                  We&apos;d love to connect with like-minded individuals and organizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;