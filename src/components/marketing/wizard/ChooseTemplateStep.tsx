import React, { useState } from 'react';
import { EmailTemplate } from '../../../types';
import { INITIAL_TEMPLATES } from '../../../data/mockData';
import { Sparkles, Search, Plus, Check, Eye, LayoutGrid } from 'lucide-react';
import { TemplatePreviewCard } from './TemplatePreviewCard';

interface ChooseTemplateStepProps {
  selectedTemplate: EmailTemplate;
  onSelectTemplate: (template: EmailTemplate) => void;
  onProceedToDesign: () => void;
  onClose: () => void;
}

export const ChooseTemplateStep: React.FC<ChooseTemplateStepProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onProceedToDesign,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Editorial',
    'Product Launch',
    'E-commerce',
    'VIP Rewards',
    'Newsletter',
    'Welcome Flow'
  ];

  const filteredTemplates = INITIAL_TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePickAndContinue = (tmpl: EmailTemplate) => {
    onSelectTemplate(tmpl);
    onProceedToDesign();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0E121A] text-stone-100 p-4 sm:p-8 flex flex-col items-center">
      
      {/* Header & Intro */}
      <div className="w-full max-w-6xl mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Step 1 • Template Library</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Choose a starting template
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Select an editorial layout crafted for high conversion and refined typographic aesthetics, or start with your current design.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="w-full max-w-6xl flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-stone-950 shadow-md'
                : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTemplates.map(tmpl => {
          const isSelected = selectedTemplate?.id === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`group relative rounded-3xl bg-[#141923] border transition-all duration-300 flex flex-col overflow-hidden hover:border-white/30 hover:shadow-2xl ${
                isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10'
              }`}
            >
              {/* Card Thumbnail / Preview */}
              <div className="relative p-4 bg-[#0B0F17]/80 flex items-center justify-center min-h-[300px]">
                <TemplatePreviewCard template={tmpl} maxHeight="max-h-[280px]" />
                
                {/* Floating Select Action Overlay on Hover */}
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-6">
                  <button
                    onClick={() => handlePickAndContinue(tmpl)}
                    className="w-full py-3 rounded-2xl bg-white text-stone-950 font-bold text-xs shadow-xl hover:bg-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Customize in Editor</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTemplate(tmpl);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                  >
                    {isSelected ? '✓ Currently Selected' : 'Set as Current'}
                  </button>
                </div>
              </div>

              {/* Template Info & Metadata */}
              <div className="p-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-stone-400 truncate max-w-[200px] mt-0.5">
                    {tmpl.subject}
                  </p>
                </div>

                <button
                  onClick={() => handlePickAndContinue(tmpl)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 group-hover:bg-emerald-500 group-hover:text-stone-950 text-stone-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  Use →
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
