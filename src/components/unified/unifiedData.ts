import { BrandKit, UniversalTemplate, SubscriberSegment, WorkflowSimulationStep } from './unifiedTypes';

export const DEFAULT_BRAND_KITS: BrandKit[] = [
  {
    id: 'bk-studio-lane',
    name: 'Studio Lane (Minimal Dark)',
    logoText: 'SL',
    primaryColor: '#0f172a',
    secondaryColor: '#3b82f6',
    accentColor: '#6366f1',
    backgroundColor: '#090d16',
    canvasBackgroundColor: '#111827',
    cardBackgroundColor: '#1e293b',
    textColor: '#f8fafc',
    mutedTextColor: '#94a3b8',
    fontFamily: 'sans',
    borderRadius: 16
  },
  {
    id: 'bk-nordic-atelier',
    name: 'Nordic Atelier (Warm Editorial)',
    logoText: 'NA',
    primaryColor: '#1c1917',
    secondaryColor: '#b45309',
    accentColor: '#d97706',
    backgroundColor: '#faf8f5',
    canvasBackgroundColor: '#ffffff',
    cardBackgroundColor: '#f5f0eb',
    textColor: '#1c1917',
    mutedTextColor: '#78716c',
    fontFamily: 'serif',
    borderRadius: 12
  },
  {
    id: 'bk-maison-moderne',
    name: 'Maison Moderne (Onyx & Cream)',
    logoText: 'MM',
    primaryColor: '#000000',
    secondaryColor: '#10b981',
    accentColor: '#059669',
    backgroundColor: '#0a0a0a',
    canvasBackgroundColor: '#171717',
    cardBackgroundColor: '#262626',
    textColor: '#ffffff',
    mutedTextColor: '#a3a3a3',
    fontFamily: 'sans',
    borderRadius: 8
  }
];

