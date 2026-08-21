import React from 'react';
import { AppView } from '../../types';
import { MemberTab } from '../../types/member';
import { 
  LayoutDashboard, 
  Sparkles, 
  Folder,
  Zap, 
  Inbox, 
  Gift, 
  Settings, 
  Send, 
  Globe, 
  ExternalLink,
  User,
  Users,
  Shield,
  FileText,
  ShoppingBag,
  GitFork
} from 'lucide-react';
import { MemberMenuDropdown } from '../member/MemberMenuDropdown';

interface AppSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  pendingScreenerCount: number;
  activeDomain: string;
  onDomainChange: (domain: string) => void;
  onOpenMemberTab?: (tab: MemberTab) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  pendingScreenerCount,
  activeDomain,
  onDomainChange,
  onOpenMemberTab
}) => {
  const isCampaignActive = currentView === 'marketing' || currentView === 'my-templates';

  return (
    <aside className="w-64 bg-[#FAF8F5] border-r border-stone-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none text-stone-900 font-sans text-left">
      
      {/* Top Header & Brand */}
      <div>
        <div className="p-5 border-b border-stone-200/80 text-left">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Send className="w-3.5 h-3.5 transform -rotate-12" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-stone-950 text-base tracking-tight">sendline</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-800">
                    Pro
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium text-left">Workspace Engine</div>
              </div>
            </button>
          </div>

          {/* Active Domain Selector */}
          <div className="mt-4 p-2 rounded-2xl bg-white border border-stone-200/90 shadow-xs text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-1 mb-1 text-left">
              Active Sender Domain
            </div>
            <select
              value={activeDomain}
              onChange={(e) => onDomainChange(e.target.value)}
              className="w-full bg-stone-50 text-xs font-semibold text-stone-900 py-1.5 px-2 rounded-xl border border-stone-200 focus:outline-none cursor-pointer text-left"
            >
              <option value="sendline.io">@sendline.io</option>
              <option value="atelier-paris.com">atelier-paris.com</option>
              <option value="mail.nordicapparel.com">mail.nordicapparel.com</option>
            </select>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-3 text-left">
          <button
            id="sidebar-new-campaign-btn"
            onClick={() => onNavigate('template-editor')}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-950 text-white hover:bg-stone-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-left"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Campaign</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1 font-sans text-left">

          {/* Unified Template Studio (All-in-One Engine) */}
          <button
            id="sidebar-nav-unified-studio"
            onClick={() => onNavigate('unified-studio')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'unified-studio'
                ? 'bg-blue-600 text-white shadow-md font-black border-2 border-blue-600'
                : 'text-blue-950 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/90'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Sparkles className={`w-4 h-4 shrink-0 ${currentView === 'unified-studio' ? 'text-white' : 'text-blue-600'}`} />
              <span className="tracking-tight text-left">Unified Studio</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900 font-extrabold">
              NEW
            </span>
          </button>

          {/* Clean 3-in-1 Studio */}
          <button
            id="sidebar-nav-flodesk-studio"
            onClick={() => onNavigate('flodesk-templates')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'flodesk-templates'
                ? 'bg-amber-950 text-white shadow-md font-black border-2 border-amber-950'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 hover:text-stone-950 border border-amber-200/80'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Sparkles className={`w-4 h-4 shrink-0 ${currentView === 'flodesk-templates' ? 'text-amber-300' : 'text-amber-700'}`} />
              <span className="tracking-tight text-left">Flodesk Studio</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 font-extrabold">
              3-in-1
            </span>
          </button>
          
          {/* 1. Overview */}
          <button
            id="sidebar-nav-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'dashboard'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentView === 'dashboard' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Overview</span>
            </div>
          </button>

          {/* 2. Mailbox */}
          <button
            id="sidebar-nav-inbox"
            onClick={() => onNavigate('inbox')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'inbox'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Inbox className={`w-4 h-4 shrink-0 ${currentView === 'inbox' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Mailbox</span>
            </div>
            {pendingScreenerCount > 0 && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-black tracking-tight ${
                currentView === 'inbox' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {pendingScreenerCount}
              </span>
            )}
          </button>

          {/* 3. Campaign (Grouped with Saved Folders & Emails) */}
          <div className="space-y-1">
            <button
              id="sidebar-nav-marketing"
              onClick={() => onNavigate('marketing')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
                currentView === 'marketing'
                  ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                <Sparkles className={`w-4 h-4 shrink-0 ${currentView === 'marketing' ? 'text-white' : 'text-stone-600'}`} />
                <span className="tracking-tight text-left">Campaign</span>
              </div>
            </button>

            {/* Sub-item: Saved Folders & Emails */}
            <div className="pl-6 pr-1 space-y-0.5">
              <button
                id="sidebar-nav-my-templates"
                onClick={() => onNavigate('my-templates')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  currentView === 'my-templates'
                    ? 'bg-stone-900 text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <Folder className={`w-3.5 h-3.5 shrink-0 ${currentView === 'my-templates' ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span className="truncate text-left">Saved Folders & Emails</span>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Audience */}
          <button
            id="sidebar-nav-audience"
            onClick={() => onNavigate('audience')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'audience'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Users className={`w-4 h-4 shrink-0 ${currentView === 'audience' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Audience</span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black tracking-tight ${
              currentView === 'audience' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
            }`}>
              469k
            </span>
          </button>

          {/* 5. Forms & Lead Capture */}
          <button
            id="sidebar-nav-forms"
            onClick={() => onNavigate('forms')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'forms'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <FileText className={`w-4 h-4 shrink-0 ${currentView === 'forms' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Forms</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-black tracking-tight ${
              currentView === 'forms' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-800'
            }`}>
              Embed
            </span>
          </button>

          {/* 6. Workflows & Automations */}
          <button
            id="sidebar-nav-workflows"
            onClick={() => onNavigate('workflows')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'workflows' || currentView === 'workflow-studio'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <GitFork className={`w-4 h-4 shrink-0 ${currentView === 'workflows' || currentView === 'workflow-studio' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Workflows</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-black tracking-tight ${
              currentView === 'workflows' || currentView === 'workflow-studio' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-950 border border-purple-300'
            }`}>
              Auto
            </span>
          </button>

          {/* 7. Checkout & Pay Links */}
          <button
            id="sidebar-nav-checkout"
            onClick={() => onNavigate('checkout')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'checkout'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <ShoppingBag className={`w-4 h-4 shrink-0 ${currentView === 'checkout' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Checkout</span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black tracking-tight ${
              currentView === 'checkout' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
            }`}>
              Stripe
            </span>
          </button>

          {/* 7. Transactional */}
          <button
            id="sidebar-nav-transactional"
            onClick={() => onNavigate('transactional')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'transactional'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Zap className={`w-4 h-4 shrink-0 ${currentView === 'transactional' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Transactional</span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-black tracking-tight ${
              currentView === 'transactional' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
            }`}>
              SMTP
            </span>
          </button>

          {/* 8. Loyalty */}
          <button
            id="sidebar-nav-loyalty"
            onClick={() => onNavigate('loyalty')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
              currentView === 'loyalty'
                ? 'bg-stone-950 text-white shadow-md font-black border-2 border-stone-950'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/80 border-2 border-transparent font-bold'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Gift className={`w-4 h-4 shrink-0 ${currentView === 'loyalty' ? 'text-white' : 'text-stone-600'}`} />
              <span className="tracking-tight text-left">Loyalty</span>
            </div>
          </button>

        </nav>
      </div>

      {/* Bottom Section: Workspace Settings & View Public Site */}
      <div className="p-3 border-t-2 border-stone-200 space-y-2 font-sans">
        
        {/* Workspace & Account Settings Direct Button */}
        {onOpenMemberTab && (
          <button
            id="sidebar-settings-btn"
            onClick={() => onOpenMemberTab('account')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 hover:text-stone-950 text-xs sm:text-sm font-black border-2 border-stone-300 shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-stone-700" />
              <span>Settings</span>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-stone-100 text-stone-800 border border-stone-300">
              Config
            </span>
          </button>
        )}

        {/* Switch back to Landing Page */}
        <button
          id="sidebar-view-landing-btn"
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-stone-100/70 hover:bg-stone-200 text-stone-800 hover:text-stone-950 text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-stone-600" />
            <span>View Public Site</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>

    </aside>
  );
};
