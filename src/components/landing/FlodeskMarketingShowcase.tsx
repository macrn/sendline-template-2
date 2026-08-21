import React, { useState } from 'react';
import { AppView } from '../../types';
import { Sparkles, ArrowRight, Eye, Layout, Type, Palette, Smartphone, Monitor, Check, Star, Sliders } from 'lucide-react';

interface FlodeskMarketingShowcaseProps {
  onNavigate: (view: AppView) => void;
}

export const FlodeskMarketingShowcase: React.FC<FlodeskMarketingShowcaseProps> = ({ onNavigate }) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [fontSize, setFontSize] = useState(38);
  const [fontFamily, setFontFamily] = useState<'display-slab' | 'serif' | 'sans'>('display-slab');

  const showcaseTemplates = [
    {
      id: 'botanical',
      name: 'Botanical Harvest',
      script: 'Organic Roots',
      headline: 'COOK WITH NATURE',
      sub: 'Rooted in the goodness of whole foods, our seasonal guide is your companion to mindful meals that nourish body and spirit.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
      frame: 'arch',
      outerBg: 'bg-[#FBF5DF]',
      cardBg: 'bg-[#2B3324]',
      cardText: 'text-[#FDFBF7]',
      cardSub: 'text-[#D1DEC3]',
      btnBg: 'bg-[#E8D284]',
      btnText: 'text-[#1F2E20]',
      btnLabel: 'DOWNLOAD RECIPE GUIDE',
      badge: 'Organic Harvest',
      monogram: 'OR'
    },
    {
      id: 'reviews',
      name: 'Maison Reviews',
      script: 'Pure Rituals',
      headline: 'What clients say about us',
      sub: 'We formulate in micro-batches using cold-pressed rosehip seed oil and organic wild camellia for soft, glowing hydration.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      frame: 'scalloped',
      outerBg: 'bg-[#EDE9FE]',
      cardBg: 'bg-[#2A3042]',
      cardText: 'text-white',
      cardSub: 'text-[#C5CAE9]',
      btnBg: 'bg-white',
      btnText: 'text-[#1E2330]',
      btnLabel: 'SHOP THE ESSENTIALS',
      badge: '5-Star Review',
      monogram: 'YE',
      stars: 5,
      quote: '“I can finally stop searching for the perfect lip care product! My lips stay hydrated all day, with just a delicate kiss of berry color.”'
    },
    {
      id: 'capsule',
      name: 'Atelier Lookbook',
      script: 'Atelier 07',
      headline: 'Tactile Simplicity',
      sub: 'Designed in Zurich, crafted in Portugal. 300 serialized pieces milled from heavy organic cotton with generous natural drape.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      frame: 'rounded',
      outerBg: 'bg-[#FAF8F5]',
      cardBg: 'bg-white',
      cardText: 'text-stone-950',
      cardSub: 'text-stone-600',
      btnBg: 'bg-stone-950',
      btnText: 'text-white',
      btnLabel: 'RESERVE YOUR PIECE',
      badge: 'Limited Batch',
      monogram: 'AT',
      coupon: 'ATELIER-15'
    }
  ];

  const current = showcaseTemplates[selectedTemplateIndex];

  return (
    <section id="visual-builder" className="py-24 bg-[#FAF8F5] border-t border-stone-200 relative">
      
      {/* Scallop SVG Mask */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="showcaseScallop" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.02 C 0.65,0.02 0.78,0.1 0.85,0.22 C 0.95,0.28 1,0.4 0.98,0.52 C 1,0.65 0.93,0.78 0.82,0.85 C 0.75,0.95 0.62,1 0.5,0.98 C 0.38,1 0.25,0.95 0.18,0.85 C 0.07,0.78 0,0.65 0.02,0.52 C 0,0.4 0.05,0.28 0.15,0.22 C 0.22,0.1 0.35,0.02 0.5,0.02 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Campaign Visual Studio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Our intuitive builder makes you the expert
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            Loved by designers and creators alike, our minimalist interface guides you to stunning typography, scalloped masks, and high deliverability with ease.
          </p>
        </div>

        {/* Studio Interactive Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls Panel */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Customizable Templates</h3>
              <p className="text-xs text-stone-500 mt-0.5">Select a template to test live typography and layout</p>
            </div>

            {/* Template Selector Cards */}
            <div className="space-y-2.5">
              {showcaseTemplates.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplateIndex(idx);
                    setFontFamily(idx === 0 ? 'display-slab' : idx === 1 ? 'serif' : 'sans');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedTemplateIndex === idx
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border border-stone-300 ${t.outerBg}`} />
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className={`text-[11px] ${selectedTemplateIndex === idx ? 'text-stone-300' : 'text-stone-500'}`}>
                        {t.frame === 'scalloped' ? '🌸 Scalloped Cloud' : t.frame === 'arch' ? '🏛️ Arched Dome' : '◽ Soft Rounded'}
                      </div>
                    </div>
                  </div>
                  {selectedTemplateIndex === idx && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Live Typography Control */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                Headline Scale ({fontSize}px)
              </label>
              <input
                type="range"
                min="28"
                max="56"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-950"
              />
            </div>

            {/* Viewport switch */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs text-stone-500">Preview Device:</span>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white shadow-sm text-stone-950' : 'text-stone-500 hover:text-stone-950'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white shadow-sm text-stone-950' : 'text-stone-500 hover:text-stone-950'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              id="studio-open-customizer-btn"
              onClick={() => onNavigate('template-editor')}
              className="w-full py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Customize In Studio Builder</span>
            </button>
          </div>

          {/* Right Live Canvas */}
          <div className={`lg:col-span-8 ${current.outerBg} p-6 sm:p-10 rounded-3xl transition-colors duration-500 flex items-center justify-center relative shadow-inner`}>
            
            {/* Flodesk Floating Inspector Pill */}
            <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-stone-200/80 shadow-xl hidden sm:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 font-mono">Font:</span>
                <span className="font-bold text-stone-900 capitalize">{fontFamily}</span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 font-mono">Size:</span>
                <span className="font-bold text-stone-900">{fontSize}px</span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <button
                onClick={() => onNavigate('template-editor')}
                className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Edit All</span>
              </button>
            </div>

            {/* Email Card Frame */}
            <div
              className={`transition-all duration-300 w-full shadow-2xl rounded-3xl ${current.cardBg} ${
                previewDevice === 'mobile' ? 'max-w-[360px] p-6' : 'max-w-[520px] p-8 sm:p-10'
              }`}
            >
              {/* Monogram Badge */}
              {current.monogram && (
                <div className="flex justify-center mb-4">
                  <div className={`w-10 h-10 rounded-full border-2 border-dashed border-current ${current.cardText} flex items-center justify-center font-bold tracking-widest text-xs font-mono`}>
                    {current.monogram}
                  </div>
                </div>
              )}

              {/* Script Sub-Header */}
              <div className={`text-center font-serif italic text-lg ${current.cardSub} mb-1`}>
                {current.script}
              </div>

              {/* Headline Title */}
              <div className="text-center my-4">
                <h2
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.15 }}
                  className={`font-serif-display ${current.cardText} uppercase tracking-tight font-extrabold`}
                >
                  {current.headline}
                </h2>
              </div>

              {/* Photo Frame Container with dynamic shape */}
              <div className="my-6 flex justify-center">
                <div
                  className={`relative overflow-hidden w-full max-w-[420px] aspect-[4/3] ${
                    current.frame === 'scalloped'
                      ? 'rounded-[44px]'
                      : current.frame === 'arch'
                      ? 'rounded-t-[120px] rounded-b-2xl'
                      : 'rounded-2xl'
                  }`}
                  style={
                    current.frame === 'scalloped'
                      ? { clipPath: 'url(#showcaseScallop)' }
                      : undefined
                  }
                >
                  <img
                    src={current.image}
                    alt={current.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-950 font-bold text-[10px] shadow-sm">
                    {current.badge}
                  </div>
                </div>
              </div>

              {/* Star Rating & Testimonial (if present) */}
              {current.quote && (
                <div className="my-5 text-center space-y-2 bg-black/10 rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-sm">
                    ★★★★★
                  </div>
                  <p className={`font-serif italic text-sm ${current.cardText} leading-relaxed`}>
                    {current.quote}
                  </p>
                </div>
              )}

              {/* Body narrative */}
              <div className="text-center my-5">
                <p className={`text-xs sm:text-sm leading-relaxed ${current.cardSub}`}>
                  {current.sub}
                </p>
              </div>

              {/* Call To Action Button */}
              <div className="mt-7 mb-2 flex justify-center">
                <button
                  onClick={() => onNavigate('template-editor')}
                  className={`px-8 py-3.5 ${current.btnBg} ${current.btnText} font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-md cursor-pointer`}
                >
                  {current.btnLabel}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
