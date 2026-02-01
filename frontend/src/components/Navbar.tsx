import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ShoppingCart, ChevronDown, Store, ShoppingBag, User, Globe } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => router.pathname === href;

  const isVendorPath = router.pathname.includes('dashboard');
  const isBuyerPath = router.pathname.includes('buyer');

  const navigation = [
    { name: 'home', href: '/' },
    { name: 'about', href: '/about' },
  ];

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-xl border-b border-border-light shadow-md h-16'
      : 'bg-white/90 backdrop-blur-lg border-b border-border-light h-20'
      }`}>
      <div className="container mx-auto px-4 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group font-display">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-light via-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200/50 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="text-text-inverse w-6 h-6 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-text-primary tracking-tight leading-none" suppressHydrationWarning>
                {t('navbar.multilingual')} <span className="text-primary">{t('navbar.brand')}</span>
              </h1>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1" suppressHydrationWarning>{t('navbar.subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 overflow-hidden group ${isActive(item.href)
                  ? 'text-primary'
                  : 'text-text-primary hover:text-primary'
                  }`}
              >
                <span className="relative z-10 uppercase tracking-widest" suppressHydrationWarning>{t(`navbar.${item.name}`)}</span>
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary animate-scale-in"></span>
                )}
              </Link>
            ))}

            <div className="h-6 w-px bg-border-light mx-2"></div>

            {/* Language Switcher - Navbar */}
            <div className="relative group/lang mr-2">
              <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-background-secondary text-text-secondary hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </button>

              <div className="absolute top-full right-0 mt-2 w-32 opacity-0 translate-y-2 pointer-events-none group-hover/lang:opacity-100 group-hover/lang:translate-y-0 group-hover/lang:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-surface rounded-xl shadow-xl border border-border-light p-1 overflow-hidden">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${i18n.language === lang.code ? 'bg-primary/10 text-primary' : 'hover:bg-background-secondary text-text-primary'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Mode Switcher */}
            <div className="relative group/mode">
              <button className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all border shadow-sm ${isVendorPath
                ? 'bg-primary/10 border-primary/30 text-primary-dark'
                : isBuyerPath
                  ? 'bg-secondary/10 border-secondary/20 text-secondary-dark'
                  : 'bg-surface border-border-dark text-text-primary hover:border-primary'
                }`}>
                {isVendorPath ? (
                  <Store className="w-4 h-4" />
                ) : isBuyerPath ? (
                  <ShoppingBag className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{isVendorPath ? t('navbar.vendorMode') : isBuyerPath ? t('navbar.buyerMode') : t('navbar.marketAccess')}</span>
                <ChevronDown className="w-3 h-3 translate-y-px opacity-50 group-hover/mode:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/mode:opacity-100 group-hover/mode:translate-y-0 group-hover/mode:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-surface rounded-2xl shadow-2xl border border-border-light p-2 shadow-primary/10">
                  <p className="px-4 py-2 text-[8px] font-black text-text-tertiary uppercase tracking-widest border-b border-border-light mb-1">{t('navbar.selectRole')}</p>

                  <Link href="/buyer" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isBuyerPath ? 'bg-secondary/10 text-secondary-dark' : 'hover:bg-primary-50 text-text-secondary hover:text-primary'}`}>
                    <div className={`p-2 rounded-lg ${isBuyerPath ? 'bg-secondary/20' : 'bg-background-secondary'}`}>
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[10px] uppercase tracking-wider">{t('navbar.buyerMode')}</p>
                      <p className="text-[8px] font-medium opacity-70">{t('navbar.browseNegotiate')}</p>
                    </div>
                  </Link>

                  <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isVendorPath ? 'bg-primary/10 text-primary-dark' : 'hover:bg-primary-50 text-text-secondary hover:text-primary'}`}>
                    <div className={`p-2 rounded-lg ${isVendorPath ? 'bg-primary/20' : 'bg-background-secondary'}`}>
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[10px] uppercase tracking-wider">{t('navbar.vendorMode')}</p>
                      <p className="text-[8px] font-medium opacity-70">{t('navbar.manageInventory')}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
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
          <div className="md:hidden py-6 border-t border-border-light animate-scale-in bg-surface/95 backdrop-blur-xl shadow-xl rounded-3xl absolute left-4 right-4 top-[calc(100%+8px)] z-[110] border border-text-inverse/20">
            <div className="flex flex-col space-y-2 px-4 font-display">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-6 py-4 rounded-2xl text-sm font-black transition-all active:scale-95 ${isActive(item.href)
                    ? 'bg-primary/10 text-primary-dark'
                    : 'text-text-primary hover:text-primary hover:bg-primary-50'
                    }`}
                >
                  {t(`navbar.${item.name}`).toUpperCase()}
                </Link>
              ))}

              <div className="h-px bg-border-light my-2"></div>
              <p className="px-6 text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-2">{t('navbar.marketAccess')}</p>

              <Link
                href="/buyer"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all active:scale-95 ${isBuyerPath ? 'bg-secondary text-text-inverse' : 'bg-background-secondary text-text-primary'}`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t('navbar.buyerMode').toUpperCase()}</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all active:scale-95 ${isVendorPath ? 'bg-primary text-text-inverse' : 'bg-background-secondary text-text-primary'}`}
              >
                <Store className="w-5 h-5" />
                <span>{t('navbar.vendorMode').toUpperCase()}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
