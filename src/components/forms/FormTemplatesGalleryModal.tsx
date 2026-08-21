import React, { useState } from 'react';
import { FormItem } from '../../types';
import { FormTemplatePreset, PREBUILT_FORM_TEMPLATES } from '../../data/formTemplates';
import { 
  X, 
  Search, 
  Sparkles, 
  Layers, 
  Link2, 
  Layout, 
  FileText, 
  Video, 
  Disc, 
  Clock, 
  ArrowRight, 
  Eye, 
  Check, 
  Plus,
  Compass,
  Play,
  Flame,
  Download,
  Gift,
  ExternalLink,
  Quote
} from 'lucide-react';

interface FormTemplatesGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FormTemplatePreset | null) => void;
  savedForms?: FormItem[];
  onOpenSavedForm?: (form: FormItem) => void;
}

export const FormTemplatesGalleryModal: React.FC<FormTemplatesGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  savedForms = [],
  onOpenSavedForm
}) => {
  const [topTab, setTopTab] = useState<'templates' | 'saved'>('templates');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Browse all', icon: Compass, count: PREBUILT_FORM_TEMPLATES.length },
    { id: 'link_in_bio', label: 'Link in bio', icon: Link2, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'link_in_bio').length },
    { id: 'popup', label: 'Popup', icon: Layout, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'popup').length },
    { id: 'inline', label: 'Inline', icon: FileText, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'inline').length },
    { id: 'full_page', label: 'Full page', icon: Layers, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'full_page').length },
    { id: 'video', label: 'Video', icon: Video, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'video').length },
    { id: 'spinner', label: 'Spinner', icon: Disc, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'spinner').length },
    { id: 'countdown', label: 'Countdown', icon: Clock, count: PREBUILT_FORM_TEMPLATES.filter(t => t.formType === 'countdown').length },
  ];

  const filteredTemplates = PREBUILT_FORM_TEMPLATES.filter(t => {
    const matchesType = selectedType === 'all' || t.formType === selectedType;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.headline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredSavedForms = savedForms.filter(f => {
    const titleMatch = (f.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const slugMatch = (f.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = (f.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || slugMatch || catMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-7xl h-[92vh] bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-4 sm:py-5 bg-white border-b border-stone-200 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                  {topTab === 'templates' ? 'Form Templates Gallery' : 'My Saved Forms'}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                  Flodesk Edition
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {topTab === 'templates'
                  ? 'Choose a prebuilt aesthetic template or start from blank. Segment selection is mandatory.'
                  : 'Select an existing form to edit, preview, or manage without leaving your current workspace.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Main Segmented Switcher: Templates vs My Forms */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setTopTab('templates')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  topTab === 'templates'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Template Library</span>
              </button>
              <button
                onClick={() => setTopTab('saved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  topTab === 'saved'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Saved Forms ({savedForms.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={topTab === 'templates' ? 'Search templates...' : 'Search my forms...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 text-stone-900"
              />
            </div>

            <button
              onClick={onClose}
              title="Return to Main Forms Dashboard"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200 cursor-pointer"
            >
              <span>Back to Hub</span>
              <X className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Gallery Content with Left Navigation and Main Grid */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Category Sidebar */}
          <aside className="w-64 bg-white border-r border-stone-200 p-5 flex flex-col gap-1 overflow-y-auto shrink-0 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-2">
              Form Types
            </span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedType(cat.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}

            <div className="my-4 border-t border-stone-100" />

            {/* Start from scratch button */}
            <button
              onClick={() => onSelectTemplate(null)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-stone-300 hover:border-stone-900 bg-stone-50 hover:bg-white text-stone-800 text-xs font-semibold transition-all group"
            >
              <Plus className="w-4 h-4 text-stone-500 group-hover:text-stone-900" />
              <span>Start from scratch</span>
            </button>
          </aside>

          {/* Main Grid View */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-stone-100/60">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Start from Scratch Card (Only when on templates tab) */}
              {topTab === 'templates' && (
                <div 
                  onClick={() => onSelectTemplate(null)}
                  className="group relative rounded-3xl bg-white border-2 border-dashed border-stone-300 hover:border-stone-900 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-xl min-h-[380px]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-stone-900 text-stone-600 group-hover:text-white flex items-center justify-center transition-all mb-4 shadow-xs">
                    <Plus className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 tracking-tight">
                    Start from scratch
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-[220px]">
                    Build a completely bespoke form with blank canvas, custom fonts, palettes, and input fields.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 bg-stone-100 group-hover:bg-stone-900 group-hover:text-white px-4 py-2 rounded-xl transition-all">
                    <span>Create Blank Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}

              {/* Prebuilt Templates Cards vs My Saved Forms Cards */}
              {topTab === 'templates' ? (
                filteredTemplates.map((template) => {
                const isHovered = hoveredTemplateId === template.id;
                
                return (
                  <div
                    key={template.id}
                    onMouseEnter={() => setHoveredTemplateId(template.id)}
                    onMouseLeave={() => setHoveredTemplateId(null)}
                    className="group relative rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col text-left"
                  >
                    {/* Visual Card Canvas Preview - Renders Distinct Form Archetypes */}
                    <div className={`relative h-72 bg-gradient-to-br ${template.thumbnailColor} p-4 flex flex-col justify-between overflow-hidden border-b border-stone-100`}>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-stone-900 shadow-xs border border-stone-200/60 flex items-center gap-1">
                            {template.formType === 'countdown' && <Clock className="w-2.5 h-2.5 text-amber-600" />}
                            {template.formType === 'spinner' && <Disc className="w-2.5 h-2.5 text-indigo-600" />}
                            {template.formType === 'video' && <Play className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />}
                            {template.formType === 'link_in_bio' && <Link2 className="w-2.5 h-2.5 text-stone-600" />}
                            {template.formType === 'popup' && <Layout className="w-2.5 h-2.5 text-purple-600" />}
                            {template.layoutMode ? '2-Column Split' : template.formType.replace(/_/g, ' ')}
                          </span>
                          {template.category && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-stone-900/10 text-stone-800">
                              {template.category}
                            </span>
                          )}
                        </div>

                        {template.monogram && (
                          <span className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-serif font-bold flex items-center justify-center border border-stone-300 shadow-xs">
                            {template.monogram}
                          </span>
                        )}
                      </div>

                      {/* AUTHENTIC TEMPLATE CANVAS PREVIEW ACCORDING TO ARCHETYPE */}
                      <div className="relative my-auto w-full max-w-[290px] mx-auto transition-transform group-hover:scale-[1.02] duration-200">

                        {/* ARCHETYPE A: TWO-COLUMN SPLIT (Flodesk Signature 2-Column with Media & Live Countdown) */}
                        {template.layoutMode ? (
                          <div 
                            className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-stone-200/80 flex items-stretch gap-2.5 overflow-hidden"
                            style={{ backgroundColor: template.cardBgColor || '#FFFFFF' }}
                          >
                            {/* Left Column (or right if split_left) */}
                            <div className={`flex-1 flex flex-col justify-between py-1 text-left min-w-0 ${template.layoutMode === 'split_left' ? 'order-2' : 'order-1'}`}>
                              <div>
                                {template.badgeText && (
                                  <span className="text-[7px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 inline-block mb-1 border border-stone-200">
                                    {template.badgeText}
                                  </span>
                                )}
                                <h4 className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                                  {template.headline}
                                </h4>
                                <p className="text-[8px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                                  {template.subtitle}
                                </p>

                                {/* Mini Live Countdown Clocks if Countdown */}
                                {template.showCountdown && (
                                  <div className="flex items-center gap-1 my-1.5 py-1 px-1.5 rounded-lg bg-stone-50 border border-stone-200/80">
                                    {[
                                      { num: template.countdownDays ?? '10', lbl: 'D' },
                                      { num: template.countdownHours ?? '23', lbl: 'H' },
                                      { num: template.countdownMinutes ?? '18', lbl: 'M' }
                                    ].map((c, ci) => (
                                      <div key={ci} className="flex-1 text-center">
                                        <span className="block text-[9px] font-black text-stone-900 leading-none">{c.num}</span>
                                        <span className="text-[6px] text-stone-400 font-bold uppercase">{c.lbl}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Bullet Preview */}
                                {template.showBulletPoints && template.bulletPoints && (
                                  <div className="space-y-0.5 my-1">
                                    {template.bulletPoints.slice(0, 2).map((pt, pti) => (
                                      <div key={pti} className="flex items-center gap-1 text-[7px] text-stone-600 truncate">
                                        <Check className="w-2 h-2 text-emerald-600 shrink-0" />
                                        <span className="truncate">{pt}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Mini Input & Button */}
                              <div className="space-y-1 mt-1.5">
                                <div className="h-5 rounded border border-stone-300 bg-stone-50 px-1.5 flex items-center text-[7px] text-stone-400">
                                  {template.fields[0]?.placeholder || 'Your email...'}
                                </div>
                                <div 
                                  className="h-5 rounded flex items-center justify-center text-[7.5px] font-bold text-white shadow-xs"
                                  style={{ backgroundColor: template.buttonBgColor || template.accentColor }}
                                >
                                  {template.submitButtonText}
                                </div>
                              </div>
                            </div>

                            {/* Split Media Column */}
                            <div className={`w-24 shrink-0 rounded-xl overflow-hidden relative shadow-xs ${template.layoutMode === 'split_left' ? 'order-1' : 'order-2'}`}>
                              <img 
                                src={template.previewImage} 
                                alt={template.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>
                          </div>

                        ) : template.formType === 'countdown' ? (
                          /* ARCHETYPE B: COUNTDOWN BANNER / FULL SCREEN TIMER */
                          <div 
                            className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-stone-200/80 text-center"
                            style={{ backgroundColor: template.cardBgColor || '#FFFFFF' }}
                          >
                            {template.badgeText && (
                              <span className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 inline-block mb-1.5">
                                ⏳ {template.badgeText}
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-stone-900 leading-tight">
                              {template.headline}
                            </h4>
                            <p className="text-[9px] text-stone-500 truncate max-w-[200px] mx-auto mt-0.5">
                              {template.subtitle}
                            </p>

                            {/* Prominent Digit Counter Display */}
                            <div className="grid grid-cols-4 gap-1.5 my-2.5 px-2">
                              {[
                                { n: '05', l: 'DAYS' },
                                { n: '18', l: 'HOURS' },
                                { n: '42', l: 'MINS' },
                                { n: '09', l: 'SECS' }
                              ].map((b, bi) => (
                                <div key={bi} className="bg-stone-900 text-white rounded-lg py-1 px-0.5 text-center shadow-xs">
                                  <span className="text-xs font-black block leading-tight">{b.n}</span>
                                  <span className="text-[6px] text-stone-400 font-semibold">{b.l}</span>
                                </div>
                              ))}
                            </div>

                            <div 
                              className="h-6 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white shadow-xs mx-1"
                              style={{ backgroundColor: template.accentColor }}
                            >
                              {template.submitButtonText}
                            </div>
                          </div>

                        ) : template.formType === 'link_in_bio' ? (
                          /* ARCHETYPE C: FLODESK LINK IN BIO WITH CURATED BUTTONS */
                          <div 
                            className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-stone-200/80 text-center"
                            style={{ backgroundColor: template.cardBgColor || '#FFFFFF' }}
                          >
                            {/* Profile Thumbnail & Headline */}
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {template.previewImage && (
                                <img 
                                  src={template.previewImage} 
                                  alt="bio" 
                                  className={`w-7 h-7 object-cover shadow-xs border border-stone-200 ${
                                    template.frameShape === 'arch' ? 'rounded-t-full rounded-b-md' : 'rounded-full'
                                  }`} 
                                />
                              )}
                              <div className="text-left">
                                <h4 className="text-[11px] font-bold text-stone-900 leading-none truncate max-w-[150px]">
                                  {template.headline}
                                </h4>
                                <span className="text-[7.5px] text-stone-500 truncate block max-w-[150px] mt-0.5">
                                  {template.subtitle}
                                </span>
                              </div>
                            </div>

                            {/* Curated Links Stack Preview */}
                            <div className="space-y-1 my-2">
                              {(template.links?.slice(0, 2) || [
                                { title: 'Download Free Editorial Guide', highlighted: true },
                                { title: 'Shop Botanical Collection', highlighted: false }
                              ]).map((link, lkIdx) => (
                                <div 
                                  key={lkIdx}
                                  className={`py-1.5 px-2.5 rounded-xl text-[8px] font-bold flex items-center justify-between shadow-2xs border ${
                                    link.highlighted 
                                      ? 'bg-stone-900 text-white border-stone-800' 
                                      : 'bg-stone-50 text-stone-800 border-stone-200'
                                  }`}
                                >
                                  <span className="truncate">{link.title}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0 ml-1" />
                                </div>
                              ))}
                            </div>

                            <div 
                              className="h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: template.accentColor }}
                            >
                              {template.submitButtonText}
                            </div>
                          </div>

                        ) : template.formType === 'video' ? (
                          /* ARCHETYPE D: VIDEO STORY / EPISODIC LEAD CAPTURE */
                          <div className="w-full bg-stone-950 rounded-2xl p-2 shadow-lg border border-stone-800 text-white overflow-hidden relative">
                            <div className="relative h-24 rounded-xl overflow-hidden">
                              <img 
                                src={template.previewImage} 
                                alt={template.name} 
                                className="w-full h-full object-cover opacity-75"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white/90 text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                  <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                                </div>
                              </div>
                              <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[7.5px] font-mono text-amber-400">
                                ▶ 4:28 EPISODE
                              </span>
                            </div>
                            
                            <div className="pt-2 text-center">
                              <h4 className="text-[11px] font-bold text-white leading-tight truncate">
                                {template.headline}
                              </h4>
                              <div 
                                className="mt-2 h-5 rounded-lg flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: template.accentColor }}
                              >
                                {template.submitButtonText}
                              </div>
                            </div>
                          </div>

                        ) : template.formType === 'spinner' ? (
                          /* ARCHETYPE E: GAMIFIED LUCKY WHEEL / SPINNER */
                          <div className="w-full bg-gradient-to-b from-indigo-950 to-stone-900 rounded-2xl p-3 shadow-lg border border-indigo-500/30 text-white text-center">
                            <div className="flex items-center justify-center gap-3 py-1">
                              <div className="relative w-14 h-14 rounded-full border-2 border-amber-400 bg-indigo-900/80 flex items-center justify-center shadow-inner group-hover:rotate-45 transition-transform duration-700">
                                <Disc className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Gift className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                              <div className="text-left">
                                <span className="text-[7.5px] font-bold text-amber-400 uppercase tracking-widest block">SPIN & WIN</span>
                                <h4 className="text-[11px] font-bold text-white leading-tight">{template.headline}</h4>
                                <span className="text-[7.5px] text-stone-300 block mt-0.5">Win up to 30% discount</span>
                              </div>
                            </div>
                            <div 
                              className="mt-2 h-5 rounded-full flex items-center justify-center text-[8px] font-extrabold text-stone-950 bg-amber-400 shadow-xs"
                            >
                              SPIN THE WHEEL NOW
                            </div>
                          </div>

                        ) : template.formType === 'inline' ? (
                          /* ARCHETYPE F: INLINE EMBEDDED STRIP / HORIZONTAL BAR */
                          <div className="w-full bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-stone-300 text-left">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400">EMBEDDED STRIP</span>
                              <span className="text-[8px] text-emerald-600 font-semibold flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> 1-Click Subscribe
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-stone-900">{template.headline}</h4>
                            <p className="text-[8.5px] text-stone-500 truncate mb-2">{template.subtitle}</p>
                            
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-6 rounded-lg bg-stone-50 border border-stone-300 px-2 flex items-center text-[8px] text-stone-400">
                                email@domain.com
                              </div>
                              <div 
                                className="h-6 px-3 rounded-lg flex items-center justify-center text-[8px] font-bold text-white shadow-xs shrink-0"
                                style={{ backgroundColor: template.accentColor }}
                              >
                                {template.submitButtonText}
                              </div>
                            </div>
                          </div>

                        ) : (
                          /* ARCHETYPE G: POPUP & FULL PAGE EDITORIAL FORM */
                          <div 
                            className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-stone-200/80 text-center"
                            style={{ backgroundColor: template.cardBgColor || '#FFFFFF' }}
                          >
                            {/* Monogram or Script Overlay */}
                            {template.scriptOverlay && (
                              <span className="text-[10px] italic font-serif text-stone-600 block">
                                {template.scriptOverlay}
                              </span>
                            )}
                            
                            <div className="flex items-center justify-center gap-2 my-1">
                              {template.previewImage && (
                                <img 
                                  src={template.previewImage} 
                                  alt="preview" 
                                  className={`w-9 h-9 object-cover border border-stone-200 shadow-xs ${
                                    template.frameShape === 'arch' ? 'rounded-t-full rounded-b-md' :
                                    template.frameShape === 'scalloped' ? 'rounded-2xl' : 'rounded-lg'
                                  }`} 
                                />
                              )}
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-stone-900 leading-tight line-clamp-1 max-w-[140px]">
                                  {template.headline}
                                </h4>
                                <p className="text-[8px] text-stone-500 line-clamp-1 max-w-[140px] mt-0.5">
                                  {template.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Mock Input Fields */}
                            <div className="space-y-1 my-1.5">
                              {template.fields.slice(0, 2).map((f, fi) => (
                                <div key={fi} className="h-4.5 rounded-lg border border-stone-200 bg-stone-50/80 px-2 flex items-center text-[7.5px] text-stone-400">
                                  {f.placeholder || f.label}
                                </div>
                              ))}
                            </div>

                            {/* Submit Button */}
                            <div 
                              className={`h-5.5 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white shadow-xs ${
                                template.buttonShape === 'sharp' ? 'rounded-none' : 'rounded-full'
                              }`}
                              style={{ backgroundColor: template.buttonBgColor || template.accentColor }}
                            >
                              {template.submitButtonText}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Bottom Info Tag */}
                      <div className="flex items-center justify-between text-[9.5px] font-medium text-stone-600 z-10 px-1 bg-white/70 backdrop-blur-xs py-1 rounded-lg border border-stone-200/50">
                        <span className="flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-stone-400" />
                          {template.fields.length} input {template.fields.length === 1 ? 'field' : 'fields'}
                        </span>
                        {template.links && (
                          <span className="flex items-center gap-1 text-stone-500">
                            <Layers className="w-2.5 h-2.5 text-stone-400" />
                            {template.links.length} links
                          </span>
                        )}
                        {template.showCountdown && (
                          <span className="text-amber-700 font-bold flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> Timer
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay with Customize Button */}
                      <div className={`absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 p-6 transition-opacity duration-200 z-20 ${
                        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}>
                        <button
                          type="button"
                          onClick={() => onSelectTemplate(template)}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
                        >
                          <span>Use This Template</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] text-white/90 font-medium">
                          Click to customize styling & segment
                        </span>
                      </div>
                    </div>

                    {/* Card Meta Footer */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                            {template.name}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400 font-medium">
                          Theme: <span className="capitalize text-stone-700 font-semibold">{template.paletteTheme}</span>
                        </span>
                        <button
                          onClick={() => onSelectTemplate(template)}
                          className="text-xs font-semibold text-stone-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Use Form</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* MY SAVED FORMS VIEW */
              filteredSavedForms.length > 0 ? (
                filteredSavedForms.map((savedForm) => (
                  <div
                    key={savedForm.id}
                    className="group relative rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col text-left"
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between bg-white space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {savedForm.status || 'Published'}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {savedForm.createdAt || 'Active'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-stone-900 tracking-tight mt-2.5 group-hover:text-blue-600 transition-colors">
                          {savedForm.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {savedForm.headline || savedForm.description}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-600">
                          <span className="px-2 py-0.5 bg-stone-100 rounded-md font-medium capitalize">
                            {(savedForm.formType || 'inline').replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 bg-stone-100 rounded-md font-medium">
                            {(savedForm.fields || []).length} fields
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-stone-500">
                          <span className="font-bold text-stone-900">{savedForm.submissionsCount || 0}</span> submissions
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenSavedForm) {
                              onOpenSavedForm(savedForm);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Open in Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200/80 p-8">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-900">No saved forms found</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You haven't created any custom forms yet or none match your search query. Pick a template to get started!
                  </p>
                  <button
                    onClick={() => setTopTab('templates')}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Browse Templates
                  </button>
                </div>
              )
            )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
