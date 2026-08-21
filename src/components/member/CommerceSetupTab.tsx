import React, { useState } from 'react';
import { CommerceSettings } from '../../types/member';
import { ShoppingBag, CreditCard, DollarSign, CheckCircle2, ExternalLink, RefreshCw, Sparkles, Check } from 'lucide-react';

interface CommerceSetupTabProps {
  commerce: CommerceSettings;
  onUpdateCommerce: (updated: Partial<CommerceSettings>) => void;
}

export const CommerceSetupTab: React.FC<CommerceSetupTabProps> = ({
  commerce,
  onUpdateCommerce
}) => {
  const [saveNotice, setSaveNotice] = useState(false);

  const currencies = [
    { code: 'USD', label: 'USD ($) — United States Dollar' },
    { code: 'EUR', label: 'EUR (€) — Euro' },
    { code: 'GBP', label: 'GBP (£) — British Pound' },
    { code: 'CAD', label: 'CAD ($) — Canadian Dollar' },
    { code: 'AUD', label: 'AUD ($) — Australian Dollar' }
  ];

  return (
    <div className="max-w-3xl space-y-8 text-stone-900">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Commerce setup</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            STRIPE CONNECTED
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Process payments directly inside your emails and Flodesk checkout funnels with Stripe Connect.
        </p>
      </div>

      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Commerce preferences updated!</span>
        </div>
      )}

      {/* STRIPE STATUS BOX */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-950">Stripe Merchant Account</h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-stone-500 font-mono">{commerce.stripeAccountId || 'acct_1N9vK289ArslanStripe'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              window.open('https://dashboard.stripe.com', '_blank');
            }}
            className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Stripe Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-3 border-t border-stone-200/70 grid grid-cols-2 gap-4 text-xs text-stone-600">
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Transaction Fee</span>
            <strong className="text-stone-900 font-semibold">0% Sendline platform fee (Standard Stripe processing)</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Payouts</span>
            <strong className="text-emerald-700 font-semibold">Daily rolling transfer to bank</strong>
          </div>
        </div>
      </div>

      {/* STORE CURRENCY */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div>
          <h3 className="text-lg font-bold text-stone-950">Store Currency</h3>
          <p className="text-xs text-stone-500">Default currency displayed in all checkout modals and product links</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90">
          <select
            value={commerce.currency}
            onChange={(e) => {
              onUpdateCommerce({ currency: e.target.value as any });
              setSaveNotice(true);
              setTimeout(() => setSaveNotice(false), 2000);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 cursor-pointer"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AUTOMATIC SALES TAX */}
      <div className="space-y-4 pt-4 border-t border-stone-200 pb-6">
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-950">Automatic Sales Tax & VAT (Stripe Tax)</h4>
            <p className="text-xs text-stone-500">
              Automatically calculate and collect US State sales taxes, EU VAT, and Canadian GST at checkout.
            </p>
          </div>

          <button
            onClick={() => {
              onUpdateCommerce({ autoTaxEnabled: !commerce.autoTaxEnabled });
              setSaveNotice(true);
              setTimeout(() => setSaveNotice(false), 2000);
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
              commerce.autoTaxEnabled ? 'bg-stone-950' : 'bg-stone-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              commerce.autoTaxEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

    </div>
  );
};
