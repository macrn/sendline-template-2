import { FormItem, FormFieldConfig } from '../types';

export interface FormTemplatePreset {
  id: string;
  name: string;
  formType: 'link_in_bio' | 'popup' | 'inline' | 'full_page' | 'video' | 'spinner' | 'countdown';
  category: 'Contact' | 'Lead Capture' | 'Waitlist' | 'Feedback' | 'Application' | 'Registration' | 'Link in Bio' | 'Newsletter' | 'Freebie';
  description: string;
  thumbnailColor: string;
  previewImage?: string;
  headline: string;
  subtitle: string;
  bodyText?: string;
  badgeText?: string;
  scriptOverlay?: string;
  monogram?: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans' | 'mono' | 'display-slab' | 'script-hand';
  frameShape: 'rounded' | 'arch' | 'scalloped' | 'square' | 'pill' | 'polaroid';
  paletteTheme: 'sunflower' | 'lavender' | 'olive' | 'terracotta' | 'sand' | 'obsidian';
  buttonShape: 'pill' | 'rounded' | 'sharp' | 'outline';
  submitButtonText: string;
  fields: FormFieldConfig[];
  
  // 2-Column & Specialized Section Configurations
  layoutMode?: 'single' | 'split_right' | 'split_left';
  showCountdown?: boolean;
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

  // Styling overrides
  cardBgColor?: string;
  bgColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  fieldStyle?: 'filled_sharp' | 'filled_rounded' | 'filled_pill' | 'filled_oval' | 'transparent' | 'outlined_sharp' | 'outlined_rounded' | 'outlined_pill' | 'outlined_oval' | 'underline';
  fieldBorderColor?: string;
  fieldBgColor?: string;
  fieldTextColor?: string;
  textAlign?: 'left' | 'center' | 'right';

  links?: Array<{ id: string; title: string; subtitle?: string; url: string; icon?: string; badge?: string; highlighted?: boolean }>;
  thankYouHeadline?: string;
  thankYouMessage?: string;
  thankYouActionType?: 'message' | 'download' | 'redirect';
  thankYouDownloadUrl?: string;
  thankYouDownloadButtonText?: string;
  thankYouRedirectUrl?: string;
  targetTag: string;
  suggestedSegment: string;
}

