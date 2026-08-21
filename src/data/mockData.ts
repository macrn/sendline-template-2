import { 
  EmailTemplate, 
  Campaign, 
  TransactionalLog, 
  ApiKey, 
  ScreenerItem, 
  InboxEmail, 
  LoyaltyTier, 
  LoyaltyMember, 
  CouponReward, 
  DomainRecord,
  SubscriberContact,
  AudienceSegment,
  TransactionalTemplate,
  TransactionalWebhook,
  BlockedContact
} from '../types';

export const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-multi-service-sale',
    name: 'Multi-service sale',
    category: 'E-commerce',
    thumbnailColor: 'from-[#0C0F17] to-[#1E2430]',
    subject: '25% Off Everything — Limited Time Studio Pass',
    preheader: 'Offering a discount on several services? Use this template to highlight each one.',
    headline: '25% Off Everything',
    description: 'Offering a discount on several services? Use this template to highlight each one, with room for an introductory message to emphasize their value.',
    notes: 'A bold, high-contrast editorial sale template designed with a striking flash-sale marquee ticker, minimalist hero portrait, and sleek typography.',
    bestFor: 'Service discounts, agency packages, multi-item promotions, studio seasonal specials',
    industry: 'Creative Studios, Spas, Salons, Consultancies, Photography & DTC Brands',
    includedBlocks: ['Studio Header Monogram', 'Flash Sale Ticker Tape', 'Serif Headline', 'Hero Portrait Frame', 'Story Offer Paragraph', 'Pill CTA Button'],
    body: 'Take advantage of our exclusive seasonal promotion. Whether you are booking brand strategy, creative direction, photography, or complete editorial production, enjoy 25% off all studio bookings this month.',
    accentColor: '#FFFFFF',
    fontFamily: 'serif',
    fontSize: 46,
    textAlign: 'center',
    ctaText: 'BOOK YOUR SERVICE',
    ctaUrl: 'https://sendline.io/services/sale',
    buttonShape: 'pill',
    badgeText: 'FLASH SALE',
    scriptOverlay: 'DC STUDIO',
    monogram: 'DC',
    tickerText: 'FLASH SALE ✨ FLASH SALE ✨ FLASH SALE ✨ FLASH SALE',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'square',
    paletteTheme: 'obsidian',
    hasLoyaltyBlock: false
  },
  {
    id: 'tmpl-cook-nature',
    name: 'Botanical Harvest & Recipe Guide',
    category: 'Editorial',
    thumbnailColor: 'from-[#FDF6E2] to-[#E2D8B3]',
    subject: 'Issue #12: Mindful cooking with whole seasonal roots',
    preheader: 'A guide to vibrant, healthy meals that support everyday energy.',
    headline: 'COOK WITH NATURE',
    description: 'Rooted in organic culinary aesthetics, this warm editorial layout elevates food essays, digital cookbooks, and seasonal farm-to-table menus.',
    notes: 'Features our signature Arched Dome framing with a botanical monogram crest, rich earth-tone sunflower palette, and high-readability slab typography.',
    bestFor: 'Culinary publications, organic wellness brands, farm-to-table newsletters, seasonal drops',
    industry: 'Food & Beverage, Wellness, Organic Lifestyle, Culinary Publishers',
    includedBlocks: ['Monogram Crest', 'Organic Roots Script Subtitle', 'Arched Top Frame', 'Hero Food Photography', 'Mindful Essay Body', 'Primary Action Button'],
    body: 'Rooted in the goodness of whole foods, our seasonal guide is your companion to mindful meals that nourish body and spirit. Cook simply, eat consciously, and celebrate every harvest.',
    accentColor: '#E8D284',
    fontFamily: 'display-slab',
    fontSize: 48,
    textAlign: 'center',
    ctaText: 'DOWNLOAD RECIPE GUIDE',
    ctaUrl: 'https://sendline.io/recipes/summer-harvest',
    buttonShape: 'sharp',
    badgeText: 'Seasonal Drop',
    scriptOverlay: 'Organic Roots',
    monogram: 'OR',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'arch',
    paletteTheme: 'sunflower',
    hasLoyaltyBlock: false
  },
  {
    id: 'tmpl-client-reviews',
    name: 'Maison Botanique Reviews',
    category: 'Product Launch',
    thumbnailColor: 'from-[#EDE9FE] to-[#DDD6FE]',
    subject: 'What our clients say about the pure botanical balm',
    preheader: 'Hydrated, plump lips with just a subtle kiss of color all day long.',
    headline: 'What clients say about us',
    description: 'Turn social proof into customer desire. Perfect for highlighting glowing 5-star customer testimonials alongside hero product imagery.',
    notes: 'Includes a delicate Flodesk-style scalloped cloud frame, 5-star rating stars, italic testimonial quotation card, and soft lavender lilac styling.',
    bestFor: 'Product launches, social proof campaigns, customer review roundups, beauty drops',
    industry: 'Skincare, Clean Beauty, Luxury Cosmetics, Artisanal Apothecary',
    includedBlocks: ['YE Monogram', 'Pure Rituals Italic Script', 'Scalloped Cloud Mask', '5-Star Review Rating Block', 'Customer Quote Card', 'Pill Shop Button'],
    body: 'We formulate in micro-batches using cold-pressed rosehip seed oil, wild camellia, and organic beeswax. Clean, non-sticky nourishment crafted for effortless everyday beauty.',
    accentColor: '#7C3AED',
    fontFamily: 'serif',
    fontSize: 38,
    textAlign: 'center',
    ctaText: 'SHOP THE ESSENTIALS',
    ctaUrl: 'https://sendline.io/shop/lip-elixir',
    buttonShape: 'pill',
    badgeText: '5-Star Review',
    scriptOverlay: 'Pure Rituals',
    monogram: 'YE',
    ratingStars: 5,
    testimonialQuote: '“I can finally stop searching for the perfect lip care product! My lips stay hydrated all day, with just a delicate kiss of organic berry color.”',
    testimonialAuthor: 'Camille Dubois, Verified Patron',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'scalloped',
    paletteTheme: 'lavender',
    hasLoyaltyBlock: true
  },
  {
    id: 'tmpl-autumn-capsule',
    name: 'Atelier Minimal Lookbook',
    category: 'E-commerce',
    thumbnailColor: 'from-[#FDFBF7] to-[#EFE9DC]',
    subject: 'Autumn Capsule Drop No. 07 is now officially open',
    preheader: '300 serialized pieces worldwide. Milled from organic heavyweight cotton.',
    headline: 'Tactile Simplicity',
    description: 'A contemporary fashion and lookbook layout for limited capsule drops, serialized garments, and high-end artisanal goods.',
    notes: 'Equipped with a built-in VIP discount coupon voucher, left-aligned modern typography, and a sand linen natural background.',
    bestFor: 'Fashion lookbooks, luxury streetwear, limited capsule drops, VIP flash vouchers',
    industry: 'Fashion, Apparel, Accessories, Architecture & Spatial Design',
    includedBlocks: ['Atelier Monogram', 'Limited Batch Badge', 'Left-aligned Editorial Copy', 'Promo Coupon Voucher', 'High-Res Fashion Photography', 'Reserve Action Button'],
    body: 'Designed in Zurich, crafted in northern Portugal. Every silhouette is cut with generous drape and clean structural lines that transcend fleeting seasonal trends.\n\nEnjoy complimentary express courier delivery on all orders placed within 48 hours.',
    accentColor: '#1C1917',
    fontFamily: 'sans',
    fontSize: 42,
    textAlign: 'left',
    ctaText: 'RESERVE YOUR PIECE',
    ctaUrl: 'https://sendline.io/atelier/capsule-07',
    buttonShape: 'pill',
    badgeText: 'Limited Batch',
    scriptOverlay: 'Atelier 07',
    monogram: 'AT',
    couponCode: 'ATELIER-15',
    couponDiscount: '15% Off Lookbook Orders',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'rounded',
    paletteTheme: 'sand',
    hasLoyaltyBlock: true
  },
  {
    id: 'tmpl-sunday-essay',
    name: 'The Sunday Monologue',
    category: 'Editorial',
    thumbnailColor: 'from-[#F5F5F4] to-[#E7E5E4]',
    subject: 'Issue No. 49: The Architecture of Digital Resonance',
    preheader: 'A weekly thought piece on high-craft design, typography, and signal.',
    headline: 'Beauty is high leverage.',
    description: 'A thoughtful long-form essay layout for writers, founders, and curators who value literary depth and contemplative white space.',
    notes: 'Features a classic polaroid photo mount, personal author sign-off block, and high-contrast editorial serif typography.',
    bestFor: 'Founder essays, weekly digest letters, design manifestos, thought leadership',
    industry: 'Publishing, Independent Media, Venture Capital, Design & Tech',
    includedBlocks: ['Issue Badge', 'Polaroid Photo Card', 'Deep Reading Story Body', 'Founder Signature Signoff', 'Action Link Button'],
    body: 'When you eliminate unnecessary visual noise, your message lands with unmistakable authority. People do not crave more volume; they crave clarity, rhythm, and human intention.\n\nIn an age of automated generic emails, a single well-crafted letter stands out like an art book on a coffee table.',
    accentColor: '#0C0A09',
    fontFamily: 'serif',
    fontSize: 44,
    textAlign: 'center',
    ctaText: 'READ THE FULL ESSAY',
    ctaUrl: 'https://sendline.io/monologue/49',
    buttonShape: 'sharp',
    badgeText: 'Issue 49',
    scriptOverlay: 'The Guild',
    authorSignature: 'Julian Vance, Founding Editor',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'polaroid',
    paletteTheme: 'sand',
    hasLoyaltyBlock: false
  },
  {
    id: 'tmpl-vip-loyalty',
    name: 'Maison Privilege VIP Pass',
    category: 'VIP Rewards',
    thumbnailColor: 'from-[#FDF8F3] to-[#F1E5D5]',
    subject: '✨ Congratulations! You unlocked Gold Tier Status',
    preheader: 'Your loyalty score crossed 2,450 points. Claim your private gift.',
    headline: 'You’ve reached the inner circle.',
    description: 'Reward your top patrons with an exclusive VIP tier celebration email containing dynamic reward points and private discount codes.',
    notes: 'Features a warm terracotta and gold palette, Arched Dome architecture, and an embedded coupon voucher code with monetary discount.',
    bestFor: 'Tier milestone celebrations, birthday rewards, VIP member perks, loyalty activations',
    industry: 'Luxury Retail, Members Clubs, Hospitality, Premium E-Commerce',
    includedBlocks: ['Gold Tier Badge', 'Maison Pass Crest', 'VIP Headline', 'Exclusive Perk Breakdown', 'Redeemable $30 Voucher', 'Claim Button'],
    body: 'As a valued member of our Gold Tier, you now receive early access to private trunk shows, complimentary custom alterations, and automated VIP checkout discounts.',
    accentColor: '#7A5B35',
    fontFamily: 'serif',
    fontSize: 40,
    textAlign: 'center',
    ctaText: 'CLAIM $30 CHECKOUT GIFT',
    ctaUrl: 'https://sendline.io/rewards/gold-pass',
    buttonShape: 'pill',
    badgeText: 'Gold Tier VIP',
    scriptOverlay: 'Maison Pass',
    monogram: 'MP',
    couponCode: 'PRIVILEGE-30',
    couponDiscount: '$30 off any order over $120',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'arch',
    paletteTheme: 'terracotta',
    hasLoyaltyBlock: true
  },
  {
    id: 'tmpl-nordic-furniture',
    name: 'Nordic Object Studio Drop',
    category: 'Product Launch',
    thumbnailColor: 'from-[#1E2430] to-[#0E131F]',
    subject: 'Object No. 14: Cast bronze & solid smoked oak',
    preheader: 'Hand-cast in Copenhagen. Strictly limited to 120 numbered units.',
    headline: 'Form reduced to essence.',
    description: 'Dark-mode luxury architectural presentation for limited-edition physical design objects, gallery exhibitions, and craft releases.',
    notes: 'Styled in Midnight Obsidian with crisp white typography, sharp square geometry, and high-impact industrial photography.',
    bestFor: 'Limited edition furniture, industrial design, gallery exhibitions, luxury hardware',
    industry: 'Furniture, Architecture, Ceramics, Interior Design, Industrial Craft',
    includedBlocks: ['Numbered Edition Monogram', 'Minimalist Title', 'Dark Canvas Frame', 'Studio Object Photography', 'Material Specifications', 'Acquire Button'],
    body: 'A heavy solid brass desk monolith cast using traditional sand-moulding techniques. Finished with natural organic wax and hand-buffed to a deep matte sheen.',
    accentColor: '#6366F1',
    fontFamily: 'sans',
    fontSize: 42,
    textAlign: 'left',
    ctaText: 'ACQUIRE OBJECT 14',
    ctaUrl: 'https://sendline.io/objects/14',
    buttonShape: 'sharp',
    badgeText: 'Numbered Edition',
    scriptOverlay: 'Copenhagen Lab',
    monogram: 'NO',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'square',
    paletteTheme: 'obsidian',
    hasLoyaltyBlock: false
  },
  {
    id: 'tmpl-welcome-founder',
    name: 'Founder Welcome & Manifesto',
    category: 'Welcome Flow',
    thumbnailColor: 'from-[#EAF2E8] to-[#D5E3D2]',
    subject: 'A personal welcome to the Sendline community',
    preheader: 'Here is why we built Sendline and what you can expect each week.',
    headline: 'Welcome to the quiet corner of your inbox.',
    description: 'Start customer relationships with authenticity. A warm, personal greeting letter written directly from the founder or creative director.',
    notes: 'Designed with a soothing olive sage palette, soft rounded frame, dual founder signature sign-off, and curated story archive links.',
    bestFor: 'Subscriber onboarding, welcome sequences, brand introductions, manifesto letters',
    industry: 'Creator Economy, Subscriptions, Agencies, Boutique Brands',
    includedBlocks: ['Personal Note Script', 'Welcome Manifesto', 'Olive Sage Canvas', 'Founders Signature Block', 'Archive Exploration CTA'],
    body: 'We started this project because modern marketing tools became loud, complex, and uninspiring. We believe your letters should look and feel as deliberate as a bespoke publication.\n\nOver the coming weeks, you will receive our private design essays and curated botanical guides.',
    accentColor: '#2D5A27',
    fontFamily: 'serif',
    fontSize: 38,
    textAlign: 'left',
    ctaText: 'EXPLORE THE ARCHIVE',
    ctaUrl: 'https://sendline.io/archive',
    buttonShape: 'pill',
    badgeText: 'Founder Welcome',
    scriptOverlay: 'Personal Note',
    authorSignature: 'Elena Vance & Marc O’Connor',
    authorTitle: 'Co-Founders, Sendline Studio',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'rounded',
    paletteTheme: 'olive',
    hasLoyaltyBlock: true
  },
  {
    id: 'tmpl-artisan-coffee',
    name: 'Single-Origin Coffee Gazette',
    category: 'Newsletter',
    thumbnailColor: 'from-[#FDF2E9] to-[#F6DEC9]',
    subject: 'Batch #44: High-elevation Gesha from Huila, Colombia',
    preheader: 'Notes of jasmine blossoms, bergamot citrus, and honey nectar.',
    headline: 'The morning ritual, perfected.',
    description: 'Sensory newsletter layout celebrating micro-lot roasts, tasting notes, harvest elevations, and roastery promotions.',
    notes: 'Featuring warm terracotta tones, scalloped cloud border, roastery crest monogram, and complementary merchandise promo code.',
    bestFor: 'Subscription roasters, artisanal food brands, beverage drops, farm-direct goods',
    industry: 'Specialty Coffee, Tea & Herbalists, Micro-Breweries, Artisan Bakers',
    includedBlocks: ['Huila Monogram', 'Tasting Notes Body', 'Roastery Photography', 'Complimentary Mug Voucher', 'Order Whole Bean CTA'],
    body: 'Grown at 1,950 meters above sea level by smallholder farming families in Huila. Lightly roasted in micro-lots of 15kg to preserve delicate floral aromatics.',
    accentColor: '#C05621',
    fontFamily: 'display-slab',
    fontSize: 44,
    textAlign: 'center',
    ctaText: 'ORDER WHOLE BEAN (250G)',
    ctaUrl: 'https://sendline.io/roastery/gesha-44',
    buttonShape: 'rounded',
    badgeText: 'Micro-Lot',
    scriptOverlay: 'Huila Colombia',
    monogram: 'HC',
    couponCode: 'FRESHROAST',
    couponDiscount: 'Complimentary Roastery Mug with 2+ Bags',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    frameShape: 'scalloped',
    paletteTheme: 'terracotta',
    hasLoyaltyBlock: true
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-01',
    title: 'Summer Solstice Collection Launch',
    subject: 'Series 04 is live. 250 units worldwide.',
    status: 'Sent',
    sentCount: 148200,
    openRate: 54.2,
    clickRate: 18.6,
    revenueGenerated: '$48,250',
    date: 'Aug 14, 2026',
    audience: 'US VIP Customers & Active Subscribers',
    templateId: 'tmpl-product-drop'
  },
  {
    id: 'cmp-02',
    title: 'The Sunday Monologue: Issue #48',
    subject: 'Issue No. 48: The subtle physics of product momentum',
    status: 'Sent',
    sentCount: 92400,
    openRate: 62.8,
    clickRate: 24.1,
    revenueGenerated: '$12,800',
    date: 'Aug 10, 2026',
    audience: 'Editorial Guild (Global)',
    templateId: 'tmpl-editorial-01'
  },
  {
    id: 'cmp-03',
    title: 'Q3 Product Infrastructure Roadmap',
    subject: 'Silicon Dispatch: Why US DTC brands are ditching legacy ESPs',
    status: 'Scheduled',
    sentCount: 210000,
    openRate: 0,
    clickRate: 0,
    date: 'Aug 18, 2026 (09:00 AM EST)',
    audience: 'Global SaaS & Developer Segment',
    templateId: 'tmpl-newsletter-modern'
  },
  {
    id: 'cmp-04',
    title: 'Gold Tier Rewards Activation Pulse',
    subject: 'Congratulations! You unlocked Gold Tier Status ✨',
    status: 'Draft',
    sentCount: 18500,
    openRate: 0,
    clickRate: 0,
    date: 'Draft created today',
    audience: 'Top 10% Lifetime Value Spenders',
    templateId: 'tmpl-vip-loyalty'
  }
];

