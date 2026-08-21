import React, { useState } from 'react';
import { AppView } from '../../types';
import { MemberTab } from '../../types/member';
import { X, User } from 'lucide-react';
import { MemberMenuDropdown } from '../member/MemberMenuDropdown';

interface LandingHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenMemberTab?: (tab: MemberTab) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onNavigate,
  onOpenMemberTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Minimal Brand Wordmark (Flodesk lowercase style) */}
          <button 
            id="header-brand-logo"
            onClick={() => onNavigate('landing')}
            className="flex items-center group text-left cursor-pointer focus:outline-none"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-stone-950 font-sans">
              sendline
            </span>
          </button>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              id="header-nav-flodesk-btn"
              onClick={() => onNavigate('flodesk-templates')}
              className="text-sm font-bold text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>✨ Flodesk 3-in-1 Studio</span>
            </button>

            <button
              id="header-nav-marketing-btn"
              onClick={() => onNavigate('marketing')}
              className="text-sm font-bold text-stone-800 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Email Campaigns
            </button>

            <button
              id="header-nav-workflows-btn"
              onClick={() => onNavigate('workflows')}
              className="text-sm font-bold text-stone-800 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Automations
            </button>

            <button
              id="header-nav-forms-btn"
              onClick={() => onNavigate('forms')}
              className="text-sm font-bold text-stone-800 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Forms
            </button>

            <button
              id="header-nav-mailbox-btn"
              onClick={() => onNavigate('inbox')}
              className="text-sm font-bold text-stone-800 hover:text-stone-950 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mailbox</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                InBox
              </span>
            </button>

            <a 
              href="#pricing" 
              className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
            >
              Pricing
            </a>
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="header-login-btn"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-full border border-stone-300 hover:border-stone-950 text-sm font-bold text-stone-900 transition-colors cursor-pointer"
            >
              Open Workspace
            </button>

            <button
              id="header-try-free-btn"
              onClick={() => onNavigate('template-editor')}
              className="px-5 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Open Studio</span>
            </button>

            {onOpenMemberTab && (
              <div className="pl-2 border-l border-stone-200">
                <MemberMenuDropdown onOpenMemberTab={onOpenMemberTab} />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (Two minimalist lines like screenshot) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="header-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <div className="w-6 h-3.5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-stone-950 rounded-full" />
                  <span className="w-full h-0.5 bg-stone-950 rounded-full" />
                </div>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4 text-lg font-medium text-stone-800">
            <button
              onClick={() => {
                onNavigate('marketing');
                setMobileMenuOpen(false);
              }}
              className="text-left font-bold text-stone-950 hover:text-stone-700"
            >
              Campaigns & Templates
            </button>
            <button
              onClick={() => {
                onNavigate('workflows');
                setMobileMenuOpen(false);
              }}
              className="text-left font-bold text-stone-950 hover:text-stone-700"
            >
              Automations & Workflows
            </button>
            <button
              onClick={() => {
                onNavigate('forms');
                setMobileMenuOpen(false);
              }}
              className="text-left font-bold text-stone-950 hover:text-stone-700"
            >
              Forms & Lead Gen
            </button>
            <a 
              href="#screener" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-stone-950"
            >
              Screener Inbox
            </a>
            <a 
              href="#transactional" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-stone-950"
            >
              Transactional API
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-stone-950"
            >
              Pricing
            </a>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
            <button
              onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
              className="w-full py-3 rounded-full bg-stone-100 text-stone-950 font-medium text-sm text-center"
            >
              Log in to Workspace
            </button>
            <button
              onClick={() => { onNavigate('template-editor'); setMobileMenuOpen(false); }}
              className="w-full py-3 rounded-full bg-stone-950 text-white font-medium text-sm text-center"
            >
              Try it free
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