export const PREBUILT_FORM_TEMPLATES: FormTemplatePreset[] = [
  // 1. LINK IN BIO TEMPLATES
  {
    id: 'tmpl-form-bio-freebie',
    name: 'Link in Bio with Freebie',
    formType: 'link_in_bio',
    category: 'Freebie',
    description: 'Share your curated links, offer a downloadable PDF freebie guide, and capture newsletter subscribers directly from Instagram or TikTok.',
    thumbnailColor: 'from-[#FAF7F2] to-[#E8DFC8]',
    previewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    headline: 'Maison Botanique',
    subtitle: 'Holistic skincare rituals & mindful living guides.',
    bodyText: 'Subscribe below to receive our complimentary 24-page Morning Dew Ritual Guide directly to your inbox.',
    badgeText: 'Free Download',
    scriptOverlay: 'Pure Rituals',
    monogram: 'MB',
    accentColor: '#4A5D4E',
    fontFamily: 'serif',
    frameShape: 'rounded',
    paletteTheme: 'sand',
    buttonShape: 'pill',
    submitButtonText: 'Send Me the Free Guide',
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Elena', required: true },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'elena@atelier.com', required: true }
    ],
    links: [
      { id: 'l1', title: 'Read the Autumn Editorial Issue', subtitle: '3,000+ words on conscious apothecary', url: 'https://sendline.co/editorial/autumn', badge: 'Latest', highlighted: true },
      { id: 'l2', title: 'Shop Micro-Batch Botanical Elixirs', subtitle: 'Handcrafted cold-pressed formulas', url: 'https://sendline.co/shop' },
      { id: 'l3', title: 'Book 1-on-1 Skin Consultation', subtitle: '45-min bespoke virtual diagnosis', url: 'https://sendline.co/consult' },
      { id: 'l4', title: 'Listen to the Morning Ritual Playlist', subtitle: 'Ambient vinyl selections on Spotify', url: 'https://spotify.com' }
    ],
    thankYouHeadline: 'Your Ritual Guide is Ready ✨',
    thankYouMessage: 'We have dispatched your free 24-page guide to your inbox. You can also download it instantly below.',
    thankYouActionType: 'download',
    thankYouDownloadUrl: 'https://sendline.co/downloads/morning-dew-guide.pdf',
    thankYouDownloadButtonText: 'Download PDF Guide (14MB)',
    targetTag: 'Bio-Freebie-Lead',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-bio-contact',
    name: 'Sensory Renewal Spa & Consultation Bio',
    formType: 'link_in_bio',
    category: 'Contact',
    description: 'Boutique wellness bio featuring signature arch dome imagery, quick appointment inquiry form, and studio address links.',
    thumbnailColor: 'from-[#EAF2E8] to-[#D5E3D2]',
    previewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    headline: 'Santal & Sage Sanctuary',
    subtitle: 'Private hydrotherapy & sound bath sessions in Soho.',
    bodyText: 'Inquire about private sanctuary buyouts, couples retreat packages, or corporate wellness sessions.',
    badgeText: 'Sanctuary Concierge',
    scriptOverlay: 'Serene Living',
    monogram: 'SS',
    accentColor: '#2D5A27',
    fontFamily: 'display-slab',
    frameShape: 'arch',
    paletteTheme: 'olive',
    buttonShape: 'sharp',
    submitButtonText: 'Request Sanctuary Booking',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Alexander Hayes', required: true },
      { id: 'f2', type: 'email', label: 'Contact Email', placeholder: 'alex@company.com', required: true },
      { id: 'f3', type: 'dropdown', label: 'Preferred Experience', required: true, options: ['Private Sound Bath (60m)', 'Herbal Hydrotherapy Immersion', 'Full-Day Studio Buyout'] },
      { id: 'f4', type: 'textarea', label: 'Preferred Dates & Guest Count', placeholder: 'Let us know your target weekend and headcount...', required: false }
    ],
    links: [
      { id: 'l1', title: 'View Treatment & Service Menu', subtitle: 'Organic botanical facials & thermal baths', url: 'https://sendline.co/menu' },
      { id: 'l2', title: 'Directions & Studio Location', subtitle: '442 Broome St, New York, NY', url: 'https://maps.google.com' }
    ],
    thankYouHeadline: 'Booking Request Received',
    thankYouMessage: 'Our sanctuary concierge will confirm availability and send your itinerary within 4 hours.',
    thankYouActionType: 'message',
    targetTag: 'Spa-Sanctuary-Inquiry',
    suggestedSegment: 'Top 10% Lifetime Value Spenders'
  },
  {
    id: 'tmpl-form-bio-creator',
    name: 'Minimalist Creator Hub & Multi-Links',
    formType: 'link_in_bio',
    category: 'Link in Bio',
    description: 'High-contrast typography link tree with dark-mode aesthetic and fast 1-click email newsletter capture.',
    thumbnailColor: 'from-[#0C0F17] to-[#1E2430]',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    headline: 'Marc O’Connor',
    subtitle: 'Writer, Creative Director & Angel Investor.',
    bodyText: 'Join 48,000+ founders receiving my Sunday essay on aesthetics, technology, and building timeless brands.',
    badgeText: 'Sunday Dispatch',
    scriptOverlay: 'Marc Studio',
    monogram: 'MO',
    accentColor: '#FFFFFF',
    fontFamily: 'serif',
    frameShape: 'square',
    paletteTheme: 'obsidian',
    buttonShape: 'pill',
    submitButtonText: 'Join the Sunday Dispatch',
    fields: [
      { id: 'f1', type: 'email', label: 'Email Address', placeholder: 'marc@studio.co', required: true }
    ],
    links: [
      { id: 'l1', title: 'Read Sunday Monologue #48', subtitle: 'The subtle physics of product momentum', url: 'https://sendline.co/monologue/48', badge: 'New', highlighted: true },
      { id: 'l2', title: 'Angel Syndicate & Co-Invest', subtitle: 'Backing early-stage design-led software', url: 'https://sendline.co/syndicate' },
      { id: 'l3', title: 'My Essential Hardware & Workspace Rig', subtitle: 'Curated list of cameras, desks & audio gear', url: 'https://sendline.co/gear' }
    ],
    thankYouHeadline: 'Welcome to the Syndicate ☕',
    thankYouMessage: 'Check your inbox for this week’s essay on brand momentum.',
    thankYouActionType: 'message',
    targetTag: 'Creator-Dispatch-Sub',
    suggestedSegment: 'Editorial Guild (Global)'
  },

  // 2. POPUP TEMPLATES
  {
    id: 'tmpl-form-popup-discount',
    name: 'Sweet Treat VIP 10% Off Popup',
    formType: 'popup',
    category: 'Lead Capture',
    description: 'High-converting lightbox overlay featuring playful scalloped framing, bakery/pastry hero, and instant promo code reveal.',
    thumbnailColor: 'from-[#FDF2E9] to-[#F6DEC9]',
    previewImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    headline: 'Have a sweet treat on us.',
    subtitle: 'Sign up to get 10% off your first order of artisanal brioche & sourdough pastries.',
    badgeText: '10% Off Welcome Promo',
    scriptOverlay: 'Warm Oven',
    monogram: 'BA',
    accentColor: '#C05621',
    fontFamily: 'serif',
    frameShape: 'scalloped',
    paletteTheme: 'terracotta',
    buttonShape: 'pill',
    submitButtonText: 'Claim My 10% Discount',
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Claire', required: false },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'claire@email.com', required: true }
    ],
    thankYouHeadline: 'Your 10% Off Code: SWEETTREAT',
    thankYouMessage: 'Use coupon code SWEETTREAT at checkout to enjoy 10% off your entire order.',
    thankYouActionType: 'message',
    targetTag: 'Bakery-10Off-Lead',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-popup-exit-editorial',
    name: 'The Art of Slow Living Exit Popup',
    formType: 'popup',
    category: 'Freebie',
    description: 'Subtle high-aesthetic exit-intent modal presenting an exclusive digital coffee table issue before visitors leave.',
    thumbnailColor: 'from-[#FDF6E2] to-[#E2D8B3]',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    headline: 'Before you go...',
    subtitle: 'Download our complimentary 60-page retrospective on Scandinavian minimalism and craft interiors.',
    badgeText: 'Digital Monograph',
    scriptOverlay: 'Slow Living',
    monogram: 'SL',
    accentColor: '#D97706',
    fontFamily: 'serif',
    frameShape: 'arch',
    paletteTheme: 'sunflower',
    buttonShape: 'sharp',
    submitButtonText: 'Download Monograph (PDF)',
    fields: [
      { id: 'f1', type: 'email', label: 'Where should we send your copy?', placeholder: 'you@domain.com', required: true }
    ],
    thankYouHeadline: 'Your Monograph is on its way',
    thankYouMessage: 'We have sent your download link. Enjoy the peaceful read.',
    thankYouActionType: 'download',
    thankYouDownloadUrl: 'https://sendline.co/downloads/slow-living-monograph.pdf',
    thankYouDownloadButtonText: 'Download PDF Instantly',
    targetTag: 'Exit-Monograph-Lead',
    suggestedSegment: 'Editorial Guild (Global)'
  },

  // 3. INLINE FORMS
  {
    id: 'tmpl-form-inline-minimal',
    name: 'Quiet Dispatch Horizontal Bar',
    formType: 'inline',
    category: 'Newsletter',
    description: 'Clean horizontal opt-in strip with delicate hairline borders designed to embed cleanly into blog footers and website margins.',
    thumbnailColor: 'from-[#FAF7F2] to-[#E5E0D8]',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    headline: 'Stay in the loop',
    subtitle: 'Delivered every Friday. No spam, ever.',
    badgeText: 'Weekly Newsletter',
    scriptOverlay: 'Weekly Digest',
    monogram: 'SL',
    accentColor: '#18181B',
    fontFamily: 'sans',
    frameShape: 'rounded',
    paletteTheme: 'sand',
    buttonShape: 'pill',
    submitButtonText: 'Subscribe',
    fields: [
      { id: 'f1', type: 'email', label: 'Email Address', placeholder: 'Enter your email...', required: true }
    ],
    thankYouHeadline: 'Thank you for subscribing!',
    thankYouMessage: 'You are now on our private mailing list.',
    thankYouActionType: 'message',
    targetTag: 'Footer-Newsletter-Optin',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-inline-card',
    name: 'Weekly Editorial Card Opt-In',
    formType: 'inline',
    category: 'Newsletter',
    description: 'Medium-sized inline card with lilac lavender accents and quote badge for inserting between article paragraphs.',
    thumbnailColor: 'from-[#EDE9FE] to-[#DDD6FE]',
    previewImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    headline: 'Enjoying this essay?',
    subtitle: 'Get our hand-curated design essays, typography breakdowns, and creative essays delivered to your inbox every Sunday morning.',
    badgeText: 'Curated Letter',
    scriptOverlay: 'Studio Notes',
    monogram: 'ED',
    accentColor: '#7C3AED',
    fontFamily: 'serif',
    frameShape: 'rounded',
    paletteTheme: 'lavender',
    buttonShape: 'rounded',
    submitButtonText: 'Join 35,000+ Readers',
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Sophia', required: false },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'sophia@studio.com', required: true }
    ],
    thankYouHeadline: 'You’re all set!',
    thankYouMessage: 'Look out for our welcome letter in your inbox shortly.',
    thankYouActionType: 'message',
    targetTag: 'Article-Inline-Reader',
    suggestedSegment: 'Editorial Guild (Global)'
  },

  // 4. FULL PAGE FORMS
  {
    id: 'tmpl-form-fullpage-investor',
    name: 'Catalyst Growth Capital Discovery Form',
    formType: 'full_page',
    category: 'Contact',
    description: 'Comprehensive multi-field venture inquiry questionnaire with round stage, ARR metrics, and confidential submission handling.',
    thumbnailColor: 'from-[#0C0F17] to-[#1E2430]',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    headline: 'Catalyst Growth Capital',
    subtitle: 'Confidential founder discovery & venture syndication inquiry.',
    bodyText: 'We partner with visionary founders building category-defining software and AI infrastructure. Please share your overview below.',
    badgeText: 'Series A-B Syndication',
    scriptOverlay: 'Venture Partner',
    monogram: 'CG',
    accentColor: '#0F172A',
    fontFamily: 'sans',
    frameShape: 'square',
    paletteTheme: 'obsidian',
    buttonShape: 'rounded',
    submitButtonText: 'Submit Confidential Inquiry',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Alexander Hayes', required: true },
      { id: 'f2', type: 'email', label: 'Work Email', placeholder: 'alex@company.com', required: true },
      { id: 'f3', type: 'phone', label: 'Direct Phone', placeholder: '+1 (555) 019-2834', required: false },
      { id: 'f4', type: 'text', label: 'Company / Project Name', placeholder: 'Apex Neural Labs', required: true },
      { id: 'f5', type: 'dropdown', label: 'Current Funding Round', required: true, options: ['Seed / Pre-Series A ($1M - $3M)', 'Series A ($5M - $15M)', 'Series B ($15M - $40M)', 'Growth Equity'] },
      { id: 'f6', type: 'dropdown', label: 'Current ARR Run-Rate', required: true, options: ['Pre-Revenue', '$500k - $1M ARR', '$1M - $5M ARR', '$5M - $20M ARR', '$20M+ ARR'] },
      { id: 'f7', type: 'textarea', label: 'Executive Summary & Traction Overview', placeholder: 'Highlight your technical defensibility, unit economics, and growth pace...', required: true },
      { id: 'f8', type: 'checkbox', label: 'I agree to confidential investment partner review.', required: true }
    ],
    thankYouHeadline: 'Inquiry Submitted',
    thankYouMessage: 'Our investment team will review your data room metrics and reply within 24 business hours.',
    thankYouActionType: 'message',
    targetTag: 'Growth-Capital-Inquiry',
    suggestedSegment: 'US VIP Customers & Active Subscribers'
  },
  {
    id: 'tmpl-form-fullpage-waitlist',
    name: 'Autumn Atelier Capsule Waitlist',
    formType: 'full_page',
    category: 'Waitlist',
    description: 'Runway luxury reservation form with silhouette size preferences, VIP early access pass codes, and countdown styling.',
    thumbnailColor: 'from-[#FDF2E9] to-[#F6DEC9]',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    headline: 'Autumn Editorial Capsule',
    subtitle: 'Strictly limited to 150 bespoke hand-tailored pieces.',
    bodyText: 'Reserve your 48-hour early access window before the public runway release on October 1st.',
    badgeText: 'VIP Early Reservation',
    scriptOverlay: 'Parisian Atelier',
    monogram: 'AC',
    accentColor: '#C05621',
    fontFamily: 'serif',
    frameShape: 'rounded',
    paletteTheme: 'terracotta',
    buttonShape: 'pill',
    submitButtonText: 'Reserve My Private Access Pass',
    fields: [
      { id: 'f1', type: 'text', label: 'First & Last Name', placeholder: 'Sophia Laurent', required: true },
      { id: 'f2', type: 'email', label: 'VIP Email Address', placeholder: 'sophia@parisian.fr', required: true },
      { id: 'f3', type: 'dropdown', label: 'Preferred Silhouette / Size', required: true, options: ['Petite / XS-S', 'Regular / M-L', 'Tailored / XL+', 'Accessories Only'] },
      { id: 'f4', type: 'textarea', label: 'Styling Notes or Special Requests', placeholder: 'Let us know if you have specific runway pieces in mind...', required: false }
    ],
    thankYouHeadline: 'You are on the VIP List ✨',
    thankYouMessage: 'Your private reservation has been confirmed. You will receive your secret unlock key 2 hours before the public drop.',
    thankYouActionType: 'message',
    targetTag: 'Autumn-Waitlist-EarlyAccess',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },

  // 5. VIDEO & SPECIALIZED FORMS
  {
    id: 'tmpl-form-video-masterclass',
    name: 'Design Systems Masterclass Video Opt-in',
    formType: 'video',
    category: 'Lead Capture',
    description: 'High-converting video preview gate with embedded workshop clip, lesson syllabus breakdown, and instant stream access.',
    thumbnailColor: 'from-[#0C0F17] to-[#2A2E3D]',
    previewImage: 'https://images.unsplash.com/photo-1542744094-3a31727221eb?auto=format&fit=crop&w=800&q=80',
    headline: 'Mastering Typography & High-Convert Layouts',
    subtitle: 'Free 45-minute live workshop recording with Figma tokens.',
    bodyText: 'Watch how we designed and converted over $1.2M in email checkouts using clean typographic rhythm and zero bloat.',
    badgeText: 'Free 45-Min Class',
    scriptOverlay: 'Masterclass',
    monogram: 'DS',
    accentColor: '#6366F1',
    fontFamily: 'sans',
    frameShape: 'square',
    paletteTheme: 'obsidian',
    buttonShape: 'sharp',
    submitButtonText: 'Unlock Full HD Stream Instantly',
    fields: [
      { id: 'f1', type: 'text', label: 'Your Name', placeholder: 'Marc', required: true },
      { id: 'f2', type: 'email', label: 'Your Email', placeholder: 'marc@company.com', required: true }
    ],
    thankYouHeadline: 'Access Granted! Enjoy the Workshop',
    thankYouMessage: 'Your video stream is now unlocked. Click below to begin watching.',
    thankYouActionType: 'redirect',
    thankYouRedirectUrl: 'https://sendline.co/masterclass/stream-hd',
    targetTag: 'Video-Masterclass-Lead',
    suggestedSegment: 'Global SaaS & Developer Segment'
  },
  {
    id: 'tmpl-form-spinner-wheel',
    name: 'Spin-to-Win Seasonal Lucky Wheel',
    formType: 'spinner',
    category: 'Lead Capture',
    description: 'Gamified interactive spin-the-wheel coupon lead generator proven to boost e-commerce opt-in rates by 3x.',
    thumbnailColor: 'from-[#FDF6E2] to-[#E2D8B3]',
    previewImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    headline: 'Spin the Wheel to Win!',
    subtitle: 'Win up to 30% off, free shipping, or a complimentary studio gift.',
    bodyText: 'Enter your email to unlock one free spin. Every single spin wins a guaranteed prize.',
    badgeText: 'Instant Prize Wheel',
    scriptOverlay: 'Lucky Studio',
    monogram: 'LW',
    accentColor: '#D97706',
    fontFamily: 'serif',
    frameShape: 'scalloped',
    paletteTheme: 'sunflower',
    buttonShape: 'pill',
    submitButtonText: 'Spin the Wheel & Claim Prize',
    fields: [
      { id: 'f1', type: 'email', label: 'Email Address', placeholder: 'you@domain.com', required: true }
    ],
    thankYouHeadline: '🎉 You Won 20% Off!',
    thankYouMessage: 'Your exclusive discount code is LUCKY20. Applied automatically at checkout.',
    thankYouActionType: 'message',
    targetTag: 'Spinner-Wheel-Winner',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-countdown-flash',
    name: 'Flash Launch 72-Hour Countdown Registration',
    formType: 'countdown',
    category: 'Registration',
    description: 'High-urgency countdown timer registration page for product launches, webinar registrations, and secret drops.',
    thumbnailColor: 'from-[#FDF2E9] to-[#F6DEC9]',
    previewImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    headline: 'Q4 Creator Summit: 72-Hour Gate',
    subtitle: 'Seats are capped at 500 attendees. Doors open in 3 days.',
    bodyText: 'Join 12 world-class designers and operators for 2 days of intensive teardowns and scaling workshops.',
    badgeText: 'Live Countdown',
    scriptOverlay: 'Q4 Summit',
    monogram: 'CS',
    accentColor: '#C05621',
    fontFamily: 'sans',
    frameShape: 'rounded',
    paletteTheme: 'terracotta',
    buttonShape: 'pill',
    submitButtonText: 'Secure My Free Pass',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Elena Rostova', required: true },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'elena@atelier.io', required: true }
    ],
    thankYouHeadline: 'Pass Confirmed! Check Your Calendar',
    thankYouMessage: 'We have dispatched your calendar invite and access credentials to your inbox.',
    thankYouActionType: 'message',
    targetTag: 'Summit-Registration-Pass',
    suggestedSegment: 'Global SaaS & Developer Segment'
  },

  // 4. TWO-COLUMN SPLIT TEMPLATES (FLODESK SIGNATURE FULLPAGE & EDITORIAL SPLIT)
  {
    id: 'tmpl-form-countdown-waitlist-split',
    name: 'Final Hours Waitlist & Countdown (2-Column)',
    formType: 'countdown',
    category: 'Waitlist',
    description: 'Flodesk-signature 2-column waitlist split with live countdown timer, underline inputs, custom brand palette, and editorial right hero media.',
    thumbnailColor: 'from-[#F3ECE7] to-[#E3D7CE]',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    headline: 'Final hours to join the waitlist!',
    subtitle: "Can't wait for my book? Well, you have to. But not for long! Enter your details below to get first dibs on release day.",
    badgeText: 'RELEASE COUNTDOWN',
    accentColor: '#30504C',
    fontFamily: 'serif',
    frameShape: 'square',
    paletteTheme: 'sand',
    buttonShape: 'sharp',
    submitButtonText: 'SIGN ME UP',
    layoutMode: 'split_right',
    showCountdown: true,
    countdownDays: 10,
    countdownHours: 23,
    countdownMinutes: 18,
    countdownSeconds: 1,
    countdownLabelStyle: 'serif_dividers',
    countdownPosition: 'before_fields',
    cardBgColor: '#F3ECE7',
    bgColor: '#EDE3DD',
    textColor: '#1A1A1A',
    buttonBgColor: '#30504C',
    buttonTextColor: '#FFFFFF',
    fieldStyle: 'underline',
    fieldBorderColor: '#1A1A1A',
    fieldTextColor: '#1A1A1A',
    textAlign: 'left',
    fields: [
      { id: 'f1', type: 'text', label: 'First name', placeholder: 'First name', required: true },
      { id: 'f2', type: 'email', label: 'Email', placeholder: 'Email', required: true }
    ],
    thankYouHeadline: "You're on the VIP Waitlist! 🎉",
    thankYouMessage: "You'll be the first to know when the book launches, along with exclusive bonus chapters.",
    thankYouActionType: 'message',
    targetTag: 'Book-Waitlist-VIP',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-split-book-freebie',
    name: 'Author Book & Sample Chapter Download (2-Column)',
    formType: 'full_page',
    category: 'Freebie',
    description: 'High-converting editorial 2-column split with value checklist bullets and instant PDF sample chapter delivery.',
    thumbnailColor: 'from-[#F7F5F0] to-[#E9E4D8]',
    previewImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    headline: 'The Art of Intentional Design',
    subtitle: 'Download the complete 38-page Chapter One workbook and audio companion before global bookstore release.',
    scriptOverlay: 'First Look Edition',
    monogram: 'ID',
    badgeText: 'FREE PREVIEW',
    accentColor: '#8C5A41',
    fontFamily: 'serif',
    frameShape: 'rounded',
    paletteTheme: 'terracotta',
    buttonShape: 'pill',
    submitButtonText: 'Download Chapter One (PDF)',
    layoutMode: 'split_right',
    showBulletPoints: true,
    bulletPosition: 'before_fields',
    bulletPoints: [
      '38-page high-resolution PDF workbook',
      'Unabridged 25-minute author audio commentary',
      'Invitation to private live Q&A launch session'
    ],
    cardBgColor: '#FAF8F5',
    bgColor: '#F0EBE1',
    textColor: '#292524',
    buttonBgColor: '#8C5A41',
    buttonTextColor: '#FFFFFF',
    fieldStyle: 'filled_rounded',
    fieldBgColor: '#FFFFFF',
    fieldBorderColor: '#E7E5E4',
    textAlign: 'left',
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Elena', required: true },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'elena@studio.com', required: true }
    ],
    thankYouHeadline: 'Your Chapter Download is Ready! 📖',
    thankYouMessage: 'Click below to download your 38-page preview workbook immediately.',
    thankYouActionType: 'download',
    thankYouDownloadUrl: 'https://sendline.co/downloads/intentional-design-sample.pdf',
    thankYouDownloadButtonText: 'Download Preview PDF (8.4 MB)',
    targetTag: 'Book-Sample-Lead',
    suggestedSegment: 'New Signups (Last 30 Days)'
  },
  {
    id: 'tmpl-form-split-webinar-masterclass',
    name: 'Brand Architecture Live Masterclass (2-Column)',
    formType: 'countdown',
    category: 'Registration',
    description: 'Reverse 2-column split with left instructor photo, live countdown clock to event date, and seat reservation form.',
    thumbnailColor: 'from-[#EBEFF5] to-[#D5DFEC]',
    previewImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    headline: 'Designing Enduring Luxury Brands',
    subtitle: 'A 90-minute live interactive masterclass breaking down typography, negative space, and premium brand pricing.',
    badgeText: 'LIVE BROADCAST',
    monogram: 'BA',
    accentColor: '#1E3A8A',
    fontFamily: 'display-slab',
    frameShape: 'arch',
    paletteTheme: 'sand',
    buttonShape: 'pill',
    submitButtonText: 'Claim Your Complimentary Seat',
    layoutMode: 'split_left',
    showCountdown: true,
    countdownDays: 4,
    countdownHours: 14,
    countdownMinutes: 22,
    countdownSeconds: 45,
    countdownLabelStyle: 'boxes',
    countdownPosition: 'before_fields',
    cardBgColor: '#F8FAFC',
    bgColor: '#E2E8F0',
    textColor: '#0F172A',
    buttonBgColor: '#0F172A',
    buttonTextColor: '#FFFFFF',
    fieldStyle: 'outlined_rounded',
    fieldBorderColor: '#CBD5E1',
    fieldBgColor: '#FFFFFF',
    textAlign: 'left',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Marcus Vance', required: true },
      { id: 'f2', type: 'email', label: 'Work Email', placeholder: 'marcus@agency.co', required: true },
      { id: 'f3', type: 'text', label: 'Studio / Company', placeholder: 'Atelier Vance', required: false }
    ],
    thankYouHeadline: 'Seat Reserved! Check Your Calendar 🗓️',
    thankYouMessage: 'We have dispatched your calendar invite and direct Zoom link.',
    thankYouActionType: 'message',
    targetTag: 'Masterclass-Registrant',
    suggestedSegment: 'Global SaaS & Developer Segment'
  },
  {
    id: 'tmpl-form-split-vip-product-drop',
    name: 'Ceramic Studio Capsule Drop No. 04 (2-Column)',
    formType: 'countdown',
    category: 'Lead Capture',
    description: 'Urgency-driven 2-column split with countdown timer for exclusive product releases, capsule drops, and early access codes.',
    thumbnailColor: 'from-[#F9F6F0] to-[#E5DEC9]',
    previewImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    headline: 'Hand-Thrown Stoneware Series',
    subtitle: 'Limited to 100 numbered pieces. Members on this list receive passcodes 30 minutes before public opening.',
    badgeText: 'LIMITED 100 PIECES',
    scriptOverlay: 'Studio Drop 04',
    accentColor: '#A16207',
    fontFamily: 'serif',
    frameShape: 'square',
    paletteTheme: 'sunflower',
    buttonShape: 'rounded',
    submitButtonText: 'Unlock 30-Min Early Access Passcode',
    layoutMode: 'split_right',
    showCountdown: true,
    countdownDays: 2,
    countdownHours: 8,
    countdownMinutes: 45,
    countdownSeconds: 12,
    countdownLabelStyle: 'serif_dividers',
    countdownPosition: 'before_fields',
    cardBgColor: '#FAF7F2',
    bgColor: '#EDE6DA',
    textColor: '#1C1917',
    buttonBgColor: '#1C1917',
    buttonTextColor: '#FAF7F2',
    fieldStyle: 'underline',
    fieldBorderColor: '#78716C',
    fieldTextColor: '#1C1917',
    textAlign: 'left',
    fields: [
      { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Sienna', required: true },
      { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'sienna@atelier.com', required: true },
      { id: 'f3', type: 'phone', label: 'Mobile Phone (For 10-min SMS Drop Alert)', placeholder: '+1 (555) 000-0000', required: false }
    ],
    thankYouHeadline: 'You are on the Early Access Roster! 🏺',
    thankYouMessage: 'Watch your phone and inbox 30 minutes before drop time for your personal unlock passcode.',
    thankYouActionType: 'message',
    targetTag: 'Capsule-Drop-VIP',
    suggestedSegment: 'VIP High-Spenders ($200+)'
  },
  {
    id: 'tmpl-form-split-consulting-application',
    name: 'Private Brand Advisory Application (2-Column)',
    formType: 'full_page',
    category: 'Application',
    description: 'Editorial 2-column client application form with social proof testimonials, client qualification dropdowns, and bespoke layout.',
    thumbnailColor: 'from-[#F5F5F4] to-[#E7E5E4]',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    headline: 'Bespoke Executive Brand Advisory',
    subtitle: 'We partner with four founder teams per quarter. Applications are reviewed on a rolling basis within 48 hours.',
    badgeText: 'Q3 ADVISORY',
    monogram: 'EA',
    accentColor: '#44403C',
    fontFamily: 'serif',
    frameShape: 'scalloped',
    paletteTheme: 'sand',
    buttonShape: 'sharp',
    submitButtonText: 'Submit Confidential Application',
    layoutMode: 'split_right',
    showTestimonial: true,
    testimonialQuote: '"Working with this team tripled our brand authority and doubled inbound enterprise deals within four months."',
    testimonialAuthor: 'Maya Lin, Founder & CEO at Arcane Labs',
    cardBgColor: '#FFFFFF',
    bgColor: '#F5F5F4',
    textColor: '#1C1917',
    buttonBgColor: '#1C1917',
    buttonTextColor: '#FFFFFF',
    fieldStyle: 'filled_sharp',
    fieldBgColor: '#F5F5F4',
    fieldBorderColor: '#E7E5E4',
    textAlign: 'left',
    fields: [
      { id: 'f1', type: 'text', label: 'Founder / Executive Name', placeholder: 'Julian Thorne', required: true },
      { id: 'f2', type: 'email', label: 'Direct Work Email', placeholder: 'julian@company.com', required: true },
      { id: 'f3', type: 'dropdown', label: 'Current Annual Revenue Stage', required: true, options: ['$500k - $1M ARR', '$1M - $5M ARR', '$5M - $20M ARR', '$20M+ ARR'] },
      { id: 'f4', type: 'textarea', label: 'Primary Brand or Growth Bottleneck', placeholder: 'Briefly share where your brand messaging is currently falling short...', required: true }
    ],
    thankYouHeadline: 'Application Received with Care ✉️',
    thankYouMessage: 'Our principal advisor will review your submission and reach out within 48 hours.',
    thankYouActionType: 'message',
    targetTag: 'Advisory-Application-Lead',
    suggestedSegment: 'New Signups (Last 30 Days)'
  }
];
