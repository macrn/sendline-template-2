export type AppView = 
  | 'landing'
  | 'dashboard'
  | 'unified-studio'
  | 'marketing'
  | 'workflows'
  | 'workflow-studio'
  | 'audience'
  | 'forms'
  | 'checkout'
  | 'my-templates'
  | 'template-editor'
  | 'flodesk-templates'
  | 'transactional'
  | 'inbox'
  | 'loyalty'
  | 'admin'
  | 'standalone-mailbox'
  | 'public-form-preview'
  | 'public-checkout-preview';

export type Region = 'US-Global' | 'EU-Central' | 'APAC';

export type EmailFrameShape = 'scalloped' | 'arch' | 'rounded' | 'pill' | 'square' | 'polaroid';
export type EmailFontFamily = 'serif' | 'sans' | 'mono' | 'display-slab' | 'script-hand';
export type EmailPalette = 'sunflower' | 'lavender' | 'olive' | 'terracotta' | 'sand' | 'obsidian';

export type EmailBlockType = 
  | 'layout'
  | 'image'
  | 'two-images'
  | 'logo'
  | 'video'
  | 'instagram'
  | 'text'
  | 'linkbar'
  | 'button'
  | 'form-field'
  | 'form-survey'
  | 'divider'
  | 'spacer'
  | 'social'
  | 'footer'
  | 'address'
  | 'countdown'
  | 'ecommerce'
  | 'poll'
  | 'favorites';

export type EmailLayoutPreset = 
  | 'coaching-circle'
  | 'split-circle-right'
  | 'split-circle-left'
  | 'split-square-left'
  | 'split-square-right'
  | 'tips-numbered'
  | 'side-by-side'
  | 'two-images-grid'
  | 'stacked-discount'
  | 'welcome-hero'
  | 'gift-thanks'
  | 'magazine-quote'
  | 'product-card';

export interface EmailSection {
  id: string;
  type: EmailBlockType;
  layoutVariant?: EmailLayoutPreset;
  
  // Content fields
  title?: string;
  subtitle?: string;
  pretitle?: string;
  body?: string;
  numberPrefix?: string; // e.g. "6" or "01"
  originalPrice?: string; // e.g. "$1220" or "$760"
  discountPrice?: string; // e.g. "$915" or "$570"
  authorQuote?: string;
  authorName?: string;
  
  // Media fields
  imageUrl?: string;
  imageAlt?: string;
  imageShape?: 'square' | 'circle' | 'rounded' | 'arch' | 'polaroid';
  imageWidth?: number; // e.g. 100% or 600px width slider
  imagePosition?: 'center' | 'left' | 'right' | 'split-left' | 'split-right';
  imagePlaceholderBg?: string;
  imageRadius?: number; // Corner radius applied directly to the image
  
  // Two Images Grid Fields
  imageUrl2?: string;
  imageAlt2?: string;
  imageTitle1?: string;
  imageTitle2?: string;
  imageSubtitle1?: string;
  imageSubtitle2?: string;
  imageLink1?: string;
  imageLink2?: string;
  gap?: number; // Gap between columns in px (8, 12, 16, 24)
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  
  videoUrl?: string;
  videoThumbnailUrl?: string;
  instagramHandle?: string;
  instagramPhotos?: string[];
  
  // Brand Logo / Monogram
  monogramText?: string;
  logoUrl?: string;
  logoSubtitle?: string;
  
  // Button & Links
  ctaText?: string;
  ctaUrl?: string;
  buttonShape?: 'pill' | 'rounded' | 'sharp' | 'outline' | 'underline';
  buttonBg?: string;
  buttonColor?: string;
  buttonWidth?: 'auto' | 'full' | 'wide';
  navLinks?: Array<{ label: string; url: string }>;
  
