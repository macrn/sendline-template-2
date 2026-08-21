export type MemberTab = 
  | 'account'
  | 'team'
  | 'access-profiles'
  | 'domain-mailboxes'
  | 'email-setup'
  | 'domain-setup'
  | 'commerce-setup'
  | 'branding'
  | 'opt-in'
  | 'data-privacy'
  | 'integrations'
  | 'plan-billing'
  | 'share-sendline'
  | 'get-help';

export type WorkspaceModuleId = 
  | 'dashboard' 
  | 'marketing' 
  | 'forms'
  | 'checkout'
  | 'my-templates' 
  | 'transactional' 
  | 'inbox' 
  | 'loyalty' 
  | 'admin';

export interface AccessProfileCapabilities {
  canSendLiveEmails: boolean;
  canExportData: boolean;
  canManageDomains: boolean;
  canManageAPIKeys: boolean;
  canManageTeam: boolean;
  canViewFinancials: boolean;
}

export interface AccessProfile {
  id: string;
  name: string; // e.g. "Campaign & Editorial Strategist"
  description: string;
  badgeColor: 'indigo' | 'rose' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'stone';
  isSystemDefault?: boolean;
  allowedModules: WorkspaceModuleId[];
  capabilities: AccessProfileCapabilities;
  memberCount?: number;
  createdAt: string;
}

export interface UserAccountDetails {
  email: string;
  fullName: string;
  handle: string; // e.g. famous-salad-94642
  customSubdomain: string; // famous-salad-94642.sendline.io
  timezone: string;
  calendarStartDay: 'Sunday' | 'Monday';
  mfaEnabled: boolean;
  avatarUrl?: string;
}

export interface DomainMailbox {
  id: string;
  email: string; // e.g. support@atelier-paris.com
  localPart: string; // e.g. support
  domain: string; // e.g. atelier-paris.com
  displayName: string; // e.g. "Customer Support"
  assignedMemberId?: string; // TeamMember id (e.g. tm-2) or empty for Workspace Leader/Unassigned
  assignedMemberName?: string;
  status: 'active' | 'suspended' | 'provisioning';
  createdAt: string;
  storageUsedMb: number;
  storageLimitMb: number;
  passwordLastUpdated: string;
  passwordHint?: string;
  isDefaultOutbound?: boolean;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string; // personal login email (e.g. sarah.jenkins@gmail.com)
  title?: string; // Job Title (e.g. "Senior Campaign Manager")
  dob?: string; // Date of Birth (e.g. "1994-06-15")
  location?: string; // e.g. "Paris, France" or "San Francisco, CA"
  phone?: string; // e.g. "+1 415-555-0142"
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer' | 'Inbox Agent' | string;
  profileId?: string; // Linked AccessProfile ID (e.g. "prof-marketing")
  profileName?: string; // Display name of profile
  status: 'Active' | 'Invited';
  avatar?: string;
  joinedAt: string;
  assignedMailboxId?: string;
  assignedMailboxEmail?: string;
  allowedModules: WorkspaceModuleId[];
  inviteToken?: string;
  inviteSentAt?: string;
  notes?: string;
}

export interface ActiveUserSession {
  userId: string;
  name: string;
  personalEmail: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer' | 'Inbox Agent' | string;
  profileId?: string;
  profileName?: string;
  isOwner: boolean;
  assignedMailboxId?: string;
  assignedMailboxEmail?: string;
  allowedModules: WorkspaceModuleId[];
}

export interface VerifiedSenderEmail {
  id: string;
  email: string;
  name: string;
  isDefault: boolean;
  status: 'verified' | 'pending' | 'failed';
  verifiedAt?: string;
}

export interface BrandSettings {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  neutralBgColor: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  companyAddress: {
    companyName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialLinks: {
    instagram?: string;
    pinterest?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface OptInSettings {
  doubleOptInEnabled: boolean;
  confirmationSubject: string;
  confirmationSenderName: string;
  confirmationButtonText: string;
  confirmationMessage: string;
  redirectUrl: string;
  reCaptchaEnabled: boolean;
  gdprConsentEnabled: boolean;
  gdprConsentText: string;
}

export interface LegalDocument {
  id: 'terms' | 'privacy';
  title: string;
  lastUpdated: string;
  content: string;
  isPublished: boolean;
}

export interface CommerceSettings {
  stripeConnected: boolean;
  stripeAccountId?: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  autoTaxEnabled: boolean;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  businessName: string;
}

export interface PlanBillingDetails {
  currentPlan: 'Lite' | 'Pro' | 'Everything';
  billingInterval: 'monthly' | 'annual';
  monthlyPrice: number;
  annualPrice: number;
  subscribersUsed: number;
  subscribersLimit: number;
  teamSeatsUsed: number;
  teamSeatsLimit: number;
  nextBillingDate: string;
  cardBrand: string;
  cardLast4: string;
  cardExp: string;
}

export interface ReferralDetails {
  affiliateCode: string;
  affiliateUrl: string;
  discountPercentage: number;
  rewardAmount: number;
  paypalEmail: string;
  totalEarnings: number;
  upcomingPayouts: number;
  conversionsCount: number;
  totalReferrals: number;
  currentlyInTrial: number;
  expiredTrials: number;
}

export interface UserFolder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface UserSavedEmail {
  id: string;
  title: string;
  folderId?: string; // or undefined for unorganized
  templateId: string;
  templateSnapshot: any; // complete EmailTemplate
  lastEditedText: string;
  lastEditedTimestamp: number;
  status: 'Draft' | 'Sent' | 'Scheduled';
  audienceLabel?: string;
  recipientCount?: number;
  openRate?: number;
  clickRate?: number;
}
