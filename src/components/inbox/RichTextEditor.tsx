import React, { useRef, useEffect, useState, useCallback, useImperativeHandle } from 'react';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon, 
  Link as LinkIcon, 
  Heading as HeadingIcon, 
  Quote as QuoteIcon, 
  Code as CodeIcon, 
  List as ListIcon, 
  ListOrdered as ListOrderedIcon, 
  Indent, 
  Outdent, 
  X, 
  Highlighter,
  Palette,
  RemoveFormatting
} from 'lucide-react';

export interface RichTextEditorProps {
  initialHtml?: string;
  placeholder?: string;
  onChange?: (html: string, textContent: string) => void;
  minHeight?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  showToolbar?: boolean;
  onToggleToolbar?: () => void;
}

export interface RichTextEditorRef {
  getHtml: () => string;
  getText: () => string;
  setHtml: (html: string) => void;
  insertHtml: (html: string) => void;
  focus: () => void;
}

// Light Canvas Highlighter Colors (Authentic high-contrast pastel highlights)
const HIGHLIGHT_COLORS = [
  { name: 'None', value: 'transparent', label: 'Clear', bg: 'transparent', border: '#d6d3d1' },
  { name: 'Yellow', value: '#fef08a', label: 'Yellow', bg: '#fef08a', border: '#eab308' },
  { name: 'Peach', value: '#fed7aa', label: 'Peach', bg: '#fed7aa', border: '#ea583a' },
  { name: 'Emerald', value: '#bbf7d0', label: 'Mint Green', bg: '#bbf7d0', border: '#22c55e' },
  { name: 'Sky', value: '#bae6fd', label: 'Sky Blue', bg: '#bae6fd', border: '#0ea5e9', },
  { name: 'Lavender', value: '#e9d5ff', label: 'Lavender', bg: '#e9d5ff', border: '#a855f7' },
];

// Rich Text Ink Colors for Light Canvas
const TEXT_COLORS = [
  { name: 'Default', value: '#1c1917', label: 'Charcoal', bg: '#1c1917' },
  { name: 'Coral', value: '#ea583a', label: 'Coral', bg: '#ea583a' },
  { name: 'Amber', value: '#d97706', label: 'Amber', bg: '#d97706' },
  { name: 'Emerald', value: '#059669', label: 'Emerald', bg: '#059669' },
  { name: 'Blue', value: '#0284c7', label: 'Blue', bg: '#0284c7' },
  { name: 'Muted', value: '#78716c', label: 'Stone', bg: '#78716c' },
];