  // Interactive In-Email Form & Survey Fields
  formFieldType?: 'text' | 'email' | 'first_name' | 'last_name' | 'phone' | 'dropdown' | 'rating' | 'textarea' | 'checkbox';
  formFieldLabel?: string;
  formFieldPlaceholder?: string;
  formFieldRequired?: boolean;
  formFieldOptions?: string[];
  formSubmitButtonText?: string;
  formSuccessMessage?: string;
  formDestinationUrl?: string;
  formConnectedList?: string;

  // Divider & Spacer
  dividerStyle?: 'solid' | 'dashed' | 'dotted' | 'ornament' | 'double';
  spacerHeight?: number; // in pixels, e.g. 24
  
  // Countdown
  countdownTarget?: string;
  countdownLabel?: string;
  
  // Social & E-commerce & Poll
  socialPlatforms?: Array<{ platform: 'instagram' | 'pinterest' | 'tiktok' | 'twitter' | 'youtube' | 'facebook' | 'email'; url: string }>;
  pollQuestion?: string;
  pollOptions?: Array<{ label: string; votes?: number }>;
  addressLines?: string[];
  footerNote?: string;
  
  // Styling & Customization
  fontFamily?: EmailFontFamily;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  bgColor?: string;
  paddingY?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderRadius?: number;
  contentRadius?: number;
  hasBorder?: boolean;
  borderColor?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Editorial' | 'E-commerce' | 'Product Launch' | 'Newsletter' | 'VIP Rewards' | 'Welcome Flow';
  thumbnailColor: string;
  subject: string;
  preheader: string;
  headline: string;
  body: string;
  description?: string;
  notes?: string;
  bestFor?: string;
  industry?: string;
  tickerText?: string;
  includedBlocks?: string[];
  accentColor: string;
  fontFamily: EmailFontFamily | 'serif' | 'sans' | 'mono';
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  ctaText: string;
  ctaUrl: string;
  buttonShape?: 'pill' | 'rounded' | 'sharp' | 'outline';
  buttonWidth?: 'auto' | 'full' | 'wide';
  badgeText?: string;
  scriptOverlay?: string;
  monogram?: string;
  ratingStars?: number;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  imageUrl?: string;
  frameShape?: EmailFrameShape;
  paletteTheme?: EmailPalette;
  couponCode?: string;
  couponDiscount?: string;
  hasLoyaltyBlock?: boolean;
  authorSignature?: string;
  authorTitle?: string;
  customOuterBg?: string;
  customCardBg?: string;
  customTextColor?: string;
  customBtnBg?: string;
  customBtnText?: string;
  lineHeight?: number;
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'widest';
  showMonogram?: boolean;
  showScriptOverlay?: boolean;
  showBadge?: boolean;
  showTestimonial?: boolean;
  showCoupon?: boolean;
  showImage?: boolean;
  showSignature?: boolean;
  showSocialLinks?: boolean;
  footerNote?: string;
  sections?: EmailSection[];
  
  // Canvas / Template Container Properties
  canvasRadius?: number; // In px, e.g. 0, 8, 16, 24, 32, 48
  canvasWidth?: number; // In px, e.g. 600
  canvasShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  canvasBorder?: boolean;
  canvasBorderWidth?: number;
  canvasBorderColor?: string;
}

export interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: 'Sent' | 'Scheduled' | 'Draft' | 'Sending';
  sentCount: number;
  openRate: number;
  clickRate: number;
  revenueGenerated?: string;
  date: string;
  audience: string;
  templateId: string;
}

export interface SubscriberContact {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  location?: string; // e.g. "Paris, France" or "San Francisco, CA"
  dob?: string; // Date of birth (e.g. "1994-06-15")
  phone?: string; // e.g. "+1 415-555-0142"
  gender?: string;
  status: 'Active' | 'VIP' | 'Unsubscribed' | 'Bounced';
  tags: string[];
  openRate: number;
  clickRate: number;
  ordersCount: number;
  totalSpent: string;
  joinedAt: string;
  lastActive: string;
  source: string;
  avatar?: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  filterRules: string[];
  subscriberCount: number;
  averageOpenRate: number;
  growthRate: string;
  color: string;
  isDynamic: boolean;
  createdAt: string;
}

