import React, { useState } from 'react';
import { AppView, InboxEmail, ScreenerItem } from '../../types';
import { InboxHub } from './InboxHub';
import { MailboxAuthModal, UserAccessPlan } from './MailboxAuthModal';
import { 
  Globe, 
  Lock, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowLeft, 
  LayoutDashboard, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink,
  User,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface StandaloneMailboxViewProps {
  emails: InboxEmail[];
  screenerItems: ScreenerItem[];
  onScreenDecision: (id: string, decision: 'in' | 'out' | 'feed' | 'papertrail') => void;
  onSendEmail: (email: InboxEmail) => void;
  onNavigate: (view: AppView) => void;
  userPlan: UserAccessPlan;
  onUpdatePlan: (plan: UserAccessPlan, userEmail: string) => void;
  userEmail: string;
}

export const StandaloneMailboxView: React.FC<StandaloneMailboxViewProps> = ({
  emails,
  screenerItems,
  onScreenDecision,
  onSendEmail,
  onNavigate,
  userPlan,
  onUpdatePlan,
  userEmail
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWorkspaceLockedAlert, setShowWorkspaceLockedAlert] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText('https://mail.sendline.io/inbox');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTryAccessWorkspace = () => {
    if (userPlan === 'mailbox_only') {
      setShowWorkspaceLockedAlert(true);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-stone-900 flex flex-col font-sans select-none">
      
      {/* Main Mailbox Hub Container */}
      <div className="flex-1 bg-[#f5f4f0]">
        <InboxHub
          emails={emails}
          screenerItems={screenerItems}
          onScreenDecision={onScreenDecision}
          onSendEmail={onSendEmail}
          onNavigate={handleTryAccessWorkspace}
          isStandalone={true}
        />
      </div>

      {/* Auth & Persona Modal */}
      <MailboxAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentPlan={userPlan}
        onSelectPersona={(plan, email) => {
          onUpdatePlan(plan, email);
          setShowAuthModal(false);
        }}
      />

      {/* Access Denied / Upgrade Modal if Mailbox-Only user tries to open full marketing suite */}
      {showWorkspaceLockedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-2xl text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">
                Sendline Marketing & Transactional Engine Locked
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Your current plan is <strong className="text-amber-400">Sendline Mailbox Only ($15/mo)</strong>. Access to Visual Campaign Studio, Transactional APIs, and Custom DNS management requires upgrading to the All-in-One Suite.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5 text-xs">
              <div className="font-bold text-stone-200">All-in-One Plan includes:</div>
              <ul className="list-disc list-inside text-stone-400 space-y-0.5 text-[11px]">
                <li>Visual Campaign Builder & Magazine Templates</li>
                <li>Transactional Email API & Webhook Listeners</li>
                <li>Unlimited Custom Domains, BIMI, SPF/DKIM automation</li>
                <li>Unlimited Screener Mailbox seats</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowWorkspaceLockedAlert(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
              >
                Stay in Mailbox
              </button>

              <button
                onClick={() => {
                  onUpdatePlan('all_in_one', userEmail);
                  setShowWorkspaceLockedAlert(false);
                  onNavigate('dashboard');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Suite ($69/mo)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
