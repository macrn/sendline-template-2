import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EmailTemplate, Campaign, EmailFrameShape, EmailFontFamily, EmailPalette, AppView, EmailSection, EmailBlockType, EmailLayoutPreset } from '../../types';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { generateEmailHtml } from './emailHtmlGenerator';
import { SectionPickerModal } from './SectionPickerModal';
import { FlodeskWizardNav, WizardStep } from './wizard/FlodeskWizardNav';
import { ChooseTemplateStep } from './wizard/ChooseTemplateStep';
import { ChooseAudienceStep, AudienceState } from './wizard/ChooseAudienceStep';
import { SendEmailStep } from './wizard/SendEmailStep';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Send, 
  Save, 
  Code, 
  Copy, 
  Check, 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Layers, 
  Star, 
  Sliders, 
  SlidersHorizontal,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Tag, 
  Ticket, 
  CheckCircle2, 
  Eye, 
  RefreshCw,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  ExternalLink,
  Download,
  X,
  Edit3,
  MousePointer,
  HelpCircle,
  Share2,
  Mail,
  Heart,
  LayoutTemplate,
  Stamp,
  Video,
  Instagram,
  Minus,
  MoveVertical,
  MapPin,
  Clock,
  ShoppingBag,
  ListChecks,
  FileText,
  Upload,
  Link2
} from 'lucide-react';

export type StudioMode = 'campaign' | 'workflow' | 'template';

interface TemplateStudioProps {
  initialTemplate?: EmailTemplate | null;
  onClose: () => void;
  onSaveCampaign: (campaign: Campaign) => void;
  onNavigate?: (view: AppView) => void;
  studioMode?: StudioMode;
  workflowContext?: {
    workflowName: string;
    stepTitle: string;
    nodeId?: string;
  };
  onSaveToWorkflow?: (updatedTemplate: EmailTemplate, sections: EmailSection[]) => void;
  onSaveToLibrary?: (savedTemplate: EmailTemplate) => void;
}

// Convert initial template fields into modular sections if not present
export const getInitialSectionsFromTemplate = (tmpl: EmailTemplate): EmailSection[] => {
  if (tmpl.sections && tmpl.sections.length > 0) {
    // Ensure if it's a blank or custom template without a logo section, a logo section is present at the top
    const hasLogo = tmpl.sections.some(s => s.type === 'logo');
    if (!hasLogo) {
      return [
        {
          id: 'sec-logo-top-' + Math.random().toString(36).substr(2, 9),
          type: 'logo',
          logoUrl: '',
          monogramText: '',
          logoSubtitle: ''
        },
        ...tmpl.sections
      ];
    }
    return tmpl.sections;
  }
  const list: EmailSection[] = [];
  
  // Always include logo section at top of email canvas with placeholder by default
  list.push({
    id: 'sec-logo-top-' + Math.random().toString(36).substr(2, 9),
    type: 'logo',
    logoUrl: '',
    monogramText: tmpl.monogram || '',
    logoSubtitle: ''
  });
  
  if (tmpl.tickerText) {
    list.push({
      id: 'sec-ticker-' + Math.random().toString(36).substr(2, 9),
      type: 'text',
      title: tmpl.tickerText,
      textAlign: 'center',
      bgColor: 'rgba(255, 255, 255, 0.08)'
    });
  }

  list.push({
    id: 'sec-headline-' + Math.random().toString(36).substr(2, 9),
    type: 'text',
    title: tmpl.headline,
    subtitle: tmpl.scriptOverlay,
    textAlign: tmpl.textAlign || 'center',
    fontSize: tmpl.fontSize || 38
  });

  if (tmpl.imageUrl) {
    list.push({
      id: 'sec-image-' + Math.random().toString(36).substr(2, 9),
      type: 'image',
      imageUrl: tmpl.imageUrl,
      imageAlt: tmpl.headline,
      imageWidth: 600,
      imageShape: (tmpl.frameShape as any) || 'rounded'
    });
  }

  if (tmpl.testimonialQuote) {
    list.push({
      id: 'sec-testimonial-' + Math.random().toString(36).substr(2, 9),
      type: 'layout',
      layoutVariant: 'magazine-quote',
      authorQuote: tmpl.testimonialQuote,
      authorName: tmpl.testimonialAuthor
    });
  }

  list.push({
    id: 'sec-body-' + Math.random().toString(36).substr(2, 9),
    type: 'text',
    body: tmpl.body,
    textAlign: tmpl.textAlign || 'center'
  });

  if (tmpl.couponCode) {
    list.push({
      id: 'sec-coupon-' + Math.random().toString(36).substr(2, 9),
      type: 'layout',
      layoutVariant: 'gift-thanks',
      title: 'VIP VOUCHER: ' + tmpl.couponCode,
      subtitle: tmpl.couponDiscount || 'Exclusive VIP Discount'
    });
  }

  list.push({
    id: 'sec-button-' + Math.random().toString(36).substr(2, 9),
    type: 'button',
    ctaText: tmpl.ctaText,
    ctaUrl: tmpl.ctaUrl,
    buttonShape: tmpl.buttonShape || 'pill',
    buttonWidth: tmpl.buttonWidth || 'auto'
  });

  if (tmpl.authorSignature) {
    list.push({
      id: 'sec-signature-' + Math.random().toString(36).substr(2, 9),
      type: 'text',
      title: tmpl.authorSignature,
      subtitle: tmpl.authorTitle || 'Founder & Creative Director',
      textAlign: 'center'
    });
  }

  list.push({
    id: 'sec-footer-' + Math.random().toString(36).substr(2, 9),
    type: 'footer',
    footerNote: tmpl.footerNote || 'Delivered with care via Sendline High-Deliverability Network.'
  });

  return list;
};

