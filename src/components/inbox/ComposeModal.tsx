import React, { useState, useRef, useEffect } from 'react';
import { 
  PenSquare, 
  X, 
  Send, 
  Paperclip, 
  Sparkles, 
  Check, 
  Trash2,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  File,
  ShieldCheck,
  ChevronDown,
  Clock
} from 'lucide-react';
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';

export interface EmailAttachment {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  type: string;
  previewUrl?: string;
}

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMailboxes: string[];
  activeMailboxEmail: string;
  onSendOutbound: (data: {
    from: string;
    to: string;
    subject: string;
    body: string;
    attachments?: EmailAttachment[];
    cc?: string;
    bcc?: string;
  }) => void;
  initialDraft?: {
    from?: string;
    to?: string;
    subject?: string;
    body?: string;
    attachments?: EmailAttachment[];
    cc?: string;
    bcc?: string;
  } | null;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  availableMailboxes,
  activeMailboxEmail,
  onSendOutbound,
  initialDraft
}) => {
  const [fromAddress, setFromAddress] = useState(activeMailboxEmail);
  const [toAddress, setToAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [ccAddress, setCcAddress] = useState('');
  const [bccAddress, setBccAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showAttachmentWindow, setShowAttachmentWindow] = useState(false);
  const [showAiDrafts, setShowAiDrafts] = useState(false);
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(true);
  const [showSendOptions, setShowSendOptions] = useState(false);

  const editorRef = useRef<RichTextEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft if initialDraft is provided (e.g. when user clicks Undo Send)
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.from) setFromAddress(initialDraft.from);
      if (initialDraft.to) setToAddress(initialDraft.to);
      if (initialDraft.subject) setSubject(initialDraft.subject);
      if (initialDraft.body) {
        setBodyHtml(initialDraft.body);
        setBodyText(initialDraft.body.replace(/<[^>]*>/g, ''));
        if (editorRef.current) {
          editorRef.current.setHtml(initialDraft.body);
        }
      }
      if (initialDraft.attachments) setAttachments(initialDraft.attachments);
      if (initialDraft.cc) {
        setCcAddress(initialDraft.cc);
        setShowCcBcc(true);
      }
      if (initialDraft.bcc) {
        setBccAddress(initialDraft.bcc);
        setShowCcBcc(true);
      }
    } else if (isOpen) {
      setFromAddress(activeMailboxEmail);
    }
  }, [initialDraft, isOpen, activeMailboxEmail]);

  // Global keydown handler for Cmd+Enter / Ctrl+Enter and Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      } else if (e.key === 'Escape' && !showAttachmentWindow && !showAiDrafts) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAttachmentWindow, showAiDrafts, toAddress, subject, bodyHtml, bodyText, fromAddress, attachments, ccAddress, bccAddress]);

  if (!isOpen) return null;

  // AI Smart Draft templates (Formatted rich HTML)
  const handleApplyAiDraft = (type: 'outreach' | 'status' | 'proposal' | 'question' | 'sync') => {
    setShowAiDrafts(false);
    let htmlContent = '';

    if (type === 'outreach') {
      if (!subject.trim()) setSubject('Introduction & Collaboration Inquiry');
      htmlContent = `<p>Hi,</p><p>I hope this email finds you well.</p><p>I am reaching out to introduce our team and discuss potential opportunities for collaboration. We have been closely following your recent work and believe there is strong alignment between our goals.</p><p>Would you have 15 minutes next week for a brief introductory call?</p><p>Best regards,</p>`;
    } else if (type === 'status') {
      if (!subject.trim()) setSubject('Project Status & Key Deliverables Update');
      htmlContent = `<p>Hi team,</p><p>Here is a quick summary of our progress and key milestones for this week:</p><h3>Completed Milestones</h3><ul><li>Core architecture design and security review finalized</li><li>Initial integration pipeline deployed and validated</li></ul><h3>Next Priorities</h3><ul><li>User acceptance testing and workflow benchmarks</li><li>Final documentation handoff</li></ul><p>Please let me know if you have any questions or items to flag.</p><p>Best,</p>`;
    } else if (type === 'proposal') {
      if (!subject.trim()) setSubject('Project Proposal & Scope Overview');
      htmlContent = `<p>Hi,</p><p>Thank you for the opportunity to submit our proposal. Following our recent discussion, here is an outline of the proposed scope and deliverables:</p><blockquote style="border-left: 3px solid #cbd5e1; padding-left: 12px; margin: 8px 0; color: #475569; font-style: italic;">"To deliver a streamlined, distraction-free workflow with enterprise-grade reliability."</blockquote><h3>Proposed Deliverables</h3><ol><li>Complete system audit and roadmap alignment</li><li>Implementation of key workflow enhancements</li><li>Verification, regression testing, and sign-off</li></ol><p>Attached you'll find the comprehensive scope breakdown. Looking forward to your feedback.</p><p>Warm regards,</p>`;
    } else if (type === 'question') {
      if (!subject.trim()) setSubject('Quick inquiry regarding project timeline');
      htmlContent = `<p>Hi,</p><p>Quick check-in regarding the upcoming timeline. Could you confirm if we are still on track for the target milestone next Friday, or if any adjustments are needed on our end?</p><p>Thanks,</p>`;
    } else if (type === 'sync') {
      if (!subject.trim()) setSubject('Quick Sync / Discussion Invitation');
      htmlContent = `<p>Hi,</p><p>Would you be open to a quick 20-minute sync this week to align on next steps? Here are a few times that work well on my end:</p><ul><li>Tuesday, 2:00 PM – 2:30 PM EST</li><li>Thursday, 10:30 AM – 11:00 AM EST</li><li>Friday, 1:00 PM – 1:30 PM EST</li></ul><p>Let me know if any of these suit your schedule, or feel free to propose an alternative.</p><p>Best,</p>`;
    }

    if (editorRef.current) {
      editorRef.current.setHtml(htmlContent);
      editorRef.current.focus();
    }
  };

  // Handle file uploads
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newAttachments: EmailAttachment[] = Array.from(files).map(file => {
      const sizeMb = file.size / (1024 * 1024);
      const sizeStr = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
      
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: sizeStr,
        sizeBytes: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachmentWindow(true);
  };

  const handleAddSampleAttachment = (sampleType: 'pdf' | 'img' | 'doc') => {
    let sample: EmailAttachment;
    if (sampleType === 'pdf') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Q3_Financial_Summary_Report.pdf',
        size: '1.8 MB',
        sizeBytes: 1800000,
        type: 'application/pdf'
      };
    } else if (sampleType === 'img') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Product_Launch_Banner_2026.png',
        size: '2.4 MB',
        sizeBytes: 2400000,
        type: 'image/png',
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
      };
    } else {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Product_Requirements_Spec_v3.docx',
        size: '640 KB',
        sizeBytes: 640000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    }
    setAttachments(prev => [...prev, sample]);
    setShowAttachmentWindow(true);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSend = () => {
    const finalHtml = editorRef.current?.getHtml() || bodyHtml;
    const finalRaw = editorRef.current?.getText() || bodyText;
    
    if (!toAddress.trim() || !subject.trim() || (!finalHtml.trim() && !finalRaw.trim())) return;
    setIsSending(true);

    onSendOutbound({
      from: fromAddress,
      to: toAddress.trim(),
      subject: subject.trim(),
      body: finalHtml.trim() || finalRaw.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
      cc: ccAddress.trim() || undefined,
      bcc: bccAddress.trim() || undefined
    });
    setIsSending(false);
    onClose();
  };

  const totalAttachmentSizeBytes = attachments.reduce((acc, a) => acc + a.sizeBytes, 0);
  const totalAttachmentMb = (totalAttachmentSizeBytes / (1024 * 1024)).toFixed(1);
  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;
  const charCount = bodyText.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[94vh] bg-[#181716] rounded-3xl border-2 border-[#2e2c2a] shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150 text-stone-100 select-text">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#282725] flex items-center justify-between bg-[#141312] select-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#ea583a] text-white flex items-center justify-center font-black text-xs shadow-xs">
              <PenSquare className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-base font-black text-white leading-none block">
                Compose Outbound Message
              </span>
              <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
                Direct Outbound · Zero Tracker
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#252422] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Compose Form Fields (Scrollable area) */}
        <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* From Address Selector */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="w-14 font-black text-stone-400 text-right select-none">From:</span>
            <select
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="flex-1 bg-[#242321] text-white font-sans font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-[#33312e] focus:outline-none focus:border-[#ea583a]"
            >
              {availableMailboxes.map((mbx) => (
                <option key={mbx} value={mbx} className="font-sans font-semibold">
                  {mbx}
                </option>
              ))}
            </select>
          </div>

          {/* To Field */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="w-14 font-black text-stone-400 text-right select-none">To:</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="email"
                placeholder="recipient@example.com"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="flex-1 bg-[#242321] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-[#33312e] focus:outline-none focus:border-[#ea583a] placeholder:text-stone-500 font-medium select-text"
              />
              <button
                type="button"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className={`text-xs font-black px-2.5 py-2 rounded-xl transition-colors cursor-pointer select-none ${
                  showCcBcc ? 'bg-[#2f2d2a] text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-[#262523]'
                }`}
              >
                Cc/Bcc
              </button>
            </div>
          </div>

          {/* Optional CC/BCC fields */}
          {showCcBcc && (
            <div className="space-y-2 animate-in fade-in duration-100">
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="w-14 font-black text-stone-400 text-right select-none">Cc:</span>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  value={ccAddress}
                  onChange={(e) => setCcAddress(e.target.value)}
                  className="flex-1 bg-[#242321] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-[#33312e] focus:outline-none focus:border-[#ea583a] placeholder:text-stone-500 font-medium select-text"
                />
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="w-14 font-black text-stone-400 text-right select-none">Bcc:</span>
                <input
                  type="email"
                  placeholder="archive@example.com"
                  value={bccAddress}
                  onChange={(e) => setBccAddress(e.target.value)}
                  className="flex-1 bg-[#242321] text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-[#33312e] focus:outline-none focus:border-[#ea583a] placeholder:text-stone-500 font-medium select-text"
                />
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="w-14 font-black text-stone-400 text-right select-none">Subject:</span>
            <input
              type="text"
              placeholder="What's this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-[#242321] text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border-2 border-[#33312e] focus:outline-none focus:border-[#ea583a] placeholder:text-stone-500 select-text"
            />
          </div>

          {/* Clean White WYSIWYG Rich Text Editor */}
          <div className="pt-2">
            <RichTextEditor
              ref={editorRef}
              initialHtml={bodyHtml}
              placeholder="Write your email here..."
              minHeight="220px"
              showToolbar={showFormattingToolbar}
              onChange={(html, text) => {
                setBodyHtml(html);
                setBodyText(text);
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          {/* Inline Attached Files Chips (Direct view) */}
          {attachments.length > 0 && (
            <div className="space-y-2 pt-1 bg-[#141312] p-3.5 rounded-2xl border-2 border-[#2b2927]">
              <div className="text-xs font-bold text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#ea583a]" />
                  Attached files ({attachments.length} · {totalAttachmentMb} MB):
                </span>
                <button
                  type="button"
                  onClick={() => setShowAttachmentWindow(true)}
                  className="text-[#ea583a] hover:underline cursor-pointer font-bold"
                >
                  + Add more files
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="bg-[#1e1d1b] border-2 border-[#383532] rounded-xl px-3 py-1.5 flex items-center gap-2.5 text-xs text-stone-200 shadow-sm group hover:border-[#4a4743] transition-colors"
                  >
                    {att.previewUrl ? (
                      <img src={att.previewUrl} alt={att.name} className="w-6 h-6 rounded object-cover border border-stone-700" />
                    ) : att.type.includes('pdf') || att.name.endsWith('.pdf') ? (
                      <FileText className="w-4 h-4 text-rose-400" />
                    ) : att.name.endsWith('.docx') || att.name.endsWith('.doc') ? (
                      <FileText className="w-4 h-4 text-blue-400" />
                    ) : (
                      <File className="w-4 h-4 text-amber-400" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold truncate max-w-[150px] sm:max-w-[200px] text-white">{att.name}</span>
                      <span className="text-[10px] text-stone-400 font-medium">{att.size}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="p-1 rounded-md text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATTACHMENT WINDOW / MODAL PANEL */}
          {showAttachmentWindow && (
            <div 
              className="p-4 rounded-2xl bg-[#141312] border-2 border-[#ea583a]/40 space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#2d2b28]">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#ea583a]" strokeWidth={2.5} />
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Attachment Manager ({attachments.length} Files • {totalAttachmentMb} MB / 25 MB Limit)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAttachmentWindow(false)}
                  className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-[#252422] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5 ${
                  isDraggingFile 
                    ? 'border-[#ea583a] bg-[#ea583a]/10 text-white' 
                    : 'border-[#383633] hover:border-[#ea583a] bg-[#1a1917] text-stone-400 hover:text-stone-200'
                }`}
              >
                <UploadCloud className="w-7 h-7 text-stone-400" />
                <div className="text-xs sm:text-sm font-bold">
                  Drag and drop files here, or click to browse
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  Supports PDF, PNG, JPG, DOCX, XLSX, ZIP (Up to 25 MB)
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Quick Sample Attachments */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Quick Add Sample Files:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddSampleAttachment('pdf')}
                    className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>+ Financial_Summary.pdf (1.8 MB)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSampleAttachment('img')}
                    className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Launch_Banner.png (2.4 MB)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSampleAttachment('doc')}
                    className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>+ Requirements_Spec.docx (640 KB)</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowAttachmentWindow(false)}
                  className="px-4 py-1.5 rounded-xl bg-[#282624] hover:bg-[#33312e] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions Bar */}
        <div className="p-3 sm:p-4 bg-[#141312] border-t border-[#282725] flex items-center justify-between flex-wrap gap-2 select-none">
          
          {/* Left Actions: Send Email pill, Save draft, Paperclip, "A" format toggle, Smart Draft */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            
            {/* Primary Coral Send email Split Pill */}
            <div className="relative inline-flex items-stretch rounded-full shadow-md">
              <button
                type="button"
                disabled={isSending || !toAddress.trim() || !subject.trim() || (!bodyHtml.trim() && !bodyText.trim())}
                onClick={handleSend}
                className="h-10 px-4 sm:px-5 rounded-l-full bg-[#ea583a] hover:bg-[#d84b2e] active:brightness-95 disabled:opacity-50 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSending ? (
                  <span>Sending...</span>
                ) : sentSuccess ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={3} />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                    <span>Send email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSendOptions(!showSendOptions)}
                className="h-10 px-3 rounded-r-full bg-[#d84b2e] hover:bg-[#c23f24] text-white text-xs border-l border-white/20 transition-colors cursor-pointer flex items-center justify-center"
                title="More send options"
              >
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>

              {/* Send options popover */}
              {showSendOptions && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSendOptions(false)} />
                  <div className="absolute bottom-full mb-2 left-0 w-56 bg-[#1c1a18] rounded-2xl border-2 border-[#383532] shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => { setShowSendOptions(false); handleSend(); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252422] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#ea583a]" strokeWidth={2.5} />
                      <span>Send immediately</span>
                    </button>
                    <button
                      onClick={() => { setShowSendOptions(false); handleSend(); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252422] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                      <span>Send tomorrow at 8 AM</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Save Draft Pill */}
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-full bg-[#22201e] hover:bg-[#2e2b28] text-stone-200 text-xs sm:text-sm font-bold border-2 border-[#383532] transition-colors cursor-pointer flex items-center justify-center"
            >
              Save draft
            </button>

            {/* Paperclip Attach Icon */}
            <button
              type="button"
              onClick={() => setShowAttachmentWindow(!showAttachmentWindow)}
              className={`h-10 px-3 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                attachments.length > 0 
                  ? 'bg-[#ea583a]/20 text-[#ea583a] border-2 border-[#ea583a]/40' 
                  : 'bg-[#22201e] text-stone-400 hover:text-white hover:bg-[#2e2b28] border-2 border-[#383532]'
              }`}
              title="Attach Files"
            >
              <Paperclip className="w-4 h-4" strokeWidth={2.5} />
              {attachments.length > 0 && <span className="text-[11px] font-black">({attachments.length})</span>}
            </button>

            {/* "A" Formatting Toolbar Toggle */}
            <button
              type="button"
              onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border-2 ${
                showFormattingToolbar
                  ? 'bg-[#ea583a] text-white border-[#ea583a] shadow-xs'
                  : 'bg-[#22201e] text-stone-400 hover:text-white hover:bg-[#2e2b28] border-[#383532]'
              }`}
              title="Toggle Formatting Toolbar"
            >
              <span className="font-black text-sm underline decoration-2 underline-offset-2">A</span>
            </button>

            {/* AI Smart Draft Button */}
            <div className="relative">
              <button
                id="compose-ai-btn"
                type="button"
                onClick={() => setShowAiDrafts(!showAiDrafts)}
                className="h-10 px-3.5 rounded-full bg-[#252320] hover:bg-[#34302c] text-amber-300 border-2 border-[#443e38] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="AI Smart Templates"
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Smart Draft</span>
              </button>

              {showAiDrafts && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAiDrafts(false)} />
                  <div id="compose-ai-dropdown" className="absolute bottom-full mb-2 left-0 w-64 bg-[#1c1a18] rounded-2xl border-2 border-[#383532] shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-1 font-bold text-stone-400 text-[11px] uppercase tracking-wider">
                      Choose Smart Template:
                    </div>
                    <button
                      onClick={() => handleApplyAiDraft('outreach')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>🌟 Introductory Outreach</span>
                    </button>
                    <button
                      onClick={() => handleApplyAiDraft('status')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>📋 Project Status Update</span>
                    </button>
                    <button
                      onClick={() => handleApplyAiDraft('proposal')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>🤝 Formal Proposal & Scope</span>
                    </button>
                    <button
                      onClick={() => handleApplyAiDraft('question')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>❓ Quick Question / Check-in</span>
                    </button>
                    <button
                      onClick={() => handleApplyAiDraft('sync')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>📅 Meeting Sync Invitation</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Right: Discard / Trash icon */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-400 font-sans hidden md:block">
              <kbd className="px-2 py-0.5 rounded bg-[#181716] border border-[#383532] text-stone-300 font-bold text-[11px]">⌘+Enter</kbd>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 border-2 border-transparent hover:border-rose-900/40 transition-colors cursor-pointer flex items-center justify-center"
              title="Discard draft"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

