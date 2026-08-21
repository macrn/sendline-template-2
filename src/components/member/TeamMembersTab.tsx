import React, { useState } from 'react';
import { TeamMember, DomainMailbox, AccessProfile, WorkspaceModuleId } from '../../types/member';
import { 
  Users, 
  Plus, 
  Shield, 
  Mail, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  UserPlus, 
  Copy, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  KeyRound, 
  Layers,
  ArrowRight,
  Upload,
  Search,
  Filter,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  SlidersHorizontal,
  Eye,
  Edit2,
  FileSpreadsheet
} from 'lucide-react';
import { TeamMemberCsvUploadModal } from './TeamMemberCsvUploadModal';
import { AccessProfilesManager } from './AccessProfilesManager';

interface TeamMembersTabProps {
  team?: TeamMember[];
  mailboxes?: DomainMailbox[];
  profiles?: AccessProfile[];
  isOwner?: boolean;
  onInviteMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  onImportMembers?: (members: Omit<TeamMember, 'id' | 'joinedAt'>[]) => void;
  onRemoveMember: (id: string) => void;
  onUpdateMember?: (id: string, updated: Partial<TeamMember>) => void;
  onSimulateInvite?: (member: TeamMember) => void;
  onCreateProfile?: (profile: Omit<AccessProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile?: (id: string, updated: Partial<AccessProfile>) => void;
  onDeleteProfile?: (id: string) => void;
}

export const TeamMembersTab: React.FC<TeamMembersTabProps> = ({
  team = [],
  mailboxes = [],
  profiles = [],
  isOwner = true,
  onInviteMember,
  onImportMembers,
  onRemoveMember,
  onUpdateMember,
  onSimulateInvite,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile
}) => {
  // Subtab view: Directory or Access Profiles
  const [subTab, setSubTab] = useState<'directory' | 'profiles'>('directory');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Invite Form fields
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteDob, setInviteDob] = useState('');
  const [inviteLocation, setInviteLocation] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || 'prof-support');
  const [assignedMailboxId, setAssignedMailboxId] = useState<string>('');

  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);

  // Unique locations for filter
  const locations = ['All', ...Array.from(new Set(team.map(m => m.location || 'Remote').filter(Boolean)))];

  const handleOpenInvite = () => {
    setInviteName('');
    setInviteEmail('');
    setInviteTitle('');
    setInviteDob('');
    setInviteLocation('Paris, France');
    setInvitePhone('');
    setSelectedProfileId(profiles[0]?.id || 'prof-support');
    setAssignedMailboxId('');
    setShowInviteModal(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const chosenProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
    const assignedMbx = (mailboxes || []).find(m => m.id === assignedMailboxId);
    const generatedToken = 'inv_' + Math.random().toString(36).substring(2, 9);

    onInviteMember({
      name: inviteName.trim() || inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      title: inviteTitle.trim() || 'Team Member',
      dob: inviteDob.trim() || undefined,
      location: inviteLocation.trim() || 'Remote',
      phone: invitePhone.trim() || undefined,
      role: chosenProfile?.name === 'Executive & Workspace Admin' ? 'Admin' : 'Editor',
      profileId: chosenProfile ? chosenProfile.id : undefined,
      profileName: chosenProfile ? chosenProfile.name : undefined,
      status: 'Invited',
      assignedMailboxId: assignedMailboxId || undefined,
      assignedMailboxEmail: assignedMbx ? assignedMbx.email : undefined,
      allowedModules: chosenProfile ? chosenProfile.allowedModules : ['inbox'],
      inviteToken: generatedToken,
      inviteSentAt: 'Just now'
    });

    setInviteNotice(`Invitation generated for ${inviteEmail}!`);
    setTimeout(() => {
      setInviteNotice(null);
      setShowInviteModal(false);
    }, 1200);
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !onUpdateMember) return;

    const chosenProfile = profiles.find(p => p.id === editingMember.profileId);
    const assignedMbx = (mailboxes || []).find(m => m.id === editingMember.assignedMailboxId);

    onUpdateMember(editingMember.id, {
      name: editingMember.name,
      email: editingMember.email,
      title: editingMember.title,
      dob: editingMember.dob,
      location: editingMember.location,
      phone: editingMember.phone,
      profileId: editingMember.profileId,
      profileName: chosenProfile ? chosenProfile.name : editingMember.profileName,
      allowedModules: chosenProfile ? chosenProfile.allowedModules : editingMember.allowedModules,
      assignedMailboxId: editingMember.assignedMailboxId,
      assignedMailboxEmail: assignedMbx ? assignedMbx.email : undefined
    });

    setEditingMember(null);
  };

  const handleCopyInviteLink = (member: TeamMember) => {
    const inviteUrl = `${window.location.origin}/join/${member.inviteToken || 'inv_' + member.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(member.id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const filteredTeam = team.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.assignedMailboxEmail && m.assignedMailboxEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProfile = selectedProfileFilter === 'All' || 
      m.profileId === selectedProfileFilter || 
      m.profileName === selectedProfileFilter;

    const matchesLocation = selectedLocationFilter === 'All' || 
      m.location === selectedLocationFilter;

    return matchesSearch && matchesProfile && matchesLocation;
  });

  const getProfileBadgeStyle = (profileId?: string) => {
    const matched = profiles.find(p => p.id === profileId);
    const color = matched?.badgeColor || 'stone';
    switch (color) {
      case 'rose': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'emerald': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'purple': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'cyan': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'indigo': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-5xl space-y-8 text-stone-900">
      
      {/* Top Subtab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'directory'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Directory</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              subTab === 'directory' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {team.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'profiles'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Access Profiles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              subTab === 'profiles' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {profiles.length}
            </span>
          </button>
        </div>

        {/* Global Team Actions */}
        {subTab === 'directory' && isOwner && (
          <div className="flex items-center gap-2.5">
            <button
              id="upload-team-csv-btn"
              onClick={() => setShowCsvModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-stone-700" />
              <span>Upload CSV / Excel</span>
            </button>

            <button
              id="invite-team-member-btn"
              onClick={handleOpenInvite}
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>
        )}
      </div>

      {inviteNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{inviteNotice}</span>
        </div>
      )}

      {/* RENDER SUBTAB: PROFILES MANAGER */}
      {subTab === 'profiles' ? (
        <AccessProfilesManager
          profiles={profiles}
          team={team}
          isOwner={isOwner}
          onCreateProfile={onCreateProfile || (() => {})}
          onUpdateProfile={onUpdateProfile || (() => {})}
          onDeleteProfile={onDeleteProfile || (() => {})}
          onAssignProfileToMember={(memberId, profileId) => {
            const matchedProf = profiles.find(p => p.id === profileId);
            if (onUpdateMember && matchedProf) {
              onUpdateMember(memberId, {
                profileId,
                profileName: matchedProf.name,
                allowedModules: matchedProf.allowedModules
              });
            }
          }}
          onOpenTeamTab={() => setSubTab('directory')}
        />
      ) : (
        /* RENDER SUBTAB: DIRECTORY */
        <div className="space-y-6">
          
          {/* Header Description & Search / Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-stone-950 tracking-tight">
                Team Directory & Profile Assignments
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage colleagues, personal login emails, job titles, date of birth, office location, contact phone, and assigned domain inboxes.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, title, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-stone-950 w-56 transition-colors"
                />
              </div>

              <select
                value={selectedProfileFilter}
                onChange={(e) => setSelectedProfileFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white cursor-pointer"
              >
                <option value="All">All Profiles</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-3xl border border-stone-200 overflow-hidden bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Member & Title</th>
                    <th className="py-3 px-4">Personal Login Email</th>
                    <th className="py-3 px-4">DOB & Location</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Assigned Profile</th>
                    <th className="py-3 px-4">Assigned Mailbox</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTeam.map((member) => {
                    const matchedProfile = profiles.find(p => p.id === member.profileId);
                    const profileLabel = member.profileName || matchedProfile?.name || member.role;
                    const badgeClass = getProfileBadgeStyle(member.profileId);

                    return (
                      <tr key={member.id} className="hover:bg-stone-50/70 transition-colors group">
                        
                        {/* Member & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-stone-950 text-xs flex items-center gap-1.5">
                                <span>{member.name}</span>
                                {member.role === 'Owner' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                                <Briefcase className="w-2.5 h-2.5 text-stone-400" />
                                <span>{member.title || 'Team Member'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Personal Email */}
                        <td className="py-3.5 px-4 font-mono text-stone-700 text-[11px]">
                          {member.email}
                        </td>

                        {/* DOB & Location */}
                        <td className="py-3.5 px-4 text-stone-700">
                          {member.dob && (
                            <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                              <Calendar className="w-2.5 h-2.5" />
                              <span>{member.dob}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-2.5 h-2.5 text-stone-400" />
                            <span>{member.location || 'Remote'}</span>
                          </div>
                        </td>

                        {/* Phone Number */}
                        <td className="py-3.5 px-4 text-stone-700 font-mono text-[11px]">
                          {member.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-stone-400" />
                              <span>{member.phone}</span>
                            </span>
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
                        </td>

                        {/* Assigned Profile */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                            <Shield className="w-2.5 h-2.5" />
                            <span>{profileLabel}</span>
                          </span>
                        </td>

                        {/* Assigned Mailbox */}
                        <td className="py-3.5 px-4">
                          {member.assignedMailboxEmail ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-[10px] font-semibold border border-stone-200">
                              <Mail className="w-2.5 h-2.5 text-stone-500" />
                              <span>{member.assignedMailboxEmail}</span>
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px] italic">None linked</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            member.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span>{member.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* View full details modal */}
                            <button
                              onClick={() => setViewingMember(member)}
                              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                              title="View Full Profile Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit member */}
                            {isOwner && (
                              <button
                                onClick={() => setEditingMember(member)}
                                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                                title="Edit Member Profile & Access"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Copy Invite or Simulate Login */}
                            {member.status === 'Invited' ? (
                              <button
                                onClick={() => handleCopyInviteLink(member)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                                title="Copy Invite Link"
                              >
                                {copiedToken === member.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            ) : (
                              onSimulateInvite && member.role !== 'Owner' && (
                                <button
                                  onClick={() => onSimulateInvite(member)}
                                  className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors"
                                  title="Test Perspective"
                                >
                                  Simulate
                                </button>
                              )
                            )}

                            {/* Remove Member */}
                            {isOwner && member.role !== 'Owner' && (
                              <button
                                onClick={() => onRemoveMember(member.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Remove Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* CSV UPLOAD MODAL */}
      <TeamMemberCsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        profiles={profiles}
        mailboxes={mailboxes}
        existingTeam={team}
        onImportMembers={(imported) => {
          if (onImportMembers) {
            onImportMembers(imported);
          } else {
            imported.forEach(m => onInviteMember(m));
          }
        }}
      />

      {/* INVITE TEAM MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-950 tracking-tight">
                    Invite Team Member
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Provision personal info, contact details, and assign an Access Profile.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Personal Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@gmail.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold font-mono focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Campaign Manager"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    value={inviteDob}
                    onChange={(e) => setInviteDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Location / Office
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paris, France or Remote"
                    value={inviteLocation}
                    onChange={(e) => setInviteLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +33 1 42 68 55 00"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              {/* Access Profile Selection */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Assign Access Profile *
                </label>
                <div className="space-y-2">
                  {profiles.map((prof) => (
                    <label
                      key={prof.id}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedProfileId === prof.id
                          ? 'bg-stone-50 border-stone-950 text-stone-950'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access_profile"
                        checked={selectedProfileId === prof.id}
                        onChange={() => setSelectedProfileId(prof.id)}
                        className="mt-0.5 text-stone-950 focus:ring-stone-950"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{prof.name}</span>
                          <span className="text-[10px] font-normal text-stone-500">
                            ({prof.allowedModules.length} Modules)
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {prof.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Domain Mailbox Assignment */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Assign Domain Mailbox (Optional)
                </label>
                <select
                  value={assignedMailboxId}
                  onChange={(e) => setAssignedMailboxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-stone-950 cursor-pointer"
                >
                  <option value="">No Domain Mailbox (Personal Login Only)</option>
                  {mailboxes.map(mbx => (
                    <option key={mbx.id} value={mbx.id}>
                      {mbx.email} ({mbx.displayName}) {mbx.assignedMemberName ? `[Currently: ${mbx.assignedMemberName}]` : '[Unassigned]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Send Invitation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* EDIT TEAM MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center shadow-xs">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-950 tracking-tight">
                    Edit Team Member Profile
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update profile info, assigned Access Profile, and domain mailbox.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingMember(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Personal Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold font-mono focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={editingMember.title || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    value={editingMember.dob || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Location / Office
                  </label>
                  <input
                    type="text"
                    value={editingMember.location || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-stone-800 focus:outline-none focus:border-stone-950 transition-colors"
                  />
                </div>
              </div>

              {/* Reassign Profile */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Assigned Access Profile
                </label>
                <select
                  value={editingMember.profileId || profiles[0]?.id}
                  onChange={(e) => setEditingMember({ ...editingMember, profileId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-stone-950 cursor-pointer"
                >
                  {profiles.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name} ({prof.allowedModules.length} Modules)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reassign Mailbox */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  Assigned Domain Mailbox
                </label>
                <select
                  value={editingMember.assignedMailboxId || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, assignedMailboxId: e.target.value || undefined })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-stone-950 cursor-pointer"
                >
                  <option value="">No Domain Mailbox</option>
                  {mailboxes.map(mbx => (
                    <option key={mbx.id} value={mbx.id}>
                      {mbx.email} ({mbx.displayName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW MEMBER DETAILS MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-stone-950 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {viewingMember.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-950">
                    {viewingMember.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {viewingMember.title || 'Team Member'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingMember(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Personal Login Email</span>
                  <div className="font-mono text-stone-900 font-semibold mt-0.5">{viewingMember.email}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Status</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{viewingMember.status}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Date of Birth</span>
                  <div className="text-stone-900 mt-0.5">{viewingMember.dob || 'Not provided'}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Location</span>
                  <div className="text-stone-900 mt-0.5">{viewingMember.location || 'Remote'}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Phone Number</span>
                  <div className="text-stone-900 font-mono mt-0.5">{viewingMember.phone || 'None'}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Joined Date</span>
                  <div className="text-stone-900 mt-0.5">{viewingMember.joinedAt}</div>
                </div>
              </div>

              {/* Profile Privileges */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-stone-400">Assigned Access Profile</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold ${getProfileBadgeStyle(viewingMember.profileId)}`}>
                    <Shield className="w-3 h-3" />
                    <span>{viewingMember.profileName || 'Default Access'}</span>
                  </span>
                </div>
                <div className="pt-2 text-[11px] text-stone-600">
                  Allowed Modules ({viewingMember.allowedModules.length}): {viewingMember.allowedModules.join(', ')}
                </div>
              </div>

              {/* Domain Mailbox */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">Assigned Custom Domain Mailbox</span>
                <div className="font-mono text-stone-900 font-bold">
                  {viewingMember.assignedMailboxEmail || 'No custom domain mailbox assigned.'}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
              <button
                onClick={() => setViewingMember(null)}
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
