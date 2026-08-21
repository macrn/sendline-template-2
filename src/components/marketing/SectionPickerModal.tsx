import React from 'react';
import { EmailBlockType, EmailLayoutPreset } from '../../types';
import {
  LayoutTemplate,
  Image as ImageIcon,
  Columns2,
  Stamp,
  Video,
  Instagram,
  Type,
  Minus,
  Sparkles,
  AlignJustify,
  MoveVertical,
  Share2,
  FileText,
  MapPin,
  Clock,
  ShoppingBag,
  ListChecks,
  Heart,
  X,
  ArrowLeft,
  Check
} from 'lucide-react';

interface SectionPickerModalProps {
  isOpen: boolean;
  insertIndex: number;
  onClose: () => void;
  onSelectBlock: (type: EmailBlockType, layoutPreset?: EmailLayoutPreset) => void;
}

export const SectionPickerModal: React.FC<SectionPickerModalProps> = ({
  isOpen,
  insertIndex,
  onClose,
  onSelectBlock
}) => {
  const [activeView, setActiveView] = React.useState<'grid' | 'layouts-library'>('grid');
  const [layoutCategory, setLayoutCategory] = React.useState<'all' | 'image-text' | 'collages' | 'graphics'>('all');

  if (!isOpen) return null;

  const blockOptions: Array<{
    type: EmailBlockType;
    label: string;
    description: string;
    icon: React.ElementType;
    isPopular?: boolean;
    isLayoutTrigger?: boolean;
  }> = [
    { type: 'layout', label: 'Layouts', description: 'Editorial cards & collages', icon: LayoutTemplate, isPopular: true, isLayoutTrigger: true },
    { type: 'image', label: 'Image', description: 'Single hero or banner photo', icon: ImageIcon, isPopular: true },
    { type: 'two-images', label: '2 Images (Grid)', description: 'Side-by-side dual photo columns', icon: Columns2, isPopular: true },
    { type: 'logo', label: 'Logo', description: 'Brand crest, monogram or header', icon: Stamp },
    { type: 'video', label: 'Video', description: 'Video player card with play overlay', icon: Video },
    { type: 'instagram', label: 'Instagram', description: 'Social photo feed grid', icon: Instagram },
    { type: 'text', label: 'Text', description: 'Editorial headings & paragraphs', icon: Type, isPopular: true },
    { type: 'linkbar', label: 'Link bar', description: 'Horizontal navigation links', icon: AlignJustify },
    { type: 'button', label: 'Button', description: 'Call-to-action link button', icon: Sparkles, isPopular: true },
    { type: 'form-field', label: 'Form Input (Interactive)', description: 'In-email input field (email, name, text)', icon: FileText, isPopular: true },
    { type: 'form-survey', label: 'Survey / Rating (Interactive)', description: 'One-click 1-5 star or emoji feedback poll', icon: ListChecks, isPopular: true },
    { type: 'divider', label: 'Divider', description: 'Minimal rule, dashed or dotted line', icon: Minus },
    { type: 'spacer', label: 'Spacer', description: 'Adjustable blank vertical padding', icon: MoveVertical },
    { type: 'social', label: 'Social links', description: 'Social media icon channel strip', icon: Share2 },
    { type: 'footer', label: 'Footer', description: 'Legal notice & unsubscribe links', icon: FileText },
    { type: 'address', label: 'Address', description: 'Studio postal address & contact info', icon: MapPin },
    { type: 'countdown', label: 'Countdown', description: 'Live flash sale urgency timer', icon: Clock },
    { type: 'ecommerce', label: 'E-commerce', description: 'Product showcase with price & buy CTA', icon: ShoppingBag },
    { type: 'poll', label: 'Poll', description: 'Interactive subscriber vote block', icon: ListChecks },
    { type: 'favorites', label: 'Favorites', description: 'Quick saved layout components', icon: Heart }
  ];

  // Curated layout presets as requested with equal 50/50 division
  const layoutPresets: Array<{
    id: EmailLayoutPreset;
    title: string;
    category: 'image-text' | 'collages' | 'graphics';
    previewDescription: string;
    visualComponent: React.ReactNode;
  }> = [
    {
      id: 'two-images-grid',
      title: '2-Image Grid (Dual Columns)',
      category: 'collages',
      previewDescription: 'Two equal columns with photo cards, rounded corners, captions, and links',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200 grid grid-cols-2 gap-2.5">
          <div className="aspect-[4/3] rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-400">
            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="aspect-[4/3] rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-400">
            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>
      )
    },
    {
      id: 'split-square-left',
      title: 'Square Image Left, Text Right',
      category: 'image-text',
      previewDescription: 'Equal 50/50 split: Square image on left with strikethrough price, title, and action link on right',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-stone-900 grid grid-cols-2 gap-3 items-center">
          <div className="aspect-square rounded-xl bg-stone-200/80 border border-stone-300 flex items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1 text-left">
            <div className="text-xs font-mono font-bold text-stone-800">
              <span className="line-through text-stone-400 mr-1.5">$760</span>
              <span className="text-black font-black">$570</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">Introductory Branding Package</h4>
            <div className="text-xs font-bold underline text-stone-900 pt-0.5">Learn more</div>
          </div>
        </div>
      )
    },
    {
      id: 'coaching-circle',
      title: 'Circle Image Right, Text Left (1:1 Coaching)',
      category: 'image-text',
      previewDescription: 'Equal 50/50 split: Text on left with large circular photo placeholder on right',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-stone-900 grid grid-cols-2 gap-3 items-center">
          <div className="space-y-1 text-left">
            <div className="text-xs font-mono font-bold text-stone-800">
              <span className="line-through text-stone-400 mr-1.5">$1220</span>
              <span className="text-black font-black">$915</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">1:1 Business Coaching</h4>
            <div className="text-xs font-bold underline text-stone-900 pt-0.5">Apply now</div>
          </div>
          <div className="aspect-square rounded-full bg-stone-200/80 border-2 border-white shadow-sm flex items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>
      )
    },
    {
      id: 'split-circle-left',
      title: 'Circle Image Left, Text Right',
      category: 'image-text',
      previewDescription: 'Equal 50/50 split: Large circular avatar/photo on left with pricing and copy on right',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-stone-900 grid grid-cols-2 gap-3 items-center">
          <div className="aspect-square rounded-full bg-stone-200/80 border-2 border-white shadow-sm flex items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1 text-left">
            <div className="text-xs font-mono font-bold text-stone-800">
              <span className="line-through text-stone-400 mr-1.5">$950</span>
              <span className="text-black font-black">$690</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">Private Masterclass Mentorship</h4>
            <div className="text-xs font-bold underline text-stone-900 pt-0.5">Reserve seat</div>
          </div>
        </div>
      )
    },
    {
      id: 'split-square-right',
      title: 'Square Image Right, Text Left',
      category: 'image-text',
      previewDescription: 'Equal 50/50 split: Editorial text on left with large square photo showcase on right',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-stone-900 grid grid-cols-2 gap-3 items-center">
          <div className="space-y-1 text-left">
            <div className="text-xs font-mono font-bold text-stone-800">
              <span className="line-through text-stone-400 mr-1.5">$300</span>
              <span className="text-black font-black">$225</span>
            </div>
            <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">My Bestselling Email Templates</h4>
            <div className="text-xs font-bold underline text-stone-900 pt-0.5">Get 'em</div>
          </div>
          <div className="aspect-square rounded-xl bg-stone-200/80 border border-stone-300 flex items-center justify-center text-stone-400">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>
      )
    },
    {
      id: 'stacked-discount',
      title: '30% 30% 30% Typographic Sale Hero',
      category: 'graphics',
      previewDescription: 'High-contrast bold repeated discount wallpaper with central product image',
      visualComponent: (
        <div className="bg-black text-white p-5 rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[140px]">
          <div className="absolute inset-0 flex flex-col justify-center items-center opacity-30 select-none font-black text-4xl leading-none tracking-tighter">
            <div>30%</div>
            <div>30%</div>
            <div>30%</div>
          </div>
          <div className="relative z-10 w-24 h-20 rounded-xl bg-stone-700 border border-stone-500/50 shadow-lg flex items-center justify-center text-stone-300">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      )
    },
    {
      id: 'side-by-side',
      title: "From The 'Gram / Split Post Card",
      category: 'image-text',
      previewDescription: 'Side-by-side split layout: photo left with warm sand editorial card right',
      visualComponent: (
        <div className="grid grid-cols-2 rounded-2xl overflow-hidden border border-stone-200">
          <div className="bg-stone-300 min-h-[100px] flex items-center justify-center text-stone-500">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="bg-[#F8F4EA] p-3 flex flex-col justify-center items-center text-center">
            <span className="text-[9px] italic font-serif text-stone-500">From The 'Gram</span>
            <div className="text-xs font-serif font-bold text-stone-900 mt-0.5 leading-snug">The Post That Got Everyone Talking</div>
            <div className="mt-2 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-stone-200 text-stone-800 rounded">
              SEE IT
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips-numbered',
      title: '6 Tips to Photograph Food',
      category: 'graphics',
      previewDescription: 'Giant golden numeral, serif editorial heading, divider and button',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 text-center space-y-1.5">
          <div className="font-serif text-3xl font-normal text-amber-700 leading-none">6</div>
          <div className="font-serif text-sm font-bold text-stone-900 leading-tight">Tips to Photograph Food</div>
          <div className="w-8 h-[1px] bg-stone-300 mx-auto my-1"></div>
          <p className="text-[10px] text-stone-500 line-clamp-2 max-w-[200px] mx-auto">
            I remember my first try at food photography. I created this guide to help you get started.
          </p>
          <div className="inline-block px-3 py-1 bg-[#D9B7B7] text-white text-[9px] font-bold uppercase tracking-wider rounded">
            READ IT
          </div>
        </div>
      )
    },
    {
      id: 'welcome-hero',
      title: 'Welcome to the list / You made it',
      category: 'collages',
      previewDescription: 'Clean minimalist full-height photo card with elegant centered text',
      visualComponent: (
        <div className="bg-[#E7E5E4] p-6 rounded-2xl border border-stone-300 text-center flex flex-col justify-center items-center min-h-[120px] relative">
          <div className="text-[10px] tracking-widest uppercase text-stone-500 font-semibold mb-2">WELCOME TO THE LIST</div>
          <div className="text-xl font-serif italic text-stone-700">You made it.</div>
        </div>
      )
    },
    {
      id: 'gift-thanks',
      title: 'Gift of Thanks Banner',
      category: 'graphics',
      previewDescription: 'High-contrast graphic header with dark highlight band',
      visualComponent: (
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-left space-y-1">
          <div className="w-6 h-0.5 bg-black mb-2"></div>
          <div className="text-xs font-black uppercase tracking-wider text-black">A LITTLE GIFT OF THANKS</div>
          <div className="inline-block px-2 py-0.5 bg-stone-300 text-stone-900 font-mono text-[10px] font-bold">
            FOR JOINING THE LIST
          </div>
        </div>
      )
    }
  ];

  const filteredPresets = layoutCategory === 'all' 
    ? layoutPresets 
    : layoutPresets.filter(p => p.category === layoutCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-white/20 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            {activeView === 'layouts-library' && (
              <button
                onClick={() => setActiveView('grid')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Back to all blocks"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {activeView === 'grid' ? 'Add a section' : 'Choose a Layout Preset'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {activeView === 'grid' 
                  ? 'Select an element to insert into your email canvas' 
                  : 'Pre-designed high-craft editorial layouts ready to customize'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeView === 'grid' ? (
            /* 17-Option Grid (as seen in Screenshot 1) */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {blockOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      if (opt.isLayoutTrigger) {
                        setActiveView('layouts-library');
                      } else {
                        onSelectBlock(opt.type);
                        onClose();
                      }
                    }}
                    className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-pink-500/50 transition-all duration-150 text-center cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] group-hover:bg-pink-600/30 group-hover:text-pink-300 text-stone-200 flex items-center justify-center mb-2.5 transition-colors shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-stone-200 group-hover:text-white transition-colors">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-stone-500 group-hover:text-stone-400 line-clamp-1 mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Layouts Preset Library (as seen in Screenshots 2, 4, 5) */
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 pb-1 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Layouts' },
                  { id: 'image-text', label: 'Image & text' },
                  { id: 'graphics', label: 'Graphics & Sale' },
                  { id: 'collages', label: 'Collages & Stories' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setLayoutCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      layoutCategory === cat.id
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-stone-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Preset Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectBlock('layout', preset.id);
                      onClose();
                    }}
                    className="group p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer space-y-3"
                  >
                    <div className="overflow-hidden rounded-xl shadow-md border border-white/10 group-hover:border-white/30 transition-all">
                      {preset.visualComponent}
                    </div>
                    
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                          {preset.title}
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                          {preset.previewDescription}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[10px] font-bold shrink-0">
                        Insert
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between text-[11px] text-stone-400">
          <span>You can move, duplicate, or delete any section anytime after inserting.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
