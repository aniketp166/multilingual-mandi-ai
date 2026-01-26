import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
    <>
      <Head>
        <title>Contact - Multilingual Mandi</title>
        <meta name="description" content="Get in touch with the Multilingual Mandi team" />
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
                <Link href="/dashboard" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast">
                  Dashboard
                </Link>
                <Link href="/about" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium text-primary hover:text-primary-dark transition-fast">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-primary mb-6">
              Contact Us
            </h1>
            
            <p className="text-xl text-secondary mb-12">
              Have questions, feedback, or suggestions? We&apos;d love to hear from you!
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-primary mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-base"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-base"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="input-base"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="input-base resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-base btn-lg btn-primary w-full"
                  >
                    <span className="mr-2">📧</span>
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    🇮🇳 26 Jan Prompt Challenge
                  </h3>
                  <p className="text-secondary">
                    This project is part of the 26 Jan Prompt Challenge - Viksit Bharat, 
                    focused on building AI solutions for India&apos;s local markets.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    🚀 Open Source
                  </h3>
                  <p className="text-secondary mb-4">
                    Multilingual Mandi is built with open source technologies and 
                    welcomes contributions from the community.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-tertiary">
                      <strong>Frontend:</strong> Next.js, TypeScript, Tailwind CSS
                    </p>
                    <p className="text-sm text-tertiary">
                      <strong>Backend:</strong> Python FastAPI
                    </p>
                    <p className="text-sm text-tertiary">
                      <strong>AI:</strong> Google Gemini API
                    </p>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    💡 Feedback Welcome
                  </h3>
                  <p className="text-secondary">
                    We value feedback from traders, developers, and anyone interested 
                    in making local commerce more inclusive and efficient.
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    🤝 Collaboration
                  </h3>
                  <p className="text-secondary">
                    Interested in collaborating or contributing to the project? 
                    We&apos;d love to connect with like-minded individuals and organizations.
                  </p>
                </div>
              </div>
            </div>
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

export default Contact;