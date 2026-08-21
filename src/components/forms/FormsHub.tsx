import React, { useState } from 'react';
import { FormItem, FormSubmission, AudienceSegment } from '../../types';
import { mockSegments } from '../../data/mockData';
import { FormTemplatePreset } from '../../data/formTemplates';
import { 
  Plus, 
  Search, 
  Globe, 
  Code, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Users, 
  Inbox, 
  ArrowUpRight, 
  CheckCircle2,
  FileText,
  Layers,
  Tag,
  Link2,
  Layout,
  Video,
  Disc,
  Clock
} from 'lucide-react';
import { FormTemplatesGalleryModal } from './FormTemplatesGalleryModal';
import { FormSegmentSelectionModal } from './FormSegmentSelectionModal';
import { FlodeskFormStudio } from './FlodeskFormStudio';

interface FormsHubProps {
  forms: FormItem[];
  submissions: FormSubmission[];
  segments?: AudienceSegment[];
  onSaveForm: (form: FormItem) => void;
  onDeleteForm: (formId: string) => void;
  onOpenPublicForm?: (form: FormItem) => void;
  onOpenPublicPreview?: (form: FormItem) => void;
}

export const FormsHub: React.FC<FormsHubProps> = ({
  forms,
  submissions,
  segments = mockSegments,
  onSaveForm,
  onDeleteForm,
  onOpenPublicForm,
  onOpenPublicPreview
}) => {
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Flodesk Workflow Modal States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedTemplateForSegment, setSelectedTemplateForSegment] = useState<FormTemplatePreset | null>(null);
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  
  // Studio Editor State
  const [studioEditingForm, setStudioEditingForm] = useState<FormItem | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const handleOpenPreview = (formItem: FormItem) => {
    if (onOpenPublicPreview) {
      onOpenPublicPreview(formItem);
    } else if (onOpenPublicForm) {
      onOpenPublicForm(formItem);
    }
  };

  // 1. Step 1: User picks a template or scratch from the gallery
  const handleSelectTemplateFromGallery = (template: FormTemplatePreset | null) => {
    setIsGalleryOpen(false);
    setSelectedTemplateForSegment(template);
    setIsSegmentModalOpen(true);
  };

  // 2. Step 2: User confirms mandatory segment selection -> Launch Flodesk Form Studio
  const handleConfirmSegments = (selectedSegments: string[]) => {
    setIsSegmentModalOpen(false);

    const template = selectedTemplateForSegment;
    const baseSlug = template 
      ? template.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') 
      : 'custom-lead-form';
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newForm: FormItem = {
      id: 'form-' + Date.now(),
      title: template ? template.name : 'Untitled Lead Form',
      slug: uniqueSlug,
      description: template ? template.description : 'Subscribe to receive our latest updates and announcements.',
      category: template ? template.category : 'Lead Capture',
      formType: template ? template.formType : 'link_in_bio',
      status: 'Published',
      headline: template ? template.headline : 'Join Our Private Community',
      subtitle: template ? template.subtitle : 'Get curated insights delivered directly to your inbox.',
      bodyText: template?.bodyText || '',
      badgeText: template?.badgeText || 'Exclusive Access',
      scriptOverlay: template?.scriptOverlay || '',
      monogram: template?.monogram || 'SL',
      imageUrl: template?.previewImage || '',
      frameShape: template?.frameShape || 'rounded',
      paletteTheme: template?.paletteTheme || 'sand',
      accentColor: template?.accentColor || '#18181B',
      fontFamily: template?.fontFamily || 'serif',
      buttonShape: template?.buttonShape || 'pill',
      submitButtonText: template?.submitButtonText || 'Join Newsletter',
      canvasRadius: 24,
      layoutMode: template?.layoutMode || 'single',
      showCountdown: template?.showCountdown ?? (template?.formType === 'countdown'),
      countdownDays: template?.countdownDays ?? 10,
      countdownHours: template?.countdownHours ?? 23,
      countdownMinutes: template?.countdownMinutes ?? 18,
      countdownSeconds: template?.countdownSeconds ?? 1,
      countdownLabelStyle: template?.countdownLabelStyle || 'serif_dividers',
      countdownPosition: template?.countdownPosition || 'before_fields',
      showTestimonial: template?.showTestimonial ?? false,
      testimonialQuote: template?.testimonialQuote || '',
      testimonialAuthor: template?.testimonialAuthor || '',
      showBulletPoints: template?.showBulletPoints ?? false,
      bulletPoints: template?.bulletPoints ? [...template.bulletPoints] : undefined,
      bulletPosition: template?.bulletPosition || 'before_fields',
      bgColor: template?.bgColor || '#FAF7F2',
      cardBgColor: template?.cardBgColor || '#FFFFFF',
      textColor: template?.textColor || '#18181B',
      buttonBgColor: template?.buttonBgColor || template?.accentColor || '#18181B',
      buttonTextColor: template?.buttonTextColor || '#FFFFFF',
      textAlign: template?.textAlign || 'center',
      fields: template?.fields ? [...template.fields] : [
        { id: 'f1', type: 'text', label: 'First Name', placeholder: 'Alexander', required: false },
        { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'alex@company.com', required: true }
      ],
      links: template?.links ? [...template.links] : undefined,
      thankYouHeadline: template?.thankYouHeadline || 'Thank You for Subscribing!',
      thankYouMessage: template?.thankYouMessage || 'Check your inbox for your confirmation and welcome guide.',
      successMessage: template?.thankYouMessage || 'Check your inbox for your confirmation and welcome guide.',
      thankYouActionType: template?.thankYouActionType || 'message',
      thankYouDownloadUrl: template?.thankYouDownloadUrl || 'https://sendline.co/downloads/guide.pdf',
      thankYouDownloadButtonText: template?.thankYouDownloadButtonText || 'Download Freebie (PDF)',
      targetTag: template?.targetTag || 'Form-Subscriber',
      targetSegments: selectedSegments,
      targetSegment: selectedSegments[0] || 'General Subscribers',
      viewsCount: 0,
      submissionsCount: 0,
      conversionRate: 0,
      createdAt: 'Just now',
      isStandaloneHosted: true,
      hostedPermaUrl: `https://sendline.co/f/${uniqueSlug}`,
      fieldStyle: template?.fieldStyle || 'outlined_rounded',
      fieldBorderColor: template?.fieldBorderColor || '#217CC5',
      fieldBorderWidth: 1,
      fieldBgColor: template?.fieldBgColor || '#FFFFFF',
      fieldTextColor: template?.fieldTextColor || '#207CC5',
      fieldFontFamily: 'editorial',
      fieldFontWeight: 'regular',
      fieldFontSize: 16,
      fieldTextAlign: template?.textAlign || 'center',
      fieldTextCase: 'normal',
      fieldSpacing: 12,
      fieldPaddingY: 44
    };

    setStudioEditingForm(newForm);
    setIsStudioOpen(true);
  };

  // Filtered forms
  const filteredForms = forms.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalViews = forms.reduce((sum, f) => sum + f.viewsCount, 0);
  const totalSubmissions = forms.reduce((sum, f) => sum + f.submissionsCount, 0);
  const averageConversion = totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : '0.0';

  const handleCopyLink = (slug: string) => {
    const url = `https://sendline.co/f/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans animate-fadeIn">
      
      {/* 1. Top Header & Action Switchboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Forms & Lead Capture
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-900 text-white shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Flodesk Engine
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Create high-converting Link in Bio pages, exit popups, inline opt-in bars, video masterclass gates, and full-page discovery funnels.
          </p>
        </div>

        <button
          id="forms-header-create-btn"
          onClick={() => setIsGalleryOpen(true)}
          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 self-start md:self-auto active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-stone-300" />
          <span>Create New Form</span>
        </button>
      </div>

      {/* 2. Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
        
        {/* KPI 1: Total Active Forms */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Active Forms</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Layers className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {forms.length}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-stone-400 text-xs font-normal pt-1 border-t border-stone-100">
            <span>Link in Bio & Embeds</span>
          </div>
        </div>

        {/* KPI 2: Total Impressions / Views */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total Impressions</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Eye className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {totalViews.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            <span>+18.4% this month</span>
          </div>
        </div>

        {/* KPI 3: Total Submissions */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Leads Captured</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {totalSubmissions.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-stone-400 text-xs font-normal pt-1 border-t border-stone-100">
            <span>Auto-synced to Segments</span>
          </div>
        </div>

        {/* KPI 4: Average Conversion Rate */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Avg. Conversion</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {averageConversion}%
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>High conversion baseline</span>
          </div>
        </div>

      </div>

      {/* 3. Main Container with Tabs */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-5">
        
        {/* Navigation Switcher & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('forms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'forms'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Published Forms ({forms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'submissions'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Submissions ({submissions.length})</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
              />
            </div>

            {activeTab === 'forms' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Contact">Contact Inquiry</option>
                <option value="Lead Capture">Lead Capture</option>
                <option value="Waitlist">Waitlist</option>
                <option value="Application">Application</option>
                <option value="Link in Bio">Link in Bio</option>
                <option value="Freebie">Freebie / PDF</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: PUBLISHED FORMS LIST */}
        {activeTab === 'forms' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredForms.map((formItem) => {
                const formTypeIcon = formItem.formType === 'link_in_bio' ? Link2 :
                                     formItem.formType === 'popup' ? Layout :
                                     formItem.formType === 'video' ? Video :
                                     formItem.formType === 'spinner' ? Disc :
                                     formItem.formType === 'countdown' ? Clock : FileText;
                const IconComponent = formTypeIcon;

                return (
                  <div
                    key={formItem.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-400 transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md group text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 uppercase flex items-center gap-1">
                              <IconComponent className="w-3 h-3 text-stone-500" />
                              <span>{formItem.formType ? formItem.formType.replace(/_/g, ' ') : formItem.category}</span>
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-stone-700 transition-colors">
                            {formItem.title}
                          </h3>
                        </div>

                        <div className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs" style={{ backgroundColor: formItem.accentColor }} />
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {formItem.description}
                      </p>

                      {/* Stats pill row */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
                        <div className="p-1.5 rounded-xl bg-stone-50 border border-stone-100">
                          <span className="text-[10px] text-stone-400 block">Fields</span>
                          <strong className="text-xs font-mono font-bold text-stone-800">{formItem.fields.length}</strong>
                        </div>
                        <div className="p-1.5 rounded-xl bg-stone-50 border border-stone-100">
                          <span className="text-[10px] text-stone-400 block">Leads</span>
                          <strong className="text-xs font-mono font-bold text-stone-800">{formItem.submissionsCount}</strong>
                        </div>
                        <div className="p-1.5 rounded-xl bg-stone-50 border border-stone-100">
                          <span className="text-[10px] text-stone-400 block">Conv.</span>
                          <strong className="text-xs font-mono font-bold text-emerald-700">{formItem.conversionRate}%</strong>
                        </div>
                      </div>

                      {/* Target tag & Segment sync badge */}
                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] text-stone-600 flex items-center justify-between">
                          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">Assigned Segment:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold truncate max-w-[150px]">
                            {formItem.targetSegments && formItem.targetSegments.length > 0 
                              ? formItem.targetSegments.join(', ') 
                              : formItem.targetSegment || 'VIP Audience'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyLink(formItem.slug)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy hosted link"
                        >
                          {copiedSlug === formItem.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-stone-500" />
                          )}
                          <span>{copiedSlug === formItem.slug ? 'Copied' : 'Link'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenPreview(formItem)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Open live public view"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                          <span>Live</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setStudioEditingForm(formItem);
                            setIsStudioOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Open in Flodesk Form Studio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteForm(formItem.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete form"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredForms.length === 0 && (
              <div className="p-12 text-center bg-stone-50 rounded-2xl border border-stone-200">
                <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-stone-900">No forms found</h4>
                <p className="text-xs text-stone-500 mt-1">Create your first form with the gallery button above.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBMISSIONS LOG */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Form</th>
                      <th className="py-3.5 px-4">Submitted Data Highlights</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-950">{sub.contactName || 'Anonymous'}</div>
                          <div className="text-stone-500 text-[11px] font-mono">{sub.contactEmail}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium text-[11px]">
                            {sub.formTitle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-stone-600 text-[11px] truncate">
                            {Object.entries(sub.data).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                          {sub.submittedAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            View Payload
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 1. STEP 1 MODAL: Flodesk Form Template Gallery */}
      {isGalleryOpen && (
        <FormTemplatesGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          onSelectTemplate={handleSelectTemplateFromGallery}
          savedForms={forms}
          onOpenSavedForm={(selectedForm) => {
            setIsGalleryOpen(false);
            setStudioEditingForm(selectedForm);
            setIsStudioOpen(true);
          }}
        />
      )}

      {/* 2. STEP 2 MODAL: Mandatory Segment Selection */}
      {isSegmentModalOpen && (
        <FormSegmentSelectionModal
          isOpen={isSegmentModalOpen}
          onClose={() => setIsSegmentModalOpen(false)}
          onConfirm={handleConfirmSegments}
          availableSegments={segments}
          initialSelected={selectedTemplateForSegment?.suggestedSegment ? [selectedTemplateForSegment.suggestedSegment] : ['US VIP Customers & Active Subscribers']}
          templateName={selectedTemplateForSegment?.name || 'Form'}
        />
      )}

      {/* 3. STEP 3 STUDIO: Flodesk Form Studio Editor */}
      {isStudioOpen && studioEditingForm && (
        <FlodeskFormStudio
          form={studioEditingForm}
          onClose={() => {
            setIsStudioOpen(false);
            setStudioEditingForm(null);
          }}
          onSaveForm={(updated) => {
            onSaveForm(updated);
            setStudioEditingForm(updated);
          }}
          onOpenPublicPreview={handleOpenPreview}
          onOpenTemplatesGallery={() => {
            setIsStudioOpen(false);
            setStudioEditingForm(null);
            setIsGalleryOpen(true);
          }}
        />
      )}

      {/* Submission Payload Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-950">Form Submission Payload</h3>
                <p className="text-xs text-stone-500">{selectedSubmission.formTitle} • {selectedSubmission.submittedAt}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {Object.entries(selectedSubmission.data).map(([key, value]) => (
                <div key={key} className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">{key}</span>
                  <p className="text-xs text-stone-800 font-medium leading-relaxed">{String(value)}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
