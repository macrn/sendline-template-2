import { 
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
} from '../types/member';
import { INITIAL_TEMPLATES } from './mockData';

export const INITIAL_PROFILES: AccessProfile[] = [
  {
    id: 'prof-admin',
    name: 'Executive & Workspace Admin',
    description: 'Full unconstrained privileges across all modules, domain DNS records, financial billing, API keys, and team roles.',
    badgeColor: 'indigo',
    isSystemDefault: true,
    allowedModules: ['dashboard', 'marketing', 'my-templates', 'transactional', 'inbox', 'loyalty', 'admin'],
    capabilities: {
      canSendLiveEmails: true,
      canExportData: true,
      canManageDomains: true,
      canManageAPIKeys: true,
      canManageTeam: true,
      canViewFinancials: true
    },
    memberCount: 1,
    createdAt: 'Jan 2026'
  },
  {
    id: 'prof-marketing',
    name: 'Campaign & Content Strategist',
    description: 'Design and schedule bespoke editorial emails, manage asset folders, run loyalty rewards, and review campaign metrics.',
    badgeColor: 'rose',
    isSystemDefault: true,
    allowedModules: ['dashboard', 'marketing', 'my-templates', 'loyalty'],
    capabilities: {
      canSendLiveEmails: true,
      canExportData: true,
      canManageDomains: false,
      canManageAPIKeys: false,
      canManageTeam: false,
      canViewFinancials: false
    },
    memberCount: 1,
    createdAt: 'Jan 2026'
  },
  {
    id: 'prof-support',
    name: 'Customer Concierge & Screener',
    description: 'Dedicated to screening unknown incoming senders, managing customer domain inboxes, and replying to customer inquiries.',
    badgeColor: 'emerald',
    isSystemDefault: true,
    allowedModules: ['inbox'],
    capabilities: {
      canSendLiveEmails: false,
      canExportData: true,
      canManageDomains: false,
      canManageAPIKeys: false,
      canManageTeam: false,
      canViewFinancials: false
    },
    memberCount: 2,
    createdAt: 'Feb 2026'
  },
  {
    id: 'prof-dev',
    name: 'Transactional API & Systems Engineer',
    description: 'Manage high-throughput SMTP credentials, test automated API payloads, monitor delivery telemetry, and configure DNS.',
    badgeColor: 'cyan',
    isSystemDefault: true,
    allowedModules: ['dashboard', 'transactional', 'admin'],
    capabilities: {
      canSendLiveEmails: true,
      canExportData: true,
      canManageDomains: true,
      canManageAPIKeys: true,
      canManageTeam: false,
      canViewFinancials: false
    },
    memberCount: 0,
    createdAt: 'Mar 2026'
  },
  {
    id: 'prof-compliance',
    name: 'Legal, Privacy & Compliance Auditor',
    description: 'Review opt-in consent configurations, inspect unsubscribe records, audit data privacy policies, and review transactional delivery logs.',
    badgeColor: 'amber',
    isSystemDefault: true,
    allowedModules: ['dashboard', 'transactional'],
    capabilities: {
      canSendLiveEmails: false,
      canExportData: true,
      canManageDomains: false,
      canManageAPIKeys: false,
      canManageTeam: false,
      canViewFinancials: false
    },
    memberCount: 0,
    createdAt: 'Apr 2026'
  }
];

export const INITIAL_ACCOUNT: UserAccountDetails = {
  email: 'mehmetarslan@yahoo.com',
  fullName: 'Mehmet Arslan',
  handle: 'famous-salad-94642',
  customSubdomain: 'famous-salad-94642.sendline.io',
  timezone: 'Central European Time (09:52 am)',
  calendarStartDay: 'Monday',
  mfaEnabled: false,
  avatarUrl: undefined
};