export const INITIAL_TRANSACTIONAL_LOGS: TransactionalLog[] = [
  {
    id: 'tx-89412',
    recipient: 'alexandra.chen@figma.com',
    event: 'opened',
    template: 'order_confirmation_receipt',
    subject: 'Your Sendline Atelier order #SL-94821 is confirmed',
    sender: 'orders@sendline.io',
    tag: 'ecommerce-orders',
    messageId: '<sl.94821.tx89412@us-east-1.sendline.io>',
    latencyMs: 22,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '12 seconds ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '250 2.0.0 OK: Delivered via TLS 1.3 to mx.google.com',
    tlsVersion: 'TLS 1.3 / ECDHE-RSA-AES256-GCM-SHA384',
    openedAt: '5 seconds ago',
    userAgent: 'AppleWebKit/605.1.15 (Apple Mail on macOS 15.1)'
  },
  {
    id: 'tx-89411',
    recipient: 'dev.marcus@linear.app',
    event: 'clicked',
    template: 'auth_magic_link_v2',
    subject: 'Sign in to Sendline Workspace Engine',
    sender: 'auth@sendline.io',
    tag: 'auth-tokens',
    messageId: '<sl.auth.tx89411@us-east-1.sendline.io>',
    latencyMs: 18,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '45 seconds ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '250 2.0.0 OK: queued as 4QZ9pP429xz38',
    tlsVersion: 'TLS 1.3 / X25519',
    openedAt: '38 seconds ago',
    clickedUrl: 'https://sendline.io/auth/verify?token=ey891a27f8a&redirect=dashboard',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/126.0'
  },
  {
    id: 'tx-89410',
    recipient: 'elena.rostova@stripe.com',
    event: 'delivered',
    template: 'auth_magic_link_v2',
    subject: 'One-time security code: 928 410',
    sender: 'security@sendline.io',
    tag: 'auth-tokens',
    messageId: '<sl.sec.tx89410@us-east-1.sendline.io>',
    latencyMs: 24,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '2 mins ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '250 2.0.0 OK: queued as 4QZ9pP429xz38',
    tlsVersion: 'TLS 1.3 / TLS_AES_256_GCM_SHA384'
  },
  {
    id: 'tx-89409',
    recipient: 'marcus.vance@linear.app',
    event: 'opened',
    template: 'order_confirmation_receipt',
    subject: 'Order receipt: Nordic Smoked Oak Monolith',
    sender: 'orders@sendline.io',
    tag: 'ecommerce-orders',
    messageId: '<sl.94820.tx89409@us-west-2.sendline.io>',
    latencyMs: 31,
    region: 'us-west-2 (Oregon)',
    timestamp: '4 mins ago',
    ipPool: 'US-Dedicated-Warm-02',
    smtpResponse: '250 2.1.5 Recipient OK',
    tlsVersion: 'TLS 1.3',
    openedAt: '3 mins ago',
    userAgent: 'GoogleImageProxy / Gmail Web Client'
  },
  {
    id: 'tx-89408',
    recipient: 'sarah.jenkins@apple.com',
    event: 'clicked',
    template: 'password_reset_secure',
    subject: 'Reset your Sendline password',
    sender: 'security@sendline.io',
    tag: 'account-recovery',
    messageId: '<sl.reset.tx89408@us-east-1.sendline.io>',
    latencyMs: 19,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '8 mins ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '250 2.0.0 OK: Delivered via TLS 1.3',
    tlsVersion: 'TLS 1.3',
    clickedUrl: 'https://sendline.io/reset-password?key=8f9a2b8e',
    userAgent: 'Apple Mail (iOS 18.0)'
  },
  {
    id: 'tx-89407',
    recipient: 'kai.nakamura@sony.co.jp',
    event: 'delivered',
    template: 'invoice_generated_pdf',
    subject: 'Monthly VAT Statement & Enterprise Invoice #INV-2026-08',
    sender: 'billing@sendline.io',
    tag: 'billing-invoices',
    messageId: '<sl.inv.tx89407@ap-northeast-1.sendline.io>',
    latencyMs: 42,
    region: 'ap-northeast-1 (Tokyo)',
    timestamp: '15 mins ago',
    ipPool: 'Global-Edge-Pool',
    smtpResponse: '250 2.0.0 Message accepted',
    tlsVersion: 'TLS 1.3'
  },
  {
    id: 'tx-89406',
    recipient: 'charlotte.dupont@lvmh.fr',
    event: 'delivered',
    template: 'loyalty_points_credited',
    subject: '✨ 250 VIP loyalty points credited to your Maison account',
    sender: 'rewards@sendline.io',
    tag: 'loyalty-triggers',
    messageId: '<sl.pts.tx89406@eu-west-1.sendline.io>',
    latencyMs: 28,
    region: 'eu-west-1 (Frankfurt)',
    timestamp: '26 mins ago',
    ipPool: 'EU-GDPR-Compliant-Pool',
    smtpResponse: '250 2.0.0 OK: 14828192',
    tlsVersion: 'TLS 1.3'
  },
  {
    id: 'tx-89405',
    recipient: 'dev-invalid-testing@unknown-domain-test.xyz',
    event: 'bounced',
    template: 'welcome_verify_email',
    subject: 'Verify your developer account email address',
    sender: 'auth@sendline.io',
    tag: 'onboarding',
    messageId: '<sl.ver.tx89405@us-east-1.sendline.io>',
    latencyMs: 68,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '42 mins ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '550 5.1.1 User unknown: Mailbox not found on destination MX',
    errorReason: '550 5.1.1 Hard bounce: Target mailbox does not exist'
  },
  {
    id: 'tx-89404',
    recipient: 'spam-trap-detected@bot-crawler-honeypot.org',
    event: 'blocked',
    template: 'order_confirmation_receipt',
    subject: 'Receipt for Order #SL-94799',
    sender: 'orders@sendline.io',
    tag: 'ecommerce-orders',
    messageId: '<sl.94799.tx89404@us-east-1.sendline.io>',
    latencyMs: 12,
    region: 'us-east-1 (N. Virginia)',
    timestamp: '1 hour ago',
    ipPool: 'US-Dedicated-Warm-01',
    smtpResponse: '554 5.7.1 Suppressed: Recipient address matches global spam-trap blacklist',
    errorReason: 'Blacklisted domain suppression rule'
  }
];

