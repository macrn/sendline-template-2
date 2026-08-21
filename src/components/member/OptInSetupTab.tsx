import React, { useState } from 'react';
import { OptInSettings } from '../../types/member';
import { CheckCircle2, ShieldCheck, Mail, Sparkles, Check, Globe, HelpCircle } from 'lucide-react';

interface OptInSetupTabProps {
  optIn: OptInSettings;
  onUpdateOptIn: (updated: Partial<OptInSettings>) => void;
}

export const OptInSetupTab: React.FC<OptInSetupTabProps> = ({
  optIn,
  onUpdateOptIn
}) => {
  const [formData, setFormData] = useState(optIn);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onUpdateOptIn(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-10 text-stone-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Opt-in setup</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure double opt-in confirmation flows, bot protection, and GDPR consent verification.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
        >
          {savedNotice ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Opt-in settings saved!</span>
        </div>
      )}

      {/* DOUBLE OPT-IN TOGGLE */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-700" />
              <h3 className="text-base font-bold text-stone-950">Double Opt-In Confirmation</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                formData.doubleOptInEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
              }`}>
                {formData.doubleOptInEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Require new subscribers to confirm their email address before being added to your active audience. Highly recommended to prevent spam bot submissions and keep open rates above 50%.
            </p>
          </div>

          <button
            onClick={() => setFormData({ ...formData, doubleOptInEnabled: !formData.doubleOptInEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
              formData.doubleOptInEnabled ? 'bg-stone-950' : 'bg-stone-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              formData.doubleOptInEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* CONFIRMATION EMAIL CONTENT */}
      {formData.doubleOptInEnabled && (
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-stone-950">Confirmation Email Content</h3>

          <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Subject Line</label>
              <input
                type="text"
                value={formData.confirmationSubject}
                onChange={(e) => setFormData({ ...formData, confirmationSubject: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">From Sender Name</label>
              <input
                type="text"
                value={formData.confirmationSenderName}
                onChange={(e) => setFormData({ ...formData, confirmationSenderName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Confirmation Button Label</label>
              <input
                type="text"
                value={formData.confirmationButtonText}
                onChange={(e) => setFormData({ ...formData, confirmationButtonText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Confirmation Redirect URL</label>
              <input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* GDPR CONSENT & BOT PROTECTION */}
      <div className="space-y-4 pt-4 border-t border-stone-200 pb-6">
        <h3 className="text-lg font-bold text-stone-950">GDPR Compliance & Security</h3>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-900">Invisible reCAPTCHA Protection</div>
              <div className="text-[11px] text-stone-500">Block automated form spammers silently</div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, reCaptchaEnabled: !formData.reCaptchaEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                formData.reCaptchaEnabled ? 'bg-stone-950' : 'bg-stone-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.reCaptchaEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200/70">
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">GDPR Consent Checkbox Disclaimer</label>
            <textarea
              rows={2}
              value={formData.gdprConsentText}
              onChange={(e) => setFormData({ ...formData, gdprConsentText: e.target.value })}
              className="w-full p-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-800"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
