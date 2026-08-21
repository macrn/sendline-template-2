import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  AppView, 
  Campaign, 
  EmailTemplate, 
  EmailSection,
  TransactionalLog, 
  ApiKey, 
  ScreenerItem, 
  InboxEmail, 
  LoyaltyTier, 
  LoyaltyMember, 
  CouponReward, 
  DomainRecord,
  FormItem,
  FormSubmission,
  CheckoutProduct,
  CheckoutOrder,
  WorkflowItem,
  WorkflowNode
} from './types';
import { FormTemplatePreset } from './data/formTemplates';
import { TemplateUsageSelectorModal, StudioUsageTarget } from './components/marketing/TemplateUsageSelectorModal';
import { Plus } from 'lucide-react';
import { 
  mockCampaigns, 
  mockTemplates, 
  mockTransactionalLogs, 
  mockApiKeys, 
  mockScreenerItems, 
  mockInboxEmails, 
  mockLoyaltyTiers, 
  mockLoyaltyMembers, 
  mockCouponRewards, 
  mockDomains,
  mockForms,
  mockFormSubmissions,
  mockCheckoutProducts,
  mockCheckoutOrders
} from './data/mockData';
import { INITIAL_WORKFLOWS } from './data/workflowData';
import {
  MemberTab,
  UserAccountDetails,
  TeamMember,
  AccessProfile,
  DomainMailbox,
  ActiveUserSession,
  VerifiedSenderEmail,
  BrandSettings,
  OptInSettings,
  LegalDocument,
  CommerceSettings,
  PlanBillingDetails,
  ReferralDetails,
  UserFolder,
  UserSavedEmail
} from './types/member';
import {
  INITIAL_ACCOUNT,
  INITIAL_TEAM,
  INITIAL_PROFILES,
  INITIAL_MAILBOXES,
  INITIAL_ACTIVE_SESSION,
  INITIAL_SENDERS,
  INITIAL_BRAND,
  INITIAL_OPT_IN,
  INITIAL_TERMS,
  INITIAL_PRIVACY,
  INITIAL_COMMERCE,
  INITIAL_BILLING,
  INITIAL_REFERRAL,
  INITIAL_FOLDERS,
  INITIAL_SAVED_EMAILS
} from './data/mockMemberData';

// Landing Page Components
import { LandingHeader } from './components/navigation/LandingHeader';
import { LandingHero } from './components/landing/LandingHero';
import { FlodeskMarketingShowcase } from './components/landing/FlodeskMarketingShowcase';
import { TransactionalApiShowcase } from './components/landing/TransactionalApiShowcase';
import { InboxShowcase } from './components/landing/InboxShowcase';
import { LoyaltyShowcase } from './components/landing/LoyaltyShowcase';
import { ComparisonTable } from './components/landing/ComparisonTable';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { PricingSection } from './components/landing/PricingSection';
import { LandingFooter } from './components/landing/LandingFooter';

// App / Dashboard Components
import { AppSidebar } from './components/navigation/AppSidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { MarketingHub } from './components/marketing/MarketingHub';
import { MyTemplatesFolderView } from './components/member/MyTemplatesFolderView';
import { TemplateEditorModal } from './components/marketing/TemplateEditorModal';
import { TransactionalHub } from './components/transactional/TransactionalHub';
import { InboxHub } from './components/inbox/InboxHub';
import { LoyaltyHub } from './components/loyalty/LoyaltyHub';
import { AdminPanel } from './components/admin/AdminPanel';
import { AudienceView } from './components/audience/AudienceView';
import { FormsHub } from './components/forms/FormsHub';
import { PublicHostedForm } from './components/forms/PublicHostedForm';
import { WorkflowsHub } from './components/workflows/WorkflowsHub';
import { WorkflowStudio } from './components/workflows/WorkflowStudio';
import { CheckoutHub } from './components/checkout/CheckoutHub';
import { PublicHostedCheckout } from './components/checkout/PublicHostedCheckout';
import { MemberAreaModal } from './components/member/MemberAreaModal';
import { MemberMenuDropdown } from './components/member/MemberMenuDropdown';
import { StandaloneMailboxView } from './components/inbox/StandaloneMailboxView';
import { UserAccessPlan } from './components/inbox/MailboxAuthModal';
import { CleanFlodeskStudio } from './components/clean/CleanFlodeskStudio';
import { UnifiedTemplateStudio } from './components/unified/UnifiedTemplateStudio';

// Route Slugs Mapping
const TAB_TO_SLUG: Record<MemberTab, string> = {
  'account': 'account',
  'team': 'team',
  'access-profiles': 'access-profiles',
  'domain-mailboxes': 'domain-mailboxes',
  'email-setup': 'email-setup',
  'domain-setup': 'dns',
  'commerce-setup': 'commerce',
  'branding': 'branding',
  'opt-in': 'opt-in',
  'data-privacy': 'privacy',
  'integrations': 'integrations',
  'plan-billing': 'billing',
  'share-sendline': 'referrals',
  'get-help': 'help'
};

const VIEW_TO_PATH: Record<AppView, string> = {
  'landing': '/',
  'dashboard': '/dashboard',
  'unified-studio': '/unified-studio',
  'marketing': '/campaigns',
  'audience': '/audience',
  'forms': '/forms',
  'checkout': '/checkout',
  'workflows': '/workflows',
  'workflow-studio': '/workflows/studio',
  'public-form-preview': '/f/preview',
  'public-checkout-preview': '/pay/preview',
  'my-templates': '/templates',
  'template-editor': '/template-editor',
  'flodesk-templates': '/flodesk-studio',
  'transactional': '/transactional',
  'inbox': '/inbox',
  'loyalty': '/loyalty',
  'admin': '/admin',
  'standalone-mailbox': '/standalone-mailbox'
};