export const INITIAL_TRANSACTIONAL_TEMPLATES: TransactionalTemplate[] = [
  {
    id: 'tmpl-tx-01',
    name: 'Order Confirmation & Shipping Receipt',
    tag: 'ecommerce-orders',
    subject: 'Your order #{{ params.ORDER_NUMBER }} is confirmed',
    sender: 'orders@sendline.io',
    status: 'active',
    lastModified: 'Aug 14, 2026',
    sentCount: 142850,
    openRate: 78.4,
    clickRate: 34.2,
    htmlBody: `<div style="font-family:sans-serif;padding:32px;color:#18181b;max-width:600px;margin:auto;">
  <h2 style="font-size:24px;font-weight:900;letter-spacing:-0.5px;margin-bottom:8px;">Order Confirmed</h2>
  <p style="color:#52525b;font-size:14px;">Thank you for your order, <strong>{{ contact.FIRSTNAME }}</strong>. We have received your payment and are hand-packing your items.</p>
  <div style="background:#f4f4f5;border-radius:16px;padding:20px;margin:24px 0;">
    <div style="font-size:12px;font-weight:bold;color:#71717a;text-transform:uppercase;">Order Summary</div>
    <div style="font-size:18px;font-weight:bold;margin-top:4px;">#{{ params.ORDER_NUMBER }} • {{ params.TOTAL_AMOUNT }}</div>
  </div>
  <a href="{{ params.TRACKING_URL }}" style="display:inline-block;background:#09090b;color:#fff;padding:12px 24px;border-radius:12px;font-size:13px;font-weight:bold;text-decoration:none;">Track Order Status</a>
</div>`,
    variables: ['contact.FIRSTNAME', 'params.ORDER_NUMBER', 'params.TOTAL_AMOUNT', 'params.TRACKING_URL']
  },
  {
    id: 'tmpl-tx-02',
    name: 'Password Reset & Magic Link Token',
    tag: 'auth-tokens',
    subject: 'Sign in to your Sendline account',
    sender: 'security@sendline.io',
    status: 'active',
    lastModified: 'Aug 10, 2026',
    sentCount: 89400,
    openRate: 88.2,
    clickRate: 64.9,
    htmlBody: `<div style="font-family:sans-serif;padding:32px;color:#18181b;max-width:600px;margin:auto;">
  <h2 style="font-size:22px;font-weight:900;">Instant Authentication</h2>
  <p style="color:#52525b;font-size:14px;">Click the button below to authenticate into your Sendline workspace. This link expires in 15 minutes.</p>
  <div style="margin:24px 0;">
    <a href="{{ params.AUTH_MAGIC_LINK }}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 28px;border-radius:12px;font-size:13px;font-weight:bold;text-decoration:none;">Sign In Instantly</a>
  </div>
  <p style="color:#a1a1aa;font-size:12px;">If you didn't request this email, you can safely ignore it.</p>
</div>`,
    variables: ['params.AUTH_MAGIC_LINK', 'params.EXPIRES_MINUTES', 'contact.EMAIL']
  },
  {
    id: 'tmpl-tx-03',
    name: 'Loyalty Points Milestone Notification',
    tag: 'loyalty-triggers',
    subject: '✨ {{ params.POINTS_EARNED }} points added to your balance',
    sender: 'rewards@sendline.io',
    status: 'active',
    lastModified: 'Aug 02, 2026',
    sentCount: 38200,
    openRate: 72.1,
    clickRate: 28.5,
    htmlBody: `<div style="font-family:sans-serif;padding:32px;color:#18181b;max-width:600px;margin:auto;">
  <span style="background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">VIP Privilege</span>
  <h2 style="font-size:22px;font-weight:900;margin-top:12px;">You earned {{ params.POINTS_EARNED }} Points!</h2>
  <p style="color:#52525b;font-size:14px;">Your current balance is now <strong>{{ params.NEW_BALANCE }}</strong> points. You are only 150 points away from Gold Tier VIP status.</p>
  <a href="{{ params.REWARDS_URL }}" style="display:inline-block;background:#09090b;color:#fff;padding:12px 24px;border-radius:12px;font-size:13px;font-weight:bold;text-decoration:none;margin-top:16px;">View Rewards Vault</a>
</div>`,
    variables: ['params.POINTS_EARNED', 'params.NEW_BALANCE', 'params.REWARDS_URL', 'contact.FIRSTNAME']
  },
  {
    id: 'tmpl-tx-04',
    name: 'Invoice PDF & Monthly Statement',
    tag: 'billing-invoices',
    subject: 'Your invoice for {{ params.BILLING_MONTH }} is ready',
    sender: 'billing@sendline.io',
    status: 'active',
    lastModified: 'Jul 28, 2026',
    sentCount: 14100,
    openRate: 81.3,
    clickRate: 19.8,
    htmlBody: `<div style="font-family:sans-serif;padding:32px;color:#18181b;max-width:600px;margin:auto;">
  <h2 style="font-size:22px;font-weight:900;">Invoice #{{ params.INVOICE_ID }}</h2>
  <p style="color:#52525b;font-size:14px;">Here is your monthly statement for {{ params.BILLING_MONTH }}. Total paid: <strong>{{ params.AMOUNT_PAID }}</strong>.</p>
  <a href="{{ params.INVOICE_DOWNLOAD_URL }}" style="display:inline-block;background:#09090b;color:#fff;padding:12px 24px;border-radius:12px;font-size:13px;font-weight:bold;text-decoration:none;margin-top:16px;">Download PDF Invoice</a>
</div>`,
    variables: ['params.INVOICE_ID', 'params.BILLING_MONTH', 'params.AMOUNT_PAID', 'params.INVOICE_DOWNLOAD_URL']
  }
];

