import React, { useState } from 'react';
import { TeamMember, DomainMailbox } from '../../types/member';
import { 
  Mail, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  Building
} from 'lucide-react';

interface InviteAcceptanceModalProps {
  member: TeamMember;
  mailbox?: DomainMailbox;
  onClose: () => void;
  onAccept: (memberId: string, accountPassword: string) => void;
}

export const InviteAcceptanceModal: React.FC<InviteAcceptanceModalProps> = ({
  member,
  mailbox,
  onClose,
  onAccept
}) => {
  const [name, setName] = useState(member.name);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 8) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onAccept(member.id, password);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-6 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center font-bold text-xs">
              SL
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Sendline Team Invite</span>
              <h3 className="text-base font-extrabold text-stone-950">Join Workspace</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invite Info Capsule */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Invited to Workspace:</span>
            <span className="text-xs font-bold text-stone-950 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-stone-600" />
              <span>Atelier Paris</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Personal Login Email:</span>
            <span className="text-xs font-mono font-bold text-stone-900">{member.email}</span>
          </div>

          {mailbox && (
            <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-700" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-indigo-900">Assigned Domain Work Email</div>
                  <div className="text-xs font-mono font-extrabold text-indigo-950">{mailbox.email}</div>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900">
                ACTIVE
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>Granted Access:</span>
            <span className="font-semibold text-stone-800">
              {member.allowedModules?.includes('admin') ? 'Full Workspace' : 'Inbox Email Receive & Send'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-950"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
              Create Sendline Login Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-950"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded accent-stone-950"
            />
            <span>I accept the workspace invitation and agree to Sendline terms.</span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>{isSubmitting ? 'Joining Workspace...' : 'Accept Invitation & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