const getRouteStateFromPath = (pathname: string): { 
  view: AppView; 
  memberTab: MemberTab | null; 
  adminTab?: 'routing' | 'domains' | 'ips' | 'team';
} => {
  const clean = pathname.replace(/\/$/, '') || '/';

  // Settings tab paths
  if (clean.startsWith('/settings')) {
    const parts = clean.split('/');
    const sub = parts[2] || 'account';
    
    let memberTab: MemberTab = 'account';
    if (sub === 'team' || sub === 'members') memberTab = 'team';
    else if (sub === 'access-profiles' || sub === 'profiles' || sub === 'roles') memberTab = 'access-profiles';
    else if (sub === 'domain-mailboxes' || sub === 'mailboxes') memberTab = 'domain-mailboxes';
    else if (sub === 'email-setup' || sub === 'senders') memberTab = 'email-setup';
    else if (sub === 'dns' || sub === 'domains' || sub === 'domain-setup') memberTab = 'domain-setup';
    else if (sub === 'commerce' || sub === 'commerce-setup' || sub === 'stripe') memberTab = 'commerce-setup';
    else if (sub === 'branding' || sub === 'brand') memberTab = 'branding';
    else if (sub === 'opt-in' || sub === 'compliance') memberTab = 'opt-in';
    else if (sub === 'privacy' || sub === 'data-privacy' || sub === 'legal') memberTab = 'data-privacy';
    else if (sub === 'integrations' || sub === 'webhooks') memberTab = 'integrations';
    else if (sub === 'billing' || sub === 'plan-billing' || sub === 'subscription') memberTab = 'plan-billing';
    else if (sub === 'referrals' || sub === 'share-sendline' || sub === 'affiliate') memberTab = 'share-sendline';
    else if (sub === 'help' || sub === 'get-help' || sub === 'support') memberTab = 'get-help';

    return { view: 'dashboard', memberTab };
  }

  // Admin routes
  if (clean.startsWith('/admin') || clean.startsWith('/infrastructure')) {
    const parts = clean.split('/');
    const sub = parts[2] as 'routing' | 'domains' | 'ips' | 'team' | undefined;
    return { view: 'admin', memberTab: null, adminTab: sub || 'routing' };
  }

  // Standalone Mailbox routes
  if (clean === '/standalone-mailbox' || clean === '/mail' || clean === '/imbox') {
    return { view: 'standalone-mailbox', memberTab: null };
  }

  // Hosted public form & pay preview routes
  if (clean.startsWith('/f/') || clean === '/form-preview' || clean === '/forms/preview') {
    return { view: 'public-form-preview', memberTab: null };
  }
  if (clean.startsWith('/pay/') || clean === '/checkout-preview' || clean === '/pay-preview') {
    return { view: 'public-checkout-preview', memberTab: null };
  }

  // Core views
  if (clean === '/dashboard') return { view: 'dashboard', memberTab: null };
  if (clean === '/unified-studio' || clean === '/unified-templates' || clean === '/unified') return { view: 'unified-studio', memberTab: null };
  if (clean === '/campaigns' || clean === '/marketing') return { view: 'marketing', memberTab: null };
  if (clean === '/audience' || clean === '/contacts' || clean === '/subscribers') return { view: 'audience', memberTab: null };
  if (clean === '/forms' || clean === '/form-builder') return { view: 'forms', memberTab: null };
  if (clean === '/checkout' || clean === '/payment-links' || clean === '/products') return { view: 'checkout', memberTab: null };
  if (clean === '/workflows' || clean === '/automations' || clean === '/flows') return { view: 'workflows', memberTab: null };
  if (clean === '/workflows/studio' || clean === '/workflow-studio') return { view: 'workflow-studio', memberTab: null };
  if (clean === '/templates' || clean === '/my-templates') return { view: 'my-templates', memberTab: null };
  if (clean === '/template-editor' || clean === '/editor') return { view: 'template-editor', memberTab: null };
  if (clean === '/flodesk-studio' || clean === '/flodesk' || clean === '/clean-studio') return { view: 'flodesk-templates', memberTab: null };
  if (clean === '/transactional' || clean === '/smtp' || clean === '/api') return { view: 'transactional', memberTab: null };
  if (clean.startsWith('/inbox') || clean === '/screener') return { view: 'inbox', memberTab: null };
  if (clean === '/loyalty' || clean === '/rewards') return { view: 'loyalty', memberTab: null };
  if (clean === '/pricing') return { view: 'landing', memberTab: null };

  return { view: 'landing', memberTab: null };
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // App Navigation State - derived from current browser URL
  const initialRoute = getRouteStateFromPath(location.pathname);
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeMemberModalTab, setActiveMemberModalTab] = useState<MemberTab | null>(initialRoute.memberTab);
  const [adminActiveTab, setAdminActiveTab] = useState<'routing' | 'domains' | 'ips' | 'team'>(initialRoute.adminTab || 'routing');

  const [activeDomain, setActiveDomain] = useState('sendline.io');
  const [userPlan, setUserPlan] = useState<UserAccessPlan>('all_in_one');
  const [currentUserEmail, setCurrentUserEmail] = useState('mehmet@sendline.io');

  // Application Data States
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [transactionalLogs, setTransactionalLogs] = useState<TransactionalLog[]>(mockTransactionalLogs);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [screenerItems, setScreenerItems] = useState<ScreenerItem[]>(mockScreenerItems);
  const [emails, setEmails] = useState<InboxEmail[]>(mockInboxEmails);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>(mockLoyaltyTiers);
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>(mockLoyaltyMembers);
  const [couponRewards, setCouponRewards] = useState<CouponReward[]>(mockCouponRewards);
  const [domains, setDomains] = useState<DomainRecord[]>(mockDomains);
  const [forms, setForms] = useState<FormItem[]>(mockForms);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(mockFormSubmissions);
  const [checkoutProducts, setCheckoutProducts] = useState<CheckoutProduct[]>(mockCheckoutProducts);
  const [checkoutOrders, setCheckoutOrders] = useState<CheckoutOrder[]>(mockCheckoutOrders);
  const [activePreviewForm, setActivePreviewForm] = useState<FormItem | null>(mockForms[0] || null);
  const [activePreviewProduct, setActivePreviewProduct] = useState<CheckoutProduct | null>(mockCheckoutProducts[0] || null);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [activeWorkflowForStudio, setActiveWorkflowForStudio] = useState<WorkflowItem | null>(INITIAL_WORKFLOWS[0] || null);

  // Member Area States
  const [account, setAccount] = useState<UserAccountDetails>(INITIAL_ACCOUNT);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [profiles, setProfiles] = useState<AccessProfile[]>(INITIAL_PROFILES);
  const [mailboxes, setMailboxes] = useState<DomainMailbox[]>(INITIAL_MAILBOXES);
  const [activeSession, setActiveSession] = useState<ActiveUserSession>(INITIAL_ACTIVE_SESSION);
  const [senders, setSenders] = useState<VerifiedSenderEmail[]>(INITIAL_SENDERS);
  const [commerce, setCommerce] = useState<CommerceSettings>(INITIAL_COMMERCE);
  const [branding, setBranding] = useState<BrandSettings>(INITIAL_BRAND);
  const [optIn, setOptIn] = useState<OptInSettings>(INITIAL_OPT_IN);
  const [terms, setTerms] = useState<LegalDocument>(INITIAL_TERMS);
  const [privacy, setPrivacy] = useState<LegalDocument>(INITIAL_PRIVACY);
  const [billing, setBilling] = useState<PlanBillingDetails>(INITIAL_BILLING);
  const [referral, setReferral] = useState<ReferralDetails>(INITIAL_REFERRAL);
  const [folders, setFolders] = useState<UserFolder[]>(INITIAL_FOLDERS);
  const [savedEmails, setSavedEmails] = useState<UserSavedEmail[]>(INITIAL_SAVED_EMAILS);

  // Modal / Editor State
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editorStudioMode, setEditorStudioMode] = useState<'campaign' | 'workflow' | 'library'>('campaign');
  const [editorWorkflowContext, setEditorWorkflowContext] = useState<{
    workflowId: string;
    workflowName: string;
    nodeId: string;
    stepTitle: string;
  } | undefined>(undefined);

  // Unified Template Usage Selector Modal State
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageTargetTemplate, setUsageTargetTemplate] = useState<EmailTemplate | null>(null);
  const [usageTargetFormTemplate, setUsageTargetFormTemplate] = useState<FormTemplatePreset | null>(null);

  // Sync route whenever location.pathname changes (e.g. browser back/forward, direct URL)
  useEffect(() => {
    const route = getRouteStateFromPath(location.pathname);
    setCurrentView(route.view);
    setActiveMemberModalTab(route.memberTab);
    if (route.adminTab) {
      setAdminActiveTab(route.adminTab);
    }

    if (location.pathname === '/pricing') {
      setTimeout(() => {
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.pathname]);

  // Screener Decision Handler
  const handleScreenDecision = (id: string, decision: 'in' | 'out' | 'feed' | 'papertrail') => {
    const item = screenerItems.find(s => s.id === id);
    if (!item) return;

    // Update screener list
    setScreenerItems(prev => prev.map(s => s.id === id ? { ...s, status: decision === 'out' ? 'screened_out' : 'screened_in' } : s));

    // If screened in (imbox, feed, or papertrail), create an email thread in appropriate category
    if (decision !== 'out') {
      const targetCategory = decision === 'feed' ? 'feed' : decision === 'papertrail' ? 'papertrail' : 'imbox';
      const newEmail: InboxEmail = {
        id: 'em-sc-' + Date.now(),
        senderName: item.senderName,
        senderEmail: item.senderEmail,
        recipientEmail: 'mehmet@sendline.io',
        avatar: item.avatar,
        subject: item.subject,
        preview: item.snippet,
        body: `${item.snippet}\n\nThank you for approving our first contact via Sendline Screener.\nLooking forward to speaking soon.\n\nBest regards,\n${item.senderName}`,
        receivedAt: 'Just now',
        category: targetCategory,
        isRead: false,
        paperTrailMeta: decision === 'papertrail' ? {
          merchant: item.senderName,
          amount: '$149.00',
          status: 'Processed',
          orderNumber: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
          category: 'Receipt'
        } : undefined,
        feedMeta: decision === 'feed' ? {
          publicationName: item.senderName,
          readingTime: '3 min read',
          summary: item.snippet
        } : undefined
      };
      setEmails(prev => [newEmail, ...prev]);
    }
  };

  // Add Log Handler
  const handleAddLog = (newLog: TransactionalLog) => {
    setTransactionalLogs(prev => [newLog, ...prev]);
  };

  // Add Campaign Handler
  const handleSaveCampaign = (newCampaign: Campaign) => {
    setCampaigns(prev => [newCampaign, ...prev]);

    // Also auto-save to user folder as a customized email
    const newSavedEmail: UserSavedEmail = {
      id: 'saved-' + Date.now(),
      folderId: 'fld-promos',
      title: newCampaign.title,
      templateId: 'tmpl-multi-service-sale',
      templateSnapshot: {
        id: 'tmpl-' + Date.now(),
        name: newCampaign.title,
        category: 'Editorial',
        thumbnailColor: '#FAF8F5',
        subject: newCampaign.subject,
        preheader: newCampaign.subject,
        headline: newCampaign.title,
        body: 'Customized edition crafted in Sendline Studio.',
        badgeText: 'CUSTOM',
        description: newCampaign.subject,
        scriptOverlay: 'Curated Edition',
        accentColor: '#1C1917',
        ctaText: 'View Capsule',
        ctaUrl: 'https://sendline.io',
        paletteTheme: 'sand',
        fontFamily: 'serif',
        frameShape: 'rounded',
        status: newCampaign.status === 'Sent' ? 'sent' : newCampaign.status === 'Scheduled' ? 'scheduled' : 'draft',
        createdAt: 'Just now'
      },
      lastEditedText: 'Edited just now',
      lastEditedTimestamp: Date.now(),
      status: newCampaign.status === 'Sent' ? 'Sent' : newCampaign.status === 'Scheduled' ? 'Scheduled' : 'Draft',
      audienceLabel: 'Custom Segment'
    };
    setSavedEmails(prev => [newSavedEmail, ...prev]);
  };

  // Member Action Handlers
  const handleUpdateAccount = (updated: Partial<UserAccountDetails>) => {
    setAccount(prev => ({ ...prev, ...updated }));
  };

  const handleInviteTeamMember = (newMember: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const memberObj: TeamMember = {
      ...newMember,
      id: 'tm-' + Date.now(),
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setTeam(prev => [...prev, memberObj]);

    // If a mailbox was assigned, link it in mailbox state too
    if (newMember.assignedMailboxId) {
      setMailboxes(prev => prev.map(m => 
        m.id === newMember.assignedMailboxId 
          ? { ...m, assignedMemberId: memberObj.id, assignedMemberName: memberObj.name }
          : m
      ));
    }
  };

  const handleUpdateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const handleSimulateInvite = (member: TeamMember) => {
    // Activate member
    setTeam(prev => prev.map(m => m.id === member.id ? { ...m, status: 'Active' } : m));
    // Switch session to simulated member to test their perspective
    setActiveSession({
      userId: member.id,
      name: member.name,
      personalEmail: member.email,
      role: member.role,
      isOwner: member.role === 'Owner',
      assignedMailboxId: member.assignedMailboxId,
      assignedMailboxEmail: member.assignedMailboxEmail,
      allowedModules: member.allowedModules || ['inbox']
    });
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    // Unassign any mailbox linked to this member
    setMailboxes(prev => prev.map(m => 
      m.assignedMemberId === id 
        ? { ...m, assignedMemberId: undefined, assignedMemberName: undefined }
        : m
    ));
  };

  const handleImportTeamMembers = (newMembers: TeamMember[]) => {
    setTeam(prev => [...prev, ...newMembers]);
  };

  // Access Profile Handlers
  const handleCreateProfile = (newProfile: AccessProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  };

  const handleUpdateProfile = (id: string, updated: Partial<AccessProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  // Mailbox Management Handlers
  const handleAddMailbox = (newMbx: Omit<DomainMailbox, 'id' | 'createdAt' | 'storageUsedMb' | 'passwordLastUpdated'> & { initialPassword: string }) => {
    const mailboxObj: DomainMailbox = {
      ...newMbx,
      id: 'mbx-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      storageUsedMb: 0,
      passwordLastUpdated: 'Today',
      passwordHint: 'Created in workspace'
    };
    setMailboxes(prev => [...prev, mailboxObj]);

    // If an existing team member was assigned, update team member record too
    if (newMbx.assignedMemberId) {
      setTeam(prev => prev.map(t => 
        t.id === newMbx.assignedMemberId 
          ? { ...t, assignedMailboxId: mailboxObj.id, assignedMailboxEmail: mailboxObj.email }
          : t
      ));
    }
  };

  const handleUpdateMailbox = (id: string, updated: Partial<DomainMailbox>) => {
    setMailboxes(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const handleDeleteMailbox = (id: string) => {
    setMailboxes(prev => prev.filter(m => m.id !== id));
    setTeam(prev => prev.map(t => 
      t.assignedMailboxId === id 
        ? { ...t, assignedMailboxId: undefined, assignedMailboxEmail: undefined }
        : t
    ));
  };

  const handleResetMailboxPassword = (id: string, newPass: string) => {
    setMailboxes(prev => prev.map(m => 
      m.id === id 
        ? { ...m, passwordLastUpdated: 'Just now', passwordHint: `Reset by Admin (${newPass.slice(0, 2)}•••)` }
        : m
    ));
  };

  const handleChangeMailboxPassword = (mailboxId: string, newPass: string) => {
    setMailboxes(prev => prev.map(m => 
      m.id === mailboxId 
        ? { ...m, passwordLastUpdated: 'Just now', passwordHint: `Changed by user (${newPass.slice(0, 2)}•••)` }
        : m
    ));
  };

  const handleAddSender = (newSender: Omit<VerifiedSenderEmail, 'id'>) => {
    const senderObj: VerifiedSenderEmail = {
      ...newSender,
      id: 'snd-' + Date.now()
    };
    setSenders(prev => [...prev, senderObj]);
  };

  const handleSetDefaultSender = (id: string) => {
    setSenders(prev => prev.map(s => ({
      ...s,
      isDefault: s.id === id
    })));
  };

  const handleDeleteSender = (id: string) => {
    setSenders(prev => prev.filter(s => s.id !== id));
  };

  const handleAddDomain = (newDomainName: string | DomainRecord) => {
    if (typeof newDomainName === 'string') {
      const newDom: DomainRecord = {
        domain: newDomainName,
        status: 'verified',
        dkimStatus: 'active',
        spfStatus: 'active',
        dmarcStatus: 'active',
        region: 'US-Global',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDomains(prev => [...prev, newDom]);
    } else {
      setDomains(prev => [newDomainName, ...prev]);
    }
  };

  const handleUpdateCommerce = (updated: Partial<CommerceSettings>) => {
    setCommerce(prev => ({ ...prev, ...updated }));
  };

  const handleUpdateBranding = (updated: Partial<BrandSettings>) => {
    setBranding(prev => ({ ...prev, ...updated }));
  };

  const handleUpdateOptIn = (updated: Partial<OptInSettings>) => {
    setOptIn(prev => ({ ...prev, ...updated }));
  };

  const handleUpdateTerms = (newTerms: LegalDocument) => {
    setTerms(newTerms);
  };

  const handleUpdatePrivacy = (newPrivacy: LegalDocument) => {
    setPrivacy(newPrivacy);
  };

  const handleUpdatePlan = (plan: 'Lite' | 'Pro' | 'Everything', interval: 'monthly' | 'annual') => {
    setBilling(prev => ({
      ...prev,
      currentPlan: plan,
      billingInterval: interval
    }));
  };

  const handleUpdatePaypalEmail = (email: string) => {
    setReferral(prev => ({
      ...prev,
      paypalEmail: email
    }));
  };

  const handleUpdateAffiliateCode = (code: string) => {
    setReferral(prev => ({
      ...prev,
      affiliateCode: code,
      affiliateUrl: `https://sendline.io/c/${code}`
    }));
  };

  // Folder Management Handlers
  const handleCreateFolder = (name: string, description?: string) => {
    const newFolder: UserFolder = {
      id: 'fld-' + Date.now(),
      name,
      description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    // Move contained emails to drafts
    setSavedEmails(prev => prev.map(e => e.folderId === folderId ? { ...e, folderId: 'fld-drafts' } : e));
  };

  const handleMoveToFolder = (emailId: string, folderId: string) => {
    setSavedEmails(prev => prev.map(e => e.id === emailId ? { ...e, folderId } : e));
  };

  // Add Reward Handler
  const handleAddReward = (newReward: CouponReward) => {
    setCouponRewards(prev => [newReward, ...prev]);
  };

  // Forms Handlers
  const handleSaveForm = (savedForm: FormItem) => {
    setForms(prev => {
      const exists = prev.some(f => f.id === savedForm.id);
      if (exists) {
        return prev.map(f => f.id === savedForm.id ? savedForm : f);
      }
      return [savedForm, ...prev];
    });
  };

  const handleDeleteForm = (formId: string) => {
    setForms(prev => prev.filter(f => f.id !== formId));
  };

  const handleOpenPublicForm = (form: FormItem) => {
    setActivePreviewForm(form);
    navigate(`/f/${form.slug}`);
  };

  const handleFormSubmissionSuccess = (submission: FormSubmission) => {
    setFormSubmissions(prev => [submission, ...prev]);
    // increment form submission count
    setForms(prev => prev.map(f => f.id === submission.formId ? { ...f, submissionsCount: f.submissionsCount + 1 } : f));
  };

  // Checkout Products Handlers
  const handleSaveCheckoutProduct = (savedProduct: CheckoutProduct) => {
    setCheckoutProducts(prev => {
      const exists = prev.some(p => p.id === savedProduct.id);
      if (exists) {
        return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      }
      return [savedProduct, ...prev];
    });
  };

  const handleDeleteCheckoutProduct = (productId: string) => {
    setCheckoutProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleOpenPublicCheckout = (product: CheckoutProduct) => {
    setActivePreviewProduct(product);
    navigate(`/pay/${product.slug}`);
  };

  const handleCheckoutPaymentSuccess = (order: CheckoutOrder) => {
    setCheckoutOrders(prev => [order, ...prev]);
    // update product sales metrics
    setCheckoutProducts(prev => prev.map(p => p.id === order.productId ? {
      ...p,
      totalSalesCount: p.totalSalesCount + 1,
      totalRevenue: p.totalRevenue + order.amount
    } : p));
  };

  // Workflow Handlers
  const handleOpenWorkflowStudio = (workflow: WorkflowItem) => {
    setActiveWorkflowForStudio(workflow);
    handleNavigate('workflow-studio');
  };

  const handleSaveWorkflowInStudio = (updated: WorkflowItem) => {
    setWorkflows(prev => prev.map(w => w.id === updated.id ? updated : w));
    setActiveWorkflowForStudio(updated);
  };

  const handleCreateWorkflow = (newWf: WorkflowItem) => {
    setWorkflows(prev => [newWf, ...prev]);
  };

  const handleUpdateWorkflow = (updated: WorkflowItem) => {
    setWorkflows(prev => prev.map(w => w.id === updated.id ? updated : w));
    if (activeWorkflowForStudio?.id === updated.id) {
      setActiveWorkflowForStudio(updated);
    }
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
  };

  // Open Editor Helper
  const handleOpenEditor = (
    tmpl?: EmailTemplate, 
    mode: 'campaign' | 'workflow' | 'library' = 'campaign',
    wfContext?: {
      workflowId: string;
      workflowName: string;
      nodeId: string;
      stepTitle: string;
    }
  ) => {
    setEditingTemplate(tmpl || null);
    setEditorStudioMode(mode);
    setEditorWorkflowContext(wfContext);
    setShowEditorModal(true);
  };

  // Usage Selector Decision Handler
  const handleTriggerUsageSelector = (template: EmailTemplate) => {
    setUsageTargetTemplate(template);
    setShowUsageModal(true);
  };

  const handleSelectUsageTarget = (
    target: StudioUsageTarget,
    payload?: {
      template?: EmailTemplate;
      workflowId?: string;
      workflowStepId?: string;
      formId?: string;
      formTemplate?: FormTemplatePreset;
    }
  ) => {
    setShowUsageModal(false);
    const tmpl = payload?.template || usageTargetTemplate || undefined;

    if (target === 'campaign') {
      handleOpenEditor(tmpl, 'campaign');
    } else if (target === 'workflow') {
      const selectedWf = workflows.find(w => w.id === payload?.workflowId) || workflows[0];
      const targetStepNode = payload?.workflowStepId ? selectedWf?.nodes?.find(n => n.id === payload.workflowStepId) : undefined;
      
      handleOpenEditor(tmpl, 'workflow', {
        workflowId: selectedWf?.id || 'wf-welcome-series',
        workflowName: selectedWf?.name || 'Automation Workflow',
        nodeId: targetStepNode?.id || payload?.workflowStepId || 'node-email-1',
        stepTitle: targetStepNode?.title || 'Email Step'
      });
    } else if (target === 'library') {
      handleOpenEditor(tmpl, 'library');
    } else if (target === 'form') {
      handleNavigate('forms');
    }
  };

  // Workflow Email Save Handler
  const handleSaveEmailToWorkflow = (updatedTemplate: EmailTemplate, customSections: EmailSection[]) => {
    if (!editorWorkflowContext) return;
    const { workflowId, nodeId } = editorWorkflowContext;

    setWorkflows(prev => prev.map(wf => {
      if (wf.id !== workflowId) return wf;

      const updateNodes = (nodes: WorkflowNode[] = []): WorkflowNode[] => {
        return nodes.map(n => {
          if (n.id === nodeId) {
            return {
              ...n,
              emailConfig: {
                ...n.emailConfig,
                subject: updatedTemplate.subject || n.emailConfig?.subject || 'Workflow Email',
                previewText: updatedTemplate.description || n.emailConfig?.previewText,
                layoutHeadline: updatedTemplate.headline || n.emailConfig?.layoutHeadline,
                templateSnapshot: updatedTemplate,
                customSections: customSections
              }
            };
          }
          return n;
        });
      };

      const updatedNodes = updateNodes(wf.nodes);
      let updatedRoot = wf.rootTriggerNode;
      if (updatedRoot && updatedRoot.id === nodeId) {
        updatedRoot = {
          ...updatedRoot,
          emailConfig: {
            ...updatedRoot.emailConfig,
            subject: updatedTemplate.subject || updatedRoot.emailConfig?.subject || 'Workflow Email',
            layoutHeadline: updatedTemplate.headline || updatedRoot.emailConfig?.layoutHeadline,
            templateSnapshot: updatedTemplate,
            customSections: customSections
          }
        };
      }

      return {
        ...wf,
        nodes: updatedNodes,
        rootTriggerNode: updatedRoot
      };
    }));
  };

  // Template Library Save Handler
  const handleSaveToMasterLibrary = (savedTmpl: EmailTemplate) => {
    setTemplates(prev => {
      const exists = prev.some(t => t.id === savedTmpl.id);
      if (exists) {
        return prev.map(t => t.id === savedTmpl.id ? savedTmpl : t);
      }
      return [savedTmpl, ...prev];
    });
  };

  const pendingScreenerCount = screenerItems.filter(s => s.status === 'pending').length;

  // View Navigation Helper - updates browser URL
  const handleNavigate = (view: AppView) => {
    if (view === 'template-editor') {
      handleOpenEditor();
    } else {
      const targetPath = VIEW_TO_PATH[view] || '/';
      navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Member Tab Helper - updates browser URL
  const handleOpenMemberTab = (tab: MemberTab) => {
    const slug = TAB_TO_SLUG[tab] || tab;
    navigate(`/settings/${slug}`);
  };

  // Close Member Modal - returns to workspace URL
  const handleCloseMemberModal = () => {
    const returnPath = VIEW_TO_PATH[currentView] || '/dashboard';
    navigate(returnPath);
  };

  // Tab switch inside modal - updates URL smoothly
  const handleModalTabChange = (tab: MemberTab) => {
    const slug = TAB_TO_SLUG[tab] || tab;
    navigate(`/settings/${slug}`, { replace: true });
  };

  // Admin Tab Change
  const handleAdminTabChange = (tab: 'routing' | 'domains' | 'ips' | 'team') => {
    setAdminActiveTab(tab);
    navigate(`/admin/${tab}`, { replace: true });
  };

  // LANDING PAGE VIEW
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-white font-sans antialiased overflow-x-hidden">
        {/* Navigation Bar */}
        <LandingHeader 
          currentView={currentView} 
          onNavigate={handleNavigate}
          onOpenMemberTab={handleOpenMemberTab}
        />

        {/* Hero & Showcase Sections */}
        <main>
          <LandingHero onNavigate={handleNavigate} />
          <FlodeskMarketingShowcase onNavigate={handleNavigate} />
          <InboxShowcase onNavigate={handleNavigate} />
          <TransactionalApiShowcase onNavigate={handleNavigate} />
          <LoyaltyShowcase onNavigate={handleNavigate} />
          <ComparisonTable />
          <TestimonialsSection />
          <PricingSection onNavigate={handleNavigate} />
        </main>

        {/* Footer */}
        <LandingFooter onNavigate={handleNavigate} />

        {/* Global Template Customizer Modal */}
        {showEditorModal && (
          <TemplateEditorModal
            initialTemplate={editingTemplate}
            onClose={() => setShowEditorModal(false)}
            onSaveCampaign={handleSaveCampaign}
          />
        )}

        {/* Full Member Area Modal */}
        {activeMemberModalTab && (
          <MemberAreaModal
            initialTab={activeMemberModalTab}
            onClose={handleCloseMemberModal}
            onTabChange={handleModalTabChange}
            account={account}
            team={team}
            mailboxes={mailboxes}
            senders={senders}
            domains={domains}
            commerce={commerce}
            branding={branding}
            optIn={optIn}
            terms={terms}
            privacy={privacy}
            billing={billing}
            referral={referral}
            activeSession={activeSession}
            isOwner={activeSession?.isOwner ?? true}
            onUpdateAccount={handleUpdateAccount}
            onInviteTeamMember={handleInviteTeamMember}
            onRemoveTeamMember={handleRemoveTeamMember}
            onUpdateTeamMember={handleUpdateTeamMember}
            onSimulateInvite={handleSimulateInvite}
            onAddMailbox={handleAddMailbox}
            onUpdateMailbox={handleUpdateMailbox}
            onDeleteMailbox={handleDeleteMailbox}
            onResetMailboxPassword={handleResetMailboxPassword}
            onChangeMailboxPassword={handleChangeMailboxPassword}
            onAddSender={handleAddSender}
            onSetDefaultSender={handleSetDefaultSender}
            onDeleteSender={handleDeleteSender}
            onAddDomain={handleAddDomain}
            onUpdateCommerce={handleUpdateCommerce}
            onUpdateBranding={handleUpdateBranding}
            onUpdateOptIn={handleUpdateOptIn}
            onUpdateTerms={handleUpdateTerms}
            onUpdatePrivacy={handleUpdatePrivacy}
            onUpdatePlan={handleUpdatePlan}
            onUpdatePaypalEmail={handleUpdatePaypalEmail}
            onUpdateAffiliateCode={handleUpdateAffiliateCode}
            profiles={profiles}
            onImportTeamMembers={handleImportTeamMembers}
            onCreateProfile={handleCreateProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        )}
      </div>
    );
  }

  // STANDALONE MAILBOX APPLICATION VIEW (Dedicated URL https://mail.sendline.io)
  if (currentView === 'standalone-mailbox') {
    return (
      <StandaloneMailboxView
        emails={emails}
        screenerItems={screenerItems}
        onScreenDecision={handleScreenDecision}
        onSendEmail={(newMail) => setEmails(prev => [newMail, ...prev])}
        onNavigate={handleNavigate}
        userPlan={userPlan}
        onUpdatePlan={(plan, email) => {
          setUserPlan(plan);
          setCurrentUserEmail(email);
        }}
        userEmail={currentUserEmail}
      />
    );
  }

  // AUTHENTICATED / APPLICATION DASHBOARD & HUBS VIEW (Workspace Engine)
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-stone-900 selection:text-white font-sans flex antialiased">
      
      {/* SaaS Left Sidebar */}
      <AppSidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        pendingScreenerCount={pendingScreenerCount}
        activeDomain={activeDomain}
        onDomainChange={setActiveDomain}
        onOpenMemberTab={handleOpenMemberTab}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header Strip */}
        <header className="h-14 px-6 sm:px-8 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 sticky top-0 z-30 font-sans text-left">
          <div className="flex items-center gap-2.5 text-left">
            <span className="text-xs sm:text-sm font-semibold text-stone-900 tracking-tight font-sans text-left">
              {currentView === 'dashboard' ? 'Workspace Overview' : 
               currentView === 'unified-studio' ? 'Unified Template Studio' :
               currentView === 'marketing' ? 'Campaign' : 
               currentView === 'audience' ? 'Audience' : 
               currentView === 'forms' ? 'Forms & Lead Capture' :
               currentView === 'checkout' ? 'Checkout & Payment Links' :
               currentView === 'workflows' ? 'Workflows & Automations' :
               currentView === 'workflow-studio' ? 'Workflow Canvas Studio' :
               currentView === 'my-templates' ? 'Saved Folders & Emails' : 
               currentView === 'transactional' ? 'Transactional' : 
               currentView === 'inbox' ? 'Mailbox' : 
               currentView === 'loyalty' ? 'Loyalty' : 'Domains & DNS'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="workspace-header-new-campaign-btn"
              onClick={() => handleNavigate('template-editor')}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 text-stone-300" />
              <span>New Campaign</span>
            </button>

            <button
              id="workspace-header-view-public-btn"
              onClick={() => handleNavigate('landing')}
              className="px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium text-xs transition-all cursor-pointer border border-stone-200 shadow-xs"
            >
              Public Site
            </button>

            {/* Member Dropdown in Header */}
            <div className="pl-2 border-l border-stone-200">
              <MemberMenuDropdown onOpenMemberTab={handleOpenMemberTab} />
            </div>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="flex-1 pb-16">
          {currentView === 'dashboard' && (
            <OverviewDashboard
              onNavigate={handleNavigate}
              campaigns={campaigns}
              transactionalLogs={transactionalLogs}
              screenerItems={screenerItems}
            />
          )}

          {currentView === 'unified-studio' && (
            <UnifiedTemplateStudio
              onNavigateToCampaigns={() => handleNavigate('marketing')}
              onNavigateToForms={() => handleNavigate('forms')}
              onNavigateToWorkflows={() => handleNavigate('workflows')}
            />
          )}

          {currentView === 'marketing' && (
            <MarketingHub
              campaigns={campaigns}
              templates={templates}
              folders={folders}
              savedEmails={savedEmails}
              onOpenTemplateEditor={handleOpenEditor}
              onSelectTemplateUsage={handleTriggerUsageSelector}
              onNavigate={handleNavigate}
              onSaveCampaign={(camp) => setCampaigns(prev => [camp, ...prev])}
            />
          )}

          {currentView === 'audience' && (
            <AudienceView
              onNavigate={handleNavigate}
              onOpenCampaignWithSegment={(seg) => {
                handleNavigate('marketing');
              }}
            />
          )}

          {currentView === 'forms' && (
            <FormsHub
              forms={forms}
              submissions={formSubmissions}
              onSaveForm={handleSaveForm}
              onDeleteForm={handleDeleteForm}
              onOpenPublicForm={handleOpenPublicForm}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutHub
              products={checkoutProducts}
              orders={checkoutOrders}
              onSaveProduct={handleSaveCheckoutProduct}
              onDeleteProduct={handleDeleteCheckoutProduct}
              onOpenPublicPay={handleOpenPublicCheckout}
              onOpenCommerceSettings={() => handleOpenMemberTab('commerce-setup')}
            />
          )}

          {currentView === 'workflows' && (
            <WorkflowsHub
              workflows={workflows}
              onOpenWorkflowStudio={handleOpenWorkflowStudio}
              onCreateWorkflow={handleCreateWorkflow}
              onUpdateWorkflow={handleUpdateWorkflow}
              onDeleteWorkflow={handleDeleteWorkflow}
              forms={forms}
              products={checkoutProducts}
            />
          )}

          {currentView === 'workflow-studio' && (
            <WorkflowStudio
              workflow={activeWorkflowForStudio || workflows[0]}
              onSave={handleSaveWorkflowInStudio}
              onBack={() => handleNavigate('workflows')}
              forms={forms}
              products={checkoutProducts}
              onOpenEmailStudio={(emailConfig, node, wf) => {
                const effectiveWf = wf || activeWorkflowForStudio || workflows[0];
                const effectiveNode = node || effectiveWf.rootTriggerNode;
                handleOpenEditor(
                  emailConfig?.templateSnapshot || mockTemplates[0],
                  'workflow',
                  {
                    workflowId: effectiveWf.id,
                    workflowName: effectiveWf.name,
                    nodeId: effectiveNode?.id || 'node-email',
                    stepTitle: effectiveNode?.title || 'Workflow Email Step'
                  }
                );
              }}
            />
          )}

          {currentView === 'public-form-preview' && (
            <PublicHostedForm
              form={activePreviewForm || forms[0]}
              onBackToApp={() => handleNavigate('forms')}
              onSubmitSuccess={handleFormSubmissionSuccess}
            />
          )}

          {currentView === 'public-checkout-preview' && (
            <PublicHostedCheckout
              product={activePreviewProduct || checkoutProducts[0]}
              onBackToApp={() => handleNavigate('checkout')}
              onPaymentSuccess={handleCheckoutPaymentSuccess}
            />
          )}

          {currentView === 'my-templates' && (
            <div className="bg-white min-h-screen">
              <MyTemplatesFolderView
                folders={folders}
                savedEmails={savedEmails}
                onCreateFolder={handleCreateFolder}
                onDeleteFolder={handleDeleteFolder}
                onMoveToFolder={handleMoveToFolder}
                onCustomizeEmail={(tmpl) => handleTriggerUsageSelector(tmpl)}
                onNewEmail={() => handleOpenEditor()}
              />
            </div>
          )}

          {currentView === 'flodesk-templates' && (
            <CleanFlodeskStudio
              onNavigate={handleNavigate}
              onSaveCampaign={handleSaveCampaign}
              onSaveWorkflow={handleCreateWorkflow}
              onSaveForm={handleSaveForm}
            />
          )}

          {currentView === 'transactional' && (
            <TransactionalHub
              logs={transactionalLogs}
              apiKeys={apiKeys}
              onAddLog={handleAddLog}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'inbox' && (
            <InboxHub
              emails={emails}
              screenerItems={screenerItems}
              onScreenDecision={handleScreenDecision}
              onSendEmail={(newMail) => setEmails(prev => [newMail, ...prev])}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'loyalty' && (
            <LoyaltyHub
              tiers={loyaltyTiers}
              members={loyaltyMembers}
              rewards={couponRewards}
              onAddReward={handleAddReward}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'admin' && (
            <AdminPanel
              domains={domains}
              onAddDomain={handleAddDomain}
              onNavigate={handleNavigate}
              initialTab={adminActiveTab}
              onTabChange={handleAdminTabChange}
            />
          )}
        </main>

      </div>

      {/* Global Template Customizer Modal */}
      {showEditorModal && (
        <TemplateEditorModal
          initialTemplate={editingTemplate}
          onClose={() => setShowEditorModal(false)}
          onSaveCampaign={handleSaveCampaign}
          onNavigate={handleNavigate}
          studioMode={editorStudioMode}
          workflowContext={editorWorkflowContext}
          onSaveToWorkflow={handleSaveEmailToWorkflow}
          onSaveToLibrary={handleSaveToMasterLibrary}
        />
      )}

      {/* Unified Template & Form Usage Destination Selector Modal */}
      <TemplateUsageSelectorModal
        isOpen={showUsageModal}
        onClose={() => setShowUsageModal(false)}
        template={usageTargetTemplate}
        formTemplate={usageTargetFormTemplate}
        workflows={workflows}
        forms={forms}
        onSelectUsage={handleSelectUsageTarget}
      />

      {/* Full Member Area Modal */}
      {activeMemberModalTab && (
        <MemberAreaModal
          initialTab={activeMemberModalTab}
          onClose={handleCloseMemberModal}
          onTabChange={handleModalTabChange}
          account={account}
          team={team}
          mailboxes={mailboxes}
          senders={senders}
          domains={domains}
          commerce={commerce}
          branding={branding}
          optIn={optIn}
          terms={terms}
          privacy={privacy}
          billing={billing}
          referral={referral}
          activeSession={activeSession}
          isOwner={activeSession?.isOwner ?? true}
          onUpdateAccount={handleUpdateAccount}
          onInviteTeamMember={handleInviteTeamMember}
          onRemoveTeamMember={handleRemoveTeamMember}
          onUpdateTeamMember={handleUpdateTeamMember}
          onSimulateInvite={handleSimulateInvite}
          onAddMailbox={handleAddMailbox}
          onUpdateMailbox={handleUpdateMailbox}
          onDeleteMailbox={handleDeleteMailbox}
          onResetMailboxPassword={handleResetMailboxPassword}
          onChangeMailboxPassword={handleChangeMailboxPassword}
          onAddSender={handleAddSender}
          onSetDefaultSender={handleSetDefaultSender}
          onDeleteSender={handleDeleteSender}
          onAddDomain={handleAddDomain}
          onUpdateCommerce={handleUpdateCommerce}
          onUpdateBranding={handleUpdateBranding}
          onUpdateOptIn={handleUpdateOptIn}
          onUpdateTerms={handleUpdateTerms}
          onUpdatePrivacy={handleUpdatePrivacy}
          onUpdatePlan={handleUpdatePlan}
          onUpdatePaypalEmail={handleUpdatePaypalEmail}
          onUpdateAffiliateCode={handleUpdateAffiliateCode}
          profiles={profiles}
          onImportTeamMembers={handleImportTeamMembers}
          onCreateProfile={handleCreateProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}

    </div>
  );
}
