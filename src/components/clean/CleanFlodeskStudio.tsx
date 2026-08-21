import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Mail, 
  FileText, 
  Workflow, 
  Palette, 
  Check, 
  Layers, 
  Eye, 
  Copy, 
  ChevronRight, 
  Smartphone, 
  Monitor, 
  Info, 
  Send,
  Zap,
  Sliders,
  Share2,
  ExternalLink,
  Code,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EmailTemplate, AppView, Campaign, WorkflowItem, FormItem } from '../../types';
import { mockTemplates } from '../../data/mockData';

export type FlodeskProductMode = 'campaign' | 'form' | 'workflow';

interface CleanStudioProps {
  onNavigate: (view: AppView) => void;
  onSaveCampaign?: (campaign: Campaign) => void;
  onSaveWorkflow?: (workflow: WorkflowItem) => void;
  onSaveForm?: (form: FormItem) => void;
}

export const CleanFlodeskStudio: React.FC<CleanStudioProps> = ({
  onNavigate,
  onSaveCampaign,
  onSaveWorkflow,
  onSaveForm
}) => {
  // Step in the Flow: 1: Gallery -> 2: Detail View -> 3: Tri-Mode Editor
  const [currentStep, setCurrentStep] = useState<'gallery' | 'detail' | 'editor'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(mockTemplates[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Editor State
  const [activeProductMode, setActiveProductMode] = useState<FlodeskProductMode>('campaign');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeColorTheme, setActiveColorTheme] = useState<string>('terracotta');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable Draft Data per Mode
  const [templateDrafts, setTemplateDrafts] = useState<Record<FlodeskProductMode, {
    headline: string;
    subhead: string;
    body: string;
    buttonText: string;
    buttonUrl: string;
    subject: string;
    senderName: string;
    formFields: Array<{ id: string; label: string; placeholder: string; type: string; required: boolean }>;
    formLayout: 'card' | 'inline' | 'full';
    workflowTrigger: string;
    workflowDelay: string;
    conditionTag: string;
  }>>({
    campaign: {
      headline: 'The Autumn Capsule Collection',
      subhead: 'Thoughtfully curated wardrobe essentials for the crisp season ahead.',
      body: 'Hi {{first_name}},\n\nWe designed this collection with timeless silhouettes, natural fabrics, and versatile styling in mind. As a valued {{loyalty_tier}} member, you have early access 24 hours before public release.\n\nEnjoy complimentary shipping with code: {{referral_code}}',
      buttonText: 'Shop the Capsule →',
      buttonUrl: 'https://example.com/capsule',
      subject: 'Early Access: The Autumn Capsule is Here',
      senderName: 'Maison Studio Team',
      formFields: [],
      formLayout: 'card',
      workflowTrigger: '',
      workflowDelay: '',
      conditionTag: ''
    },
    form: {
      headline: 'Join the VIP Autumn Waitlist',
      subhead: 'Be the first to receive collection lookbooks, private sale invites, and styling notes.',
      body: 'Get instant access to our downloadable capsule styling guide and early drop notifications directly to your inbox.',
      buttonText: 'Get VIP Access & Guide',
      buttonUrl: '',
      subject: 'Welcome to VIP Circle',
      senderName: 'Maison Studio',
      formFields: [
        { id: 'f1', label: 'First Name', placeholder: 'Enter your first name', type: 'text', required: true },
        { id: 'f2', label: 'Email Address', placeholder: 'name@example.com', type: 'email', required: true },
        { id: 'f3', label: 'Preferred Style', placeholder: 'Minimalist / Classic / Modern', type: 'text', required: false }
      ],
      formLayout: 'card',
      workflowTrigger: '',
      workflowDelay: '',
      conditionTag: ''
    },
    workflow: {
      headline: 'Welcome to the Studio Circle',
      subhead: 'Your journey to effortless, intentional wardrobe design starts today.',
      body: 'Hello {{first_name}},\n\nThank you for signing up. Over the next 5 days, we will share 3 mini styling guides tailored to your preferences.\n\nYour account points balance: {{loyalty_points}} pts.',
      buttonText: 'Download Welcome Kit',
      buttonUrl: 'https://example.com/welcome-kit',
      subject: 'Step 1: Your Welcome Kit Inside',
      senderName: 'Maison Concierge',
      formFields: [],
      formLayout: 'card',
      workflowTrigger: 'When Form "VIP Autumn Waitlist" is submitted',
      workflowDelay: 'Send immediately (0 min delay)',
      conditionTag: 'Tag: VIP-Member'
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTemplateFromGallery = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    // Initialize drafts from selected template
    setTemplateDrafts(prev => ({
      campaign: {
        ...prev.campaign,
        headline: tmpl.headline || 'Curated Design',
        subhead: tmpl.description || 'Thoughtfully crafted message',
        subject: tmpl.subject || 'Special Message for you'
      },
      form: {
        ...prev.form,
        headline: `Subscribe to ${tmpl.name}`,
        subhead: tmpl.description || 'Stay in the loop with updates'
      },
      workflow: {
        ...prev.workflow,
        headline: `Welcome: ${tmpl.name}`,
        subhead: tmpl.description || 'Automation series message',
        subject: `Step 1: ${tmpl.subject || tmpl.name}`
      }
    }));
    setCurrentStep('detail');
  };

  const handleOpenEditor = () => {
    setCurrentStep('editor');
  };

  const handleSaveProduct = () => {
    if (activeProductMode === 'campaign') {
      const campData: Campaign = {
        id: `camp-${Date.now()}`,
        title: templateDrafts.campaign.subject || selectedTemplate.name,
        subject: templateDrafts.campaign.subject,
        status: 'Draft',
        sentCount: 1420,
        openRate: 0,
        clickRate: 0,
        date: new Date().toISOString(),
        audience: 'All Subscribers',
        templateId: selectedTemplate.id
      };
      if (onSaveCampaign) onSaveCampaign(campData);
      showToast('✨ Campaign draft created and synced to workspace!');
    } else if (activeProductMode === 'form') {
      const formData: FormItem = {
        id: `form-${Date.now()}`,
        title: templateDrafts.form.headline,
        slug: `form-${Date.now().toString().slice(-4)}`,
        category: 'Newsletter',
        status: 'Published',
        viewsCount: 0,
        submissionsCount: 0,
        conversionRate: 0,
        description: templateDrafts.form.subhead || '',
        submitButtonText: templateDrafts.form.buttonText,
        successMessage: 'Thank you for subscribing!',
        targetTag: 'Lead',
        accentColor: '#1c1917',
        fontFamily: 'serif',
        buttonShape: 'pill',
        headline: templateDrafts.form.headline,
        subtitle: templateDrafts.form.subhead,
        isStandaloneHosted: true,
        hostedPermaUrl: `/f/form-${Date.now().toString().slice(-4)}`,
        fields: templateDrafts.form.formFields.map(f => ({
          id: f.id,
          label: f.label,
          type: (f.type as any) || 'text',
          placeholder: f.placeholder,
          required: f.required
        })),
        createdAt: new Date().toISOString()
      };
      if (onSaveForm) onSaveForm(formData);
      showToast('📋 Lead form published and ready to share!');
    } else if (activeProductMode === 'workflow') {
      const wfData: WorkflowItem = {
        id: `wf-${Date.now()}`,
        title: `Automated: ${selectedTemplate.name}`,
        description: 'Multi-step onboarding and nurturing automation',
        status: 'active',
        category: 'Welcome Series',
        totalEnrolled: 0,
        totalCompleted: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rootTriggerNode: {
          id: `node-${Date.now()}-1`,
          type: 'trigger',
          title: templateDrafts.workflow.workflowTrigger,
          triggerConfig: { triggerType: 'form_submission', targetName: 'VIP Waitlist' },
          nextNodes: [
            {
              id: `node-${Date.now()}-2`,
              type: 'email',
              title: templateDrafts.workflow.headline,
              emailConfig: {
                subject: templateDrafts.workflow.subject,
                layoutHeadline: templateDrafts.workflow.headline,
                templateSnapshot: selectedTemplate
              }
            }
          ]
        }
      };
      if (onSaveWorkflow) onSaveWorkflow(wfData);
      showToast('⚡ Visual automation workflow launched and ready!');
    }
  };

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'Welcome', label: 'Welcome & Onboarding' },
    { id: 'Newsletter', label: 'Editorial Newsletters' },
    { id: 'Sales', label: 'Sales & Product Drops' },
    { id: 'Event', label: 'Events & Webinars' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? mockTemplates
    : mockTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-950 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: CLEAN FLODESK-STYLE TEMPLATE LIBRARY                             */}
      {/* ========================================================================= */}
      {currentStep === 'gallery' && (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Flodesk-Inspired Studio</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-950 font-normal">
                Template Gallery
              </h1>
              <p className="text-stone-500 text-base max-w-xl font-light">
                Select any design below. Each template automatically transforms into 3 synchronized formats: 
                <strong className="text-stone-800 font-medium"> Campaign</strong>, 
                <strong className="text-stone-800 font-medium"> Form</strong>, and 
                <strong className="text-stone-800 font-medium"> Workflow Automation</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 rounded-full border border-stone-300 hover:border-stone-950 text-sm font-medium text-stone-800 transition-colors"
              >
                Back to Workspace
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-950 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clean Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplateFromGallery(template)}
                className="group cursor-pointer bg-white rounded-3xl p-4 border border-stone-200/90 hover:border-stone-400 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 relative mb-4">
                  <img
                    src={template.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'}
                    alt={template.name}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-5 py-2.5 rounded-full bg-white text-stone-950 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Template</span>
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 px-2 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      {template.category}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 capitalize">
                      {template.paletteTheme}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-medium text-stone-950 group-hover:text-stone-700 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CLEAN FLODESK-STYLE TEMPLATE DETAIL VIEW                         */}
      {/* ========================================================================= */}
      {currentStep === 'detail' && (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-6">
            <button
              onClick={() => setCurrentStep('gallery')}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all templates</span>
            </button>

            <button
              onClick={handleOpenEditor}
              className="px-8 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customize Template</span>
            </button>
          </div>

          {/* Detail Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Template Preview Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-6">
              <div className="rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
                <img
                  src={selectedTemplate.thumbnailUrl}
                  alt={selectedTemplate.title}
                  className="w-full max-h-[500px] object-cover object-top"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600">Sample Email Layout</div>
                <div className="text-2xl font-serif font-medium text-stone-900">{selectedTemplate.headline}</div>
                <div className="text-xs text-stone-600 leading-relaxed font-serif italic">
                  "{selectedTemplate.description}"
                </div>
              </div>
            </div>

            {/* Right: Flodesk Details & 3-in-1 Triple Capabilities */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {selectedTemplate.category}
                </span>
                <h1 className="text-3xl lg:text-4xl font-serif text-stone-950 font-normal">
                  {selectedTemplate.title}
                </h1>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* 3 Versions Preview Card */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-stone-950 font-medium text-sm">
                  <Layers className="w-4 h-4 text-stone-700" />
                  <span>3 Synchronized Versions Included</span>
                </div>
                
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                    <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">1. One-off Campaign Broadcast</div>
                      <p className="text-[11px] text-stone-500">Includes first name & member personalization tags.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                    <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">2. Embedded Lead Form</div>
                      <p className="text-[11px] text-stone-500">Converts headline into a high-converting opt-in form.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5]">
                    <div className="w-7 h-7 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Workflow className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">3. Automation Workflow Step</div>
                      <p className="text-[11px] text-stone-500">Injects into your welcome sequence with delay triggers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big CTA */}
              <button
                onClick={handleOpenEditor}
                className="w-full py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Customize in Editor Now</span>
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: CLEAN FLODESK TRIPLE-MODE EDITOR                                 */}
      {/* ========================================================================= */}
      {currentStep === 'editor' && (
        <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
          
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-stone-200/90 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentStep('detail')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-stone-200" />
              <div className="font-serif font-medium text-stone-900 text-sm">
                {selectedTemplate.title}
              </div>
            </div>

            {/* 3-PRODUCT SWITCHER TABS */}
            <div className="flex items-center p-1 bg-stone-100 rounded-full border border-stone-200/80">
              <button
                onClick={() => setActiveProductMode('campaign')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeProductMode === 'campaign'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>1. Campaign</span>
              </button>

              <button
                onClick={() => setActiveProductMode('form')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeProductMode === 'form'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Form</span>
              </button>

              <button
                onClick={() => setActiveProductMode('workflow')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeProductMode === 'workflow'
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>3. Workflow</span>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md text-xs cursor-pointer ${previewDevice === 'desktop' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md text-xs cursor-pointer ${previewDevice === 'mobile' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleSaveProduct}
                className="px-5 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeProductMode === 'campaign' && 'Save Campaign'}
                  {activeProductMode === 'form' && 'Publish Form'}
                  {activeProductMode === 'workflow' && 'Save Workflow'}
                </span>
              </button>
            </div>
          </header>

          {/* Mode Context Explainer Banner */}
          <div className="bg-white border-b border-stone-200/70 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {activeProductMode === 'campaign' && (
                  <><strong>Campaign Mode:</strong> Sends a one-off newsletter. You can use full recipient tags like <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-[11px]">&#123;&#123;first_name&#125;&#125;</code> and <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-[11px]">&#123;&#123;loyalty_tier&#125;&#125;</code>.</>
                )}
                {activeProductMode === 'form' && (
                  <><strong>Form Mode:</strong> Collects new subscribers without needing prior contact data. Adds interactive name & email input fields.</>
                )}
                {activeProductMode === 'workflow' && (
                  <><strong>Workflow Mode:</strong> Automated series email triggered upon signup or purchase. Includes delay settings and member tokens.</>
                )}
              </span>
            </div>

            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              {activeProductMode.toUpperCase()} VIEW
            </span>
          </div>

          {/* Editor Workspace: Inspector Sidebar + Canvas Preview */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Inspector (Clean, simple inputs) */}
            <div className="w-80 md:w-96 bg-white border-r border-stone-200/80 p-6 overflow-y-auto space-y-6 shrink-0">
              
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {activeProductMode === 'campaign' && '1. Campaign Settings'}
                  {activeProductMode === 'form' && '2. Form Opt-in Settings'}
                  {activeProductMode === 'workflow' && '3. Automation Step Settings'}
                </div>
                <p className="text-xs text-stone-500">Edit content for this specific product format.</p>
              </div>

              {/* Specific Settings for CAMPAIGN */}
              {activeProductMode === 'campaign' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={templateDrafts.campaign.subject}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, campaign: { ...prev.campaign, subject: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Headline</label>
                    <input
                      type="text"
                      value={templateDrafts.campaign.headline}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, campaign: { ...prev.campaign, headline: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Subhead</label>
                    <input
                      type="text"
                      value={templateDrafts.campaign.subhead}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, campaign: { ...prev.campaign, subhead: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Personalized Body Copy</label>
                    <textarea
                      rows={5}
                      value={templateDrafts.campaign.body}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, campaign: { ...prev.campaign, body: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Button CTA</label>
                    <input
                      type="text"
                      value={templateDrafts.campaign.buttonText}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, campaign: { ...prev.campaign, buttonText: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Specific Settings for FORM */}
              {activeProductMode === 'form' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Form Headline</label>
                    <input
                      type="text"
                      value={templateDrafts.form.headline}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, form: { ...prev.form, headline: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Opt-in Description</label>
                    <textarea
                      rows={3}
                      value={templateDrafts.form.body}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, form: { ...prev.form, body: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase">Input Fields to Collect</label>
                    {templateDrafts.form.formFields.map((field, idx) => (
                      <div key={field.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between">
                        <span className="font-semibold text-stone-800">{field.label} ({field.type})</span>
                        <span className="text-[10px] text-stone-500">{field.required ? 'Required' : 'Optional'}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Submit Button Text</label>
                    <input
                      type="text"
                      value={templateDrafts.form.buttonText}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, form: { ...prev.form, buttonText: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Specific Settings for WORKFLOW */}
              {activeProductMode === 'workflow' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                    <div className="text-[11px] font-bold text-amber-900 uppercase">Trigger Connection</div>
                    <div className="text-xs text-amber-800">{templateDrafts.workflow.workflowTrigger}</div>
                    <div className="text-[11px] text-amber-700">Timing: {templateDrafts.workflow.workflowDelay}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Step Headline</label>
                    <input
                      type="text"
                      value={templateDrafts.workflow.headline}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, workflow: { ...prev.workflow, headline: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Nurture Message Body</label>
                    <textarea
                      rows={5}
                      value={templateDrafts.workflow.body}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, workflow: { ...prev.workflow, body: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Action Button</label>
                    <input
                      type="text"
                      value={templateDrafts.workflow.buttonText}
                      onChange={(e) => setTemplateDrafts(prev => ({ ...prev, workflow: { ...prev.workflow, buttonText: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Right Live Canvas */}
            <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
              
              <div 
                className={`bg-white rounded-3xl shadow-2xl border border-stone-200/90 transition-all duration-300 overflow-hidden ${
                  previewDevice === 'mobile' ? 'w-[375px]' : 'w-[580px]'
                }`}
              >
                {/* Visual Image Header */}
                <div className="h-56 bg-stone-100 overflow-hidden relative">
                  <img
                    src={selectedTemplate.thumbnailUrl}
                    alt={selectedTemplate.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-stone-800">
                    {activeProductMode} Format
                  </div>
                </div>

                {/* Canvas Body */}
                <div className="p-8 space-y-6">
                  
                  {/* CAMPAIGN PREVIEW */}
                  {activeProductMode === 'campaign' && (
                    <div className="space-y-5 text-center">
                      <div className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                        Exclusive Announcement
                      </div>
                      <h2 className="text-3xl font-serif font-normal text-stone-950 leading-tight">
                        {templateDrafts.campaign.headline}
                      </h2>
                      <p className="text-xs text-stone-500 font-serif italic max-w-sm mx-auto">
                        {templateDrafts.campaign.subhead}
                      </p>
                      <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line text-left bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/70">
                        {templateDrafts.campaign.body}
                      </div>
                      <button className="px-8 py-3.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-stone-800">
                        {templateDrafts.campaign.buttonText}
                      </button>
                    </div>
                  )}

                  {/* FORM PREVIEW */}
                  {activeProductMode === 'form' && (
                    <div className="space-y-5 text-center">
                      <div className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
                        Newsletter Opt-in Form
                      </div>
                      <h2 className="text-2xl font-serif font-normal text-stone-950 leading-tight">
                        {templateDrafts.form.headline}
                      </h2>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        {templateDrafts.form.body}
                      </p>
                      
                      {/* Real Interactive Form Input Fields */}
                      <div className="space-y-3 pt-2 text-left">
                        {templateDrafts.form.formFields.map(field => (
                          <div key={field.id}>
                            <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                              {field.label} {field.required && '*'}
                            </label>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              disabled
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs text-stone-700"
                            />
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-3.5 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                        {templateDrafts.form.buttonText}
                      </button>
                    </div>
                  )}

                  {/* WORKFLOW PREVIEW */}
                  {activeProductMode === 'workflow' && (
                    <div className="space-y-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase">
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Automation Sequence: Email #1</span>
                      </div>
                      <h2 className="text-2xl font-serif font-normal text-stone-950 leading-tight">
                        {templateDrafts.workflow.headline}
                      </h2>
                      <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line text-left bg-stone-50 p-5 rounded-2xl border border-stone-200/80 font-mono text-[11px]">
                        {templateDrafts.workflow.body}
                      </div>
                      <button className="px-8 py-3.5 rounded-full bg-stone-950 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                        {templateDrafts.workflow.buttonText}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-stone-100 pt-4 text-center text-[10px] text-stone-400">
                    Unsubscribe • Powered by Flodesk-Style Clean Architecture
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
