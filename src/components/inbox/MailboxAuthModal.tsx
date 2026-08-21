import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  X, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  KeyRound
} from 'lucide-react';

export type UserAccessPlan = 'all_in_one' | 'mailbox_only';

interface MailboxAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserAccessPlan;
  onSelectPersona: (plan: UserAccessPlan, userEmail: string) => void;
}

export const MailboxAuthModal: React.FC<MailboxAuthModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPersona
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('mehmet@sendline.io');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedPlanType, setSelectedPlanType] = useState<UserAccessPlan>(currentPlan);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectPersona(selectedPlanType, emailInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-950 font-sans">
                {authMode === 'login' ? 'Sign in to Sendline Mail' : 'Create your Sendline Mailbox'}
              </h2>
              <p className="text-xs text-stone-500">
                Standalone screener & inbox engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Persona Quick Switcher for Testing (User requirement: test mailbox only vs all in one) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Simulate Account Access Level:</span>
              <span className="text-[10px] text-stone-500 font-mono">Instant Preview</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanType('mailbox_only');
                  setEmailInput('alex.standalone@mail.sendline.io');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlanType === 'mailbox_only'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                    : 'bg-white border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-extrabold text-stone-950">Mailbox Only</div>
                <div className="text-[11px] text-stone-500 mt-0.5">$15/mo Standalone</div>
                <div className="text-[10px] text-amber-800 font-medium mt-1">Marketing tools locked</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlanType('all_in_one');
                  setEmailInput('mehmet@sendline.io');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlanType === 'all_in_one'
                    ? 'bg-stone-900 text-white border-stone-900 ring-2 ring-stone-900/20'
                    : 'bg-white border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className={`text-xs font-extrabold ${selectedPlanType === 'all_in_one' ? 'text-white' : 'text-stone-950'}`}>
                  All-in-One Suite
                </div>
                <div className={`text-[11px] mt-0.5 ${selectedPlanType === 'all_in_one' ? 'text-stone-300' : 'text-stone-500'}`}>
                  $69/mo All Modules
                </div>
                <div className={`text-[10px] font-medium mt-1 ${selectedPlanType === 'all_in_one' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Full Workspace access
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-950 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-stone-950 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>{authMode === 'login' ? 'Sign in to Standalone Mail' : 'Create Mailbox Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-xs font-semibold text-stone-600 hover:text-stone-950 underline cursor-pointer"
            >
              {authMode === 'login'
                ? "Don't have a standalone mailbox yet? Sign up here"
                : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