export const INITIAL_TRANSACTIONAL_WEBHOOKS: TransactionalWebhook[] = [
  {
    id: 'wh-01',
    name: 'Production Delivery & Bounce Pipeline',
    url: 'https://api.yourbrand.com/v1/webhooks/sendline',
    events: ['delivered', 'bounced', 'blocked', 'complaint'],
    status: 'active',
    createdAt: 'Jun 18, 2026',
    lastFired: '3 mins ago (200 OK)',
    secretKey: 'whsec_89fa12b07e8841c99023'
  },
  {
    id: 'wh-02',
    name: 'Data Warehouse Telemetry Feed (BigQuery)',
    url: 'https://ingest.telemetry.yourbrand.com/events/email',
    events: ['opened', 'clicked'],
    status: 'active',
    createdAt: 'Jul 04, 2026',
    lastFired: '12 secs ago (200 OK)',
    secretKey: 'whsec_991a0c774d812eb1895a'
  }
];

export const INITIAL_BLOCKED_CONTACTS: BlockedContact[] = [
  {
    id: 'blk-01',
    email: 'dev-invalid-testing@unknown-domain-test.xyz',
    reason: 'hard_bounce',
    blockedAt: 'Aug 14, 2026',
    smtpDetails: '550 5.1.1 User unknown: Mailbox not found'
  },
  {
    id: 'blk-02',
    email: 'spam-trap-detected@bot-crawler-honeypot.org',
    reason: 'spam_complaint',
    blockedAt: 'Aug 11, 2026',
    smtpDetails: 'Direct feedback loop FBL complaint registered via Yahoo Mail'
  },
  {
    id: 'blk-03',
    email: 'unsub-automated-test@legacy-domain.net',
    reason: 'unsubscribed',
    blockedAt: 'Aug 08, 2026',
    smtpDetails: 'Global transactional opt-out requested via List-Unsubscribe-Post'
  },
  {
    id: 'blk-04',
    email: 'abuse-complaint-risk@temp-inbox-disposable.co',
    reason: 'manual_block',
    blockedAt: 'Aug 01, 2026',
    smtpDetails: 'Manually added by Workspace Admin: Disposable domain suppression'
  }
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-prod-01',
    name: 'Production US-East Cluster',
    keyPrefix: 'sl_live_99fa7e...',
    fullKey: 'sl_live_99fa7e882b4540d99a38f7194c20b8f0',
    created: 'Jul 12, 2026',
    lastUsed: 'Just now',
    environment: 'production',
    rateLimit: '10,000 req/sec'
  },
  {
    id: 'key-stage-01',
    name: 'Staging & CI/CD Pipeline',
    keyPrefix: 'sl_test_33a10c...',
    fullKey: 'sl_test_33a10c667e1248d088bf21990e4412ad',
    created: 'Aug 01, 2026',
    lastUsed: '4 mins ago',
    environment: 'staging',
    rateLimit: '500 req/sec'
  }
];

export const INITIAL_SCREENER_ITEMS: ScreenerItem[] = [
  {
    id: 'scr-01',
    senderName: 'David Thorne (Acme Ventures)',
    senderEmail: 'david@acme-ventures.com',
    avatar: 'DT',
    subject: 'Series A term sheet follow-up & syndication notes',
    snippet: 'Hi Mehmet, wanted to follow up on our discussion regarding Sendline’s US expansion and global delivery metrics. We have shared the preliminary memo with the partnership...',
    receivedAt: '12 mins ago',
    status: 'pending'
  },
  {
    id: 'scr-02',
    senderName: 'Growth Hackers Daily',
    senderEmail: 'digest@growthnewsletters.co',
    avatar: 'GH',
    subject: 'Top 10 DTC brands converting 40%+ on email checkouts',
    snippet: 'Hi there! In this edition: Why visual-first email campaigns out-convert plaintext by 3.2x and how modern loyalty tiers retain subscribers...',
    receivedAt: '45 mins ago',
    status: 'pending'
  },
  {
    id: 'scr-03',
    senderName: 'Cold Pitch Software Ltd',
    senderEmail: 'outreach@leadgenerator-ai.biz',
    avatar: 'CP',
    subject: 'Quick question about your offshore dev scaling',
    snippet: 'Are you looking to scale your engineering team with 50+ pre-vetted contractors next month? We noticed you recently expanded...',
    receivedAt: '2 hours ago',
    status: 'pending'
  }
];

