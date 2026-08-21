import React, { useState } from 'react';
import { LegalDocument } from '../../types/member';
import { X, Save, FileText, Upload, Sparkles, Check, Eye, Edit3 } from 'lucide-react';

interface LegalEditorModalProps {
  type: 'terms' | 'privacy';
  document: LegalDocument;
  onSave: (doc: LegalDocument) => void;
  onClose: () => void;
}

export const LegalEditorModal: React.FC<LegalEditorModalProps> = ({
  type,
  document,
  onSave,
  onClose
}) => {
  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave({
      ...document,
      title,
      content,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setContent(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateStandardTemplate = () => {
    if (type === 'terms') {
      setContent(`### Standard Terms & Conditions of Service & Sale

1. **Agreement to Terms**
By accessing our digital publications, member areas, or purchasing products from our storefront, you agree to be bound by these Terms and Conditions.

2. **Digital Goods & Instant Licensing**
All digital downloads, courses, and design templates are granted under an individual, non-exclusive, non-transferable license. Commercial redistribution or reselling of source assets without prior written consent is strictly prohibited.

3. **Payments, Taxes & Billing**
All transactions are securely processed via Stripe. Local sales taxes, VAT, and GST are calculated based on your jurisdiction at the time of checkout.

4. **Refund Policy**
Because digital products and subscriptions grant immediate access to proprietary content, refunds are issued strictly in cases of verifiable technical defects within 14 days of purchase.

5. **Disclaimers & Limitation of Liability**
Services are provided "as is" without warranty of any kind. We are not liable for incidental or consequential damages arising from the use of our services.`);
    } else {
      setContent(`### Comprehensive Privacy Policy (GDPR & CCPA Compliant)

1. **Information We Collect**
We collect personal information that you provide to us directly:
- **Identity & Contact Data**: Name, email address, postal address, and contact preferences.
- **Billing Information**: Transaction history, country of residence, and payment tokens.
- **Usage & Deliverability Telemetry**: IP addresses, browser client headers, and email interaction rates (opens, clicks).

2. **Legal Basis for Processing (GDPR)**
We process your personal information under the following legal bases:
- Performance of our contract with you (delivering emails and products).
- Legitimate interests in protecting our network against spam and fraud.
- Your explicit consent for marketing dispatches (which can be revoked anytime).

3. **Data Protection & Storage**
Your data is encrypted at rest using AES-256 and transmitted exclusively via TLS 1.3 encryption. We never sell, lease, or monetize your personal subscriber records to third parties.

4. **Your Data Rights**
You have the right to request access to, rectify, or erase your personal data at any time. Submit requests to **privacy@sendline.io**.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-950">
                Edit {type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h2>
              <p className="text-xs text-stone-500">
                Update customer-facing legal agreements for your email subscribers and checkout portals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/80 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'edit' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Markdown</span>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'preview' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              <span>Upload .txt / .md</span>
              <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleGenerateStandardTemplate}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to compliant standard template"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Standard Template</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-stone-50/30 min-h-[380px]">
          {mode === 'edit' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Document Body (Markdown or Plain Text)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-2xl border border-stone-300 font-mono text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-950 bg-white resize-y shadow-inner"
                  placeholder="Paste or write your legal terms here..."
                />
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 max-w-2xl mx-auto">
              <div className="border-b border-stone-200 pb-4">
                <h1 className="text-xl font-serif font-bold text-stone-950">{title}</h1>
                <p className="text-xs text-stone-500 mt-1">Last Updated: {document.lastUpdated}</p>
              </div>

              <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-sans space-y-3">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved & Published!' : 'Save & Publish'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
