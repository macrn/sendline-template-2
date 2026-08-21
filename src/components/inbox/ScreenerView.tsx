import React, { useState } from 'react';
import { ScreenerItem } from '../../types';
import { 
  Shield, 
  Check, 
  X, 
  Layers, 
  Receipt, 
  Inbox, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Search,
  EyeOff,
  ArrowLeft
} from 'lucide-react';

interface ScreenerViewProps {
  screenerItems: ScreenerItem[];
  onScreenDecision: (id: string, decision: 'in' | 'out' | 'feed' | 'papertrail') => void;
  onUndoDecision?: (id: string) => void;
  onTabSwitch?: (tab: 'imbox' | 'feed' | 'papertrail' | 'screener') => void;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  screenerItems,
  onScreenDecision,
  onUndoDecision,
  onTabSwitch
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const pendingItems = screenerItems.filter(s => s.status === 'pending');
  const historyItems = screenerItems.filter(s => s.status !== 'pending');

  return (
    <div className="py-8 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        
        {/* Header: Left = Icon & Title; Right = Category Navigation Pills */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2a2826]">
          
          {/* Left: Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ea583a] text-white flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Screener
            </h1>
          </div>

          {/* Right: Category Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-[#222120] p-1 rounded-2xl border-2 border-[#33312e] shrink-0">
            <button
              onClick={() => onTabSwitch?.('imbox')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
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
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Paper Trail</span>
            </button>

            <button
              onClick={() => onTabSwitch?.('screener')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-[#ea583a] text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Screener</span>
              {pendingItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-white text-stone-900">
                  {pendingItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Workflow & Sub Tabs: Pending, Screened */}
        <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar border-b border-[#282725]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-[#ea583a] text-white shadow-xs font-black'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Pending</span>
            {pendingItems.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'pending' ? 'bg-white text-stone-900' : 'bg-rose-500 text-white'
              }`}>
                {pendingItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#ea583a] text-white shadow-xs font-black'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Screened History</span>
            {historyItems.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'history' ? 'bg-white text-stone-900' : 'bg-stone-700 text-stone-300'
              }`}>
                {historyItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Subtitle / Explanation banner */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-3 text-xs text-rose-200">
          <Shield className="w-4 h-4 text-rose-400 shrink-0" strokeWidth={2.5} />
          <span>
            <strong>The Screener:</strong> You hold the keys. First-time senders wait here until you approve or reject them, protecting your inbox from spam and cold pitches.
          </span>
        </div>

        {/* PENDING QUEUE */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingItems.length > 0 ? (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1c1b1a] hover:bg-[#232220] border-2 border-[#292725] hover:border-[#3d3a36] rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-sm"
                >
                  {/* Sender Metadata */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#143a35] text-[#2dd4bf] border-2 border-[#246059] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                        {item.avatar || item.senderName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-white">
                            {item.senderName}
                          </span>
                          <span className="text-xs text-stone-400 font-mono font-medium">
                            {item.senderEmail}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 font-mono font-medium">
                          {item.receivedAt} · First contact
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject & Snippet */}
                  <div className="bg-[#242321] rounded-2xl p-4 sm:p-5 border-2 border-[#33312e] space-y-1.5 shadow-inner">
                    <div className="text-sm font-black text-white">
                      {item.subject}
                    </div>
                    <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                      {item.snippet}
                    </div>
                  </div>

                  {/* Decision Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2a2826]">
                    <div className="text-xs text-stone-400 font-bold">
                      Allow this sender into your mailbox?
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onScreenDecision(item.id, 'out')}
                        className="px-3.5 py-2 rounded-2xl bg-[#262422] hover:bg-rose-950/60 text-stone-300 hover:text-rose-400 text-xs font-black flex items-center gap-1.5 transition-colors border-2 border-[#383532] cursor-pointer shadow-xs"
                        title="Screen out - You will never hear from them again"
                      >
                        <X className="w-4 h-4" strokeWidth={2.5} />
                        <span>No (Screen Out)</span>
                      </button>

                      <button
                        onClick={() => onScreenDecision(item.id, 'feed')}
                        className="px-3.5 py-2 rounded-2xl bg-[#262422] hover:bg-emerald-950/60 text-stone-300 hover:text-emerald-400 text-xs font-black flex items-center gap-1.5 transition-colors border-2 border-[#383532] cursor-pointer shadow-xs"
                        title="Put future emails in Feed"
                      >
                        <Layers className="w-4 h-4" strokeWidth={2.5} />
                        <span>Feed</span>
                      </button>

                      <button
                        onClick={() => onScreenDecision(item.id, 'papertrail')}
                        className="px-3.5 py-2 rounded-2xl bg-[#262422] hover:bg-indigo-950/60 text-stone-300 hover:text-indigo-400 text-xs font-black flex items-center gap-1.5 transition-colors border-2 border-[#383532] cursor-pointer shadow-xs"
                        title="Put receipts in Paper Trail"
                      >
                        <Receipt className="w-4 h-4" strokeWidth={2.5} />
                        <span>Paper Trail</span>
                      </button>

                      <button
                        onClick={() => onScreenDecision(item.id, 'in')}
                        className="px-4 py-2 rounded-2xl bg-[#ea583a] hover:bg-[#d44827] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer border-2 border-rose-400 hover:scale-105"
                        title="Accept into Inbox"
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                        <span>Yes (Inbox)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#232220] text-emerald-400 border-2 border-[#383633] flex items-center justify-center mx-auto shadow-md">
                  <Shield className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-black text-white">Screener Queue is Empty</h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto font-medium">
                  All first-time senders have been screened. You are fully protected from unsolicited email noise.
                </p>
              </div>
            )}
          </div>
        )}

        {/* HISTORY QUEUE */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#1c1b1a] border-2 border-[#292725] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-xs sm:text-sm shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs border-2 shadow-xs ${
                    item.status === 'in' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : item.status === 'feed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : item.status === 'papertrail'
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}>
                    {item.status === 'in' ? <Check className="w-4 h-4" strokeWidth={3} /> : item.status === 'out' ? <X className="w-4 h-4" strokeWidth={3} /> : <Layers className="w-4 h-4" strokeWidth={2.5} />}
                  </div>

                  <div>
                    <div className="font-black text-white">{item.senderName}</div>
                    <div className="text-xs text-stone-400 font-mono font-medium">{item.senderEmail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border-2 ${
                    item.status === 'in' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : item.status === 'feed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : item.status === 'papertrail'
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}>
                    {item.status === 'in' ? 'Approved (Inbox)' : item.status === 'feed' ? 'Routed to Feed' : item.status === 'papertrail' ? 'Routed to Paper Trail' : 'Screened Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