export const INITIAL_EMAILS: InboxEmail[] = [
  {
    id: 'em-01',
    senderName: 'Sarah Lin',
    senderEmail: 'sarah.lin@stripe.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'SL',
    subject: 'Custom Domain Verification & High-Volume Merchant Routing',
    preview: 'We completed the benchmarking test against our US-East webhook listeners. 28ms average response time is incredible.',
    body: 'Hi Mehmet,\n\nWe just wrapped up our 48-hour stress test sending 1.5 million transactional events through the Sendline Node.js SDK.\n\nAverage latency across the US-East region clocked in at 24ms, with 0 dropped webhooks. Deliverability to Google Workspace and iCloud Mail accounts was 100% clean.\n\nCan we set up a call on Thursday to discuss moving our secondary transactional pipeline over?\n\nBest,\nSarah Lin\nPrincipal Infrastructure Lead, Stripe',
    receivedAt: '09:24 AM',
    category: 'imbox',
    isRead: false,
    isStarred: true,
    tags: ['VIP', 'Infrastructure'],
    loyaltyEarned: 50,
    replyLater: true,
    spyTrackers: [
      { name: 'Stripe Beacon', domain: 'track.stripe.com' }
    ],
    clipNotes: [
      { id: 'cn-1', text: 'Sarah noted 24ms average latency in US-East test. Follow up Thursday.', createdAt: 'Today 9:30 AM' }
    ],
    threadMessages: [
      {
        id: 'msg-1',
        senderName: 'Sarah Lin',
        senderEmail: 'sarah.lin@stripe.com',
        avatar: 'SL',
        body: 'Hi Mehmet,\n\nWe just wrapped up our 48-hour stress test sending 1.5 million transactional events through the Sendline Node.js SDK.\n\nAverage latency across the US-East region clocked in at 24ms, with 0 dropped webhooks. Deliverability to Google Workspace and iCloud Mail accounts was 100% clean.\n\nCan we set up a call on Thursday to discuss moving our secondary transactional pipeline over?\n\nBest,\nSarah Lin\nPrincipal Infrastructure Lead, Stripe',
        receivedAt: 'Today at 09:24 AM',
        isOutbound: false
      }
    ]
  },
  {
    id: 'em-02',
    senderName: 'Alex Rivera',
    senderEmail: 'alex@minimalstudio.design',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'AR',
    subject: 'New Flodesk-style template layout prototypes for Q4 drops',
    preview: 'Attached are the typography pairings and mobile responsive frames for the editorial magazine layout.',
    body: 'Hi Mehmet,\n\nI just finalized the editorial font scale and high-contrast colorways for the new Campaign Builder.\n\nKey updates:\n1. 100% responsive fluid column stacking on mobile screens\n2. Native support for custom serif headers and zero-lag live canvas preview\n3. Embedded loyalty wallet widget for instant point redemptions right inside the email body.\n\nTake a look at the attached figma tokens when you get a chance.\n\nCheers,\nAlex',
    receivedAt: 'Yesterday',
    category: 'imbox',
    isRead: true,
    isStarred: true,
    hasAttachment: true,
    tags: ['Design', 'Templates'],
    setAside: true,
    spyTrackers: [],
    threadMessages: [
      {
        id: 'msg-2a',
        senderName: 'Alex Rivera',
        senderEmail: 'alex@minimalstudio.design',
        avatar: 'AR',
        body: 'Hi Mehmet,\n\nI just finalized the editorial font scale and high-contrast colorways for the new Campaign Builder.\n\nKey updates:\n1. 100% responsive fluid column stacking on mobile screens\n2. Native support for custom serif headers and zero-lag live canvas preview\n3. Embedded loyalty wallet widget for instant point redemptions right inside the email body.\n\nTake a look at the attached figma tokens when you get a chance.\n\nCheers,\nAlex',
        receivedAt: 'Yesterday at 3:15 PM',
        isOutbound: false
      },
      {
        id: 'msg-2b',
        senderName: 'Mehmet Arslan',
        senderEmail: 'mehmet@sendline.io',
        avatar: 'MA',
        body: 'Alex, this looks phenomenal. The scalloped border and serif headline pairing feel like a high-end fashion magazine. Let’s ship this in next week’s release.',
        receivedAt: 'Yesterday at 4:40 PM',
        isOutbound: true
      }
    ]
  },
  {
    id: 'em-03',
    senderName: 'Klaviyo to Sendline Migration Team',
    senderEmail: 'migration-desk@sendline.io',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'SD',
    subject: 'Weekly Migration Report: 42 DTC US Accounts Successfully Onboarded',
    preview: 'Summary of 8.4M subscriber records imported with zero bounce anomalies.',
    body: 'Team,\n\nHere is this week’s migration scorecard:\n- Total subscribers transferred: 8,420,100\n- Automated suppression list cleansing: 184,200 obsolete addresses purged\n- Average open rate jump after warm-up: +14.2%\n- Customer cost savings compared to legacy pricing: 64%\n\nAll US-East IP warming pools are running at 99.8% reputation score.',
    receivedAt: 'Aug 14',
    category: 'imbox',
    isRead: true,
    tags: ['Operations'],
    spyTrackers: [
      { name: 'Klaviyo Open Pixel', domain: 'track.klaviyo.com' }
    ]
  },
  {
    id: 'em-04',
    senderName: 'Vogue & Wallpaper Editorial',
    senderEmail: 'editorial@voguemagazine.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'VW',
    subject: 'The Architecture of Modern Workspace Aesthetics (Issue 48)',
    preview: 'Curated photography and architectural retrospectives from Tokyo to New York.',
    body: 'Welcome to this month’s spatial design review. We explore how minimal studios in Brooklyn and Stockholm are designing spaces that maximize natural light and quiet focus.\n\n"The quietest interfaces are the ones that disappear when you are deep in the flow state."\n\nInside this issue:\n1. Concrete & natural timber in Nordic architecture studios\n2. The return of tactile materials and physical typography\n3. High-contrast monochrome palettes in modern industrial design.',
    receivedAt: 'Aug 13',
    category: 'feed',
    isRead: false,
    feedMeta: {
      publicationName: 'Vogue Living & Architecture',
      readingTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      issueNumber: 'Vol. 48',
      summary: 'Exploring minimal studios in Brooklyn & Stockholm maximizing natural light.'
    }
  },
  {
    id: 'em-05',
    senderName: 'TechCrunch Disrupt Wire',
    senderEmail: 'news@techcrunch.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'TC',
    subject: 'Global Email Infrastructure Shift: Why US Startups Demand Unbundled Tools',
    preview: 'Analysis on how modern founders are replacing legacy monoliths with specialized API + Screener platforms.',
    body: 'In today’s deep dive, we examine the rapid rise of unbundled platforms that unify marketing visual builders, high-throughput transactional APIs, and personal screener inboxes under a single flat billing umbrella.\n\nFounders are rejecting per-subscriber penalties in favor of honest pricing models.',
    receivedAt: 'Aug 12',
    category: 'feed',
    isRead: true,
    feedMeta: {
      publicationName: 'TechCrunch Infrastructure',
      readingTime: '3 min read',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      issueNumber: 'Edition 312',
      summary: 'Why modern founders are ditching legacy marketing clouds for unbundled screener tools.'
    }
  },
  {
    id: 'em-06',
    senderName: 'AWS Billing & Infrastructure',
    senderEmail: 'no-reply-billing@amazon.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'AW',
    subject: 'Invoice #INV-2026-0814: US-East Edge Transit & Dedicated IP Nodes',
    preview: 'Your receipt for payment processed on Aug 14, 2026.',
    body: 'Payment Receipt: $1,420.00 processed successfully for Dedicated Direct Connect IP transit routes in us-east-1 and us-west-2.\n\nPayment Method: Visa ending in 4242\nStatus: Paid in Full\nTax ID: US-94820149',
    receivedAt: 'Aug 14',
    category: 'papertrail',
    isRead: true,
    paperTrailMeta: {
      amount: '$1,420.00',
      merchant: 'Amazon Web Services',
      orderNumber: 'INV-2026-0814',
      category: 'Invoice',
      status: 'Paid',
      pdfUrl: '#'
    }
  },
  {
    id: 'em-07',
    senderName: 'Cloudflare Zero Trust Security',
    senderEmail: 'notifications@cloudflare.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'CF',
    subject: 'Automated SSL Renewal: *.sendline.io & Custom Domains (BIMI Active)',
    preview: 'TLS 1.3 certificates renewed with 100% CAA & DMARC compliance.',
    body: 'Security Alert: All edge certificates for sendline.io and custom tenant domains have been renewed with zero downtime. BIMI SVG logo verification is active across Gmail and Yahoo Webmail.',
    receivedAt: 'Aug 11',
    category: 'papertrail',
    isRead: true,
    paperTrailMeta: {
      amount: '$0.00',
      merchant: 'Cloudflare Edge SSL',
      orderNumber: 'SEC-8921-CF',
      category: 'Alert',
      status: 'Renewed',
      pdfUrl: '#'
    }
  },
  {
    id: 'em-08',
    senderName: 'Apple Developer Subscriptions',
    senderEmail: 'no_reply@email.apple.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'AP',
    subject: 'Your receipt from Apple: Developer Enterprise Program Annual Renewal',
    preview: 'Invoice #AP-99201 for $299.00 processed successfully.',
    body: 'Apple Developer Enterprise Program\nOrder ID: W992810481\nDocument No: 18291048102\nAmount: $299.00\nBilled to: Sendline Technologies Inc.',
    receivedAt: 'Aug 09',
    category: 'papertrail',
    isRead: true,
    paperTrailMeta: {
      amount: '$299.00',
      merchant: 'Apple Services',
      orderNumber: 'W992810481',
      category: 'Receipt',
      status: 'Paid',
      pdfUrl: '#'
    }
  },
  {
    id: 'em-09',
    senderName: 'SaaS Newsletter Weekly',
    senderEmail: 'newsletter@saasweekly-digest.com',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'SW',
    subject: 'Old Marketing Trends from 2024 Archival Digest',
    preview: 'Outdated email benchmark report archive from previous quarter.',
    body: 'Hi Mehmet,\n\nHere is the archived newsletter issue covering legacy email marketing benchmarks and click-through metrics.\n\nBest,\nSaaS Weekly Team',
    receivedAt: 'Aug 02',
    category: 'imbox',
    isRead: true,
    isDeleted: true,
    deletedAt: '2 days ago',
    tags: ['Newsletter', 'Archive']
  },
  {
    id: 'em-10',
    senderName: 'Promo Offers Depot',
    senderEmail: 'offers@promodepot-sales.net',
    recipientEmail: 'mehmet@sendline.io',
    avatar: 'PO',
    subject: 'Flash Sale: 50% Off Conference Tickets',
    preview: 'Expired promotional discount on summer design summit tickets.',
    body: 'Claim your expired discount pass for last week conference in San Francisco.\n\nRegards,\nPromo Team',
    receivedAt: 'Jul 28',
    category: 'imbox',
    isRead: true,
    isDeleted: true,
    deletedAt: '3 days ago',
    tags: ['Promos']
  }
];

