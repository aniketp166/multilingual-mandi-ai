import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ShoppingCart } from 'lucide-react';

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
    <nav className="sticky top-0 z-[100] bg-surface/70 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group font-display">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-light via-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200/50 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="text-text-inverse w-6 h-6 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-text-primary tracking-tight leading-none">
                Multilingual <span className="text-primary">Mandi</span>
              </h1>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">मल्टीलिंगुअल मंडी</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 overflow-hidden group ${isActive(item.href)
                  ? 'text-primary-dark'
                  : 'text-text-secondary hover:text-primary'
                  }`}
              >
                {isActive(item.href) && (
                  <span className="absolute inset-0 bg-primary-50 rounded-xl -z-10 animate-fade-in"></span>
                )}
                <span className="relative z-10 uppercase tracking-wider">{item.name}</span>
                {!isActive(item.href) && (
                  <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-2xl bg-background-secondary text-text-secondary hover:text-primary hover:bg-primary-50 transition-all active:scale-95 border border-border-light"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={2.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border-light animate-scale-in bg-surface/95 backdrop-blur-xl shadow-xl rounded-3xl absolute left-4 right-4 top-[calc(100%+8px)] z-[110] border border-white/20">
            <div className="flex flex-col space-y-2 px-4 font-display">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-6 py-4 rounded-2xl text-base font-black transition-all active:scale-95 ${isActive(item.href)
                    ? 'bg-primary text-text-inverse shadow-lg shadow-primary-200'
                    : 'text-text-primary hover:text-primary hover:bg-primary-50'
                    }`}
                >
                  {item.name.toUpperCase()}
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
