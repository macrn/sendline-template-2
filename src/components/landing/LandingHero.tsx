import React, { useState } from 'react';
import { AppView } from '../../types';
import { Sparkles, ArrowRight, Check, Heart, Star, Compass, Gift } from 'lucide-react';

interface LandingHeroProps {
  onNavigate: (view: AppView) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(1);

  const cards = [
    {
      id: 'sage',
      title: 'Atelier Lookbook',
      frameColor: 'bg-[#4A5443]',
      paperColor: 'bg-[#FBF9F5]',
      accentColor: 'text-[#4A5443]',
      tag: 'COLLECTION DROP',
      headline: 'THE AUTUMN EDIT',
      subhead: 'Volume IV • Limited Run',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      badge: 'NEW DROP',
      badgeBg: 'bg-[#8F9A7B] text-white',
      ctaText: 'Explore Archive'
    },
    {
      id: 'terracotta',
      title: 'Studio B. Creative',
      frameColor: 'bg-[#5C1F16]',
      paperColor: 'bg-[#FAF6EE]',
      accentColor: 'text-[#C95034]',
      tag: 'STUDIO B.',
      headline: 'OPEN STUDIO',
      subhead: 'Meet the artisans behind the 2025 collection',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      badge: '15% OFF',
      badgeBg: 'bg-[#E36644] text-white',
      ctaText: 'Claim Studio Pass'
    },
    {
      id: 'lavender',
      title: 'The Sunday Dispatch',
      frameColor: 'bg-[#676B8E]',
      paperColor: 'bg-[#FDFBFE]',
      accentColor: 'text-[#676B8E]',
      tag: 'ISSUE NO. 84',
      headline: 'ON BEAUTY & SPEED',
      subhead: 'Why modern brands are leaving generic software behind',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      badge: 'READ 4 MIN',
      badgeBg: 'bg-[#8F93B8] text-white',
      ctaText: 'Read Full Edition'
    },
    {
      id: 'sand',
      title: 'Maison Club Rewards',
      frameColor: 'bg-[#7A5B35]',
      paperColor: 'bg-[#FAF8F3]',
      accentColor: 'text-[#8A673E]',
      tag: 'PRIVATE REWARD',
      headline: 'YOUR $30 VOUCHER',
      subhead: 'Tier status: Gold Sovereign • 2,450 points',
      imageUrl: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=800&q=80',
      badge: 'VIP PERK',
      badgeBg: 'bg-[#B08958] text-white',
      ctaText: 'Apply at Checkout'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Main Clean Hero Content */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-950 tracking-tight leading-[1.08] font-sans">
            Email marketing that’s different by design
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-xl mx-auto">
            With uncompromising design and robust deliverability, Sendline emails get seen 17% more than industry average.
          </p>

          {/* Clean Pill CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-flodesk-studio-btn"
              onClick={() => onNavigate('flodesk-templates')}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-base shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Explore Flodesk Studio (3-in-1)</span>
            </button>

            <button
              id="hero-try-free-btn"
              onClick={() => onNavigate('marketing')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View Workspace</span>
            </button>
          </div>

          <p className="mt-3 text-xs text-stone-400 font-medium">
            No credit card required • Free forever starter tier
          </p>
        </div>

        {/* Flodesk-Style Editorial Email Cards Showcase */}
        <div className="mt-16 sm:mt-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => setActiveCardIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeCardIndex === idx ? 'w-8 bg-stone-950' : 'w-2 bg-stone-200 hover:bg-stone-400'
                }`}
                aria-label={`View ${card.title}`}
              />
            ))}
          </div>

          {/* Cards Display Grid / Slider */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {cards.slice(0, 3).map((card, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={card.id}
                  onClick={() => onNavigate('template-editor')}
                  className={`group relative rounded-[28px] ${card.frameColor} p-4 sm:p-5 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
                    isCenter ? 'md:-translate-y-4 md:hover:-translate-y-6 ring-4 ring-stone-950/10' : 'opacity-95 hover:opacity-100'
                  }`}
                >
                  {/* Inner Email Canvas */}
                  <div className={`rounded-[22px] ${card.paperColor} p-5 sm:p-6 flex flex-col justify-between h-full min-h-[500px] text-stone-900 shadow-inner relative overflow-hidden`}>
                    
                    {/* Flower or Badge Sticker */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className={`relative px-3 py-1.5 rounded-full ${card.badgeBg} text-xs font-black tracking-wider uppercase shadow-md transform rotate-6 group-hover:rotate-0 transition-transform`}>
                        {card.badge}
                      </div>
                    </div>

                    {/* Header Brand */}
                    <div className="text-center pt-2 pb-3">
                      <span className={`text-xs font-black tracking-[0.25em] uppercase font-sans ${card.accentColor}`}>
                        {card.tag}
                      </span>
                    </div>

                    {/* Arched or Modern Photographic Hero */}
                    <div className="my-3 relative">
                      <div className="w-full h-56 sm:h-64 rounded-t-[90px] rounded-b-2xl overflow-hidden shadow-md bg-stone-200 relative">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>

                    {/* Typography & Editorial Content */}
                    <div className="text-center space-y-2 mt-3 mb-4">
                      <h3 className="text-2xl font-bold tracking-tight font-serif-display text-stone-900 leading-tight">
                        {card.headline}
                      </h3>
                      <p className="text-xs text-stone-600 font-sans max-w-xs mx-auto leading-relaxed">
                        {card.subhead}
                      </p>
                    </div>

                    {/* Clean Action Button */}
                    <div className="pt-2">
                      <button className="w-full py-3 rounded-full bg-stone-950 text-white font-sans font-medium text-xs tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-sm">
                        {card.ctaText}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('template-editor')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-800 hover:text-stone-950 hover:underline cursor-pointer"
            >
              <span>Explore all curated editorial layouts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
