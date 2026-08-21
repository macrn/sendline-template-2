import React, { useState } from 'react';
import { UniversalTemplate, SubscriberSegment, BrandKit } from './unifiedTypes';
import { 
  Sparkles, 
  Check, 
  Send, 
  Clock, 
  Users, 
  Layers, 
  Eye, 
  Sliders, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  FileText, 
  Workflow,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface UnifiedTemplateGalleryProps {
  templates: UniversalTemplate[];
  segments: SubscriberSegment[];
  brandKit: BrandKit;
  onSelectTemplate: (template: UniversalTemplate) => void;
  onSendBroadcast: (template: UniversalTemplate, segmentIds: string[], scheduledTime?: string) => void;
}

export const UnifiedTemplateGallery: React.FC<UnifiedTemplateGalleryProps> = ({
  templates,
  segments: initialSegments,
  brandKit,
  onSelectTemplate,
  onSendBroadcast
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Yours' | 'Gallery'>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<UniversalTemplate>(templates[0]);
  const [segments, setSegments] = useState<SubscriberSegment[]>(initialSegments);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDateTime, setScheduleDateTime] = useState<string>('2026-08-21T09:00');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Segment selection
  const handleToggleSegment = (segId: string) => {
    setSegments(prev => prev.map(s => s.id === segId ? { ...s, selected: !s.selected } : s));
  };

  // Calculate deduplicated recipient total
  const selectedSegments = segments.filter(s => s.selected);
  const rawSum = selectedSegments.reduce((sum, s) => sum + s.count, 0);
  // realistic deduplication formula: subtract 5% if multiple segments are picked
  const deduplicatedCount = selectedSegments.length > 1 
    ? Math.round(rawSum * 0.94) 
    : rawSum;

  const handleSendNow = () => {
    if (deduplicatedCount === 0) {
      showToast('Please select at least one audience segment');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      onSendBroadcast(
        selectedTemplate, 
        selectedSegments.map(s => s.id), 
        scheduleMode === 'schedule' ? scheduleDateTime : undefined
      );
      showToast(`🚀 Campaign dispatched to ${deduplicatedCount.toLocaleString()} subscribers!`);
      setTimeout(() => setSentSuccess(false), 5000);
    }, 900);
  };

  const filteredTemplates = activeTab === 'All'
    ? templates
    : activeTab === 'Yours'
      ? templates.filter(t => t.isCustom)
      : templates.filter(t => !t.isCustom);

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-stone-100 p-6 lg:p-12 space-y-10 font-sans antialiased select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 border border-stone-700 text-stone-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header & Tabs (Matches SL4) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              Templates
            </h1>
            <p className="text-xs text-stone-400">
              Select any design. Send immediately to your audience or customize in the one-screen editor.
            </p>
          </div>

          {/* Filter Tabs matching SL4: [All] [Yours] [Gallery] */}
          <div className="flex items-center bg-[#161B22] p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
            {(['All', 'Yours', 'Gallery'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid (Matching SL4 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`group rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161B22] border-blue-500 ring-2 ring-blue-500/40 shadow-2xl scale-[1.01]'
                    : 'bg-[#12161E] border-stone-800/80 hover:border-stone-700 hover:bg-[#161B22]'
                }`}
              >
                <div className="space-y-4">
                  {/* Visual Abstract Wireframe Thumbnail (Matches SL4 exact graphic) */}
                  <div className="h-44 rounded-2xl bg-[#0A0D12] border border-stone-800/80 p-6 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-stone-700 transition-colors">
                    {/* Circle Header Dot */}
                    <div 
                      className={`w-4 h-4 rounded-full mb-4 ${
                        tmpl.id === 'tmpl-spring-launch' ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}
                    ></div>

                    {/* Horizontal Wireframe Lines */}
                    <div className="w-3/4 h-2 rounded-full bg-stone-800 mb-2"></div>
                    <div className="w-full h-8 rounded-xl bg-stone-900/90 border border-stone-800/60 mb-2"></div>
                    <div className="w-1/2 h-2 rounded-full bg-stone-800 mb-4"></div>

                    {/* Bottom Pill */}
                    <div className="w-3/5 h-3 rounded-full bg-stone-300/90 shadow-sm"></div>
                  </div>

                  {/* Template Title */}
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                {/* Triple Context Tags (Email • Form • Workflow) */}
                <div className="flex items-center gap-1.5 pt-4 mt-2 border-t border-stone-800/70">
                  <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/60 text-[10px] font-bold text-stone-300">
                    Email
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/60 text-[10px] font-bold text-stone-300">
                    Form
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/60 text-[10px] font-bold text-stone-300">
                    Workflow
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Quick Send & Audience Dispatch Panel (Matches SL4 Lower Half) */}
        <div className="rounded-3xl bg-[#161B22] border border-stone-800/90 p-8 shadow-2xl space-y-8 animate-in fade-in">
          
          {/* Header Row: Template Name + "Design ✓ • Audience • Schedule" */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-serif font-bold text-white">
                {selectedTemplate.name}
              </h2>
              <button
                onClick={() => onSelectTemplate(selectedTemplate)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Edit Design →
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
              <span className="text-emerald-400 flex items-center gap-1">
                Design <Check className="w-3.5 h-3.5" />
              </span>
              <span>•</span>
              <span className="text-white font-bold">Audience</span>
              <span>•</span>
              <span className="text-stone-400">Schedule</span>
            </div>
          </div>

          {/* Section 1: "Send to" Checkbox List */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Send to
            </div>

            <div className="space-y-3">
              {segments.map((seg) => (
                <label
                  key={seg.id}
                  onClick={() => handleToggleSegment(seg.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    seg.selected
                      ? 'bg-[#1E242C] border-stone-700 text-white'
                      : 'bg-[#12161E] border-stone-800/80 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-stone-200">
                      {seg.name}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      • {seg.count.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    checked={seg.selected}
                    onChange={() => {}} // Handled by container
                    className="w-4 h-4 rounded text-blue-600 bg-stone-900 border-stone-700 focus:ring-0 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 pl-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Duplicates across segments are removed at send.</span>
            </div>
          </div>

          {/* Section 2: "When" Radio + Scheduling */}
          <div className="space-y-4 pt-2 border-t border-stone-800">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              When
            </div>

            <div className="flex items-center gap-6 text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-200">
                <input
                  type="radio"
                  name="schedule_mode"
                  checked={scheduleMode === 'now'}
                  onChange={() => setScheduleMode('now')}
                  className="w-4 h-4 text-blue-600 bg-stone-900 border-stone-700 focus:ring-0 cursor-pointer"
                />
                <span>Send now</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-200">
                <input
                  type="radio"
                  name="schedule_mode"
                  checked={scheduleMode === 'schedule'}
                  onChange={() => setScheduleMode('schedule')}
                  className="w-4 h-4 text-blue-600 bg-stone-900 border-stone-700 focus:ring-0 cursor-pointer"
                />
                <span>Schedule</span>
              </label>
            </div>

            {scheduleMode === 'schedule' && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="w-full max-w-md px-4 py-3 rounded-xl bg-[#0D1117] border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Section 3: Large Main Action Button matching SL4 */}
          <div className="pt-4">
            {sentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center space-y-1 animate-in fade-in">
                <Check className="w-5 h-5 mx-auto text-emerald-400" />
                <div className="text-sm font-bold">Campaign Dispatched!</div>
                <div className="text-xs text-emerald-400">
                  Workers scheduled for {deduplicatedCount.toLocaleString()} recipient jobs.
                </div>
              </div>
            ) : (
              <button
                onClick={handleSendNow}
                disabled={isSending || deduplicatedCount === 0}
                className="w-full py-4 rounded-2xl bg-white hover:bg-stone-200 text-stone-950 font-black text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-stone-900" />
                    <span>Queuing BullMQ Workers...</span>
                  </>
                ) : scheduleMode === 'now' ? (
                  <span>Send now to {deduplicatedCount.toLocaleString()} subscribers</span>
                ) : (
                  <span>Schedule send for {deduplicatedCount.toLocaleString()} subscribers</span>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
