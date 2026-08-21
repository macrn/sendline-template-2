import { WorkflowItem, WorkflowNode } from '../types';

export const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-welcome-lead-magnet',
    title: 'Welcome Series & Digital Lookbook Delivery',
    description: 'Instantly delivers free PDF guide to new subscribers, nurtures with brand story, and conditionally follows up based on open engagement.',
    status: 'active',
    category: 'Welcome Series',
    totalEnrolled: 14820,
    totalCompleted: 13910,
    avgOpenRate: 68.4,
    avgClickRate: 24.2,
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-08-10T14:30:00Z',
    rootTriggerNode: {
      id: 'node-trigger-1',
      type: 'trigger',
      title: 'Form Submitted',
      description: 'Subscriber completes the Summer Capsule Waitlist form',
      triggerConfig: {
        triggerType: 'form_submission',
        targetId: 'form-lookbook-2026',
        targetName: 'Summer Capsule Lookbook Waitlist (Full Page)',
        filterConditions: 'Any submission'
      },
      stats: {
        enrolledCount: 14820,
        completedCount: 14820
      },
      nextNodes: [
        {
          id: 'node-action-tag-1',
          type: 'action',
          title: 'Add to Segment & Apply Tag',
          description: 'Organize new lead into VIP New Leads segment',
          actionConfig: {
            actionType: 'add_to_segment',
            segmentName: 'Summer 2026 Leads',
            tagName: 'Lead-Magnet-Claimed',
            note: 'Added automatically on form completion'
          },
          stats: {
            enrolledCount: 14820,
            completedCount: 14820
          },
          nextNodes: [
            {
              id: 'node-email-1',
              type: 'email',
              title: 'Email #1: Instant Lead Magnet Delivery',
              description: 'Editorial visual newsletter with PDF download link',
              emailConfig: {
                subject: 'Your Summer Lookbook is inside ✨ (Instant Download)',
                previewText: 'Download the complete 42-page editorial guide to effortless Parisian style.',
                senderName: 'Elena from Sendline Studio',
                senderEmail: 'elena@sendline.io',
                layoutHeadline: 'Effortless Summer 2026',
                layoutSubhead: 'Curated silhouettes, organic linens, and editorial palettes.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
                accentColor: '#D97706',
                buttonText: 'Download Lookbook PDF',
                buttonUrl: 'https://sendline.io/downloads/summer-lookbook.pdf'
              },
              stats: {
                enrolledCount: 14820,
                completedCount: 14820,
                openRate: 74.2,
                clickRate: 38.5,
                dropOffRate: 0.8
              },
              nextNodes: [
                {
                  id: 'node-delay-1',
                  type: 'delay',
                  title: 'Wait 2 Days',
                  description: 'Give subscriber time to explore the lookbook',
                  delayConfig: {
                    delayType: 'relative',
                    value: 2,
                    unit: 'days',
                    timeOfDay: '09:00',
                    respectRecipientTimezone: true
                  },
                  stats: {
                    enrolledCount: 14700,
                    completedCount: 14700
                  },
                  nextNodes: [
                    {
                      id: 'node-condition-1',
                      type: 'condition',
                      title: 'Check: Opened Email #1?',
                      description: 'Evaluate if recipient opened the lookbook delivery email',
                      conditionConfig: {
                        conditionType: 'opened_email',
                        targetStepId: 'node-email-1',
                        timeframeDays: 2
                      },
                      stats: {
                        enrolledCount: 14700,
                        completedCount: 14700
                      },
                      yesBranch: [
                        {
                          id: 'node-email-2-yes',
                          type: 'email',
                          title: 'Email #2: Studio Story & VIP 15% Gift',
                          description: 'Warm founder story with personalized coupon reward',
                          emailConfig: {
                            subject: 'The secret behind our atelier + a 15% welcome gift 🥂',
                            previewText: 'Use code WELCOME15 on your first order over $100.',
                            senderName: 'Elena from Sendline Studio',
                            senderEmail: 'elena@sendline.io',
                            layoutHeadline: 'Crafted with Intention',
                            layoutSubhead: 'A personal note from our creative director on slow craftsmanship.',
                            thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
                            accentColor: '#10B981',
                            buttonText: 'Claim 15% VIP Discount',
                            buttonUrl: 'https://sendline.io/shop?discount=WELCOME15'
                          },
                          stats: {
                            enrolledCount: 10900,
                            completedCount: 10900,
                            openRate: 64.8,
                            clickRate: 28.1
                          },
                          nextNodes: [
                            {
                              id: 'node-action-reward-1',
                              type: 'action',
                              title: 'Award 150 Loyalty Bonus Points',
                              description: 'Credit points to subscriber wallet',
                              actionConfig: {
                                actionType: 'award_loyalty_points',
                                pointsValue: 150,
                                note: 'Welcome sequence completion bonus'
                              },
                              stats: {
                                enrolledCount: 10900,
                                completedCount: 10900
                              }
                            }
                          ]
                        }
                      ],
                      noBranch: [
                        {
                          id: 'node-email-2-no',
                          type: 'email',
                          title: 'Email #2b: Friendly Reminder & Top 3 Styles',
                          description: 'Resend lookbook access with alternative subject line',
                          emailConfig: {
                            subject: 'Did you miss your Summer Lookbook? (Top 3 favorites inside)',
                            previewText: 'A quick reminder before the capsule collection officially launches.',
                            senderName: 'Elena from Sendline Studio',
                            senderEmail: 'elena@sendline.io',
                            layoutHeadline: 'Don\'t Miss Your Guide',
                            layoutSubhead: 'Our most loved transitional pieces for warmer weather.',
                            thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=80',
                            accentColor: '#F59E0B',
                            buttonText: 'Read Lookbook Online',
                            buttonUrl: 'https://sendline.io/lookbook'
                          },
                          stats: {
                            enrolledCount: 3800,
                            completedCount: 3800,
                            openRate: 49.3,
                            clickRate: 18.2
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'wf-post-purchase-onboarding',
    title: 'Post-Purchase Digital Product Delivery & Course Onboarding',
    description: 'Triggers immediately upon checkout payment. Sends access credentials, checks module completion after 5 days, and invites to Discord.',
    status: 'active',
    category: 'Post-Purchase',
    totalEnrolled: 3240,
    totalCompleted: 3180,
    avgOpenRate: 82.1,
    avgClickRate: 51.4,
    createdAt: '2026-07-01T12:00:00Z',
    updatedAt: '2026-08-14T09:15:00Z',
    rootTriggerNode: {
      id: 'node-trigger-checkout',
      type: 'trigger',
      title: 'Checkout Purchase Completed',
      description: 'Customer buys The Creative Director Operating System',
      triggerConfig: {
        triggerType: 'checkout_purchase',
        targetId: 'prod-director-os',
        targetName: 'The Creative Director\'s Operating System ($49)',
        filterConditions: 'Successful Stripe Payment'
      },
      stats: {
        enrolledCount: 3240,
        completedCount: 3240
      },
      nextNodes: [
        {
          id: 'node-email-access',
          type: 'email',
          title: 'Email #1: Instant Notion Kit & Vault Access',
          description: 'High-priority delivery email with duplicate workspace link',
          emailConfig: {
            subject: 'Instant Access: Your Creative Director Operating System 🚀',
            previewText: 'Here are your Notion duplicate links, Figma templates, and asset pack.',
            senderName: 'Sendline Education',
            senderEmail: 'founders@sendline.io',
            layoutHeadline: 'Welcome to the Studio Suite',
            layoutSubhead: 'Your digital toolkits are prepared and ready to duplicate.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
            accentColor: '#6366F1',
            buttonText: 'Duplicate Notion Template',
            buttonUrl: 'https://notion.so/template-director-os'
          },
          stats: {
            enrolledCount: 3240,
            completedCount: 3240,
            openRate: 89.6,
            clickRate: 62.1
          },
          nextNodes: [
            {
              id: 'node-delay-checkin',
              type: 'delay',
              title: 'Wait 5 Days',
              description: 'Allow student to complete setup and first module',
              delayConfig: {
                delayType: 'relative',
                value: 5,
                unit: 'days',
                timeOfDay: '10:00',
                respectRecipientTimezone: true
              },
              stats: {
                enrolledCount: 3200,
                completedCount: 3200
              },
              nextNodes: [
                {
                  id: 'node-condition-notion',
                  type: 'condition',
                  title: 'Check: Clicked Notion Access Link?',
                  description: 'Verify if customer clicked the setup link in Email #1',
                  conditionConfig: {
                    conditionType: 'clicked_link',
                    targetStepId: 'node-email-access',
                    linkUrl: 'https://notion.so/template-director-os'
                  },
                  stats: {
                    enrolledCount: 3200,
                    completedCount: 3200
                  },
                  yesBranch: [
                    {
                      id: 'node-email-community',
                      type: 'email',
                      title: 'Email #2: Join the Private Discord & Mastermind',
                      description: 'Exclusive community invite for verified owners',
                      emailConfig: {
                        subject: 'Your VIP pass to the Private Director Discord 💬',
                        previewText: 'Join 1,200+ top creative directors and agency founders.',
                        senderName: 'Sendline Education',
                        senderEmail: 'founders@sendline.io',
                        layoutHeadline: 'Connect with Fellow Creators',
                        layoutSubhead: 'Weekly design teardowns, template drops, and client leads.',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
                        accentColor: '#10B981',
                        buttonText: 'Join Private Discord',
                        buttonUrl: 'https://discord.gg/sendline-directors'
                      },
                      stats: {
                        enrolledCount: 2450,
                        completedCount: 2450,
                        openRate: 76.5,
                        clickRate: 44.0
                      }
                    }
                  ],
                  noBranch: [
                    {
                      id: 'node-email-walkthrough',
                      type: 'email',
                      title: 'Email #2b: Need help setting up? 5-min Video Tour',
                      description: 'Overcome friction with a quick Loom screen walkthrough',
                      emailConfig: {
                        subject: 'Need help with your Notion workspace? (5-min video)',
                        previewText: 'Watch our step-by-step setup guide to get rolling in minutes.',
                        senderName: 'Sendline Education',
                        senderEmail: 'founders@sendline.io',
                        layoutHeadline: 'Quick Start Video Guide',
                        layoutSubhead: 'Everything you need to customize your director dashboard.',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                        accentColor: '#F59E0B',
                        buttonText: 'Watch 5-Min Video',
                        buttonUrl: 'https://loom.com/share/sendline-director-os-tour'
                      },
                      stats: {
                        enrolledCount: 750,
                        completedCount: 750,
                        openRate: 61.2,
                        clickRate: 32.8
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'wf-loyalty-tier-reward',
    title: 'VIP Loyalty Milestone & Automatic Credit Reward',
    description: 'Triggered when subscriber reaches Gold or Platinum tier. Automatically credits loyalty points, generates unique discount code, and sends celebration email.',
    status: 'active',
    category: 'Loyalty & Rewards',
    totalEnrolled: 890,
    totalCompleted: 890,
    avgOpenRate: 91.2,
    avgClickRate: 64.7,
    createdAt: '2026-07-20T16:00:00Z',
    updatedAt: '2026-08-16T11:20:00Z',
    rootTriggerNode: {
      id: 'node-trigger-loyalty',
      type: 'trigger',
      title: 'Loyalty Tier Milestone Reached',
      description: 'Subscriber advances to Gold Tier (1,000+ points)',
      triggerConfig: {
        triggerType: 'loyalty_tier_reached',
        targetId: 'tier-gold',
        targetName: 'Gold Tier / VIP Circle (1,000 pts)',
        filterConditions: 'Automatic tier elevation'
      },
      stats: {
        enrolledCount: 890,
        completedCount: 890
      },
      nextNodes: [
        {
          id: 'node-action-coupon',
          type: 'action',
          title: 'Generate Dynamic $25 Coupon Code',
          description: 'Unique one-time coupon code assigned to contact profile',
          actionConfig: {
            actionType: 'issue_coupon',
            couponDiscount: '$25 OFF Entire Order',
            note: 'Generated for Gold VIP celebration'
          },
          stats: {
            enrolledCount: 890,
            completedCount: 890
          },
          nextNodes: [
            {
              id: 'node-email-vip',
              type: 'email',
              title: 'Email: Welcome to the Gold Inner Circle',
              description: 'Luxury gold foil aesthetic email with $25 gift card inside',
              emailConfig: {
                subject: 'You\'ve unlocked Gold VIP status! Here is your $25 gift 🥂',
                previewText: 'Exclusive free shipping, early collection drops, and concierge styling.',
                senderName: 'Sendline Concierge',
                senderEmail: 'concierge@sendline.io',
                layoutHeadline: 'Welcome to Gold Status',
                layoutSubhead: 'Your dedication to high craftsmanship has elevated your tier.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
                accentColor: '#D97706',
                buttonText: 'Redeem $25 VIP Credit',
                buttonUrl: 'https://sendline.io/vip/gold-benefits'
              },
              stats: {
                enrolledCount: 890,
                completedCount: 890,
                openRate: 91.2,
                clickRate: 64.7
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'wf-abandoned-checkout',
    title: 'Abandoned Checkout Recovery Flow',
    description: 'Recovers shoppers who entered email during checkout but did not finish transaction. Sends soft nudge after 2 hours and 10% coupon after 24 hours.',
    status: 'paused',
    category: 'Abandonment Recovery',
    totalEnrolled: 1120,
    totalCompleted: 980,
    avgOpenRate: 54.6,
    avgClickRate: 29.8,
    createdAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-08-12T17:00:00Z',
    rootTriggerNode: {
      id: 'node-trigger-abandon',
      type: 'trigger',
      title: 'Checkout Started (Incomplete)',
      description: 'Shopper starts checkout session on any digital product',
      triggerConfig: {
        triggerType: 'checkout_purchase',
        targetName: 'Any Checkout Product',
        filterConditions: 'Status = Initiated but not Paid'
      },
      stats: {
        enrolledCount: 1120,
        completedCount: 1120
      },
      nextNodes: [
        {
          id: 'node-delay-abandon-1',
          type: 'delay',
          title: 'Wait 2 Hours',
          description: 'Grace period for customer to complete naturally',
          delayConfig: {
            delayType: 'relative',
            value: 2,
            unit: 'hours'
          },
          stats: {
            enrolledCount: 1120,
            completedCount: 1120
          },
          nextNodes: [
            {
              id: 'node-email-abandon-1',
              type: 'email',
              title: 'Email #1: Friendly Cart Reminder',
              description: 'Clean editorial reminder with direct 1-click cart restoration',
              emailConfig: {
                subject: 'Did you leave something behind in your studio bag?',
                previewText: 'Your selected products are saved and waiting for you.',
                senderName: 'Sendline Atelier',
                senderEmail: 'orders@sendline.io',
                layoutHeadline: 'Your Items Are Saved',
                layoutSubhead: 'Complete your checkout before stock reservation expires.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
                accentColor: '#1F2937',
                buttonText: 'Return to Checkout',
                buttonUrl: 'https://sendline.io/checkout/restore'
              },
              stats: {
                enrolledCount: 1040,
                completedCount: 1040,
                openRate: 58.2,
                clickRate: 31.0
              }
            }
          ]
        }
      ]
    }
  }
];

export const WORKFLOW_TEMPLATES_CATALOG = [
  {
    id: 'tmpl-welcome-nurture',
    title: 'The Signature Creator Welcome Series',
    category: 'Welcome Series',
    badge: 'Most Popular',
    description: '3-part high-converting onboarding sequence. Delivers freebie, introduces your story, and tests interest with a smart conditional fork.',
    stepCount: 6,
    icon: 'Sparkles',
    accentColor: '#D97706',
    estimatedOpenRate: '68% - 78%'
  },
  {
    id: 'tmpl-lead-magnet',
    title: 'Instant Lead Magnet & Freebie Delivery',
    category: 'Lead Magnet Delivery',
    badge: 'Quick Start',
    description: 'Minimalist 2-step delivery with automated segment tagging and high-contrast download CTA button.',
    stepCount: 3,
    icon: 'FileText',
    accentColor: '#10B981',
    estimatedOpenRate: '75% - 85%'
  },
  {
    id: 'tmpl-post-purchase',
    title: 'Digital Product Access & Course Onboarding',
    category: 'Post-Purchase',
    badge: 'High Revenue',
    description: 'Stripe purchase trigger $\\rightarrow$ Send license keys $\\rightarrow$ Wait 5 days $\\rightarrow$ Check activation $\\rightarrow$ Invite to community.',
    stepCount: 7,
    icon: 'ShoppingBag',
    accentColor: '#6366F1',
    estimatedOpenRate: '80% - 90%'
  },
  {
    id: 'tmpl-loyalty-rewards',
    title: 'VIP Loyalty Tier Advancement & Coupon Gift',
    category: 'Loyalty & Rewards',
    badge: 'Retention',
    description: 'Celebrate loyalty point milestones with automated coupon creation, VIP badge assignment, and congratulations email.',
    stepCount: 4,
    icon: 'Gift',
    accentColor: '#EC4899',
    estimatedOpenRate: '85% - 95%'
  },
  {
    id: 'tmpl-re-engagement',
    title: 'Win-Back Inactive Subscribers (Sunset Flow)',
    category: 'Re-Engagement',
    badge: 'Deliverability',
    description: 'Identify subscribers inactive for 60+ days. Send warm check-in with 20% discount; automatically prune unengaged emails.',
    stepCount: 5,
    icon: 'RefreshCw',
    accentColor: '#8B5CF6',
    estimatedOpenRate: '35% - 45%'
  },
  {
    id: 'tmpl-abandoned-checkout',
    title: 'Abandoned Checkout Recovery (2-Stage)',
    category: 'Abandonment Recovery',
    badge: 'Conversion Booster',
    description: '2-hour gentle reminder followed by a 24-hour urgency coupon. Recovers 18-28% of lost checkout sales.',
    stepCount: 5,
    icon: 'Zap',
    accentColor: '#EF4444',
    estimatedOpenRate: '52% - 62%'
  }
];
