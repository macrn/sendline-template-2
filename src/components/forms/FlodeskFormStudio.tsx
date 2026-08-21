import React, { useState, useRef, useEffect } from 'react';
import { 
  FormItem, 
  FormFieldConfig, 
  FormFieldType, 
  FormLinkItem, 
  EmailFontFamily, 
  EmailFrameShape, 
  EmailPalette 
} from '../../types';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Share2, 
  Settings as SettingsIcon, 
  Type, 
  Palette, 
  Layers, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  Copy, 
  Code, 
  Globe, 
  Sparkles, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Download, 
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle2,
  Undo2,
  Redo2,
  Tag,
  MousePointer,
  HelpCircle,
  Copy as DuplicateIcon,
  MoveUp,
  MoveDown,
  Lock,
  Calendar,
  List,
  CheckSquare,
  FileText,
  Mail,
  Phone,
  Radio,
  Sliders,
  Sparkle,
  GripVertical,
  MoreHorizontal,
  Minus,
  Maximize2,
  ExternalLink
} from 'lucide-react';

interface FlodeskFormStudioProps {
  form: FormItem;
  onClose: () => void;
  onSaveForm: (updatedForm: FormItem) => void;
  onOpenPublicPreview: (form: FormItem) => void;
  onOpenTemplatesGallery?: () => void;
}

// Available canvas elements for direct selection
export type SelectedElementType = 
  | 'canvas'
  | 'card'
  | 'monogram'
  | 'script'
  | 'badge'
  | 'headline'
  | 'subtitle'
  | 'media'
  | 'field-block'
  | 'field'
  | 'button'
  | 'links'
  | 'link-item'
  | 'thankyou-icon'
  | 'thankyou-headline'
  | 'thankyou-message'
  | 'thankyou-action';

