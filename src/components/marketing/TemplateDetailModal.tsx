import React, { useState } from 'react';
import { EmailTemplate, EmailPalette } from '../../types';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  Send, 
  Star, 
  Ticket, 
  Layers, 
  Info,
  Palette,
  ExternalLink,
  Code
} from 'lucide-react';
import { generateEmailHtml } from './emailHtmlGenerator';

interface TemplateDetailModalProps {
  template: EmailTemplate;
  onClose: () => void;
  onCustomize: (template: EmailTemplate) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template: initialTemplate,
  onClose,
  onCustomize
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [currentPalette, setCurrentPalette] = useState<EmailPalette>(initialTemplate.paletteTheme || 'sand');
  const [copiedCode, setCopiedCode] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  // Derive theme colors for live palette previewing
  const palettes = {
    sunflower: { name: 'Pale Sunflower', outerBg: '#FBF5DF', cardBg: '#2B3324', cardText: '#FDFBF7', cardSub: '#D1DEC3', btnBg: '#E8D284', btnText: '#1F2E20', badgeBg: 'rgba(232,210,132,0.2)', badgeText: '#E8D284' },
    lavender: { name: 'Lavender Lilac', outerBg: '#EDE9FE', cardBg: '#2A3042', cardText: '#FFFFFF', cardSub: '#C5CAE9', btnBg: '#FFFFFF', btnText: '#1E2330', badgeBg: 'rgba(255,255,255,0.2)', badgeText: '#FFFFFF' },
    olive: { name: 'Olive Sage', outerBg: '#E8EDE0', cardBg: '#1E2C1E', cardText: '#FAF8F5', cardSub: '#C2D1C2', btnBg: '#C5D8B8', btnText: '#142014', badgeBg: 'rgba(197,216,184,0.25)', badgeText: '#C5D8B8' },
    terracotta: { name: 'Terracotta Earth', outerBg: '#F7EFE6', cardBg: '#6B4C28', cardText: '#FFF8F0', cardSub: '#E8D2BD', btnBg: '#F5E6D3', btnText: '#4A3219', badgeBg: 'rgba(245,230,211,0.25)', badgeText: '#F5E6D3' },
    sand: { name: 'Sand Linen', outerBg: '#FAF8F5', cardBg: '#FFFFFF', cardText: '#1C1917', cardSub: '#57534E', btnBg: '#1C1917', btnText: '#FFFFFF', badgeBg: '#F5F5F4', badgeText: '#1C1917' },
    obsidian: { name: 'Midnight Obsidian', outerBg: '#090D14', cardBg: '#131926', cardText: '#FFFFFF', cardSub: '#94A3B8', btnBg: '#FFFFFF', btnText: '#090D14', badgeBg: 'rgba(255,255,255,0.15)', badgeText: '#FFFFFF' }
  };

  const activeTheme = palettes[currentPalette] || palettes.sand;
  const currentTemplate: EmailTemplate = {
    ...initialTemplate,
    paletteTheme: currentPalette
  };

  const getFontFamilyClass = (font: EmailTemplate['fontFamily']) => {
    switch (font) {
      case 'display-slab': return 'font-serif-display font-bold';
      case 'serif': return 'font-serif-display';
      case 'mono': return 'font-mono-code font-semibold';
      case 'script-hand': return 'font-serif italic';
      case 'sans':
      default: return 'font-sans font-extrabold';
    }
  };

