import React, { useState } from 'react';
import { ReferralDetails } from '../../types/member';
import { 
  Copy, 
  Check, 
  Edit2, 
  ExternalLink, 
  Gift, 
  DollarSign, 
  Share2, 
  Sparkles, 
  HelpCircle,
  Download,
  CheckCircle2,
  PieChart,
  X
} from 'lucide-react';

interface ShareSendlineTabProps {
  referral: ReferralDetails;
  onUpdatePaypalEmail: (email: string) => void;
  onUpdateAffiliateCode?: (code: string) => void;
}

export const ShareSendlineTab: React.FC<ShareSendlineTabProps> = ({
  referral,
  onUpdatePaypalEmail,
  onUpdateAffiliateCode
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingPaypal, setIsEditingPaypal] = useState(false);
  const [paypalInput, setPaypalInput] = useState(referral.paypalEmail);

  const [isEditingCode, setIsEditingCode] = useState(false);
  const [codeInput, setCodeInput] = useState(referral.affiliateCode);

  const [downloadKitNotice, setDownloadKitNotice] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referral.affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSavePaypal = () => {
    if (paypalInput.trim()) {
      onUpdatePaypalEmail(paypalInput.trim());
      setIsEditingPaypal(false);
    }
  };

  const handleSaveCode = () => {
    if (codeInput.trim() && onUpdateAffiliateCode) {
      const sanitized = codeInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      onUpdateAffiliateCode(sanitized);
      setIsEditingCode(false);
    }
  };

  const handleDownloadKit = () => {
    setDownloadKitNotice(true);
    setTimeout(() => setDownloadKitNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 text-stone-900">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Your referral dashboard</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Earn recurring commissions and reward your creative network with Sendline partner benefits.
        </p>
      </div>

      {/* TOP TWO CARDS GRID (Screenshot 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: GIVE 25%, GET $15 */}
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between space-y-5 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💸</span>
              <h3 className="text-lg font-extrabold text-stone-950">
                Give {referral.discountPercentage}%, get ${referral.rewardAmount}
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Give your friends 25% off their first year of Sendline and get $15 when they become paying Sendline members!
            </p>
          </div>

          {/* Affiliate Link Box with Copy Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <span>Your affiliate link:</span>
              <button 
                onClick={() => setIsEditingCode(!isEditingCode)} 
                className="text-stone-600 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Customize code</span>
              </button>
            </div>

            {isEditingCode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-mono font-bold uppercase text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 w-full"
                />
                <button
                  onClick={handleSaveCode}
                  className="px-3 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingCode(false)}
                  className="p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-stone-300 shadow-xs">
                <div className="flex-1 px-2 font-mono text-xs font-semibold text-stone-800 truncate select-all">
                  {referral.affiliateUrl}
                </div>
                <button
                  id="copy-affiliate-link-btn"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-200/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Quick Share
              </span>
              <div className="flex items-center gap-2">
                {['Facebook', 'Pinterest', 'X (Twitter)', 'LinkedIn'].map((platform) => (
                  <button
                    key={platform}
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-[10px] font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-stone-400">
              See here for more details. By using the above link, you agree to Affiliate Terms
            </p>
          </div>
        </div>

        {/* CARD 2: SUCCESS KIT (Screenshot 1) */}
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-extrabold text-stone-950">Success kit</h3>
            </div>
            
            {/* Visual Kit Graphic Frame */}
            <div className="h-28 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-950 text-white p-4 flex items-center justify-between shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase font-bold">Partner Assets</span>
                <div className="text-sm font-serif font-bold">Email Swipes & Social Assets</div>
                <div className="text-[11px] text-stone-400">High-converting banners + Figma kits</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
                📦
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              We wanted to make it as easy as possible to generate passive revenue with your Sendline referrals. This simple kit equips you with everything you need to get rocking, rolling, and generating revenue.
            </p>
          </div>

          <div>
            <button
              id="get-success-kit-btn"
              onClick={handleDownloadKit}
              className="w-full py-3 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadKitNotice ? 'Kit Download Started!' : 'Get the kit'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 3: YOUR EARNINGS (Screenshot 1) */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h3 className="text-lg font-bold text-stone-950">Your earnings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Total Earnings */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
              <span>Total earnings</span>
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" title="All-time credited affiliate payouts" />
            </div>
            <div className="text-3xl font-extrabold text-stone-950 font-mono">
              ${referral.totalEarnings}
            </div>
          </div>

          {/* Upcoming Payouts */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
              <span>Upcoming payouts</span>
              <HelpCircle className="w-3.5 h-3.5 text-stone-400" title="Commission pending 30-day clearance" />
            </div>
            <div className="text-3xl font-extrabold text-stone-950 font-mono">
              ${referral.upcomingPayouts}
            </div>
          </div>

          {/* Paypal Email */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold uppercase tracking-wider">
              <span>Paypal email</span>
              <button onClick={() => setIsEditingPaypal(!isEditingPaypal)} className="text-stone-600 hover:text-stone-950 cursor-pointer">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {isEditingPaypal ? (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="email"
                  value={paypalInput}
                  onChange={(e) => setPaypalInput(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                />
                <button onClick={handleSavePaypal} className="p-1.5 bg-stone-950 text-white rounded-lg cursor-pointer">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold text-stone-900 font-mono truncate">
                  {referral.paypalEmail}
                </div>
                <div className="text-[10px] text-stone-400 font-medium">Used for direct monthly payouts</div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SECTION 4: ANALYTICS (Screenshot 1) */}
      <div className="space-y-4 pt-4 border-t border-stone-200 pb-8">
        <h3 className="text-lg font-bold text-stone-950">Analytics</h3>

        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Donut Chart Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Circular SVG Donut */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-200"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-stone-900 stroke-current"
                  strokeWidth="3.8"
                  strokeDasharray="0, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-stone-950 font-mono">0</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Conversions</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 max-w-[220px]">
              Share your affiliate link above to start making passive income!
            </p>
          </div>

          {/* Metric Stats Rows */}
          <div className="lg:col-span-7 space-y-4 divide-y divide-stone-200/80">
            <div className="flex items-center justify-between pb-3">
              <div>
                <div className="text-sm font-bold text-stone-900">Total referrals</div>
                <div className="text-xs text-stone-500">Unique visitors who clicked your link</div>
              </div>
              <span className="text-xl font-extrabold font-mono text-stone-950">{referral.totalReferrals}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-bold text-stone-900">Currently in trial</div>
                <div className="text-xs text-stone-500">Members testing their 30-day trial</div>
              </div>
              <span className="text-xl font-extrabold font-mono text-stone-950">{referral.currentlyInTrial}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-bold text-stone-900">Expired trials</div>
                <div className="text-xs text-stone-500">Trials that did not convert yet</div>
              </div>
              <span className="text-xl font-extrabold font-mono text-stone-950">{referral.expiredTrials}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
