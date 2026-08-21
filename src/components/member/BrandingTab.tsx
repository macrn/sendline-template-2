import React, { useState } from 'react';
import { BrandSettings } from '../../types/member';
import { Palette, Type, Upload, MapPin, Share2, Check, Sparkles } from 'lucide-react';

interface BrandingTabProps {
  branding: BrandSettings;
  onUpdateBranding: (updated: Partial<BrandSettings>) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({
  branding,
  onUpdateBranding
}) => {
  const [formData, setFormData] = useState(branding);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onUpdateBranding(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-10 text-stone-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Branding</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Set default logo, color swatches, typography, and compliance address for automatic email generation.
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
          <span>Brand styles updated across all template presets!</span>
        </div>
      )}

      {/* BRAND NAME & LOGO */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-950">Brand Identity</h3>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-5 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Brand / Studio Name</label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center font-serif font-bold text-xl text-stone-900 overflow-hidden">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span>AA</span>
              )}
            </div>

            <div>
              <label className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-white text-xs font-semibold text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer inline-flex">
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>Upload Brand Logo (PNG / SVG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({ ...formData, logoUrl: url });
                    }
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-stone-400 mt-1">Recommended: Transparent PNG, minimum 400x120px</p>
            </div>
          </div>
        </div>
      </div>

      {/* COLOR PALETTE */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h3 className="text-lg font-bold text-stone-950">Brand Palette</h3>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xs">
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-xs font-bold text-stone-800 uppercase">{formData.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-xs font-bold text-stone-800 uppercase">{formData.secondaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Accent Button</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-xs font-bold text-stone-800 uppercase">{formData.accentColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Canvas Neutral</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.neutralBgColor}
                onChange={(e) => setFormData({ ...formData, neutralBgColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-xs font-bold text-stone-800 uppercase">{formData.neutralBgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CAN-SPAM PHYSICAL ADDRESS */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-950">Company Address (Anti-Spam Compliance)</h3>
          <p className="text-xs text-stone-500">Required by international email laws (CAN-SPAM, CASL, GDPR) to be displayed in every email footer</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Company / Legal Name</label>
              <input
                type="text"
                value={formData.companyAddress.companyName}
                onChange={(e) => setFormData({
                  ...formData,
                  companyAddress: { ...formData.companyAddress, companyName: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Street Address</label>
              <input
                type="text"
                value={formData.companyAddress.streetAddress}
                onChange={(e) => setFormData({
                  ...formData,
                  companyAddress: { ...formData.companyAddress, streetAddress: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">City, State / Region & Zip</label>
              <input
                type="text"
                value={`${formData.companyAddress.city}, ${formData.companyAddress.zipCode}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setFormData({
                    ...formData,
                    companyAddress: {
                      ...formData.companyAddress,
                      city: parts[0]?.trim() || formData.companyAddress.city,
                      zipCode: parts[1]?.trim() || formData.companyAddress.zipCode
                    }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Country</label>
              <input
                type="text"
                value={formData.companyAddress.country}
                onChange={(e) => setFormData({
                  ...formData,
                  companyAddress: { ...formData.companyAddress, country: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