export const INITIAL_MAILBOXES: DomainMailbox[] = [
  {
    id: 'mbx-1',
    email: 'support@atelier-paris.com',
    localPart: 'support',
    domain: 'atelier-paris.com',
    displayName: 'Atelier Customer Care',
    assignedMemberId: 'team-2',
    assignedMemberName: 'Sarah Jenkins',
    status: 'active',
    createdAt: 'Feb 10, 2026',
    storageUsedMb: 1420,
    storageLimitMb: 10240, // 10 GB
    passwordLastUpdated: 'May 14, 2026',
    passwordHint: 'Updated by Sarah (8 chars+)',
    isDefaultOutbound: true,
    notes: 'Primary customer service inbox for returns & order inquiries.'
  },
  {
    id: 'mbx-2',
    email: 'sales@atelier-paris.com',
    localPart: 'sales',
    domain: 'atelier-paris.com',
    displayName: 'Atelier Sales & VIP',
    assignedMemberId: 'team-3',
    assignedMemberName: 'Alex Rivera',
    status: 'active',
    createdAt: 'Mar 01, 2026',
    storageUsedMb: 850,
    storageLimitMb: 25600, // 25 GB
    passwordLastUpdated: 'Jul 20, 2026',
    passwordHint: 'Created by Admin',
    isDefaultOutbound: false,
    notes: 'B2B wholesale and bespoke styling client correspondence.'
  },
  {
    id: 'mbx-3',
    email: 'mehmet@atelier-paris.com',
    localPart: 'mehmet',
    domain: 'atelier-paris.com',
    displayName: 'Mehmet Arslan (Founder)',
    assignedMemberId: 'team-1',
    assignedMemberName: 'Mehmet Arslan',
    status: 'active',
    createdAt: 'Jan 15, 2026',
    storageUsedMb: 3200,
    storageLimitMb: 51200, // 50 GB
    passwordLastUpdated: 'Jan 15, 2026',
    isDefaultOutbound: false,
    notes: 'Executive inbox for founder & leadership communications.'
  },
  {
    id: 'mbx-4',
    email: 'concierge@atelier-paris.com',
    localPart: 'concierge',
    domain: 'atelier-paris.com',
    displayName: 'Private Client Concierge',
    assignedMemberId: 'team-4',
    assignedMemberName: 'Elena Rostova (Pending Invite)',
    status: 'provisioning',
    createdAt: 'Aug 12, 2026',
    storageUsedMb: 0,
    storageLimitMb: 10240,
    passwordLastUpdated: 'Aug 12, 2026',
    notes: 'Reserved for newly invited customer concierge team member.'
  },
  {
    id: 'mbx-5',
    email: 'press@atelier-paris.com',
    localPart: 'press',
    domain: 'atelier-paris.com',
    displayName: 'Atelier Media & Press',
    assignedMemberId: undefined, // Unassigned / Leader direct login
    assignedMemberName: undefined,
    status: 'suspended',
    createdAt: 'Apr 04, 2026',
    storageUsedMb: 410,
    storageLimitMb: 10240,
    passwordLastUpdated: 'Apr 04, 2026',
    notes: 'Temporarily suspended pending SS27 runway show.'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Mehmet Arslan',
    email: 'mehmetarslan@yahoo.com',
    title: 'Founder & Managing Director',
    dob: '1989-11-24',
    location: 'Istanbul, Turkey',
    phone: '+90 532 555 0192',
    role: 'Owner',
    profileId: 'prof-admin',
    profileName: 'Executive & Workspace Admin',
    status: 'Active',
    joinedAt: 'Jan 2026',
    assignedMailboxId: 'mbx-3',
    assignedMailboxEmail: 'mehmet@atelier-paris.com',
    allowedModules: ['dashboard', 'marketing', 'my-templates', 'transactional', 'inbox', 'loyalty', 'admin'],
    notes: 'Primary account creator and billing signatory.'
  },
  {
    id: 'team-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    title: 'Senior Support & Experience Lead',
    dob: '1993-04-16',
    location: 'London, United Kingdom',
    phone: '+44 20 7946 0912',
    role: 'Inbox Agent',
    profileId: 'prof-support',
    profileName: 'Customer Concierge & Screener',
    status: 'Active',
    joinedAt: 'Feb 2026',
    assignedMailboxId: 'mbx-1',
    assignedMailboxEmail: 'support@atelier-paris.com',
    allowedModules: ['inbox'],
    notes: 'Handles high-priority client triage and VIP inquiries.'
  },
  {
    id: 'team-3',
    name: 'Alex Rivera',
    email: 'alex.design@studiocraft.co',
    title: 'Lead Visual Designer & Copywriter',
    dob: '1995-09-08',
    location: 'San Francisco, CA, USA',
    phone: '+1 415 555 0147',
    role: 'Editor',
    profileId: 'prof-marketing',
    profileName: 'Campaign & Content Strategist',
    status: 'Active',
    joinedAt: 'Mar 2026',
    assignedMailboxId: 'mbx-2',
    assignedMailboxEmail: 'sales@atelier-paris.com',
    allowedModules: ['dashboard', 'marketing', 'my-templates', 'loyalty'],
    notes: 'Designs seasonal editorial releases and promotional drip series.'
  },
  {
    id: 'team-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    title: 'Client Concierge Associate',
    dob: '1996-02-19',
    location: 'Paris, France',
    phone: '+33 1 42 68 55 00',
    role: 'Inbox Agent',
    profileId: 'prof-support',
    profileName: 'Customer Concierge & Screener',
    status: 'Invited',
    joinedAt: 'Aug 2026',
    assignedMailboxId: 'mbx-4',
    assignedMailboxEmail: 'concierge@atelier-paris.com',
    allowedModules: ['inbox'],
    inviteToken: 'inv_elena_concierge_9481',
    inviteSentAt: '2 days ago',
    notes: 'Awaiting onboarding completion for European customer relations.'
  }
];

