import React, { useState } from 'react';
import { UserAccountDetails, ActiveUserSession, DomainMailbox } from '../../types/member';
import { 
  Edit2, 
  Check, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Calendar, 
  Lock, 
  KeyRound, 
  X, 
  QrCode, 
  Sparkles,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  Building,
  Info
} from 'lucide-react';

interface AccountOverviewTabProps {
  account: UserAccountDetails;
  activeSession?: ActiveUserSession;
  assignedMailbox?: DomainMailbox;
  onUpdateAccount: (updated: Partial<UserAccountDetails>) => void;
  onChangeMailboxPassword?: (mailboxId: string, newPass: string) => void;
}

export const AccountOverviewTab: React.FC<AccountOverviewTabProps> = ({
  account,
  activeSession,
  assignedMailbox,
  onUpdateAccount,
  onChangeMailboxPassword
}) => {
  const isOwner = !activeSession || activeSession.isOwner;

  // Inline editing states
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(activeSession ? activeSession.personalEmail : account.email);

  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState(account.handle);

  const [fullNameInput, setFullNameInput] = useState(activeSession ? activeSession.name : account.fullName);
  const [savedNameNotice, setSavedNameNotice] = useState(false);

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Mailbox Password Modal (for team members)
  const [showMailboxPassModal, setShowMailboxPassModal] = useState(false);
  const [newMailboxPass, setNewMailboxPass] = useState('');
  const [showMailboxPass, setShowMailboxPass] = useState(false);
  const [mailboxPassSuccess, setMailboxPassSuccess] = useState(false);

  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaStep, setMfaStep] = useState<'qr' | 'success'>('qr');

  const timezones = [
    'Central European Time (09:52 am)',
    'Eastern Time (US & Canada) (03:52 am)',
    'Pacific Time (US & Canada) (00:52 am)',
    'Central Time (US & Canada) (02:52 am)',
    'Mountain Time (US & Canada) (01:52 am)',
    'Greenwich Mean Time (UTC+00:00) (08:52 am)',
    'Western European Time (08:52 am)',
    'Eastern European Time (10:52 am)',
    'Japan Standard Time (05:52 pm)',
    'Australian Eastern Time (07:52 pm)'
  ];

  const handleSaveEmail = () => {
    if (emailInput.trim()) {
      onUpdateAccount({ email: emailInput.trim() });
      setIsEditingEmail(false);
    }
  };

  const handleSaveHandle = () => {
    if (handleInput.trim()) {
      const sanitized = handleInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      onUpdateAccount({ 
        handle: sanitized, 
        customSubdomain: `${sanitized}.sendline.io` 
      });
      setIsEditingHandle(false);
    }
  };

  const handleSaveName = () => {
    onUpdateAccount({ fullName: fullNameInput });
    setSavedNameNotice(true);
    setTimeout(() => setSavedNameNotice(false), 2000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 8) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
      }, 1200);
    }
  };

  const handleSaveMailboxPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignedMailbox && newMailboxPass.length >= 8 && onChangeMailboxPassword) {
      onChangeMailboxPassword(assignedMailbox.id, newMailboxPass);
      setMailboxPassSuccess(true);
      setTimeout(() => {
        setMailboxPassSuccess(false);
        setShowMailboxPassModal(false);
        setNewMailboxPass('');
      }, 1200);
    }
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length === 6) {
      onUpdateAccount({ mfaEnabled: true });
      setMfaStep('success');
      setTimeout(() => {
        setShowMfaModal(false);
        setMfaStep('qr');
        setMfaCode('');
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl space-y-10 text-stone-900">
      
      {/* SECTION 0: ASSIGNED WORK DOMAIN EMAIL (Highlighted for Team Members) */}
      {assignedMailbox && (
        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
                Assigned Work Domain Mailbox
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 border border-indigo-300">
              {assignedMailbox.status.toUpperCase()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="text-base font-extrabold text-stone-950 font-mono tracking-tight flex items-center gap-2">
                <span>{assignedMailbox.email}</span>
                <span className="p-1 rounded-md bg-stone-100 text-stone-500" title="Email address is locked by Workspace Owner">
                  <Lock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Display Name: <strong className="text-stone-800">{assignedMailbox.displayName}</strong> • Password last updated {assignedMailbox.passwordLastUpdated}
              </div>
            </div>

            <button
              onClick={() => setShowMailboxPassModal(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Mailbox Password</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-indigo-900">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              You can update your work email password at any time. The email address itself is managed by your workspace administrator.
            </span>
          </div>
        </div>
      )}

      {/* SECTION 1: ACCOUNT DETAILS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-950 tracking-tight">Account details</h2>
          {!isOwner && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
              Role: {activeSession?.role}
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          
          {/* Account Email */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Personal Login Email
              </label>
              {isEditingEmail ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 w-full max-w-sm font-mono"
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="p-2 rounded-xl bg-stone-950 text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setEmailInput(activeSession ? activeSession.personalEmail : account.email); setIsEditingEmail(false); }}
                    className="p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-sm font-semibold font-mono text-stone-900">
                  {activeSession ? activeSession.personalEmail : account.email}
                </div>
              )}
            </div>

            {!isEditingEmail && isOwner && (
              <button
                id="edit-email-btn"
                onClick={() => setIsEditingEmail(true)}
                className="p-2 rounded-xl hover:bg-stone-200/80 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                title="Edit account email"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Full Name */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 w-full max-w-sm"
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              >
                {savedNameNotice ? 'Saved!' : 'Save Name'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: SENDLINE HANDLE (Owner Only) */}
      {isOwner && (
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <div>
            <h2 className="text-xl font-bold text-stone-950 tracking-tight">Sendline handle</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize the subdomain for all of your published links, forms, and digital storefront checkouts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Public link subdomain
              </label>
              {isEditingHandle ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-sm font-mono font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 w-full max-w-xs"
                  />
                  <span className="text-xs font-mono text-stone-500">.sendline.io</span>
                  <button
                    onClick={handleSaveHandle}
                    className="p-2 rounded-xl bg-stone-950 text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setHandleInput(account.handle); setIsEditingHandle(false); }}
                    className="p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-sm font-semibold font-mono text-stone-900">
                  {account.customSubdomain}
                </div>
              )}
            </div>

            {!isEditingHandle && (
              <button
                id="edit-handle-btn"
                onClick={() => setIsEditingHandle(true)}
                className="p-2 rounded-xl hover:bg-stone-200/80 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                title="Edit public handle"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: TIMEZONE */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <div>
          <h2 className="text-xl font-bold text-stone-950 tracking-tight">Timezone</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Your email send times, account data, and analytics information will be displayed in the timezone you select below.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90">
          <div className="relative">
            <select
              value={account.timezone}
              onChange={(e) => onUpdateAccount({ timezone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950 cursor-pointer shadow-xs"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: SECURITY & LOGIN PASSWORD */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <h2 className="text-xl font-bold text-stone-950 tracking-tight">Security & Sign-in</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Change Login Password Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-700" />
                <span className="text-sm font-bold text-stone-950">Sendline Login Password</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Password used to access your Sendline account interface.
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-white text-xs font-semibold text-stone-800 transition-colors cursor-pointer self-start"
            >
              Change Login Password
            </button>
          </div>

          {/* MFA Security Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-700" />
                <span className="text-sm font-bold text-stone-950">Two-Factor Authentication</span>
                {account.mfaEnabled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ENABLED
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Secure your workspace with an authenticator app (Google Authenticator, 1Password).
              </p>
            </div>
            <button
              onClick={() => setShowMfaModal(true)}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-white text-xs font-semibold text-stone-800 transition-colors cursor-pointer self-start"
            >
              {account.mfaEnabled ? 'Manage 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CHANGE MAILBOX PASSWORD MODAL */}
      {/* ============================================================ */}
      {showMailboxPassModal && assignedMailbox && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-stone-950">Change Work Mailbox Password</h3>
                  <p className="text-[11px] font-mono text-stone-500">{assignedMailbox.email}</p>
                </div>
              </div>
              <button onClick={() => setShowMailboxPassModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {mailboxPassSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div>Mailbox password updated successfully!</div>
              </div>
            ) : (
              <form onSubmit={handleSaveMailboxPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                    New Mailbox Password
                  </label>
                  <div className="relative">
                    <input
                      type={showMailboxPass ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={newMailboxPass}
                      onChange={(e) => setNewMailboxPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMailboxPass(!showMailboxPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showMailboxPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    This password will be used for your domain email login across Webmail, Outlook, and Apple Mail.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMailboxPassModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save Mailbox Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHANGE LOGIN PASSWORD MODAL */}
      {/* ============================================================ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-950">Change Sendline Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div>Password updated successfully!</div>
              </div>
            ) : (
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MFA MODAL */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-950">Setup Two-Factor Authentication</h3>
              <button onClick={() => setShowMfaModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {mfaStep === 'qr' ? (
              <form onSubmit={handleVerifyMfa} className="space-y-4 text-center">
                <p className="text-xs text-stone-500">Scan this QR code in your Authenticator app (Google Authenticator, Authy)</p>
                <div className="w-36 h-36 mx-auto bg-stone-100 border-2 border-dashed border-stone-300 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-stone-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-40 mx-auto text-center font-mono text-lg tracking-widest px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMfaModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Verify & Activate
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-950 text-sm">2FA Successfully Enabled!</h4>
                <p className="text-xs text-stone-500">Your Sendline account is now protected with two-factor authentication.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
