export type DocumentContext = 'email' | 'form' | 'workflow' | 'checkout';

export type BlockType = 
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'form_slot'
  | 'spacer'
  | 'footer'
  | 'product_card'
  | 'condition_badge';

export interface UniversalBlock {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    subtext?: string;
    imageUrl?: string;
    imageAlt?: string;
    buttonText?: string;
    buttonUrl?: string;
    inputPlaceholder?: string;
    inputLabel?: string;
    price?: string;
    footerText?: string;
    addressText?: string;
    unsubscribeText?: string;
    badgeText?: string;
    height?: number; // for spacer
  };
  style?: {
    align?: 'left' | 'center' | 'right';
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    fontWeight?: 'normal' | 'medium' | 'bold' | 'extrabold';
    fontStyle?: 'normal' | 'italic';
    textColor?: string;
    backgroundColor?: string;
    borderRadius?: number;
    paddingY?: number;
    paddingX?: number;
  };
  // Context-specific capability flags
  capabilities?: {
    allowInEmail?: boolean;
    allowInForm?: boolean;
    allowInWorkflow?: boolean;
    allowInCheckout?: boolean;
  };
}

export interface BrandKit {
  id: string;
  name: string;
  logoText: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  canvasBackgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: 'serif' | 'sans' | 'mono';
  borderRadius: number;
}

export interface UniversalTemplate {
  id: string;
  name: string;
  category: 'Launch' | 'Newsletter' | 'VIP' | 'Promo' | 'Onboarding';
  description: string;
  brandKitId: string;
  thumbnailUrl: string;
  isCustom?: boolean;
  createdAt: string;
  blocks: UniversalBlock[];
  defaultSubject: string;
  defaultPreheader: string;
}

export interface ForkedDocument {
  id: string;
  templateId: string;
  templateName: string;
  context: DocumentContext;
  name: string;
  blocks: UniversalBlock[];
  brandKit: BrandKit;
  createdAt: string;
  metadata?: {
    subject?: string;
    preheader?: string;
    formSlug?: string;
    workflowTrigger?: string;
    price?: string;
  };
}

export interface SubscriberSegment {
  id: string;
  name: string;
  count: number;
  description: string;
  selected?: boolean;
}

export interface WorkflowSimulationStep {
  id: string;
  stepType: 'trigger' | 'email' | 'delay' | 'condition' | 'exit';
  title: string;
  subtitle?: string;
  templateRef?: string;
  delayHours?: number;
  delayLabel?: string;
  conditionQuestion?: string;
  yesBranchStepId?: string;
  noBranchStepId?: string;
  emailSubject?: string;
  emailPreviewText?: string;
  status?: 'idle' | 'running' | 'completed' | 'skipped';
}

export interface WorkflowEnrollment {
  id: string;
  subscriberEmail: string;
  currentStepId: string;
  enrolledAt: string;
  wakeAt?: string;
  status: 'active' | 'waiting' | 'completed';
  logs: string[];
}