export const INITIAL_ACTIVE_SESSION: ActiveUserSession = {
  userId: 'team-1',
  name: 'Mehmet Arslan',
  personalEmail: 'mehmetarslan@yahoo.com',
  role: 'Owner',
  isOwner: true,
  assignedMailboxId: 'mbx-3',
  assignedMailboxEmail: 'mehmet@atelier-paris.com',
  allowedModules: ['dashboard', 'marketing', 'my-templates', 'transactional', 'inbox', 'loyalty', 'admin']
};

export const INITIAL_SENDERS: VerifiedSenderEmail[] = [
  {
    id: 'snd-1',
    email: 'mehmetarslan@yahoo.com',
    name: 'Mehmet Arslan',
    isDefault: true,
    status: 'verified',
    verifiedAt: '2026-01-12'
  },
  {
    id: 'snd-2',
    email: 'hello@sendline.io',
    name: 'Sendline Editorial',
    isDefault: false,
    status: 'verified',
    verifiedAt: '2026-03-04'
  },
  {
    id: 'snd-3',
    email: 'orders@nordicapparel.com',
    name: 'Nordic Apparel Studio',
    isDefault: false,
    status: 'pending'
  }
];

export const INITIAL_BRAND: BrandSettings = {
  brandName: 'Atelier Arslan',
  primaryColor: '#1C1917',
  secondaryColor: '#E8D284',
  accentColor: '#E11D48',
  neutralBgColor: '#FAF8F5',
  headingFont: 'Serif (Playfair Display)',
  bodyFont: 'Sans (Plus Jakarta Sans)',
  accentFont: 'Script (Pinyon Hand)',
  companyAddress: {
    companyName: 'Atelier Arslan Creative GmbH',
    streetAddress: 'Friedrichstraße 42',
    city: 'Berlin',
    state: 'Berlin',
    zipCode: '10117',
    country: 'Germany'
  },
  socialLinks: {
    instagram: 'https://instagram.com/atelierarslan',
    pinterest: 'https://pinterest.com/atelierarslan',
    twitter: 'https://x.com/atelierarslan',
    tiktok: 'https://tiktok.com/@atelierarslan',
    youtube: 'https://youtube.com/@atelierarslan',
    linkedin: 'https://linkedin.com/company/atelierarslan'
  }
};

