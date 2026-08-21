import React, { useState } from 'react';
import { AppView, LoyaltyTier, LoyaltyMember, CouponReward } from '../../types';
import { 
  Gift, 
  Star, 
  TrendingUp, 
  Tag, 
  Award, 
  Users, 
  Plus, 
  Check, 
  Percent, 
  Sparkles, 
  Clock, 
  Copy, 
  CheckCircle2, 
  DollarSign, 
  Sliders 
} from 'lucide-react';

interface LoyaltyHubProps {
  tiers: LoyaltyTier[];
  members: LoyaltyMember[];
  rewards: CouponReward[];
  onAddReward: (reward: CouponReward) => void;
  onNavigate: (view: AppView) => void;
}

export const LoyaltyHub: React.FC<LoyaltyHubProps> = ({
  tiers,
  members,
  rewards,
  onAddReward,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'coupons' | 'members' | 'automation'>('tiers');
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('20% OFF');
  const [newPointsCost, setNewPointsCost] = useState(1000);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCreateCoupon = () => {
    if (!newCode.trim()) return;
    const newRwd: CouponReward = {
      id: 'rwd-' + Date.now(),
      code: newCode.toUpperCase().trim(),
      discount: newDiscount,
      pointsCost: Number(newPointsCost),
      expiresIn: '30 days',
      claimedCount: 0,
      active: true
    };
    onAddReward(newRwd);
    setShowCreateCouponModal(false);
    setNewCode('');
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans">
      
      {/* 1. Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Loyalty & Rewards
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Omnichannel Native
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Reward email opens, clicks, and transactional checkouts with dynamic VIP tiers and auto-redeemable promo codes.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto">
          <button
            id="loyalty-tab-tiers"
            onClick={() => setActiveTab('tiers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tiers'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>VIP Tiers</span>
          </button>

          <button
            id="loyalty-tab-coupons"
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promo Codes</span>
          </button>

          <button
            id="loyalty-tab-members"
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Member Directory</span>
          </button>

          <button
            id="loyalty-tab-automation"
            onClick={() => setActiveTab('automation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'automation'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Point Triggers</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
        
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Points In Circulation</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Gift className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              142,500
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>+18.2% this week</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>VIP Tier Members</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Star className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              23,670
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-normal pt-1 border-t border-stone-100">
            <span>430 Platinum Luminaries</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Repeat Sales</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              $64,250
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <span>From promo redemption</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Points / Open</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              25 PTS
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-stone-500 text-xs font-normal pt-1 border-t border-stone-100">
            <span>Drives 58%+ open rate</span>
          </div>
        </div>

      </div>

      {/* 3. Main Content Card / Hub Body */}
      <div className="space-y-6">
        
        {/* 1. VIP TIERS VIEW */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-2xs flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      {tier.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {tier.minPoints.toLocaleString()}+ PTS
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-stone-900 font-mono">
                    {tier.discountRate}
                  </div>

                  <div className="text-xs text-stone-500">
                    <strong className="text-stone-900 font-semibold">{tier.memberCount.toLocaleString()}</strong> active cardholders
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                    <div className="text-[10px] font-bold text-stone-400 uppercase">Tier Perks:</div>
                    {tier.perks.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-stone-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-center text-xs font-medium text-stone-600">
                  Auto-Upgraded via Email Opens
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. COUPON CODES VIEW */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-stone-900">Active Discount & Reward Codes</h2>
                <p className="text-xs text-stone-500">These codes sync directly with your e-commerce checkout</p>
              </div>

              <button
                id="loyalty-create-coupon-btn"
                onClick={() => setShowCreateCouponModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-stone-300" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((rwd) => (
                <div key={rwd.id} className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      {rwd.discount}
                    </span>
                    <span className="text-xs text-stone-500">Cost: <strong className="text-stone-900 font-mono font-bold">{rwd.pointsCost} pts</strong></span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between font-mono text-sm font-bold text-stone-900">
                    <span>{rwd.code}</span>
                    <button
                      onClick={() => copyCode(rwd.code, rwd.id)}
                      className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 cursor-pointer"
                    >
                      {copiedCodeId === rwd.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                    <span>Redeemed: <strong className="text-stone-900">{rwd.claimedCount} times</strong></span>
                    <span>Expires: <strong className="text-stone-700">{rwd.expiresIn}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div className="rounded-xl bg-white border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4">Referrals</th>
                    <th className="py-3 px-4">Lifetime Value</th>
                    <th className="py-3 px-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {members.map((mem) => (
                    <tr key={mem.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-950">{mem.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">{mem.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-semibold">
                          {mem.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{mem.points.toLocaleString()} PTS</td>
                      <td className="py-3 px-4 text-stone-600 font-medium">{mem.referrals} referred</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{mem.lifetimeValue}</td>
                      <td className="py-3 px-4 text-stone-400 text-[11px]">{mem.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. AUTOMATED POINT TRIGGERS */}
        {activeTab === 'automation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-semibold text-stone-900">Email Interaction Rewards</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Newsletter Opened</div>
                    <div className="text-stone-500 text-[11px]">Awarded immediately upon tracking pixel trigger</div>
                  </div>
                  <span className="text-stone-900 font-bold font-mono">+15 PTS</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Editorial Link Clicked</div>
                    <div className="text-stone-500 text-[11px]">Awarded when recipient explores drop collection</div>
                  </div>
                  <span className="text-stone-900 font-bold font-mono">+50 PTS</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">3rd Consecutive Email Open</div>
                    <div className="text-stone-500 text-[11px]">Streak bonus driving consistent inbox engagement</div>
                  </div>
                  <span className="text-stone-900 font-bold font-mono">+100 PTS</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-semibold text-stone-900">Transactional & Purchase Triggers</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Order Completed (Stripe/Shopify)</div>
                    <div className="text-stone-500 text-[11px]">Calculated as 2x order dollar total</div>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">2x PTS / $</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Referral Friend Completed 1st Order</div>
                    <div className="text-stone-500 text-[11px]">Automatically credited to referrer wallet</div>
                  </div>
                  <span className="text-stone-900 font-bold font-mono">+500 PTS</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Create Coupon Modal */}
      {showCreateCouponModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-stone-200 p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-stone-700" />
                Create New Loyalty Promo Code
              </h3>
              <button onClick={() => setShowCreateCouponModal(false)} className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-600 font-medium block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP-SUMMER-20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-mono uppercase focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-stone-600 font-medium block mb-1">Discount Amount</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF or $25 Credit"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-stone-600 font-medium block mb-1">Points Cost to Redeem</label>
                <input
                  type="number"
                  value={newPointsCost}
                  onChange={(e) => setNewPointsCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-mono focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowCreateCouponModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Create Promo Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
