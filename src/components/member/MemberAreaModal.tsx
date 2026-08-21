import React, { useState } from 'react';
import { 
  MemberTab, 
  UserAccountDetails, 
  TeamMember, 
  AccessProfile,
  VerifiedSenderEmail, 
  BrandSettings, 
  OptInSettings, 
  LegalDocument, 
  CommerceSettings, 
  PlanBillingDetails, 
  ReferralDetails, 
  DomainMailbox,
  ActiveUserSession
} from '../../types/member';
import { DomainRecord } from '../../types';
import { 
  X, 
  ArrowLeft, 
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
  Search,
  Inbox,
  Shield
} from 'lucide-react';
import { AccountOverviewTab } from './AccountOverviewTab';
import { TeamMembersTab } from './TeamMembersTab';
import { AccessProfilesManager } from './AccessProfilesManager';
import { DomainMailboxesTab } from './DomainMailboxesTab';
import { EmailSetupTab } from './EmailSetupTab';
import { DomainSetupTab } from './DomainSetupTab';
import { CommerceSetupTab } from './CommerceSetupTab';
import { BrandingTab } from './BrandingTab';
import { OptInSetupTab } from './OptInSetupTab';
import { DataPrivacyTab } from './DataPrivacyTab';
import { IntegrationsTab } from './IntegrationsTab';
import { PlanBillingTab } from './PlanBillingTab';
import { ShareSendlineTab } from './ShareSendlineTab';