export interface TransactionalLog {
  id: string;
  recipient: string;
  event: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'queued' | 'blocked';
  template: string;
  subject?: string;
  sender?: string;
  tag?: string;
  messageId?: string;
  latencyMs: number;
  region: string;
  timestamp: string;
  ipPool: string;
  smtpResponse: string;
  tlsVersion?: string;
  openedAt?: string;
  clickedUrl?: string;
  errorReason?: string;
  userAgent?: string;
}

export interface TransactionalTemplate {
  id: string;
  name: string;
  tag: string;
  subject: string;
  sender: string;
  status: 'active' | 'draft' | 'inactive';
  lastModified: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  htmlBody: string;
  variables: string[];
}

export interface TransactionalWebhook {
  id: string;
  name: string;
  url: string;
  events: ('delivered' | 'opened' | 'clicked' | 'bounced' | 'blocked' | 'complaint')[];
  status: 'active' | 'inactive';
  createdAt: string;
  lastFired: string;
  secretKey: string;
}

export interface BlockedContact {
  id: string;
  email: string;
  reason: 'hard_bounce' | 'spam_complaint' | 'manual_block' | 'unsubscribed' | 'isp_limit';
  blockedAt: string;
  smtpDetails: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string;
  created: string;
  lastUsed: string;
  environment: 'production' | 'staging';
  rateLimit: string;
}

export type MailboxCategory = 'imbox' | 'feed' | 'papertrail' | 'screener' | 'sent' | 'all';

export interface ScreenerItem {
  id: string;
  senderName: string;
  senderEmail: string;
  avatar: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  status: 'pending' | 'screened_in' | 'screened_out';
}

export interface InboxEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  category: 'imbox' | 'feed' | 'papertrail';
  isRead: boolean;
  isStarred?: boolean;
  hasAttachment?: boolean;
  hasAttachments?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  }>;
  tags?: string[];
  labels?: string[];
  hasNotification?: boolean;
  loyaltyEarned?: number;
  replyLater?: boolean;
  setAside?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  clipNotes?: Array<{ id: string; text: string; createdAt: string }>;
  spyTrackers?: Array<{ name: string; domain: string }>;
  paperTrailMeta?: {
    amount?: string;
    merchant?: string;
    orderNumber?: string;
    category?: 'Receipt' | 'Invoice' | 'Shipping' | 'Alert';
    status?: string;
    pdfUrl?: string;
  };
  feedMeta?: {
    publicationName?: string;
    readingTime?: string;
    coverImage?: string;
    issueNumber?: string;
    summary?: string;
  };
  threadMessages?: Array<{
    id: string;
    senderName: string;
    senderEmail: string;
    avatar: string;
    body: string;
    receivedAt: string;
    isOutbound?: boolean;
  }>;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  perks: string[];
  badgeColor: string;
  memberCount: number;
  discountRate: string;
}

export interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: string;
  referrals: number;
  lastActive: string;
  lifetimeValue: string;
}

export interface CouponReward {
  id: string;
  code: string;
  discount: string;
  pointsCost: number;
  expiresIn: string;
  claimedCount: number;
  active: boolean;
}

export interface DomainRecord {
  id?: string;
  domain: string;
  status: 'verified' | 'pending' | 'failed';
  spf?: boolean;
  dkim?: boolean;
  dmarc?: boolean;
  bimi?: boolean;
  spfStatus?: string;
  dkimStatus?: string;
  dmarcStatus?: string;
  bimiStatus?: string;
  region: string;
  created?: string;
  createdAt?: string;
  monthlyVolume?: number;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'file'
  | 'date';

export interface FormFieldConfig {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for dropdown
  helpText?: string;
  mapToField?: string;
  isCustom?: boolean;
  customDataKey?: string;
}

export type FormLayoutType = 
  | 'link_in_bio' 
  | 'popup' 
  | 'inline' 
  | 'full_page' 
  | 'video' 
  | 'spinner' 
  | 'countdown';

export interface FormLinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
  badge?: string;
  clicks?: number;
  highlighted?: boolean;
}