export const INITIAL_LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'tier-bronze',
    name: 'Bronze Standard',
    minPoints: 0,
    perks: ['Standard transactional API routing', '5 campaign templates', 'Shared IP pool'],
    badgeColor: '#CD7F32',
    memberCount: 14200,
    discountRate: '5% OFF'
  },
  {
    id: 'tier-silver',
    name: 'Silver Velocity',
    minPoints: 1000,
    perks: ['Priority SMTP delivery', 'Full visual template library', 'Custom Screener filters', '10% drop discounts'],
    badgeColor: '#94A3B8',
    memberCount: 6850,
    discountRate: '10% OFF'
  },
  {
    id: 'tier-gold',
    name: 'Gold Sovereign',
    minPoints: 5000,
    perks: ['Dedicated US Warm IP pool', 'Unlimited custom domains', 'Sub-25ms API guarantee', '15% automatic checkout boost'],
    badgeColor: '#F59E0B',
    memberCount: 2190,
    discountRate: '15% OFF'
  },
  {
    id: 'tier-platinum',
    name: 'Platinum Luminary',
    minPoints: 15000,
    perks: ['VIP Concierge & 24/7 Slack channel', 'Dedicated deliverability engineer', 'Custom BIMI certificate support', '25% VIP savings'],
    badgeColor: '#818CF8',
    memberCount: 430,
    discountRate: '25% OFF'
  }
];

export const INITIAL_LOYALTY_MEMBERS: LoyaltyMember[] = [
  {
    id: 'mem-01',
    name: 'Sophia Bennett',
    email: 'sophia.b@nordicapparel.com',
    points: 8450,
    tier: 'Gold Sovereign',
    referrals: 14,
    lastActive: 'Today at 08:30 AM',
    lifetimeValue: '$14,800'
  },
  {
    id: 'mem-02',
    name: 'Liam Sterling',
    email: 'liam@apexsupplements.us',
    points: 16200,
    tier: 'Platinum Luminary',
    referrals: 32,
    lastActive: 'Yesterday',
    lifetimeValue: '$38,400'
  },
  {
    id: 'mem-03',
    name: 'Elena Rostova',
    email: 'elena@modernform.io',
    points: 3400,
    tier: 'Silver Velocity',
    referrals: 6,
    lastActive: '2 days ago',
    lifetimeValue: '$6,200'
  },
  {
    id: 'mem-04',
    name: 'Marcus Vance',
    email: 'marcus@velocitycoffee.co',
    points: 6200,
    tier: 'Gold Sovereign',
    referrals: 11,
    lastActive: '3 days ago',
    lifetimeValue: '$11,900'
  }
];

export const INITIAL_REWARDS: CouponReward[] = [
  {
    id: 'rwd-01',
    code: 'GLOBAL-VIP-15',
    discount: '15% OFF Checkout',
    pointsCost: 500,
    expiresIn: '30 days',
    claimedCount: 842,
    active: true
  },
  {
    id: 'rwd-02',
    code: 'US-DELIVERY-FREE',
    discount: 'Free Express US Shipping',
    pointsCost: 750,
    expiresIn: '45 days',
    claimedCount: 1205,
    active: true
  },
  {
    id: 'rwd-03',
    code: 'DEDICATED-IP-PASS',
    discount: '1 Month Free Dedicated IP',
    pointsCost: 2000,
    expiresIn: '60 days',
    claimedCount: 310,
    active: true
  }
];

export const INITIAL_DOMAINS: DomainRecord[] = [
  {
    id: 'dom-01',
    domain: 'sendline.io',
    status: 'verified',
    spf: true,
    dkim: true,
    dmarc: true,
    bimi: true,
    spfStatus: 'valid',
    dkimStatus: 'valid',
    dmarcStatus: 'valid',
    bimiStatus: 'valid',
    region: 'US-East (N. Virginia)',
    monthlyVolume: 1850000,
    created: 'Jan 15, 2026',
    createdAt: 'Jan 15, 2026'
  },
  {
    id: 'dom-02',
    domain: 'mail.nordicapparel.com',
    status: 'verified',
    spf: true,
    dkim: true,
    dmarc: true,
    bimi: true,
    spfStatus: 'valid',
    dkimStatus: 'valid',
    dmarcStatus: 'valid',
    bimiStatus: 'valid',
    region: 'US-East-1',
    monthlyVolume: 420000,
    created: 'Mar 22, 2026',
    createdAt: 'Mar 22, 2026'
  },
  {
    id: 'dom-03',
    domain: 'notify.apexsupplements.us',
    status: 'verified',
    spf: true,
    dkim: true,
    dmarc: true,
    bimi: false,
    spfStatus: 'valid',
    dkimStatus: 'valid',
    dmarcStatus: 'valid',
    bimiStatus: 'pending',
    region: 'US-West-2',
    monthlyVolume: 140800,
    created: 'Jun 10, 2026',
    createdAt: 'Jun 10, 2026'
  }
];

export const INITIAL_SUBSCRIBERS: SubscriberContact[] = [
  {
    id: 'sub-01',
    name: 'Sophia Bennett',
    email: 'sophia.b@nordicapparel.com',
    status: 'VIP',
    tags: ['VIP High-Spender', 'Fashion DTC', 'Loyalty Gold'],
    openRate: 78.4,
    clickRate: 34.2,
    ordersCount: 14,
    totalSpent: '$4,850.00',
    joinedAt: 'Jan 12, 2026',
    lastActive: 'Today at 08:30 AM',
    source: 'Storefront Checkout'
  },
  {
    id: 'sub-02',
    name: 'Liam Sterling',
    email: 'liam@apexsupplements.us',
    status: 'VIP',
    tags: ['VIP High-Spender', 'Wholesale', 'Loyalty Platinum'],
    openRate: 88.0,
    clickRate: 42.5,
    ordersCount: 22,
    totalSpent: '$12,400.00',
    joinedAt: 'Feb 04, 2026',
    lastActive: 'Yesterday',
    source: 'API Partner Sync'
  },
  {
    id: 'sub-03',
    name: 'Elena Rostova',
    email: 'elena@modernform.io',
    status: 'Active',
    tags: ['Newsletter Reader', 'Design Studio'],
    openRate: 64.5,
    clickRate: 22.0,
    ordersCount: 5,
    totalSpent: '$1,240.00',
    joinedAt: 'Mar 18, 2026',
    lastActive: '2 days ago',
    source: 'Website Opt-In Form'
  },
  {
    id: 'sub-04',
    name: 'Marcus Vance',
    email: 'marcus@velocitycoffee.co',
    status: 'Active',
    tags: ['Roastery Club', 'Repeat Buyer'],
    openRate: 58.2,
    clickRate: 19.4,
    ordersCount: 8,
    totalSpent: '$2,190.00',
    joinedAt: 'Apr 02, 2026',
    lastActive: '3 days ago',
    source: 'Instagram Drop Campaign'
  },
  {
    id: 'sub-05',
    name: 'Chloe Laurent',
    email: 'chloe.laurent@atelier-paris.fr',
    status: 'Active',
    tags: ['Editorial Subscriber', 'EU Customer'],
    openRate: 72.1,
    clickRate: 28.6,
    ordersCount: 3,
    totalSpent: '$890.00',
    joinedAt: 'May 15, 2026',
    lastActive: 'Yesterday',
    source: 'Newsletter Landing'
  },
  {
    id: 'sub-06',
    name: 'David Thorne',
    email: 'david@acme-ventures.com',
    status: 'Active',
    tags: ['Investor', 'Founder Circle'],
    openRate: 91.5,
    clickRate: 45.0,
    ordersCount: 2,
    totalSpent: '$600.00',
    joinedAt: 'Jun 01, 2026',
    lastActive: 'Today at 09:12 AM',
    source: 'Direct Invitation'
  },
  {
    id: 'sub-07',
    name: 'Sarah Lin',
    email: 'sarah.lin@stripe.com',
    status: 'VIP',
    tags: ['Infrastructure Lead', 'API Developer', 'VIP'],
    openRate: 95.0,
    clickRate: 52.0,
    ordersCount: 6,
    totalSpent: '$3,200.00',
    joinedAt: 'Jun 20, 2026',
    lastActive: '10 mins ago',
    source: 'Developer Portal'
  },
  {
    id: 'sub-08',
    name: 'Oliver Wright',
    email: 'oliver.wright@craftbrew.co.uk',
    status: 'Unsubscribed',
    tags: ['Lapsed Buyer', 'Seasonal'],
    openRate: 12.0,
    clickRate: 0.0,
    ordersCount: 1,
    totalSpent: '$140.00',
    joinedAt: 'Feb 10, 2026',
    lastActive: '45 days ago',
    source: 'Pop-up Modal'
  }
];

