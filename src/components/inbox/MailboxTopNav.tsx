import React, { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  LogOut, 
  Mail,
  X,
  ChevronDown,
  Check,
  PenSquare
} from 'lucide-react';
import { MailboxCategory } from '../../types';

interface MailboxTopNavProps {
  activeTab?: MailboxCategory;
  onTabChange?: (tab: MailboxCategory) => void;
  pendingScreenerCount?: number;
  unreadImboxCount?: number;
  replyLaterCount?: number;
  setAsideCount?: number;
  clipsCount?: number;
  onOpenCompose?: () => void;
  onOpenReplyLater?: () => void;
  onOpenSetAside?: () => void;
  onOpenClips?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeMailboxEmail?: string;
  availableMailboxes?: string[];
  onSelectMailbox?: (email: string) => void;
  isStandalone?: boolean;
  onNavigateToWorkspace?: () => void;
}

export const MailboxTopNav: React.FC<MailboxTopNavProps> = ({
  searchQuery,
  onSearchChange,
  activeMailboxEmail = 'all',
  availableMailboxes = [
    'mehmet@sendline.io',
    'founder@sendline.io',
    'support@sendline.io',
    'sales@sendline.io'
  ],
  onSelectMailbox,
  onOpenCompose,
  onNavigateToWorkspace
}) => {
  const [showMailboxMenu, setShowMailboxMenu] = useState(false);

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 select-none text-stone-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Single Navbar Row */}
        <div className="h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Wordmark & Mailbox Selector Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div 
              onClick={onNavigateToWorkspace}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
              title="Go to Sendline Workspace"
            >
              {/* Coral Badge */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#ea583a] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 font-sans hidden xs:flex">
                <span className="font-black text-stone-900 text-base sm:text-lg tracking-tight">
                  Sendline
                </span>
                <span className="font-bold text-stone-400 text-base sm:text-lg">
                  Mail
                </span>
              </div>
            </div>

            {/* Mailbox Selector Dropdown (Replaces static domain text) */}
            <div className="relative">
              <button
                id="header-mailbox-dropdown-btn"
                onClick={() => setShowMailboxMenu(!showMailboxMenu)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-800 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs font-sans"
                title="Select active mailbox"
              >
                <Mail className="w-3.5 h-3.5 text-[#ea583a]" strokeWidth={2.5} />
                <span className="max-w-[120px] sm:max-w-[170px] truncate font-sans font-bold">
                  {activeMailboxEmail === 'all' ? 'All addresses' : activeMailboxEmail}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-500" strokeWidth={2.5} />
              </button>

              {/* Dropdown Menu */}
              {showMailboxMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMailboxMenu(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-stone-200 py-2 z-50 text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-100 font-sans">
                    <div className="px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-stone-400 font-sans">
                      Select Mailbox
                    </div>

                    <button
                      onClick={() => {
                        onSelectMailbox?.('all');
                        setShowMailboxMenu(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left font-bold font-sans flex items-center justify-between hover:bg-stone-100 cursor-pointer ${
                        activeMailboxEmail === 'all' ? 'text-[#ea583a] bg-rose-50/70' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-stone-400" />
                        <span className="font-sans font-bold">All addresses</span>
                      </div>
                      {activeMailboxEmail === 'all' && <Check className="w-4 h-4 text-[#ea583a]" strokeWidth={3} />}
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    {availableMailboxes.map((mbx) => (
                      <button
                        key={mbx}
                        onClick={() => {
                          onSelectMailbox?.(mbx);
                          setShowMailboxMenu(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left font-bold font-sans flex items-center justify-between hover:bg-stone-100 cursor-pointer ${
                          activeMailboxEmail === mbx ? 'text-[#ea583a] bg-rose-50/70' : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate font-sans font-semibold text-xs sm:text-sm">{mbx}</span>
                        </div>
                        {activeMailboxEmail === mbx && <Check className="w-4 h-4 text-[#ea583a] shrink-0" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Center Expanded Global Search Bar */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.5} />
              <input
                id="main-mailbox-search-input"
                type="text"
                placeholder="Search all emails, senders, receipts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-100 hover:bg-stone-50 text-xs sm:text-sm text-stone-900 font-medium pl-10 sm:pl-11 pr-10 py-2 sm:py-2.5 rounded-full border-2 border-stone-300 focus:border-[#ea583a] focus:bg-white focus:outline-none placeholder:text-stone-400 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Items: Compose + Dashboard & Log out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Primary Global Compose Button */}
            {onOpenCompose && (
              <button
                id="header-compose-btn"
                onClick={onOpenCompose}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#ea583a] hover:bg-[#d84b2e] text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 cursor-pointer border-2 border-rose-400"
                title="Compose New Message"
              >
                <PenSquare className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Compose</span>
              </button>
            )}

            {/* Dashboard Link */}
            <button
              id="header-dashboard-link"
              onClick={onNavigateToWorkspace}
              className="text-xs sm:text-sm font-bold text-stone-800 hover:text-stone-950 flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-200 transition-all cursor-pointer shadow-xs"
              title="Return to Dashboard"
            >
              <LayoutGrid className="w-4 h-4 text-stone-700" strokeWidth={2.5} />
              <span className="hidden md:inline font-black">Dashboard</span>
            </button>

            {/* Log out Link */}
            <button
              id="header-logout-link"
              onClick={onNavigateToWorkspace}
              className="text-xs sm:text-sm font-bold text-stone-600 hover:text-rose-600 flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden lg:inline">Log out</span>
            </button>

          </div>
        </div>

      </div>
    </header>
  );
};