export const FlodeskFormStudio: React.FC<FlodeskFormStudioProps> = ({
  form,
  onClose,
  onSaveForm,
  onOpenPublicPreview,
  onOpenTemplatesGallery
}) => {
  // Page View Switcher: Design (Form) vs Thank You (Confirmation)
  const [activePage, setActivePage] = useState<'design' | 'thank_you'>('design');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  
  // Inspector Tabs: Fields | Content | Button | Links | Style | Font | Thank You
  const [activeInspectorTab, setActiveInspectorTab] = useState<'fields' | 'content' | 'button' | 'links' | 'style' | 'font' | 'thankyou'>('fields');
  
  // Selection & Hover State
  const [selectedElement, setSelectedElement] = useState<SelectedElementType>('field');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(form.fields?.[0]?.id || null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  // In-Canvas Field Inserter State
  const [activeInsertIndex, setActiveInsertIndex] = useState<number | null>(null);
  const [showQuickFieldPicker, setShowQuickFieldPicker] = useState(false);
  const [showAddFieldDropdown, setShowAddFieldDropdown] = useState(false);

  // Custom Field Creation Modal State
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [customFieldType, setCustomFieldType] = useState<FormFieldType>('text');
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState('');
  const [customFieldRequired, setCustomFieldRequired] = useState(false);
  const [customFieldDropdownOptions, setCustomFieldDropdownOptions] = useState<string[]>(['Option 1', 'Option 2']);

  // Modals inside Studio
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [publishModalTab, setPublishModalTab] = useState<'link' | 'embed_js' | 'embed_iframe' | 'embed_raw'>('link');
  const [embedPlacement, setEmbedPlacement] = useState<'inline' | 'popup' | 'ribbon'>('inline');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fieldActionMenuId, setFieldActionMenuId] = useState<string | null>(null);
  const [isSpacingAccordionOpen, setIsSpacingAccordionOpen] = useState(false);
  const [isFieldSizingOpen, setIsFieldSizingOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState(form.title);
  const [slug, setSlug] = useState(form.slug);
  const [description, setDescription] = useState(form.description);
  const [category, setCategory] = useState(form.category);
  const [formType, setFormType] = useState(form.formType || 'link_in_bio');
  const [headline, setHeadline] = useState(form.headline || form.title);
  const [subtitle, setSubtitle] = useState(form.subtitle || form.description);
  const [bodyText, setBodyText] = useState(form.bodyText || '');
  const [badgeText, setBadgeText] = useState(form.badgeText || '');
  const [scriptOverlay, setScriptOverlay] = useState(form.scriptOverlay || '');
  const [monogram, setMonogram] = useState(form.monogram || '');
  const [imageUrl, setImageUrl] = useState(form.imageUrl || '');
  const [videoUrl, setVideoUrl] = useState(form.videoUrl || '');
  const [frameShape, setFrameShape] = useState<EmailFrameShape>(form.frameShape || 'rounded');
  const [paletteTheme, setPaletteTheme] = useState<EmailPalette>(form.paletteTheme || 'sand');
  
  // Style properties
  const [accentColor, setAccentColor] = useState(form.accentColor || '#18181b');
  const [fontFamily, setFontFamily] = useState<EmailFontFamily>(form.fontFamily || 'serif');
  const [fontSize, setFontSize] = useState(form.fontSize || 32);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(form.textAlign || 'center');
  const [buttonShape, setButtonShape] = useState<FormItem['buttonShape']>(form.buttonShape || 'pill');
  const [submitButtonText, setSubmitButtonText] = useState(form.submitButtonText || 'Subscribe');
  const [canvasRadius, setCanvasRadius] = useState(form.canvasRadius ?? 24);
  const [bgColor, setBgColor] = useState(form.bgColor || '#FAF7F2');
  const [cardBgColor, setCardBgColor] = useState(form.cardBgColor || '#FFFFFF');
  const [textColor, setTextColor] = useState(form.textColor || '#18181B');
  const [buttonBgColor, setButtonBgColor] = useState(form.buttonBgColor || '#18181B');
  const [buttonTextColor, setButtonTextColor] = useState(form.buttonTextColor || '#FFFFFF');
  const [isUppercase, setIsUppercase] = useState(false);
  const [showPrivacyNote, setShowPrivacyNote] = useState(form.showPrivacyNote ?? true);
  const [privacyNoteText, setPrivacyNoteText] = useState(form.privacyNoteText || '🔒 No spam. Unsubscribe anytime.');

  // Field Block Styling (Flodesk-style Form Field configuration)
  const [fieldStyle, setFieldStyle] = useState<NonNullable<FormItem['fieldStyle']>>(form.fieldStyle || 'outlined_rounded');
  const [fieldBorderColor, setFieldBorderColor] = useState(form.fieldBorderColor || '#217CC5');
  const [fieldBorderWidth, setFieldBorderWidth] = useState(form.fieldBorderWidth ?? 1);
  const [fieldBgColor, setFieldBgColor] = useState(form.fieldBgColor || '#FFFFFF');
  const [fieldTextColor, setFieldTextColor] = useState(form.fieldTextColor || '#207CC5');
  const [fieldFontFamily, setFieldFontFamily] = useState<string>(form.fieldFontFamily || 'editorial');
  const [fieldFontWeight, setFieldFontWeight] = useState<string>(form.fieldFontWeight || 'regular');
  const [fieldFontSize, setFieldFontSize] = useState(form.fieldFontSize || 16);
  const [fieldTextAlign, setFieldTextAlign] = useState<'left' | 'center' | 'right'>(form.fieldTextAlign || 'center');
  const [fieldTextCase, setFieldTextCase] = useState<'normal' | 'uppercase'>(form.fieldTextCase || 'normal');
  const [fieldSpacing, setFieldSpacing] = useState(form.fieldSpacing ?? 12);
  const [fieldPaddingY, setFieldPaddingY] = useState(form.fieldPaddingY ?? 44);
  const [fieldLetterSpacing, setFieldLetterSpacing] = useState(form.fieldLetterSpacing ?? 0);

  // Fields and Links
  const [fields, setFields] = useState<FormFieldConfig[]>(() => {
    if (form.fields && form.fields.length > 0) return form.fields;
    return [
      { id: 'f1', type: 'text', label: 'Your name', placeholder: 'Enter your name', required: false, mapToField: 'first_name' },
      { id: 'f2', type: 'email', label: 'Your email', placeholder: 'Enter your email address', required: true, mapToField: 'email' }
    ];
  });

  const [links, setLinks] = useState<FormLinkItem[]>(form.links || [
    { id: 'l1', title: 'WATCH: UNLOCK YOUR POTENTIAL', subtitle: 'Free video to help you unlock your leadership potential using proven mindfulness techniques', url: 'https://sendline.co/editorial', badge: 'Latest', highlighted: false },
    { id: 'l2', title: '*FREE* 15 DAYS OF MINDFULNESS', subtitle: 'Purpose-driven, mindful leadership boosts your business. Kickstart your journey with this free guide.', url: 'https://sendline.co/guide', highlighted: true },
    { id: 'l3', title: '25% OFF FLODESK', subtitle: 'Take your email marketing to the next level with 25% off your first year of my favorite tool, Flodesk!', url: 'https://flodesk.com' }
  ]);

  // Thank you page properties
  const [thankYouHeadline, setThankYouHeadline] = useState(form.thankYouHeadline || 'Thank You for Joining!');
  const [thankYouMessage, setThankYouMessage] = useState(form.thankYouMessage || form.successMessage || 'Your submission has been received. Check your inbox for updates.');
  const [thankYouActionType, setThankYouActionType] = useState<'message' | 'download' | 'redirect'>(form.thankYouActionType || 'message');
  const [thankYouDownloadUrl, setThankYouDownloadUrl] = useState(form.thankYouDownloadUrl || 'https://sendline.co/downloads/guide.pdf');
  const [thankYouDownloadButtonText, setThankYouDownloadButtonText] = useState(form.thankYouDownloadButtonText || 'Download Freebie (PDF)');
  const [thankYouRedirectUrl, setThankYouRedirectUrl] = useState(form.thankYouRedirectUrl || 'https://sendline.co');

  // Settings properties
  const [targetTag, setTargetTag] = useState(form.targetTag || 'Website-Lead');
  const [targetSegments, setTargetSegments] = useState<string[]>(form.targetSegments || (form.targetSegment ? [form.targetSegment] : ['US VIP Customers & Active Subscribers']));
  const [doubleOptIn, setDoubleOptIn] = useState(form.doubleOptIn ?? false);
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(form.notifyOnSubmission ?? true);
  const [notificationEmail, setNotificationEmail] = useState(form.notificationEmail || 'mehmet@sendline.io');
  const [enableCaptcha, setEnableCaptcha] = useState(form.enableCaptcha ?? false);

  // Dismiss dropdowns and action menus when clicking anywhere on the page
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Dismiss field action menu if clicked outside trigger or popover
      if (fieldActionMenuId) {
        if (!target.closest('[data-field-action-menu]') && !target.closest('[data-field-action-trigger]')) {
          setFieldActionMenuId(null);
        }
      }

      // Dismiss add field dropdown if clicked outside
      if (showAddFieldDropdown) {
        if (!target.closest('[data-add-field-menu]') && !target.closest('[data-add-field-trigger]')) {
          setShowAddFieldDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [fieldActionMenuId, showAddFieldDropdown]);

  // Undo / Redo History Stack
  interface FormSnapshot {
    headline: string;
    subtitle: string;
    fields: FormFieldConfig[];
    links: FormLinkItem[];
    submitButtonText: string;
    accentColor: string;
    cardBgColor: string;
    bgColor: string;
    buttonBgColor: string;
    fontFamily: EmailFontFamily;
    fontSize: number;
    buttonShape: FormItem['buttonShape'];
    canvasRadius: number;
    thankYouHeadline: string;
    thankYouMessage: string;
    thankYouActionType: 'message' | 'download' | 'redirect';
    thankYouDownloadUrl: string;
    thankYouDownloadButtonText: string;
    thankYouRedirectUrl: string;
    fieldStyle: NonNullable<FormItem['fieldStyle']>;
    fieldBorderColor: string;
    fieldBorderWidth: number;
    fieldBgColor: string;
    fieldTextColor: string;
    fieldFontFamily: string;
    fieldFontWeight: string;
    fieldFontSize: number;
    fieldTextAlign: 'left' | 'center' | 'right';
    fieldTextCase: 'normal' | 'uppercase';
    fieldSpacing: number;
    showPrivacyNote: boolean;
    privacyNoteText: string;
  }

  const [history, setHistory] = useState<FormSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryAction = useRef(false);

  const takeSnapshot = () => {
    if (isHistoryAction.current) return;
    const snap: FormSnapshot = {
      headline,
      subtitle,
      fields: JSON.parse(JSON.stringify(fields)),
      links: JSON.parse(JSON.stringify(links)),
      submitButtonText,
      accentColor,
      cardBgColor,
      bgColor,
      buttonBgColor,
      fontFamily,
      fontSize,
      buttonShape,
      canvasRadius,
      thankYouHeadline,
      thankYouMessage,
      thankYouActionType,
      thankYouDownloadUrl,
      thankYouDownloadButtonText,
      thankYouRedirectUrl,
      fieldStyle,
      fieldBorderColor,
      fieldBorderWidth,
      fieldBgColor,
      fieldTextColor,
      fieldFontFamily,
      fieldFontWeight,
      fieldFontSize,
      fieldTextAlign,
      fieldTextCase,
      fieldSpacing,
      showPrivacyNote,
      privacyNoteText
    };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), snap]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryAction.current = true;
      const prevSnap = history[historyIndex - 1];
      setHeadline(prevSnap.headline);
      setSubtitle(prevSnap.subtitle);
      setFields(prevSnap.fields);
      setLinks(prevSnap.links);
      setSubmitButtonText(prevSnap.submitButtonText);
      setAccentColor(prevSnap.accentColor);
      setCardBgColor(prevSnap.cardBgColor);
      setBgColor(prevSnap.bgColor);
      setButtonBgColor(prevSnap.buttonBgColor);
      setFontFamily(prevSnap.fontFamily);
      setFontSize(prevSnap.fontSize);
      setButtonShape(prevSnap.buttonShape);
      setCanvasRadius(prevSnap.canvasRadius);
      setThankYouHeadline(prevSnap.thankYouHeadline);
      setThankYouMessage(prevSnap.thankYouMessage);
      setThankYouActionType(prevSnap.thankYouActionType || 'message');
      setThankYouDownloadUrl(prevSnap.thankYouDownloadUrl || 'https://sendline.co/downloads/guide.pdf');
      setThankYouDownloadButtonText(prevSnap.thankYouDownloadButtonText || 'Download Freebie (PDF)');
      setThankYouRedirectUrl(prevSnap.thankYouRedirectUrl || 'https://sendline.co');
      setFieldStyle(prevSnap.fieldStyle);
      setFieldBorderColor(prevSnap.fieldBorderColor);
      setFieldBorderWidth(prevSnap.fieldBorderWidth);
      setFieldBgColor(prevSnap.fieldBgColor);
      setFieldTextColor(prevSnap.fieldTextColor);
      setFieldFontFamily(prevSnap.fieldFontFamily);
      setFieldFontWeight(prevSnap.fieldFontWeight);
      setFieldFontSize(prevSnap.fieldFontSize);
      setFieldTextAlign(prevSnap.fieldTextAlign);
      setFieldTextCase(prevSnap.fieldTextCase);
      setFieldSpacing(prevSnap.fieldSpacing);
      setShowPrivacyNote(prevSnap.showPrivacyNote ?? true);
      setPrivacyNoteText(prevSnap.privacyNoteText || '🔒 No spam. Unsubscribe anytime.');
      setHistoryIndex(prev => prev - 1);
      setTimeout(() => { isHistoryAction.current = false; }, 50);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryAction.current = true;
      const nextSnap = history[historyIndex + 1];
      setHeadline(nextSnap.headline);
      setSubtitle(nextSnap.subtitle);
      setFields(nextSnap.fields);
      setLinks(nextSnap.links);
      setSubmitButtonText(nextSnap.submitButtonText);
      setAccentColor(nextSnap.accentColor);
      setCardBgColor(nextSnap.cardBgColor);
      setBgColor(nextSnap.bgColor);
      setButtonBgColor(nextSnap.buttonBgColor);
      setFontFamily(nextSnap.fontFamily);
      setFontSize(nextSnap.fontSize);
      setButtonShape(nextSnap.buttonShape);
      setCanvasRadius(nextSnap.canvasRadius);
      setThankYouHeadline(nextSnap.thankYouHeadline);
      setThankYouMessage(nextSnap.thankYouMessage);
      setThankYouActionType(nextSnap.thankYouActionType || 'message');
      setThankYouDownloadUrl(nextSnap.thankYouDownloadUrl || 'https://sendline.co/downloads/guide.pdf');
      setThankYouDownloadButtonText(nextSnap.thankYouDownloadButtonText || 'Download Freebie (PDF)');
      setThankYouRedirectUrl(nextSnap.thankYouRedirectUrl || 'https://sendline.co');
      setFieldStyle(nextSnap.fieldStyle);
      setFieldBorderColor(nextSnap.fieldBorderColor);
      setFieldBorderWidth(nextSnap.fieldBorderWidth);
      setFieldBgColor(nextSnap.fieldBgColor);
      setFieldTextColor(nextSnap.fieldTextColor);
      setFieldFontFamily(nextSnap.fieldFontFamily);
      setFieldFontWeight(nextSnap.fieldFontWeight);
      setFieldFontSize(nextSnap.fieldFontSize);
      setFieldTextAlign(nextSnap.fieldTextAlign);
      setFieldTextCase(nextSnap.fieldTextCase);
      setFieldSpacing(nextSnap.fieldSpacing);
      setShowPrivacyNote(nextSnap.showPrivacyNote ?? true);
      setPrivacyNoteText(nextSnap.privacyNoteText || '🔒 No spam. Unsubscribe anytime.');
      setHistoryIndex(prev => prev + 1);
      setTimeout(() => { isHistoryAction.current = false; }, 50);
    }
  };

  // Select Item and automatically switch Inspector tab
  const handleSelectElement = (element: SelectedElementType, fieldId?: string, linkId?: string) => {
    setSelectedElement(element);
    if (fieldId) {
      setSelectedFieldId(fieldId);
      setActiveInspectorTab('fields');
    } else if (element === 'field-block') {
      setActiveInspectorTab('fields');
    } else if (element === 'button') {
      setActiveInspectorTab('button');
    } else if (element === 'links' || element === 'link-item' || linkId) {
      if (linkId) setSelectedLinkId(linkId);
      setActiveInspectorTab('links');
    } else if (element === 'headline' || element === 'subtitle' || element === 'script' || element === 'badge' || element === 'monogram' || element === 'media') {
      setActiveInspectorTab('content');
    } else if (element === 'card' || element === 'canvas') {
      setActiveInspectorTab('style');
    } else if (element.startsWith('thankyou')) {
      setActiveInspectorTab('thankyou');
    }
  };

  // Field Management Helpers
  const handleAddField = (type: FormFieldType, insertAtIndex?: number, isCustom = false, customConfig?: Partial<FormFieldConfig>) => {
    takeSnapshot();
    const newId = 'f-' + Date.now();
    const newField: FormFieldConfig = {
      id: newId,
      type,
      label: customConfig?.label || (
        type === 'text' ? 'Your name' :
        type === 'email' ? 'Your email' :
        type === 'phone' ? 'Phone number' :
        type === 'textarea' ? 'Message / Note' :
        type === 'dropdown' ? 'Select choice' :
        type === 'checkbox' ? 'I agree to the terms' : 'Preferred date'
      ),
      placeholder: customConfig?.placeholder || (
        type === 'textarea' ? 'Type your message...' : 
        type === 'email' ? 'alex@company.com' :
        type === 'phone' ? '+1 (555) 000-0000' : 'Enter value...'
      ),
      required: customConfig?.required ?? (type === 'email'),
      options: customConfig?.options || (type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined),
      mapToField: customConfig?.mapToField || (
        type === 'email' ? 'email' :
        type === 'phone' ? 'phone' :
        type === 'text' ? 'first_name' : 'custom'
      ),
      isCustom: isCustom || customConfig?.isCustom || false,
      customDataKey: customConfig?.customDataKey
    };

    if (typeof insertAtIndex === 'number' && insertAtIndex >= 0 && insertAtIndex <= fields.length) {
      const nextFields = [...fields];
      nextFields.splice(insertAtIndex, 0, newField);
      setFields(nextFields);
    } else {
      setFields([...fields, newField]);
    }

    setSelectedElement('field');
    setSelectedFieldId(newId);
    setActiveInspectorTab('fields');
    setShowQuickFieldPicker(false);
    setShowAddFieldDropdown(false);
    setActiveInsertIndex(null);
  };

  const handleCreateCustomField = () => {
    if (!customFieldLabel.trim()) return;
    const finalKey = customFieldKey.trim() 
      ? customFieldKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') 
      : customFieldLabel.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    handleAddField(customFieldType, fields.length, true, {
      label: customFieldLabel.trim(),
      placeholder: customFieldPlaceholder.trim() || undefined,
      required: customFieldRequired,
      mapToField: `custom:${finalKey}`,
      isCustom: true,
      customDataKey: finalKey,
      options: customFieldType === 'dropdown' ? customFieldDropdownOptions : undefined
    });

    setIsCustomFieldModalOpen(false);
    setCustomFieldLabel('');
    setCustomFieldKey('');
    setCustomFieldPlaceholder('');
    setCustomFieldRequired(false);
  };

  const handleDuplicateField = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    takeSnapshot();
    const targetIdx = fields.findIndex(f => f.id === id);
    if (targetIdx === -1) return;
    const target = fields[targetIdx];
    const duplicated: FormFieldConfig = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'f-' + Date.now(),
      label: `${target.label} (Copy)`
    };
    const nextFields = [...fields];
    nextFields.splice(targetIdx + 1, 0, duplicated);
    setFields(nextFields);
    setSelectedFieldId(duplicated.id);
    setSelectedElement('field');
    setFieldActionMenuId(null);
  };

  const handleRemoveField = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    takeSnapshot();
    const filtered = fields.filter(f => f.id !== id);
    setFields(filtered);
    if (selectedFieldId === id) {
      if (filtered.length > 0) {
        setSelectedFieldId(filtered[0].id);
      } else {
        setSelectedFieldId(null);
        setSelectedElement('card');
      }
    }
    setFieldActionMenuId(null);
  };

  const handleToggleRequired = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    takeSnapshot();
    setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    takeSnapshot();
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
    setFieldActionMenuId(null);
  };

  const handleUpdateField = (id: string, updates: Partial<FormFieldConfig>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Link Items Management
  const handleAddLink = () => {
    takeSnapshot();
    const newLink: FormLinkItem = {
      id: 'link-' + Date.now(),
      title: 'Curated Resource Link',
      subtitle: 'Short descriptive caption for this card',
      url: 'https://sendline.co',
      badge: '',
      highlighted: false
    };
    setLinks([...links, newLink]);
    setSelectedLinkId(newLink.id);
    setSelectedElement('link-item');
  };

  const handleRemoveLink = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    takeSnapshot();
    setLinks(links.filter(l => l.id !== id));
    if (selectedLinkId === id) setSelectedLinkId(null);
  };

  const handleSave = () => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'form-' + Date.now();
    const updatedForm: FormItem = {
      ...form,
      title: title.trim() || 'Untitled Form',
      slug: cleanSlug,
      description: description.trim(),
      category,
      formType,
      headline,
      subtitle,
      bodyText,
      badgeText,
      scriptOverlay,
      monogram,
      imageUrl,
      videoUrl,
      frameShape,
      paletteTheme,
      accentColor,
      fontFamily,
      fontSize,
      textAlign,
      buttonShape,
      submitButtonText: submitButtonText.trim() || 'Submit',
      canvasRadius,
      bgColor,
      cardBgColor,
      textColor,
      buttonBgColor,
      buttonTextColor,
      fields,
      links,
      thankYouHeadline,
      thankYouMessage,
      thankYouActionType,
      thankYouDownloadUrl,
      thankYouDownloadButtonText,
      thankYouRedirectUrl,
      targetTag,
      targetSegments,
      targetSegment: targetSegments[0] || 'General',
      doubleOptIn,
      notifyOnSubmission,
      notificationEmail,
      enableCaptcha,
      hostedPermaUrl: `https://sendline.co/f/${cleanSlug}`,
      showPrivacyNote,
      privacyNoteText,
      fieldStyle,
      fieldBorderColor,
      fieldBorderWidth,
      fieldBgColor,
      fieldTextColor,
      fieldFontFamily,
      fieldFontWeight,
      fieldFontSize,
      fieldTextAlign,
      fieldTextCase,
      fieldSpacing,
      fieldPaddingY,
      fieldLetterSpacing
    };

    onSaveForm(updatedForm);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentlySelectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

  // Font family helper (Editorial, Cormorant, Bodoni, Sans, Cinzel, Script)
  const getFontFamilyStyle = (font: string) => {
    switch (font) {
      case 'editorial':
      case 'serif':
        return "'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
      case 'cormorant':
        return "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
      case 'bodoni':
        return "'Bodoni Moda', 'Playfair Display', Georgia, serif";
      case 'sans':
      case 'jakarta':
        return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
      case 'cinzel':
      case 'display-slab':
        return "'Cinzel', 'Playfair Display', Georgia, serif";
      case 'script':
      case 'script-hand':
        return "'Caveat', cursive, sans-serif";
      default:
        return "'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
    }
  };

  const getFontWeightVal = (w: string) => {
    switch (w) {
      case 'ultralight': return '200';
      case 'light': return '300';
      case 'regular': return '400';
      case 'medium': return '500';
      case 'bold': return '700';
      default: return '400';
    }
  };

  // Helper for rendering input fields based on fieldStyle
  const getFieldContainerClasses = (isSelected: boolean) => {
    let shapeClasses = 'rounded-md';
    let borderStyles = 'border';
    
    switch (fieldStyle) {
      case 'filled_sharp':
        shapeClasses = 'rounded-none';
        borderStyles = 'border-transparent';
        break;
      case 'filled_rounded':
        shapeClasses = 'rounded-lg';
        borderStyles = 'border-transparent';
        break;
      case 'filled_pill':
        shapeClasses = 'rounded-full';
        borderStyles = 'border-transparent';
        break;
      case 'filled_oval':
        shapeClasses = 'rounded-2xl';
        borderStyles = 'border-transparent';
        break;
      case 'transparent':
        shapeClasses = 'rounded-lg';
        borderStyles = 'border-transparent bg-transparent shadow-none';
        break;
      case 'outlined_sharp':
        shapeClasses = 'rounded-none';
        borderStyles = 'border';
        break;
      case 'outlined_rounded':
        shapeClasses = 'rounded-lg';
        borderStyles = 'border';
        break;
      case 'outlined_pill':
        shapeClasses = 'rounded-full';
        borderStyles = 'border';
        break;
      case 'outlined_oval':
        shapeClasses = 'rounded-3xl';
        borderStyles = 'border';
        break;
      case 'underline':
        shapeClasses = 'rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent';
        borderStyles = '';
        break;
      default:
        shapeClasses = 'rounded-lg';
        borderStyles = 'border';
    }

    return { shapeClasses, borderStyles };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-900 select-none overflow-hidden animate-fadeIn font-sans">
      
      {/* 1. TOP STUDIO NAVIGATION HEADER */}
      <header className="h-16 px-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 z-30 shadow-xs">
        
        {/* Left: Exit to Templates / Saved Forms, Title, Undo / Redo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              handleSave();
              if (onOpenTemplatesGallery) {
                onOpenTemplatesGallery();
              } else {
                onClose();
              }
            }}
            title="Open Template Library & My Saved Forms"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-stone-950 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Templates & Saved Forms</span>
            <span className="sm:hidden">Library</span>
          </button>

          <div className="h-5 w-px bg-stone-200 hidden sm:block" />

          {/* Title Editor */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Form title..."
              className="bg-transparent text-sm font-bold text-stone-900 hover:bg-stone-50 focus:bg-white px-2.5 py-1 rounded-lg border border-transparent focus:border-stone-300 outline-none transition-all w-36 sm:w-56"
            />
            <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live
            </span>
          </div>

          {/* Undo / Redo */}
          <div className="hidden lg:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded text-stone-600 ${historyIndex > 0 ? 'hover:text-stone-900 hover:bg-white' : 'opacity-30 cursor-not-allowed'}`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded text-stone-600 ${historyIndex < history.length - 1 ? 'hover:text-stone-900 hover:bg-white' : 'opacity-30 cursor-not-allowed'}`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Page Switcher (Design vs Thank you) */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 shadow-inner">
          <button
            onClick={() => {
              setActivePage('design');
              setSelectedElement('field');
              setActiveInspectorTab('fields');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activePage === 'design' 
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => {
              setActivePage('thank_you');
              setSelectedElement('thankyou-headline');
              setActiveInspectorTab('thankyou');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activePage === 'thank_you' 
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Thank you
          </button>
        </div>

        {/* Right: Viewport, Settings, Share & Save */}
        <div className="flex items-center gap-2.5">
          {/* Viewport Toggles */}
          <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewport === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${viewport === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer"
            title="Form Segments & Opt-in Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Share / Embed Code Modal Toggle */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Share</span>
          </button>

          {/* Save & Publish */}
          <button
            onClick={() => {
              handleSave();
              onOpenPublicPreview({
                ...form,
                title,
                slug,
                fields,
                links,
                fieldStyle,
                fieldBorderColor,
                fieldBorderWidth,
                fieldBgColor,
                fieldTextColor,
                fieldFontFamily,
                fieldFontWeight,
                fieldFontSize,
                fieldTextAlign,
                fieldTextCase,
                fieldSpacing
              });
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Publish Form</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* CENTER INTERACTIVE CANVAS STAGE */}
        <main 
          onClick={() => handleSelectElement('canvas')}
          className="flex-1 overflow-y-auto px-4 py-10 sm:px-8 sm:py-14 flex flex-col items-center justify-start relative bg-stone-100/70 min-h-0"
        >
          {/* Responsive Viewport Wrapper */}
          <div 
            className={`transition-all duration-300 mx-auto my-auto ${
              viewport === 'mobile' ? 'w-full max-w-sm' : 'w-full max-w-xl'
            }`}
          >
            {/* The Live Form Visual Card Canvas */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleSelectElement('card');
              }}
              style={{
                backgroundColor: cardBgColor,
                borderRadius: `${canvasRadius}px`,
                color: textColor,
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)'
              }}
              className={`p-8 sm:p-12 transition-all relative group/card border border-stone-200/80 ${
                selectedElement === 'card' ? 'ring-2 ring-blue-500/50' : ''
              }`}
            >
              
              {/* Form Content Stack */}
              <div className="space-y-6 text-center">
                
                {/* 1. MONOGRAM CREST */}
                {monogram && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectElement('monogram');
                    }}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 text-xs font-serif font-bold tracking-widest transition-all cursor-pointer ${
                      selectedElement === 'monogram' ? 'ring-2 ring-blue-500' : 'hover:scale-105'
                    }`}
                  >
                    {monogram}
                  </div>
                )}

                {/* 2. SCRIPT ACCENT OVERLAY */}
                {scriptOverlay && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectElement('script');
                    }}
                    className={`font-caveat text-2xl sm:text-3xl text-stone-600 -mb-2 transition-all cursor-pointer ${
                      selectedElement === 'script' ? 'ring-2 ring-blue-500 rounded px-2' : ''
                    }`}
                  >
                    {scriptOverlay}
                  </div>
                )}

                {/* 3. CATEGORY / PROMO BADGE */}
                {badgeText && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectElement('badge');
                    }}
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-800 border border-stone-200 transition-all cursor-pointer ${
                      selectedElement === 'badge' ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {badgeText}
                  </div>
                )}

                {/* 4. MAIN HEADLINE */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectElement('headline');
                  }}
                  className={`relative group/elem rounded-xl p-2 transition-all cursor-pointer ${
                    selectedElement === 'headline' ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'hover:ring-1 hover:ring-stone-300'
                  }`}
                >
                  <h2 
                    className={`font-normal tracking-tight leading-tight ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'} ${isUppercase ? 'uppercase' : ''}`}
                    style={{ 
                      fontSize: `${fontSize}px`,
                      fontFamily: getFontFamilyStyle(fontFamily)
                    }}
                  >
                    {activePage === 'design' ? headline : thankYouHeadline}
                  </h2>
                </div>

                {/* 5. SUBTITLE / BIO TEXT */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectElement('subtitle');
                  }}
                  className={`relative group/elem rounded-xl p-2 transition-all cursor-pointer ${
                    selectedElement === 'subtitle' ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'hover:ring-1 hover:ring-stone-300'
                  }`}
                >
                  <p 
                    className={`text-sm opacity-80 leading-relaxed ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
                    style={{ fontFamily: getFontFamilyStyle(fontFamily) }}
                  >
                    {activePage === 'design' ? subtitle : thankYouMessage}
                  </p>
                </div>

                {/* 6. HERO MEDIA OR VIDEO */}
                {imageUrl && activePage === 'design' && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectElement('media');
                    }}
                    className={`relative group/elem overflow-hidden shadow-xs my-4 transition-all cursor-pointer ${
                      selectedElement === 'media' ? 'ring-2 ring-blue-500 p-1 rounded-2xl bg-blue-500/5' : 'hover:ring-1 hover:ring-stone-300'
                    }`}
                  >
                    <img 
                      src={imageUrl} 
                      alt="Form Hero" 
                      className={`w-full h-48 object-cover transition-all ${
                        frameShape === 'arch' ? 'rounded-t-full' :
                        frameShape === 'scalloped' ? 'rounded-3xl' :
                        frameShape === 'pill' ? 'rounded-full' :
                        frameShape === 'square' ? 'rounded-none' : 'rounded-2xl'
                      }`}
                    />
                  </div>
                )}

                {/* 7A. DESIGN PAGE: FORM INPUT FIELDS & LINK IN BIO */}
                {activePage === 'design' && (
                  <div className="space-y-4 pt-2">
                    
                    {/* Link in Bio Cards (If Link in Bio format) */}
                    {formType === 'link_in_bio' && links.length > 0 && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectElement('links');
                        }}
                        className={`space-y-2.5 mb-6 p-2 rounded-2xl transition-all ${
                          selectedElement === 'links' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                        }`}
                      >
                        {links.map((link) => (
                          <div
                            key={link.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectElement('link-item', undefined, link.id);
                            }}
                            className={`p-4 rounded-2xl border transition-all text-left group/link relative cursor-pointer ${
                              selectedLinkId === link.id && selectedElement === 'link-item'
                                ? 'ring-2 ring-blue-500 shadow-md'
                                : ''
                            } ${
                              link.highlighted 
                                ? 'bg-stone-900 text-white border-stone-800 shadow-xs' 
                                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold tracking-tight">
                                {link.title}
                              </span>
                              {link.badge && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  link.highlighted ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-700'
                                }`}>
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            {link.subtitle && (
                              <p className={`text-[11px] mt-1 ${link.highlighted ? 'text-stone-300' : 'text-stone-500'}`}>
                                {link.subtitle}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Form Fields Block with Direct Live Styling & In-Canvas Selection */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectElement('field-block');
                      }}
                      className={`p-2 rounded-2xl transition-all relative ${
                        selectedElement === 'field-block' || selectedElement === 'field' 
                          ? 'ring-2 ring-blue-500/80 bg-blue-50/20' 
                          : 'hover:ring-1 hover:ring-stone-300'
                      }`}
                    >
                      {/* Form Fields Stack */}
                      <div 
                        className="flex flex-col"
                        style={{ gap: `${fieldSpacing}px` }}
                      >
                        {fields.map((field, idx) => {
                          const isSelected = selectedFieldId === field.id && selectedElement === 'field';
                          const { shapeClasses } = getFieldContainerClasses(isSelected);

                          const isFilled = fieldStyle.startsWith('filled');
                          const isUnderline = fieldStyle === 'underline';
                          const isTransparent = fieldStyle === 'transparent';

                          return (
                            <div key={field.id} className="relative group/field">
                              
                              {/* Top Insert Divider (Visible on hover between fields) */}
                              <div className="relative py-0.5 flex items-center justify-center opacity-0 group-hover/field:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowQuickFieldPicker(true);
                                    setActiveInsertIndex(idx);
                                  }}
                                  className="px-2 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer z-20"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Insert Field Here</span>
                                </button>
                              </div>

                              {/* Interactive Form Field Box with Live Computed Flodesk Style */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectElement('field', field.id);
                                }}
                                style={{
                                  backgroundColor: isFilled ? (fieldBgColor || '#F3F4F6') : isTransparent || isUnderline ? 'transparent' : fieldBgColor,
                                  borderColor: isUnderline ? fieldBorderColor : isFilled ? 'transparent' : fieldBorderColor,
                                  borderWidth: isUnderline ? '0 0 2px 0' : isFilled || isTransparent ? '0px' : `${fieldBorderWidth}px`,
                                  minHeight: `${fieldPaddingY}px`,
                                  letterSpacing: `${fieldLetterSpacing}px`
                                }}
                                className={`w-full px-4 flex items-center justify-between transition-all cursor-pointer relative ${shapeClasses} ${
                                  isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:border-blue-400'
                                }`}
                              >
                                {/* Floating Quick Actions on Active Field */}
                                {isSelected && (
                                  <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute -top-9 left-2 bg-stone-900 text-white border border-stone-700 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-2 z-30"
                                  >
                                    <span className="text-blue-400 capitalize">{field.label}</span>
                                    
                                    <div className="h-3 w-px bg-stone-700" />

                                    <button
                                      onClick={(e) => handleToggleRequired(field.id, e)}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                        field.required 
                                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                                          : 'bg-stone-800 text-stone-400 hover:text-white'
                                      }`}
                                    >
                                      <span>{field.required ? 'Required *' : 'Optional'}</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleMoveField(idx, 'up', e)}
                                      disabled={idx === 0}
                                      className="p-0.5 hover:bg-stone-800 rounded text-stone-300 disabled:opacity-30"
                                    >
                                      <MoveUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => handleMoveField(idx, 'down', e)}
                                      disabled={idx === fields.length - 1}
                                      className="p-0.5 hover:bg-stone-800 rounded text-stone-300 disabled:opacity-30"
                                    >
                                      <MoveDown className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={(e) => handleDuplicateField(field.id, e)}
                                      className="p-0.5 hover:bg-stone-800 rounded text-stone-300 hover:text-white"
                                    >
                                      <DuplicateIcon className="w-3 h-3" />
                                    </button>

                                    <button
                                      onClick={(e) => handleRemoveField(field.id, e)}
                                      className="p-0.5 hover:bg-stone-800 rounded text-rose-400 hover:text-rose-300"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {/* Field Label / Placeholder Display with Chosen Typography & Color */}
                                <div 
                                  className={`w-full text-left select-none ${fieldTextCase === 'uppercase' ? 'uppercase' : ''}`}
                                  style={{
                                    textAlign: fieldTextAlign,
                                    fontFamily: getFontFamilyStyle(fieldFontFamily),
                                    fontWeight: getFontWeightVal(fieldFontWeight),
                                    fontSize: `${fieldFontSize}px`,
                                    color: fieldTextColor
                                  }}
                                >
                                  <span>{field.label}</span>
                                  {field.required && <span className="text-rose-500 ml-1 font-sans">*</span>}
                                </div>

                                {field.isCustom && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0 ml-2">
                                    custom
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 8. SUBMIT ACTION BUTTON */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectElement('button');
                      }}
                      className={`pt-3 relative rounded-2xl p-1 transition-all cursor-pointer ${
                        selectedElement === 'button' ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'hover:ring-1 hover:ring-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-full py-3.5 px-6 text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 pointer-events-none ${
                          buttonShape === 'pill' ? 'rounded-full' :
                          buttonShape === 'sharp' ? 'rounded-none' :
                          buttonShape === 'outline' ? 'rounded-xl border-2 bg-transparent' : 'rounded-xl'
                        }`}
                        style={{
                          backgroundColor: buttonShape === 'outline' ? 'transparent' : buttonBgColor,
                          color: buttonShape === 'outline' ? buttonBgColor : buttonTextColor,
                          borderColor: buttonBgColor
                        }}
                      >
                        <span>{submitButtonText}</span>
                      </button>
                    </div>

                    {/* Optional Privacy / Opt-in Disclaimer Note */}
                    {showPrivacyNote && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectElement('button');
                        }}
                        className={`mt-1 p-1 rounded-lg transition-all cursor-pointer text-center ${
                          selectedElement === 'button' ? 'bg-stone-500/5' : 'hover:bg-stone-500/5'
                        }`}
                      >
                        <p className="text-[10px] text-center opacity-40 leading-snug">
                          {privacyNoteText}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 7B. THANK YOU CONFIRMATION PAGE PREVIEW */}
                {activePage === 'thank_you' && (
                  <div className="space-y-6 pt-4 text-center">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectElement('thankyou-icon');
                      }}
                      className={`w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs cursor-pointer ${
                        selectedElement === 'thankyou-icon' ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>

                    {thankYouActionType === 'download' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectElement('thankyou-action');
                        }}
                        className={`p-2 rounded-2xl transition-all cursor-pointer ${
                          selectedElement === 'thankyou-action' ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-bold shadow-md">
                          <Download className="w-4 h-4" />
                          <span>{thankYouDownloadButtonText}</span>
                        </div>
                      </div>
                    )}

                    {thankYouActionType === 'redirect' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectElement('thankyou-action');
                          setActiveInspectorTab('thankyou');
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-stone-50/80 border-stone-200 text-left space-y-1.5 ${
                          selectedElement === 'thankyou-action' ? 'ring-2 ring-blue-500 bg-blue-50/40 border-blue-200' : 'hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                            <span>Instant Redirect Destination</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                            Live URL
                          </span>
                        </div>
                        <p className="text-xs font-mono text-stone-600 truncate bg-white px-2.5 py-1.5 rounded-lg border border-stone-200">
                          {thankYouRedirectUrl || 'https://yourwebsite.com/thank-you'}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Subscribers will automatically route to this destination upon clicking submit.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>

        {/* RIGHT DYNAMIC INSPECTOR SIDEBAR (FLODESK PURE LIGHT AESTHETIC) */}
        <aside className="w-80 sm:w-96 bg-white border-l border-stone-200 flex flex-col shrink-0 z-20 text-left shadow-lg font-sans">
          
          {/* Top Tabs: Fields | Content | Button | Links | Style | Font */}
          <div className="border-b border-stone-200 bg-white shrink-0">
            <div className="flex items-center justify-start overflow-x-auto no-scrollbar px-2 h-14">
              {activePage === 'design' ? (
                <>
                  <button
                    onClick={() => setActiveInspectorTab('fields')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'fields' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Fields</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('content')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'content' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Content</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('button')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'button' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    <span>Button</span>
                  </button>

                  {formType === 'link_in_bio' && (
                    <button
                      onClick={() => setActiveInspectorTab('links')}
                      className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                        activeInspectorTab === 'links' 
                          ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                          : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Links</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveInspectorTab('style')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'style' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Style</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('font')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'font' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Font</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveInspectorTab('thankyou')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3.5 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'thankyou' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Thank You</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('style')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3.5 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'style' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Style</span>
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('font')}
                    className={`h-full relative text-xs font-bold transition-all cursor-pointer px-3.5 flex items-center whitespace-nowrap gap-1.5 ${
                      activeInspectorTab === 'font' 
                        ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold' 
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Font</span>
                  </button>
                </>
              )}
            </div>

            {/* Active Element Context Indicator (Minimalist & Clean) */}
            <div className="px-4 py-2 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                <span className="text-[11px] font-medium text-stone-600 truncate">
                  Editing: <strong className="font-semibold text-stone-900">{selectedElement === 'field' ? `Field "${fields.find(f => f.id === selectedFieldId)?.label || 'Field'}"` :
                   selectedElement === 'field-block' ? 'Form Fields Block' :
                   selectedElement === 'headline' ? 'Main Headline' :
                   selectedElement === 'subtitle' ? 'Subtitle / Bio' :
                   selectedElement === 'button' ? 'Submit Button' :
                   selectedElement === 'media' ? 'Hero Media' :
                   selectedElement === 'monogram' ? 'Monogram Crest' :
                   selectedElement === 'script' ? 'Script Signature' :
                   selectedElement === 'badge' ? 'Promo Badge' :
                   selectedElement === 'card' ? 'Form Card' :
                   selectedElement === 'canvas' ? 'Canvas Background' :
                   selectedElement === 'links' || selectedElement === 'link-item' ? 'Link in Bio Stack' :
                   selectedElement.startsWith('thankyou') ? 'Thank You Page' : 'Selected Item'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Inspector Body Content Panels */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-stone-800">
            
            {/* TAB 1: FIELDS & CUSTOM FIELD MANAGEMENT */}
            {activeInspectorTab === 'fields' && (
              <div className="space-y-6">
                
                {/* List of Form Fields with Drag Handles & Dropdown Edit Options */}
                <div className="space-y-3">
                  {fields.map((field, idx) => {
                    const isSelected = selectedFieldId === field.id;

                    return (
                      <div key={field.id} className="space-y-2">
                        {/* Field Item Header Card */}
                        <div
                          onClick={() => {
                            setSelectedFieldId(field.id);
                            setSelectedElement('field');
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-white border-amber-600/80 shadow-xs ring-1 ring-amber-600/30' 
                              : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-stone-400 cursor-grab" />
                            <span className="text-sm font-semibold text-stone-800">
                              {field.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 relative">
                            {field.required && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
                                Required
                              </span>
                            )}
                            <button
                              data-field-action-trigger="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldActionMenuId(fieldActionMenuId === field.id ? null : field.id);
                              }}
                              className="p-1 hover:bg-stone-200 rounded text-stone-500 cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Action Menu Popover */}
                            {fieldActionMenuId === field.id && (
                              <div 
                                data-field-action-menu="true"
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1 w-40 bg-white border border-stone-200 rounded-xl shadow-xl p-1.5 z-40 text-stone-800"
                              >
                                <button
                                  onClick={(e) => handleDuplicateField(field.id, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-stone-100 rounded-lg text-left cursor-pointer"
                                >
                                  <DuplicateIcon className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Duplicate</span>
                                </button>
                                <button
                                  onClick={(e) => handleMoveField(idx, 'up', e)}
                                  disabled={idx === 0}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-stone-100 rounded-lg text-left disabled:opacity-30 cursor-pointer"
                                >
                                  <MoveUp className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Move up</span>
                                </button>
                                <button
                                  onClick={(e) => handleMoveField(idx, 'down', e)}
                                  disabled={idx === fields.length - 1}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-stone-100 rounded-lg text-left disabled:opacity-30 cursor-pointer"
                                >
                                  <MoveDown className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Move down</span>
                                </button>
                                <div className="h-px bg-stone-200 my-1" />
                                <button
                                  onClick={(e) => handleRemoveField(field.id, e)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs hover:bg-rose-50 text-rose-600 rounded-lg text-left cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete field</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expanded Config on Selected Field (Matches Screenshot 3) */}
                        {isSelected && (
                          <div className="p-4 rounded-xl bg-white border border-amber-600/80 space-y-4 shadow-sm animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800">Edit option</span>
                              <button 
                                data-field-action-trigger="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFieldActionMenuId(fieldActionMenuId === field.id ? null : field.id);
                                }}
                                className="text-stone-400 hover:text-stone-700 cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Display Name Input */}
                            <div>
                              <input
                                type="text"
                                value={field.label}
                                placeholder="Display name"
                                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                              />
                            </div>

                            {/* Map to Data Field Dropdown */}
                            <div className="space-y-1">
                              <div className="relative">
                                <select
                                  value={field.mapToField || 'first_name'}
                                  onChange={(e) => handleUpdateField(field.id, { mapToField: e.target.value })}
                                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-800 outline-none appearance-none pr-8 focus:border-stone-600"
                                >
                                  <option value="first_name">First Name</option>
                                  <option value="last_name">Last Name</option>
                                  <option value="email">Email Address</option>
                                  <option value="phone">Phone Number</option>
                                  <option value="company">Company / Organization</option>
                                  <option value="birthday">Birthday</option>
                                  <option value="address">Postal Address</option>
                                  <option value="website">Website URL</option>
                                  <option value="message">Notes / Message</option>
                                  {field.isCustom && (
                                    <option value={`custom:${field.customDataKey}`}>
                                      Custom: {field.customDataKey}
                                    </option>
                                  )}
                                </select>
                                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>

                              {(!field.mapToField || field.mapToField === 'none') && (
                                <p className="text-xs text-rose-600">Please map to data field</p>
                              )}
                            </div>

                            {/* Dropdown Options List Manager if dropdown */}
                            {field.type === 'dropdown' && (
                              <div className="space-y-2 pt-2 border-t border-stone-100">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-semibold text-stone-600">Dropdown Choices</label>
                                  <button
                                    onClick={() => {
                                      const opts = field.options || [];
                                      handleUpdateField(field.id, { options: [...opts, `Option ${opts.length + 1}`] });
                                    }}
                                    className="text-xs text-blue-600 font-bold flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Choice</span>
                                  </button>
                                </div>

                                <div className="space-y-1.5">
                                  {field.options?.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const opts = [...(field.options || [])];
                                          opts[optIdx] = e.target.value;
                                          handleUpdateField(field.id, { options: opts });
                                        }}
                                        className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                                      />
                                      <button
                                        onClick={() => {
                                          const opts = field.options?.filter((_, i) => i !== optIdx);
                                          handleUpdateField(field.id, { options: opts });
                                        }}
                                        className="p-1 text-stone-400 hover:text-rose-500"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Required Checkbox */}
                            <div className="pt-2 flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                id={`req-${field.id}`}
                                checked={field.required}
                                onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                              />
                              <label htmlFor={`req-${field.id}`} className="text-sm font-semibold text-stone-800 cursor-pointer">
                                Required
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Field Button & Dropdown Menu (Matches Screenshot 3) */}
                <div className="relative pt-2 flex justify-end">
                  <button
                    data-add-field-trigger="true"
                    onClick={() => setShowAddFieldDropdown(!showAddFieldDropdown)}
                    className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Add field</span>
                  </button>

                  {/* Add Field Dropdown Menu */}
                  {showAddFieldDropdown && (
                    <div 
                      data-add-field-menu="true"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 z-40 text-stone-800 animate-fadeIn"
                    >
                      <button
                        onClick={() => handleAddField('text')}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                      >
                        Last name
                      </button>
                      <button
                        onClick={() => handleAddField('phone')}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                      >
                        Phone number
                      </button>
                      <button
                        onClick={() => handleAddField('dropdown')}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                      >
                        Dropdown
                      </button>
                      <button
                        onClick={() => handleAddField('textarea')}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                      >
                        Paragraph
                      </button>
                      <button
                        onClick={() => handleAddField('date')}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                      >
                        Date picker
                      </button>
                      <div className="h-px bg-stone-100 my-1" />
                      <button
                        onClick={() => {
                          setShowAddFieldDropdown(false);
                          setIsCustomFieldModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-between cursor-pointer"
                      >
                        <span>Custom field</span>
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields Style & Shape Config (Direct access in Fields tab) */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-900">Fields Shape & Style</label>
                    <span className="text-[11px] text-stone-400 font-medium">Applies to all inputs</span>
                  </div>

                  {/* Shapes Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'filled_sharp', name: 'Filled Sharp', shape: 'sharp' },
                      { id: 'filled_rounded', name: 'Filled Rounded', shape: 'rounded' },
                      { id: 'filled_pill', name: 'Filled Pill', shape: 'pill' },
                      { id: 'filled_oval', name: 'Filled Oval', shape: 'oval' },
                      { id: 'transparent', name: 'Transparent', shape: 'flat' },
                      { id: 'outlined_sharp', name: 'Outlined Sharp', shape: 'sharp' },
                      { id: 'outlined_rounded', name: 'Outlined Rounded', shape: 'rounded' },
                      { id: 'outlined_pill', name: 'Outlined Pill', shape: 'pill' },
                      { id: 'outlined_oval', name: 'Outlined Oval', shape: 'oval' },
                      { id: 'underline', name: 'Underline', shape: 'line' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          takeSnapshot();
                          setFieldStyle(s.id as NonNullable<FormItem['fieldStyle']>);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          fieldStyle === s.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span>{s.name}</span>
                        {fieldStyle === s.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>

                  {/* Field Colors */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">Field Background</label>
                      <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-xl">
                        <input
                          type="color"
                          value={fieldBgColor.startsWith('#') ? fieldBgColor : '#ffffff'}
                          onChange={(e) => {
                            takeSnapshot();
                            setFieldBgColor(e.target.value);
                          }}
                          className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-stone-700">{fieldBgColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">Field Border</label>
                      <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-xl">
                        <input
                          type="color"
                          value={fieldBorderColor.startsWith('#') ? fieldBorderColor : '#217CC5'}
                          onChange={(e) => {
                            takeSnapshot();
                            setFieldBorderColor(e.target.value);
                          }}
                          className="w-6 h-6 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-stone-700">{fieldBorderColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Field Spacing Slider */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Field Spacing</span>
                      <span>{fieldSpacing}px</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={28}
                      value={fieldSpacing}
                      onChange={(e) => {
                        takeSnapshot();
                        setFieldSpacing(Number(e.target.value));
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB: BUTTON INSPECTOR (DEDICATED SUBMIT BUTTON CONFIGURATION) */}
            {activeInspectorTab === 'button' && (
              <div className="space-y-6">
                
                {/* Button Text */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-900 block">Button Label</label>
                  <input
                    type="text"
                    value={submitButtonText}
                    onChange={(e) => {
                      takeSnapshot();
                      setSubmitButtonText(e.target.value);
                    }}
                    placeholder="e.g. Subscribe, Claim My Free Guide, Get Access"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-stone-900 font-medium"
                  />
                </div>

                {/* Button Shape */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-900 block">Button Shape</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pill', label: 'Pill (Curved)' },
                      { id: 'rounded', label: 'Rounded Rect' },
                      { id: 'sharp', label: 'Sharp Rectangle' },
                      { id: 'outline', label: 'Outlined Ghost' },
                    ].map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => {
                          takeSnapshot();
                          setButtonShape(shape.id as FormItem['buttonShape']);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          buttonShape === shape.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span>{shape.label}</span>
                        {buttonShape === shape.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Colors */}
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <label className="text-sm font-bold text-stone-900 block">Button Color</label>
                  
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Background Fill</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-xl flex-1">
                        <input
                          type="color"
                          value={buttonBgColor.startsWith('#') ? buttonBgColor : '#18181B'}
                          onChange={(e) => {
                            takeSnapshot();
                            setButtonBgColor(e.target.value);
                          }}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-medium text-stone-800">{buttonBgColor}</span>
                      </div>
                      
                      {/* Luxury Preset Swatches */}
                      <div className="flex items-center gap-1.5">
                        {['#18181B', '#217CC5', '#B86F58', '#435848', '#C48B47'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              takeSnapshot();
                              setButtonBgColor(c);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                              buttonBgColor.toLowerCase() === c.toLowerCase() ? 'border-stone-900 scale-110' : 'border-white shadow-xs'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Button Text Color</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-xl flex-1">
                        <input
                          type="color"
                          value={buttonTextColor.startsWith('#') ? buttonTextColor : '#FFFFFF'}
                          onChange={(e) => {
                            takeSnapshot();
                            setButtonTextColor(e.target.value);
                          }}
                          className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono font-medium text-stone-800">{buttonTextColor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {['#FFFFFF', '#18181B', '#FAF7F2', '#EFEFEF'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              takeSnapshot();
                              setButtonTextColor(c);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                              buttonTextColor.toLowerCase() === c.toLowerCase() ? 'border-stone-900 scale-110' : 'border-stone-300 shadow-xs'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <label className="text-sm font-bold text-stone-900 block">After Submission Action</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['message', 'download', 'redirect'] as const).map(action => (
                      <button
                        key={action}
                        onClick={() => {
                          takeSnapshot();
                          setThankYouActionType(action);
                        }}
                        className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                          thankYouActionType === action ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {action === 'message' ? 'Thank You' : action === 'download' ? 'Download' : 'Redirect'}
                      </button>
                    ))}
                  </div>

                  {thankYouActionType === 'redirect' && (
                    <div className="space-y-1 pt-1">
                      <label className="text-xs text-stone-500 block">Redirect URL</label>
                      <input
                        type="url"
                        value={thankYouRedirectUrl}
                        onChange={(e) => {
                          takeSnapshot();
                          setThankYouRedirectUrl(e.target.value);
                        }}
                        placeholder="https://yourwebsite.com/welcome"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                      />
                    </div>
                  )}

                  {thankYouActionType === 'download' && (
                    <div className="space-y-1 pt-1">
                      <label className="text-xs text-stone-500 block">Asset Download URL (PDF / ZIP)</label>
                      <input
                        type="url"
                        value={thankYouDownloadUrl}
                        onChange={(e) => {
                          takeSnapshot();
                          setThankYouDownloadUrl(e.target.value);
                        }}
                        placeholder="https://yourdomain.com/freebie.pdf"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                      />
                    </div>
                  )}
                </div>

                {/* Privacy & Anti-Spam Footer Note Toggle */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-stone-900 block">Privacy Disclaimer</label>
                      <span className="text-xs text-stone-400">Show anti-spam note under button</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        takeSnapshot();
                        setShowPrivacyNote(!showPrivacyNote);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showPrivacyNote ? 'bg-stone-900' : 'bg-stone-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showPrivacyNote ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {showPrivacyNote && (
                    <div className="space-y-1 pt-1 animate-fadeIn">
                      <label className="text-xs text-stone-500 block">Disclaimer Text</label>
                      <input
                        type="text"
                        value={privacyNoteText}
                        onChange={(e) => {
                          takeSnapshot();
                          setPrivacyNoteText(e.target.value);
                        }}
                        placeholder="e.g. 🔒 No spam. Unsubscribe anytime."
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: LINKS IN BIO INSPECTOR */}
            {activeInspectorTab === 'links' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-900 block">Bio Links Stack</label>
                  <button
                    onClick={() => {
                      takeSnapshot();
                      const newLink: FormLinkItem = {
                        id: 'link-' + Date.now(),
                        title: 'NEW LINK TITLE',
                        subtitle: 'Add description or supporting text for your audience',
                        url: 'https://',
                        highlighted: false
                      };
                      setLinks([...links, newLink]);
                      setSelectedLinkId(newLink.id);
                    }}
                    className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {links.map((link, idx) => {
                    const isSelected = selectedLinkId === link.id;

                    return (
                      <div
                        key={link.id}
                        className={`p-3.5 rounded-2xl border transition-all space-y-3 ${
                          isSelected ? 'bg-white border-stone-900 shadow-md ring-1 ring-stone-900/10' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800">Link #{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (idx > 0) {
                                  takeSnapshot();
                                  const copy = [...links];
                                  const temp = copy[idx - 1];
                                  copy[idx - 1] = copy[idx];
                                  copy[idx] = temp;
                                  setLinks(copy);
                                }
                              }}
                              disabled={idx === 0}
                              className={`p-1 rounded hover:bg-stone-200 ${idx === 0 ? 'opacity-30' : 'cursor-pointer'}`}
                            >
                              <MoveUp className="w-3 h-3 text-stone-600" />
                            </button>
                            <button
                              onClick={() => {
                                if (idx < links.length - 1) {
                                  takeSnapshot();
                                  const copy = [...links];
                                  const temp = copy[idx + 1];
                                  copy[idx + 1] = copy[idx];
                                  copy[idx] = temp;
                                  setLinks(copy);
                                }
                              }}
                              disabled={idx === links.length - 1}
                              className={`p-1 rounded hover:bg-stone-200 ${idx === links.length - 1 ? 'opacity-30' : 'cursor-pointer'}`}
                            >
                              <MoveDown className="w-3 h-3 text-stone-600" />
                            </button>
                            <button
                              onClick={() => {
                                takeSnapshot();
                                setLinks(links.filter(l => l.id !== link.id));
                              }}
                              className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-0.5">Title</label>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const copy = [...links];
                              copy[idx].title = e.target.value;
                              setLinks(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-900 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-0.5">Subtitle</label>
                          <textarea
                            value={link.subtitle || ''}
                            onChange={(e) => {
                              const copy = [...links];
                              copy[idx].subtitle = e.target.value;
                              setLinks(copy);
                            }}
                            rows={2}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-0.5">Target URL</label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const copy = [...links];
                                copy[idx].url = e.target.value;
                                setLinks(copy);
                              }}
                              className="w-full px-2 py-1 text-xs bg-white border border-stone-200 rounded-lg text-stone-900"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-stone-400 uppercase font-semibold block mb-0.5">Badge Text</label>
                            <input
                              type="text"
                              value={link.badge || ''}
                              placeholder="e.g. NEW, FREE"
                              onChange={(e) => {
                                const copy = [...links];
                                copy[idx].badge = e.target.value;
                                setLinks(copy);
                              }}
                              className="w-full px-2 py-1 text-xs bg-white border border-stone-200 rounded-lg text-stone-900"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id={`highlight-${link.id}`}
                            checked={link.highlighted || false}
                            onChange={(e) => {
                              const copy = [...links];
                              copy[idx].highlighted = e.target.checked;
                              setLinks(copy);
                            }}
                            className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 cursor-pointer"
                          />
                          <label htmlFor={`highlight-${link.id}`} className="text-xs font-semibold text-stone-700 cursor-pointer">
                            Feature / Highlight this card
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: FONT & TYPOGRAPHY INSPECTOR (MATCHES SCREENSHOT 2) */}
            {activeInspectorTab === 'font' && (
              <div className="space-y-6">
                
                {/* Font Family & Weight Dropdowns */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-900 block">Font</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={fieldFontFamily}
                      onChange={(e) => {
                        takeSnapshot();
                        setFieldFontFamily(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 outline-none focus:border-stone-600"
                    >
                      <option value="editorial">PP Editorial New</option>
                      <option value="cormorant">Cormorant Garamond</option>
                      <option value="bodoni">Bodoni Moda</option>
                      <option value="sans">Modern Sans</option>
                      <option value="cinzel">Cinzel Display</option>
                      <option value="script">Caveat Signature</option>
                    </select>

                    <select
                      value={fieldFontWeight}
                      onChange={(e) => {
                        takeSnapshot();
                        setFieldFontWeight(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 outline-none focus:border-stone-600"
                    >
                      <option value="ultralight">Ultralight</option>
                      <option value="light">Light</option>
                      <option value="regular">Regular</option>
                      <option value="medium">Medium</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Font Size Slider with - and + Controls */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-900">Size</span>
                    <span className="font-medium text-stone-600">{fieldFontSize}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFieldFontSize(Math.max(12, fieldFontSize - 1))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={fieldFontSize}
                      onChange={(e) => setFieldFontSize(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer h-1 bg-stone-200 rounded-lg"
                    />
                    <button
                      onClick={() => setFieldFontSize(Math.min(36, fieldFontSize + 1))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Font Color with Hex & Circular Swatch */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">Font color</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono uppercase text-stone-600">{fieldTextColor}</span>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-stone-300 shadow-xs">
                      <input
                        type="color"
                        value={fieldTextColor}
                        onChange={(e) => setFieldTextColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: fieldTextColor }} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Text Alignment */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">Alignment</span>
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <button
                      onClick={() => setFieldTextAlign('left')}
                      className={`p-1.5 rounded-lg transition-all ${
                        fieldTextAlign === 'left' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFieldTextAlign('center')}
                      className={`p-1.5 rounded-lg transition-all ${
                        fieldTextAlign === 'center' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFieldTextAlign('right')}
                      className={`p-1.5 rounded-lg transition-all ${
                        fieldTextAlign === 'right' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Case (Aa / AA) */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">Case</span>
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <button
                      onClick={() => setFieldTextCase('normal')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        fieldTextCase === 'normal' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      Aa
                    </button>
                    <button
                      onClick={() => setFieldTextCase('uppercase')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        fieldTextCase === 'uppercase' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                      }`}
                    >
                      AA
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Spacing Accordion */}
                <div>
                  <button
                    onClick={() => setIsSpacingAccordionOpen(!isSpacingAccordionOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold text-stone-900 py-1"
                  >
                    <span>Spacing</span>
                    <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isSpacingAccordionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSpacingAccordionOpen && (
                    <div className="pt-3 space-y-3">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Letter Spacing</span>
                        <span>{fieldLetterSpacing}px</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="8"
                        value={fieldLetterSpacing}
                        onChange={(e) => setFieldLetterSpacing(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-1 bg-stone-200 rounded-lg"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: STYLE & FIELD SHAPES INSPECTOR (MATCHES SCREENSHOT 1) */}
            {activeInspectorTab === 'style' && (
              <div className="space-y-6">
                
                {/* 10 Visual Shape Choices (5 Filled, 5 Outlined) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-900 block">Style</label>
                  
                  {/* Top Row: Filled Shapes */}
                  <div className="grid grid-cols-5 gap-2">
                    {/* 1. Filled Sharp */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('filled_sharp');
                      }}
                      className={`h-8 bg-stone-300 rounded-none transition-all cursor-pointer ${
                        fieldStyle === 'filled_sharp' ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:opacity-80'
                      }`}
                    />

                    {/* 2. Filled Rounded */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('filled_rounded');
                      }}
                      className={`h-8 bg-stone-300 rounded-md transition-all cursor-pointer ${
                        fieldStyle === 'filled_rounded' ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:opacity-80'
                      }`}
                    />

                    {/* 3. Filled Pill */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('filled_pill');
                      }}
                      className={`h-8 bg-stone-300 rounded-full transition-all cursor-pointer ${
                        fieldStyle === 'filled_pill' ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:opacity-80'
                      }`}
                    />

                    {/* 4. Filled Oval */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('filled_oval');
                      }}
                      className={`h-8 bg-stone-300 rounded-2xl transition-all cursor-pointer ${
                        fieldStyle === 'filled_oval' ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:opacity-80'
                      }`}
                    />

                    {/* 5. Slash / Transparent */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('transparent');
                      }}
                      className={`h-8 border border-stone-300 rounded-none bg-white relative overflow-hidden transition-all cursor-pointer ${
                        fieldStyle === 'transparent' ? 'ring-2 ring-blue-600 ring-offset-1' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-stone-400 rotate-45" />
                      </div>
                    </button>
                  </div>

                  {/* Bottom Row: Outlined & Underline Shapes */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {/* 6. Outlined Sharp */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('outlined_sharp');
                      }}
                      className={`h-8 border border-stone-300 bg-white rounded-none transition-all cursor-pointer ${
                        fieldStyle === 'outlined_sharp' ? 'ring-2 ring-blue-600 border-blue-600' : 'hover:border-stone-400'
                      }`}
                    />

                    {/* 7. Outlined Rounded */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('outlined_rounded');
                      }}
                      className={`h-8 border border-stone-300 bg-white rounded-md transition-all cursor-pointer ${
                        fieldStyle === 'outlined_rounded' ? 'ring-2 ring-blue-600 border-blue-600' : 'hover:border-stone-400'
                      }`}
                    />

                    {/* 8. Outlined Pill */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('outlined_pill');
                      }}
                      className={`h-8 border border-stone-300 bg-white rounded-full transition-all cursor-pointer ${
                        fieldStyle === 'outlined_pill' ? 'ring-2 ring-blue-600 border-blue-600' : 'hover:border-stone-400'
                      }`}
                    />

                    {/* 9. Outlined Oval (Active Blue in screenshot) */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('outlined_oval');
                      }}
                      className={`h-8 border border-blue-600 bg-white rounded-2xl transition-all cursor-pointer ${
                        fieldStyle === 'outlined_oval' ? 'ring-2 ring-blue-600 border-blue-600' : 'hover:border-blue-400'
                      }`}
                    />

                    {/* 10. Underline only */}
                    <button
                      onClick={() => {
                        takeSnapshot();
                        setFieldStyle('underline');
                      }}
                      className={`h-8 bg-white border-b-2 border-stone-400 transition-all cursor-pointer flex items-end justify-center pb-0.5 ${
                        fieldStyle === 'underline' ? 'ring-2 ring-blue-600' : 'hover:border-stone-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Border Color */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">Border color</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono uppercase text-stone-600">{fieldBorderColor}</span>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-stone-300 shadow-xs">
                      <input
                        type="color"
                        value={fieldBorderColor}
                        onChange={(e) => setFieldBorderColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-full h-full" style={{ backgroundColor: fieldBorderColor }} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Border Thickness Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-900">Border thickness</span>
                    <span className="font-medium text-stone-600">{fieldBorderWidth}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFieldBorderWidth(Math.max(0, fieldBorderWidth - 1))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      value={fieldBorderWidth}
                      onChange={(e) => setFieldBorderWidth(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer h-1 bg-stone-200 rounded-lg"
                    />
                    <button
                      onClick={() => setFieldBorderWidth(Math.min(6, fieldBorderWidth + 1))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Spacing Slider (Gap between fields) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-stone-900">Spacing</span>
                    <span className="font-medium text-stone-600">{fieldSpacing}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFieldSpacing(Math.max(4, fieldSpacing - 2))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="4"
                      max="32"
                      value={fieldSpacing}
                      onChange={(e) => setFieldSpacing(Number(e.target.value))}
                      className="flex-1 accent-blue-600 cursor-pointer h-1 bg-stone-200 rounded-lg"
                    />
                    <button
                      onClick={() => setFieldSpacing(Math.min(32, fieldSpacing + 2))}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-stone-100" />

                {/* Field Sizing Accordion */}
                <div>
                  <button
                    onClick={() => setIsFieldSizingOpen(!isFieldSizingOpen)}
                    className="w-full flex items-center justify-between text-sm font-bold text-stone-900 py-1"
                  >
                    <span>Field sizing</span>
                    <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isFieldSizingOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isFieldSizingOpen && (
                    <div className="pt-3 grid grid-cols-3 gap-2">
                      {[
                        { label: 'Compact', val: 36 },
                        { label: 'Regular', val: 44 },
                        { label: 'Spacious', val: 52 },
                      ].map(s => (
                        <button
                          key={s.val}
                          onClick={() => setFieldPaddingY(s.val)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                            fieldPaddingY === s.val ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-stone-100" />

                {/* Card Canvas Radius & Palette Presets */}
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-bold text-stone-900 block">Card Background & Theme</label>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600">Card Background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardBgColor}
                        onChange={(e) => setCardBgColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{cardBgColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-600">Outer Backdrop</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono">{bgColor}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: CONTENT INSPECTOR (When Headings/Media selected) */}
            {activeInspectorTab === 'content' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-stone-900 block">Headings & Copy</label>
                  
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-stone-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Subtitle / Bio</label>
                    <textarea
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-stone-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Script Accent</label>
                      <input
                        type="text"
                        value={scriptOverlay}
                        placeholder="e.g. Nicole"
                        onChange={(e) => {
                          takeSnapshot();
                          setScriptOverlay(e.target.value);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500 block mb-1">Monogram Crest</label>
                      <input
                        type="text"
                        value={monogram}
                        placeholder="e.g. SL"
                        maxLength={3}
                        onChange={(e) => {
                          takeSnapshot();
                          setMonogram(e.target.value);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Promo Badge / Tag</label>
                    <input
                      type="text"
                      value={badgeText}
                      placeholder="e.g. 2026 EDITION, FREE GUIDE, VIP ONLY"
                      onChange={(e) => {
                        takeSnapshot();
                        setBadgeText(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                    />
                  </div>
                </div>

                {/* Hero Media */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-900 block">Hero Media & Frame</label>
                    {imageUrl && (
                      <button
                        onClick={() => {
                          takeSnapshot();
                          setImageUrl('');
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                      >
                        Remove Media
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      takeSnapshot();
                      setImageUrl(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                  />

                  {/* Preset Editorial Images */}
                  <div>
                    <label className="text-[11px] text-stone-400 font-medium block mb-1.5">Preset Editorial Imagery</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80'
                      ].map((img, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            takeSnapshot();
                            setImageUrl(img);
                          }}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            imageUrl === img ? 'border-stone-900 ring-2 ring-stone-900/30' : 'border-stone-200 hover:opacity-80'
                          }`}
                        >
                          <img src={img} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {imageUrl && (
                    <div className="pt-2">
                      <label className="text-xs text-stone-500 block mb-1.5">Frame Shape</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['arch', 'scalloped', 'pill', 'rounded', 'square'] as EmailFrameShape[]).map(shape => (
                          <button
                            key={shape}
                            onClick={() => {
                              takeSnapshot();
                              setFrameShape(shape);
                            }}
                            className={`py-1.5 text-xs font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                              frameShape === shape ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: THANK YOU PAGE INSPECTOR */}
            {activeInspectorTab === 'thankyou' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-stone-900 block">Thank You Action</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['message', 'download', 'redirect'] as const).map(action => (
                      <button
                        key={action}
                        onClick={() => {
                          takeSnapshot();
                          setThankYouActionType(action);
                        }}
                        className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                          thankYouActionType === action ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {action === 'message' ? 'Message' : action === 'download' ? 'Download' : 'Redirect'}
                      </button>
                    ))}
                  </div>

                  {thankYouActionType === 'redirect' ? (
                    <div className="space-y-4 pt-3 border-t border-stone-200">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>Redirect URL Destination</span>
                        </label>
                        <input
                          type="url"
                          value={thankYouRedirectUrl}
                          onChange={(e) => {
                            takeSnapshot();
                            setThankYouRedirectUrl(e.target.value);
                          }}
                          placeholder="https://yourwebsite.com/thank-you"
                          className="w-full px-3 py-2.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Subscribers will be seamlessly redirected to this URL immediately upon submitting the form.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 space-y-3">
                        <div>
                          <label className="text-xs text-stone-500 block mb-1">Preview Headline (Before redirect)</label>
                          <input
                            type="text"
                            value={thankYouHeadline}
                            onChange={(e) => {
                              takeSnapshot();
                              setThankYouHeadline(e.target.value);
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-stone-500 block mb-1">Preview Subtitle / Notice</label>
                          <textarea
                            value={thankYouMessage}
                            onChange={(e) => {
                              takeSnapshot();
                              setThankYouMessage(e.target.value);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pt-2">
                        <label className="text-xs text-stone-500 block mb-1">Headline</label>
                        <input
                          type="text"
                          value={thankYouHeadline}
                          onChange={(e) => {
                            takeSnapshot();
                            setThankYouHeadline(e.target.value);
                          }}
                          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-stone-500 block mb-1">Confirmation Message</label>
                        <textarea
                          value={thankYouMessage}
                          onChange={(e) => {
                            takeSnapshot();
                            setThankYouMessage(e.target.value);
                          }}
                          rows={3}
                          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900"
                        />
                      </div>

                      {thankYouActionType === 'download' && (
                        <div className="space-y-3 pt-3 border-t border-stone-200">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-900 block">Download Asset URL (PDF / ZIP)</label>
                            <input
                              type="text"
                              value={thankYouDownloadUrl}
                              onChange={(e) => {
                                takeSnapshot();
                                setThankYouDownloadUrl(e.target.value);
                              }}
                              placeholder="https://yourdomain.com/freebie.pdf"
                              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-stone-500 block">Button Label</label>
                            <input
                              type="text"
                              value={thankYouDownloadButtonText}
                              onChange={(e) => {
                                takeSnapshot();
                                setThankYouDownloadButtonText(e.target.value);
                              }}
                              placeholder="Download Freebie (PDF)"
                              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Inspector Action Bar (Undo, Redo, Saved Status - Matches Screenshots 1, 2, 3, 4) */}
          <div className="h-14 px-6 border-t border-stone-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  historyIndex > 0 ? 'text-stone-800 hover:text-stone-950 cursor-pointer' : 'text-stone-300 cursor-not-allowed'
                }`}
              >
                <Undo2 className="w-4 h-4" />
                <span>Undo</span>
              </button>

              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  historyIndex < history.length - 1 ? 'text-stone-800 hover:text-stone-950 cursor-pointer' : 'text-stone-300 cursor-not-allowed'
                }`}
              >
                <Redo2 className="w-4 h-4" />
                <span>Redo</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-400">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved</span>
            </div>
          </div>

        </aside>

      </div>

      {/* 3. CUSTOM FIELD CREATION MODAL */}
      {isCustomFieldModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-stone-900 text-base">Add Custom Field</h3>
              </div>
              <button 
                onClick={() => setIsCustomFieldModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Field Display Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instagram Handle, Wedding Date, Company Size"
                  value={customFieldLabel}
                  onChange={(e) => {
                    setCustomFieldLabel(e.target.value);
                    if (!customFieldKey) {
                      setCustomFieldKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
                    }
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Data Attribute Key (Subscriber Property)
                </label>
                <input
                  type="text"
                  placeholder="e.g. instagram_handle"
                  value={customFieldKey}
                  onChange={(e) => setCustomFieldKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl text-stone-900 outline-none focus:border-blue-600"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">Stored on subscriber profile for segmentation</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Input Format
                  </label>
                  <select
                    value={customFieldType}
                    onChange={(e) => setCustomFieldType(e.target.value as FormFieldType)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 outline-none"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Paragraph</option>
                    <option value="dropdown">Dropdown Choice</option>
                    <option value="date">Date Selection</option>
                    <option value="phone">Phone Number</option>
                    <option value="checkbox">Consent Checkbox</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Placeholder Hint
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @username"
                    value={customFieldPlaceholder}
                    onChange={(e) => setCustomFieldPlaceholder(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 outline-none"
                  />
                </div>
              </div>

              {customFieldType === 'dropdown' && (
                <div className="space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Dropdown Choices</span>
                    <button
                      onClick={() => setCustomFieldDropdownOptions([...customFieldDropdownOptions, `Option ${customFieldDropdownOptions.length + 1}`])}
                      className="text-xs text-blue-600 font-bold"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {customFieldDropdownOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...customFieldDropdownOptions];
                            next[i] = e.target.value;
                            setCustomFieldDropdownOptions(next);
                          }}
                          className="flex-1 px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg text-stone-800"
                        />
                        <button
                          onClick={() => setCustomFieldDropdownOptions(customFieldDropdownOptions.filter((_, idx) => idx !== i))}
                          className="text-stone-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="custom-req-check"
                  checked={customFieldRequired}
                  onChange={(e) => setCustomFieldRequired(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-blue-600 cursor-pointer"
                />
                <label htmlFor="custom-req-check" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Make this custom field mandatory (Required)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsCustomFieldModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomField}
                disabled={!customFieldLabel.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-black text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                Create Custom Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleUp text-stone-900">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-stone-700" />
                <h3 className="font-bold text-base">Form & Audience Segments</h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Target Segment Assignment</label>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  {targetSegments.map((seg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold text-stone-800">
                      <span>✓ {seg}</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Mandatory</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">Subscriber Tag</label>
                <input
                  type="text"
                  value={targetTag}
                  onChange={(e) => setTargetTag(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Double Opt-In</span>
                  <span className="text-[10px] text-stone-500">Send email confirmation link before adding</span>
                </div>
                <input
                  type="checkbox"
                  checked={doubleOptIn}
                  onChange={(e) => setDoubleOptIn(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SHARE & PUBLISH WALKTHROUGH MODAL */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp text-stone-900 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Publish & Embed Your Form</h3>
                  <p className="text-xs text-stone-500">Step-by-step instructions to embed or share anywhere</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShareOpen(false)} 
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs for Sharing Modes */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setPublishModalTab('link')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  publishModalTab === 'link' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Hosted Link</span>
              </button>
              <button
                onClick={() => setPublishModalTab('embed_js')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  publishModalTab === 'embed_js' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Inline Script</span>
              </button>
              <button
                onClick={() => setPublishModalTab('embed_iframe')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  publishModalTab === 'embed_iframe' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Responsive iFrame</span>
              </button>
              <button
                onClick={() => setPublishModalTab('embed_raw')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  publishModalTab === 'embed_raw' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw HTML</span>
              </button>
            </div>

            {/* TAB 1: HOSTED LINK WALKTHROUGH */}
            {publishModalTab === 'link' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-blue-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Best for Social Bios, Stories, SMS, and Email Signatures</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    This hosted link is live immediately. Visitors can complete the form directly from any browser or mobile app without requiring your own website host.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">Your Form's Live Hosted URL</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs text-stone-800 select-all overflow-x-auto truncate">
                      {`https://sendline.co/f/${slug}`}
                    </div>
                    <button
                      onClick={() => handleCopy(`https://sendline.co/f/${slug}`, 'direct_link')}
                      className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      {copiedKey === 'direct_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'direct_link' ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Step by Step Walkthrough */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">How & Where to use this link:</h4>
                  <ol className="space-y-2 text-xs text-stone-600 list-decimal list-inside leading-relaxed">
                    <li><strong className="text-stone-800">Instagram / TikTok / YouTube Bio:</strong> Paste this URL into your website/link field in your profile settings.</li>
                    <li><strong className="text-stone-800">Newsletter / Email Footer:</strong> Hyperlink phrases like <em>"Subscribe to VIP updates"</em> or <em>"Join the Waitlist"</em>.</li>
                    <li><strong className="text-stone-800">QR Codes for Live Events:</strong> Generate a QR code pointing to this URL for instant in-person signups.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 2: INLINE JS SCRIPT WALKTHROUGH */}
            {publishModalTab === 'embed_js' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-amber-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-700" />
                    <span>Best for Shopify, Webflow, WordPress, Squarespace & Custom Sites</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    The lightweight JavaScript snippet dynamically renders the form inside your page layout and automatically resizes with zero layout shifts.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">Embed Snippet (HTML / JS)</label>
                    <span className="text-[11px] text-stone-400">Paste anywhere inside your &lt;body&gt; tags</span>
                  </div>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<div id="sendline-form-${slug}"></div>
<script src="https://sendline.co/embed/v1/forms.js" 
  data-form-id="${slug}" 
  data-container="sendline-form-${slug}" 
  async>
</script>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<div id="sendline-form-${slug}"></div>\n<script src="https://sendline.co/embed/v1/forms.js" data-form-id="${slug}" data-container="sendline-form-${slug}" async></script>`, 'js_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'js_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'js_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Where to Paste Walkthrough Guide */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Where to paste this code:</h4>
                  <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
                    <li>• <strong className="text-stone-800">Shopify:</strong> Go to Online Store &gt; Themes &gt; Customize &gt; Add Section &gt; <em>"Custom Liquid"</em> or <em>"Custom HTML"</em>, then paste.</li>
                    <li>• <strong className="text-stone-800">WordPress / Elementor:</strong> Add an <em>"HTML block"</em> or <em>"Shortcode"</em> widget anywhere on your post or landing page.</li>
                    <li>• <strong className="text-stone-800">Webflow / Squarespace:</strong> Drag a <em>"Code Component"</em> into your section and paste the snippet.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: RESPONSIVE IFRAME WALKTHROUGH */}
            {publishModalTab === 'embed_iframe' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-emerald-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Universal Sandboxed Embed (Works with strict CMS policies)</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    Uses an isolated iframe container that prevents CSS style conflicts with your main website stylesheets.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">iFrame Embed Code</label>
                    <span className="text-[11px] text-stone-400">100% width, responsive height</span>
                  </div>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<iframe 
  src="https://sendline.co/f/${slug}?embed=true" 
  width="100%" 
  height="600" 
  style="border:none; border-radius:16px; overflow:hidden;" 
  title="${title}">
</iframe>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<iframe src="https://sendline.co/f/${slug}?embed=true" width="100%" height="600" style="border:none; border-radius:16px; overflow:hidden;" title="${title}"></iframe>`, 'iframe_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'iframe_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'iframe_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Where to Paste Walkthrough Guide */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Placement Recommendations:</h4>
                  <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
                    <li>• <strong className="text-stone-800">Dedicated Landing Pages:</strong> Ideal for full-screen checkout, survey, or booking experiences.</li>
                    <li>• <strong className="text-stone-800">Notion / Coda / Guru:</strong> Type <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-[10px]">/embed</code> and paste the hosted URL or iframe.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: RAW HTML WALKTHROUGH */}
            {publishModalTab === 'embed_raw' && (
              <div className="space-y-4 text-left">
                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl text-purple-950 space-y-1">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>Pure HTML Form POST Handler (For Developers & Static Site Generators)</span>
                  </div>
                  <p className="text-[11px] text-purple-900 leading-relaxed">
                    Post submission data directly to Sendline API endpoints from custom React/Next.js/Astro forms.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">Form POST Code</label>
                    <span className="text-[11px] text-stone-400">Endpoint: /api/v1/forms/{slug}/submit</span>
                  </div>
                  <div className="relative">
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800 max-h-32">
{`<form action="https://sendline.co/api/v1/forms/${slug}/submit" method="POST">
  <input type="hidden" name="form_id" value="${slug}" />
  ${fields.map(f => `<input type="${f.type === 'email' ? 'email' : 'text'}" name="${f.key || f.label.toLowerCase().replace(/\\s+/g, '_')}" placeholder="${f.placeholder || f.label}" ${f.required ? 'required' : ''} />`).join('\n  ')}
  <button type="submit">${submitButtonText || 'Submit'}</button>
</form>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<form action="https://sendline.co/api/v1/forms/${slug}/submit" method="POST">\n  <input type="hidden" name="form_id" value="${slug}" />\n  ${fields.map(f => `<input type="${f.type === 'email' ? 'email' : 'text'}" name="${f.key || f.label.toLowerCase().replace(/\\s+/g, '_')}" placeholder="${f.placeholder || f.label}" ${f.required ? 'required' : ''} />`).join('\n  ')}\n  <button type="submit">${submitButtonText || 'Submit'}</button>\n</form>`, 'raw_embed')}
                      className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 backdrop-blur-xs transition-all cursor-pointer"
                    >
                      {copiedKey === 'raw_embed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'raw_embed' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Developer notes:</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Submissions through this POST endpoint trigger automatic subscriber tagging (<strong>{targetTag || 'Form-Subscriber'}</strong>) and segment distribution (<strong>{targetSegments.join(', ')}</strong>) in real-time.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsShareOpen(false);
                  onOpenPublicPreview({
                    ...form,
                    title,
                    slug,
                    fields,
                    links,
                    fieldStyle,
                    fieldBorderColor,
                    fieldBorderWidth,
                    fieldBgColor,
                    fieldTextColor,
                    fieldFontFamily,
                    fieldFontWeight,
                    fieldFontSize,
                    fieldTextAlign,
                    fieldTextCase,
                    fieldSpacing
                  });
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                <span>Test Live Form</span>
              </button>

              <button
                onClick={() => setIsShareOpen(false)}
                className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