export const INITIAL_SEGMENTS: AudienceSegment[] = [
  {
    id: 'seg-01',
    name: 'US VIP Customers & Active Subscribers',
    description: 'High-value customers with lifetime spend > $1,000 and 50%+ open engagement',
    filterRules: ['Total spend > $1,000', 'Open rate > 50%', 'Location = United States'],
    subscriberCount: 148200,
    averageOpenRate: 54.2,
    growthRate: '+12.4% this month',
    color: '#38d9a9',
    isDynamic: true,
    createdAt: 'Jan 15, 2026'
  },
  {
    id: 'seg-02',
    name: 'Editorial Guild (Global)',
    description: 'Subscribers who read long-form essays and digest newsletters regularly',
    filterRules: ['Tagged as "Editorial"', 'Last active < 14 days', 'Unsubscribed = False'],
    subscriberCount: 92400,
    averageOpenRate: 62.8,
    growthRate: '+8.1% this month',
    color: '#60a5fa',
    isDynamic: true,
    createdAt: 'Feb 01, 2026'
  },
  {
    id: 'seg-03',
    name: 'Top 10% Lifetime Value Spenders',
    description: 'Premier patrons eligible for exclusive drops, early access, and loyalty multipliers',
    filterRules: ['Lifetime Value in top 10%', 'Orders count >= 4', 'Zero chargebacks'],
    subscriberCount: 18500,
    averageOpenRate: 69.4,
    growthRate: '+15.6% this month',
    color: '#f59e0b',
    isDynamic: true,
    createdAt: 'Mar 10, 2026'
  },
  {
    id: 'seg-04',
    name: 'Global SaaS & Developer Segment',
    description: 'Developers and technical buyers using transactional SMTP and API keys',
    filterRules: ['API Key generated = True', 'Domain verified = True', 'Environment = Production'],
    subscriberCount: 210000,
    averageOpenRate: 48.7,
    growthRate: '+22.0% this month',
    color: '#a78bfa',
    isDynamic: true,
    createdAt: 'Apr 20, 2026'
  },
  {
    id: 'seg-05',
    name: 'New Signups (Last 30 Days)',
    description: 'Fresh subscribers enrolled in the automated 4-step onboarding sequence',
    filterRules: ['Joined date < 30 days', 'Welcome email delivered = True'],
    subscriberCount: 34200,
    averageOpenRate: 71.0,
    growthRate: '+34.2% this month',
    color: '#ec4899',
    isDynamic: true,
    createdAt: 'Jul 01, 2026'
  },
  {
    id: 'seg-06',
    name: 'Inactive / Lapsed Contacts (60+ Days)',
    description: 'Contacts with zero opens in 60 days queued for re-engagement or sunset scrub',
    filterRules: ['Last open > 60 days', 'Last click > 60 days'],
    subscriberCount: 8400,
    averageOpenRate: 8.2,
    growthRate: '-4.5% cleansed',
    color: '#94a3b8',
    isDynamic: true,
    createdAt: 'May 12, 2026'
  }
];

export const INITIAL_FORMS: any[] = [
  {
    id: 'form-catalyst-growth-contact',
    title: 'Catalyst Growth Capital Contact Form',
    slug: 'catalyst-growth-capital-contact',
    description: 'Direct confidential consultation request for high-growth tech entrepreneurs and founders seeking Series A-B syndication.',
    category: 'Contact',
    status: 'Published',
    targetTag: 'Growth-Capital-Inquiry',
    targetSegment: 'VIP Spenders & High-LTV VIPs ($1k+)',
    submitButtonText: 'Submit Inquiry',
    successMessage: 'Thank you for reaching out to Catalyst Growth Capital. A partner will review your inquiry within 24 business hours.',
    redirectUrl: '',
    headerLogoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    accentColor: '#0f172a',
    fontFamily: 'sans',
    buttonShape: 'rounded',
    viewsCount: 1420,
    submissionsCount: 184,
    conversionRate: 12.9,
    createdAt: 'Aug 10, 2026',
    isStandaloneHosted: true,
    hostedPermaUrl: 'https://sendline.co/f/catalyst-growth-contact',
    fields: [
      {
        id: 'f-name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'e.g. Alexander Hayes',
        required: true,
        helpText: 'Primary founder or managing partner contact'
      },
      {
        id: 'f-email',
        type: 'email',
        label: 'Work Email Address',
        placeholder: 'alex@company.com',
        required: true
      },
      {
        id: 'f-phone',
        type: 'phone',
        label: 'Direct Phone Number',
        placeholder: '+1 (555) 019-2834',
        required: false
      },
      {
        id: 'f-company',
        type: 'text',
        label: 'Company / Venture Name',
        placeholder: 'e.g. Apex Neural Labs',
        required: true
      },
      {
        id: 'f-stage',
        type: 'dropdown',
        label: 'Current Funding Round & Stage',
        required: true,
        options: ['Seed / Pre-Series A ($1M - $3M)', 'Series A ($5M - $15M)', 'Series B ($15M - $40M)', 'Growth Equity / Bridge', 'Advisory & Strategic']
      },
      {
        id: 'f-arr',
        type: 'dropdown',
        label: 'Current ARR / Revenue Run-Rate',
        required: true,
        options: ['Pre-Revenue', '$500k - $1M ARR', '$1M - $5M ARR', '$5M - $20M ARR', '$20M+ ARR']
      },
      {
        id: 'f-message',
        type: 'textarea',
        label: 'Brief Overview / Investment Thesis',
        placeholder: 'Tell us about your core traction, proprietary defensibility, and capital allocation plan...',
        required: true
      },
      {
        id: 'f-consent',
        type: 'checkbox',
        label: 'I consent to confidential partner correspondence and receiving Sendline transactional updates.',
        required: true
      }
    ]
  },
  {
    id: 'form-waitlist-atelier',
    title: 'Autumn Editorial Capsule Waitlist',
    slug: 'autumn-editorial-capsule-waitlist',
    description: 'Exclusive 48-hour early access reservation for the limited Parisian Atelier release.',
    category: 'Waitlist',
    status: 'Published',
    targetTag: 'Autumn-Waitlist-EarlyAccess',
    targetSegment: 'New Signups (Last 30 Days)',
    submitButtonText: 'Reserve My Early Access Pass',
    successMessage: 'You are on the VIP reservation list! Check your inbox for your secret unlock passcode.',
    accentColor: '#d97706',
    fontFamily: 'serif',
    buttonShape: 'pill',
    viewsCount: 3890,
    submissionsCount: 1120,
    conversionRate: 28.7,
    createdAt: 'Aug 04, 2026',
    isStandaloneHosted: true,
    hostedPermaUrl: 'https://sendline.co/f/autumn-capsule-vip',
    fields: [
      {
        id: 'f-name',
        type: 'text',
        label: 'First & Last Name',
        placeholder: 'Sophia Laurent',
        required: true
      },
      {
        id: 'f-email',
        type: 'email',
        label: 'VIP Email Address',
        placeholder: 'sophia@parisian.fr',
        required: true
      },
      {
        id: 'f-pref',
        type: 'dropdown',
        label: 'Preferred Size / Silhouette',
        required: true,
        options: ['Petite / XS-S', 'Regular / M-L', 'Tailored / XL+', 'Accessories Only']
      },
      {
        id: 'f-notes',
        type: 'textarea',
        label: 'Styling Notes or Special Requests',
        placeholder: 'Let us know if you have specific runway pieces in mind...',
        required: false
      }
    ]
  },
  {
    id: 'form-creator-grant-application',
    title: 'Sendline Creator Grant 2026',
    slug: 'creator-grant-application-2026',
    description: 'Apply for a $10,000 non-dilutive independent publishing & newsletter creation grant.',
    category: 'Application',
    status: 'Published',
    targetTag: 'Creator-Grant-Applicant',
    submitButtonText: 'Submit Grant Application',
    successMessage: 'Application received! Grant recipients will be announced on October 1st, 2026.',
    accentColor: '#059669',
    fontFamily: 'editorial',
    buttonShape: 'sharp',
    viewsCount: 940,
    submissionsCount: 88,
    conversionRate: 9.3,
    createdAt: 'Jul 28, 2026',
    isStandaloneHosted: true,
    hostedPermaUrl: 'https://sendline.co/f/creator-grant-2026',
    fields: [
      {
        id: 'f-name',
        type: 'text',
        label: 'Creator / Publication Name',
        placeholder: 'Elena Rostova',
        required: true
      },
      {
        id: 'f-email',
        type: 'email',
        label: 'Contact Email',
        placeholder: 'elena@atelier.io',
        required: true
      },
      {
        id: 'f-url',
        type: 'text',
        label: 'Newsletter / Portfolio URL',
        placeholder: 'https://substack.com/@elena or sendline.io/elena',
        required: true
      },
      {
        id: 'f-pitch',
        type: 'textarea',
        label: 'Your Vision & Grant Allocation Plan (Max 300 words)',
        placeholder: 'Explain how this grant will scale your editorial output and readership...',
        required: true
      }
    ]
  }
];

