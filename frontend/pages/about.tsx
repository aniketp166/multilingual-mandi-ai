import React from 'react';
import Layout from '../src/components/Layout';
import { Target, Eye, Globe, Sparkles, IndianRupee, Handshake, ShieldCheck, Heart, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout
      title="About - Multilingual Mandi"
      description="Learn about Multilingual Mandi - Breaking language barriers in local trade"
    >
      {/* Hero Section */}
      <div className="bg-primary text-text-inverse pt-8 pb-20 lg:pt-10 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-light/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-saffron/5 rounded-full blur-[80px] -ml-48 -mb-48"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-text-inverse/10 backdrop-blur-md border border-text-inverse/20 text-text-inverse animate-fade-in shadow-lg">
              <Sparkles className="w-4 h-4 text-primary-200" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em]">Our Story & Mission</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] font-display uppercase animate-slide-up">
              Empowering India&apos;s <span className="text-primary-200">Local Trade</span>
            </h1>

            <p className="text-xl lg:text-3xl text-primary-50 font-medium leading-tight max-w-3xl mx-auto animate-slide-up animation-delay-300">
              Breaking language barriers with AI-driven tools to enable fair, transparent commerce for every vendor in India.
            </p>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 lg:py-24 -mt-20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="group bg-surface rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-gray-200/40 border border-border-light hover:border-primary-200 transition-all duration-500 hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-105 transition-transform">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-text-primary mb-4 font-display uppercase tracking-tight">Our Mission</h2>
                <p className="text-text-secondary text-base lg:text-lg font-medium leading-relaxed">
                  To democratize technology for India&apos;s local markets, making advanced AI
                  accessible to traditional traders and fostering inclusive economic growth
                  across all communities.
                </p>
              </div>

              <div className="group bg-surface rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-gray-200/40 border border-border-light hover:border-saffron-200 transition-all duration-500 hover:-translate-y-1">
                <div className="w-16 h-16 bg-saffron-light/10 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-105 transition-transform">
                  <Eye className="w-8 h-8 text-saffron" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-text-primary mb-4 font-display uppercase tracking-tight">Our Vision</h2>
                <p className="text-text-secondary text-base lg:text-lg font-medium leading-relaxed">
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
      <div className="py-16 lg:py-24 bg-background-secondary relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary-100 text-primary-dark border border-primary-200 shadow-sm">
                <Award className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Core Capabilities</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-text-primary font-display uppercase tracking-tighter">
                Built for <span className="text-primary">Indian</span> Markets
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto font-medium">
                Designed with cultural sensitivity and deep multilingual support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: 'Real-time Translation',
                  desc: 'Instant translation between Hindi, English, and regional languages. Communicate seamlessly with customers.',
                  icon: Globe,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                {
                  title: 'AI Price Discovery',
                  desc: 'Smart pricing recommendations based on real-time market data to ensure fair and competitive trade.',
                  icon: IndianRupee,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                {
                  title: 'Smart Negotiations',
                  desc: 'AI-powered assistance for professional, multi-lingual negotiations that build trust and loyalty.',
                  icon: Handshake,
                  color: 'text-saffron',
                  bg: 'bg-saffron-light/10'
                }
              ].map((feature, i) => (
                <div key={i} className="text-center group space-y-6">
                  <div className={`w-24 h-24 ${feature.bg} rounded-[2rem] flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-text-inverse`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl font-black text-text-primary font-display uppercase tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Viksit Bharat Section */}
      <div className="py-24 lg:py-40 bg-surface">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-text-primary rounded-[4rem] p-10 lg:p-20 text-text-inverse shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-125"></div>

              <div className="relative z-10 space-y-16">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-text-inverse/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-text-inverse/20 shadow-2xl group-hover:rotate-12 transition-transform">
                    <span className="text-5xl">🇮🇳</span>
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black font-display uppercase tracking-tighter leading-none">
                    Towards <span className="text-primary-200">Viksit Bharat</span>
                  </h2>
                  <p className="text-xl text-text-inverse/70 max-w-2xl font-medium">
                    This platform serves the spirit of 26 Jan, empowering every Indian trader with dignity through technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {[
                    { label: 'Multilingual First', icon: Globe },
                    { label: 'Simplifying Complexity', icon: Sparkles },
                    { label: 'Cultural Sensitivity', icon: Heart },
                    { label: 'Mobile-First Design', icon: Target },
                    { label: 'Fair Trade Ethics', icon: ShieldCheck },
                    { label: 'Economic Inclusion', icon: Users },
                  ].map((it, i) => (
                    <div key={i} className="flex items-center gap-5 group/item">
                      <div className="w-12 h-12 bg-text-inverse/10 rounded-2xl flex items-center justify-center shrink-0 border border-text-inverse/10 group-hover/item:bg-primary/20 transition-colors">
                        <it.icon className="w-5 h-5 text-primary-200" />
                      </div>
                      <span className="text-lg font-black uppercase tracking-widest text-text-inverse/90">{it.label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-text-inverse/10 text-center space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-black font-display uppercase tracking-tight">
                      Jai Hind! <span className="text-saffron">जय हिंद!</span>
                    </h3>
                    <p className="text-lg text-text-inverse/60 italic font-medium leading-relaxed max-w-2xl mx-auto">
                      &quot;Empowering local markets, one conversation at a time&quot; — Where cutting-edge AI meets the pulse of traditional Indian trade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  );
};

export default About;