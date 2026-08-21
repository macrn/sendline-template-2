import React, { useState } from 'react';
import { WORKFLOW_TEMPLATES_CATALOG } from '../../data/workflowData';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Zap, 
  FileText, 
  ShoppingBag, 
  Gift, 
  RefreshCw, 
  Check,
  Plus
} from 'lucide-react';

interface WorkflowTemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onStartFromScratch: () => void;
}

export const WorkflowTemplateGalleryModal: React.FC<WorkflowTemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onStartFromScratch
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Welcome Series', 'Lead Magnet Delivery', 'Post-Purchase', 'Loyalty & Rewards', 'Abandonment Recovery', 'Re-Engagement'];

  const filteredTemplates = selectedCategory === 'All'
    ? WORKFLOW_TEMPLATES_CATALOG
    : WORKFLOW_TEMPLATES_CATALOG.filter(t => t.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                Workflow Automation Recipes
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-stone-950 tracking-tight">
              Create New Automated Workflow
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Select a proven creator blueprint or build a custom automation from scratch.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Bar & Categories */}
        <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onStartFromScratch}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-extrabold flex items-center gap-2 border border-stone-300 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start with Blank Canvas</span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 text-left">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="p-5 rounded-2xl border-2 border-stone-200 hover:border-stone-950 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: template.accentColor }}
                  >
                    {getIcon(template.icon)}
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                    {template.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-stone-950 text-base tracking-tight mb-1 group-hover:text-indigo-900 transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-stone-600 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-stone-500 font-bold text-[11px]">
                  <span>{template.stepCount} Steps</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-extrabold">{template.estimatedOpenRate} Open Rate</span>
                </div>

                <div className="flex items-center gap-1 font-black text-stone-900 group-hover:translate-x-0.5 transition-transform text-xs">
                  <span>Use Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>All recipes include responsive mobile styling and condition branches.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-bold hover:bg-stone-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
