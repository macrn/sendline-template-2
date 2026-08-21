import React, { useState } from 'react';
import { AppView } from '../../types';
import { Gift, Star, ArrowRight, TrendingUp, Sparkles, Tag, Percent, Check } from 'lucide-react';

interface LoyaltyShowcaseProps {
  onNavigate: (view: AppView) => void;
}

export const LoyaltyShowcase: React.FC<LoyaltyShowcaseProps> = ({ onNavigate }) => {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(50000);

  const estimatedPoints = Math.floor(monthlyVolume * 1.8);
  const estimatedRepeatPurchases = Math.floor(monthlyVolume * 0.082);
  const estimatedRevenueLift = (estimatedRepeatPurchases * 85).toLocaleString();

  return (
    <section id="loyalty" className="py-24 bg-white border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Loyalty & Rewards
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Turn email opens into repeat revenue.
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            Stop paying for separate loyalty plugins. Reward subscribers with dynamic point balances, early access drops, and checkout voucher codes directly inside your emails.
          </p>
        </div>

        {/* Interactive Loyalty Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left: Simulator Card */}
          <div className="lg:col-span-6 rounded-3xl bg-[#FAF8F5] border border-stone-200 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-950 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-600" />
                  Revenue Lift Simulator
                </h3>
                <span className="text-xs font-medium text-stone-500">
                  DTC Benchmark
                </span>
              </div>

              {/* Slider */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold text-stone-800 mb-2">
                  <span>Monthly Subscriber List</span>
                  <span className="font-mono text-stone-950 font-bold">{monthlyVolume.toLocaleString()} Contacts</span>
                </div>
                <input
                  id="loyalty-volume-slider"
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-950"
                />
              </div>

              {/* Computed Output Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <div className="text-xs text-stone-500 font-medium">Points Distributed</div>
                  <div className="text-2xl font-bold text-stone-950 font-mono mt-1">
                    {estimatedPoints.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Via opens, clicks & checkouts</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200">
                  <div className="text-xs text-stone-500 font-medium">Estimated Extra Lift</div>
                  <div className="text-2xl font-bold text-stone-950 font-mono mt-1">
                    ${estimatedRevenueLift}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">From automated VIP rewards</div>
                </div>
              </div>
            </div>

            <button
              id="loyalty-open-hub-btn"
              onClick={() => onNavigate('loyalty')}
              className="w-full py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore Loyalty Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Tactile Physical VIP Pass Preview */}
          <div className="lg:col-span-6 rounded-3xl bg-[#7A5B35] p-6 sm:p-8 flex flex-col justify-between text-white shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <span className="text-xs font-black tracking-[0.25em] uppercase text-amber-200 font-sans">
                  MAISON PRIVILEGE PASS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  GOLD TIER
                </span>
              </div>

              <div className="my-6 space-y-2">
                <div className="text-3xl sm:text-4xl font-bold font-serif-display leading-tight">
                  2,450 VIP Points Available
                </div>
                <p className="text-xs text-amber-100 font-sans leading-relaxed max-w-md">
                  Dynamic customer barcode & coupon code rendered inside the email template with zero sync delay.
                </p>
              </div>

              {/* Coupon Cutout */}
              <div className="p-4 rounded-2xl bg-[#FAF8F3] text-stone-900 border border-dashed border-stone-300 flex items-center justify-between shadow-inner">
                <div>
                  <div className="text-xs font-bold text-stone-950 font-mono">CODE: PRIVILEGE-30</div>
                  <div className="text-[11px] text-stone-500">$30 off any order above $120</div>
                </div>
                <button className="px-4 py-2 rounded-full bg-stone-950 text-white text-xs font-semibold">
                  Auto-Applied
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs text-amber-100 font-medium">
              <span>Synchronized with Stripe & Shopify</span>
              <span>100% Native Architecture</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
