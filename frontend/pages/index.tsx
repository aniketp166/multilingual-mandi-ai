import React from 'react';
import Link from 'next/link';
import { Store, ShoppingBag, Globe, Zap, MessageSquare, Handshake, TrendingUp, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import Layout from '../src/components/Layout';

import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Layout
      title="Multilingual Mandi - AI-Powered Local Trade Platform"
      description="Breaking language barriers in Indian markets with AI-powered translation, pricing, and negotiation tools"
    >
      {/* Hero Section */}
      <div className="relative bg-primary-dark text-text-inverse overflow-hidden pt-10 md:pt-14 pb-20 md:pb-24 font-sans selection:bg-secondary-100 selection:text-secondary-dark">
        {/* Animated Background Elements using Variables */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-secondary-light/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary-light/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-4 md:py-8 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <div className="mb-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-text-inverse/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-text-inverse/20 shadow-xl group hover:bg-text-inverse/20 transition-all duration-500">
                <Sparkles className="w-4 h-4 text-secondary-light animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-inverse/90">{t('home.badge')}</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-8 space-y-3 font-display">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tighter animate-slide-up">
                <span className="block text-primary-100">{t('navbar.multilingual')}</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-secondary-light via-text-inverse to-primary-light">
                  {t('home.title')}
                </span>
              </h1>
              <p className="text-base md:text-xl text-text-inverse/80 font-black uppercase tracking-[0.15em] animate-fade-in animation-delay-1000">
                {t('home.subtitle')}
              </p>
            </div>

            <p className="text-sm md:text-base text-text-inverse/70 text-center max-w-2xl mb-10 leading-relaxed font-medium animate-fade-in animation-delay-2000">
              {t('home.desc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full max-w-md animate-fade-in animation-delay-3000 relative z-20">
              <Link
                href="/dashboard"
                className="flex-1 group bg-surface text-primary-dark px-6 py-4 rounded-xl font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
              >
                <Store className="w-4 h-4" />
                <span>{t('home.startSelling')}</span>
              </Link>
              <Link
                href="/buyer"
                className="flex-1 group bg-text-inverse/5 backdrop-blur-md border-2 border-text-inverse/20 text-text-inverse px-6 py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-text-inverse/10 transition-all duration-300 hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('home.browseMandi')}</span>
              </Link>
            </div>

            {/* Language Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-2xl relative z-20">
              {['हिंदी', 'English', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ'].map((lang, i) => (
                <div
                  key={lang}
                  className="px-4 py-1.5 bg-text-inverse/10 backdrop-blur-md rounded-lg border border-text-inverse/20 text-[10px] font-black tracking-widest hover:bg-text-inverse/20 transition-all cursor-default text-text-inverse/90 animate-fade-in"
                  style={{ animationDelay: `${3500 + (i * 100)}ms` }}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider Moved Inside and Z-indexed down */}
        <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-surface" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-surface relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4 font-display">
            <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
              {t('home.aiEcosystem')}
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              {t('home.aiDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t('home.realTimeTranslation'), desc: t('home.realTimeTranslationDesc'), icon: Globe, color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary-100' },
              { title: t('home.smartPricing'), desc: t('home.smartPricingDesc'), icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary-50', border: 'border-secondary-100' },
              { title: t('home.aiNegotiation'), desc: t('home.aiNegotiationDesc'), icon: Handshake, color: 'text-info', bg: 'bg-info-light/10', border: 'border-info-light/20' },
              { title: t('home.vernacularChat'), desc: t('home.vernacularChatDesc'), icon: MessageSquare, color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary-100' }
            ].map((f, i) => (
              <div
                key={i}
                className={`group relative bg-surface rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${f.border}`}
              >
                <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <f.icon className={`w-8 h-8 ${f.color}`} />
                </div>
                <h3 className="text-2xl font-black text-text-primary mb-4 font-display">
                  {f.title}
                </h3>
                <p className="text-text-secondary leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Efficiency Section */}
      <div className="bg-primary text-text-inverse pt-12 pb-16 lg:pt-16 lg:pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="font-display">
                <h2 className="text-4xl md:text-6xl font-black text-text-primary leading-tight">
                  {t('home.whyTransact')} <span className="text-primary">Multilingual Mandi</span>
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  { title: t('home.zeroCommission'), desc: t('home.zeroCommissionDesc'), icon: Zap },
                  { title: t('home.verifiedLocal'), desc: t('home.verifiedLocalDesc'), icon: ShieldCheck },
                  { title: t('home.aiEfficiency'), desc: t('home.aiEfficiencyDesc'), icon: Sparkles }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shadow-lg border border-border-light group-hover:bg-primary-50 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xl font-black text-text-primary font-display">{item.title}</h4>
                      <p className="text-text-secondary font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-light/20 to-secondary-light/20 rounded-[3rem] border-2 border-primary/20 p-8 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-700"></div>
                <div className="w-full h-full bg-surface rounded-3xl shadow-3xl border border-border-light flex flex-col items-center justify-center p-12 space-y-6 relative z-10">
                  <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center animate-bounce-gentle">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black text-primary font-display">{t('home.viksitMandi')}</h3>
                  <p className="text-center font-bold text-text-secondary">{t('home.viksitMandiDesc')}</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-surface">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary-50 px-5 py-2.5 rounded-2xl group border border-secondary-100">
              <Sparkles className="w-5 h-5 text-secondary group-hover:rotate-12 transition-transform" />
              <span className="font-black text-secondary-dark text-xs uppercase tracking-widest">{t('home.badge')}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter leading-none font-display">
              {t('home.readyToEvolve')}
            </h2>

            <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-semibold">
              {t('home.joinOthers')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link
                href="/dashboard"
                className="flex-1 px-8 py-4 bg-secondary text-text-inverse font-black rounded-xl shadow-lg shadow-secondary/10 hover:shadow-secondary/20 transition-all duration-500 transform hover:-translate-y-1 text-base uppercase tracking-tight"
              >
                {t('home.launchApp')}
              </Link>
              <Link
                href="/buyer"
                className="flex-1 px-8 py-4 bg-primary text-text-inverse font-black rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 transform hover:-translate-y-1 text-base uppercase tracking-tight"
              >
                {t('home.browseMarketplace')}
              </Link>
            </div>

            <div className="pt-6 flex flex-col items-center gap-2">
              <p className="text-text-tertiary font-bold uppercase tracking-widest text-[9px]">{t('home.joinVendors')}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </Layout >
  );
};

export default Home;