export const TemplateStudio: React.FC<TemplateStudioProps> = ({
  initialTemplate,
  onClose,
  onSaveCampaign,
  onNavigate,
  studioMode = 'campaign',
  workflowContext,
  onSaveToWorkflow,
  onSaveToLibrary
}) => {
  // Working template state base initialization
  const baseInitial = initialTemplate || INITIAL_TEMPLATES[0];

  // Wizard Step Navigation ('choose-template' | 'design-email' | 'choose-audience' | 'send')
  const [wizardStep, setWizardStep] = useState<WizardStep>('design-email');

  // Audience & Send Configuration State
  const [audienceState, setAudienceState] = useState<AudienceState>(() => ({
    fromName: 'AS',
    fromEmail: 'mehmetarslan@yahoo.com',
    subject: baseInitial.subject || '✨ Limited Time: 25% Off All Editorial Services!',
    isAbTest: false,
    previewText: baseInitial.preheader || 'Unlock big savings on branding, coaching, and more—don\'t miss out!',
    recipients: [
      { type: 'segment', label: 'All VIP Subscribers', count: 68400 }
    ]
  }));

  const [template, setTemplate] = useState<EmailTemplate>(() => {
    return {
      ...baseInitial,
      sections: getInitialSectionsFromTemplate(baseInitial)
    };
  });

  // History stack for Undo/Redo
  const [history, setHistory] = useState<EmailTemplate[]>([
    { ...baseInitial, sections: getInitialSectionsFromTemplate(baseInitial) }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active UI tabs & tools
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'colors' | 'templates'>('content');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPreviewOnly, setIsPreviewOnly] = useState<boolean>(false);
  const [editorGuides, setEditorGuides] = useState<'subtle' | 'pink' | 'none'>('subtle');
  const [showGuidesHelp, setShowGuidesHelp] = useState<boolean>(false);
  const [showCanvasSettings, setShowCanvasSettings] = useState<boolean>(false);

  // Section Add / Inserter Modal
  const [showSectionPicker, setShowSectionPicker] = useState<boolean>(false);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number>(0);

  // Inspector Sub-tab (Layout | Link | Block)
  const [inspectorSubTab, setInspectorSubTab] = useState<'layout' | 'link' | 'block'>('layout');

  // Modals & Notifications
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testEmailAddress, setTestEmailAddress] = useState<string>('subscriber@acme.com');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  // Palette theme configurations
  const palettes = {
    sunflower: {
      name: 'Pale Sunflower',
      outerBg: '#FBF5DF',
      cardBg: '#2B3324',
      cardText: '#FDFBF7',
      cardSub: '#D1DEC3',
      btnBg: '#E8D284',
      btnText: '#1F2E20',
      badgeBg: 'rgba(232, 210, 132, 0.2)',
      badgeText: '#E8D284',
      border: '#424E38',
      accent: '#E8D284'
    },
    lavender: {
      name: 'Lavender Lilac',
      outerBg: '#EDE9FE',
      cardBg: '#2A3042',
      cardText: '#FFFFFF',
      cardSub: '#C5CAE9',
      btnBg: '#FFFFFF',
      btnText: '#1E2330',
      badgeBg: '#F3E8FF',
      badgeText: '#6B21A8',
      border: '#3D455D',
      accent: '#8B5CF6'
    },
    olive: {
      name: 'Olive Sage',
      outerBg: '#E8EDE0',
      cardBg: '#1E2C1E',
      cardText: '#FAF8F5',
      cardSub: '#C8D6C5',
      btnBg: '#C5D8B8',
      btnText: '#152215',
      badgeBg: 'rgba(197, 216, 184, 0.25)',
      badgeText: '#C5D8B8',
      border: '#2E402E',
      accent: '#10B981'
    },
    terracotta: {
      name: 'Terracotta Warmth',
      outerBg: '#F7EFE6',
      cardBg: '#6B4C28',
      cardText: '#FFF8F0',
      cardSub: '#E8D5C4',
      btnBg: '#F5E6D3',
      btnText: '#4A3319',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      border: '#825F37',
      accent: '#D97706'
    },
    sand: {
      name: 'Minimal Sand & Linen',
      outerBg: '#FAF8F5',
      cardBg: '#FFFFFF',
      cardText: '#1C1917',
      cardSub: '#57534E',
      btnBg: '#1C1917',
      btnText: '#FFFFFF',
      badgeBg: '#F5F5F4',
      badgeText: '#1C1917',
      border: '#E7E5E4',
      accent: '#1C1917'
    },
    obsidian: {
      name: 'Midnight Obsidian',
      outerBg: '#090D14',
      cardBg: '#131926',
      cardText: '#FFFFFF',
      cardSub: '#94A3B8',
      btnBg: '#6366F1',
      btnText: '#FFFFFF',
      badgeBg: 'rgba(99, 102, 241, 0.2)',
      badgeText: '#A5B4FC',
      border: '#1E293B',
      accent: '#6366F1'
    }
  };

  const currentThemeKey = template.paletteTheme || 'sand';
  const baseTheme = palettes[currentThemeKey] || palettes.sand;

  const currentTheme = {
    ...baseTheme,
    outerBg: template.customOuterBg || baseTheme.outerBg,
    cardBg: template.customCardBg || baseTheme.cardBg,
    cardText: template.customTextColor || baseTheme.cardText,
    btnBg: template.customBtnBg || baseTheme.btnBg,
    btnText: template.customBtnText || baseTheme.btnText
  };

  // Helper to push changes to state & history
  const updateTemplate = (updates: Partial<EmailTemplate>) => {
    const updated = { ...template, ...updates };
    setTemplate(updated);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTemplate(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTemplate(history[historyIndex + 1]);
    }
  };

  // Section List Management
  const currentSections = template.sections || [];

  const handleAddSection = (type: EmailBlockType, layoutPreset?: EmailLayoutPreset) => {
    const newSection: EmailSection = {
      id: 'sec-' + type + '-' + Math.random().toString(36).substr(2, 9),
      type,
      layoutVariant: layoutPreset,
      textAlign: 'center',
      imageWidth: 600
    };

    // Populate sensible defaults for newly inserted blocks
    if (type === 'layout') {
      if (layoutPreset === 'split-square-left') {
        newSection.title = 'Introductory Branding Package';
        newSection.originalPrice = '$760';
        newSection.discountPrice = '$570';
        newSection.ctaText = 'Learn more';
        newSection.ctaUrl = 'https://sendline.io/branding';
        newSection.imageShape = 'square';
        newSection.imagePosition = 'split-left';
        newSection.imageUrl = '';
      } else if (layoutPreset === 'split-square-right') {
        newSection.title = 'My Bestselling Email Templates';
        newSection.originalPrice = '$300';
        newSection.discountPrice = '$225';
        newSection.ctaText = "Get 'em";
        newSection.ctaUrl = 'https://sendline.io/templates';
        newSection.imageShape = 'square';
        newSection.imagePosition = 'split-right';
        newSection.imageUrl = '';
      } else if (layoutPreset === 'split-circle-left') {
        newSection.title = 'Private Masterclass Mentorship';
        newSection.originalPrice = '$950';
        newSection.discountPrice = '$690';
        newSection.ctaText = 'Reserve seat';
        newSection.ctaUrl = 'https://sendline.io/masterclass';
        newSection.imageShape = 'circle';
        newSection.imagePosition = 'split-left';
        newSection.imageUrl = '';
      } else if (layoutPreset === 'coaching-circle' || layoutPreset === 'split-circle-right') {
        newSection.title = '1:1 Business Coaching';
        newSection.originalPrice = '$1220';
        newSection.discountPrice = '$915';
        newSection.ctaText = 'Apply now';
        newSection.ctaUrl = 'https://sendline.io/apply';
        newSection.imageShape = 'circle';
        newSection.imagePosition = 'split-right';
        newSection.imageUrl = '';
      } else if (layoutPreset === 'tips-numbered') {
        newSection.numberPrefix = '6';
        newSection.title = 'Tips to Photograph Food';
        newSection.body = 'I remember my first try at food photography. I created this guide to help you get started without making all the mistakes I did.';
        newSection.ctaText = 'READ IT';
        newSection.ctaUrl = 'https://sendline.io/tips';
      } else if (layoutPreset === 'stacked-discount') {
        newSection.title = '30% VIP SEASON PASS';
        newSection.imageUrl = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80';
      } else if (layoutPreset === 'side-by-side') {
        newSection.title = 'The Post That Got Everyone Talking';
        newSection.subtitle = "From The 'Gram";
        newSection.ctaText = 'SEE IT';
        newSection.imageUrl = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
      } else if (layoutPreset === 'welcome-hero') {
        newSection.title = 'Welcome to the list';
        newSection.subtitle = 'You made it.';
      } else if (layoutPreset === 'gift-thanks') {
        newSection.title = 'A LITTLE GIFT OF THANKS';
        newSection.subtitle = 'FOR JOINING THE LIST';
      }
    } else if (type === 'two-images' || layoutPreset === 'two-images-grid') {
      newSection.type = 'two-images';
      newSection.imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      newSection.imageUrl2 = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80';
      newSection.imageAlt = 'Editorial Story 1';
      newSection.imageAlt2 = 'Editorial Story 2';
      newSection.imageTitle1 = 'Autumn Capsule';
      newSection.imageTitle2 = 'Nordic Silhouettes';
      newSection.imageSubtitle1 = 'Shop collection';
      newSection.imageSubtitle2 = 'Explore lookbook';
      newSection.gap = 16;
      newSection.imageRadius = 16;
      newSection.aspectRatio = 'portrait';
    } else if (type === 'image') {
      newSection.imageUrl = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';
      newSection.imageAlt = 'Editorial Photo';
      newSection.imageWidth = 600;
      newSection.imageRadius = 16;
    } else if (type === 'logo') {
      newSection.logoUrl = '';
      newSection.monogramText = '';
      newSection.logoSubtitle = '';
    } else if (type === 'text') {
      newSection.title = 'Refined Editorial Craft';
      newSection.body = 'Designed for founders, creators, and luxury brands who care about distinct visual hierarchy and typographic rhythm.';
    } else if (type === 'button') {
      newSection.ctaText = 'EXPLORE THE COLLECTION';
      newSection.ctaUrl = 'https://sendline.io/collection';
      newSection.buttonShape = 'pill';
      newSection.buttonWidth = 'auto';
    } else if (type === 'divider') {
      newSection.dividerStyle = 'solid';
    } else if (type === 'form-field') {
      newSection.formFieldType = 'email';
      newSection.formFieldLabel = 'Join our Private Editorial Circle';
      newSection.formFieldPlaceholder = 'Enter your best email address...';
      newSection.formFieldRequired = true;
      newSection.formSubmitButtonText = 'Subscribe Now';
      newSection.formSuccessMessage = '✨ Thank you for subscribing! Check your inbox.';
    } else if (type === 'form-survey') {
      newSection.title = 'How likely are you to recommend us?';
      newSection.subtitle = 'ONE-CLICK FEEDBACK';
      newSection.formSubmitButtonText = 'Submit Feedback';
    } else if (type === 'spacer') {
      newSection.spacerHeight = 24;
    } else if (type === 'countdown') {
      newSection.countdownLabel = 'FLASH SALE ENDS IN';
    } else if (type === 'ecommerce') {
      newSection.title = 'Pure Botanical Lip Elixir';
      newSection.discountPrice = '$38.00';
      newSection.ctaText = 'ADD TO BAG';
      newSection.imageUrl = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80';
    } else if (type === 'social') {
      newSection.socialPlatforms = [
        { platform: 'instagram', url: '#' },
        { platform: 'pinterest', url: '#' },
        { platform: 'tiktok', url: '#' }
      ];
    } else if (type === 'footer') {
      newSection.footerNote = 'Sent with care via Sendline Editorial Mail System.';
    }

    const updatedSections = [...currentSections];
    const indexToInsert = Math.min(Math.max(0, insertTargetIndex), updatedSections.length);
    updatedSections.splice(indexToInsert, 0, newSection);

    updateTemplate({ sections: updatedSections });
    setSelectedSectionId(newSection.id);
    setActiveTab('content');
    showToast(`Added new ${type} section`);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...currentSections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    updateTemplate({ sections: updated });
    showToast(`Section moved ${direction}`);
  };

  const handleDuplicateSection = (index: number) => {
    const target = currentSections[index];
    if (!target) return;
    const duplicated: EmailSection = {
      ...target,
      id: 'sec-' + target.type + '-' + Math.random().toString(36).substr(2, 9)
    };
    const updated = [...currentSections];
    updated.splice(index + 1, 0, duplicated);
    updateTemplate({ sections: updated });
    setSelectedSectionId(duplicated.id);
    showToast('Section duplicated');
  };

  const handleDeleteSection = (index: number) => {
    const updated = currentSections.filter((_, i) => i !== index);
    updateTemplate({ sections: updated });
    setSelectedSectionId(null);
    showToast('Section deleted');
  };

  const handleUpdateSection = (id: string, updates: Partial<EmailSection>) => {
    const updated = currentSections.map(sec => {
      if (sec.id === id) {
        return { ...sec, ...updates };
      }
      return sec;
    });
    updateTemplate({ sections: updated });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = () => {
    const html = generateEmailHtml(template);
    navigator.clipboard.writeText(html);
    setCopiedCode(true);
    showToast('Clean HTML copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadHtml = () => {
    const html = generateEmailHtml(template);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(template.name || 'campaign').toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded email HTML template file.');
  };

  const handleSendTest = () => {
    setShowTestModal(false);
    showToast(`Test email successfully delivered to ${testEmailAddress}!`);
  };

  const handleSaveCampaign = () => {
    const newCampaign: Campaign = {
      id: 'camp-' + Date.now(),
      title: template.name || template.headline.slice(0, 32) || 'Editorial Campaign',
      subject: template.subject,
      status: 'Sent',
      sentCount: 68400,
      openRate: 59.4,
      clickRate: 22.8,
      revenueGenerated: '$31,400',
      date: 'Just now',
      audience: 'VIP Subscribers (Global)',
      templateId: template.id
    };
    onSaveCampaign(newCampaign);
    showToast('Campaign successfully saved and ready to dispatch!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const selectedSection = currentSections.find(s => s.id === selectedSectionId) || currentSections[0];

  // Font family class resolver for headings & titles
  const getFontFamilyClass = (font: EmailTemplate['fontFamily']) => {
    switch (font) {
      case 'display-slab':
        return 'font-cinzel tracking-wider font-bold';
      case 'serif':
        return 'font-playfair font-bold';
      case 'mono':
        return 'font-mono-code font-bold tracking-tight';
      case 'script-hand':
        return 'font-caveat font-bold text-2xl tracking-wide';
      case 'sans':
      default:
        return 'font-jakarta font-bold tracking-tight';
    }
  };

  // Font family class resolver for body / paragraphs / general copy
  const getBodyFontClass = (font: EmailTemplate['fontFamily']) => {
    switch (font) {
      case 'display-slab':
        return 'font-cinzel tracking-wide text-xs sm:text-sm font-medium';
      case 'serif':
        return 'font-serif-body text-sm sm:text-base';
      case 'mono':
        return 'font-mono-code text-xs sm:text-sm font-normal';
      case 'script-hand':
        return 'font-caveat text-base sm:text-lg leading-relaxed';
      case 'sans':
      default:
        return 'font-jakarta text-xs sm:text-sm';
    }
  };

  // Inline font family string for card root fallback
  const getFontFamilyInline = (font: EmailTemplate['fontFamily']) => {
    switch (font) {
      case 'display-slab':
        return "'Cinzel', 'Playfair Display', Georgia, serif";
      case 'serif':
        return "'Playfair Display', 'Newsreader', Georgia, serif";
      case 'mono':
        return "'JetBrains Mono', Consolas, Monaco, monospace";
      case 'script-hand':
        return "'Caveat', cursive, 'Brush Script MT', sans-serif";
      case 'sans':
      default:
        return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
    }
  };

  // Section selection & hover outline helper (Uses inset box-shadow so edges are never clipped by parent overflow)
  const getSectionOutlineClass = (sectionId: string) => {
    if (isPreviewOnly || editorGuides === 'none') return '';
    const isHovered = hoveredSectionId === sectionId;
    const isSelected = selectedSectionId === sectionId;
    if (!isHovered && !isSelected) return '';

    if (editorGuides === 'pink') {
      return isSelected
        ? 'shadow-[inset_0_0_0_2.5px_#EC4899] z-20'
        : 'shadow-[inset_0_0_0_2px_rgba(236,72,153,0.7)] z-10';
    }
    // Default 'subtle' (Blue)
    return isSelected
      ? 'shadow-[inset_0_0_0_2.5px_#2563EB] z-20'
      : 'shadow-[inset_0_0_0_2px_rgba(59,130,246,0.7)] z-10';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E121A] text-stone-100 flex flex-col justify-between overflow-hidden antialiased font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-2.5 rounded-full border border-white/20 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FLODESK TOP WIZARD NAVIGATION BAR */}
      <FlodeskWizardNav
        currentStep={wizardStep}
        onStepChange={(step) => setWizardStep(step)}
        onClose={onClose}
        onNext={() => setWizardStep('choose-audience')}
        onSendTest={() => setShowTestModal(true)}
        onExportCode={() => setShowCodeModal(true)}
        title={template.name}
        onTitleChange={(newName) => updateTemplate({ name: newName })}
        studioMode={studioMode}
        workflowContext={workflowContext}
        onSaveToWorkflow={() => {
          if (onSaveToWorkflow) {
            onSaveToWorkflow(template, currentSections);
            showToast('Saved email design to workflow step!');
            setTimeout(() => onClose(), 800);
          }
        }}
        onSaveToLibrary={() => {
          if (onSaveToLibrary) {
            onSaveToLibrary(template);
            showToast('Saved master template to library!');
            setTimeout(() => onClose(), 800);
          } else {
            showToast('Template design updated in library!');
          }
        }}
      />

      {/* STEP 1: CHOOSE TEMPLATE */}
      {wizardStep === 'choose-template' && (
        <ChooseTemplateStep
          selectedTemplate={template}
          onSelectTemplate={(newTmpl) => {
            const updatedTmpl = {
              ...newTmpl,
              sections: getInitialSectionsFromTemplate(newTmpl)
            };
            setTemplate(updatedTmpl);
            setAudienceState(prev => ({
              ...prev,
              subject: newTmpl.subject || prev.subject,
              previewText: newTmpl.preheader || prev.previewText
            }));
          }}
          onProceedToDesign={() => setWizardStep('design-email')}
          onClose={onClose}
        />
      )}

      {/* STEP 3: CHOOSE AUDIENCE */}
      {wizardStep === 'choose-audience' && (
        <ChooseAudienceStep
          template={template}
          audienceState={audienceState}
          onUpdateAudience={(updates) => setAudienceState(prev => ({ ...prev, ...updates }))}
          onContinueToSend={() => setWizardStep('send')}
          onBackToDesign={() => setWizardStep('design-email')}
        />
      )}

      {/* STEP 4: SEND / SCHEDULE */}
      {wizardStep === 'send' && (
        <SendEmailStep
          template={template}
          audienceState={audienceState}
          onSaveCampaign={onSaveCampaign}
          onBackToAudience={() => setWizardStep('choose-audience')}
          onClose={onClose}
          onSendTestEmail={(email) => {
            setTestEmailAddress(email);
            handleSendTest();
          }}
        />
      )}

      {/* STEP 2: DESIGN EMAIL (MAIN WORKSPACE BODY) */}
      {wizardStep === 'design-email' && (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: INSPECTOR & CONTROLS (4.5 columns) */}
        <div className="lg:col-span-4 xl:col-span-4 bg-[#11151E] border-r border-white/10 flex flex-col h-full overflow-hidden shadow-2xl">
          
          {/* Main Mode Sub-Tabs */}
          <div className="flex items-center border-b border-white/10 bg-[#0C1017] px-3 py-2 gap-1 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'content' ? 'bg-pink-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Block Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('style')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'style' ? 'bg-pink-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography & Frame</span>
            </button>

            <button
              onClick={() => setActiveTab('colors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'colors' ? 'bg-pink-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Palettes & Colors</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'templates' ? 'bg-pink-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>

          {/* ACTIVE TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* TAB 1: FLODESK-STYLE BLOCK INSPECTOR (Layout | Link | Block) */}
            {activeTab === 'content' && (
              <div className="space-y-5">
                
                {/* Active Block Header & Selector pill */}
                {selectedSection ? (
                  <div className="space-y-4">
                    
                    {/* Top Section Header with Quick Actions */}
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-xs font-bold text-white capitalize">
                          {selectedSection.type === 'layout' 
                            ? (selectedSection.layoutVariant?.replace('split-', '').replace('-', ' ') || 'Layout Section')
                            : `${selectedSection.type} Block`}
                        </span>
                      </div>

                      {/* Quick Move / Duplicate / Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                            handleMoveSection(idx, 'up');
                          }}
                          disabled={currentSections.findIndex(s => s.id === selectedSection.id) === 0}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                            handleMoveSection(idx, 'down');
                          }}
                          disabled={currentSections.findIndex(s => s.id === selectedSection.id) === currentSections.length - 1}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                            handleDuplicateSection(idx);
                          }}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                            handleDeleteSection(idx);
                          }}
                          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Top sub-tabs: Layout / Media | Link | Block */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <button
                          onClick={() => setInspectorSubTab('layout')}
                          className={`pb-1 cursor-pointer transition-colors border-b-2 ${
                            inspectorSubTab === 'layout' 
                              ? 'border-white text-white' 
                              : 'border-transparent text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {selectedSection.type === 'image' ? 'Image' : selectedSection.type === 'layout' ? 'Layout' : 'Content'}
                        </button>
                        <button
                          onClick={() => setInspectorSubTab('link')}
                          className={`pb-1 cursor-pointer transition-colors border-b-2 ${
                            inspectorSubTab === 'link' 
                              ? 'border-white text-white' 
                              : 'border-transparent text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Link
                        </button>
                        <button
                          onClick={() => setInspectorSubTab('block')}
                          className={`pb-1 cursor-pointer transition-colors border-b-2 ${
                            inspectorSubTab === 'block' 
                              ? 'border-white text-white' 
                              : 'border-transparent text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Block & Style
                        </button>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-stone-300">
                        {selectedSection.type}
                      </span>
                    </div>

                    {/* SUBTAB: LAYOUT / CONTENT */}
                    {inspectorSubTab === 'layout' && (
                      <div className="space-y-4">
                        
                        {/* 1. If Layout Preset Type */}
                        {selectedSection.type === 'layout' && (
                          <div className="space-y-4">
                            
                            {/* Layout Preset Switcher / Selector */}
                            <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">Layout Style</label>
                                <button
                                  onClick={() => {
                                    setInsertTargetIndex(currentSections.findIndex(s => s.id === selectedSection.id));
                                    setShowSectionPicker(true);
                                  }}
                                  className="text-[11px] text-pink-400 hover:text-pink-300 underline cursor-pointer"
                                >
                                  Library
                                </button>
                              </div>

                              {/* 4 Split Layout Quick Presets */}
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, {
                                    layoutVariant: 'split-square-left',
                                    imageShape: 'square',
                                    imagePosition: 'split-left',
                                    title: selectedSection.title || 'Introductory Branding Package',
                                    originalPrice: selectedSection.originalPrice || '$760',
                                    discountPrice: selectedSection.discountPrice || '$570',
                                    ctaText: selectedSection.ctaText || 'Learn more'
                                  })}
                                  className={`p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                                    selectedSection.layoutVariant === 'split-square-left' || (selectedSection.imagePosition === 'split-left' && selectedSection.imageShape === 'square')
                                      ? 'bg-blue-600/20 border-blue-500 text-white'
                                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-xs bg-stone-300"></span>
                                    <span>Square Left</span>
                                  </div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">Text on right</div>
                                </button>

                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, {
                                    layoutVariant: 'split-square-right',
                                    imageShape: 'square',
                                    imagePosition: 'split-right',
                                    title: selectedSection.title || 'My Bestselling Templates',
                                    originalPrice: selectedSection.originalPrice || '$300',
                                    discountPrice: selectedSection.discountPrice || '$225',
                                    ctaText: selectedSection.ctaText || "Get 'em"
                                  })}
                                  className={`p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                                    selectedSection.layoutVariant === 'split-square-right' || (selectedSection.imagePosition === 'split-right' && selectedSection.imageShape === 'square')
                                      ? 'bg-blue-600/20 border-blue-500 text-white'
                                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1.5">
                                    <span>Square Right</span>
                                    <span className="w-3 h-3 rounded-xs bg-stone-300"></span>
                                  </div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">Text on left</div>
                                </button>

                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, {
                                    layoutVariant: 'split-circle-left',
                                    imageShape: 'circle',
                                    imagePosition: 'split-left',
                                    title: selectedSection.title || 'Private Masterclass Mentorship',
                                    originalPrice: selectedSection.originalPrice || '$950',
                                    discountPrice: selectedSection.discountPrice || '$690',
                                    ctaText: selectedSection.ctaText || 'Reserve seat'
                                  })}
                                  className={`p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                                    selectedSection.layoutVariant === 'split-circle-left'
                                      ? 'bg-blue-600/20 border-blue-500 text-white'
                                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-stone-300"></span>
                                    <span>Circle Left</span>
                                  </div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">Text on right</div>
                                </button>

                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, {
                                    layoutVariant: 'coaching-circle',
                                    imageShape: 'circle',
                                    imagePosition: 'split-right',
                                    title: selectedSection.title || '1:1 Business Coaching',
                                    originalPrice: selectedSection.originalPrice || '$1220',
                                    discountPrice: selectedSection.discountPrice || '$915',
                                    ctaText: selectedSection.ctaText || 'Apply now'
                                  })}
                                  className={`p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                                    selectedSection.layoutVariant === 'coaching-circle' || selectedSection.layoutVariant === 'split-circle-right'
                                      ? 'bg-blue-600/20 border-blue-500 text-white'
                                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1.5">
                                    <span>Circle Right</span>
                                    <span className="w-3 h-3 rounded-full bg-stone-300"></span>
                                  </div>
                                  <div className="text-[10px] text-stone-400 mt-0.5">Text on left (1:1 Coaching)</div>
                                </button>
                              </div>
                            </div>

                            {/* Prices, Titles, and Link content */}
                            <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">Content & Pricing</div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Original Price (Strikethrough)</label>
                                  <input
                                    type="text"
                                    value={selectedSection.originalPrice || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { originalPrice: e.target.value })}
                                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="$1220"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Discount / Bold Price</label>
                                  <input
                                    type="text"
                                    value={selectedSection.discountPrice || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { discountPrice: e.target.value })}
                                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                                    placeholder="$915"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Headline Title</label>
                                <input
                                  type="text"
                                  value={selectedSection.title || ''}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { title: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                                  placeholder="e.g. 1:1 Business Coaching"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Subtitle / Tagline (Optional)</label>
                                <input
                                  type="text"
                                  value={selectedSection.subtitle || ''}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { subtitle: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                  placeholder="e.g. SPECIAL OFFER"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Body Description (Optional)</label>
                                <textarea
                                  rows={2}
                                  value={selectedSection.body || ''}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { body: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white resize-none"
                                  placeholder="Add details about this offer..."
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Action Link Text</label>
                                  <input
                                    type="text"
                                    value={selectedSection.ctaText || 'Learn more'}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { ctaText: e.target.value })}
                                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="Learn more"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Action Link URL</label>
                                  <input
                                    type="text"
                                    value={selectedSection.ctaUrl || 'https://'}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { ctaUrl: e.target.value })}
                                    className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="https://..."
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Image Controls for Layout Block */}
                            <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">Image / Photo</div>
                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, { imageUrl: '' })}
                                  className="text-[10px] text-stone-400 hover:text-stone-200 underline cursor-pointer"
                                >
                                  Use Placeholder Icon
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Image Shape</label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {(['square', 'circle'] as const).map((shape) => (
                                      <button
                                        key={shape}
                                        onClick={() => handleUpdateSection(selectedSection.id, { imageShape: shape })}
                                        className={`py-1 rounded-lg text-xs capitalize cursor-pointer font-bold ${
                                          (selectedSection.imageShape || (selectedSection.layoutVariant === 'coaching-circle' ? 'circle' : 'square')) === shape
                                            ? 'bg-blue-600/30 text-blue-300 border border-blue-400/40'
                                            : 'bg-white/5 text-stone-400 hover:text-white'
                                        }`}
                                      >
                                        {shape}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] text-stone-400">Image Position</label>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {(['split-left', 'split-right'] as const).map((pos) => (
                                      <button
                                        key={pos}
                                        onClick={() => handleUpdateSection(selectedSection.id, { 
                                          imagePosition: pos,
                                          layoutVariant: pos === 'split-left' 
                                            ? (selectedSection.imageShape === 'circle' ? 'split-circle-left' : 'split-square-left')
                                            : (selectedSection.imageShape === 'circle' ? 'coaching-circle' : 'split-square-right')
                                        })}
                                        className={`py-1 rounded-lg text-xs capitalize cursor-pointer font-bold ${
                                          (selectedSection.imagePosition === pos || (pos === 'split-right' && selectedSection.layoutVariant === 'coaching-circle') || (pos === 'split-left' && selectedSection.layoutVariant?.includes('-left')))
                                            ? 'bg-blue-600/30 text-blue-300 border border-blue-400/40'
                                            : 'bg-white/5 text-stone-400 hover:text-white'
                                        }`}
                                      >
                                        {pos === 'split-left' ? 'Left' : 'Right'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Image Web URL</label>
                                <input
                                  type="text"
                                  value={selectedSection.imageUrl || ''}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { imageUrl: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                  placeholder="Leave blank for placeholder icon, or paste https://..."
                                />
                              </div>

                              {/* Quick Stock Photos */}
                              <div className="space-y-1 pt-1">
                                <label className="text-[10px] text-stone-400">One-click Stock Photos:</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                  <button
                                    onClick={() => handleUpdateSection(selectedSection.id, { imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' })}
                                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 truncate cursor-pointer"
                                  >
                                    Portrait
                                  </button>
                                  <button
                                    onClick={() => handleUpdateSection(selectedSection.id, { imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' })}
                                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 truncate cursor-pointer"
                                  >
                                    Studio
                                  </button>
                                  <button
                                    onClick={() => handleUpdateSection(selectedSection.id, { imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' })}
                                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 truncate cursor-pointer"
                                  >
                                    Product
                                  </button>
                                  <button
                                    onClick={() => handleUpdateSection(selectedSection.id, { imageUrl: '' })}
                                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 truncate cursor-pointer"
                                  >
                                    Icon Only
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* 2. If Image Type */}
                        {selectedSection.type === 'image' && (
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-stone-300">Add image from...</label>
                              <select className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white cursor-pointer">
                                <option>My computer</option>
                                <option>Unsplash Stock Library</option>
                                <option>Recent Uploads</option>
                              </select>
                            </div>

                            {/* Dashed Upload Dropzone */}
                            <div 
                              onClick={() => {
                                handleUpdateSection(selectedSection.id, { 
                                  imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' 
                                });
                                showToast('Sample editorial image uploaded!');
                              }}
                              className="border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-2xl p-6 text-center space-y-2 bg-white/[0.02] cursor-pointer transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-white/10 text-stone-300 mx-auto flex items-center justify-center">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div className="text-xs font-bold text-white">Click to upload photo</div>
                              <div className="text-[10px] text-stone-400">Max size 10MB (PNG, JPG, WebP)</div>
                            </div>

                            {/* Image Width Slider */}
                            <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-300">Width</span>
                                <span className="font-mono text-stone-200">{selectedSection.imageWidth || 600}px</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, { imageWidth: Math.max(200, (selectedSection.imageWidth || 600) - 40) })}
                                  className="text-stone-400 hover:text-white text-sm font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="range"
                                  min={200}
                                  max={600}
                                  step={20}
                                  value={selectedSection.imageWidth || 600}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { imageWidth: Number(e.target.value) })}
                                  className="flex-1 accent-blue-500 cursor-pointer"
                                />
                                <button
                                  onClick={() => handleUpdateSection(selectedSection.id, { imageWidth: Math.min(600, (selectedSection.imageWidth || 600) + 40) })}
                                  className="text-stone-400 hover:text-white text-sm font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Image Corner Radius Controls */}
                            <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-300">Image Corner Radius</span>
                                <span className="font-mono text-blue-400 font-bold">{selectedSection.imageRadius !== undefined ? `${selectedSection.imageRadius}px` : '16px'}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1.5">
                                {[
                                  { label: '0px', val: 0 },
                                  { label: '8px', val: 8 },
                                  { label: '16px', val: 16 },
                                  { label: '24px', val: 24 },
                                ].map((rad) => (
                                  <button
                                    key={rad.val}
                                    onClick={() => handleUpdateSection(selectedSection.id, { imageRadius: rad.val })}
                                    className={`py-1 rounded-lg text-xs font-mono font-medium cursor-pointer ${
                                      (selectedSection.imageRadius ?? 16) === rad.val
                                        ? 'bg-blue-600 text-white font-bold'
                                        : 'bg-white/5 text-stone-400 hover:text-white'
                                    }`}
                                  >
                                    {rad.label}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={48}
                                step={2}
                                value={selectedSection.imageRadius ?? 16}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { imageRadius: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer pt-1"
                              />
                            </div>

                            {/* Quick Image Replacement URL */}
                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Image Web URL</label>
                              <input
                                type="text"
                                value={selectedSection.imageUrl || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { imageUrl: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        )}

                        {/* 2B. If Two-Images (Grid) Type */}
                        {selectedSection.type === 'two-images' && (
                          <div className="space-y-4">
                            {/* Column Gap & Radius */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                                <label className="text-[11px] font-bold text-stone-300">Column Gap</label>
                                <div className="flex items-center gap-1">
                                  {[8, 12, 16, 24].map((g) => (
                                    <button
                                      key={g}
                                      onClick={() => handleUpdateSection(selectedSection.id, { gap: g })}
                                      className={`flex-1 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                                        (selectedSection.gap ?? 16) === g
                                          ? 'bg-blue-600 text-white font-bold'
                                          : 'bg-white/5 text-stone-400 hover:text-white'
                                      }`}
                                    >
                                      {g}px
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                                <label className="text-[11px] font-bold text-stone-300">Image Radius</label>
                                <div className="flex items-center gap-1">
                                  {[0, 8, 16, 24].map((r) => (
                                    <button
                                      key={r}
                                      onClick={() => handleUpdateSection(selectedSection.id, { imageRadius: r })}
                                      className={`flex-1 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                                        (selectedSection.imageRadius ?? 16) === r
                                          ? 'bg-blue-600 text-white font-bold'
                                          : 'bg-white/5 text-stone-400 hover:text-white'
                                      }`}
                                    >
                                      {r}px
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Image 1 Settings */}
                            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Image 1 (Left)</span>
                                </span>
                              </div>
                              <input
                                type="text"
                                value={selectedSection.imageUrl || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { imageUrl: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                placeholder="Image URL 1..."
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-stone-400">Caption / Title</label>
                                  <input
                                    type="text"
                                    value={selectedSection.imageTitle1 || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { imageTitle1: e.target.value })}
                                    className="w-full p-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="Title 1"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-stone-400">Subtitle / Link text</label>
                                  <input
                                    type="text"
                                    value={selectedSection.imageSubtitle1 || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { imageSubtitle1: e.target.value })}
                                    className="w-full p-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="Subtitle 1"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Image 2 Settings */}
                            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Image 2 (Right)</span>
                                </span>
                              </div>
                              <input
                                type="text"
                                value={selectedSection.imageUrl2 || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { imageUrl2: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                placeholder="Image URL 2..."
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-stone-400">Caption / Title</label>
                                  <input
                                    type="text"
                                    value={selectedSection.imageTitle2 || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { imageTitle2: e.target.value })}
                                    className="w-full p-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="Title 2"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-stone-400">Subtitle / Link text</label>
                                  <input
                                    type="text"
                                    value={selectedSection.imageSubtitle2 || ''}
                                    onChange={(e) => handleUpdateSection(selectedSection.id, { imageSubtitle2: e.target.value })}
                                    className="w-full p-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                                    placeholder="Subtitle 2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. If Text Type */}
                        {selectedSection.type === 'text' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Headline Title</label>
                              <input
                                type="text"
                                value={selectedSection.title || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { title: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Paragraph Text</label>
                              <textarea
                                rows={4}
                                value={selectedSection.body || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { body: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white resize-none"
                              />
                            </div>

                            {/* Alignment Selector */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] text-stone-400">Align:</span>
                              {(['left', 'center', 'right'] as const).map((align) => (
                                <button
                                  key={align}
                                  onClick={() => handleUpdateSection(selectedSection.id, { textAlign: align })}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                                    selectedSection.textAlign === align 
                                      ? 'bg-white/20 text-white' 
                                      : 'bg-white/5 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {align}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. If Button Type */}
                        {selectedSection.type === 'button' && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Button Label</label>
                              <input
                                type="text"
                                value={selectedSection.ctaText || 'EXPLORE NOW'}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { ctaText: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Destination URL</label>
                              <input
                                type="text"
                                value={selectedSection.ctaUrl || 'https://'}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { ctaUrl: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] text-stone-400">Shape</label>
                              <div className="grid grid-cols-3 gap-2">
                                {(['pill', 'rounded', 'sharp'] as const).map((shape) => (
                                  <button
                                    key={shape}
                                    onClick={() => handleUpdateSection(selectedSection.id, { buttonShape: shape })}
                                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                                      selectedSection.buttonShape === shape 
                                        ? 'bg-white/20 text-white border border-white/40' 
                                        : 'bg-white/5 text-stone-400 hover:text-white border border-transparent'
                                    }`}
                                  >
                                    {shape}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. If Logo Type */}
                        {selectedSection.type === 'logo' && (
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] text-stone-400 font-semibold">Logo Image URL</label>
                                {selectedSection.logoUrl && (
                                  <button
                                    onClick={() => handleUpdateSection(selectedSection.id, { logoUrl: '' })}
                                    className="text-[10px] text-stone-400 hover:text-red-400 underline cursor-pointer"
                                  >
                                    Remove image
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={selectedSection.logoUrl || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { logoUrl: e.target.value })}
                                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-stone-500"
                                placeholder="Paste logo image link (PNG, SVG, JPG)..."
                              />
                            </div>

                            {/* Sample Logo Quick Presets */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-stone-400 uppercase tracking-wider">Quick Sample Logos</label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { label: 'Minimalist', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
                                  { label: 'Luxury Studio', url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80' },
                                  { label: 'Monochrome', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=300&q=80' }
                                ].map((sample) => (
                                  <button
                                    key={sample.label}
                                    type="button"
                                    onClick={() => handleUpdateSection(selectedSection.id, { logoUrl: sample.url })}
                                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-stone-300 font-medium truncate cursor-pointer transition-colors"
                                  >
                                    {sample.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Logo Dimensions & Alignment */}
                            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Logo Height ({selectedSection.spacerHeight || 44}px)</label>
                                <input
                                  type="range"
                                  min="20"
                                  max="120"
                                  step="2"
                                  value={selectedSection.spacerHeight || 44}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { spacerHeight: Number(e.target.value) })}
                                  className="w-full accent-blue-500 cursor-pointer"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Logo Width ({selectedSection.imageWidth || 180}px)</label>
                                <input
                                  type="range"
                                  min="40"
                                  max="450"
                                  step="5"
                                  value={selectedSection.imageWidth || 180}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { imageWidth: Number(e.target.value) })}
                                  className="w-full accent-blue-500 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Vertical Gap / Padding control */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[11px] text-stone-400">Vertical Gap / Padding ({selectedSection.paddingY !== undefined ? selectedSection.paddingY : 12}px)</label>
                              <input
                                type="range"
                                min="0"
                                max="48"
                                step="2"
                                value={selectedSection.paddingY !== undefined ? selectedSection.paddingY : 12}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { paddingY: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] text-stone-400">Alignment</label>
                              <div className="grid grid-cols-3 gap-2">
                                {(['left', 'center', 'right'] as const).map((align) => (
                                  <button
                                    key={align}
                                    type="button"
                                    onClick={() => handleUpdateSection(selectedSection.id, { textAlign: align })}
                                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                                      (selectedSection.textAlign || 'center') === align
                                        ? 'bg-white/20 text-white border border-white/40 shadow-xs'
                                        : 'bg-white/5 text-stone-400 hover:text-white border border-transparent'
                                    }`}
                                  >
                                    {align}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Optional Monogram Letter */}
                            <div className="space-y-1 pt-2 border-t border-white/10">
                              <label className="text-[11px] text-stone-400">Monogram Letters (Optional)</label>
                              <input
                                type="text"
                                maxLength={4}
                                value={selectedSection.monogramText || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { monogramText: e.target.value.toUpperCase() })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono uppercase tracking-widest placeholder-stone-500"
                                placeholder="e.g. SL (Leave empty for image placeholder)"
                              />
                            </div>

                            {/* Optional Brand Tagline / Subtitle */}
                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Brand Tagline / Subtitle (Optional)</label>
                              <input
                                type="text"
                                value={selectedSection.logoSubtitle || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { logoSubtitle: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-stone-500"
                                placeholder="e.g. Maison Studio (Leave empty for none)"
                              />
                            </div>
                          </div>
                        )}

                        {/* SPECIFIC FORM-FIELD CONTROLS */}
                        {selectedSection.type === 'form-field' && (
                          <div className="space-y-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                              <FileText className="w-3.5 h-3.5 text-pink-400" />
                              <span>Form Input Field Setup</span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Field Label</label>
                              <input
                                type="text"
                                value={selectedSection.formFieldLabel || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { formFieldLabel: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                placeholder="e.g. Email address or First name"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Field Type</label>
                                <select
                                  value={selectedSection.formFieldType || 'email'}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { formFieldType: e.target.value as any })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                >
                                  <option value="email">Email</option>
                                  <option value="text">Text (Name / Note)</option>
                                  <option value="phone">Phone Number</option>
                                  <option value="textarea">Multi-line Text</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-stone-400">Placeholder</label>
                                <input
                                  type="text"
                                  value={selectedSection.formFieldPlaceholder || ''}
                                  onChange={(e) => handleUpdateSection(selectedSection.id, { formFieldPlaceholder: e.target.value })}
                                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                  placeholder="Placeholder text"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Submit Button Text</label>
                              <input
                                type="text"
                                value={selectedSection.formSubmitButtonText || 'Submit'}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { formSubmitButtonText: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-stone-300 font-medium">Require Field</span>
                              <input
                                type="checkbox"
                                checked={selectedSection.formFieldRequired !== false}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { formFieldRequired: e.target.checked })}
                                className="rounded accent-pink-500 cursor-pointer"
                              />
                            </div>
                          </div>
                        )}

                        {/* SPECIFIC FORM-SURVEY CONTROLS */}
                        {selectedSection.type === 'form-survey' && (
                          <div className="space-y-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                              <ListChecks className="w-3.5 h-3.5 text-pink-400" />
                              <span>Feedback Poll & Survey Settings</span>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Question / Headline</label>
                              <input
                                type="text"
                                value={selectedSection.title || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { title: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-bold"
                                placeholder="e.g. How likely are you to recommend us?"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] text-stone-400">Subhead / Category Tag</label>
                              <input
                                type="text"
                                value={selectedSection.subtitle || ''}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { subtitle: e.target.value })}
                                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                                placeholder="e.g. 1-CLICK FEEDBACK"
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* SUBTAB: LINK */}
                    {inspectorSubTab === 'link' && (
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                          <Link2 className="w-4 h-4 text-blue-400" />
                          <span>Link Settings</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Set the destination click target when subscribers click on this section.
                        </p>
                        <div className="space-y-1">
                          <label className="text-[11px] text-stone-400">Target Web Address</label>
                          <input
                            type="text"
                            value={selectedSection.ctaUrl || 'https://sendline.io'}
                            onChange={(e) => handleUpdateSection(selectedSection.id, { ctaUrl: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                            placeholder="https://yourstore.com/item"
                          />
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: BLOCK / FULL SECTION STYLING & BACKGROUND */}
                    {inspectorSubTab === 'block' && (
                      <div className="space-y-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="text-xs font-bold text-stone-200 uppercase tracking-wider">Section Background & Colors</div>
                        
                        {/* Section Background Color Customization */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-stone-400">Section Background Color</label>
                            <button
                              onClick={() => handleUpdateSection(selectedSection.id, { bgColor: undefined })}
                              className="text-[10px] text-stone-400 hover:text-white underline cursor-pointer"
                            >
                              Transparent
                            </button>
                          </div>

                          {/* Quick Swatch Presets */}
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { label: 'Sand', color: '#FAF8F5' },
                              { label: 'White', color: '#FFFFFF' },
                              { label: 'Linen', color: '#F4F0E8' },
                              { label: 'Gray', color: '#EFECE6' },
                              { label: 'Sage', color: '#E8EDE0' },
                              { label: 'Lavender', color: '#EDE9FE' },
                              { label: 'Terracotta', color: '#F7EFE6' },
                              { label: 'Moss', color: '#2B3324' },
                              { label: 'Dark', color: '#181D28' },
                              { label: 'Black', color: '#000000' }
                            ].map((swatch) => (
                              <button
                                key={swatch.color}
                                onClick={() => handleUpdateSection(selectedSection.id, { bgColor: swatch.color })}
                                className={`h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                                  selectedSection.bgColor === swatch.color
                                    ? 'ring-2 ring-blue-500 scale-105 border-white'
                                    : 'border-white/15 hover:scale-105'
                                }`}
                                style={{ backgroundColor: swatch.color }}
                                title={swatch.label}
                              >
                                {selectedSection.bgColor === swatch.color && (
                                  <span className={`w-2 h-2 rounded-full ${swatch.color === '#000000' || swatch.color === '#181D28' || swatch.color === '#2B3324' ? 'bg-white' : 'bg-black'}`} />
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Custom Color Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="color"
                              value={selectedSection.bgColor || '#FAF8F5'}
                              onChange={(e) => handleUpdateSection(selectedSection.id, { bgColor: e.target.value })}
                              className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                              title="Pick custom color"
                            />
                            <input
                              type="text"
                              value={selectedSection.bgColor || ''}
                              onChange={(e) => handleUpdateSection(selectedSection.id, { bgColor: e.target.value })}
                              placeholder="Transparent or #HEX"
                              className="flex-1 p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Section Text Color Customization */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-stone-400">Section Text Color</label>
                            <button
                              onClick={() => handleUpdateSection(selectedSection.id, { textColor: undefined })}
                              className="text-[10px] text-stone-400 hover:text-white underline cursor-pointer"
                            >
                              Auto
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedSection.textColor || '#1C1917'}
                              onChange={(e) => handleUpdateSection(selectedSection.id, { textColor: e.target.value })}
                              className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                              title="Pick custom text color"
                            />
                            <div className="grid grid-cols-4 gap-1.5 flex-1">
                              {[
                                { label: 'Deep Stone', color: '#1C1917' },
                                { label: 'White', color: '#FFFFFF' },
                                { label: 'Muted', color: '#78716C' },
                                { label: 'Warm Brown', color: '#443428' }
                              ].map((tc) => (
                                <button
                                  key={tc.color}
                                  onClick={() => handleUpdateSection(selectedSection.id, { textColor: tc.color })}
                                  className={`py-1 rounded-lg text-[10px] border cursor-pointer ${
                                    selectedSection.textColor === tc.color 
                                      ? 'border-blue-500 bg-white/15 text-white' 
                                      : 'border-white/10 bg-white/5 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {tc.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Granular 4-Sided Padding Controls */}
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-stone-300">Section Padding (4 Sides)</label>
                            <span className="text-[10px] font-mono text-blue-400">
                              {selectedSection.paddingTop ?? selectedSection.paddingY ?? 16}px / {selectedSection.paddingRight ?? 24}px / {selectedSection.paddingBottom ?? selectedSection.paddingY ?? 16}px / {selectedSection.paddingLeft ?? 24}px
                            </span>
                          </div>

                          {/* Quick Presets */}
                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { label: 'Flush', t: 0, r: 0, b: 0, l: 0 },
                              { label: 'Compact', t: 8, r: 16, b: 8, l: 16 },
                              { label: 'Standard', t: 16, r: 24, b: 16, l: 24 },
                              { label: 'Spacious', t: 32, r: 32, b: 32, l: 32 },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                onClick={() => handleUpdateSection(selectedSection.id, {
                                  paddingTop: preset.t,
                                  paddingRight: preset.r,
                                  paddingBottom: preset.b,
                                  paddingLeft: preset.l,
                                  paddingY: preset.t
                                })}
                                className="py-1 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          {/* 4 Inputs (Top, Right, Bottom, Left) in Box Model Layout */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                                <span>Top</span>
                                <span className="font-mono text-stone-300">{selectedSection.paddingTop ?? selectedSection.paddingY ?? 16}px</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={80}
                                step={4}
                                value={selectedSection.paddingTop ?? selectedSection.paddingY ?? 16}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { paddingTop: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                                <span>Bottom</span>
                                <span className="font-mono text-stone-300">{selectedSection.paddingBottom ?? selectedSection.paddingY ?? 16}px</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={80}
                                step={4}
                                value={selectedSection.paddingBottom ?? selectedSection.paddingY ?? 16}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { paddingBottom: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                                <span>Left</span>
                                <span className="font-mono text-stone-300">{selectedSection.paddingLeft ?? 24}px</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={60}
                                step={4}
                                value={selectedSection.paddingLeft ?? 24}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { paddingLeft: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                                <span>Right</span>
                                <span className="font-mono text-stone-300">{selectedSection.paddingRight ?? 24}px</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={60}
                                step={4}
                                value={selectedSection.paddingRight ?? 24}
                                onChange={(e) => handleUpdateSection(selectedSection.id, { paddingRight: Number(e.target.value) })}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section Content & Background Corner Radius */}
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-stone-300">Content / Media Radius</label>
                              <span className="text-[10px] font-mono text-stone-400">{selectedSection.imageRadius ?? 16}px</span>
                            </div>
                            <p className="text-[10px] text-stone-400 mb-1.5">Rounds image or inner media content directly.</p>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[0, 8, 16, 24].map((rad) => (
                                <button
                                  key={rad}
                                  onClick={() => handleUpdateSection(selectedSection.id, { imageRadius: rad, contentRadius: rad })}
                                  className={`py-1 rounded-lg text-xs font-mono cursor-pointer ${
                                    (selectedSection.imageRadius ?? 16) === rad
                                      ? 'bg-blue-600 text-white font-bold'
                                      : 'bg-white/5 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {rad}px
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-stone-300">Section Background Radius</label>
                              <span className="text-[10px] font-mono text-stone-400">{selectedSection.borderRadius ?? 0}px</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 mt-1">
                              {[
                                { label: '0px', val: 0 },
                                { label: '12px', val: 12 },
                                { label: '24px', val: 24 },
                                { label: '36px', val: 36 }
                              ].map((rad) => (
                                <button
                                  key={rad.val}
                                  onClick={() => handleUpdateSection(selectedSection.id, { borderRadius: rad.val })}
                                  className={`py-1 rounded-lg text-xs font-mono cursor-pointer ${
                                    (selectedSection.borderRadius ?? 0) === rad.val
                                      ? 'bg-white/20 text-white border border-white/30 font-bold'
                                      : 'bg-white/5 text-stone-400 hover:text-white'
                                  }`}
                                >
                                  {rad.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Section Management Order */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-stone-400">Block Order</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                                handleMoveSection(idx, 'up');
                              }}
                              disabled={currentSections.findIndex(s => s.id === selectedSection.id) === 0}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                                handleMoveSection(idx, 'down');
                              }}
                              disabled={currentSections.findIndex(s => s.id === selectedSection.id) === currentSections.length - 1}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                                handleDuplicateSection(idx);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white cursor-pointer"
                              title="Duplicate Block"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const idx = currentSections.findIndex(s => s.id === selectedSection.id);
                                handleDeleteSection(idx);
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                              title="Delete Block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500 text-xs">
                    Click any section on the canvas to inspect and edit its properties.
                  </div>
                )}

                {/* Button to Insert Next Section */}
                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      setInsertTargetIndex(currentSections.length);
                      setShowSectionPicker(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-pink-600/30 text-stone-200 hover:text-pink-200 border border-white/10 hover:border-pink-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add a section</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: TYPOGRAPHY & FRAME */}
            {activeTab === 'style' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Primary Typography
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'serif', label: 'Playfair Editorial Serif', desc: 'Refined luxury & high-fashion' },
                      { id: 'display-slab', label: 'Cinzel Roman Decorative', desc: 'Artisanal culinary & botanical' },
                      { id: 'sans', label: 'Plus Jakarta Modern Sans', desc: 'Minimalist tech & architecture' },
                      { id: 'mono', label: 'JetBrains Code Monospace', desc: 'Serial numbers & tickets' },
                      { id: 'script-hand', label: 'Caveat Handwritten Script', desc: 'Personal author notes' }
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateTemplate({ fontFamily: font.id as EmailFontFamily })}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          template.fontFamily === font.id
                            ? 'bg-white/15 text-white border-white shadow-xs'
                            : 'bg-white/[0.03] text-stone-300 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{font.label}</div>
                          <div className="text-[10px] text-stone-400">{font.desc}</div>
                        </div>
                        {template.fontFamily === font.id && <Check className="w-4 h-4 text-pink-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Outer Card Frame Shape
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'rounded', label: 'Soft Rounded' },
                      { id: 'scalloped', label: 'Scalloped Cloud' },
                      { id: 'arch', label: 'Arched Dome' },
                      { id: 'pill', label: 'Smooth Capsule' },
                      { id: 'polaroid', label: 'Polaroid Mount' },
                      { id: 'square', label: 'Architectural Edge' }
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => updateTemplate({ frameShape: shape.id as EmailFrameShape })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                          template.frameShape === shape.id
                            ? 'bg-white/15 text-white border-white shadow-xs'
                            : 'bg-white/[0.03] text-stone-400 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PALETTES & COLORS */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span>Curated Aesthetic Palettes</span>
                  </label>

                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.entries(palettes).map(([key, pal]) => (
                      <button
                        key={key}
                        onClick={() => updateTemplate({ 
                          paletteTheme: key as EmailPalette,
                          customOuterBg: undefined,
                          customCardBg: undefined,
                          customTextColor: undefined,
                          customBtnBg: undefined,
                          customBtnText: undefined
                        })}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          template.paletteTheme === key && !template.customOuterBg
                            ? 'bg-white/15 text-white border-white shadow-md'
                            : 'bg-white/[0.03] text-stone-300 border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5">
                            <span className="w-6 h-6 rounded-full border border-black/20 shadow-xs" style={{ backgroundColor: pal.outerBg }} />
                            <span className="w-6 h-6 rounded-full border border-black/20 shadow-xs" style={{ backgroundColor: pal.cardBg }} />
                            <span className="w-6 h-6 rounded-full border border-black/20 shadow-xs" style={{ backgroundColor: pal.btnBg }} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{pal.name}</div>
                            <div className="text-[10px] text-stone-400">Preset color pairing</div>
                          </div>
                        </div>
                        {template.paletteTheme === key && !template.customOuterBg && (
                          <Check className="w-4 h-4 text-pink-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Overrides */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-200">Custom Color Tuning</span>
                    <Sliders className="w-3.5 h-3.5 text-stone-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-400">Outer Canvas</label>
                      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10">
                        <input
                          type="color"
                          value={currentTheme.outerBg}
                          onChange={(e) => updateTemplate({ customOuterBg: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-stone-300 uppercase">{currentTheme.outerBg}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-400">Card Background</label>
                      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10">
                        <input
                          type="color"
                          value={currentTheme.cardBg}
                          onChange={(e) => updateTemplate({ customCardBg: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-stone-300 uppercase">{currentTheme.cardBg}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: SWITCH PRESETS / TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  <span>Load Preset Layout</span>
                </div>

                <div className="space-y-3">
                  {INITIAL_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setTemplate({ ...tmpl, sections: getInitialSectionsFromTemplate(tmpl) });
                        showToast(`Loaded ${tmpl.name}`);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        template.id === tmpl.id
                          ? 'bg-pink-600/20 border-pink-500 text-white shadow-md'
                          : 'bg-white/[0.03] text-stone-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{tmpl.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-stone-300 uppercase font-mono">
                            {tmpl.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1 line-clamp-1">{tmpl.headline}</div>
                      </div>
                      <CheckCircle2 className={`w-4 h-4 ${template.id === tmpl.id ? 'text-pink-400' : 'text-transparent'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE FLODESK-STYLE CANVAS STAGE */}
        <div className="lg:col-span-8 xl:col-span-8 bg-[#181D28] relative flex flex-col h-full overflow-hidden">
          
          {/* TOP RIGHT FLOATING CONTROLS (Desktop/Mobile View Icons + Zoom Controls + Canvas Settings) */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
            {/* Canvas / Template Global Settings Popover Trigger */}
            <div className="relative">
              <button
                id="canvas-settings-btn"
                onClick={() => setShowCanvasSettings(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl backdrop-blur-md border shadow-2xl transition-all cursor-pointer text-xs font-semibold ${
                  showCanvasSettings
                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-900/40 ring-2 ring-blue-400/50'
                    : 'bg-[#11151E]/90 text-stone-200 border-white/15 hover:text-white hover:bg-white/10'
                }`}
                title="Canvas & Template Settings (Corner Radius, Width, Border)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Canvas</span>
                <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-blue-200">
                  {template.canvasRadius !== undefined ? `${template.canvasRadius}px` : '24px'}
                </span>
              </button>

              {/* Canvas Settings Popover Panel */}
              {showCanvasSettings && (
                <div 
                  className="absolute right-0 top-12 z-50 w-80 sm:w-96 p-4 rounded-3xl bg-[#151922] border border-white/15 text-white shadow-2xl space-y-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                      <h3 className="font-bold text-sm">Canvas / Template Settings</h3>
                    </div>
                    <button
                      onClick={() => setShowCanvasSettings(false)}
                      className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Global Canvas Corner Radius */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-300">Canvas Corner Radius</label>
                      <span className="font-mono text-xs text-blue-400 font-bold">
                        {template.canvasRadius !== undefined ? `${template.canvasRadius}px` : '24px (Default)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Rounds the template canvas smoothly. All sections placed inside will not break the rounded corners when added, reordered, or replaced.
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Sharp (0px)', val: 0 },
                        { label: 'Subtle (8px)', val: 8 },
                        { label: 'Medium (16px)', val: 16 },
                        { label: 'Smooth (24px)', val: 24 },
                        { label: 'Curved (36px)', val: 36 },
                        { label: 'Pill (48px)', val: 48 },
                      ].map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => updateTemplate({ canvasRadius: opt.val })}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                            (template.canvasRadius === opt.val || (template.canvasRadius === undefined && opt.val === 24))
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Radius Slider */}
                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-[10px] text-stone-400 font-mono">0px</span>
                      <input
                        type="range"
                        min={0}
                        max={64}
                        step={2}
                        value={template.canvasRadius ?? 24}
                        onChange={(e) => updateTemplate({ canvasRadius: Number(e.target.value) })}
                        className="flex-1 accent-blue-500 cursor-pointer"
                      />
                      <span className="text-[10px] text-stone-400 font-mono">64px</span>
                    </div>
                  </div>

                  {/* 2. Canvas Max Width */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-300">Template Max Width</label>
                      <span className="font-mono text-xs text-blue-400 font-bold">{template.canvasWidth || 600}px</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[560, 600, 640, 680].map(w => (
                        <button
                          key={w}
                          onClick={() => updateTemplate({ canvasWidth: w })}
                          className={`py-1 rounded-xl text-xs font-mono font-medium cursor-pointer transition-all ${
                            (template.canvasWidth || 600) === w
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {w}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Canvas Outer Border */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-300">Outer Canvas Border</label>
                      <input
                        type="checkbox"
                        checked={template.canvasBorder || false}
                        onChange={(e) => updateTemplate({ canvasBorder: e.target.checked })}
                        className="rounded accent-blue-500 cursor-pointer"
                      />
                    </div>
                    {template.canvasBorder && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] text-stone-400">Border Width</label>
                          <div className="flex items-center gap-1.5 mt-1">
                            {[1, 2, 4, 6].map(bw => (
                              <button
                                key={bw}
                                onClick={() => updateTemplate({ canvasBorderWidth: bw })}
                                className={`py-0.5 px-2 rounded-lg text-[11px] font-mono cursor-pointer ${
                                  (template.canvasBorderWidth || 2) === bw ? 'bg-blue-600 text-white font-bold' : 'bg-white/5 text-stone-400'
                                }`}
                              >
                                {bw}px
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400">Border Color</label>
                          <input
                            type="color"
                            value={template.canvasBorderColor || '#E2DED6'}
                            onChange={(e) => updateTemplate({ canvasBorderColor: e.target.value })}
                            className="w-full h-7 rounded-lg bg-black/40 border border-white/10 mt-1 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      onClick={() => setShowCanvasSettings(false)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Device View Toggle (Flodesk-style Icon Buttons) */}
            <div className="flex items-center bg-[#11151E]/90 backdrop-blur-md rounded-2xl p-1 border border-white/15 shadow-2xl">
              <button
                id="canvas-desktop-view-btn"
                onClick={() => setDeviceView('desktop')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  deviceView === 'desktop'
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title="Desktop View (600px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                id="canvas-mobile-view-btn"
                onClick={() => setDeviceView('mobile')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  deviceView === 'mobile'
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title="Mobile View (360px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom In / Out & Percentage */}
            <div className="flex items-center bg-[#11151E]/90 backdrop-blur-md rounded-2xl px-2 py-1 border border-white/15 shadow-2xl gap-1 text-xs text-stone-300">
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer transition-colors"
                title="Zoom out (-15%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="font-mono text-[11px] px-1.5 py-0.5 rounded text-center font-bold text-stone-200 hover:bg-white/10 cursor-pointer"
                title="Reset zoom to 100%"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer transition-colors"
                title="Zoom in (+15%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BOTTOM RIGHT FLOATING CONTROLS (Undo/Redo + Selection Outlines + Clean Preview) */}
          <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2">
            {/* Undo / Redo */}
            <div className="flex items-center bg-[#11151E]/90 backdrop-blur-md rounded-2xl p-1 border border-white/15 shadow-2xl">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`p-2 rounded-xl transition-colors ${
                  historyIndex > 0
                    ? 'text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer'
                    : 'text-stone-600 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`p-2 rounded-xl transition-colors ${
                  historyIndex < history.length - 1
                    ? 'text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer'
                    : 'text-stone-600 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Selection Outlines Selector */}
            <div className="flex items-center bg-[#11151E]/90 backdrop-blur-md rounded-2xl p-1 border border-white/15 shadow-2xl gap-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2 hidden sm:flex items-center gap-1">
                <Layers className="w-3 h-3 text-stone-400" />
                <span>Outlines:</span>
              </span>
              <button
                onClick={() => {
                  setEditorGuides('subtle');
                  showToast('Selection Outlines: Subtle Blue');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  editorGuides === 'subtle'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title="Subtle Blue focus & selection outlines"
              >
                Blue
              </button>
              <button
                onClick={() => {
                  setEditorGuides('pink');
                  showToast('Selection Outlines: Pink Focus');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  editorGuides === 'pink'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title="Pink focus & selection outlines"
              >
                Pink
              </button>
              <button
                onClick={() => {
                  setEditorGuides('none');
                  showToast('Selection Outlines: Hidden');
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  editorGuides === 'none'
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
                title="Hide all outline guides"
              >
                Off
              </button>
            </div>

            {/* Preview Mode Toggle */}
            <button
              onClick={() => setIsPreviewOnly(!isPreviewOnly)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 border shadow-2xl transition-all cursor-pointer ${
                isPreviewOnly
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 backdrop-blur-md'
                  : 'bg-[#11151E]/90 text-stone-300 border-white/15 backdrop-blur-md hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Clean Preview Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPreviewOnly ? 'Exit Preview' : 'Preview'}</span>
            </button>
          </div>

          {/* Canvas Viewport Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
            
            {/* Zoom Transform Wrapper */}
            <div 
              style={{ 
                transform: `scale(${zoomLevel / 100})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease'
              }}
              className="w-full flex justify-center py-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                {/* DESKTOP VIEW CONTAINER (Standard 600px Email Card) */}
                {deviceView === 'desktop' ? (
                  <motion.div 
                    key="desktop-canvas-stage"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ backgroundColor: currentTheme.outerBg }}
                    className="w-full max-w-[620px] rounded-[36px] p-6 sm:p-10 shadow-2xl transition-colors duration-300 border border-black/10 relative"
                  >
                  
                  {/* MAIN EMAIL CARD CONTAINER (Configured by Canvas Settings) */}
                  <div 
                    style={{ 
                      backgroundColor: currentTheme.cardBg, 
                      color: currentTheme.cardText,
                      fontFamily: getFontFamilyInline(template.fontFamily),
                      borderRadius: template.canvasRadius !== undefined 
                        ? `${template.canvasRadius}px` 
                        : (template.frameShape === 'square' ? '0px' : template.frameShape === 'pill' ? '44px' : template.frameShape === 'arch' ? '120px 120px 24px 24px' : '24px'),
                      maxWidth: `${template.canvasWidth || 600}px`,
                      border: template.canvasBorder ? `${template.canvasBorderWidth || 2}px solid ${template.canvasBorderColor || 'rgba(0,0,0,0.1)'}` : undefined,
                      overflow: 'hidden'
                    }}
                    className="w-full transition-all duration-300 shadow-xl mx-auto"
                  >
                    
                    {/* DYNAMIC MODULAR SECTIONS WITH FLODESK HOVER & (+) CONTROLS */}
                    {currentSections.map((section, index) => {
                      const isHovered = hoveredSectionId === section.id && !isPreviewOnly;
                      const isSelected = selectedSectionId === section.id && !isPreviewOnly;
                      
                      // Blue boundary on hover / active (as in Screenshot 1 & 2)
                      const isBorderActive = isHovered || isSelected;

                      // Check if layout is one of the 50/50 split layouts
                      const isSplitLayout = section.type === 'layout' && (
                        section.layoutVariant === 'coaching-circle' ||
                        section.layoutVariant === 'split-circle-right' ||
                        section.layoutVariant === 'split-circle-left' ||
                        section.layoutVariant === 'split-square-left' ||
                        section.layoutVariant === 'split-square-right' ||
                        section.imagePosition === 'split-left' ||
                        section.imagePosition === 'split-right'
                      );

                      const isCircleImage = section.layoutVariant === 'coaching-circle' || 
                        section.layoutVariant === 'split-circle-right' || 
                        section.layoutVariant === 'split-circle-left' || 
                        section.imageShape === 'circle';

                      const isLeftImage = section.layoutVariant === 'split-square-left' || 
                        section.layoutVariant === 'split-circle-left' || 
                        section.imagePosition === 'split-left' || 
                        section.imagePosition === 'left';

                      // Granular 4-sided padding calculation
                      const sPadTop = section.paddingTop !== undefined ? section.paddingTop : (section.paddingY ?? 16);
                      const sPadBottom = section.paddingBottom !== undefined ? section.paddingBottom : (section.paddingY ?? 16);
                      const sPadLeft = section.paddingLeft !== undefined ? section.paddingLeft : 24;
                      const sPadRight = section.paddingRight !== undefined ? section.paddingRight : 24;

                      const isFirst = index === 0;
                      const isLast = index === currentSections.length - 1;
                      const cardRad = template.canvasRadius !== undefined 
                        ? template.canvasRadius 
                        : (template.frameShape === 'square' ? 0 : template.frameShape === 'pill' ? 44 : 24);

                      return (
                        <div
                          key={section.id}
                          onMouseEnter={() => setHoveredSectionId(section.id)}
                          onMouseLeave={() => setHoveredSectionId(null)}
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setActiveTab('content');
                          }}
                          style={{
                            backgroundColor: section.bgColor,
                            color: section.textColor,
                            paddingTop: `${sPadTop}px`,
                            paddingBottom: `${sPadBottom}px`,
                            paddingLeft: `${sPadLeft}px`,
                            paddingRight: `${sPadRight}px`,
                            borderRadius: section.borderRadius !== undefined 
                              ? `${section.borderRadius}px` 
                              : isFirst && isLast
                              ? `${cardRad}px`
                              : isFirst
                              ? `${cardRad}px ${cardRad}px 0 0`
                              : isLast
                              ? `0 0 ${cardRad}px ${cardRad}px`
                              : undefined,
                            border: section.hasBorder ? `1px ${section.dividerStyle || 'solid'} ${section.borderColor || 'rgba(0,0,0,0.1)'}` : undefined
                          }}
                          className={`relative transition-all duration-150 cursor-pointer ${getSectionOutlineClass(section.id)}`}
                        >
                          {/* Active Section Selection Badge */}
                          {!isPreviewOnly && editorGuides !== 'none' && isSelected && (
                            <div 
                              className={`absolute top-2.5 left-3 z-40 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 pointer-events-none select-none ${
                                editorGuides === 'pink' 
                                  ? 'bg-pink-600 text-white shadow-pink-900/30' 
                                  : 'bg-blue-600 text-white shadow-blue-900/30'
                              }`}
                            >
                              <Layers className="w-2.5 h-2.5" />
                              <span>{section.type === 'layout' ? (section.layoutVariant || '50/50 Layout') : section.type}</span>
                            </div>
                          )}
                          
                          {/* TOP (+) ADD SECTION BUTTON ON HOVER */}
                          {!isPreviewOnly && isHovered && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInsertTargetIndex(index);
                                setShowSectionPicker(true);
                              }}
                              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-stone-900 border border-stone-300 shadow-md flex items-center justify-center hover:scale-110 hover:bg-stone-50 transition-all cursor-pointer"
                              title="Add section above"
                            >
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}

                          {/* BOTTOM (+) ADD SECTION BUTTON ON HOVER */}
                          {!isPreviewOnly && isHovered && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInsertTargetIndex(index + 1);
                                setShowSectionPicker(true);
                              }}
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-stone-900 border border-stone-300 shadow-md flex items-center justify-center hover:scale-110 hover:bg-stone-50 transition-all cursor-pointer"
                              title="Add section below"
                            >
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}

                          {/* FLOATING ACTION PILL ON THE RIGHT (as seen in Screenshot 1, 2, 3) */}
                          {!isPreviewOnly && isBorderActive && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center bg-white text-stone-700 rounded-2xl shadow-xl border border-stone-200/80 p-1.5 space-y-1 animate-in fade-in zoom-in-90 duration-150"
                            >
                              {/* Move Up */}
                              <button
                                onClick={() => handleMoveSection(index, 'up')}
                                disabled={index === 0}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  index === 0 ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700'
                                }`}
                                title="Move up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>

                              {/* Move Down */}
                              <button
                                onClick={() => handleMoveSection(index, 'down')}
                                disabled={index === currentSections.length - 1}
                                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                  index === currentSections.length - 1 ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700'
                                }`}
                                title="Move down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              {/* Favorite Block */}
                              <button
                                onClick={() => showToast('Section saved to favorites')}
                                className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                                title="Save to favorites"
                              >
                                <Heart className="w-4 h-4" />
                              </button>

                              {/* Duplicate Block */}
                              <button
                                onClick={() => handleDuplicateSection(index)}
                                className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                                title="Duplicate block"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              {/* Delete Block */}
                              <button
                                onClick={() => handleDeleteSection(index)}
                                className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                                title="Delete block"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* SECTION CONTENT RENDERER */}
                          <div className="py-2">
                            
                            {/* 1. LAYOUT PRESET BLOCKS */}
                            {section.type === 'layout' && (
                              <div className="px-6 sm:px-8 py-2">
                                {isSplitLayout ? (
                                  /* 50/50 DIVIDED EQUAL LAYOUT AS REQUESTED */
                                  <div className="grid grid-cols-2 gap-4 sm:gap-6 items-center">
                                    
                                    {/* Left Column */}
                                    {isLeftImage ? (
                                      /* Square or Circle Image Left */
                                      <div className="w-full flex items-center justify-center">
                                        <div className={`w-full max-w-[240px] aspect-square flex items-center justify-center overflow-hidden shadow-sm transition-all ${
                                          isCircleImage 
                                            ? 'rounded-full border-2 border-stone-200 shadow-md' 
                                            : section.imageShape === 'sharp' 
                                            ? 'rounded-none border border-stone-200' 
                                            : 'rounded-2xl border border-stone-200'
                                        } ${section.imageUrl ? 'bg-transparent' : (section.imagePlaceholderBg || 'bg-stone-200/80')}`}>
                                          {section.imageUrl ? (
                                            <img src={section.imageUrl} alt={section.title || 'Photo'} className="w-full h-full object-cover" />
                                          ) : (
                                            <ImageIcon className="w-10 h-10 text-stone-400 stroke-[1.5]" />
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      /* Text Content Left (e.g. 1:1 Business Coaching) */
                                      <div className="space-y-1.5 text-left flex flex-col justify-center">
                                        {(section.originalPrice || section.discountPrice) && (
                                          <div className="text-xs font-mono font-bold">
                                            {section.originalPrice && <span className="line-through opacity-50 mr-2 text-stone-400">{section.originalPrice}</span>}
                                            <span className="font-extrabold text-sm sm:text-base">{section.discountPrice}</span>
                                          </div>
                                        )}
                                        {section.subtitle && (
                                          <div className={`text-[11px] uppercase tracking-wider font-semibold opacity-70 ${getBodyFontClass(template.fontFamily)}`}>{section.subtitle}</div>
                                        )}
                                        <h3 className={`text-lg sm:text-xl font-bold leading-tight ${getFontFamilyClass(template.fontFamily)}`}>
                                          {section.title || '1:1 Business Coaching'}
                                        </h3>
                                        {section.body && (
                                          <p style={{ color: section.textColor ? undefined : currentTheme.cardSub }} className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${getBodyFontClass(template.fontFamily)}`}>
                                            {section.body}
                                          </p>
                                        )}
                                        <div className="pt-1">
                                          <a 
                                            href={section.ctaUrl || '#'} 
                                            onClick={(e) => e.preventDefault()}
                                            className="text-xs font-bold underline hover:opacity-80 transition-opacity inline-block"
                                          >
                                            {section.ctaText || 'Apply now'}
                                          </a>
                                        </div>
                                      </div>
                                    )}

                                    {/* Right Column */}
                                    {isLeftImage ? (
                                      /* Text Content Right */
                                      <div className="space-y-1.5 text-left flex flex-col justify-center">
                                        {(section.originalPrice || section.discountPrice) && (
                                          <div className="text-xs font-mono font-bold">
                                            {section.originalPrice && <span className="line-through opacity-50 mr-2 text-stone-400">{section.originalPrice}</span>}
                                            <span className="font-extrabold text-sm sm:text-base">{section.discountPrice}</span>
                                          </div>
                                        )}
                                        {section.subtitle && (
                                          <div className={`text-[11px] uppercase tracking-wider font-semibold opacity-70 ${getBodyFontClass(template.fontFamily)}`}>{section.subtitle}</div>
                                        )}
                                        <h3 className={`text-lg sm:text-xl font-bold leading-tight ${getFontFamilyClass(template.fontFamily)}`}>
                                          {section.title || 'Introductory Branding Package'}
                                        </h3>
                                        {section.body && (
                                          <p style={{ color: section.textColor ? undefined : currentTheme.cardSub }} className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${getBodyFontClass(template.fontFamily)}`}>
                                            {section.body}
                                          </p>
                                        )}
                                        <div className="pt-1">
                                          <a 
                                            href={section.ctaUrl || '#'} 
                                            onClick={(e) => e.preventDefault()}
                                            className="text-xs font-bold underline hover:opacity-80 transition-opacity inline-block"
                                          >
                                            {section.ctaText || 'Learn more'}
                                          </a>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Square or Circle Image Right */
                                      <div className="w-full flex items-center justify-center">
                                        <div className={`w-full max-w-[240px] aspect-square flex items-center justify-center overflow-hidden shadow-sm transition-all ${
                                          isCircleImage 
                                            ? 'rounded-full border-2 border-stone-200 shadow-md' 
                                            : section.imageShape === 'sharp' 
                                            ? 'rounded-none border border-stone-200' 
                                            : 'rounded-2xl border border-stone-200'
                                        } ${section.imageUrl ? 'bg-transparent' : (section.imagePlaceholderBg || 'bg-stone-200/80')}`}>
                                          {section.imageUrl ? (
                                            <img src={section.imageUrl} alt={section.title || 'Photo'} className="w-full h-full object-cover" />
                                          ) : (
                                            <ImageIcon className="w-10 h-10 text-stone-400 stroke-[1.5]" />
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                ) : section.layoutVariant === 'tips-numbered' ? (
                                  <div className="text-center space-y-2 py-4">
                                    <div className="font-serif text-5xl font-normal text-amber-500 leading-none">
                                      {section.numberPrefix || '6'}
                                    </div>
                                    <h3 className={`text-xl font-bold uppercase tracking-tight ${getFontFamilyClass(template.fontFamily)}`}>
                                      {section.title || 'Tips to Photograph Food'}
                                    </h3>
                                    <div className="w-12 h-0.5 bg-stone-400/40 mx-auto my-2" />
                                    <p style={{ color: section.textColor ? undefined : currentTheme.cardSub }} className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${getBodyFontClass(template.fontFamily)}`}>
                                      {section.body || 'I remember my first try at food photography. I created this guide to help you get started without making all the mistakes I did.'}
                                    </p>
                                    <div className="pt-2">
                                      <span style={{ backgroundColor: currentTheme.btnBg, color: currentTheme.btnText }} className="inline-block px-6 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                                        {section.ctaText || 'READ IT'}
                                      </span>
                                    </div>
                                  </div>
                                ) : section.layoutVariant === 'stacked-discount' ? (
                                  <div className="bg-black text-white p-6 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] text-center">
                                    <div className="absolute inset-0 flex flex-col justify-center items-center opacity-25 select-none font-black text-6xl leading-none tracking-tighter">
                                      <div>30%</div>
                                      <div>30%</div>
                                      <div>30%</div>
                                    </div>
                                    {section.imageUrl && (
                                      <div className="relative z-10 w-28 h-24 rounded-xl overflow-hidden shadow-2xl border border-white/20 mb-2">
                                        <img src={section.imageUrl} alt="Product" className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                    <div className="relative z-10 text-xs font-mono font-bold tracking-widest uppercase text-white/90">
                                      {section.title || 'EXCLUSIVE 30% VIP CODE'}
                                    </div>
                                  </div>
                                ) : section.layoutVariant === 'side-by-side' ? (
                                  <div className="grid grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-md">
                                    <div className="h-44 bg-stone-800">
                                      <img src={section.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4 flex flex-col justify-center items-center text-center bg-white/[0.04]">
                                      <span className="text-[11px] italic font-serif opacity-70">From The 'Gram</span>
                                      <div className="text-xs font-bold mt-1 leading-snug">{section.title || 'The Post That Got Everyone Talking'}</div>
                                      <span style={{ backgroundColor: currentTheme.btnBg, color: currentTheme.btnText }} className="mt-3 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded">
                                        {section.ctaText || 'SEE IT'}
                                      </span>
                                    </div>
                                  </div>
                                ) : section.layoutVariant === 'gift-thanks' ? (
                                  <div className="p-4 rounded-xl border border-dashed border-white/30 text-center space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{section.title || 'A LITTLE GIFT OF THANKS'}</div>
                                    <div className="font-mono text-sm font-black">{section.subtitle || 'FOR JOINING THE LIST'}</div>
                                  </div>
                                ) : (
                                  <div className="text-center space-y-2 py-2">
                                    <div className="text-amber-400 text-sm tracking-widest">★★★★★</div>
                                    <p className={`italic text-base sm:text-lg leading-relaxed max-w-md mx-auto ${template.fontFamily === 'serif' ? 'font-serif' : getBodyFontClass(template.fontFamily)}`}>
                                      {section.authorQuote || template.testimonialQuote || '“Incredible craft and clarity.”'}
                                    </p>
                                    <div style={{ color: section.textColor ? undefined : currentTheme.cardSub }} className={`text-xs font-semibold ${getBodyFontClass(template.fontFamily)}`}>
                                      — {section.authorName || template.testimonialAuthor || 'Verified Patron'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 2. IMAGE BLOCK */}
                            {section.type === 'image' && (
                              <div className="flex justify-center w-full">
                                <div 
                                  style={{ 
                                    maxWidth: `${section.imageWidth || 600}px`,
                                    borderRadius: `${section.imageRadius !== undefined ? section.imageRadius : 16}px`
                                  }} 
                                  className="w-full overflow-hidden shadow-md group relative"
                                >
                                  <img 
                                    src={section.imageUrl || template.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'} 
                                    alt={section.imageAlt || 'Hero Image'}
                                    style={{
                                      borderRadius: `${section.imageRadius !== undefined ? section.imageRadius : 16}px`
                                    }}
                                    className="w-full h-auto max-h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </div>
                              </div>
                            )}

                            {/* 2B. TWO IMAGES (2-COLUMN GRID) BLOCK */}
                            {section.type === 'two-images' && (() => {
                              const imgRad = section.imageRadius !== undefined ? section.imageRadius : 16;
                              const colGap = section.columnGap !== undefined ? section.columnGap : 16;

                              return (
                                <div 
                                  className="grid grid-cols-2 w-full"
                                  style={{ gap: `${colGap}px` }}
                                >
                                  {/* Column 1 */}
                                  <div className="flex flex-col items-center text-center group">
                                    <div 
                                      style={{ borderRadius: `${imgRad}px` }}
                                      className="w-full overflow-hidden shadow-sm aspect-[4/3] bg-stone-800/20 mb-2"
                                    >
                                      <img 
                                        src={section.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'} 
                                        alt={section.title || 'First Image'}
                                        style={{ borderRadius: `${imgRad}px` }}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                    {section.title && (
                                      <div className="text-xs font-bold leading-tight mt-1" style={{ color: section.textColor || currentTheme.cardText }}>
                                        {section.title}
                                      </div>
                                    )}
                                    {section.subtitle && (
                                      <div className="text-[10px] leading-snug mt-0.5" style={{ color: section.textColor ? undefined : currentTheme.cardSub }}>
                                        {section.subtitle}
                                      </div>
                                    )}
                                  </div>

                                  {/* Column 2 */}
                                  <div className="flex flex-col items-center text-center group">
                                    <div 
                                      style={{ borderRadius: `${imgRad}px` }}
                                      className="w-full overflow-hidden shadow-sm aspect-[4/3] bg-stone-800/20 mb-2"
                                    >
                                      <img 
                                        src={section.image2Url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'} 
                                        alt={section.subtitle2 || section.title || 'Second Image'}
                                        style={{ borderRadius: `${imgRad}px` }}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                    </div>
                                    {section.title2 && (
                                      <div className="text-xs font-bold leading-tight mt-1" style={{ color: section.textColor || currentTheme.cardText }}>
                                        {section.title2}
                                      </div>
                                    )}
                                    {section.subtitle2 && (
                                      <div className="text-[10px] leading-snug mt-0.5" style={{ color: section.textColor ? undefined : currentTheme.cardSub }}>
                                        {section.subtitle2}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* 3. LOGO BLOCK */}
                            {section.type === 'logo' && (() => {
                              const logoH = section.spacerHeight || 44;
                              const logoW = section.imageWidth || 180;
                              const padY = section.paddingY !== undefined ? section.paddingY : 12;

                              return (
                                <div 
                                  className="px-6 flex flex-col justify-center"
                                  style={{ 
                                    paddingTop: `${padY}px`,
                                    paddingBottom: `${Math.max(2, padY - 4)}px`,
                                    textAlign: section.textAlign || 'center',
                                    alignItems: section.textAlign === 'left' ? 'flex-start' : section.textAlign === 'right' ? 'flex-end' : 'center'
                                  }}
                                >
                                  {section.logoUrl ? (
                                    <img
                                      src={section.logoUrl}
                                      alt={section.logoSubtitle || 'Brand Logo'}
                                      style={{
                                        height: `${logoH}px`,
                                        width: `${logoW}px`,
                                        maxWidth: '100%',
                                        objectFit: 'contain'
                                      }}
                                      className="object-contain"
                                    />
                                  ) : section.monogramText ? (
                                    <div 
                                      style={{ 
                                        borderColor: currentTheme.cardSub, 
                                        color: currentTheme.cardText,
                                        width: `${Math.min(logoW, logoH)}px`,
                                        height: `${Math.min(logoW, logoH)}px`,
                                        minWidth: `${Math.min(logoW, logoH)}px`,
                                        minHeight: `${Math.min(logoW, logoH)}px`
                                      }}
                                      className="rounded-full border-1.5 flex items-center justify-center font-mono font-bold text-xs tracking-widest shadow-xs"
                                    >
                                      {section.monogramText}
                                    </div>
                                  ) : (
                                    <div 
                                      style={{ 
                                        borderColor: section.textColor ? `${section.textColor}40` : `${currentTheme.cardSub}50`,
                                        color: section.textColor || currentTheme.cardSub,
                                        width: `${logoW}px`,
                                        height: `${logoH}px`,
                                        maxWidth: '100%'
                                      }}
                                      className="border border-dashed rounded-lg flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-75 hover:opacity-100 transition-opacity bg-black/[0.02]"
                                    >
                                      <ImageIcon className="w-4 h-4 opacity-60 shrink-0" />
                                      <span className="text-[11px] tracking-widest font-mono font-bold">LOGO</span>
                                    </div>
                                  )}

                                  {section.logoSubtitle ? (
                                    <div style={{ color: currentTheme.cardSub }} className="font-serif italic text-sm mt-1">
                                      {section.logoSubtitle}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })()}

                            {/* 4. TEXT BLOCK */}
                            {section.type === 'text' && (
                              <div className="px-8 sm:px-12 py-2" style={{ textAlign: section.textAlign || 'center' }}>
                                {section.title && (
                                  <h2 
                                    style={{ 
                                      fontSize: `${section.fontSize || 32}px`, 
                                      lineHeight: 1.15,
                                      color: section.textColor || undefined
                                    }}
                                    className={`font-bold tracking-tight uppercase my-2 ${getFontFamilyClass(template.fontFamily)}`}
                                  >
                                    {section.title}
                                  </h2>
                                )}
                                {section.body && (
                                  <p 
                                    style={{ color: section.textColor || currentTheme.cardSub }} 
                                    className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${getBodyFontClass(template.fontFamily)}`}
                                  >
                                    {section.body}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* 5. BUTTON BLOCK */}
                            {section.type === 'button' && (
                              <div className="px-8 py-4 flex justify-center">
                                <a
                                  href={section.ctaUrl || '#'}
                                  onClick={(e) => e.preventDefault()}
                                  style={{ backgroundColor: section.buttonBg || currentTheme.btnBg, color: section.buttonColor || currentTheme.btnText }}
                                  className={`inline-block px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-lg transition-transform transform hover:scale-105 ${
                                    section.buttonShape === 'sharp'
                                      ? 'rounded-none'
                                      : section.buttonShape === 'rounded'
                                      ? 'rounded-xl'
                                      : 'rounded-full'
                                  }`}
                                >
                                  {section.ctaText || 'EXPLORE NOW'}
                                </a>
                              </div>
                            )}

                            {/* 5B. INTERACTIVE IN-EMAIL FORM FIELD BLOCK */}
                            {section.type === 'form-field' && (
                              <div className="px-6 sm:px-8 py-4">
                                <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                                  {section.formFieldLabel && (
                                    <label className="block text-xs sm:text-sm font-bold text-stone-100">
                                      {section.formFieldLabel}
                                      {section.formFieldRequired && <span className="text-pink-400 ml-1">*</span>}
                                    </label>
                                  )}
                                  
                                  {section.formFieldType === 'textarea' ? (
                                    <textarea
                                      rows={2}
                                      placeholder={section.formFieldPlaceholder || 'Type your message or notes here...'}
                                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-stone-400 focus:outline-none"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <input
                                        type={section.formFieldType === 'email' ? 'email' : 'text'}
                                        placeholder={section.formFieldPlaceholder || 'Enter your email...'}
                                        className="flex-1 p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-stone-400 focus:outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <button
                                        type="button"
                                        style={{ backgroundColor: section.buttonBg || currentTheme.btnBg, color: section.buttonColor || currentTheme.btnText }}
                                        className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shrink-0 shadow-md hover:opacity-90"
                                      >
                                        {section.formSubmitButtonText || 'Submit'}
                                      </button>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                                    <span>🔒 In-email secure input</span>
                                    <span>{section.formConnectedList || 'Lead Segment'}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 5C. INTERACTIVE IN-EMAIL SURVEY / RATING BLOCK */}
                            {section.type === 'form-survey' && (
                              <div className="px-6 sm:px-8 py-4">
                                <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-3">
                                  {section.subtitle && (
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-pink-400">
                                      {section.subtitle}
                                    </div>
                                  )}
                                  <h4 className="font-bold text-sm sm:text-base text-stone-100">
                                    {section.title || 'How was your experience with us?'}
                                  </h4>
                                  
                                  {/* 1-5 Star / Emoji Rating interactive selector preview */}
                                  <div className="flex items-center justify-center gap-2 pt-1">
                                    {[1, 2, 3, 4, 5].map((score) => (
                                      <button
                                        key={score}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showToast(`Selected rating: ${score}/5`);
                                        }}
                                        className="w-10 h-10 rounded-xl bg-black/40 hover:bg-pink-600 hover:text-white border border-white/20 text-stone-200 font-extrabold text-sm transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                      >
                                        {score}
                                      </button>
                                    ))}
                                  </div>

                                  <p className="text-[10px] text-stone-400">
                                    Clicking a score records one-click feedback immediately
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* 6. DIVIDER BLOCK */}
                            {section.type === 'divider' && (
                              <div className="px-8 py-3">
                                <div style={{ borderTopStyle: section.dividerStyle || 'solid', borderColor: currentTheme.cardSub }} className="w-full border-t opacity-30" />
                              </div>
                            )}

                            {/* 7. SPACER BLOCK */}
                            {section.type === 'spacer' && (
                              <div style={{ height: `${section.spacerHeight || 24}px` }} className="w-full" />
                            )}

                            {/* 8. COUNTDOWN BLOCK */}
                            {section.type === 'countdown' && (
                              <div className="p-4 text-center bg-white/[0.04] border-y border-white/10 my-2">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-75">
                                  {section.countdownLabel || 'FLASH SALE ENDS IN'}
                                </span>
                                <div className="flex items-center justify-center gap-3 mt-2 font-mono">
                                  <div className="px-3 py-1.5 rounded-lg bg-black/40 text-center">
                                    <div className="text-sm font-extrabold">24</div>
                                    <div className="text-[9px] opacity-60">HRS</div>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-lg bg-black/40 text-center">
                                    <div className="text-sm font-extrabold">38</div>
                                    <div className="text-[9px] opacity-60">MIN</div>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-lg bg-black/40 text-center">
                                    <div className="text-sm font-extrabold">15</div>
                                    <div className="text-[9px] opacity-60">SEC</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 9. E-COMMERCE PRODUCT BLOCK */}
                            {section.type === 'ecommerce' && (
                              <div className="px-8 py-4 flex justify-center">
                                <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 text-center max-w-sm w-full space-y-3">
                                  <img 
                                    src={section.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'} 
                                    alt="Product"
                                    className="w-36 h-36 mx-auto rounded-xl object-cover shadow-sm"
                                  />
                                  <h4 className="font-bold text-base">{section.title || 'Pure Botanical Lip Elixir'}</h4>
                                  <div className="font-mono font-extrabold text-sm">{section.discountPrice || '$38.00'}</div>
                                  <span style={{ backgroundColor: currentTheme.btnBg, color: currentTheme.btnText }} className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {section.ctaText || 'ADD TO BAG'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* 10. SOCIAL & FOOTER BLOCKS */}
                            {section.type === 'social' && (
                              <div className="py-4 text-center space-y-1.5">
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Follow Our Journal</div>
                                <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                                  <span className="hover:underline">Instagram</span> • 
                                  <span className="hover:underline">Pinterest</span> • 
                                  <span className="hover:underline">TikTok</span>
                                </div>
                              </div>
                            )}

                            {section.type === 'footer' && (
                              <div style={{ borderColor: 'rgba(0,0,0,0.1)', color: currentTheme.cardSub }} className="px-6 py-6 border-t text-center text-[11px] space-y-1 bg-black/10">
                                <p>{section.footerNote || 'Delivered with care via Sendline High-Deliverability Network.'}</p>
                                <p className="opacity-75">
                                  <a href="#" className="underline hover:text-white">Unsubscribe</a> • <a href="#" className="underline hover:text-white">Preferences</a> • <a href="#" className="underline hover:text-white">View in Browser</a>
                                </p>
                              </div>
                            )}

                          </div>

                        </div>
                      );
                    })}

                  </div>

                  </motion.div>
                ) : (
                  /* MOBILE VIEW (iPhone Realistic Mockup Container) */
                  <motion.div 
                    key="mobile-canvas-stage"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[360px] bg-black p-3.5 rounded-[52px] shadow-2xl border-4 border-stone-800 relative select-none"
                  >
                  
                  {/* Dynamic Island / Speaker */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-900 ml-auto mr-2" />
                  </div>

                  {/* Phone Screen Viewport */}
                  <div 
                    style={{ backgroundColor: currentTheme.outerBg }}
                    className="w-full h-[620px] rounded-[42px] overflow-y-auto pt-10 pb-6 px-3 space-y-4"
                  >
                    
                    {/* Card Content inside Phone */}
                    <div 
                      style={{ 
                        backgroundColor: currentTheme.cardBg, 
                        color: currentTheme.cardText,
                        fontFamily: getFontFamilyInline(template.fontFamily)
                      }}
                      className={`p-3.5 shadow-lg ${
                        template.frameShape === 'scalloped'
                          ? 'rounded-[32px] border-2 border-black/10'
                          : template.frameShape === 'arch'
                          ? 'rounded-t-[100px] rounded-b-2xl'
                          : 'rounded-2xl'
                      }`}
                    >
                      {currentSections.map((sec) => (
                        <div
                          key={sec.id}
                          onMouseEnter={() => setHoveredSectionId(sec.id)}
                          onMouseLeave={() => setHoveredSectionId(null)}
                          onClick={() => {
                            setSelectedSectionId(sec.id);
                            setActiveTab('content');
                          }}
                          className={`py-2 text-center relative transition-all duration-150 cursor-pointer ${getSectionOutlineClass(sec.id)}`}
                          style={{
                            backgroundColor: sec.bgColor,
                            color: sec.textColor,
                            borderRadius: sec.borderRadius ? `${sec.borderRadius}px` : undefined
                          }}
                        >
                          {/* Active Section Selection Badge for Mobile */}
                          {!isPreviewOnly && editorGuides !== 'none' && selectedSectionId === sec.id && (
                            <div 
                              className={`absolute top-1.5 left-2 z-40 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 pointer-events-none select-none ${
                                editorGuides === 'pink' 
                                  ? 'bg-pink-600 text-white shadow-pink-900/30' 
                                  : 'bg-blue-600 text-white shadow-blue-900/30'
                              }`}
                            >
                              <Layers className="w-2 h-2" />
                              <span>{sec.type === 'layout' ? (sec.layoutVariant || '50/50 Layout') : sec.type}</span>
                            </div>
                          )}
                          {sec.type === 'logo' && (() => {
                            const mobileH = Math.min(60, (sec.spacerHeight || 44) * 0.75);
                            const mobileW = Math.min(220, (sec.imageWidth || 180) * 0.8);
                            return (
                              <div className="py-1 flex flex-col items-center justify-center">
                                {sec.logoUrl ? (
                                  <img 
                                    src={sec.logoUrl} 
                                    alt="Logo" 
                                    style={{
                                      height: `${mobileH}px`,
                                      width: `${mobileW}px`,
                                      maxWidth: '100%',
                                      objectFit: 'contain'
                                    }}
                                    className="object-contain mx-auto" 
                                  />
                                ) : sec.monogramText ? (
                                  <div 
                                    style={{
                                      width: `${Math.min(mobileH, mobileW)}px`,
                                      height: `${Math.min(mobileH, mobileW)}px`,
                                      minWidth: `${Math.min(mobileH, mobileW)}px`,
                                      minHeight: `${Math.min(mobileH, mobileW)}px`
                                    }}
                                    className="rounded-full border border-stone-400 mx-auto flex items-center justify-center font-mono font-bold text-xs"
                                  >
                                    {sec.monogramText}
                                  </div>
                                ) : (
                                  <div 
                                    style={{
                                      width: `${mobileW}px`,
                                      height: `${mobileH}px`,
                                      maxWidth: '100%'
                                    }}
                                    className="border border-dashed border-stone-400/50 rounded-md flex items-center justify-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider opacity-70"
                                  >
                                    <ImageIcon className="w-3.5 h-3.5 opacity-60" />
                                    <span>LOGO</span>
                                  </div>
                                )}
                                {sec.logoSubtitle ? (
                                  <div className="text-[10px] italic font-serif opacity-70 mt-0.5">{sec.logoSubtitle}</div>
                                ) : null}
                              </div>
                            );
                          })()}
                          {sec.type === 'text' && (
                            <div style={{ textAlign: sec.textAlign || 'center' }}>
                              {sec.subtitle && <div className={`text-[9px] uppercase tracking-wider font-semibold opacity-70 mb-0.5 ${getBodyFontClass(template.fontFamily)}`}>{sec.subtitle}</div>}
                              {sec.title && <h3 className={`font-bold uppercase text-sm leading-tight my-1 ${getFontFamilyClass(template.fontFamily)}`}>{sec.title}</h3>}
                              {sec.body && <p style={{ color: sec.textColor || currentTheme.cardSub }} className={`text-xs leading-relaxed ${getBodyFontClass(template.fontFamily)}`}>{sec.body}</p>}
                            </div>
                          )}
                          {sec.type === 'image' && (
                            <div 
                              style={{ borderRadius: `${sec.imageRadius !== undefined ? sec.imageRadius : 12}px` }} 
                              className="overflow-hidden my-1 shadow-xs"
                            >
                              <img 
                                src={sec.imageUrl || template.imageUrl} 
                                alt="" 
                                style={{ borderRadius: `${sec.imageRadius !== undefined ? sec.imageRadius : 12}px` }}
                                className="w-full h-36 object-cover" 
                              />
                            </div>
                          )}
                          {sec.type === 'two-images' && (
                            <div className="grid grid-cols-2 gap-2 my-1">
                              <div className="text-center">
                                <div 
                                  style={{ borderRadius: `${sec.imageRadius !== undefined ? sec.imageRadius : 10}px` }} 
                                  className="overflow-hidden aspect-[4/3] bg-black/10"
                                >
                                  <img 
                                    src={sec.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                {sec.title && <div className="text-[10px] font-bold mt-1 leading-tight">{sec.title}</div>}
                                {sec.subtitle && <div className="text-[9px] opacity-70 leading-tight">{sec.subtitle}</div>}
                              </div>
                              <div className="text-center">
                                <div 
                                  style={{ borderRadius: `${sec.imageRadius !== undefined ? sec.imageRadius : 10}px` }} 
                                  className="overflow-hidden aspect-[4/3] bg-black/10"
                                >
                                  <img 
                                    src={sec.image2Url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                {sec.title2 && <div className="text-[10px] font-bold mt-1 leading-tight">{sec.title2}</div>}
                                {sec.subtitle2 && <div className="text-[9px] opacity-70 leading-tight">{sec.subtitle2}</div>}
                              </div>
                            </div>
                          )}
                          {sec.type === 'layout' && (
                            <div className="p-3 bg-black/5 rounded-xl my-1 text-left space-y-1">
                              {sec.subtitle && <div className={`text-[9px] uppercase tracking-wider font-semibold opacity-70 ${getBodyFontClass(template.fontFamily)}`}>{sec.subtitle}</div>}
                              <div className={`font-bold text-xs ${getFontFamilyClass(template.fontFamily)}`}>{sec.title || 'Featured Post'}</div>
                              {sec.body && <p style={{ color: sec.textColor || currentTheme.cardSub }} className={`text-[10px] leading-relaxed ${getBodyFontClass(template.fontFamily)}`}>{sec.body}</p>}
                              {sec.ctaText && (
                                <div className="pt-1">
                                  <span className="text-[10px] font-bold underline">{sec.ctaText}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {sec.type === 'button' && (
                            <div className="my-2">
                              <span style={{ backgroundColor: sec.buttonBg || currentTheme.btnBg, color: sec.buttonColor || currentTheme.btnText }} className={`inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase shadow-xs ${getFontFamilyClass(template.fontFamily)}`}>
                                {sec.ctaText || 'VIEW'}
                              </span>
                            </div>
                          )}
                          {sec.type === 'divider' && (
                            <div className="py-2">
                              <hr style={{ borderColor: currentTheme.cardSub, opacity: 0.3 }} />
                            </div>
                          )}
                          {sec.type === 'spacer' && (
                            <div style={{ height: `${Math.min(sec.spacerHeight || 20, 24)}px` }} />
                          )}
                          {sec.type === 'countdown' && (
                            <div className="p-2.5 rounded-lg bg-black/10 my-1 text-center">
                              <div className="text-[8px] font-mono uppercase font-bold tracking-wider">{sec.countdownLabel || 'SALE ENDS IN'}</div>
                              <div className="flex justify-center gap-1.5 mt-1 font-mono text-xs font-bold">
                                <span className="px-1.5 py-0.5 bg-black/30 rounded">24h</span>
                                <span className="px-1.5 py-0.5 bg-black/30 rounded">38m</span>
                                <span className="px-1.5 py-0.5 bg-black/30 rounded">15s</span>
                              </div>
                            </div>
                          )}
                          {sec.type === 'ecommerce' && (
                            <div className="p-3 bg-black/5 rounded-xl text-center space-y-1.5 my-1">
                              <img src={sec.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80'} alt="" className="w-20 h-20 mx-auto rounded-lg object-cover" />
                              <div className="font-bold text-xs">{sec.title || 'Product'}</div>
                              <div className="font-mono text-xs font-extrabold">{sec.discountPrice || '$38.00'}</div>
                              <span style={{ backgroundColor: currentTheme.btnBg, color: currentTheme.btnText }} className="inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase">
                                {sec.ctaText || 'ADD TO BAG'}
                              </span>
                            </div>
                          )}
                          {sec.type === 'social' && (
                            <div className="py-2 text-center text-[9px] font-semibold opacity-70">
                              Instagram • Pinterest • TikTok
                            </div>
                          )}
                          {sec.type === 'footer' && (
                            <div className="pt-2 border-t border-black/10 text-center text-[8px] opacity-70 space-y-0.5">
                              <p>{sec.footerNote || 'Delivered with Sendline Editorial Network.'}</p>
                              <p>Unsubscribe • Preferences</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Home Bar Indicator */}
                  <div className="w-32 h-1 bg-stone-700 rounded-full mx-auto mt-2" />
                </motion.div>
              )}
            </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
      )}

      {/* SECTION PICKER MODAL (The 17-item Grid & Layouts Library) */}
      <SectionPickerModal
        isOpen={showSectionPicker}
        insertIndex={insertTargetIndex}
        onClose={() => setShowSectionPicker(false)}
        onSelectBlock={(type, layoutPreset) => {
          handleAddSection(type, layoutPreset);
        }}
      />

      {/* RAW HTML CODE MODAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-white/20 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Clean Responsive HTML Code</span>
              </div>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code Box */}
            <div className="flex-1 p-6 overflow-y-auto bg-black/60 font-mono text-xs text-stone-300">
              <pre className="whitespace-pre-wrap">{generateEmailHtml(template)}</pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#0C0F17]">
              <span className="text-xs text-stone-400">Tested across Outlook, Gmail, Apple Mail, and Yahoo.</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadHtml}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Full HTML'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SIMULATE TEST EMAIL MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-white/20 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Send Immediate Test Dispatch</h3>
              </div>
              <button 
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Deliver a live rendered test email via the Sendline sub-30ms transactional API pool.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 font-semibold">Recipient Email Address</label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTest}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Deliver Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUIDES / OUTLINES EXPLANATION MODAL */}
      {showGuidesHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-white/20 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white">About Editor Selection Outlines</h3>
              </div>
              <button 
                onClick={() => setShowGuidesHelp(false)}
                className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
                <strong>Are these blue borders in the real email?</strong>
                <p className="mt-1 text-stone-300">
                  <strong>No!</strong> The blue outline is the active block hover indicator with top (+) and bottom (+) insertion buttons and floating quick-action pill handles.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-white">How to customize or remove them:</p>
                <ul className="list-disc pl-4 space-y-1 text-stone-400">
                  <li><strong>Subtle (Default):</strong> Refined, unobtrusive blue hover indicators.</li>
                  <li><strong>Pink:</strong> High-contrast focus outlines.</li>
                  <li><strong>Hidden:</strong> Completely removes all outlines for a 100% clean canvas view.</li>
                  <li><strong>Clean Preview:</strong> Click the <span className="text-white">Clean Preview</span> eye button in the top bar to inspect without any editor chrome.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowGuidesHelp(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
