import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { config } from '../src/config';

interface BackendData {
  data?: {
    version?: string;
    environment?: string;
    message?: string;
    status?: string;
  };
  success?: boolean;
}

interface ConnectionStatus {
  status: string;
  color: string;
}

const Home: React.FC = () => {
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test connection to backend using simple fetch
    const testConnection = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${config.api.baseUrl}/`);
        const data: BackendData = await response.json();
        setBackendData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to backend';
        setError(errorMessage);
        console.error('Backend connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  const getConnectionStatus = (): ConnectionStatus => {
    if (loading) return { status: '🟡 Connecting...', color: 'orange' };
    if (error) return { status: '🔴 Connection Failed', color: 'red' };
    if (backendData) return { status: '🟢 Connected & Healthy', color: 'green' };
    return { status: '🟡 Unknown', color: 'orange' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <>
      <Head>
        <title>Multilingual Mandi - Empowering India&apos;s Local Markets</title>
        <meta name="description" content="Breaking language barriers, enabling fair pricing, and smart negotiations for vendors across India" />
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
                <Link href="/" className="text-sm font-medium text-primary hover:text-primary-dark transition-fast">
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
        <main className="flex-1">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            {/* Hero Section */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>
              🇮🇳 Welcome to Multilingual Mandi
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#f97316', marginBottom: '1.5rem' }}>
              Empowering India&apos;s Local Markets with AI
            </p>
            <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Breaking language barriers, enabling fair pricing, and smart negotiations 
              for vendors across India. Built for the 26 Jan Prompt Challenge - Viksit Bharat.
            </p>

            {/* Features Preview */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '3rem',
              maxWidth: '900px',
              margin: '3rem auto'
            }}>
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '1.5rem', 
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗣️</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>
                  Real-time Translation
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Communicate in Hindi, English, and regional languages with instant AI translation
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '1.5rem', 
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💰</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>
                  AI Price Discovery
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Get fair market prices and smart recommendations based on real-time data
                </p>
              </div>

              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '1.5rem', 
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🤝</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#059669' }}>
                  Smart Negotiations
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  AI-powered negotiation assistance for better deals and professional communication
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div style={{ textAlign: 'center' }}>
              {/* Backend Connection Status */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '1rem', 
                maxWidth: '400px', 
                margin: '0 auto 2rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Backend Status
                </h4>
                <div style={{ color: connectionStatus.color, fontWeight: '500' }}>
                  {connectionStatus.status}
                </div>
                {backendData && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    API Version: {backendData.data?.version} | Environment: {backendData.data?.environment}
                  </div>
                )}
                {error && (
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.5rem' }}>
                    Error: {error}
                  </div>
                )}
              </div>

              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '2rem', 
                maxWidth: '400px', 
                margin: '0 auto',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#059669' }}>
                  Ready to Get Started?
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                  Create your vendor dashboard and start managing products with AI assistance
                </p>
                {backendData ? (
                  <Link 
                    href="/dashboard" 
                    style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>🚀</span>
                    Open Dashboard
                  </Link>
                ) : (
                  <button 
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'not-allowed',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }} 
                    disabled
                  >
                    <span>🚀</span>
                    {loading ? 'Connecting...' : 'Backend Unavailable'}
                  </button>
                )}
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

export default Home;