export const UNIFIED_TEMPLATES: UniversalTemplate[] = [
  {
    id: 'tmpl-spring-launch',
    name: 'Spring launch',
    category: 'Launch',
    description: 'Minimalist editorial collection drop designed for high conversion across email campaigns, newsletter signups, and automated onboarding series.',
    brandKitId: 'bk-studio-lane',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    defaultSubject: 'The spring collection is here',
    defaultPreheader: 'Fresh pieces, small batches, and everything made to order this season.',
    createdAt: '2026-08-18',
    blocks: [
      {
        id: 'blk-logo-1',
        type: 'header',
        content: {
          badgeText: 'SL'
        },
        style: {
          align: 'center',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-title-1',
        type: 'text',
        content: {
          text: 'The spring collection is here',
          subtext: 'Join the list and be first to see every new piece.'
        },
        style: {
          align: 'center',
          fontSize: '2xl',
          fontWeight: 'extrabold',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-img-1',
        type: 'image',
        content: {
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
          imageAlt: 'Spring Collection Lookbook Preview'
        },
        style: {
          align: 'center',
          borderRadius: 12,
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-body-1',
        type: 'text',
        content: {
          text: 'Fresh pieces, small batches, and everything made to order this season.'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          fontWeight: 'normal',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-cta-1',
        type: 'button',
        content: {
          buttonText: 'Shop now',
          buttonUrl: 'https://example.com/spring-drop'
        },
        style: {
          align: 'center',
          fontWeight: 'bold',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false, // In form context, replaced by input field + subscribe slot
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-footer-1',
        type: 'footer',
        content: {
          footerText: 'Unsubscribe • Preferences • Studio Lane, Köln',
          addressText: 'Studio Lane, Köln, Germany',
          unsubscribeText: 'Unsubscribe'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          paddingY: 16
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false,
          allowInWorkflow: true,
          allowInCheckout: false
        }
      }
    ]
  },
  {
    id: 'tmpl-weekly-digest',
    name: 'Weekly digest',
    category: 'Newsletter',
    description: 'Clean typographic weekly roundup layout for editorial founders, thought leaders, and digital publishers.',
    brandKitId: 'bk-nordic-atelier',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    defaultSubject: 'Issue #42: Intentional Craft & Design Systems',
    defaultPreheader: 'Curated stories, typography notes, and product takeaways.',
    createdAt: '2026-08-15',
    blocks: [
      {
        id: 'blk-wd-logo',
        type: 'header',
        content: {
          badgeText: 'NA'
        },
        style: {
          align: 'center',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-wd-title',
        type: 'text',
        content: {
          text: 'Weekly Digest — Issue #42',
          subtext: 'Weekly curated thoughts on product aesthetics, minimalism, and architecture.'
        },
        style: {
          align: 'center',
          fontSize: '2xl',
          fontWeight: 'extrabold',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-wd-img',
        type: 'image',
        content: {
          imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
          imageAlt: 'Nordic Studio'
        },
        style: {
          align: 'center',
          borderRadius: 12,
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-wd-body',
        type: 'text',
        content: {
          text: 'Explore three profound shifts in how digital products are built when unified into a single document schema.'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-wd-cta',
        type: 'button',
        content: {
          buttonText: 'Read full issue →',
          buttonUrl: 'https://example.com/digest/42'
        },
        style: {
          align: 'center',
          fontWeight: 'bold',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-wd-footer',
        type: 'footer',
        content: {
          footerText: 'Sent from Nordic Atelier • Copenhagen, Denmark • Unsubscribe',
          addressText: 'Nordic Atelier, Copenhagen, Denmark',
          unsubscribeText: 'Unsubscribe'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          paddingY: 16
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false,
          allowInWorkflow: true,
          allowInCheckout: false
        }
      }
    ]
  },
  {
    id: 'tmpl-vip-invitation',
    name: 'VIP Private Invitation',
    category: 'VIP',
    description: 'High-contrast exclusive invitation layout with access pass tokens and automated sequence branch triggers.',
    brandKitId: 'bk-maison-moderne',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
    defaultSubject: 'Your Private Invitation to Maison Club',
    defaultPreheader: 'Early access reserved for selected members.',
    createdAt: '2026-08-10',
    blocks: [
      {
        id: 'blk-vip-logo',
        type: 'header',
        content: {
          badgeText: 'MM'
        },
        style: {
          align: 'center',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-vip-title',
        type: 'text',
        content: {
          text: 'Private Invitation',
          subtext: 'You have been invited to join our exclusive private capsule circle.'
        },
        style: {
          align: 'center',
          fontSize: '2xl',
          fontWeight: 'extrabold',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-vip-img',
        type: 'image',
        content: {
          imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
          imageAlt: 'VIP Invitation'
        },
        style: {
          align: 'center',
          borderRadius: 12,
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-vip-body',
        type: 'text',
        content: {
          text: 'Claim your member credentials and unlock limited edition releases before general release.'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          paddingY: 8
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: true,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-vip-cta',
        type: 'button',
        content: {
          buttonText: 'Claim Invitation Pass',
          buttonUrl: 'https://example.com/vip-claim'
        },
        style: {
          align: 'center',
          fontWeight: 'bold',
          paddingY: 12
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false,
          allowInWorkflow: true,
          allowInCheckout: true
        }
      },
      {
        id: 'blk-vip-footer',
        type: 'footer',
        content: {
          footerText: 'Maison Moderne • Private List • Unsubscribe',
          addressText: 'Maison Moderne, Paris, France',
          unsubscribeText: 'Unsubscribe'
        },
        style: {
          align: 'center',
          fontSize: 'sm',
          paddingY: 16
        },
        capabilities: {
          allowInEmail: true,
          allowInForm: false,
          allowInWorkflow: true,
          allowInCheckout: false
        }
      }
    ]
  }
];

export const DEFAULT_SEGMENTS: SubscriberSegment[] = [
  {
    id: 'seg-newsletter',
    name: 'Newsletter',
    count: 4210,
    description: 'Active subscribers who opted into editorial weekly letters',
    selected: true
  },
  {
    id: 'seg-customers',
    name: 'Customers',
    count: 1180,
    description: 'Purchased at least one product in the last 180 days',
    selected: false
  },
  {
    id: 'seg-vip',
    name: 'VIP list',
    count: 320,
    description: 'High-tier loyalty members and brand advocates',
    selected: false
  },
  {
    id: 'seg-waitlist',
    name: 'Spring Waitlist',
    count: 850,
    description: 'Captured via the Spring Launch Opt-in form',
    selected: false
  }
];

export const DEFAULT_WORKFLOW_STEPS: WorkflowSimulationStep[] = [
  {
    id: 'wf-step-trigger',
    stepType: 'trigger',
    title: 'Spring launch form submitted',
    subtitle: 'Triggered whenever a visitor submits the Spring Launch form',
    status: 'completed'
  },
  {
    id: 'wf-step-welcome',
    stepType: 'email',
    title: 'Welcome',
    subtitle: 'Sends immediately • Uses Spring launch template',
    templateRef: 'tmpl-spring-launch',
    emailSubject: 'Welcome to the Spring Collection VIP List',
    emailPreviewText: 'Your early access pass is confirmed. Here is what to expect...',
    status: 'completed'
  },
  {
    id: 'wf-step-delay',
    stepType: 'delay',
    title: 'Wait 2 days',
    delayHours: 48,
    delayLabel: 'Wait 2 days',
    subtitle: 'Worker evaluates wake_at timestamp',
    status: 'running'
  },
  {
    id: 'wf-step-condition',
    stepType: 'condition',
    title: 'Opened the welcome email?',
    conditionQuestion: 'Opened the welcome email?',
    yesBranchStepId: 'wf-step-yes-discount',
    noBranchStepId: 'wf-step-no-reminder',
    subtitle: 'Evaluates webhook open event before wake_at tick',
    status: 'idle'
  },
  {
    id: 'wf-step-yes-discount',
    stepType: 'email',
    title: 'Discount code',
    subtitle: 'Uses Spring launch template • 15% discount code voucher',
    templateRef: 'tmpl-spring-launch',
    emailSubject: 'Your 15% VIP Spring Discount Code: SPRING15',
    emailPreviewText: 'Because you opened our welcome note, enjoy 15% off your first capsule order.',
    status: 'idle'
  },
  {
    id: 'wf-step-no-reminder',
    stepType: 'email',
    title: 'Gentle reminder',
    subtitle: 'Uses Spring launch template • Curated capsule lookbook preview',
    templateRef: 'tmpl-spring-launch',
    emailSubject: 'Did you miss the spring collection lookbook?',
    emailPreviewText: 'A quick peek at our newest small-batch release before it sells out.',
    status: 'idle'
  },
  {
    id: 'wf-step-exit',
    stepType: 'exit',
    title: 'Exit workflow',
    subtitle: 'Subscriber finishes automation series and is tagged as Completed',
    status: 'idle'
  }
];