interface MemberAreaModalProps {
  initialTab?: MemberTab;
  onClose: () => void;
  account: UserAccountDetails;
  team?: TeamMember[];
  profiles?: AccessProfile[];
  mailboxes?: DomainMailbox[];
  senders?: VerifiedSenderEmail[];
  domains?: DomainRecord[];
  commerce: CommerceSettings;
  branding: BrandSettings;
  optIn: OptInSettings;
  terms: LegalDocument;
  privacy: LegalDocument;
  billing: PlanBillingDetails;
  referral: ReferralDetails;
  activeSession?: ActiveUserSession;
  isOwner?: boolean;
  onUpdateAccount: (account: Partial<UserAccountDetails>) => void;
  onInviteTeamMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  onImportTeamMembers?: (members: Omit<TeamMember, 'id' | 'joinedAt'>[]) => void;
  onRemoveTeamMember: (id: string) => void;
  onUpdateTeamMember?: (id: string, updated: Partial<TeamMember>) => void;
  onSimulateInvite?: (member: TeamMember) => void;
  onCreateProfile?: (profile: Omit<AccessProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile?: (id: string, updated: Partial<AccessProfile>) => void;
  onDeleteProfile?: (id: string) => void;
  onAddMailbox?: (mailbox: Omit<DomainMailbox, 'id' | 'createdAt' | 'storageUsedMb' | 'passwordLastUpdated'> & { initialPassword: string }) => void;
  onUpdateMailbox?: (id: string, updated: Partial<DomainMailbox>) => void;
  onDeleteMailbox?: (id: string) => void;
  onResetMailboxPassword?: (id: string, newPass: string) => void;
  onChangeMailboxPassword?: (mailboxId: string, newPass: string) => void;
  onAddSender: (sender: Omit<VerifiedSenderEmail, 'id'>) => void;
  onSetDefaultSender: (id: string) => void;
  onDeleteSender: (id: string) => void;
  onAddDomain: (domain: string) => void;
  onUpdateCommerce: (commerce: Partial<CommerceSettings>) => void;
  onUpdateBranding: (branding: Partial<BrandSettings>) => void;
  onUpdateOptIn: (optIn: Partial<OptInSettings>) => void;
  onUpdateTerms: (terms: LegalDocument) => void;
  onUpdatePrivacy: (privacy: LegalDocument) => void;
  onUpdatePlan: (plan: 'Lite' | 'Pro' | 'Everything', interval: 'monthly' | 'annual') => void;
  onUpdatePaypalEmail: (email: string) => void;
  onUpdateAffiliateCode: (code: string) => void;
  onTabChange?: (tab: MemberTab) => void;
}

export const MemberAreaModal: React.FC<MemberAreaModalProps> = ({
  initialTab = 'account',
  onClose,
  account,
  team = [],
  profiles = [],
  mailboxes = [],
  senders = [],
  domains = [],
  commerce,
  branding,
  optIn,
  terms,
  privacy,
  billing,
  referral,
  activeSession,
  isOwner = true,
  onUpdateAccount,
  onInviteTeamMember,
  onImportTeamMembers,
  onRemoveTeamMember,
  onUpdateTeamMember,
  onSimulateInvite,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onAddMailbox,
  onUpdateMailbox,
  onDeleteMailbox,
  onResetMailboxPassword,
  onChangeMailboxPassword,
  onAddSender,
  onSetDefaultSender,
  onDeleteSender,
  onAddDomain,
  onUpdateCommerce,
  onUpdateBranding,
  onUpdateOptIn,
  onUpdateTerms,
  onUpdatePrivacy,
  onUpdatePlan,
  onUpdatePaypalEmail,
  onUpdateAffiliateCode,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<MemberTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tab: MemberTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const assignedMailbox = (mailboxes || []).find(m => 
    m.id === activeSession?.assignedMailboxId || 
    m.email === activeSession?.assignedMailboxEmail
  );

  const menuSections = [
    {
      title: 'Profile & Team',
      items: [
        { id: 'account' as MemberTab, label: 'Account overview', icon: User },
        { id: 'team' as MemberTab, label: 'Team members', icon: Users, isNew: true },
        { id: 'access-profiles' as MemberTab, label: 'Access Profiles', icon: Shield, isNew: true }
      ]
    },
    {
      title: 'Deliverability & Domain Inboxes',
      items: [
        { id: 'domain-mailboxes' as MemberTab, label: 'Domain mailboxes', icon: Inbox, isNew: true },
        { id: 'email-setup' as MemberTab, label: 'Email setup', icon: Mail },
        { id: 'domain-setup' as MemberTab, label: 'Domain setup', icon: Globe },
        { id: 'commerce-setup' as MemberTab, label: 'Commerce setup', icon: ShoppingBag, isNew: true }
      ]
    },
    {
      title: 'Brand & Compliance',
      items: [
        { id: 'branding' as MemberTab, label: 'Branding', icon: Palette },
        { id: 'opt-in' as MemberTab, label: 'Opt-in setup', icon: ShieldCheck },
        { id: 'data-privacy' as MemberTab, label: 'Data and privacy', icon: FileText },
        { id: 'integrations' as MemberTab, label: 'Integrations', icon: Layers }
      ]
    },
    {
      title: 'Billing & Rewards',
      items: [
        { id: 'plan-billing' as MemberTab, label: 'Plan + billing', icon: CreditCard },
        { id: 'share-sendline' as MemberTab, label: 'Share Sendline 💸', icon: Gift, isHighlight: true }
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'get-help' as MemberTab, label: 'Get help', icon: HelpCircle }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white text-stone-900 font-sans flex flex-col antialiased overflow-hidden select-none">
      
      {/* TOP HEADER */}
      <header className="h-16 px-6 sm:px-10 border-b border-stone-200/80 flex items-center justify-between bg-white shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-stone-800 hover:text-stone-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to workspace</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-stone-700">{account.email}</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN SPLIT CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SETTINGS SIDEBAR */}
        <aside className="w-64 sm:w-72 border-r border-stone-200/80 bg-[#FAF8F5]/60 flex flex-col justify-between overflow-y-auto p-4 shrink-0">
          <div className="space-y-6">
            
            {/* Header User Badge */}
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white font-serif font-bold text-base flex items-center justify-center">
                m
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-extrabold text-stone-950 truncate">{account.fullName}</div>
                <div className="text-[10px] text-stone-400 font-mono truncate">{account.handle}.sendline.io</div>
              </div>
            </div>

            {/* Menu Navigation Sections */}
            <nav className="space-y-5">
              {menuSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {sec.title}
                  </div>

                  <div className="space-y-0.5 pt-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`member-tab-${item.id}`}
                          onClick={() => handleTabSelect(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-stone-950 text-white shadow-xs'
                              : item.isHighlight
                              ? 'text-amber-950 hover:bg-amber-100/60 font-bold'
                              : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isHighlight ? 'text-amber-600' : 'text-stone-500'}`} />
                            <span>{item.label}</span>
                          </div>

                          {item.isNew && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                            }`}>
                              New
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

          </div>
        </aside>

        {/* RIGHT ACTIVE TAB CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-12 bg-white">
          {activeTab === 'account' && (
            <AccountOverviewTab 
              account={account} 
              activeSession={activeSession}
              assignedMailbox={assignedMailbox}
              onUpdateAccount={onUpdateAccount} 
              onChangeMailboxPassword={onChangeMailboxPassword}
            />
          )}

          {activeTab === 'team' && (
            <TeamMembersTab 
              team={team} 
              mailboxes={mailboxes}
              profiles={profiles}
              isOwner={isOwner}
              onInviteMember={onInviteTeamMember} 
              onImportMembers={onImportTeamMembers}
              onRemoveMember={onRemoveTeamMember}
              onUpdateMember={onUpdateTeamMember}
              onSimulateInvite={onSimulateInvite}
              onCreateProfile={onCreateProfile}
              onUpdateProfile={onUpdateProfile}
              onDeleteProfile={onDeleteProfile}
            />
          )}

          {activeTab === 'access-profiles' && (
            <AccessProfilesManager
              profiles={profiles}
              team={team}
              isOwner={isOwner}
              onCreateProfile={onCreateProfile || (() => {})}
              onUpdateProfile={onUpdateProfile || (() => {})}
              onDeleteProfile={onDeleteProfile || (() => {})}
              onAssignProfileToMember={(memberId, profileId) => {
                const matchedProf = profiles.find(p => p.id === profileId);
                if (onUpdateTeamMember && matchedProf) {
                  onUpdateTeamMember(memberId, {
                    profileId,
                    profileName: matchedProf.name,
                    allowedModules: matchedProf.allowedModules
                  });
                }
              }}
              onOpenTeamTab={() => setActiveTab('team')}
            />
          )}

          {activeTab === 'domain-mailboxes' && (
            <DomainMailboxesTab
              mailboxes={mailboxes}
              domains={domains}
              team={team}
              isOwner={isOwner}
              onAddMailbox={onAddMailbox || (() => {})}
              onUpdateMailbox={onUpdateMailbox || (() => {})}
              onDeleteMailbox={onDeleteMailbox || (() => {})}
              onResetPassword={onResetMailboxPassword || (() => {})}
              onOpenTeamTab={() => setActiveTab('team')}
            />
          )}

          {activeTab === 'email-setup' && (
            <EmailSetupTab
              senders={senders}
              onAddSender={onAddSender}
              onSetDefault={onSetDefaultSender}
              onDeleteSender={onDeleteSender}
            />
          )}

          {activeTab === 'domain-setup' && (
            <DomainSetupTab domains={domains} onAddDomain={onAddDomain} />
          )}

          {activeTab === 'commerce-setup' && (
            <CommerceSetupTab commerce={commerce} onUpdateCommerce={onUpdateCommerce} />
          )}

          {activeTab === 'branding' && (
            <BrandingTab branding={branding} onUpdateBranding={onUpdateBranding} />
          )}

          {activeTab === 'opt-in' && (
            <OptInSetupTab optIn={optIn} onUpdateOptIn={onUpdateOptIn} />
          )}

          {activeTab === 'data-privacy' && (
            <DataPrivacyTab
              terms={terms}
              privacy={privacy}
              onUpdateTerms={onUpdateTerms}
              onUpdatePrivacy={onUpdatePrivacy}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsTab />
          )}

          {activeTab === 'plan-billing' && (
            <PlanBillingTab billing={billing} onUpdatePlan={onUpdatePlan} />
          )}

          {activeTab === 'share-sendline' && (
            <ShareSendlineTab
              referral={referral}
              onUpdatePaypalEmail={onUpdatePaypalEmail}
              onUpdateAffiliateCode={onUpdateAffiliateCode}
            />
          )}

          {activeTab === 'get-help' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Need help with Sendline?</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse our editorial tutorials, reach our deliverability engineering desk, or join creator masterclasses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <div className="text-sm font-bold text-stone-950">Documentation & Guides</div>
                  <p className="text-xs text-stone-500">Step-by-step instructions for DNS setup, automation workflows, and template styling.</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                  <div className="text-sm font-bold text-stone-950">24/7 Priority Concierge</div>
                  <p className="text-xs text-stone-500">Direct response from our team within 15 minutes for Everything plan members.</p>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
