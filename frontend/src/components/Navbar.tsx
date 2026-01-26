import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Vendor Dashboard', href: '/dashboard' },
    { name: 'Browse Products', href: '/buyer' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 mb-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🛒</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">Multilingual Mandi</h1>
              <p className="text-xs text-gray-500">मल्टीलिंगुअल मंडी</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down bg-white shadow-xl rounded-b-2xl absolute left-0 right-0 top-full">
            <div className="flex flex-col space-y-1 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-base font-semibold transition-all active:scale-[0.98] ${isActive(item.href)
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;