export const INITIAL_FORM_SUBMISSIONS: any[] = [
  {
    id: 'subm-01',
    formId: 'form-catalyst-growth-contact',
    formTitle: 'Catalyst Growth Capital Contact Form',
    submittedAt: '12 minutes ago',
    contactName: 'Marcus Vance',
    contactEmail: 'marcus.vance@studio.co',
    status: 'New',
    data: {
      'Full Name': 'Marcus Vance',
      'Work Email Address': 'marcus.vance@studio.co',
      'Direct Phone Number': '+1 212-555-0194',
      'Company / Venture Name': 'Vance Spatial Computing',
      'Current Funding Round & Stage': 'Series A ($5M - $15M)',
      'Current ARR / Revenue Run-Rate': '$1M - $5M ARR',
      'Brief Overview / Investment Thesis': 'Developing next-generation WebGL & WebGPU architectural visualizer pipelines with 45 enterprise accounts.'
    }
  },
  {
    id: 'subm-02',
    formId: 'form-catalyst-growth-contact',
    formTitle: 'Catalyst Growth Capital Contact Form',
    submittedAt: '2 hours ago',
    contactName: 'Chloe Dupuis',
    contactEmail: 'chloe.dupuis@montreal.ca',
    status: 'Processed',
    data: {
      'Full Name': 'Chloe Dupuis',
      'Work Email Address': 'chloe.dupuis@montreal.ca',
      'Company / Venture Name': 'Nordic Supply Tech',
      'Current Funding Round & Stage': 'Seed / Pre-Series A ($1M - $3M)',
      'Current ARR / Revenue Run-Rate': '$500k - $1M ARR',
      'Brief Overview / Investment Thesis': 'Zero-emission freight logistics matching engine operating across US-Canada trade corridors.'
    }
  },
  {
    id: 'subm-03',
    formId: 'form-waitlist-atelier',
    formTitle: 'Autumn Editorial Capsule Waitlist',
    submittedAt: '4 hours ago',
    contactName: 'Sophia Laurent',
    contactEmail: 'sophia.laurent@parisian.fr',
    status: 'Processed',
    data: {
      'First & Last Name': 'Sophia Laurent',
      'VIP Email Address': 'sophia.laurent@parisian.fr',
      'Preferred Size / Silhouette': 'Petite / XS-S',
      'Styling Notes or Special Requests': 'Looking forward to the trench coats and cashmere blend scarves.'
    }
  }
];

export const INITIAL_CHECKOUT_PRODUCTS: any[] = [
  {
    id: 'prod-editorial-bundle',
    title: 'Complete Editorial Masterclass + Figma UI Kit',
    slug: 'editorial-masterclass-bundle',
    description: 'Lifetime access to 14 high-definition video modules, 45 production-ready email templates, and the Sendline UI design kit.',
    price: 149,
    currency: 'USD',
    pricingType: 'one_time',
    category: 'Digital Product',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31727221eb?w=600&auto=format&fit=crop&q=80',
    accentColor: '#0f172a',
    buttonText: 'Buy Now — $149',
    successRedirectUrl: 'https://sendline.co/welcome/masterclass',
    features: [
      '14 HD Video Modules with step-by-step email design breakdowns',
      '45 HTML & Responsive React Email templates (Tailwind-compatible)',
      'Figma Design System UI kit with auto-layout and variant tokens',
      'Private Discord access to 1,200+ top email creators'
    ],
    totalSalesCount: 142,
    totalRevenue: 21158,
    hostedPayLinkUrl: 'https://sendline.co/pay/editorial-masterclass',
    allowCouponCodes: true,
    requireBillingAddress: true,
    requirePhone: false,
    createdAt: 'Jul 15, 2026'
  },
  {
    id: 'prod-creative-strategy-consult',
    title: '1-on-1 Newsletter Strategy & Audit Session',
    slug: 'newsletter-strategy-audit',
    description: '60-minute private strategy session with Sendline lead deliverability architects to 2x open rates and repair domain reputation.',
    price: 350,
    currency: 'USD',
    pricingType: 'one_time',
    category: 'Service / Consultation',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    accentColor: '#d97706',
    buttonText: 'Book Strategy Session — $350',
    features: [
      'Comprehensive DNS, SPF, DKIM & DMARC authentication teardown',
      'Subject line & copy psychological hook audit on your top 5 campaigns',
      'Custom retention & reactivation email automation blueprint',
      'Full video recording & prioritized action checklist provided after call'
    ],
    totalSalesCount: 38,
    totalRevenue: 13300,
    hostedPayLinkUrl: 'https://sendline.co/pay/strategy-audit',
    allowCouponCodes: true,
    requireBillingAddress: false,
    requirePhone: true,
    createdAt: 'Aug 01, 2026'
  },
  {
    id: 'prod-inner-circle-membership',
    title: 'Sendline Inner Circle VIP Syndicate',
    slug: 'inner-circle-vip-syndicate',
    description: 'Monthly mastermind membership with bi-weekly live teardowns, subscriber growth office hours, and exclusive sponsor introductions.',
    price: 49,
    currency: 'USD',
    pricingType: 'recurring_monthly',
    category: 'Membership',
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    accentColor: '#059669',
    buttonText: 'Join Inner Circle — $49/mo',
    features: [
      'Bi-weekly live video masterminds with 7-figure newsletter operators',
      'Direct sponsor database with 300+ vetted newsletter brand buyers',
      'Early beta access to all new Sendline transactional & AI studio tools',
      'Cancel anytime with 1-click in your customer billing portal'
    ],
    totalSalesCount: 210,
    totalRevenue: 10290,
    hostedPayLinkUrl: 'https://sendline.co/pay/inner-circle-vip',
    allowCouponCodes: true,
    requireBillingAddress: true,
    requirePhone: false,
    createdAt: 'Jun 10, 2026'
  }
];

export const INITIAL_CHECKOUT_ORDERS: any[] = [
  {
    id: 'ord-8491',
    productId: 'prod-editorial-bundle',
    productTitle: 'Complete Editorial Masterclass + Figma UI Kit',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@atelier.io',
    amount: 149,
    currency: 'USD',
    status: 'Paid',
    stripePaymentIntentId: 'pi_3P9x4820KLa9183',
    createdAt: '35 minutes ago'
  },
  {
    id: 'ord-8490',
    productId: 'prod-inner-circle-membership',
    productTitle: 'Sendline Inner Circle VIP Syndicate',
    customerName: 'Kenji Sato',
    customerEmail: 'kenji.sato@ginza.jp',
    amount: 49,
    currency: 'USD',
    status: 'Paid',
    stripePaymentIntentId: 'pi_3P9x11988La102',
    createdAt: '3 hours ago'
  },
  {
    id: 'ord-8489',
    productId: 'prod-creative-strategy-consult',
    productTitle: '1-on-1 Newsletter Strategy & Audit Session',
    customerName: 'Alexander Hayes',
    customerEmail: 'alex@apexneurallabs.com',
    amount: 350,
    currency: 'USD',
    status: 'Paid',
    stripePaymentIntentId: 'pi_3P9w771092La990',
    createdAt: '1 day ago'
  }
];

export const mockTemplates = INITIAL_TEMPLATES;
export const mockCampaigns = INITIAL_CAMPAIGNS;
export const mockSubscribers = INITIAL_SUBSCRIBERS;
export const mockSegments = INITIAL_SEGMENTS;
export const mockTransactionalLogs = INITIAL_TRANSACTIONAL_LOGS;
export const mockTransactionalTemplates = INITIAL_TRANSACTIONAL_TEMPLATES;
export const mockTransactionalWebhooks = INITIAL_TRANSACTIONAL_WEBHOOKS;
export const mockBlockedContacts = INITIAL_BLOCKED_CONTACTS;
export const mockApiKeys = INITIAL_API_KEYS;
export const mockScreenerItems = INITIAL_SCREENER_ITEMS;
export const mockInboxEmails = INITIAL_EMAILS;
export const mockHeyEmails = INITIAL_EMAILS; // Backwards compatibility alias
export const mockLoyaltyTiers = INITIAL_LOYALTY_TIERS;
export const mockLoyaltyMembers = INITIAL_LOYALTY_MEMBERS;
export const mockCouponRewards = INITIAL_REWARDS;
export const mockDomains = INITIAL_DOMAINS;
export const mockForms = INITIAL_FORMS;
export const mockFormSubmissions = INITIAL_FORM_SUBMISSIONS;
export const mockCheckoutProducts = INITIAL_CHECKOUT_PRODUCTS;
export const mockCheckoutOrders = INITIAL_CHECKOUT_ORDERS;
