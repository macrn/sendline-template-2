import React, { useState } from 'react';
import { AudienceSegment } from '../../types';
import { 
  X, 
  Search, 
  Users, 
  Plus, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Tag
} from 'lucide-react';

interface FormSegmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSegments: string[]) => void;
  availableSegments: AudienceSegment[];
  initialSelected?: string[];
  templateName?: string;
}

export const FormSegmentSelectionModal: React.FC<FormSegmentSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  availableSegments,
  initialSelected = [],
  templateName = 'Form'
}) => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSegmentInput, setCustomSegmentInput] = useState('');
  const [showCreateInline, setShowCreateInline] = useState(false);
  const [allSegments, setAllSegments] = useState<AudienceSegment[]>(availableSegments);
  const [errorWarning, setErrorWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredSegments = allSegments.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSegment = (segmentName: string) => {
    setErrorWarning(null);
    if (selectedSegments.includes(segmentName)) {
      setSelectedSegments(selectedSegments.filter(name => name !== segmentName));
    } else {
      setSelectedSegments([...selectedSegments, segmentName]);
    }
  };

  const handleCreateCustomSegment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = customSegmentInput.trim();
    if (!cleanName) return;

    if (!selectedSegments.includes(cleanName)) {
      const newSegment: AudienceSegment = {
        id: 'seg-' + Date.now(),
        name: cleanName,
        description: `Subscribers captured via ${templateName}`,
        filterRules: [`Source = Form: ${templateName}`],
        subscriberCount: 0,
        averageOpenRate: 0,
        growthRate: 'New',
        color: '#10b981',
        isDynamic: false,
        createdAt: 'Just now'
      };

      setAllSegments([newSegment, ...allSegments]);
      setSelectedSegments([...selectedSegments, cleanName]);
    }
    setCustomSegmentInput('');
    setShowCreateInline(false);
    setErrorWarning(null);
  };

  const handleContinue = () => {
    if (selectedSegments.length === 0) {
      setErrorWarning('Segment selection is mandatory before customizing. Please choose or create at least one segment.');
      return;
    }
    onConfirm(selectedSegments);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 rounded-md">
                Mandatory Step
              </span>
              <span className="text-xs text-stone-600 font-medium">1 of 2</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Choose a segment
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-md leading-relaxed">
              Subscribers who opt-in to this form will automatically be added to the segment(s) you choose or create below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-600 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
          {/* Error Banner if user tries to bypass */}
          {errorWarning && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorWarning}</span>
            </div>
          )}

          {/* Active Selected Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
              Selected Segments ({selectedSegments.length})
            </label>
            {selectedSegments.length === 0 ? (
              <div className="p-3.5 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 text-center text-xs text-stone-600">
                No segments selected yet. Click any segment below or create a new one.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 min-h-[44px] items-center">
                {selectedSegments.map(name => (
                  <span 
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 text-white text-xs font-medium shadow-xs animate-scaleIn"
                  >
                    <Tag className="w-3 h-3 text-stone-300" />
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => toggleSegment(name)}
                      className="text-stone-300 hover:text-white ml-0.5 p-0.5 rounded-full hover:bg-stone-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search Box & Quick Create */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Audience Segments List
              </label>
              <button
                type="button"
                onClick={() => setShowCreateInline(!showCreateInline)}
                className="text-xs text-stone-900 hover:text-stone-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-stone-700" />
                <span>Create new segment</span>
              </button>
            </div>

            {/* Quick Inline Segment Creator */}
            {showCreateInline && (
              <form onSubmit={handleCreateCustomSegment} className="flex gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200 animate-slideDown">
                <input
                  type="text"
                  placeholder="Enter new segment name (e.g. Autumn 2026 Leads)"
                  value={customSegmentInput}
                  onChange={(e) => setCustomSegmentInput(e.target.value)}
                  autoFocus
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                />
                <button
                  type="submit"
                  disabled={!customSegmentInput.trim()}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg shrink-0 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateInline(false)}
                  className="px-2 py-1.5 text-stone-600 hover:text-stone-700 text-xs rounded-lg"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search existing audience segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 text-stone-900"
              />
            </div>
          </div>

          {/* Segments Selection List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredSegments.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-600">
                No segments found matching "{searchQuery}".
              </div>
            ) : (
              filteredSegments.map(segment => {
                const isSelected = selectedSegments.includes(segment.name);
                return (
                  <div
                    key={segment.id}
                    onClick={() => toggleSegment(segment.name)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        isSelected 
                          ? 'bg-white text-stone-900 border-white' 
                          : 'border-stone-300 bg-stone-50'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                            {segment.name}
                          </span>
                          {segment.subscriberCount !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'
                            }`}>
                              {segment.subscriberCount.toLocaleString()} subs
                            </span>
                          )}
                        </div>
                        {segment.description && (
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                            {segment.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block`} style={{ backgroundColor: segment.color || '#10b981' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-5 bg-stone-50 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              selectedSegments.length > 0
                ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>Save & Customize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
