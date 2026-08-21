import React from 'react';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Link as LinkIcon, 
  List as ListIcon, 
  ListOrdered as ListOrderedIcon, 
  Heading as HeadingIcon, 
  Quote as QuoteIcon, 
  Code as CodeIcon,
  Eye,
  Edit3
} from 'lucide-react';

export type FormatType = 'bold' | 'italic' | 'link' | 'bullet' | 'number' | 'heading' | 'quote' | 'code';

/**
 * Intelligent Markdown formatter that handles single-line, multi-line, 
 * toggle on/off, and cursor preservation.
 */
export function applyMarkdownFormat(
  text: string, 
  selectionStart: number, 
  selectionEnd: number, 
  formatType: FormatType
): { newText: string; newCursorStart: number; newCursorEnd: number } {
  const selectedText = text.substring(selectionStart, selectionEnd);
  
  // Find current line bounds if selection is collapsed
  const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
  let lineEnd = text.indexOf('\n', selectionEnd);
  if (lineEnd === -1) lineEnd = text.length;

  switch (formatType) {
    case 'bold': {
      if (selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4) {
        // Toggle OFF bold
        const unwrapped = selectedText.substring(2, selectedText.length - 2);
        const newText = text.substring(0, selectionStart) + unwrapped + text.substring(selectionEnd);
        return {
          newText,
          newCursorStart: selectionStart,
          newCursorEnd: selectionStart + unwrapped.length
        };
      }
      const replacement = selectedText ? `**${selectedText}**` : `**bold text**`;
      const newText = text.substring(0, selectionStart) + replacement + text.substring(selectionEnd);
      return {
        newText,
        newCursorStart: selectedText ? selectionStart : selectionStart + 2,
        newCursorEnd: selectedText ? selectionStart + replacement.length : selectionStart + replacement.length - 2
      };
    }

    case 'italic': {
      if (selectedText.startsWith('*') && selectedText.endsWith('*') && selectedText.length >= 2 && !selectedText.startsWith('**')) {
        // Toggle OFF italic
        const unwrapped = selectedText.substring(1, selectedText.length - 1);
        const newText = text.substring(0, selectionStart) + unwrapped + text.substring(selectionEnd);
        return {
          newText,
          newCursorStart: selectionStart,
          newCursorEnd: selectionStart + unwrapped.length
        };
      }
      const replacement = selectedText ? `*${selectedText}*` : `*italic text*`;
      const newText = text.substring(0, selectionStart) + replacement + text.substring(selectionEnd);
      return {
        newText,
        newCursorStart: selectedText ? selectionStart : selectionStart + 1,
        newCursorEnd: selectedText ? selectionStart + replacement.length : selectionStart + replacement.length - 1
      };
    }

    case 'link': {
      const isUrl = /^https?:\/\//i.test(selectedText.trim());
      let replacement = '';
      let cursorStart = selectionStart;
      let cursorEnd = selectionStart;

      if (isUrl) {
        replacement = `[link title](${selectedText.trim()})`;
        cursorStart = selectionStart + 1;
        cursorEnd = selectionStart + 11;
      } else if (selectedText) {
        replacement = `[${selectedText}](https://example.com)`;
        cursorStart = selectionStart + selectedText.length + 3;
        cursorEnd = selectionStart + replacement.length - 1;
      } else {
        replacement = `[link text](https://example.com)`;
        cursorStart = selectionStart + 1;
        cursorEnd = selectionStart + 10;
      }

      const newText = text.substring(0, selectionStart) + replacement + text.substring(selectionEnd);
      return { newText, newCursorStart: cursorStart, newCursorEnd: cursorEnd };
    }

    case 'bullet': {
      // Operate on full lines
      const beforeLines = text.substring(0, lineStart);
      const targetLines = text.substring(lineStart, lineEnd);
      const afterLines = text.substring(lineEnd);

      const lines = targetLines.split('\n');
      const allBulleted = lines.every(l => l.trimStart().startsWith('• ') || l.trimStart().startsWith('- ') || l.trimStart().startsWith('* '));

      let newLines: string[];
      if (allBulleted) {
        // Toggle OFF bullets
        newLines = lines.map(l => l.replace(/^\s*(•|-|\*)\s?/, ''));
      } else {
        // Toggle ON bullets
        newLines = lines.map(l => {
          // Remove numbering or existing markers first if present
          const cleaned = l.replace(/^\s*(\d+\.|•|-|\*)\s?/, '');
          return cleaned.trim() ? `• ${cleaned}` : `• `;
        });
      }

      const joined = newLines.join('\n');
      const newText = beforeLines + joined + afterLines;
      return {
        newText,
        newCursorStart: lineStart + joined.length,
        newCursorEnd: lineStart + joined.length
      };
    }

    case 'number': {
      // Operate on full lines
      const beforeLines = text.substring(0, lineStart);
      const targetLines = text.substring(lineStart, lineEnd);
      const afterLines = text.substring(lineEnd);

      const lines = targetLines.split('\n');
      const allNumbered = lines.every(l => /^\s*\d+\.\s/.test(l));

      let newLines: string[];
      if (allNumbered) {
        // Toggle OFF numbering
        newLines = lines.map(l => l.replace(/^\s*\d+\.\s?/, ''));
      } else {
        // Toggle ON numbering
        newLines = lines.map((l, idx) => {
          const cleaned = l.replace(/^\s*(\d+\.|•|-|\*)\s?/, '');
          return cleaned.trim() ? `${idx + 1}. ${cleaned}` : `${idx + 1}. `;
        });
      }

      const joined = newLines.join('\n');
      const newText = beforeLines + joined + afterLines;
      return {
        newText,
        newCursorStart: lineStart + joined.length,
        newCursorEnd: lineStart + joined.length
      };
    }

    case 'heading': {
      const beforeLines = text.substring(0, lineStart);
      const targetLines = text.substring(lineStart, lineEnd);
      const afterLines = text.substring(lineEnd);

      const lines = targetLines.split('\n');
      const allHeading = lines.every(l => l.startsWith('### '));

      let newLines: string[];
      if (allHeading) {
        newLines = lines.map(l => l.replace(/^###\s?/, ''));
      } else {
        newLines = lines.map(l => `### ${l.replace(/^#+\s?/, '')}`);
      }

      const joined = newLines.join('\n');
      const newText = beforeLines + joined + afterLines;
      return {
        newText,
        newCursorStart: lineStart + joined.length,
        newCursorEnd: lineStart + joined.length
      };
    }

    case 'quote': {
      const beforeLines = text.substring(0, lineStart);
      const targetLines = text.substring(lineStart, lineEnd);
      const afterLines = text.substring(lineEnd);

      const lines = targetLines.split('\n');
      const allQuoted = lines.every(l => l.startsWith('> '));

      let newLines: string[];
      if (allQuoted) {
        newLines = lines.map(l => l.replace(/^>\s?/, ''));
      } else {
        newLines = lines.map(l => `> ${l.replace(/^>\s?/, '')}`);
      }

      const joined = newLines.join('\n');
      const newText = beforeLines + joined + afterLines;
      return {
        newText,
        newCursorStart: lineStart + joined.length,
        newCursorEnd: lineStart + joined.length
      };
    }

    case 'code': {
      if (selectedText.startsWith('`') && selectedText.endsWith('`') && selectedText.length >= 2) {
        const unwrapped = selectedText.substring(1, selectedText.length - 1);
        const newText = text.substring(0, selectionStart) + unwrapped + text.substring(selectionEnd);
        return {
          newText,
          newCursorStart: selectionStart,
          newCursorEnd: selectionStart + unwrapped.length
        };
      }
      const replacement = selectedText ? `\`${selectedText}\`` : `\`code\``;
      const newText = text.substring(0, selectionStart) + replacement + text.substring(selectionEnd);
      return {
        newText,
        newCursorStart: selectedText ? selectionStart : selectionStart + 1,
        newCursorEnd: selectedText ? selectionStart + replacement.length : selectionStart + replacement.length - 1
      };
    }
  }
}

/**
 * Handles smart Enter key press to auto-continue bullet or numbered lists
 */
export function handleSmartKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  text: string,
  setText: (newText: string) => void,
  onSend?: () => void
): boolean {
  const textarea = e.currentTarget;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // 1. Send Shortcut: Cmd/Ctrl + Enter
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    if (onSend) onSend();
    return true;
  }

  // 2. Bold Shortcut: Cmd/Ctrl + B
  if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B')) {
    e.preventDefault();
    const result = applyMarkdownFormat(text, start, end, 'bold');
    setText(result.newText);
    setTimeout(() => {
      textarea.setSelectionRange(result.newCursorStart, result.newCursorEnd);
    }, 0);
    return true;
  }

  // 3. Italic Shortcut: Cmd/Ctrl + I
  if ((e.metaKey || e.ctrlKey) && (e.key === 'i' || e.key === 'I')) {
    e.preventDefault();
    const result = applyMarkdownFormat(text, start, end, 'italic');
    setText(result.newText);
    setTimeout(() => {
      textarea.setSelectionRange(result.newCursorStart, result.newCursorEnd);
    }, 0);
    return true;
  }

  // 4. Link Shortcut: Cmd/Ctrl + K
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    const result = applyMarkdownFormat(text, start, end, 'link');
    setText(result.newText);
    setTimeout(() => {
      textarea.setSelectionRange(result.newCursorStart, result.newCursorEnd);
    }, 0);
    return true;
  }

  // 5. Smart Enter key handling
  if (e.key === 'Enter' && !e.shiftKey) {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const currentLine = text.substring(lineStart, start);

    // Check Bullet item
    const bulletMatch = currentLine.match(/^(\s*)(•|-|\*)\s(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1];
      const content = bulletMatch[3];

      if (content.trim() === '') {
        // Line is ONLY bullet -> Exit bullet list
        e.preventDefault();
        const newText = text.substring(0, lineStart) + text.substring(start);
        setText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return true;
      } else {
        // Auto continue bullet
        e.preventDefault();
        const continuation = `\n${indent}• `;
        const newText = text.substring(0, start) + continuation + text.substring(end);
        setText(newText);
        const newPos = start + continuation.length;
        setTimeout(() => {
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return true;
      }
    }

    // Check Numbered item
    const numMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);
    if (numMatch) {
      const indent = numMatch[1];
      const num = parseInt(numMatch[2], 10);
      const content = numMatch[3];

      if (content.trim() === '') {
        // Line is ONLY number -> Exit numbered list
        e.preventDefault();
        const newText = text.substring(0, lineStart) + text.substring(start);
        setText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return true;
      } else {
        // Auto continue next number
        e.preventDefault();
        const continuation = `\n${indent}${num + 1}. `;
        const newText = text.substring(0, start) + continuation + text.substring(end);
        setText(newText);
        const newPos = start + continuation.length;
        setTimeout(() => {
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return true;
      }
    }

    // Check Blockquote item
    const quoteMatch = currentLine.match(/^(\s*)>\s(.*)$/);
    if (quoteMatch) {
      const indent = quoteMatch[1];
      const content = quoteMatch[2];

      if (content.trim() === '') {
        e.preventDefault();
        const newText = text.substring(0, lineStart) + text.substring(start);
        setText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return true;
      } else {
        e.preventDefault();
        const continuation = `\n${indent}> `;
        const newText = text.substring(0, start) + continuation + text.substring(end);
        setText(newText);
        const newPos = start + continuation.length;
        setTimeout(() => {
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return true;
      }
    }
  }

  return false;
}

/**
 * Markdown formatting toolbar component
 */
export const MarkdownToolbar: React.FC<{
  onFormat: (type: FormatType) => void;
  previewMode: boolean;
  onTogglePreview: (preview: boolean) => void;
  extraRightElements?: React.ReactNode;
}> = ({ onFormat, previewMode, onTogglePreview, extraRightElements }) => {
  return (
    <div className="bg-[#121110] border-2 border-b-0 border-[#33312e] rounded-t-2xl px-3 py-2 flex items-center justify-between flex-wrap gap-2 text-stone-200">
      
      {/* Left Formatting Tools */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
        
        {/* Bold */}
        <button
          type="button"
          onClick={() => onFormat('bold')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center font-bold text-sm text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Bold (⌘B / **text**)"
        >
          <span className="font-extrabold text-base">B</span>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => onFormat('italic')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center font-bold text-sm text-stone-200 hover:text-white italic transition-colors cursor-pointer"
          title="Italic (⌘I / *text*)"
        >
          <span className="italic font-serif text-base font-bold">I</span>
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={() => onFormat('link')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Insert Link (⌘K / [text](url))"
        >
          <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        <div className="w-px h-4 bg-[#2f2d2a] mx-0.5 sm:mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => onFormat('bullet')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Bullet List (• item)"
        >
          <ListIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => onFormat('number')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Numbered List (1. item)"
        >
          <ListOrderedIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        <div className="w-px h-4 bg-[#2f2d2a] mx-0.5 sm:mx-1" />

        {/* Heading */}
        <button
          type="button"
          onClick={() => onFormat('heading')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Heading (### title)"
        >
          <HeadingIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => onFormat('quote')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white transition-colors cursor-pointer"
          title="Blockquote (> text)"
        >
          <QuoteIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

        {/* Code */}
        <button
          type="button"
          onClick={() => onFormat('code')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-[#262422] flex items-center justify-center text-stone-200 hover:text-white font-mono text-xs transition-colors cursor-pointer"
          title="Code snippet (`code`)"
        >
          <CodeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>

      </div>

      {/* Right Controls: [Write | Preview Tabs] + Extra buttons (AI / Attach) */}
      <div className="flex items-center gap-2">
        
        {/* Write / Preview Tab Switcher */}
        <div className="inline-flex p-0.5 bg-[#1e1d1b] rounded-xl border border-[#383532] shadow-xs">
          <button
            type="button"
            onClick={() => onTogglePreview(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              !previewMode 
                ? 'bg-[#ea583a] text-white shadow-xs' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => onTogglePreview(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              previewMode 
                ? 'bg-[#ea583a] text-white shadow-xs' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>

        {extraRightElements}
      </div>

    </div>
  );
};

/**
 * Rich Markdown live preview renderer component with full formatted styling
 */
export const MarkdownPreview: React.FC<{
  content: string;
  placeholder?: string;
  className?: string;
}> = ({ content, placeholder = 'Nothing to preview yet...', className = '' }) => {
  if (!content.trim()) {
    return (
      <div className={`w-full min-h-[160px] bg-[#242321] text-stone-500 italic p-5 rounded-b-2xl border-2 border-[#33312e] text-sm ${className}`}>
        {placeholder}
      </div>
    );
  }

  // Parse text into formatted blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className={`w-full min-h-[160px] bg-[#242321] text-stone-100 text-sm sm:text-base p-5 rounded-b-2xl border-2 border-[#33312e] font-sans leading-relaxed space-y-4 select-text ${className}`}>
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n');

        // Check if block is a Heading
        if (block.startsWith('#')) {
          const match = block.match(/^(#+)\s*(.*)$/);
          if (match) {
            const level = match[1].length;
            const headingText = match[2];
            if (level === 1) {
              return <h1 key={bIdx} className="text-2xl font-black text-white">{renderInlineFormatting(headingText)}</h1>;
            } else if (level === 2) {
              return <h2 key={bIdx} className="text-xl font-bold text-white">{renderInlineFormatting(headingText)}</h2>;
            } else {
              return <h3 key={bIdx} className="text-base sm:text-lg font-black text-[#ea583a]">{renderInlineFormatting(headingText)}</h3>;
            }
          }
        }

        // Check if block is a Blockquote
        if (lines.every(l => l.startsWith('>') || l.trim() === '')) {
          const quoteContent = lines.map(l => l.replace(/^>\s?/, '')).join('\n');
          return (
            <blockquote key={bIdx} className="border-l-4 border-[#ea583a] pl-4 py-1.5 bg-[#181716] rounded-r-xl italic text-stone-300">
              {renderInlineFormatting(quoteContent)}
            </blockquote>
          );
        }

        // Check if block is a Bullet List
        if (lines.some(l => l.trimStart().startsWith('•') || l.trimStart().startsWith('-') || l.trimStart().startsWith('*'))) {
          return (
            <ul key={bIdx} className="space-y-1.5 pl-2">
              {lines.map((l, lIdx) => {
                const cleaned = l.replace(/^\s*(•|-|\*)\s?/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-stone-200">
                    <span className="text-[#ea583a] font-black leading-none mt-1.5">•</span>
                    <span className="flex-1">{renderInlineFormatting(cleaned)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if block is a Numbered List
        if (lines.some(l => /^\s*\d+\.\s/.test(l))) {
          return (
            <ol key={bIdx} className="space-y-1.5 pl-1">
              {lines.map((l, lIdx) => {
                const match = l.match(/^\s*(\d+)\.\s*(.*)$/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const textPart = match ? match[2] : l;
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-stone-200">
                    <span className="w-5 h-5 rounded-md bg-[#33312e] text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {num}
                    </span>
                    <span className="flex-1">{renderInlineFormatting(textPart)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Standard Paragraph with Line Breaks
        return (
          <p key={bIdx} className="whitespace-pre-line text-stone-200">
            {renderInlineFormatting(block)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Helper to render inline Bold, Italic, Links, Code snippets
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex to split by links [text](url), bold **text**, italic *text*, and code `code`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Link [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={keyIdx++}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#ea583a] hover:underline font-bold inline-flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.substring(linkMatch[0].length);
      continue;
    }

    // 2. Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-extrabold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.substring(boldMatch[0].length);
      continue;
    }

    // 3. Italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic text-stone-300 font-serif">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.substring(italicMatch[0].length);
      continue;
    }

    // 4. Code `text`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code key={keyIdx++} className="px-1.5 py-0.5 rounded bg-[#181716] border border-[#383532] text-amber-300 font-mono text-xs font-bold">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.substring(codeMatch[0].length);
      continue;
    }

    // Plain character
    const nextSpecial = remaining.search(/(\[|\*\*|\*|`)/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Unmatched marker character, take 1 char
      parts.push(remaining[0]);
      remaining = remaining.substring(1);
    } else {
      parts.push(remaining.substring(0, nextSpecial));
      remaining = remaining.substring(nextSpecial);
    }
  }

  return parts;
}
