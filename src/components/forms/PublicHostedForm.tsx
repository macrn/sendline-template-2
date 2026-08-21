import React, { useState } from 'react';
import { FormItem, FormSubmission } from '../../types';
import { 
  Check, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Globe, 
  Lock, 
  Download, 
  ExternalLink,
  Video,
  CheckCircle2,
  Share2,
  Clock,
  Disc,
  Code,
  Copy,
  Layers,
  FileText,
  X
} from 'lucide-react';

interface PublicHostedFormProps {
  form: FormItem;
  onBackToApp?: () => void;
  onSubmitSuccess?: (submission: FormSubmission) => void;
}

export const PublicHostedForm: React.FC<PublicHostedFormProps> = ({
  form,
  onBackToApp,
  onSubmitSuccess
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishWalkthroughOpen, setIsPublishWalkthroughOpen] = useState(false);
  const [activeWalkthroughTab, setActiveWalkthroughTab] = useState<'link' | 'embed_js' | 'embed_iframe' | 'embed_raw'>('link');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldLabel]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      const emailField = form.fields.find(f => f.type === 'email');
      const nameField = form.fields.find(f => f.type === 'text');

      const contactEmail = emailField ? formData[emailField.label] || 'lead@example.com' : 'lead@example.com';
      const contactName = nameField ? formData[nameField.label] || 'Website Lead' : 'Website Lead';

      const newSubmission: FormSubmission = {
        id: 'subm-' + Date.now(),
        formId: form.id,
        formTitle: form.title,
        submittedAt: 'Just now',
        contactEmail,
        contactName,
        status: 'New',
        data: formData
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(newSubmission);
      }

      if (form.thankYouActionType === 'redirect' && form.thankYouRedirectUrl) {
        setTimeout(() => {
          window.location.href = form.thankYouRedirectUrl || '#';
        }, 1500);
      }
    }, 600);
  };

  const cardBackground = form.cardBgColor || '#FFFFFF';
  const pageBackground = form.bgColor || '#FAF7F2';
  const accent = form.accentColor || '#18181B';
  const radius = form.canvasRadius ?? 24;

  const getFontFamilyStyle = (font?: string) => {
    switch (font) {
      case 'editorial':
      case 'serif':
        return "'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
      case 'cormorant':
        return "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
      case 'bodoni':
        return "'Bodoni Moda', 'Playfair Display', Georgia, serif";
      case 'sans':
      case 'jakarta':
        return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
      case 'cinzel':
      case 'display-slab':
        return "'Cinzel', 'Playfair Display', Georgia, serif";
      case 'script':
      case 'script-hand':
        return "'Caveat', cursive, sans-serif";
      default:
        return "'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
    }
  };

  const getFieldContainerClasses = () => {
    const style = form.fieldStyle || 'outlined_rounded';
    switch (style) {
      case 'filled_sharp':
        return { shapeClasses: 'rounded-none', isFilled: true, isUnderline: false, isTransparent: false };
      case 'filled_rounded':
        return { shapeClasses: 'rounded-lg', isFilled: true, isUnderline: false, isTransparent: false };
      case 'filled_pill':
        return { shapeClasses: 'rounded-full', isFilled: true, isUnderline: false, isTransparent: false };
      case 'filled_oval':
        return { shapeClasses: 'rounded-2xl', isFilled: true, isUnderline: false, isTransparent: false };
      case 'transparent':
        return { shapeClasses: 'rounded-lg', isFilled: false, isUnderline: false, isTransparent: true };
      case 'outlined_sharp':
        return { shapeClasses: 'rounded-none', isFilled: false, isUnderline: false, isTransparent: false };
      case 'outlined_rounded':
        return { shapeClasses: 'rounded-lg', isFilled: false, isUnderline: false, isTransparent: false };
      case 'outlined_pill':
        return { shapeClasses: 'rounded-full', isFilled: false, isUnderline: false, isTransparent: false };
      case 'outlined_oval':
        return { shapeClasses: 'rounded-3xl', isFilled: false, isUnderline: false, isTransparent: false };
      case 'underline':
        return { shapeClasses: 'rounded-none', isFilled: false, isUnderline: true, isTransparent: false };
      default:
        return { shapeClasses: 'rounded-lg', isFilled: false, isUnderline: false, isTransparent: false };
    }
  };

  const { shapeClasses, isFilled, isUnderline, isTransparent } = getFieldContainerClasses();
  const fieldBorderColor = form.fieldBorderColor || '#217CC5';
  const fieldBorderWidth = form.fieldBorderWidth ?? 1;
  const fieldBgColor = form.fieldBgColor || '#FFFFFF';
  const fieldTextColor = form.fieldTextColor || '#207CC5';
  const fieldFontSize = form.fieldFontSize || 15;
  const fieldTextAlign = form.fieldTextAlign || 'left';
  const fieldTextCase = form.fieldTextCase || 'normal';
  const fieldSpacing = form.fieldSpacing ?? 12;
  const fieldPaddingY = form.fieldPaddingY ?? 44;

  return (
    <div 
      className="min-h-screen flex flex-col justify-between font-sans selection:bg-stone-200 transition-colors"
      style={{ backgroundColor: pageBackground, color: form.textColor || '#18181B' }}
    >
      
      {/* Top Banner (Optional Admin Navigation) */}
      {onBackToApp && (
        <div className="bg-stone-950 text-stone-300 text-xs px-4 py-2.5 flex items-center justify-between border-b border-stone-800 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-stone-300">Live Hosted Permalink: sendline.co/f/{form.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPublishWalkthroughOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium cursor-pointer border border-stone-700 transition-colors shadow-xs"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>Embed Code & Guide</span>
            </button>
            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium cursor-pointer border border-stone-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Form Center Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div 
          className="w-full max-w-xl shadow-2xl p-6 sm:p-10 space-y-6 animate-in fade-in zoom-in-95 duration-200 text-left border border-black/5"
          style={{
            backgroundColor: cardBackground,
            borderRadius: `${radius}px`,
            fontFamily: form.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' :
                        form.fontFamily === 'display-slab' ? 'Cinzel, Georgia, serif' :
                        form.fontFamily === 'script-hand' ? 'Caveat, cursive' :
                        form.fontFamily === 'mono' ? 'JetBrains Mono, monospace' : 'Plus Jakarta Sans, sans-serif'
          }}
        >
          
          {/* Monogram / Brand Icon */}
          {form.monogram && (
            <div className={`flex ${form.textAlign === 'center' ? 'justify-center' : form.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base shadow-xs border"
                style={{ 
                  backgroundColor: `${accent}15`, 
                  borderColor: `${accent}30`,
                  color: accent 
                }}
              >
                {form.monogram}
              </div>
            </div>
          )}

          {/* Script Overlay Tag */}
          {form.scriptOverlay && (
            <div 
              className={`text-sm italic font-serif ${form.textAlign === 'center' ? 'text-center' : form.textAlign === 'right' ? 'text-right' : 'text-left'}`}
              style={{ color: accent }}
            >
              {form.scriptOverlay}
            </div>
          )}

          {/* Badge */}
          {form.badgeText && (
            <div className={`flex ${form.textAlign === 'center' ? 'justify-center' : form.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
              <span 
                className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs"
                style={{ 
                  backgroundColor: `${accent}15`, 
                  color: accent 
                }}
              >
                {form.badgeText}
              </span>
            </div>
          )}

          {/* Headline & Description */}
          <div className={`space-y-2 ${form.textAlign === 'center' ? 'text-center' : form.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {submitted ? (form.thankYouHeadline || 'Thank You for Subscribing!') : (form.headline || form.title)}
            </h1>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
              {submitted ? (form.thankYouMessage || form.successMessage || 'Your submission has been received. Check your inbox for updates.') : (form.subtitle || form.description)}
            </p>
          </div>

          {/* Optional Hero Image */}
          {form.imageUrl && !submitted && (
            <div className="overflow-hidden shadow-sm my-4">
              <img 
                src={form.imageUrl} 
                alt="Form Hero" 
                className={`w-full h-52 object-cover ${
                  form.frameShape === 'arch' ? 'rounded-t-full' :
                  form.frameShape === 'scalloped' ? 'rounded-3xl' :
                  form.frameShape === 'pill' ? 'rounded-full' :
                  form.frameShape === 'square' ? 'rounded-none' : 'rounded-2xl'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Form Content or Thank You State */}
          {submitted ? (
            <div className="py-8 text-center space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              {form.thankYouActionType === 'download' && form.thankYouDownloadUrl && (
                <div className="pt-2">
                  <a
                    href={form.thankYouDownloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 transition-all"
                    style={{ backgroundColor: accent }}
                  >
                    <Download className="w-4 h-4" />
                    <span>{form.thankYouDownloadButtonText || 'Download Freebie (PDF)'}</span>
                  </a>
                </div>
              )}

              {form.thankYouActionType === 'redirect' && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  Redirecting to destination in 2 seconds...
                </div>
              )}

              <div className="pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({});
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              
              {/* Link in Bio Cards */}
              {form.formType === 'link_in_bio' && form.links && form.links.length > 0 && (
                <div className="space-y-2.5 mb-6">
                  {form.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`block p-4 rounded-2xl border transition-all group ${
                        link.highlighted 
                          ? 'bg-stone-950 text-white border-stone-900 shadow-md' 
                          : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200/80 text-stone-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold tracking-tight">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            link.highlighted ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.subtitle && (
                        <p className={`text-xs mt-0.5 ${link.highlighted ? 'text-stone-300' : 'text-stone-500'}`}>
                          {link.subtitle}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {/* Input Fields */}
              <div 
                className="flex flex-col"
                style={{ gap: `${fieldSpacing}px` }}
              >
                {form.fields.map((field) => {
                  const inputStyle: React.CSSProperties = {
                    backgroundColor: isFilled ? (fieldBgColor || '#F3F4F6') : isTransparent || isUnderline ? 'transparent' : fieldBgColor,
                    borderColor: isUnderline ? fieldBorderColor : isFilled ? 'transparent' : fieldBorderColor,
                    borderWidth: isUnderline ? '0 0 2px 0' : isFilled || isTransparent ? '0px' : `${fieldBorderWidth}px`,
                    minHeight: `${fieldPaddingY}px`,
                    fontFamily: getFontFamilyStyle(form.fieldFontFamily),
                    fontSize: `${fieldFontSize}px`,
                    color: fieldTextColor,
                    textAlign: fieldTextAlign
                  };

                  return (
                    <div key={field.id} className="space-y-1">
                      {field.type === 'checkbox' ? (
                        <label className="flex items-start gap-2.5 text-xs opacity-90 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            required={field.required}
                            checked={!!formData[field.label]}
                            onChange={(e) => handleInputChange(field.label, e.target.checked)}
                            className="mt-0.5 rounded text-stone-900 focus:ring-0 cursor-pointer"
                          />
                          <span className="leading-snug">{field.label} {field.required && <span className="text-rose-500">*</span>}</span>
                        </label>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          required={field.required}
                          placeholder={field.placeholder || field.label}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleInputChange(field.label, e.target.value)}
                          style={inputStyle}
                          className={`w-full px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${shapeClasses}`}
                        />
                      ) : field.type === 'dropdown' ? (
                        <select
                          required={field.required}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleInputChange(field.label, e.target.value)}
                          style={inputStyle}
                          className={`w-full px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all ${shapeClasses}`}
                        >
                          <option value="">{field.placeholder || field.label}</option>
                          {field.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'date' ? 'date' : 'text'}
                          required={field.required}
                          placeholder={field.placeholder || field.label}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleInputChange(field.label, e.target.value)}
                          style={inputStyle}
                          className={`w-full px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${shapeClasses} ${fieldTextCase === 'uppercase' ? 'uppercase' : ''}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 text-xs sm:text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    form.buttonShape === 'pill' ? 'rounded-full' :
                    form.buttonShape === 'sharp' ? 'rounded-none' :
                    form.buttonShape === 'outline' ? 'rounded-xl border-2 bg-transparent' : 'rounded-xl'
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={{
                    backgroundColor: form.buttonShape === 'outline' ? 'transparent' : (form.buttonBgColor || accent),
                    color: form.buttonShape === 'outline' ? (form.buttonBgColor || accent) : (form.buttonTextColor || '#FFFFFF'),
                    borderColor: form.buttonBgColor || accent
                  }}
                >
                  {isSubmitting ? (
                    <span>Processing submission...</span>
                  ) : (
                    <>
                      <span>{form.submitButtonText || 'Submit Form'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Optional Privacy / Anti-Spam Disclaimer Note */}
              {form.showPrivacyNote !== false && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-60 pt-2 text-center">
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>{form.privacyNoteText || '256-Bit SSL Encrypted • Zero Spam Guarantee'}</span>
                </div>
              )}
            </form>
          )}

        </div>
      </div>

      {/* Powered by Sendline footer */}
      <footer className="py-4 text-center text-xs opacity-50 border-t border-black/5">
        <div className="flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <strong className="font-bold tracking-tight">Sendline Forms & Commerce</strong>
        </div>
      </footer>

      {/* Embed & Publishing Walkthrough Modal */}
      {isPublishWalkthroughOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp text-stone-900 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">How to Embed & Share This Form</h3>
                  <p className="text-xs text-stone-500">Copy URL, script tags, or iframe embed code</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishWalkthroughOpen(false)} 
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs for Sharing Modes */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setActiveWalkthroughTab('link')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeWalkthroughTab === 'link' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Hosted Link</span>
              </button>
              <button
                onClick={() => setActiveWalkthroughTab('embed_js')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeWalkthroughTab === 'embed_js' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Inline Script</span>
              </button>
              <button
                onClick={() => setActiveWalkthroughTab('embed_iframe')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeWalkthroughTab === 'embed_iframe' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Responsive iFrame</span>
              </button>
              <button
                onClick={() => setActiveWalkthroughTab('embed_raw')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeWalkthroughTab === 'embed_raw' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw HTML</span>
              </button>
            </div>

            {/* TAB 1: HOSTED LINK */}
            {activeWalkthroughTab === 'link' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-blue-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Best for Instagram, TikTok, LinkedIn, and Email Links</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Direct hosted link that works out of the box with zero code setup needed.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">Direct Hosted URL</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs text-stone-800 select-all overflow-x-auto truncate">
                      {`https://sendline.co/f/${form.slug}`}
                    </div>
                    <button
                      onClick={() => handleCopy(`https://sendline.co/f/${form.slug}`, 'public_direct_link')}
                      className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      {copiedKey === 'public_direct_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'public_direct_link' ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs text-stone-600 leading-relaxed">
                  <strong className="text-stone-900 block uppercase tracking-wider text-[11px]">Instructions:</strong>
                  <div>1. Copy this link and paste it into your bio link tool, link tree, or social media profile.</div>
                  <div>2. Include it in email newsletters as a direct call-to-action button or hyperlink.</div>
                </div>
              </div>
            )}

            {/* TAB 2: INLINE JS SCRIPT */}
            {activeWalkthroughTab === 'embed_js' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-amber-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-700" />
                    <span>Best for Shopify, Webflow, WordPress, Squarespace</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Paste this snippet directly inside an HTML/Custom Liquid block on your website.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">JavaScript Embed Code</label>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<div id="sendline-form-${form.slug}"></div>
<script src="https://sendline.co/embed/v1/forms.js" 
  data-form-id="${form.slug}" 
  data-container="sendline-form-${form.slug}" 
  async>
</script>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<div id="sendline-form-${form.slug}"></div>\n<script src="https://sendline.co/embed/v1/forms.js" data-form-id="${form.slug}" data-container="sendline-form-${form.slug}" async></script>`, 'public_js_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'public_js_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'public_js_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs text-stone-600 leading-relaxed">
                  <strong className="text-stone-900 block uppercase tracking-wider text-[11px]">Step-by-step walkthrough:</strong>
                  <div>• <strong>Shopify:</strong> Theme Editor &gt; Add Section &gt; <em>Custom Liquid</em> &gt; Paste snippet.</div>
                  <div>• <strong>WordPress / Elementor:</strong> Insert an <em>HTML widget</em> into any column &gt; Paste snippet.</div>
                  <div>• <strong>Squarespace / Webflow:</strong> Add a <em>Code Block</em> into your section &gt; Paste snippet.</div>
                </div>
              </div>
            )}

            {/* TAB 3: RESPONSIVE IFRAME */}
            {activeWalkthroughTab === 'embed_iframe' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-emerald-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Isolated iFrame Container (No CSS Conflicts)</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Clean, sandbox-safe embed that adapts smoothly to container dimensions.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">iFrame HTML Code</label>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<iframe 
  src="https://sendline.co/f/${form.slug}?embed=true" 
  width="100%" 
  height="620" 
  style="border:none; border-radius:16px; overflow:hidden;" 
  title="${form.title}">
</iframe>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<iframe src="https://sendline.co/f/${form.slug}?embed=true" width="100%" height="620" style="border:none; border-radius:16px; overflow:hidden;" title="${form.title}"></iframe>`, 'public_iframe_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'public_iframe_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'public_iframe_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs text-stone-600 leading-relaxed">
                  <strong className="text-stone-900 block uppercase tracking-wider text-[11px]">Best suited for:</strong>
                  <div>• Custom client portals, Notion document embeds (<code className="font-mono bg-stone-200 px-1 py-0.5 rounded text-[10px]">/embed</code>), Wix, and Ghost CMS.</div>
                </div>
              </div>
            )}

            {/* TAB 4: RAW HTML */}
            {activeWalkthroughTab === 'embed_raw' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl text-purple-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>Raw HTML Form Action</span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    Custom form handler for Next.js, Astro, Remix, and static HTML templates.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">HTML Form Code</label>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<form action="https://sendline.co/api/v1/forms/${form.slug}/submit" method="POST">
  <input type="hidden" name="form_id" value="${form.slug}" />
  ${form.fields.map(f => `<input type="${f.type === 'email' ? 'email' : 'text'}" name="${f.key || f.label.toLowerCase().replace(/\\s+/g, '_')}" placeholder="${f.placeholder || f.label}" ${f.required ? 'required' : ''} />`).join('\n  ')}
  <button type="submit">${form.submitButtonText || 'Submit'}</button>
</form>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<form action="https://sendline.co/api/v1/forms/${form.slug}/submit" method="POST">\n  <input type="hidden" name="form_id" value="${form.slug}" />\n  ${form.fields.map(f => `<input type="${f.type === 'email' ? 'email' : 'text'}" name="${f.key || f.label.toLowerCase().replace(/\\s+/g, '_')}" placeholder="${f.placeholder || f.label}" ${f.required ? 'required' : ''} />`).join('\n  ')}\n  <button type="submit">${form.submitButtonText || 'Submit'}</button>\n</form>`, 'public_raw_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'public_raw_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'public_raw_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Bottom */}
            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsPublishWalkthroughOpen(false)}
                className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
