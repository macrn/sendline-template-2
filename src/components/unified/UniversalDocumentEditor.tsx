import React, { useState } from 'react';
import { 
  DocumentContext, 
  UniversalBlock, 
  BrandKit, 
  UniversalTemplate, 
  BlockType,
  ForkedDocument
} from './unifiedTypes';
import { 
  Mail, 
  FileText, 
  Workflow, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Eye, 
  Code, 
  Copy, 
  Monitor, 
  Smartphone, 
  Palette, 
  Sliders, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Layers, 
  Send,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface UniversalDocumentEditorProps {
  template: UniversalTemplate;
  brandKit: BrandKit;
  allBrandKits: BrandKit[];
  onBrandKitChange: (kit: BrandKit) => void;
  onForkDocument: (doc: ForkedDocument) => void;
  onSaveTemplate?: (template: UniversalTemplate) => void;
}

export const UniversalDocumentEditor: React.FC<UniversalDocumentEditorProps> = ({
  template,
  brandKit,
  allBrandKits,
  onBrandKitChange,
  onForkDocument,
  onSaveTemplate
}) => {
  const [context, setContext] = useState<DocumentContext>('email');
  const [blocks, setBlocks] = useState<UniversalBlock[]>(template.blocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [subscriberEmailInput, setSubscriberEmailInput] = useState('');
  const [formSubmittedSuccess, setFormSubmittedSuccess] = useState(false);

  // Quick Notification Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Block Capability Matrix based on active context
  const getBlockCapability = (type: BlockType, ctx: DocumentContext): boolean => {
    switch (ctx) {
      case 'email':
        return ['header', 'text', 'image', 'button', 'spacer', 'footer'].includes(type);
      case 'form':
        return ['header', 'text', 'image', 'form_slot', 'spacer'].includes(type);
      case 'workflow':
        return ['header', 'text', 'image', 'button', 'condition_badge', 'spacer', 'footer'].includes(type);
      case 'checkout':
        return ['header', 'text', 'image', 'product_card', 'button', 'spacer'].includes(type);
      default:
        return true;
    }
  };

  // Block list definition for "Blocks in this context" bar
  const availableBlockTypes: { type: BlockType; label: string }[] = [
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'button', label: 'Button' },
    { type: 'spacer', label: 'Spacer' },
    { type: 'footer', label: 'Footer' }
  ];

  // Update specific block content
  const handleUpdateBlockContent = (blockId: string, updates: Partial<UniversalBlock['content']>) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content: { ...b.content, ...updates } } : b));
  };

  // Add block
  const handleAddBlock = (type: BlockType) => {
    const newBlock: UniversalBlock = {
      id: `blk-${Date.now()}`,
      type,
      content: {
        text: type === 'text' ? 'New editorial paragraph copy with thoughtful phrasing.' : undefined,
        imageUrl: type === 'image' ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' : undefined,
        imageAlt: 'Editorial feature image',
        buttonText: type === 'button' ? 'Discover More' : undefined,
        buttonUrl: 'https://sendline.io',
        height: type === 'spacer' ? 24 : undefined
      },
      style: {
        align: 'center',
        paddingY: 12
      },
      capabilities: {
        allowInEmail: true,
        allowInForm: type !== 'footer',
        allowInWorkflow: true,
        allowInCheckout: true
      }
    };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    showToast(`Added ${type} block`);
  };

  // Remove block
  const handleRemoveBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    showToast('Block removed');
  };

  // Move block
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlocks(updated);
  };

  // Fork on Use Handler
  const handleForkToContext = (targetCtx: DocumentContext) => {
    const forked: ForkedDocument = {
      id: `doc-fork-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      context: targetCtx,
      name: `${template.name} (${targetCtx.toUpperCase()})`,
      blocks: JSON.parse(JSON.stringify(blocks)),
      brandKit: JSON.parse(JSON.stringify(brandKit)),
      createdAt: new Date().toISOString(),
      metadata: {
        subject: template.defaultSubject,
        preheader: template.defaultPreheader,
        formSlug: `form-${template.name.toLowerCase().replace(/\s+/g, '-')}`,
        workflowTrigger: `${template.name} Form Submitted`
      }
    };
    onForkDocument(forked);
    showToast(`✨ Forked "${template.name}" into dedicated ${targetCtx.toUpperCase()} document!`);
  };

  // Copy HTML/Embed
  const generateEmbedScript = () => {
    return `<!-- Sendline Universal Web Form Embed -->\n<div id="sendline-form-${template.id}"></div>\n<script src="https://sendline.io/embed/form.js" data-template="${template.id}" data-theme="${brandKit.id}" async></script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedScript());
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
    showToast('Copied embed snippet to clipboard!');
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0D1117] text-stone-100 font-sans antialiased select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 border border-stone-700 text-stone-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar matching SL3 and SL6 */}
      <header className="h-16 bg-[#161B22] border-b border-stone-800/90 px-6 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Template Name & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-lg font-bold text-white tracking-tight">
              {template.name}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 bg-stone-800/80 px-2.5 py-0.5 rounded-full border border-stone-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Template • saved
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-stone-800">
            <Palette className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={brandKit.id}
              onChange={(e) => {
                const found = allBrandKits.find(k => k.id === e.target.value);
                if (found) onBrandKitChange(found);
              }}
              className="bg-transparent text-xs text-stone-300 font-medium focus:outline-none cursor-pointer"
            >
              {allBrandKits.map(kit => (
                <option key={kit.id} value={kit.id} className="bg-[#161B22] text-stone-200">
                  {kit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Context Switcher Pill (SL3 / SL6: Email | Form | Checkout) */}
        <div className="flex items-center bg-[#0D1117] p-1 rounded-xl border border-stone-800 shadow-inner">
          <button
            onClick={() => setContext('email')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              context === 'email'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>

          <button
            onClick={() => setContext('form')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              context === 'form'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form</span>
          </button>

          <button
            onClick={() => setContext('workflow')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              context === 'workflow'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </button>

          <button
            onClick={() => setContext('checkout')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              context === 'checkout'
                ? 'bg-stone-200 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Checkout</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Device switch */}
          <div className="flex items-center bg-[#0D1117] rounded-lg p-0.5 border border-stone-800">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Desktop 600px view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Mobile 375px view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Embed / Code */}
          <button
            onClick={() => setShowCodeModal(true)}
            className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1 border border-stone-700 cursor-pointer"
            title="Inspect universal document JSON"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {/* Fork on Use Action Button */}
          <button
            onClick={() => handleForkToContext(context)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-950 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-800" />
            <span>Fork to {context}</span>
          </button>
        </div>

      </header>

      {/* "Blocks in this context" Sub-Bar matching SL3 and SL6 */}
      <div className="bg-[#12161E] border-b border-stone-800/70 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
            Blocks in this context:
          </span>
          <div className="flex items-center gap-1.5">
            {availableBlockTypes.map(blk => {
              const isAllowed = getBlockCapability(blk.type, context);
              return (
                <button
                  key={blk.type}
                  onClick={() => isAllowed && handleAddBlock(blk.type)}
                  disabled={!isAllowed}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    isAllowed 
                      ? blk.type === 'footer' && context === 'email'
                        ? 'bg-blue-900/60 text-blue-200 border border-blue-700/60'
                        : 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700 cursor-pointer'
                      : 'bg-stone-900/50 text-stone-600 border border-stone-800/40 opacity-40 cursor-not-allowed line-through'
                  }`}
                  title={isAllowed ? `Add ${blk.label} block` : `Not applicable in ${context} context`}
                >
                  {blk.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-stone-400">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>
            {context === 'email' && 'Email Renderer: Table HTML 600px • Compliance footer auto-injected'}
            {context === 'form' && 'Web Renderer: Interactive input slot • Live subscriber capture'}
            {context === 'workflow' && 'Workflow Engine: Automation step with condition branching'}
            {context === 'checkout' && 'Web Sales Renderer: Product cart & Stripe payment link'}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Inspector Sidebar (Block & Style Editor) */}
        <div className="w-80 bg-[#161B22] border-r border-stone-800/90 p-5 overflow-y-auto space-y-6 shrink-0 text-left">
          
          <div className="space-y-1 pb-4 border-b border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Document Structure
              </span>
              <span className="text-[10px] font-semibold text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                {blocks.length} blocks
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Click any block to adjust copy, layout, or capability flags.
            </p>
          </div>

          {/* Block Hierarchy List */}
          <div className="space-y-2">
            {blocks.map((block, idx) => {
              const isSelected = selectedBlockId === block.id;
              const isAllowedInCtx = getBlockCapability(block.type, context);

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-stone-800 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                      : 'bg-[#1F242C] border-stone-800 hover:border-stone-700 text-stone-300'
                  } ${!isAllowedInCtx ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-stone-900 text-stone-300">
                        {block.type}
                      </span>
                      <span className="text-xs font-semibold text-stone-200 truncate max-w-[120px]">
                        {block.content.text || block.content.buttonText || block.content.badgeText || block.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-stone-700 text-stone-400 disabled:opacity-20 cursor-pointer"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="p-1 rounded hover:bg-stone-700 text-stone-400 disabled:opacity-20 cursor-pointer"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1 rounded hover:bg-red-900/50 text-stone-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Block Inspector Inputs (When Selected) */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-stone-700/80 space-y-3" onClick={(e) => e.stopPropagation()}>
                      {block.type === 'text' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Text Content</label>
                            <textarea
                              rows={2}
                              value={block.content.text || ''}
                              onChange={(e) => handleUpdateBlockContent(block.id, { text: e.target.value })}
                              className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Subtext / Subhead</label>
                            <input
                              type="text"
                              value={block.content.subtext || ''}
                              onChange={(e) => handleUpdateBlockContent(block.id, { subtext: e.target.value })}
                              className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                            />
                          </div>
                        </>
                      )}

                      {block.type === 'image' && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={block.content.imageUrl || ''}
                            onChange={(e) => handleUpdateBlockContent(block.id, { imageUrl: e.target.value })}
                            className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>
                      )}

                      {block.type === 'button' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Button Label</label>
                            <input
                              type="text"
                              value={block.content.buttonText || ''}
                              onChange={(e) => handleUpdateBlockContent(block.id, { buttonText: e.target.value })}
                              className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Action URL</label>
                            <input
                              type="text"
                              value={block.content.buttonUrl || ''}
                              onChange={(e) => handleUpdateBlockContent(block.id, { buttonUrl: e.target.value })}
                              className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                            />
                          </div>
                        </>
                      )}

                      {block.type === 'header' && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Logo Badge Initials</label>
                          <input
                            type="text"
                            value={block.content.badgeText || ''}
                            onChange={(e) => handleUpdateBlockContent(block.id, { badgeText: e.target.value })}
                            className="w-full bg-[#0D1117] border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Context Transformation Explainer */}
          <div className="p-4 rounded-2xl bg-[#0D1117] border border-stone-800 space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Universal Document Model</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Every document is stored as a single schema. When switched between <strong>Email</strong>, <strong>Form</strong>, <strong>Workflow</strong>, or <strong>Checkout</strong>, the layout dynamically adapts while retaining linked brand styles.
            </p>
          </div>

        </div>

        {/* Center Canvas Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col items-center justify-start bg-[#0A0D12]">
          
          {/* Canvas Wrapper */}
          <div 
            className={`transition-all duration-300 w-full flex flex-col items-center ${
              previewDevice === 'mobile' ? 'max-w-[390px]' : 'max-w-[620px]'
            }`}
          >
            
            {/* The Unified Document Card Rendered View (Matches SL3, SL6 & SL7) */}
            <div 
              className="w-full rounded-3xl p-8 shadow-2xl border border-stone-800 text-center transition-all relative overflow-hidden"
              style={{
                backgroundColor: brandKit.canvasBackgroundColor,
                color: brandKit.textColor,
                fontFamily: brandKit.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif'
              }}
            >
              
              {/* Context Watermark Tag */}
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-[10px] font-black uppercase tracking-wider text-stone-300">
                {context} renderer
              </div>

              {/* Dynamic Blocks Rendering */}
              <div className="space-y-6 pt-2">
                
                {/* 1. Header / Logo Block */}
                <div className="flex justify-center">
                  <div 
                    className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-blue-200 font-bold text-sm shadow-md"
                    style={{
                      backgroundColor: brandKit.primaryColor === '#0f172a' ? '#1e3a8a' : brandKit.primaryColor,
                      color: '#ffffff'
                    }}
                  >
                    {brandKit.logoText || 'SL'}
                  </div>
                </div>

                {/* 2. Headline & Subhead */}
                <div className="space-y-2 text-center">
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
                    {blocks.find(b => b.type === 'text')?.content.text || 'The spring collection is here'}
                  </h1>
                  <p className="text-xs lg:text-sm text-stone-400 font-normal max-w-md mx-auto">
                    {blocks.find(b => b.type === 'text')?.content.subtext || 'Join the list and be first to see every new piece.'}
                  </p>
                </div>

                {/* 3. Image / Visual Frame */}
                {context !== 'form' ? (
                  <div className="w-full rounded-2xl bg-stone-900/60 border border-stone-800/80 p-8 flex flex-col items-center justify-center min-h-[140px] text-stone-500 relative overflow-hidden group">
                    {blocks.find(b => b.type === 'image')?.content.imageUrl ? (
                      <img 
                        src={blocks.find(b => b.type === 'image')?.content.imageUrl} 
                        alt="Preview"
                        className="w-full h-44 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ) : null}

                {/* 4. Body Copy */}
                {context !== 'form' && (
                  <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                    {blocks.find(b => b.id === 'blk-body-1')?.content.text || 'Fresh pieces, small batches, and everything made to order this season.'}
                  </p>
                )}

                {/* 5. Context Specific Interactive Action / Slot */}

                {/* A. EMAIL CONTEXT: Standard Button */}
                {context === 'email' && (
                  <div className="pt-2">
                    <button 
                      className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-xl bg-white text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-stone-200 transition-all cursor-pointer"
                    >
                      {blocks.find(b => b.type === 'button')?.content.buttonText || 'Shop now'}
                    </button>
                  </div>
                )}

                {/* B. FORM CONTEXT: Slot transformation with Input & Submit (SL7) */}
                {context === 'form' && (
                  <div className="space-y-3 pt-2 max-w-sm mx-auto text-left">
                    {formSubmittedSuccess ? (
                      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center space-y-1 animate-in fade-in">
                        <Check className="w-5 h-5 mx-auto text-emerald-400" />
                        <div className="text-xs font-bold">You're subscribed!</div>
                        <div className="text-[11px] text-emerald-400">Enrolled into the welcome automation sequence.</div>
                      </div>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!subscriberEmailInput) return;
                          setFormSubmittedSuccess(true);
                          setTimeout(() => setFormSubmittedSuccess(false), 4000);
                          showToast(`Submitted: ${subscriberEmailInput}`);
                        }}
                        className="space-y-3"
                      >
                        <input
                          type="email"
                          required
                          value={subscriberEmailInput}
                          onChange={(e) => setSubscriberEmailInput(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#1E242C] border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
                        >
                          Subscribe
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* C. WORKFLOW CONTEXT: Automation token & delay banner */}
                {context === 'workflow' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-[11px] text-indigo-300 flex items-center justify-between">
                      <span>Dynamic Token: <code className="font-mono bg-indigo-900/60 px-1 py-0.5 rounded text-white">&#123;&#123;subscriber.first_name&#125;&#125;</code></span>
                      <span className="font-bold">Step 1 of 4</span>
                    </div>
                    <button 
                      className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-xl bg-white text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-stone-200"
                    >
                      {blocks.find(b => b.type === 'button')?.content.buttonText || 'Claim Welcome Pass'}
                    </button>
                  </div>
                )}

                {/* D. CHECKOUT CONTEXT: Product pricing & Instant Buy */}
                {context === 'checkout' && (
                  <div className="space-y-4 pt-2">
                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-medium">Spring Edition Lookbook & Pass</span>
                      <span className="font-black text-white">$49.00</span>
                    </div>
                    <button 
                      className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                    >
                      Pay $49.00 with Apple Pay
                    </button>
                  </div>
                )}

                {/* 6. Footer (Auto injected in email & workflow context per SL3/SL6) */}
                {context === 'email' && (
                  <div className="pt-8 border-t border-stone-800/80 text-center text-[11px] text-stone-500">
                    Unsubscribe • Preferences • Studio Lane, Köln
                  </div>
                )}

              </div>

            </div>

            {/* Embed code / Quick action footer under canvas */}
            {context === 'form' && (
              <div className="mt-6 w-full p-4 rounded-2xl bg-[#161B22] border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span>Vanilla JS Form Embed Snippet</span>
                </div>
                <button
                  onClick={copyEmbedCode}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* JSON Schema Inspection Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-stone-700 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="font-serif font-bold text-white text-sm">Universal Block Document Schema (JSONB)</span>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-stone-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-stone-800"
              >
                Close
              </button>
            </div>

            <div className="bg-[#0D1117] p-4 rounded-2xl border border-stone-800 overflow-x-auto max-h-96 text-[11px] font-mono text-emerald-400">
              <pre>
                {JSON.stringify({
                  templateId: template.id,
                  name: template.name,
                  activeContext: context,
                  brandKit: {
                    id: brandKit.id,
                    name: brandKit.name,
                    primaryColor: brandKit.primaryColor,
                    fontFamily: brandKit.fontFamily
                  },
                  blocks: blocks
                }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(blocks, null, 2));
                  showToast('Document JSON copied to clipboard!');
                  setShowCodeModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-white text-stone-950 font-bold text-xs uppercase"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
