import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>About - Multilingual Mandi</title>
        <meta name="description" content="Learn about Multilingual Mandi - Breaking language barriers in local trade" />
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
                <Link href="/about" className="text-sm font-medium text-primary hover:text-primary-dark transition-fast">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-fast">
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
              About Multilingual Mandi
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-secondary mb-8">
                Empowering India&apos;s local vendors with AI-driven tools that break language barriers 
                and enable fair, transparent trade across diverse communities.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="card p-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
                  <p className="text-secondary">
                    To democratize technology for India&apos;s local markets, making advanced AI 
                    accessible to traditional traders and fostering inclusive economic growth.
                  </p>
                </div>

                <div className="card p-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4">Our Vision</h2>
                  <p className="text-secondary">
                    A Viksit Bharat where every trader, regardless of language or location, 
                    can participate in fair and transparent commerce with AI assistance.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-primary mb-6">Key Features</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗣️</div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Real-time Translation</h3>
                  <p className="text-secondary">
                    Instant translation between Hindi, English, and regional languages
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-primary mb-2">AI Price Discovery</h3>
                  <p className="text-secondary">
                    Smart pricing recommendations based on real-time market data
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Smart Negotiations</h3>
                  <p className="text-secondary">
                    AI-powered assistance for better deals and professional communication
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-primary mb-6">Built for Viksit Bharat</h2>
              
              <p className="text-secondary mb-6">
                This platform was created as part of the 26 Jan Prompt Challenge, with a focus on 
                building technology that serves every Indian trader. Our approach prioritizes:
              </p>

              <ul className="list-disc list-inside text-secondary space-y-2 mb-8">
                <li>Multilingual support by design</li>
                <li>Simple interfaces for traditional traders</li>
                <li>Cultural sensitivity and respect for Indian trading customs</li>
                <li>Accessibility on basic smartphones and slow internet</li>
                <li>Fair trade and transparent pricing</li>
              </ul>

              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  🇮🇳 Jai Hind! Building for a Viksit Bharat
                </h3>
                <p className="text-secondary">
                  &quot;Empowering local markets, one conversation at a time&quot; - Where technology 
                  serves every Indian trader with dignity and respect.
                </p>
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

export default About;