export const INITIAL_OPT_IN: OptInSettings = {
  doubleOptInEnabled: true,
  confirmationSubject: 'Please confirm your subscription to Atelier Arslan',
  confirmationSenderName: 'Mehmet from Atelier Arslan',
  confirmationButtonText: 'Yes, Confirm My Subscription',
  confirmationMessage: 'Thank you for joining our private circle. To make sure we have the right email, please confirm your address by clicking the button below.',
  redirectUrl: 'https://sendline.io/confirmed-welcome',
  reCaptchaEnabled: true,
  gdprConsentEnabled: true,
  gdprConsentText: 'I agree to receive curated weekly newsletters and product announcements. I understand I can unsubscribe anytime.'
};

export const INITIAL_TERMS: LegalDocument = {
  id: 'terms',
  title: 'Terms & Conditions',
  lastUpdated: 'August 14, 2026',
  isPublished: true,
  content: `### Terms and Conditions of Sale & Membership

Welcome to Atelier Arslan. By subscribing to our dispatches or purchasing goods through our checkout portals, you agree to comply with and be bound by the following terms.

1. **Digital Deliverables and Access**
All digital blueprints, design templates, and subscription benefits are delivered electronically immediately upon completed transaction.

2. **Refund Policy**
Because digital products are immediately accessible upon purchase, refunds are provided only in cases of verified technical delivery failure within 14 calendar days of order placement.

3. **Intellectual Property**
All editorial templates, photography presets, styling typography, and source code are protected under international copyright law. Reproduction for resale without an explicit commercial redistribution license is prohibited.

4. **Service Level Agreement**
Sendline infrastructure commits to 99.9% uptime for email dispatch servers and webhook processing pipelines.

5. **Contact and Governing Law**
These terms are governed by the laws of Germany. For questions regarding your purchase, please contact **support@atelierarslan.com**.`
};

export const INITIAL_PRIVACY: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy',
  lastUpdated: 'August 14, 2026',
  isPublished: true,
  content: `### Privacy & Data Protection Notice

Your privacy is paramount. This policy outlines how Sendline and Atelier Arslan collect, process, and safeguard your personal information in strict compliance with the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).

1. **Data We Collect**
- **Subscriber Information**: Email address, first and last name, subscription preferences, and verification timestamps.
- **Transactional Data**: Purchase amounts, billing country, tax region, and last 4 digits of payment cards (processed securely via Stripe).
- **Engagement Telemetry**: Email open events, click rates, and browser user-agent tokens strictly used for delivering deliverability analytics.

2. **How We Use Your Data**
We use your data exclusively to deliver your requested email subscriptions, process orders, detect fraudulent activity, and comply with anti-spam legislation (CAN-SPAM Act).

3. **Data Retention & Right to be Forgotten**
You may at any time request the complete export or deletion of your subscriber record by clicking the "Manage Preferences / Unsubscribe" link in any email footer or contacting **privacy@atelierarslan.com**.

4. **Third-Party Processors**
We do not sell, rent, or monetize your personal information. We partner only with SOC-2 certified infrastructure providers including Stripe, AWS EU-Central, and Cloudflare DNS.`
};

export const INITIAL_COMMERCE: CommerceSettings = {
  stripeConnected: true,
  stripeAccountId: 'acct_1N9vK289ArslanStripe',
  currency: 'USD',
  autoTaxEnabled: true,
  payoutSchedule: 'daily',
  businessName: 'Atelier Arslan'
};

export const INITIAL_BILLING: PlanBillingDetails = {
  currentPlan: 'Everything',
  billingInterval: 'annual',
  monthlyPrice: 49,
  annualPrice: 45,
  subscribersUsed: 12450,
  subscribersLimit: 25000,
  teamSeatsUsed: 2,
  teamSeatsLimit: 3,
  nextBillingDate: 'November 18, 2026',
  cardBrand: 'Visa',
  cardLast4: '4242',
  cardExp: '12/28'
};

