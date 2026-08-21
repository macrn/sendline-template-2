import React, { useState } from 'react';
import { AppView } from '../../types';
import { Check, ArrowRight, ShieldCheck, Sparkles, Inbox } from 'lucide-react';

interface PricingSectionProps {
  onNavigate: (view: AppView) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-white border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Flat, honest pricing. No subscriber penalties.
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            Choose a standalone screener mailbox for personal/team inbox calm, or unlock our complete marketing & transactional infrastructure.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full bg-stone-100 border border-stone-200">
            <button
              id="billing-monthly-btn"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !isAnnual ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Monthly
            </button>
            <button
              id="billing-annual-btn"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isAnnual ? 'bg-stone-950 text-white shadow-xs' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (4 columns or 3 columns with Standalone Mailbox highlighted) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Plan 1: Standalone Screener Mailbox (User requirement: standalone product) */}
          <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-300 flex flex-col justify-between space-y-6 relative hover:border-stone-400 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-stone-900" />
                  <h3 className="text-xl font-bold text-stone-950">Mailbox Only</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Standalone
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Pure personal & team inbox calm. Dedicated URL at <code className="text-stone-800 font-mono">mail.sendline.io</code>.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-stone-950">
                  ${isAnnual ? '12' : '15'}
                </span>
                <span className="text-xs text-stone-500">/ user / mo</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2.5 font-semibold text-stone-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>The Screener (1st-time sender bouncer)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>The Imbox + The Feed + The Paper Trail</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Spy-tracker blocker & zero read-receipts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Reply Later shelf + Focus Reply Flow</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Set Aside reference pile & Private Thread Clips</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom domain (@yourbrand.com) or @sendline.io</span>
                </li>
              </ul>
            </div>

            <button
              id="pricing-standalone-mailbox-btn"
              onClick={() => onNavigate('standalone-mailbox')}
              className="w-full py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span>Get Standalone Mailbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 2: Pro All-in-One Studio (Featured) */}
          <div className="p-8 rounded-3xl bg-stone-950 text-white border border-stone-900 shadow-xl flex flex-col justify-between space-y-6 relative">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">All-in-One Suite</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                  Most Popular
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Visual Campaign Studio + Transactional API + Unlimited Screener Mailboxes.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">
                  ${isAnnual ? '39' : '49'}
                </span>
                <span className="text-xs text-stone-400">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2.5 font-semibold text-white">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100,000 monthly emails included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Visual Campaign Studio & Curated Magazine Templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-30ms US-East & US-West Direct SMTP / Webhooks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Screener Mailbox included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Native Loyalty & VIP Point Redemptions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Custom Domains & Team Seats</span>
                </li>
              </ul>
            </div>

            <button
              id="pricing-pro-btn"
              onClick={() => onNavigate('dashboard')}
              className="w-full py-4 rounded-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
            >
              Start Complete Suite
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-950">Enterprise</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-700">
                  Dedicated IPs
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                For high-volume global senders requiring isolated IP infrastructure and 24/7 deliverability engineers.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-stone-950">
                  ${isAnnual ? '199' : '249'}
                </span>
                <span className="text-xs text-stone-500">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-stone-700">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1,000,000+ monthly emails</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated IP pool warming & reputation concierge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-region routing (US-East, US-West, EU, APAC)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom BIMI Verified Mark Certificate setup</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Deliverability Slack Channel</span>
                </li>
              </ul>
            </div>

            <button
              id="pricing-enterprise-btn"
              onClick={() => onNavigate('admin')}
              className="w-full py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-950 border border-stone-300 font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              Contact Enterprise
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
