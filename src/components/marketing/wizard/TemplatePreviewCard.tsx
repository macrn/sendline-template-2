import React from 'react';
import { EmailTemplate, EmailSection } from '../../../types';
import { getInitialSectionsFromTemplate } from '../TemplateStudio';
import { Sparkles, Star, Tag, ShoppingBag, ExternalLink, Heart, Image as ImageIcon } from 'lucide-react';

interface TemplatePreviewCardProps {
  template: EmailTemplate;
  className?: string;
  maxHeight?: string;
}

export const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
  template,
  className = '',
  maxHeight = 'max-h-[75vh]'
}) => {
  const sections: EmailSection[] = template.sections && template.sections.length > 0 
    ? template.sections 
    : getInitialSectionsFromTemplate(template);

  const getPalette = () => {
    switch (template.paletteTheme) {
      case 'sunflower':
        return { outer: '#FBF5DF', card: '#2B3324', text: '#FDFBF7', sub: '#D1DEC3', btn: '#E8D284', btnText: '#1F2E20', border: '#424E38' };
      case 'lavender':
        return { outer: '#EDE9FE', card: '#2A3042', text: '#FFFFFF', sub: '#C5CAE9', btn: '#FFFFFF', btnText: '#1E2330', border: '#3D455D' };
      case 'olive':
        return { outer: '#E8EDE0', card: '#1E2C1E', text: '#FAF8F5', sub: '#C8D6C5', btn: '#C5D8B8', btnText: '#152215', border: '#2E402E' };
      case 'terracotta':
        return { outer: '#F7EFE6', card: '#6B4C28', text: '#FFF8F0', sub: '#E8D5C4', btn: '#F5E6D3', btnText: '#4A3319', border: '#825F37' };
      case 'obsidian':
        return { outer: '#090D14', card: '#131926', text: '#FFFFFF', sub: '#94A3B8', btn: '#6366F1', btnText: '#FFFFFF', border: '#1E293B' };
      case 'sand':
      default:
        return { outer: '#FAF8F5', card: '#FFFFFF', text: '#1C1917', sub: '#57534E', btn: '#1C1917', btnText: '#FFFFFF', border: '#E7E5E4' };
    }
  };

  const palette = getPalette();

  const getFontFamily = () => {
    switch (template.fontFamily) {
      case 'display-slab':
        return "'Cinzel', serif";
      case 'serif':
        return "'Playfair Display', Georgia, serif";
      case 'mono':
        return "'JetBrains Mono', monospace";
      case 'script-hand':
        return "'Caveat', cursive";
      case 'sans':
      default:
        return "'Plus Jakarta Sans', sans-serif";
    }
  };

  return (
    <div className={`w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden ${className}`}>
      {/* Outer Envelope / Canvas Background */}
      <div 
        style={{ backgroundColor: palette.outer }}
        className={`w-full max-w-[480px] rounded-3xl p-4 sm:p-6 shadow-xl border border-black/5 overflow-y-auto ${maxHeight} select-none transition-all`}
      >
        {/* Main Inner Card */}
        <div
          style={{
            backgroundColor: palette.card,
            color: palette.text,
            fontFamily: getFontFamily()
          }}
          className={`w-full rounded-2xl p-5 sm:p-7 shadow-md overflow-hidden transition-all ${
            template.frameShape === 'arch' ? 'rounded-t-[80px]' : ''
          }`}
        >
          
          {/* Render Sections */}
          <div className="space-y-4">
            {sections.map((section, idx) => {
              if (section.type === 'logo') {
                return (
                  <div key={section.id || idx} className="text-center py-2 flex flex-col items-center justify-center">
                    {section.logoUrl ? (
                      <img src={section.logoUrl} alt="Logo" className="max-h-7 max-w-[110px] object-contain mx-auto mb-1" />
                    ) : section.monogramText ? (
                      <div 
                        style={{ borderColor: palette.border, color: palette.btn }}
                        className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] mx-auto rounded-full border flex items-center justify-center text-xs font-black tracking-widest uppercase mb-1"
                      >
                        {section.monogramText}
                      </div>
                    ) : (
                      <div 
                        style={{ borderColor: palette.border, color: palette.sub }}
                        className="w-28 h-8 border border-dashed rounded-md flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider opacity-70 mb-1"
                      >
                        <ImageIcon className="w-3 h-3 opacity-60" />
                        <span>LOGO</span>
                      </div>
                    )}
                    {section.logoSubtitle && (
                      <div style={{ color: palette.sub }} className="text-[10px] tracking-widest uppercase font-semibold">
                        {section.logoSubtitle}
                      </div>
                    )}
                  </div>
                );
              }

              if (section.type === 'text') {
                return (
                  <div key={section.id || idx} className={`py-1 text-${section.textAlign || 'center'}`}>
                    {section.subtitle && (
                      <div style={{ color: palette.sub }} className="text-xs uppercase tracking-wider mb-1 font-semibold">
                        {section.subtitle}
                      </div>
                    )}
                    {section.title && (
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">
                        {section.title}
                      </h3>
                    )}
                    {section.body && (
                      <p style={{ color: palette.sub }} className="text-xs sm:text-sm mt-2 leading-relaxed opacity-90">
                        {section.body}
                      </p>
                    )}
                  </div>
                );
              }

              if (section.type === 'layout') {
                // E.g. Flash sale banner, 25% Off, Coaching circle, numbered tips
                return (
                  <div 
                    key={section.id || idx} 
                    style={{ borderColor: palette.border, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                    className="p-4 rounded-xl border text-center my-2 space-y-2"
                  >
                    {section.subtitle && (
                      <div className="text-[10px] uppercase font-bold tracking-widest opacity-80" style={{ color: palette.sub }}>
                        {section.subtitle}
                      </div>
                    )}
                    {section.title && (
                      <div className="text-base sm:text-lg font-black tracking-tight" style={{ color: palette.btn }}>
                        {section.title}
                      </div>
                    )}
                    {section.originalPrice && section.discountPrice && (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold">
                        <span className="line-through opacity-50">{section.originalPrice}</span>
                        <span className="text-emerald-400 font-extrabold text-sm">{section.discountPrice}</span>
                      </div>
                    )}
                    {section.body && (
                      <p className="text-[11px] leading-relaxed opacity-85" style={{ color: palette.sub }}>
                        {section.body}
                      </p>
                    )}
                  </div>
                );
              }

              if (section.type === 'image') {
                return (
                  <div key={section.id || idx} className="py-2">
                    {section.imageUrl ? (
                      <img
                        src={section.imageUrl}
                        alt={section.imageAlt || 'Email imagery'}
                        className="w-full h-36 sm:h-44 object-cover rounded-xl shadow-xs"
                      />
                    ) : (
                      <div 
                        style={{ borderColor: palette.border, backgroundColor: 'rgba(255,255,255,0.06)' }}
                        className="w-full h-32 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1 text-xs opacity-60"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Editorial Imagery</span>
                      </div>
                    )}
                  </div>
                );
              }

              if (section.type === 'button') {
                return (
                  <div key={section.id || idx} className="py-3 text-center">
                    <span
                      style={{
                        backgroundColor: palette.btn,
                        color: palette.btnText
                      }}
                      className="inline-block px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md"
                    >
                      {section.ctaText || template.ctaText || 'Claim VIP Offer'}
                    </span>
                  </div>
                );
              }

              if (section.type === 'divider') {
                return (
                  <div key={section.id || idx} className="py-2">
                    <div style={{ borderColor: palette.border }} className="border-t opacity-40 w-full" />
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] opacity-50">
            {template.footerNote || 'Sent with care via Sendline Editorial Mail System • Unsubscribe'}
          </div>

        </div>
      </div>
    </div>
  );
};