export const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(({
  initialHtml = '',
  placeholder = 'Write your message here...',
  onChange,
  minHeight = '200px',
  className = '',
  autoFocus = false,
  onKeyDown,
  showToolbar = true,
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  // Popovers & menus
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  // Link state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRange = useRef<Range | null>(null);

  // Active formats state for highlighting active buttons
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bulletList: false,
    numberList: false,
    heading: false,
    quote: false,
  });

  // Save current selection before showing link modal or popovers
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange.current);
      }
    }
  };

  // Sync initial HTML
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml]);

  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // Check which formatting tags are active at current cursor
  const checkActiveFormats = useCallback(() => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        bulletList: document.queryCommandState('insertUnorderedList'),
        numberList: document.queryCommandState('insertOrderedList'),
        heading: false,
        quote: false,
      });
    } catch {
      // ignore
    }
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || '';
    if (onChange) {
      onChange(html, text);
    }
    checkActiveFormats();
    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 0);
  };

  // Expose Imperative Ref Methods
  useImperativeHandle(ref, () => ({
    getHtml: () => editorRef.current?.innerHTML || '',
    getText: () => editorRef.current?.innerText || '',
    setHtml: (html: string) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        handleInput();
      }
    },
    insertHtml: (html: string) => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, html);
        handleInput();
      }
    },
    focus: () => {
      editorRef.current?.focus();
    }
  }));

  // Command Execution with Guaranteed Focus Retention
  const execCmd = (cmd: string, val: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd, false, val);
      handleInput();
    }
  };

  // Heading Block Formatter
  const handleHeading = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (tag === 'p') {
        document.execCommand('formatBlock', false, '<p>');
      } else {
        document.execCommand('formatBlock', false, `<${tag}>`);
      }
      setShowHeadingMenu(false);
      handleInput();
    }
  };

  // Blockquote Formatter
  const handleBlockquote = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('formatBlock', false, '<blockquote>');
      handleInput();
    }
  };

  // Code Formatter
  const handleCodeBlock = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.toString()) {
        const text = sel.toString();
        document.execCommand('insertHTML', false, `<code style="background-color:#f5f5f4; color:#ea583a; padding:2px 6px; border-radius:6px; font-family:ui-monospace,monospace; font-size:13px; border:1px solid #e7e5e4; font-weight:600;">${text}</code>`);
      } else {
        document.execCommand('insertHTML', false, `<code style="background-color:#f5f5f4; color:#ea583a; padding:2px 6px; border-radius:6px; font-family:ui-monospace,monospace; font-size:13px; border:1px solid #e7e5e4; font-weight:600;">code</code>&nbsp;`);
      }
      handleInput();
    }
  };

  // Apply Color / Highlight
  const handleApplyColor = (color: string, isBackground: boolean) => {
    if (editorRef.current) {
      restoreSelection();
      editorRef.current.focus();
      if (isBackground) {
        if (color === 'transparent') {
          document.execCommand('removeFormat', false, '');
        } else {
          document.execCommand('hiliteColor', false, color);
        }
      } else {
        document.execCommand('foreColor', false, color);
      }
      setShowColorPicker(false);
      handleInput();
    }
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const currentSelectedText = sel?.toString() || '';
    setLinkText(currentSelectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Confirm Link
  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }

    let validUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(validUrl) && !/^mailto:/i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      if (linkText.trim()) {
        document.execCommand(
          'insertHTML', 
          false, 
          `<a href="${validUrl}" target="_blank" rel="noopener noreferrer" style="color:#ea583a; text-decoration:underline; font-weight:700;">${linkText.trim()}</a>`
        );
      } else {
        document.execCommand('createLink', false, validUrl);
      }
      handleInput();
    }
    setShowLinkModal(false);
  };

  // Clear all formatting
  const handleClearFormatting = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('removeFormat', false, '');
      handleInput();
    }
  };

  return (
    <div className={`rich-text-editor relative flex flex-col bg-white rounded-2xl border-2 border-[#e7e5e4] focus-within:border-[#ea583a] focus-within:ring-2 focus-within:ring-[#ea583a]/20 shadow-sm transition-all overflow-hidden ${className}`}>
      
      {/* Top Formatting Toolbar (Sticky Dark Pill / Header for high contrast tools) */}
      {showToolbar && (
        <div className="bg-[#1c1a18] border-b-2 border-[#2b2927] px-3 py-2 flex items-center justify-between flex-wrap gap-1.5 select-none">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            
            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer ${
                activeFormats.bold 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Bold (⌘B)"
            >
              <span className="font-extrabold text-sm">B</span>
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeFormats.italic 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Italic (⌘I)"
            >
              <span className="italic font-serif font-bold text-sm">I</span>
            </button>

            {/* Underline */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeFormats.underline 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Underline (⌘U)"
            >
              <UnderlineIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Strikethrough */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeFormats.strike 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Strikethrough"
            >
              <StrikeIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="w-px h-5 bg-[#3e3b37] mx-1" />

            {/* Heading Menu (Format) */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveSelection();
                  setShowHeadingMenu(!showHeadingMenu);
                  setShowColorPicker(false);
                }}
                className={`h-8 px-2.5 rounded-xl flex items-center gap-1 font-black text-xs transition-all cursor-pointer ${
                  showHeadingMenu
                    ? 'bg-[#ea583a] text-white'
                    : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
                }`}
                title="Heading Sizes"
              >
                <HeadingIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Format</span>
              </button>

              {showHeadingMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHeadingMenu(false)} />
                  <div className="absolute top-full mt-2 left-0 bg-[#1c1a18] border-2 border-[#3d3a36] rounded-2xl p-1.5 shadow-2xl z-50 w-48 space-y-1 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleHeading('p'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#2a2826] text-stone-300 hover:text-white font-medium cursor-pointer"
                    >
                      Normal Text (P)
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleHeading('h1'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#2a2826] text-white font-black text-base cursor-pointer"
                    >
                      Large Heading (H1)
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleHeading('h2'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#2a2826] text-white font-bold text-sm cursor-pointer"
                    >
                      Medium Heading (H2)
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleHeading('h3'); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#2a2826] text-stone-200 font-bold text-xs cursor-pointer"
                    >
                      Small Heading (H3)
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Link */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); openLinkModal(); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37] flex items-center justify-center transition-all cursor-pointer"
              title="Insert Link (⌘K)"
            >
              <LinkIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Colors & Highlight Palette */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  saveSelection();
                  setShowColorPicker(!showColorPicker);
                  setShowHeadingMenu(false);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  showColorPicker
                    ? 'bg-[#ea583a] text-white'
                    : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
                }`}
                title="Highlight & Text Color"
              >
                <Highlighter className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {showColorPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                  <div className="absolute top-full mt-2 left-0 bg-[#1c1a18] border-2 border-[#3d3a36] rounded-2xl p-3 shadow-2xl z-50 w-56 space-y-3 animate-in fade-in zoom-in-95 duration-100 text-xs">
                    <div>
                      <div className="text-[11px] font-black text-stone-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Highlighter className="w-3 h-3 text-[#ea583a]" />
                        <span>Background Highlight</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {HIGHLIGHT_COLORS.map(c => (
                          <button
                            key={c.name}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleApplyColor(c.value, true); }}
                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.bg, borderColor: c.border }}
                            title={c.label}
                          >
                            {c.name === 'None' && <span className="text-stone-400 font-bold text-[10px]">✕</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#33312e] pt-2.5">
                      <div className="text-[11px] font-black text-stone-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-3 h-3 text-amber-400" />
                        <span>Text Color</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {TEXT_COLORS.map(c => (
                          <button
                            key={c.name}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); handleApplyColor(c.value, false); }}
                            className="w-6 h-6 rounded-full border-2 border-[#44403c] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.bg }}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-5 bg-[#3e3b37] mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeFormats.bulletList 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Bullet List"
            >
              <ListIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeFormats.numberList 
                  ? 'bg-[#ea583a] text-white shadow-xs' 
                  : 'bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37]'
              }`}
              title="Numbered List"
            >
              <ListOrderedIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Blockquote ("") */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleBlockquote(); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37] flex items-center justify-center transition-all cursor-pointer"
              title="Quote block"
            >
              <QuoteIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Code (<>) */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleCodeBlock(); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37] flex items-center justify-center font-mono text-xs transition-all cursor-pointer"
              title="Code snippet"
            >
              <CodeIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Outdent */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('outdent'); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37] flex items-center justify-center transition-all cursor-pointer"
              title="Decrease Indent"
            >
              <Outdent className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Indent */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd('indent'); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-300 hover:text-white border border-[#3e3b37] flex items-center justify-center transition-all cursor-pointer"
              title="Increase Indent"
            >
              <Indent className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Clear Formatting */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleClearFormatting(); }}
              className="w-8 h-8 rounded-xl bg-[#282624] hover:bg-[#34312e] text-stone-400 hover:text-rose-400 border border-[#3e3b37] flex items-center justify-center transition-all cursor-pointer"
              title="Clear Formatting"
            >
              <RemoveFormatting className="w-4 h-4" strokeWidth={2.5} />
            </button>

          </div>
        </div>
      )}

      {/* Editor Editable Area (Light Paper Surface + High-Visibility Text Selection) */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        onSelect={checkActiveFormats}
        onKeyDown={(e) => {
          if (onKeyDown) onKeyDown(e);
        }}
        data-placeholder={placeholder}
        style={{ minHeight, userSelect: 'text', WebkitUserSelect: 'text' }}
        className="w-full bg-white p-4 sm:p-6 outline-none text-[#1c1917] text-sm sm:text-base leading-relaxed font-sans cursor-text focus:outline-none selection:bg-[#fed7aa] selection:text-[#7c2d12] overflow-y-auto max-h-[50vh] empty:before:content-[attr(data-placeholder)] empty:before:text-[#78716c] empty:before:pointer-events-none [&_*]:select-text [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-[#0c0a09] [&_h1]:my-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1c1917] [&_h2]:my-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#292524] [&_h3]:my-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#ea583a] [&_blockquote]:bg-[#f5f5f4] [&_blockquote]:text-[#44403c] [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-2 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 [&_a]:text-[#ea583a] [&_a]:underline [&_a]:font-bold"
      />

      {/* Link Insertion Modal Popover */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#1c1a18] text-white rounded-3xl border-2 border-[#383532] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2a28]">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#ea583a]" strokeWidth={2.5} />
                <span>Insert Hyperlink</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white cursor-pointer hover:bg-[#282624]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmLink} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-stone-400 mb-1 uppercase tracking-wider text-[11px]">Display Text</label>
                <input
                  type="text"
                  placeholder="e.g., Project Roadmap"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-[#242321] text-white px-3.5 py-2.5 rounded-xl border-2 border-[#383532] focus:outline-none focus:border-[#ea583a] font-medium"
                />
              </div>

              <div>
                <label className="block font-black text-stone-400 mb-1 uppercase tracking-wider text-[11px]">Destination URL *</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-[#242321] text-white px-3.5 py-2.5 rounded-xl border-2 border-[#383532] focus:outline-none focus:border-[#ea583a] font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-400 hover:text-white font-bold cursor-pointer hover:bg-[#282624]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!linkUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-[#ea583a] hover:bg-[#d84b2e] disabled:opacity-50 text-white font-black cursor-pointer transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
