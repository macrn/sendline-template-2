import React, { useState } from 'react';
import { UniversalTemplate, BrandKit, SubscriberSegment, ForkedDocument } from './unifiedTypes';
import { UNIFIED_TEMPLATES, DEFAULT_BRAND_KITS, DEFAULT_SEGMENTS } from './unifiedData';
import { UniversalDocumentEditor } from './UniversalDocumentEditor';
import { UnifiedTemplateGallery } from './UnifiedTemplateGallery';
import { UnifiedFormWorkflowSimulator } from './UnifiedFormWorkflowSimulator';
import { UnifiedArchitectureViewer } from './UnifiedArchitectureViewer';
import { 
  Sparkles, 
  Layers, 
  FileEdit, 
  Send, 
  Workflow, 
  Cpu, 
  Palette, 
  Plus, 
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface UnifiedTemplateStudioProps {
  onNavigateToCampaigns?: () => void;
  onNavigateToForms?: () => void;
  onNavigateToWorkflows?: () => void;
}

export const UnifiedTemplateStudio: React.FC<UnifiedTemplateStudioProps> = ({
  onNavigateToCampaigns,
  onNavigateToForms,
  onNavigateToWorkflows
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'gallery' | 'simulator' | 'architecture'>('editor');
  const [templates, setTemplates] = useState<UniversalTemplate[]>(UNIFIED_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<UniversalTemplate>(UNIFIED_TEMPLATES[0]);
  const [brandKits, setBrandKits] = useState<BrandKit[]>(DEFAULT_BRAND_KITS);
  const [activeBrandKit, setActiveBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KITS[0]);
  const [segments, setSegments] = useState<SubscriberSegment[]>(DEFAULT_SEGMENTS);
  const [forkedDocuments, setForkedDocuments] = useState<ForkedDocument[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler for forking a document
  const handleForkDocument = (doc: ForkedDocument) => {
    setForkedDocuments(prev => [doc, ...prev]);
    showToast(`✓ Document "${doc.name}" created and saved to active assets!`);
  };

  // Handler for dispatching broadcast
  const handleSendBroadcast = (template: UniversalTemplate, segmentIds: string[], scheduledTime?: string) => {
    const targetSegments = segments.filter(s => segmentIds.includes(s.id));
    const totalCount = targetSegments.reduce((acc, s) => acc + s.count, 0);
    showToast(`🚀 Dispatched "${template.name}" to ${totalCount.toLocaleString()} subscribers!`);
  };

  // Handle template selection from gallery to editor
  const handleSelectTemplateForEditing = (tmpl: UniversalTemplate) => {
    setSelectedTemplate(tmpl);
    const matchedKit = brandKits.find(k => k.id === tmpl.brandKitId) || activeBrandKit;
    setActiveBrandKit(matchedKit);
    setActiveTab('editor');
    showToast(`Loaded "${tmpl.name}" into One-Screen Editor`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-stone-100 flex flex-col font-sans antialiased">
      
      {/* Studio Top Master Navigation Bar */}
      <div className="bg-[#12161E] border-b border-stone-800 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-base tracking-tight">
                Unified Template Studio
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/60">
                1 Screen • All Channels
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              One shared JSON schema powering Campaigns, Forms, Automations & Checkout.
            </p>
          </div>
        </div>

        {/* Center: Major View Switcher Tabs */}
        <div className="flex items-center bg-[#0D1117] p-1 rounded-xl border border-stone-800 shadow-inner">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>One-Screen Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Templates & Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Form & Workflow Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Schema</span>
          </button>
        </div>

        {/* Right: Forked Documents Count Indicator */}
        <div className="flex items-center gap-2">
          {forkedDocuments.length > 0 && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800 flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{forkedDocuments.length} Forked Assets</span>
            </span>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'editor' && (
          <UniversalDocumentEditor
            template={selectedTemplate}
            brandKit={activeBrandKit}
            allBrandKits={brandKits}
            onBrandKitChange={setActiveBrandKit}
            onForkDocument={handleForkDocument}
          />
        )}

        {activeTab === 'gallery' && (
          <UnifiedTemplateGallery
            templates={templates}
            segments={segments}
            brandKit={activeBrandKit}
            onSelectTemplate={handleSelectTemplateForEditing}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {activeTab === 'simulator' && (
          <UnifiedFormWorkflowSimulator
            template={selectedTemplate}
            brandKit={activeBrandKit}
          />
        )}

        {activeTab === 'architecture' && (
          <UnifiedArchitectureViewer />
        )}
      </div>

    </div>
  );
};