  const handleCopyCode = () => {
    const html = generateEmailHtml(currentTemplate);
    navigator.clipboard.writeText(html);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto text-stone-900 font-sans flex flex-col antialiased">
      
      {/* TOP MINIMAL NAVIGATION BAR */}
      <header className="h-16 px-6 sm:px-12 border-b border-stone-200/80 flex items-center justify-between bg-white sticky top-0 z-30">
        <button
          id="template-detail-back-btn"
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-stone-800 hover:text-stone-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to templates</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="hidden sm:flex px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'HTML Copied!' : 'Copy Code'}</span>
          </button>

          <button
            id="template-detail-top-customize-btn"
            onClick={() => onCustomize(currentTemplate)}
            className="px-5 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Customize it</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN SPLIT SCREEN */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* LEFT / CENTER COLUMN: BROWSER PREVIEW MOCKUP */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center">
          
          {/* BROWSER WINDOW FRAME CONTAINER */}
          <div className="w-full bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
            
            {/* Window Topbar with 3 Dots */}
            <div className="h-10 px-5 bg-stone-100/90 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/40" />
                <span className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/40" />
                <span className="w-3 h-3 rounded-full bg-stone-300 border border-stone-400/40" />
              </div>

              <div className="text-[11px] font-mono text-stone-500 line-clamp-1 max-w-[280px]">
                {currentTemplate.subject}
              </div>

              <div className="text-[10px] font-mono text-stone-400 uppercase">
                {deviceView === 'desktop' ? 'Desktop 600px' : 'Mobile 360px'}
              </div>
            </div>

            {/* Email Canvas Stage */}
            <div 
              style={{ backgroundColor: activeTheme.outerBg }}
              className="p-4 sm:p-8 flex items-start justify-center min-h-[580px] max-h-[780px] overflow-y-auto transition-colors duration-300"
            >
              
              {/* DESKTOP CARD VIEW */}
              {deviceView === 'desktop' ? (
                <div 
                  style={{ backgroundColor: activeTheme.cardBg, color: activeTheme.cardText }}
                  className={`w-full max-w-[540px] shadow-2xl overflow-hidden transition-all duration-300 my-2 ${
                    currentTemplate.frameShape === 'scalloped'
                      ? 'rounded-[38px] border-4 border-black/10 pt-4'
                      : currentTemplate.frameShape === 'arch'
                      ? 'rounded-t-[120px] rounded-b-3xl pt-6'
                      : currentTemplate.frameShape === 'pill'
                      ? 'rounded-[44px] pt-4'
                      : currentTemplate.frameShape === 'polaroid'
                      ? 'p-6 sm:p-8 bg-white rounded-2xl text-stone-900 shadow-2xl border border-stone-200'
                      : currentTemplate.frameShape === 'square'
                      ? 'rounded-none pt-4'
                      : 'rounded-3xl pt-4'
                  }`}
                >
                  
                  {/* Monogram Crest */}
                  {currentTemplate.monogram && (
                    <div className="pt-4 pb-2 flex justify-center">
                      <div 
                        style={{ borderColor: activeTheme.cardSub, color: activeTheme.cardText }}
                        className="w-11 h-11 rounded-full border flex items-center justify-center font-mono font-bold text-xs tracking-widest"
                      >
                        {currentTemplate.monogram}
                      </div>
                    </div>
                  )}

                  {/* Marquee Ticker Tape (If multi-service / sale) */}
                  {currentTemplate.tickerText && (
                    <div className="py-2.5 px-4 text-center bg-white/10 text-[10px] font-mono font-bold tracking-[0.25em] uppercase border-y border-white/10 my-2">
                      {currentTemplate.tickerText}
                    </div>
                  )}

                  {/* Script Subtitle / Monogram Header */}
                  {currentTemplate.scriptOverlay && (
                    <div 
                      style={{ color: activeTheme.cardSub }}
                      className="text-center font-serif italic text-lg tracking-wide pt-2 mb-1"
                    >
                      {currentTemplate.scriptOverlay}
                    </div>
                  )}

                  {/* Optional Badge */}
                  {currentTemplate.badgeText && (
                    <div className="text-center mb-2 pt-1">
                      <span 
                        style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText }}
                        className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs"
                      >
                        {currentTemplate.badgeText}
                      </span>
                    </div>
                  )}

                  {/* Main Headline */}
                  <div className="px-6 text-center">
                    <h1 
                      style={{ 
                        fontSize: `${currentTemplate.fontSize || 42}px`,
                        textAlign: currentTemplate.textAlign || 'center',
                        lineHeight: 1.15
                      }}
                      className={`font-bold tracking-tight uppercase my-3 ${getFontFamilyClass(currentTemplate.fontFamily)}`}
                    >
                      {currentTemplate.headline}
                    </h1>
                  </div>

                  {/* Hero Photography */}
                  {currentTemplate.imageUrl && (
                    <div className="px-6 sm:px-8 py-3">
                      <div className="overflow-hidden rounded-2xl shadow-md">
                        <img 
                          src={currentTemplate.imageUrl} 
                          alt={currentTemplate.headline} 
                          className="w-full h-auto max-h-[360px] object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Testimonial / 5-Star Block */}
                  {currentTemplate.testimonialQuote && (
                    <div className="px-8 py-4 text-center">
                      <div className="text-amber-400 text-sm tracking-widest mb-1">★★★★★</div>
                      <p 
                        style={{ color: activeTheme.cardText }}
                        className="font-serif italic text-base leading-relaxed max-w-md mx-auto"
                      >
                        {currentTemplate.testimonialQuote}
                      </p>
                      {currentTemplate.testimonialAuthor && (
                        <div style={{ color: activeTheme.cardSub }} className="text-xs font-semibold mt-2">
                          — {currentTemplate.testimonialAuthor}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Story Body Copy */}
                  <div className="px-8 sm:px-10 py-4" style={{ textAlign: currentTemplate.textAlign || 'center' }}>
                    <p 
                      style={{ color: activeTheme.cardSub }}
                      className="text-sm leading-relaxed whitespace-pre-line"
                    >
                      {currentTemplate.body}
                    </p>
                  </div>

                  {/* Promo Coupon (If present) */}
                  {currentTemplate.couponCode && (
                    <div className="px-8 py-3 flex justify-center">
                      <div 
                        style={{ borderColor: activeTheme.cardSub, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        className="p-3.5 rounded-2xl border-1.5 border-dashed text-center max-w-xs w-full"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">VIP Voucher</div>
                        <div className="text-base font-mono font-extrabold tracking-widest my-0.5">{currentTemplate.couponCode}</div>
                        <div style={{ color: activeTheme.cardSub }} className="text-[11px]">{currentTemplate.couponDiscount}</div>
                      </div>
                    </div>
                  )}

                  {/* Call to Action Button */}
                  <div className="px-8 py-6 flex justify-center">
                    <span
                      style={{ backgroundColor: activeTheme.btnBg, color: activeTheme.btnText }}
                      className={`inline-block px-8 py-3.5 text-xs font-bold tracking-widest uppercase shadow-md ${
                        currentTemplate.buttonShape === 'sharp'
                          ? 'rounded-none'
                          : currentTemplate.buttonShape === 'rounded'
                          ? 'rounded-xl'
                          : 'rounded-full'
                      }`}
                    >
                      {currentTemplate.ctaText}
                    </span>
                  </div>

                  {/* Author Signature */}
                  {currentTemplate.authorSignature && (
                    <div className="px-8 py-4 text-center border-t border-black/10">
                      <div className="font-serif italic text-lg font-bold">
                        {currentTemplate.authorSignature}
                      </div>
                      {currentTemplate.authorTitle && (
                        <div style={{ color: activeTheme.cardSub }} className="text-xs mt-0.5">
                          {currentTemplate.authorTitle}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div 
                    style={{ color: activeTheme.cardSub }}
                    className="px-6 py-5 border-t border-black/10 text-center text-[11px] space-y-1 bg-black/10"
                  >
                    <p>Sent with care via Sendline Editorial Mail System.</p>
                    <p className="opacity-75">Unsubscribe • Preferences • View in Browser</p>
                  </div>

                </div>
              ) : (
                /* MOBILE PHONE CONTAINER */
                <div className="w-[340px] bg-black p-3.5 rounded-[48px] shadow-2xl border-4 border-stone-800 relative my-2">
                  
                  {/* Dynamic Island Speaker Bar */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-stone-800 ml-auto mr-2" />
                  </div>

                  {/* Phone Screen Viewport */}
                  <div 
                    style={{ backgroundColor: activeTheme.outerBg }}
                    className="w-full h-[580px] rounded-[38px] overflow-y-auto pt-8 pb-6 px-3 space-y-3"
                  >
                    <div 
                      style={{ backgroundColor: activeTheme.cardBg, color: activeTheme.cardText }}
                      className={`p-4 rounded-2xl shadow-md text-center space-y-3 ${
                        currentTemplate.frameShape === 'arch' ? 'rounded-t-[70px]' : ''
                      }`}
                    >
                      {currentTemplate.monogram && (
                        <div 
                          style={{ borderColor: activeTheme.cardSub, color: activeTheme.cardText }}
                          className="w-8 h-8 rounded-full border mx-auto flex items-center justify-center font-mono font-bold text-[10px]"
                        >
                          {currentTemplate.monogram}
                        </div>
                      )}

                      {currentTemplate.tickerText && (
                        <div className="py-1 text-[8px] font-mono tracking-widest uppercase bg-white/10 rounded">
                          {currentTemplate.tickerText}
                        </div>
                      )}

                      {currentTemplate.scriptOverlay && (
                        <div style={{ color: activeTheme.cardSub }} className="font-serif italic text-xs">
                          {currentTemplate.scriptOverlay}
                        </div>
                      )}

                      {currentTemplate.badgeText && (
                        <div className="text-center">
                          <span 
                            style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.badgeText }}
                            className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          >
                            {currentTemplate.badgeText}
                          </span>
                        </div>
                      )}

                      <h2 
                        style={{ fontSize: `${Math.max(20, (currentTemplate.fontSize || 42) * 0.58)}px` }}
                        className={`font-bold tracking-tight uppercase leading-tight ${getFontFamilyClass(currentTemplate.fontFamily)}`}
                      >
                        {currentTemplate.headline}
                      </h2>

                      {currentTemplate.imageUrl && (
                        <div className="rounded-xl overflow-hidden shadow-xs">
                          <img src={currentTemplate.imageUrl} alt={currentTemplate.headline} className="w-full h-36 object-cover" />
                        </div>
                      )}

                      {currentTemplate.testimonialQuote && (
                        <div className="py-2 text-center">
                          <div className="text-amber-400 text-xs tracking-widest mb-1">★★★★★</div>
                          <p className="font-serif italic text-xs leading-relaxed" style={{ color: activeTheme.cardText }}>
                            {currentTemplate.testimonialQuote}
                          </p>
                          {currentTemplate.testimonialAuthor && (
                            <div style={{ color: activeTheme.cardSub }} className="text-[10px] font-semibold mt-1">
                              — {currentTemplate.testimonialAuthor}
                            </div>
                          )}
                        </div>
                      )}

                      <p style={{ color: activeTheme.cardSub }} className="text-xs leading-relaxed">
                        {currentTemplate.body}
                      </p>

                      {currentTemplate.couponCode && (
                        <div className="p-2.5 rounded-xl border border-dashed text-center" style={{ borderColor: activeTheme.cardSub }}>
                          <div className="text-[9px] font-bold uppercase text-rose-400">Voucher</div>
                          <div className="text-xs font-mono font-bold tracking-wider">{currentTemplate.couponCode}</div>
                          <div style={{ color: activeTheme.cardSub }} className="text-[10px]">{currentTemplate.couponDiscount}</div>
                        </div>
                      )}

                      <div className="pt-2">
                        <span 
                          style={{ backgroundColor: activeTheme.btnBg, color: activeTheme.btnText }}
                          className="inline-block px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                        >
                          {currentTemplate.ctaText}
                        </span>
                      </div>

                      {currentTemplate.authorSignature && (
                        <div className="pt-3 border-t border-black/10 text-center">
                          <div className="font-serif italic text-sm font-bold">
                            {currentTemplate.authorSignature}
                          </div>
                          {currentTemplate.authorTitle && (
                            <div style={{ color: activeTheme.cardSub }} className="text-[10px] mt-0.5">
                              {currentTemplate.authorTitle}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mobile Footer */}
                      <div style={{ color: activeTheme.cardSub }} className="pt-3 border-t border-black/10 text-center text-[9px] space-y-0.5 opacity-80">
                        <p>Sent via Sendline Editorial Network.</p>
                        <p>Unsubscribe • Preferences</p>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: TEMPLATE DETAILS, NOTES & ACTIONS */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-8">
          
          {/* Template Title & Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                {currentTemplate.category}
              </span>
              {currentTemplate.badgeText && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                  {currentTemplate.badgeText}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
              {currentTemplate.name}
            </h1>
          </div>

          {/* Description & Editorial Notes */}
          <div className="space-y-4">
            <p className="text-base text-stone-600 leading-relaxed font-normal">
              {currentTemplate.description || currentTemplate.body}
            </p>

            {currentTemplate.notes && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-pink-600" />
                  <span>Designer Notes</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {currentTemplate.notes}
                </p>
              </div>
            )}
          </div>

          {/* Device Preview Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Preview Mode
            </label>
            <div className="flex items-center gap-2">
              <button
                id="template-detail-desktop-toggle"
                onClick={() => setDeviceView('desktop')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  deviceView === 'desktop'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop (600px)</span>
              </button>

              <button
                id="template-detail-mobile-toggle"
                onClick={() => setDeviceView('mobile')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                  deviceView === 'mobile'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile (iPhone)</span>
              </button>
            </div>
          </div>

          {/* Interactive Palette Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-600" />
                <span>Try Color Palettes</span>
              </label>
              <span className="text-xs font-mono font-semibold text-stone-800 capitalize">
                {activeTheme.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(palettes).map(([key, pal]) => (
                <button
                  key={key}
                  onClick={() => setCurrentPalette(key as EmailPalette)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    currentPalette === key
                      ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-950'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-xs" style={{ backgroundColor: pal.outerBg }} />
                  <span className="text-[11px] font-bold text-stone-800 truncate">{pal.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Included Blocks Pills & Best For */}
          {currentTemplate.bestFor && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                <strong className="text-stone-800 font-semibold">Best for:</strong> {currentTemplate.bestFor}
              </div>
              {currentTemplate.industry && (
                <div className="text-xs text-stone-500">
                  <strong className="text-stone-800 font-semibold">Recommended for:</strong> {currentTemplate.industry}
                </div>
              )}
            </div>
          )}

          {/* MAIN ACTION BUTTON: CUSTOMIZE IT */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <button
              id="template-detail-customize-it-btn"
              onClick={() => onCustomize(currentTemplate)}
              className="w-full py-4 rounded-2xl bg-[#1C1917] hover:bg-black text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Customize it</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyCode}
                className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'HTML Copied' : 'Copy HTML Code'}</span>
              </button>

              <button
                onClick={handleSendTest}
                className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-stone-500" />
                <span>{testSent ? 'Test Sent (200 OK)' : 'Send Test'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
