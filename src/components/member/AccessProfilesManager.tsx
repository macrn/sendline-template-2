import React, { useState } from 'react';
import { AccessProfile, TeamMember, WorkspaceModuleId, AccessProfileCapabilities } from '../../types/member';
import { 
  Shield, 
  Plus, 
  Check, 
  X, 
  Sparkles, 
  Users, 
  Edit3, 
  Trash2, 
  Copy, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Folder,
  Zap,
  Inbox,
  Gift,
  Settings,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AccessProfilesManagerProps {
  profiles: AccessProfile[];
  team: TeamMember[];
  isOwner?: boolean;
  onCreateProfile: (profile: Omit<AccessProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile: (id: string, updated: Partial<AccessProfile>) => void;
  onDeleteProfile: (id: string) => void;
  onAssignProfileToMember: (memberId: string, profileId: string) => void;
  onOpenTeamTab?: () => void;
}

export const AccessProfilesManager: React.FC<AccessProfilesManagerProps> = ({
  profiles,
  team,
  isOwner = true,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onAssignProfileToMember,
  onOpenTeamTab
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState<AccessProfile['badgeColor']>('indigo');
  const [allowedModules, setAllowedModules] = useState<WorkspaceModuleId[]>(['dashboard', 'marketing', 'my-templates']);
  const [capabilities, setCapabilities] = useState<AccessProfileCapabilities>({
    canSendLiveEmails: true,
    canExportData: false,
    canManageDomains: false,
    canManageAPIKeys: false,
    canManageTeam: false,
    canViewFinancials: false
  });

  const [selectedProfileForMembers, setSelectedProfileForMembers] = useState<AccessProfile | null>(null);

  const availableModules: { id: WorkspaceModuleId; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, desc: 'View workspace telemetry, deliverability rate & KPIs' },
    { id: 'marketing', label: 'Campaign Studio', icon: Sparkles, desc: 'Design, customize and schedule visual email campaigns' },
    { id: 'my-templates', label: 'My Folders & Saved Emails', icon: Folder, desc: 'Manage email design folders, saved drafts & templates' },
    { id: 'transactional', label: 'Transactional & API', icon: Zap, desc: 'Trigger automated SMTP emails, view delivery logs & API keys' },
    { id: 'inbox', label: 'Screener & Mailbox', icon: Inbox, desc: 'Screen incoming senders, triage Feed & domain inboxes' },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: Gift, desc: 'Manage customer reward tiers, VIP perks & coupon codes' },
    { id: 'admin', label: 'Domains & DNS', icon: Settings, desc: 'Inspect DKIM, SPF, DMARC records and DNS verification' }
  ];

  const handleOpenCreate = () => {
    setEditingProfileId(null);
    setName('');
    setDescription('');
    setBadgeColor('indigo');
    setAllowedModules(['dashboard', 'marketing', 'my-templates']);
    setCapabilities({
      canSendLiveEmails: true,
      canExportData: false,
      canManageDomains: false,
      canManageAPIKeys: false,
      canManageTeam: false,
      canViewFinancials: false
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (profile: AccessProfile) => {
    setEditingProfileId(profile.id);
    setName(profile.name);
    setDescription(profile.description);
    setBadgeColor(profile.badgeColor);
    setAllowedModules(profile.allowedModules);
    setCapabilities(profile.capabilities);
    setShowCreateModal(true);
  };

  const handleDuplicate = (profile: AccessProfile) => {
    onCreateProfile({
      name: `${profile.name} (Copy)`,
      description: profile.description,
      badgeColor: profile.badgeColor,
      allowedModules: [...profile.allowedModules],
      capabilities: { ...profile.capabilities },
      isSystemDefault: false
    });
  };

  const toggleModule = (modId: WorkspaceModuleId) => {
    if (allowedModules.includes(modId)) {
      if (allowedModules.length > 1) {
        setAllowedModules(allowedModules.filter(m => m !== modId));
      }
    } else {
      setAllowedModules([...allowedModules, modId]);
    }
  };

  const toggleCapability = (key: keyof AccessProfileCapabilities) => {
    setCapabilities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProfileId) {
      onUpdateProfile(editingProfileId, {
        name: name.trim(),
        description: description.trim(),
        badgeColor,
        allowedModules,
        capabilities
      });
    } else {
      onCreateProfile({
        name: name.trim(),
        description: description.trim() || 'Custom access profile created by team leader.',
        badgeColor,
        allowedModules,
        capabilities,
        isSystemDefault: false
      });
    }

    setShowCreateModal(false);
  };

  const getColorClasses = (color: AccessProfile['badgeColor']) => {
    switch (color) {
      case 'rose': return { badge: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500', bar: 'bg-rose-500' };
      case 'emerald': return { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', bar: 'bg-emerald-500' };
      case 'amber': return { badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-500' };
      case 'purple': return { badge: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-500', bar: 'bg-purple-500' };
      case 'cyan': return { badge: 'bg-cyan-50 text-cyan-800 border-cyan-200', dot: 'bg-cyan-500', bar: 'bg-cyan-500' };
      case 'stone': return { badge: 'bg-stone-100 text-stone-800 border-stone-200', dot: 'bg-stone-500', bar: 'bg-stone-500' };
      case 'indigo':
      default: return { badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', bar: 'bg-indigo-500' };
    }
  };

  return (
    <div className="space-y-8 text-stone-900">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">
              Access & Permission Profiles
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
              {profiles.length} Profiles Configured
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 max-w-xl">
            Team leaders can create customized role profiles in Sendline with tailored module access and granular operational capabilities, then assign them to team members.
          </p>
        </div>

        {isOwner && (
          <button
            id="create-access-profile-btn"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Access Profile</span>
          </button>
        )}
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {profiles.map((prof) => {
          const colorStyles = getColorClasses(prof.badgeColor);
          const membersWithProfile = team.filter(m => 
            m.profileId === prof.id || 
            (prof.id === 'prof-admin' && m.role === 'Owner') ||
            (prof.id === 'prof-support' && m.role === 'Inbox Agent' && !m.profileId)
          );

          return (
            <div
              key={prof.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Top Row: Badge & Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border ${colorStyles.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${colorStyles.dot}`} />
                      <span>{prof.name}</span>
                    </span>
                    {prof.isSystemDefault && (
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(prof)}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Duplicate Profile"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleOpenEdit(prof)}
                        className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                        title="Edit Permissions"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isOwner && !prof.isSystemDefault && (
                      <button
                        onClick={() => onDeleteProfile(prof.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {prof.description}
                </p>

                {/* Enabled Modules Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Accessible Workspace Modules ({prof.allowedModules.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {prof.allowedModules.map(modId => {
                      const modInfo = availableModules.find(m => m.id === modId);
                      return (
                        <span
                          key={modId}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-semibold flex items-center gap-1 border border-stone-200/80"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{modInfo ? modInfo.label : modId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Capability Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Operational Privileges
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className={`flex items-center gap-1 ${prof.capabilities.canSendLiveEmails ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                      {prof.capabilities.canSendLiveEmails ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-stone-300" />}
                      <span>Live Broadcasts</span>
                    </div>
                    <div className={`flex items-center gap-1 ${prof.capabilities.canExportData ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                      {prof.capabilities.canExportData ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-stone-300" />}
                      <span>Export Data & Lists</span>
                    </div>
                    <div className={`flex items-center gap-1 ${prof.capabilities.canManageDomains ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                      {prof.capabilities.canManageDomains ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-stone-300" />}
                      <span>Domain Inboxes & DNS</span>
                    </div>
                    <div className={`flex items-center gap-1 ${prof.capabilities.canManageAPIKeys ? 'text-stone-900 font-semibold' : 'text-stone-400'}`}>
                      {prof.capabilities.canManageAPIKeys ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-stone-300" />}
                      <span>Manage API Keys</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Member Counter & Assign Link */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProfileForMembers(prof)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-stone-500" />
                  <span>{membersWithProfile.length} Assigned Members</span>
                </button>

                {onOpenTeamTab && (
                  <button
                    onClick={onOpenTeamTab}
                    className="text-[11px] font-bold text-stone-500 hover:text-stone-950 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Manage in Directory</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT PROFILE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-950 tracking-tight">
                    {editingProfileId ? 'Edit Access Profile' : 'Create New Access Profile'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Define custom module access and permission limits for your team members.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProfile} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile Name & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Campaign Manager, Support Specialist"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Description & Purpose
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe what members with this profile can do in Sendline..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-700 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                {/* Badge Color Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                    Profile Color Tag
                  </label>
                  <div className="flex items-center gap-2">
                    {(['indigo', 'rose', 'emerald', 'amber', 'purple', 'cyan', 'stone'] as const).map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBadgeColor(color)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          badgeColor === color ? 'border-stone-950 scale-110' : 'border-transparent'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${
                          color === 'indigo' ? 'bg-indigo-600' :
                          color === 'rose' ? 'bg-rose-600' :
                          color === 'emerald' ? 'bg-emerald-600' :
                          color === 'amber' ? 'bg-amber-600' :
                          color === 'purple' ? 'bg-purple-600' :
                          color === 'cyan' ? 'bg-cyan-600' : 'bg-stone-700'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Module Access Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Module Access (Select at least one)
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Members with this profile will see only the selected modules in their navigation sidebar.
                  </p>
                </div>

                <div className="space-y-2">
                  {availableModules.map(mod => {
                    const isChecked = allowedModules.includes(mod.id);
                    const Icon = mod.icon;
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-stone-50 border-stone-950/40 text-stone-950' 
                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModule(mod.id)}
                          className="mt-1 rounded text-stone-950 focus:ring-stone-950"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Icon className="w-3.5 h-3.5 text-stone-700" />
                            <span>{mod.label}</span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {mod.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Operational Capabilities */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Granular Privileges
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Control sensitive actions such as broadcasting, API credentials, and member administration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canSendLiveEmails}
                      onChange={() => toggleCapability('canSendLiveEmails')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Launch Live Broadcasts</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canExportData}
                      onChange={() => toggleCapability('canExportData')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Export Subscriber Lists</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canManageDomains}
                      onChange={() => toggleCapability('canManageDomains')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Manage Domains & Mailboxes</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canManageAPIKeys}
                      onChange={() => toggleCapability('canManageAPIKeys')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Manage API Keys & Webhooks</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canManageTeam}
                      onChange={() => toggleCapability('canManageTeam')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Invite & Modify Team</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capabilities.canViewFinancials}
                      onChange={() => toggleCapability('canViewFinancials')}
                      className="rounded text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-xs font-semibold text-stone-800">Billing & Payouts</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  {editingProfileId ? 'Save Profile Changes' : 'Create Access Profile'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MEMBERS WITH PROFILE DRAWER MODAL */}
      {selectedProfileForMembers && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-stone-950 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-950">
                    Members Assigned to "{selectedProfileForMembers.name}"
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Inheriting {selectedProfileForMembers.allowedModules.length} module permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfileForMembers(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
              {team.filter(m => 
                m.profileId === selectedProfileForMembers.id || 
                (selectedProfileForMembers.id === 'prof-admin' && m.role === 'Owner') ||
                (selectedProfileForMembers.id === 'prof-support' && m.role === 'Inbox Agent' && !m.profileId)
              ).length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  No team members currently assigned to this profile.
                </div>
              ) : (
                team.filter(m => 
                  m.profileId === selectedProfileForMembers.id || 
                  (selectedProfileForMembers.id === 'prof-admin' && m.role === 'Owner') ||
                  (selectedProfileForMembers.id === 'prof-support' && m.role === 'Inbox Agent' && !m.profileId)
                ).map(member => (
                  <div key={member.id} className="p-3 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-950">{member.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{member.email}</div>
                      {member.title && (
                        <div className="text-[10px] text-stone-600 font-medium">{member.title}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {member.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedProfileForMembers(null)}
                className="px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
