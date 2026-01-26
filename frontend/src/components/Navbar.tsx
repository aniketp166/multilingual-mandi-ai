import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
    { href: '/contact', label: 'Contact', icon: '📞' },
  ];

  const isActiveRoute = (href: string) => {
    return router.pathname === href;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white text-lg lg:text-xl font-bold">🛒</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  मल्टीलिंगुअल मंडी
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 -mt-1">
                  Multilingual Mandi
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                    isActiveRoute(item.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {isActiveRoute(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200">
                <span className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>EN</span>
                </span>
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 top-3' : 'top-1'
                }`}></span>
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'top-3'
                }`}></span>
                <span className={`absolute block w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 top-3' : 'top-5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActiveRoute(item.href) && (
                      <div className="ml-auto w-2 h-2 bg-emerald-600 rounded-full"></div>
                    )}
                  </Link>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="pt-4 border-t border-gray-200/50 space-y-3">
                  <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg font-medium transition-all duration-200">
                    <span className="text-lg">🌐</span>
                    <span>Language: English</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md text-center transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;