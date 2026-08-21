import React, { useState } from 'react';
import { DomainMailbox, TeamMember, WorkspaceModuleId } from '../../types/member';
import { DomainRecord } from '../../types';
import { 
  Mail, 
  Plus, 
  Shield, 
  KeyRound, 
  UserCheck, 
  UserX, 
  Check, 
  X, 
  Copy, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  HardDrive, 
  Sparkles,
  ExternalLink,
  Users,
  Search,
  Globe,
  Sliders
} from 'lucide-react';

interface DomainMailboxesTabProps {
  mailboxes?: DomainMailbox[];
  domains?: DomainRecord[];
  team?: TeamMember[];
  isOwner?: boolean;
  onAddMailbox: (mailbox: Omit<DomainMailbox, 'id' | 'createdAt' | 'storageUsedMb' | 'passwordLastUpdated'> & { initialPassword: string }) => void;
  onUpdateMailbox: (id: string, updated: Partial<DomainMailbox>) => void;
  onDeleteMailbox: (id: string) => void;
  onResetPassword: (id: string, newPass: string) => void;
  onOpenTeamTab?: () => void;
}

export const DomainMailboxesTab: React.FC<DomainMailboxesTabProps> = ({
  mailboxes = [],
  domains = [],
  team = [],
  isOwner = true,
  onAddMailbox,
  onUpdateMailbox,
  onDeleteMailbox,
  onResetPassword,
  onOpenTeamTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState<DomainMailbox | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState<DomainMailbox | null>(null);
  const [showReassignModal, setShowReassignModal] = useState<DomainMailbox | null>(null);

  // New Mailbox Form State
  const [newLocalPart, setNewLocalPart] = useState('');
  const [newDomain, setNewDomain] = useState<string>(domains[0]?.domain || 'atelier-paris.com');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newAssignedMemberId, setNewAssignedMemberId] = useState<string>('');
  const [newQuotaGb, setNewQuotaGb] = useState<number>(10);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Password reset state
  const [resetPassInput, setResetPassInput] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);

  // Reassign state
  const [selectedNewAssigneeId, setSelectedNewAssigneeId] = useState<string>('');

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(res);
    setShowNewPassword(true);
  };

  const handleCreateMailbox = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanLocal = newLocalPart.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (!cleanLocal) {
      setFormError('Please provide a valid mailbox username.');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    const fullEmail = `${cleanLocal}@${newDomain}`;
    if ((mailboxes || []).some(m => m.email.toLowerCase() === fullEmail.toLowerCase())) {
      setFormError(`An inbox for ${fullEmail} already exists.`);
      return;
    }

    const assignedMember = (team || []).find(t => t.id === newAssignedMemberId);

    onAddMailbox({
      email: fullEmail,
      localPart: cleanLocal,
      domain: newDomain,
      displayName: newDisplayName.trim() || cleanLocal.charAt(0).toUpperCase() + cleanLocal.slice(1),
      assignedMemberId: newAssignedMemberId || undefined,
      assignedMemberName: assignedMember ? assignedMember.name : undefined,
      status: 'active',
      storageLimitMb: newQuotaGb * 1024,
      initialPassword: newPassword,
      passwordHint: 'Created by Workspace Owner'
    });

    setSuccessToast(`Domain mailbox ${fullEmail} created and activated!`);
    setTimeout(() => setSuccessToast(null), 3000);

    // Reset Form
    setShowAddModal(false);
    setNewLocalPart('');
    setNewDisplayName('');
    setNewPassword('');
    setNewAssignedMemberId('');
  };

  const handleToggleSuspend = (mbx: DomainMailbox) => {
    const newStatus = mbx.status === 'suspended' ? 'active' : 'suspended';
    onUpdateMailbox(mbx.id, { status: newStatus });
    setSuccessToast(`Mailbox ${mbx.email} is now ${newStatus === 'active' ? 'activated' : 'suspended'}.`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleSavePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordModal || resetPassInput.length < 8) return;

    onResetPassword(showPasswordModal.id, resetPassInput);
    setSuccessToast(`Password updated for ${showPasswordModal.email}`);
    setTimeout(() => setSuccessToast(null), 2500);
    setShowPasswordModal(null);
    setResetPassInput('');
  };

  const handleSaveReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReassignModal) return;

    const assignedMember = (team || []).find(t => t.id === selectedNewAssigneeId);
    onUpdateMailbox(showReassignModal.id, {
      assignedMemberId: selectedNewAssigneeId || undefined,
      assignedMemberName: assignedMember ? assignedMember.name : undefined
    });

    setSuccessToast(`Mailbox ${showReassignModal.email} reassigned to ${assignedMember ? assignedMember.name : 'Workspace Owner (Shared)'}`);
    setTimeout(() => setSuccessToast(null), 2500);
    setShowReassignModal(null);
  };

  const filteredMailboxes = mailboxes.filter(m => {
    const matchesDomain = selectedDomainFilter === 'all' || m.domain === selectedDomainFilter;
    const matchesSearch = searchQuery === '' || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.assignedMemberName && m.assignedMemberName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const totalUsedMb = mailboxes.reduce((acc, curr) => acc + curr.storageUsedMb, 0);
  const totalLimitMb = mailboxes.reduce((acc, curr) => acc + curr.storageLimitMb, 0);

  return (
    <div className="max-w-4xl space-y-8 text-stone-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Domain Inboxes & Mailboxes</h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {mailboxes.length} Active Accounts
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Create domain email addresses on your confirmed custom domains with secure passwords. Assign inboxes to team members who can log in with their personal email and manage assigned emails.
          </p>
        </div>

        {isOwner && (
          <button
            id="create-domain-mailbox-btn"
            onClick={() => {
              handleGeneratePassword();
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Domain Email</span>
          </button>
        )}
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-stone-700" />
            <span>Domain Inboxes</span>
          </div>
          <div className="text-xl font-extrabold text-stone-950">
            {mailboxes.filter(m => m.status === 'active').length} <span className="text-xs font-normal text-stone-500">/ {mailboxes.length} Total</span>
          </div>
          <div className="text-[11px] text-stone-500">Across {domains.length} confirmed domains</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-700" />
            <span>Team Assignment</span>
          </div>
          <div className="text-xl font-extrabold text-stone-950">
            {mailboxes.filter(m => !!m.assignedMemberId).length} Assigned
          </div>
          <div className="text-[11px] text-stone-500">
            {mailboxes.filter(m => !m.assignedMemberId).length} shared / leader accounts
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-stone-700" />
            <span>Storage Quota</span>
          </div>
          <div className="text-xl font-extrabold text-stone-950">
            {(totalUsedMb / 1024).toFixed(1)} GB <span className="text-xs font-normal text-stone-500">/ {(totalLimitMb / 1024).toFixed(0)} GB</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-indigo-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, (totalUsedMb / (totalLimitMb || 1)) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email address, display name, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-950 shadow-xs"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDomainFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDomainFilter === 'all'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Domains
          </button>
          {domains.map(d => (
            <button
              key={d.domain}
              onClick={() => setSelectedDomainFilter(d.domain)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDomainFilter === d.domain
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>{d.domain}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mailboxes List */}
      <div className="rounded-3xl border border-stone-200 overflow-hidden bg-white shadow-xs">
        <div className="divide-y divide-stone-100">
          {filteredMailboxes.map((mbx) => {
            const assignedMember = (team || []).find(t => t.id === mbx.assignedMemberId);
            const isSuspended = mbx.status === 'suspended';
            const isProvisioning = mbx.status === 'provisioning';

            return (
              <div 
                key={mbx.id} 
                className={`p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                  isSuspended ? 'bg-stone-50/70 opacity-75' : 'hover:bg-stone-50/50'
                }`}
              >
                {/* Left: Email Info & Assignee */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isSuspended 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : isProvisioning
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-stone-950 text-white border-stone-800'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-stone-950 font-mono tracking-tight">{mbx.email}</span>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSuspended
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isProvisioning
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {mbx.status.toUpperCase()}
                      </span>

                      {mbx.isDefaultOutbound && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          DEFAULT SENDER
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                      <span className="font-semibold text-stone-800">{mbx.displayName}</span>
                      <span>•</span>
                      <span>Created {mbx.createdAt}</span>
                      <span>•</span>
                      <span className="font-mono">{(mbx.storageUsedMb / 1024).toFixed(2)} / {(mbx.storageLimitMb / 1024).toFixed(0)} GB</span>
                    </div>

                    {/* Assigned Team Member Info Box */}
                    <div className="pt-1 flex items-center gap-2">
                      {assignedMember ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-800 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Assigned to: <strong>{assignedMember.name}</strong> ({assignedMember.email})</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            assignedMember.role === 'Inbox Agent' ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {assignedMember.role}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                          <Shield className="w-3.5 h-3.5 text-amber-700" />
                          <span>Shared / Leader Direct Login (No specific member assigned)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => setShowCredentialsModal(mbx)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="View Webmail & IMAP/SMTP Connection Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Webmail / Setup</span>
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => setShowPasswordModal(mbx)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Set new mailbox password"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                        <span>Password</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedNewAssigneeId(mbx.assignedMemberId || '');
                          setShowReassignModal(mbx);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Assign to a team member"
                      >
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        <span>Assign</span>
                      </button>

                      <button
                        onClick={() => handleToggleSuspend(mbx)}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                          isSuspended 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
                            : 'border-stone-200 text-stone-500 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                        title={isSuspended ? 'Reactivate mailbox' : 'Suspend mailbox'}
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete mailbox ${mbx.email}? All emails and routing will be removed.`)) {
                            onDeleteMailbox(mbx.id);
                          }
                        }}
                        className="p-2 rounded-xl border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete domain mailbox"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredMailboxes.length === 0 && (
        <div className="p-10 rounded-3xl bg-[#FAF8F5] border border-stone-200 text-center space-y-3">
          <Mail className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="text-sm font-bold text-stone-900">No domain inboxes matched your query</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Create domain inboxes for your support team, sales reps, or press agents on your confirmed custom domains.
          </p>
        </div>
      )}

      {/* Guide Note */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-2">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-stone-700" />
          <span>How Sendline Inbox & Team Access Works</span>
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          1. <strong>Team Lead Login:</strong> The workspace leader can create domain emails with passwords and directly log in to any inbox.<br />
          2. <strong>Member Invite & Sign Up:</strong> Team members receive an invite link at their personal email (e.g. <code>sarah@gmail.com</code>), sign up with that email, and instantly access their assigned work inbox.<br />
          3. <strong>Permissions:</strong> Members only see granted modules (e.g. Inbox Only) and can change their mailbox password, while the email address remains securely locked by the workspace owner.
        </p>
      </div>

      {/* ============================================================ */}
      {/* CREATE DOMAIN MAILBOX MODAL */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-950 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-950">Create Domain Email & Inbox</h3>
                  <p className="text-[11px] text-stone-500">Configure email address, initial password, and team assignment</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMailbox} className="space-y-4">
              {/* Domain & Local Part */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  Email Address
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-stone-950 bg-white">
                  <input
                    type="text"
                    required
                    placeholder="support"
                    value={newLocalPart}
                    onChange={(e) => setNewLocalPart(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-sm font-mono text-stone-900 focus:outline-none"
                  />
                  <span className="px-2 font-mono text-stone-400 font-bold">@</span>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="px-3 py-2.5 bg-stone-50 border-l border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none cursor-pointer"
                  >
                    {domains.map(d => (
                      <option key={d.domain} value={d.domain}>{d.domain}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Resulting address: <strong className="text-stone-900 font-mono">{newLocalPart ? newLocalPart.toLowerCase() : 'name'}@{newDomain}</strong>
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  Display Name / Sender Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atelier Concierge or Sarah Jenkins"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-950"
                />
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-600 uppercase">
                    Initial Mailbox Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  The team leader and assigned member can use this password to connect via Webmail, IMAP, or Outlook.
                </p>
              </div>

              {/* Assign to Team Member */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  Assign to Team Member
                </label>
                <select
                  value={newAssignedMemberId}
                  onChange={(e) => setNewAssignedMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-950 bg-white cursor-pointer"
                >
                  <option value="">-- Keep Unassigned (Workspace Owner / Shared Team) --</option>
                  {(team || []).map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email}) — Role: {member.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  Assigned members will see this inbox automatically upon signing in with their invited email.
                </p>
              </div>

              {/* Storage Quota */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  Mailbox Storage Quota
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setNewQuotaGb(gb)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        newQuotaGb === gb
                          ? 'bg-stone-950 text-white shadow-xs'
                          : 'bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Create & Activate Mailbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* WEBMAIL & CREDENTIALS MODAL */}
      {/* ============================================================ */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-stone-950">Mailbox Connection Details</h3>
                  <p className="text-[11px] font-mono text-stone-500">{showCredentialsModal.email}</p>
                </div>
              </div>
              <button onClick={() => setShowCredentialsModal(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-indigo-900">Direct Webmail Portal</div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-indigo-950 font-semibold">https://webmail.{showCredentialsModal.domain}</span>
                  <button 
                    onClick={() => handleCopy(`https://webmail.${showCredentialsModal.domain}`, 'webmail-link')}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedKey === 'webmail-link' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Username:</span>
                  <span className="font-bold text-stone-950">{showCredentialsModal.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Incoming (IMAP):</span>
                  <span className="font-bold text-stone-950">imap.{showCredentialsModal.domain} : 993 (SSL)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Outgoing (SMTP):</span>
                  <span className="font-bold text-stone-950">smtp.{showCredentialsModal.domain} : 465 (SSL)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-emerald-700 uppercase">{showCredentialsModal.status}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-normal">
                Assigned team members can log into Sendline using their personal invite email and will find this inbox pre-connected in their workspace.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCredentialsModal(null)}
                className="w-full py-2.5 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PASSWORD RESET MODAL */}
      {/* ============================================================ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-stone-950" />
                <div>
                  <h3 className="text-base font-bold text-stone-950">Reset Mailbox Password</h3>
                  <p className="text-[11px] font-mono text-stone-500">{showPasswordModal.email}</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    required
                    placeholder="Enter new 8+ character password"
                    value={resetPassInput}
                    onChange={(e) => setResetPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REASSIGN TEAM MEMBER MODAL */}
      {/* ============================================================ */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-stone-950" />
                <div>
                  <h3 className="text-base font-bold text-stone-950">Assign Mailbox to Team Member</h3>
                  <p className="text-[11px] font-mono text-stone-500">{showReassignModal.email}</p>
                </div>
              </div>
              <button onClick={() => setShowReassignModal(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReassign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
                  Select Team Member
                </label>
                <select
                  value={selectedNewAssigneeId}
                  onChange={(e) => setSelectedNewAssigneeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-950 bg-white cursor-pointer"
                >
                  <option value="">-- Unassigned (Shared / Team Leader Access) --</option>
                  {(team || []).map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email}) — Role: {member.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReassignModal(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Update Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
