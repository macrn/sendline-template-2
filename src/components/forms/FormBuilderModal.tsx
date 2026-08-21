import React, { useState } from 'react';
import { FormItem, FormFieldConfig, FormFieldType } from '../../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Eye, 
  Copy, 
  Code, 
  Globe, 
  Share2, 
  Palette, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface FormBuilderModalProps {
  form?: FormItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: FormItem) => void;
  onOpenPublicPreview: (form: FormItem) => void;
}

export const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  form,
  isOpen,
  onClose,
  onSave,
  onOpenPublicPreview
}) => {
  const [title, setTitle] = useState(form?.title || 'New Lead Capture Form');
  const [slug, setSlug] = useState(form?.slug || 'new-lead-capture');
  const [description, setDescription] = useState(form?.description || 'Please fill out this form to connect with our team.');
  const [category, setCategory] = useState<FormItem['category']>(form?.category || 'Contact');
  const [targetTag, setTargetTag] = useState(form?.targetTag || 'Website-Lead');
  const [submitButtonText, setSubmitButtonText] = useState(form?.submitButtonText || 'Submit Form');
  const [successMessage, setSuccessMessage] = useState(form?.successMessage || 'Thank you! Your submission has been received.');
  const [accentColor, setAccentColor] = useState(form?.accentColor || '#0f172a');
  const [fontFamily, setFontFamily] = useState<FormItem['fontFamily']>(form?.fontFamily || 'sans');
  const [buttonShape, setButtonShape] = useState<FormItem['buttonShape']>(form?.buttonShape || 'rounded');
  const [activeTab, setActiveTab] = useState<'fields' | 'design' | 'embed' | 'preview'>('fields');
  const [copiedEmbed, setCopiedEmbed] = useState<string | null>(null);

  const [fields, setFields] = useState<FormFieldConfig[]>(form?.fields || [
    {
      id: 'f-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'e.g. Alexander Hayes',
      required: true,
      helpText: 'Primary contact name'
    },
    {
      id: 'f-2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'alex@company.com',
      required: true
    },
    {
      id: 'f-3',
      type: 'phone',
      label: 'Phone Number',
      placeholder: '+1 (555) 000-0000',
      required: false
    },
    {
      id: 'f-4',
      type: 'dropdown',
      label: 'Inquiry Category',
      required: true,
      options: ['General Consultation', 'Partnership / Investment', 'Technical Support', 'Press & Media']
    },
    {
      id: 'f-5',
      type: 'textarea',
      label: 'Message / Project Details',
      placeholder: 'How can we help you?',
      required: true
    }
  ]);

  if (!isOpen) return null;

  const handleAddField = (type: FormFieldType) => {
    const newField: FormFieldConfig = {
      id: 'f-' + Date.now(),
      type,
      label: type === 'text' ? 'Short Text Field' :
             type === 'email' ? 'Email Address' :
             type === 'phone' ? 'Phone Number' :
             type === 'textarea' ? 'Multi-line Paragraph' :
             type === 'dropdown' ? 'Dropdown Selection' :
             type === 'checkbox' ? 'Agreement Checkbox' : 'File Attachment',
      placeholder: type === 'textarea' ? 'Type your message...' : 'Enter value...',
      required: false,
      options: type === 'dropdown' ? ['Option A', 'Option B', 'Option C'] : undefined
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<FormFieldConfig>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'form-' + Date.now();
    const updatedForm: FormItem = {
      id: form?.id || 'form-' + Date.now(),
      title: title.trim() || 'Untitled Form',
      slug: cleanSlug,
      description: description.trim(),
      category,
      status: 'Published',
      fields,
      submitButtonText: submitButtonText.trim() || 'Submit',
      successMessage: successMessage.trim(),
      targetTag: targetTag.trim() || 'Form-Subscriber',
      accentColor,
      fontFamily,
      buttonShape,
      viewsCount: form?.viewsCount || 0,
      submissionsCount: form?.submissionsCount || 0,
      conversionRate: form?.conversionRate || 0,
      createdAt: form?.createdAt || 'Just now',
      isStandaloneHosted: true,
      hostedPermaUrl: `https://sendline.co/f/${cleanSlug}`
    };
    onSave(updatedForm);
    onClose();
  };

  const iframeEmbedCode = `<iframe 
  src="https://sendline.co/f/${slug || 'form-view'}" 
  width="100%" 
  height="720px" 
  frameborder="0" 
  style="border:none; border-radius:16px; overflow:hidden;"
></iframe>`;

  const scriptEmbedCode = `<!-- Sendline Form Embed -->
<div id="sendline-form-root" data-form-slug="${slug || 'form-view'}"></div>
<script src="https://sendline.co/embed/form.js" async defer></script>`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmbed(key);
    setTimeout(() => setCopiedEmbed(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 font-sans text-left">
      <div className="w-full max-w-5xl bg-white border border-stone-200 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                {form ? 'Edit Hosted & Embedded Form' : 'Create New Form'}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-200/80 text-stone-700">
                sendline.co/f/{slug || 'custom-form'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize form fields, embed snippets, standalone hosted links, and auto-sync tags to Audience.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const tempForm: FormItem = {
                  id: form?.id || 'preview-temp',
                  title,
                  slug,
                  description,
                  category,
                  status: 'Published',
                  fields,
                  submitButtonText,
                  successMessage,
                  targetTag,
                  accentColor,
                  fontFamily,
                  buttonShape,
                  viewsCount: 1,
                  submissionsCount: 0,
                  conversionRate: 0,
                  createdAt: 'Today',
                  isStandaloneHosted: true,
                  hostedPermaUrl: `https://sendline.co/f/${slug}`
                };
                onOpenPublicPreview(tempForm);
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>Public Live View</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Builder Nav Tabs */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fields'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Form Fields ({fields.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'design'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Styling & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Embed & Share Link</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          
          {/* TAB 1: FORM FIELDS */}
          {activeTab === 'fields' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* General Form Info */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">General Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Form Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!form) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                      placeholder="e.g. Catalyst Growth Capital Contact Form"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">URL Slug (sendline.co/f/...)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                      placeholder="e.g. catalyst-growth-contact"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Intro Description / Subtitle</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                    placeholder="Provide instructions or context for the respondent..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Form Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Contact">Contact Inquiry</option>
                      <option value="Lead Capture">Lead Capture</option>
                      <option value="Waitlist">Waitlist / Pre-Order</option>
                      <option value="Application">Grant / Program Application</option>
                      <option value="Feedback">Feedback / Survey</option>
                      <option value="Registration">Event Registration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Auto-Add Tag to Audience CRM</label>
                    <input
                      type="text"
                      value={targetTag}
                      onChange={(e) => setTargetTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                      placeholder="e.g. Growth-Capital-Inquiry"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Configured Fields ({fields.length})</h4>
                  
                  {/* Add Field Dropdown Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-stone-400 font-medium mr-1">+ Add field:</span>
                    <button
                      type="button"
                      onClick={() => handleAddField('text')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Short Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddField('email')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddField('phone')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddField('dropdown')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Dropdown
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddField('textarea')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddField('checkbox')}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs border border-stone-200 transition-colors cursor-pointer"
                    >
                      Consent Checkbox
                    </button>
                  </div>
                </div>

                {fields.map((field, idx) => (
                  <div key={field.id} className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-stone-900">{field.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                          {field.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                            className="rounded text-stone-900 focus:ring-0 cursor-pointer"
                          />
                          <span>Required</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-500 mb-1">Field Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-500 mb-1">Placeholder Text</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                        />
                      </div>
                    </div>

                    {field.type === 'dropdown' && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-medium text-stone-500 mb-1">
                          Options (comma separated)
                        </label>
                        <input
                          type="text"
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => handleUpdateField(field.id, { 
                            options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) 
                          })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submission CTA Settings */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Submission & Confirmation</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={submitButtonText}
                      onChange={(e) => setSubmitButtonText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                      placeholder="e.g. Submit Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Post-Submit Message</label>
                    <input
                      type="text"
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                      placeholder="e.g. Thank you! We will be in touch shortly."
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DESIGN & BRANDING */}
          {activeTab === 'design' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-5 shadow-xs">
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Form Appearance & Style</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Customize color accents, typography, and button geometries.</p>
                </div>

                {/* Accent Color Picker */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-2">Brand Accent Color</label>
                  <div className="flex items-center gap-3">
                    {['#0f172a', '#d97706', '#059669', '#2563eb', '#7c3aed', '#e11d48'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAccentColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          accentColor === c ? 'scale-110 border-stone-950 shadow-xs' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      >
                        {accentColor === c && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer border border-stone-200 bg-transparent"
                    />
                  </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {(['sans', 'serif', 'mono'] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => setFontFamily(font)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        fontFamily === font
                          ? 'border-stone-900 bg-stone-50 font-semibold text-stone-950'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className={`text-base mb-1 ${font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans'}`}>
                        Aa
                      </div>
                      <div className="text-xs capitalize">{font}</div>
                    </button>
                  ))}
                </div>

                {/* Button Shape */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-stone-700 mb-2">Button Geometry</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['rounded', 'pill', 'sharp'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setButtonShape(shape)}
                        className={`p-3 border text-center transition-all cursor-pointer ${
                          shape === 'pill' ? 'rounded-full' : shape === 'rounded' ? 'rounded-xl' : 'rounded-none'
                        } ${
                          buttonShape === shape
                            ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <span className="text-xs capitalize">{shape}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMBED & SHARE CODES */}
          {activeTab === 'embed' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Public Share URL Box (Like Zoho Sample) */}
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-stone-900">Standalone Public URL</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Hosted Permalink
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Share this direct link in emails, social bios, client messages, or SMS for a distraction-free full page experience.
                </p>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800">
                  <span className="flex-1 truncate">https://sendline.co/f/{slug || 'catalyst-growth-contact'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`https://sendline.co/f/${slug || 'catalyst-growth-contact'}`, 'url')}
                    className="px-3 py-1 rounded bg-white hover:bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {copiedEmbed === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmbed === 'url' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Inline Iframe Embed Snippet */}
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-stone-700" />
                    <h4 className="text-sm font-semibold text-stone-900">Inline HTML iFrame Embed</h4>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">&lt;iframe&gt;</span>
                </div>
                <p className="text-xs text-stone-500">
                  Paste directly into Webflow, WordPress, Shopify, Squarespace, or custom landing pages.
                </p>

                <div className="relative">
                  <pre className="p-4 rounded-lg bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto">
                    {iframeEmbedCode}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(iframeEmbedCode, 'iframe')}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium border border-stone-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedEmbed === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmbed === 'iframe' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
              </div>

              {/* Script Embed */}
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-stone-700" />
                    <h4 className="text-sm font-semibold text-stone-900">JavaScript Dynamic Script Embed</h4>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">&lt;script&gt;</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto">
                    {scriptEmbedCode}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(scriptEmbedCode, 'script')}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium border border-stone-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedEmbed === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmbed === 'script' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INTERACTIVE SIMULATOR */}
          {activeTab === 'preview' && (
            <div className="max-w-xl mx-auto">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-lg space-y-6">
                <div>
                  <h3 className={`text-xl font-bold text-stone-900 ${
                    fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
                  }`}>
                    {title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {fields.map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="block text-xs font-medium text-stone-800">
                        {f.label} {f.required && <span className="text-rose-500">*</span>}
                      </label>
                      
                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          placeholder={f.placeholder}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
                        />
                      ) : f.type === 'dropdown' ? (
                        <select className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50/50 cursor-pointer">
                          <option value="">Select an option...</option>
                          {f.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : f.type === 'checkbox' ? (
                        <label className="flex items-start gap-2 text-xs text-stone-600 pt-1 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 rounded text-stone-900" />
                          <span>{f.label}</span>
                        </label>
                      ) : (
                        <input
                          type={f.type === 'email' ? 'email' : f.type === 'phone' ? 'tel' : 'text'}
                          placeholder={f.placeholder}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-3">
                    <button
                      type="button"
                      style={{ backgroundColor: accentColor }}
                      className={`w-full py-2.5 text-white font-medium text-xs shadow-xs transition-all cursor-pointer ${
                        buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none'
                      }`}
                    >
                      {submitButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div className="text-xs text-stone-500">
            Form changes automatically sync with embed code and public permalinks.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
            >
              Save & Publish Form
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