export const INITIAL_REFERRAL: ReferralDetails = {
  affiliateCode: 'CJO6F9R',
  affiliateUrl: 'https://sendline.io/c/CJO6F9R',
  discountPercentage: 25,
  rewardAmount: 15,
  paypalEmail: 'mehmetarslan@yahoo.com',
  totalEarnings: 0,
  upcomingPayouts: 0,
  conversionsCount: 0,
  totalReferrals: 0,
  currentlyInTrial: 0,
  expiredTrials: 0
};

export const INITIAL_FOLDERS: UserFolder[] = [
  { id: 'fld-all', name: 'All emails', createdAt: '2026-01-01' },
  { id: 'fld-promos', name: 'Promotions & Sales', color: '#EC4899', createdAt: '2026-02-10' },
  { id: 'fld-welcome', name: 'Welcome Series', color: '#6366F1', createdAt: '2026-03-01' },
  { id: 'fld-newsletters', name: 'VIP Newsletters', color: '#10B981', createdAt: '2026-04-15' },
  { id: 'fld-launches', name: 'Autumn 2026 Drop', color: '#F59E0B', createdAt: '2026-07-20' }
];

export const INITIAL_SAVED_EMAILS: UserSavedEmail[] = [
  {
    id: 'user-mail-1',
    title: 'Multi-service sale',
    folderId: 'fld-promos',
    templateId: 'tmpl-multi-service-sale',
    templateSnapshot: INITIAL_TEMPLATES[0],
    lastEditedText: 'Draft last edited 7 minutes ago',
    lastEditedTimestamp: Date.now() - 7 * 60 * 1000,
    status: 'Draft',
    audienceLabel: 'All Subscribers (12.4k)'
  },
  {
    id: 'user-mail-2',
    title: 'Simple countdown timer sale',
    folderId: 'fld-promos',
    templateId: 'tmpl-multi-service-sale',
    templateSnapshot: {
      ...INITIAL_TEMPLATES[0],
      headline: 'FLASH SALE ENDS SOON',
      tickerText: 'ONLY 4 HOURS LEFT ✨ 25% OFF',
      paletteTheme: 'terracotta'
    },
    lastEditedText: 'Draft last edited 2 months ago',
    lastEditedTimestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    status: 'Draft',
    audienceLabel: 'VIP Customers (3.2k)'
  },
  {
    id: 'user-mail-3',
    title: 'Bold sale announcement',
    folderId: 'fld-promos',
    templateId: 'tmpl-multi-service-sale',
    templateSnapshot: {
      ...INITIAL_TEMPLATES[0],
      headline: 'SUMMER ARCHIVE SALE',
      paletteTheme: 'sunflower'
    },
    lastEditedText: 'Draft last edited 2 months ago',
    lastEditedTimestamp: Date.now() - 62 * 24 * 60 * 60 * 1000,
    status: 'Draft',
    audienceLabel: 'Newsletter Readers (8.5k)'
  },
  {
    id: 'user-mail-4',
    title: 'Issue #12 Botanical Harvest',
    folderId: 'fld-newsletters',
    templateId: 'tmpl-cook-nature',
    templateSnapshot: INITIAL_TEMPLATES[1],
    lastEditedText: 'Sent to 14,280 subscribers',
    lastEditedTimestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    status: 'Sent',
    audienceLabel: 'Newsletter Tier (14.2k)',
    recipientCount: 14280,
    openRate: 58.4,
    clickRate: 18.2
  },
  {
    id: 'user-mail-5',
    title: 'Maison Botanique Reviews & Social Proof',
    folderId: 'fld-welcome',
    templateId: 'tmpl-client-reviews',
    templateSnapshot: INITIAL_TEMPLATES[2],
    lastEditedText: 'Sent to 8,920 subscribers',
    lastEditedTimestamp: Date.now() - 28 * 24 * 60 * 60 * 1000,
    status: 'Sent',
    audienceLabel: 'New Subscribers Flow (8.9k)',
    recipientCount: 8920,
    openRate: 64.1,
    clickRate: 22.8
  }
];