export interface FormItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Contact' | 'Lead Capture' | 'Waitlist' | 'Feedback' | 'Application' | 'Registration' | 'Link in Bio' | 'Newsletter' | 'Freebie';
  formType?: FormLayoutType;
  status: 'Published' | 'Draft' | 'Archived';
  fields: FormFieldConfig[];
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  targetTag: string; // e.g., "Contact-Form-Lead" to tag subscribers
  targetSegment?: string;
  targetSegments?: string[]; // Mandatory selected segments
  headerLogoUrl?: string;
  accentColor: string;
  fontFamily: EmailFontFamily | 'sans' | 'serif' | 'mono' | 'display-slab' | 'script-hand';
  buttonShape: 'pill' | 'rounded' | 'sharp' | 'outline';
  viewsCount: number;
  submissionsCount: number;
  conversionRate: number;
  createdAt: string;
  isStandaloneHosted: boolean;
  hostedPermaUrl: string;

  // Visual & Content Extensions (Flodesk-style)
  headline?: string;
  subtitle?: string;
  bodyText?: string;
  badgeText?: string;
  scriptOverlay?: string;
  monogram?: string;
  imageUrl?: string;
  videoUrl?: string;
  frameShape?: EmailFrameShape;
  paletteTheme?: EmailPalette;
  bgColor?: string;
  cardBgColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  canvasRadius?: number;
  canvasShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showMonogram?: boolean;
  showScriptOverlay?: boolean;
  showImage?: boolean;

  // Field Block Styling (Flodesk-style Form Field configuration)
  fieldStyle?: 'filled_sharp' | 'filled_rounded' | 'filled_pill' | 'filled_oval' | 'transparent' | 'outlined_sharp' | 'outlined_rounded' | 'outlined_pill' | 'outlined_oval' | 'underline';
  fieldBorderColor?: string;
  fieldBorderWidth?: number;
  fieldBgColor?: string;
  fieldTextColor?: string;
  fieldFontFamily?: string;
  fieldFontWeight?: string;
  fieldFontSize?: number;
  fieldTextAlign?: 'left' | 'center' | 'right';
  fieldTextCase?: 'normal' | 'uppercase';
  fieldSpacing?: number;
  fieldPaddingY?: number;
  fieldLetterSpacing?: number;
  
  // Link in bio items
  links?: FormLinkItem[];
  socialLinks?: Array<{ platform: 'instagram' | 'pinterest' | 'tiktok' | 'twitter' | 'youtube' | 'facebook' | 'linkedin' | 'spotify'; url: string }>;

  // Thank You Page Customization
  thankYouHeadline?: string;
  thankYouMessage?: string;
  thankYouActionType?: 'message' | 'download' | 'redirect';
  thankYouDownloadUrl?: string;
  thankYouDownloadButtonText?: string;
  thankYouRedirectUrl?: string;

  // Specialized Blocks & Layout Options
  layoutMode?: 'single' | 'split_right' | 'split_left'; // 1-column or 2-column split (image right / image left)
  showCountdown?: boolean;
  countdownTarget?: string;
  countdownDays?: number;
  countdownHours?: number;
  countdownMinutes?: number;
  countdownSeconds?: number;
  countdownLabelStyle?: 'classic' | 'boxes' | 'minimal' | 'serif_dividers';
  countdownPosition?: 'before_fields' | 'after_fields' | 'top';
  showTestimonial?: boolean;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  showBulletPoints?: boolean;
  bulletPoints?: string[];
  bulletPosition?: 'before_fields' | 'after_fields';
  showPrivacyNote?: boolean;
  privacyNoteText?: string;
  spinnerPrizes?: Array<{ label: string; code: string; probability: number }>;

  // Settings & Behavior
  doubleOptIn?: boolean;
  notifyOnSubmission?: boolean;
  notificationEmail?: string;
  enableCaptcha?: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  submittedAt: string;
  data: Record<string, any>;
  contactEmail: string;
  contactName?: string;
  status: 'New' | 'Processed' | 'Spam';
}

