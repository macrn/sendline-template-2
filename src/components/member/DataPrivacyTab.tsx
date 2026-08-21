import React, { useState } from 'react';
import { LegalDocument } from '../../types/member';
import { FileText, Shield, Edit3, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { LegalEditorModal } from './TermsEditorModal';

interface DataPrivacyTabProps {
  terms: LegalDocument;
  privacy: LegalDocument;
  onUpdateTerms: (terms: LegalDocument) => void;
  onUpdatePrivacy: (privacy: LegalDocument) => void;
}

export const DataPrivacyTab: React.FC<DataPrivacyTabProps> = ({
  terms,
  privacy,
  onUpdateTerms,
  onUpdatePrivacy
}) => {
  const [activeEditor, setActiveEditor] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="max-w-3xl space-y-8 text-stone-900">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-950 tracking-tight">Data and privacy</h2>
        <p className="text-xs text-stone-500 mt-1">
          Define customer-facing policies, GDPR compliance terms, and legal disclosures for your checkouts and emails.
        </p>
      </div>

      {/* SECTION 1: TERMS & CONDITIONS */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-800" />
              <h3 className="text-base font-bold text-stone-950">Terms & Conditions</h3>
              {terms.isPublished && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PUBLISHED
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter terms and conditions that your customers must accept when purchasing products.
            </p>
          </div>

          <button
            id="edit-terms-conditions-btn"
            onClick={() => setActiveEditor('terms')}
            className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Terms & Conditions</span>
          </button>
        </div>

        <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
          <span>Last updated: <strong className="text-stone-700 font-semibold">{terms.lastUpdated}</strong></span>
          <span className="font-mono text-[11px]">Auto-injected into checkout modals</span>
        </div>
      </div>

      {/* SECTION 2: PRIVACY POLICY */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-700" />
              <h3 className="text-base font-bold text-stone-950">Privacy policy</h3>
              {privacy.isPublished && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PUBLISHED
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter the privacy policy for visitors to know what data you collect and how it's used.
            </p>
          </div>

          <button
            id="edit-privacy-policy-btn"
            onClick={() => setActiveEditor('privacy')}
            className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Privacy policy</span>
          </button>
        </div>

        <div className="pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
          <span>Last updated: <strong className="text-stone-700 font-semibold">{privacy.lastUpdated}</strong></span>
          <span className="font-mono text-[11px]">GDPR & CCPA Compliant Footer Link</span>
        </div>
      </div>

      {/* MODAL EDITORS */}
      {activeEditor === 'terms' && (
        <LegalEditorModal
          type="terms"
          document={terms}
          onSave={onUpdateTerms}
          onClose={() => setActiveEditor(null)}
        />
      )}

      {activeEditor === 'privacy' && (
        <LegalEditorModal
          type="privacy"
          document={privacy}
          onSave={onUpdatePrivacy}
          onClose={() => setActiveEditor(null)}
        />
      )}

    </div>
  );
};
