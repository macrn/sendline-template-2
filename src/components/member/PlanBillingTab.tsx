import React, { useState } from 'react';
import { PlanBillingDetails } from '../../types/member';
import { 
  Check, 
  Sparkles, 
  CreditCard, 
  Receipt, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PlanBillingTabProps {
  billing: PlanBillingDetails;
  onUpdatePlan: (plan: 'Lite' | 'Pro' | 'Everything', interval: 'monthly' | 'annual') => void;
}

export const PlanBillingTab: React.FC<PlanBillingTabProps> = ({
  billing,
  onUpdatePlan
}) => {
  const [isAnnual, setIsAnnual] = useState(billing.billingInterval === 'annual');
  const [selectedPlan, setSelectedPlan] = useState(billing.currentPlan);
  const [showTierDetails, setShowTierDetails] = useState(false);
  const [planSuccessNotice, setPlanSuccessNotice] = useState<string | null>(null);

  const handleSelectPlan = (plan: 'Lite' | 'Pro' | 'Everything') => {
    setSelectedPlan(plan);
    onUpdatePlan(plan, isAnnual ? 'annual' : 'monthly');
    setPlanSuccessNotice(`Switched to ${plan} (${isAnnual ? 'Annual' : 'Monthly'}) Plan!`);
    setTimeout(() => setPlanSuccessNotice(null), 3000);
  };

  const invoices = [
    { id: 'INV-2026-08', date: 'Aug 18, 2026', amount: isAnnual ? '$540.00' : '$49.00', status: 'Paid', plan: 'Everything Annual' },
    { id: 'INV-2026-07', date: 'Jul 18, 2026', amount: isAnnual ? '$540.00' : '$49.00', status: 'Paid', plan: 'Everything Annual' },
    { id: 'INV-2026-06', date: 'Jun 18, 2026', amount: isAnnual ? '$540.00' : '$49.00', status: 'Paid', plan: 'Everything Annual' }
  ];

  return (
    <div className="max-w-4xl space-y-10 text-stone-900">
      
      {/* Title & Description */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Plan + billing</h2>
        <p className="text-xs text-stone-500">
          Scale your email dispatch capacity, team collaboration seats, and e-commerce checkout funnels.
        </p>
      </div>

      {planSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{planSuccessNotice}</span>
        </div>
      )}

      {/* ANNUAL / MONTHLY TOGGLE (Screenshot 2: Annual 1 month free) */}
      <div className="flex items-center justify-center gap-3 py-2">
        <span className={`text-xs font-bold cursor-pointer transition-colors ${!isAnnual ? 'text-stone-950' : 'text-stone-400'}`} onClick={() => setIsAnnual(false)}>
          Monthly
        </span>
        
        {/* Toggle Switch */}
        <button
          id="billing-annual-toggle"
          onClick={() => {
            const next = !isAnnual;
            setIsAnnual(next);
            onUpdatePlan(selectedPlan, next ? 'annual' : 'monthly');
          }}
          className={`w-13 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
            isAnnual ? 'bg-stone-950' : 'bg-stone-300'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
            isAnnual ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsAnnual(true)}>
          <span className={`text-xs font-bold transition-colors ${isAnnual ? 'text-stone-950' : 'text-stone-400'}`}>
            Annual
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
            1 month free
          </span>
        </div>
      </div>

      {/* 3 PLAN TIERS GRID (Screenshot 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        
        {/* 1. LITE PLAN */}
        <div className={`rounded-3xl p-6 bg-white border flex flex-col justify-between transition-all ${
          selectedPlan === 'Lite' ? 'border-stone-950 ring-2 ring-stone-950 shadow-lg' : 'border-stone-200 hover:border-stone-300 shadow-xs'
        }`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-stone-950">Lite</h3>
              <p className="text-xs text-stone-500 mt-0.5">Everything you need to get started</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-950">
                  {isAnnual ? '$17' : '$19'}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ month</span>
              </div>
              {isAnnual && <div className="text-[11px] text-stone-400">Billed annually ($204/yr)</div>}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Unlimited email sends</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Forms & landing pages</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Up to 25,000 subscribers</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>1 team seat</span>
              </div>
              <div className="flex items-start gap-2 text-stone-500">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span>Limited time bonus: 1 workflow</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="get-lite-plan-btn"
              onClick={() => handleSelectPlan('Lite')}
              className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedPlan === 'Lite'
                  ? 'bg-stone-100 text-stone-800 border border-stone-300'
                  : 'bg-stone-950 hover:bg-stone-800 text-white shadow-xs'
              }`}
            >
              {selectedPlan === 'Lite' ? 'Current Plan' : 'Get Lite'}
            </button>
          </div>
        </div>

        {/* 2. PRO PLAN */}
        <div className={`rounded-3xl p-6 bg-white border flex flex-col justify-between transition-all ${
          selectedPlan === 'Pro' ? 'border-stone-950 ring-2 ring-stone-950 shadow-lg' : 'border-stone-200 hover:border-stone-300 shadow-xs'
        }`}>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-stone-950">Pro</h3>
              <p className="text-xs text-stone-500 mt-0.5">Advanced tools for growing brands</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-950">
                  {isAnnual ? '$22' : '$25'}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ month</span>
              </div>
              {isAnnual && <div className="text-[11px] text-stone-400">Billed annually ($264/yr)</div>}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-700">
              <div className="font-semibold text-stone-900 text-[11px] uppercase tracking-wider">
                Everything in Lite, plus:
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Unlimited workflows</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Advanced analytics & reporting</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Brand customization</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>2 team seats</span>
              </div>
              <div className="flex items-start gap-2 text-stone-500">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span>Limited time bonus: 1 checkout</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="get-pro-plan-btn"
              onClick={() => handleSelectPlan('Pro')}
              className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedPlan === 'Pro'
                  ? 'bg-stone-100 text-stone-800 border border-stone-300'
                  : 'bg-stone-950 hover:bg-stone-800 text-white shadow-xs'
              }`}
            >
              {selectedPlan === 'Pro' ? 'Current Plan' : 'Get Pro'}
            </button>
          </div>
        </div>

        {/* 3. EVERYTHING PLAN (Most Popular) */}
        <div className={`rounded-3xl p-6 bg-[#FAF8F5] border-2 flex flex-col justify-between relative shadow-xl transition-all ${
          selectedPlan === 'Everything' ? 'border-stone-950 ring-2 ring-stone-950' : 'border-stone-900'
        }`}>
          {/* Most popular badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-stone-950 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
            Most popular
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-stone-950">Everything</h3>
              <p className="text-xs text-stone-500 mt-0.5">Email meets e-commerce</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-950">
                  {isAnnual ? '$45' : '$49'}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ month</span>
              </div>
              {isAnnual && <div className="text-[11px] text-stone-400">Billed annually ($540/yr)</div>}
            </div>

            <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-xs text-stone-800">
              <div className="font-semibold text-stone-950 text-[11px] uppercase tracking-wider">
                Everything in Pro, plus:
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Unlimited integrated checkouts</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sales pages & funnels</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Subscription & payment plans</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Abandoned cart automations</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>3 team seats</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              id="get-everything-plan-btn"
              onClick={() => handleSelectPlan('Everything')}
              className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedPlan === 'Everything'
                  ? 'bg-stone-950 text-white shadow-md'
                  : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
              }`}
            >
              {selectedPlan === 'Everything' ? 'Current Plan' : 'Get Everything'}
            </button>
          </div>
        </div>

      </div>

      {/* SEE PLAN TIERS IN DETAIL (Screenshot 2) */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setShowTierDetails(!showTierDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
        >
          <span>See plan tiers in detail</span>
          {showTierDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showTierDetails && (
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-3 animate-in fade-in">
          <h4 className="font-bold text-stone-950 text-sm">Full Tier Capability Comparison</h4>
          <div className="grid grid-cols-3 gap-4 pt-2 divide-x divide-stone-200">
            <div>
              <div className="font-bold text-stone-900 mb-2">Lite ($19/mo)</div>
              <p className="text-stone-600 leading-relaxed">Best for single creators launching their first newsletter. Includes basic templates, unlimited sending up to 25k contacts.</p>
            </div>
            <div className="pl-4">
              <div className="font-bold text-stone-900 mb-2">Pro ($25/mo)</div>
              <p className="text-stone-600 leading-relaxed">For professional studios needing full workflow automations, custom branding, multi-author seats, and advanced deliverability analytics.</p>
            </div>
            <div className="pl-4">
              <div className="font-bold text-stone-900 mb-2">Everything ($49/mo)</div>
              <p className="text-stone-600 leading-relaxed">Complete all-in-one suite. Seamless sales checkout funnels, Stripe commerce integration, course sales, upselling, and 3 team seats.</p>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHOD & INVOICE HISTORY */}
      <div className="pt-6 border-t border-stone-200 space-y-6">
        <h3 className="text-lg font-bold text-stone-950">Payment method & billing history</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card On File */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">
                  {billing.cardBrand} ending in {billing.cardLast4}
                </div>
                <div className="text-xs text-stone-500 font-mono">Expires {billing.cardExp}</div>
              </div>
            </div>

            <button className="text-xs font-bold text-stone-700 hover:text-stone-950 underline cursor-pointer">
              Update
            </button>
          </div>

          {/* Next Invoice */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs text-stone-500 font-bold uppercase tracking-wider">Next invoice</div>
              <div className="text-sm font-bold text-stone-900">{billing.nextBillingDate}</div>
              <div className="text-xs text-emerald-600 font-semibold font-mono">Auto-renews at {isAnnual ? '$540.00/yr' : '$49.00/mo'}</div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700 uppercase tracking-wider">
            Recent Invoices
          </div>
          <div className="divide-y divide-stone-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between text-xs hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="font-bold text-stone-900">{inv.plan}</div>
                    <div className="text-stone-500 font-mono">{inv.date} • {inv.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-stone-900 font-mono">{inv.amount}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {inv.status}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer" title="Download Receipt PDF">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
