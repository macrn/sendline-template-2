import React, { useState } from 'react';
import { InboxEmail } from '../../types';
import { 
  Receipt, 
  Download, 
  FileText, 
  ShieldAlert, 
  Truck, 
  Inbox, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Filter,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

interface PaperTrailViewProps {
  emails: InboxEmail[];
  onMoveCategory: (emailId: string, category: 'imbox' | 'feed' | 'papertrail') => void;
  onScreenOutSender: (senderEmail: string, emailId: string) => void;
  searchQuery?: string;
  onTabSwitch?: (tab: 'imbox' | 'feed' | 'papertrail' | 'screener') => void;
}

export const PaperTrailView: React.FC<PaperTrailViewProps> = ({
  emails,
  onMoveCategory,
  onScreenOutSender,
  searchQuery = '',
  onTabSwitch
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<InboxEmail | null>(null);

  const paperTrailEmails = emails.filter(e => {
    if (e.category !== 'papertrail' || e.isDeleted) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.senderName.toLowerCase().includes(q) ||
      (e.paperTrailMeta?.merchant && e.paperTrailMeta.merchant.toLowerCase().includes(q)) ||
      (e.paperTrailMeta?.orderNumber && e.paperTrailMeta.orderNumber.toLowerCase().includes(q))
    );
  });

  const totalSpend = paperTrailEmails.reduce((acc, email) => {
    const raw = email.paperTrailMeta?.amount?.replace(/[^0-9.]/g, '');
    const num = raw ? parseFloat(raw) : 0;
    return acc + num;
  }, 0);

  return (
    <div className="py-8 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        
        {/* Header: Left = Icon & Title & Total Spend; Right = Category Navigation Pills */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2a2826]">
          
          {/* Left: Icon, Title & Spend Metric */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Receipt className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Paper Trail
            </h1>
            <div className="px-3 py-1 rounded-xl bg-[#242321] border-2 border-[#383633] flex items-center gap-2 shadow-xs">
              <span className="text-[10px] uppercase font-black tracking-wider text-stone-400">Total:</span>
              <span className="text-xs font-black text-emerald-400 font-mono">
                ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Right: Category Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-[#222120] p-1 rounded-2xl border-2 border-[#33312e] shrink-0">
            <button
              onClick={() => onTabSwitch?.('imbox')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-300 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Inbox</span>
            </button>

            <button
              onClick={() => onTabSwitch?.('feed')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Feed</span>
            </button>

            <button
              onClick={() => onTabSwitch?.('papertrail')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-indigo-600 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Paper Trail</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-indigo-950 text-indigo-200">
                {paperTrailEmails.length}
              </span>
            </button>

            <button
              onClick={() => onTabSwitch?.('screener')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Screener</span>
            </button>
          </div>
        </div>

        {/* Subtitle / Explanation banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-center gap-3 text-xs text-indigo-200">
          <Receipt className="w-4 h-4 text-indigo-400 shrink-0" strokeWidth={2.5} />
          <span>
            <strong>The Paper Trail:</strong> A dedicated, searchable ledger for receipts, order confirmations, travel bookings, and 2FA codes that never clutters your inbox.
          </span>
        </div>

        {/* Ledger Rows */}
        <div className="space-y-3">
          {paperTrailEmails.length > 0 ? (
            paperTrailEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedReceipt(selectedReceipt?.id === email.id ? null : email)}
                className="bg-[#1c1b1a] hover:bg-[#232220] border-2 border-[#292725] hover:border-[#3d3a36] rounded-2xl p-4 sm:p-5 transition-all cursor-pointer space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Merchant & Subject */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-indigo-300 border-2 border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      <Receipt className="w-5 h-5" strokeWidth={2.5} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-white text-sm sm:text-base">
                          {email.paperTrailMeta?.merchant || email.senderName}
                        </span>
                        {email.paperTrailMeta?.orderNumber && (
                          <span className="text-xs text-stone-300 font-mono font-bold bg-[#282725] px-2.5 py-0.5 rounded-lg border border-[#3d3a36]">
                            #{email.paperTrailMeta.orderNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-stone-300 font-medium truncate mt-0.5">
                        {email.subject}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                    {email.paperTrailMeta?.amount && (
                      <div className="text-sm sm:text-base font-black text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800 shadow-xs">
                        {email.paperTrailMeta.amount}
                      </div>
                    )}
                    <div className="text-xs font-mono font-bold text-stone-400 whitespace-nowrap">
                      {email.receivedAt}
                    </div>
                  </div>

                </div>

                {/* Expanded Receipt Details */}
                {selectedReceipt?.id === email.id && (
                  <div className="pt-4 border-t border-[#2a2826] text-xs space-y-3 animate-in fade-in duration-100">
                    <div className="bg-[#242321] rounded-2xl p-5 font-mono text-stone-200 whitespace-pre-line leading-relaxed border-2 border-[#33312e] text-xs sm:text-sm shadow-inner">
                      {email.body}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveCategory(email.id, 'imbox');
                        }}
                        className="px-4 py-2 rounded-2xl bg-[#282725] hover:bg-[#33312e] border-2 border-[#3d3a36] text-white font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Inbox className="w-4 h-4 text-[#ea583a]" strokeWidth={2.5} />
                        <span>Move to Inbox</span>
                      </button>

                      <div className="text-xs text-stone-400 font-mono font-medium">
                        Received from {email.senderEmail}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#232220] text-stone-400 border border-[#33312e] flex items-center justify-center mx-auto">
                <Receipt className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white">No transactions in Paper Trail</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Receipts, invoices, and confirmation codes will land here quietly without cluttering your main Inbox.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