export interface CheckoutProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in dollars
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  pricingType: 'one_time' | 'recurring_monthly' | 'recurring_annual';
  category: 'Digital Product' | 'Service / Consultation' | 'Membership' | 'Course' | 'Physical Good';
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl: string;
  accentColor: string;
  buttonText: string;
  successRedirectUrl?: string;
  features: string[];
  totalSalesCount: number;
  totalRevenue: number;
  hostedPayLinkUrl: string;
  allowCouponCodes: boolean;
  requireBillingAddress: boolean;
  requirePhone: boolean;
  createdAt: string;
}

export interface CheckoutOrder {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Refunded' | 'Failed';
  stripePaymentIntentId: string;
  createdAt: string;
}

export type WorkflowTriggerType = 
  | 'form_submission'
  | 'segment_added'
  | 'tag_added'
  | 'checkout_purchase'
  | 'loyalty_tier_reached'
  | 'api_webhook';

export type WorkflowNodeType = 
  | 'trigger'
  | 'email'
  | 'delay'
  | 'condition'
  | 'action';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description?: string;
  triggerConfig?: {
    triggerType: WorkflowTriggerType;
    targetId?: string;
    targetName?: string;
    filterConditions?: string;
  };
  emailConfig?: {
    templateId?: string;
    subject: string;
    previewText?: string;
    senderName?: string;
    senderEmail?: string;
    thumbnailUrl?: string;
    accentColor?: string;
    layoutHeadline?: string;
    layoutSubhead?: string;
    buttonText?: string;
    buttonUrl?: string;
    templateSnapshot?: EmailTemplate;
    customSections?: EmailSection[];
  };
  delayConfig?: {
    delayType: 'relative' | 'time_of_day' | 'day_of_week';
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
    timeOfDay?: string;
    dayOfWeek?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    respectRecipientTimezone?: boolean;
  };
  conditionConfig?: {
    conditionType: 'opened_email' | 'clicked_link' | 'in_segment' | 'has_tag' | 'purchased_product' | 'loyalty_points_above';
    targetStepId?: string;
    linkUrl?: string;
    segmentName?: string;
    tagName?: string;
    productName?: string;
    thresholdNumber?: number;
    timeframeDays?: number;
  };
  actionConfig?: {
    actionType: 'add_to_segment' | 'remove_from_segment' | 'add_tag' | 'remove_tag' | 'award_loyalty_points' | 'issue_coupon' | 'webhook_notification';
    segmentName?: string;
    tagName?: string;
    pointsValue?: number;
    couponDiscount?: string;
    webhookUrl?: string;
    note?: string;
  };
  stats?: {
    enrolledCount: number;
    completedCount: number;
    openRate?: number;
    clickRate?: number;
    dropOffRate?: number;
  };
  yesBranch?: WorkflowNode[];
  noBranch?: WorkflowNode[];
  nextNodes?: WorkflowNode[];
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  category: 'Welcome Series' | 'Lead Magnet Delivery' | 'Post-Purchase' | 'Abandonment Recovery' | 'Loyalty & Rewards' | 'Re-Engagement' | 'Custom';
  rootTriggerNode: WorkflowNode;
  totalEnrolled: number;
  totalCompleted: number;
  avgOpenRate: number;
  avgClickRate: number;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export * from './member';
