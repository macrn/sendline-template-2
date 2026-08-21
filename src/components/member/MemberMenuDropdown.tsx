import React, { useState, useRef, useEffect } from 'react';
import { MemberTab } from '../../types/member';
import { 
  User, 
  Users, 
  Mail, 
  Globe, 
  ShoppingBag, 
  Palette, 
  ShieldCheck, 
  FileText, 
  Layers, 
  CreditCard, 
  Gift, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface MemberMenuDropdownProps {
  currentTab?: MemberTab;
  onOpenMemberTab: (tab: MemberTab) => void;
  onSignOut?: () => void;
  userInitial?: string;
}

export const MemberMenuDropdown: React.FC<MemberMenuDropdownProps> = ({
  onOpenMemberTab,
  onSignOut,
  userInitial = 'm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tab: MemberTab) => {
    setIsOpen(false);
    onOpenMemberTab(tab);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Avatar Button Circle (Screenshot 4: circle 'm') */}
      <button
        id="member-avatar-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-serif font-bold text-sm flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer shadow-sm border border-stone-700/50"
        title="Member Account & Settings"
      >
        <span>{userInitial}</span>
      </button>

      {/* DROPDOWN MENU (Screenshot 4) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200/90 shadow-2xl py-2 z-50 text-stone-900 text-xs animate-in fade-in zoom-in-95 duration-150 select-none">
          
          {/* GROUP 1: ACCOUNT & TEAM */}
          <div className="px-1 py-1">
            <button
              onClick={() => handleSelect('account')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Account overview</span>
            </button>

            <button
              onClick={() => handleSelect('team')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Team members</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700">New</span>
            </button>
          </div>

          <div className="h-px bg-stone-200/80 my-1 mx-2" />

          {/* GROUP 2: DELIVERABILITY & COMMERCE */}
          <div className="px-1 py-1">
            <button
              onClick={() => handleSelect('email-setup')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Email setup
            </button>

            <button
              onClick={() => handleSelect('domain-setup')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Domain setup
            </button>

            <button
              onClick={() => handleSelect('commerce-setup')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Commerce setup</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700">New</span>
            </button>
          </div>

          <div className="h-px bg-stone-200/80 my-1 mx-2" />

          {/* GROUP 3: BRANDING & POLICIES */}
          <div className="px-1 py-1">
            <button
              onClick={() => handleSelect('branding')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Branding
            </button>

            <button
              onClick={() => handleSelect('opt-in')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Opt-in setup
            </button>

            <button
              onClick={() => handleSelect('data-privacy')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Data and privacy
            </button>

            <button
              onClick={() => handleSelect('integrations')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Integrations
            </button>
          </div>

          <div className="h-px bg-stone-200/80 my-1 mx-2" />

          {/* GROUP 4: BILLING & REFERRAL */}
          <div className="px-1 py-1">
            <button
              onClick={() => handleSelect('plan-billing')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-800 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Plan + billing
            </button>

            <button
              onClick={() => handleSelect('share-sendline')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-semibold text-stone-900 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Share Sendline 💸</span>
            </button>
          </div>

          <div className="h-px bg-stone-200/80 my-1 mx-2" />

          {/* GROUP 5: HELP & LOGOUT */}
          <div className="px-1 py-1">
            <button
              onClick={() => handleSelect('get-help')}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
            >
              Get help
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onSignOut) onSignOut();
              }}
              className="w-full px-3.5 py-2 rounded-xl text-left font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
