import React, { useState, useEffect, useRef } from 'react';
import { InboxEmail, MailboxCategory } from '../../types';
import { 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronUp,
  PenSquare, 
  Paperclip, 
  ArrowLeft, 
  Check, 
  Archive, 
  Trash2, 
  MoreHorizontal, 
  Reply, 
  Star, 
  Clock, 
  Bookmark, 
  Send, 
  CornerUpLeft,
  CheckCircle2,
  Shield,
  Layers,
  Receipt,
  X,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  File,
  Copy,
  RotateCcw,
  Undo2,
  Type,
  Users,
  ReplyAll,
  Forward,
  Tag,
  StickyNote,
  Bell,
  BellRing,
  Printer,
  Plus,
  Edit3,
  Save,
  Pin
} from 'lucide-react';
import { EmailAttachment } from './ComposeModal';
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';
import { EmailContentRenderer } from './EmailContentRenderer';

interface ImboxViewProps {
  emails: InboxEmail[];
  selectedEmail: InboxEmail | null;
  onSelectEmail: (email: InboxEmail | null) => void;
  onToggleReplyLater: (emailId: string) => void;
  onToggleSetAside: (emailId: string) => void;
  onAddClipNote: (emailId: string, noteText: string) => void;
  onMoveCategory: (emailId: string, category: 'imbox' | 'feed' | 'papertrail') => void;
  onScreenOutSender: (senderEmail: string, emailId: string) => void;
  onSendReply: (emailId: string, replyText: string) => void;
  onDeleteEmail: (emailId: string) => void;
  onMarkDone?: (emailId: string) => void;
  onArchive?: (emailId: string) => void;
  onRestoreEmail?: (emailId: string) => void;
  onPermanentDelete?: (emailId: string) => void;
  onEmptyTrash?: () => void;
  onToggleStar: (emailId: string) => void;
  onOpenCompose?: () => void;
  searchQuery?: string;
  onTabSwitch?: (tab: MailboxCategory) => void;
  pendingScreenerCount?: number;
  replyLaterCount?: number;
  setAsideCount?: number;
  clipsCount?: number;
  onOpenReplyLater?: () => void;
  onOpenSetAside?: () => void;
  onOpenClips?: () => void;
  availableMailboxes?: string[];
  restoredReplyDraft?: { emailId: string; body: string; attachments?: EmailAttachment[] } | null;
  onMarkUnread?: (emailId: string) => void;
  onForwardEmail?: (email: InboxEmail) => void;
  onUpdateLabels?: (emailId: string, labels: string[]) => void;
  onToggleNotification?: (emailId: string) => void;
  onDeleteClipNote?: (emailId: string, noteId: string) => void;
}

export const ImboxView: React.FC<ImboxViewProps> = ({
  emails,
  selectedEmail,
  onSelectEmail,
  onToggleReplyLater,
  onToggleSetAside,
  onAddClipNote,
  onMoveCategory,
  onScreenOutSender,
  onSendReply,
  onDeleteEmail,
  onMarkDone,
  onArchive,
  onRestoreEmail,
  onPermanentDelete,
  onEmptyTrash,
  onToggleStar,
  onOpenCompose,
  searchQuery = '',
  onTabSwitch,
  pendingScreenerCount = 0,
  replyLaterCount = 0,
  setAsideCount = 0,
  clipsCount = 0,
  onOpenReplyLater,
  onOpenSetAside,
  onOpenClips,
  availableMailboxes = ['mehmet@sendline.io', 'support@minimalstudio.design', 'billing@acmedtc.com'],
  restoredReplyDraft,
  onMarkUnread,
  onForwardEmail,
  onUpdateLabels,
  onToggleNotification,
  onDeleteClipNote
}) => {
  const [activeSubFilter, setActiveSubFilter] = useState<'inbox' | 'reply_later' | 'set_aside' | 'done' | 'spam' | 'archived' | 'trash'>('inbox');
  const [selectedAddressFilter, setSelectedAddressFilter] = useState<string>('all');

  // Reply Composer State in Thread View
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [isReplyAll, setIsReplyAll] = useState(false);
  const [toRecipients, setToRecipients] = useState<string[]>([]);
  const [ccRecipients, setCcRecipients] = useState<string[]>([]);
  const [bccRecipients, setBccRecipients] = useState<string[]>([]);
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [showRecipientDetails, setShowRecipientDetails] = useState(true);
  const [replyHtml, setReplyHtml] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyToolbar, setShowReplyToolbar] = useState(true);
  const [replyAttachments, setReplyAttachments] = useState<EmailAttachment[]>([]);
  const [showReplyAttachmentWindow, setShowReplyAttachmentWindow] = useState(false);
  const [isDraggingReplyFile, setIsDraggingReplyFile] = useState(false);
  const [showReplyAiDrafts, setShowReplyAiDrafts] = useState(false);
  const [showReplySendOptions, setShowReplySendOptions] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [openMsgMenuId, setOpenMsgMenuId] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Labels and Note to Self state
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [noteInputText, setNoteInputText] = useState('');

  const availablePresetLabels = ['VIP', 'Urgent', 'Client', 'Design', 'Finance', 'Project', 'Follow-up', 'Personal'];

  const replyEditorRef = useRef<RichTextEditorRef>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize reply recipients and subject when selectedEmail or reply mode changes
  useEffect(() => {
    if (selectedEmail) {
      setToRecipients([selectedEmail.senderEmail]);
      if (isReplyAll) {
        setCcRecipients(['team@minimalstudio.design']);
      } else {
        setCcRecipients([]);
      }
      setBccRecipients([]);
      const subj = selectedEmail.subject.startsWith('Re:')
        ? selectedEmail.subject
        : `Re: ${selectedEmail.subject}`;
      setReplySubject(subj);
    }
  }, [selectedEmail?.id, isReplyAll]);

  const handleAddRecipient = (type: 'to' | 'cc' | 'bcc', value: string) => {
    const clean = value.trim().replace(/,/g, '');
    if (!clean) return;
    if (type === 'to') {
      if (!toRecipients.includes(clean)) setToRecipients([...toRecipients, clean]);
      setToInput('');
    } else if (type === 'cc') {
      if (!ccRecipients.includes(clean)) setCcRecipients([...ccRecipients, clean]);
      setCcInput('');
    } else if (type === 'bcc') {
      if (!bccRecipients.includes(clean)) setBccRecipients([...bccRecipients, clean]);
      setBccInput('');
    }
  };

  const handleRemoveRecipient = (type: 'to' | 'cc' | 'bcc', emailToRemove: string) => {
    if (type === 'to') {
      setToRecipients(toRecipients.filter(e => e !== emailToRemove));
    } else if (type === 'cc') {
      setCcRecipients(ccRecipients.filter(e => e !== emailToRemove));
    } else if (type === 'bcc') {
      setBccRecipients(bccRecipients.filter(e => e !== emailToRemove));
    }
  };

  // Restore reply draft if user clicked "Undo Send" on reply
  useEffect(() => {
    if (restoredReplyDraft && selectedEmail && restoredReplyDraft.emailId === selectedEmail.id) {
      setReplyHtml(restoredReplyDraft.body);
      setReplyText(restoredReplyDraft.body.replace(/<[^>]*>/g, ''));
      if (replyEditorRef.current) {
        replyEditorRef.current.setHtml(restoredReplyDraft.body);
      }
      if (restoredReplyDraft.attachments) {
        setReplyAttachments(restoredReplyDraft.attachments);
      }
      setShowReplyComposer(true);
    }
  }, [restoredReplyDraft, selectedEmail]);

  // Global click-outside listener to dismiss More menus, Attachment window, and AI draft popups when clicking anywhere on page
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close bottom dock more menu if clicking outside
      if (!target.closest('#dock-more-menu') && !target.closest('#dock-more-btn')) {
        setShowMoreActions(false);
      }

      // Close message header more menu if clicking outside
      if (!target.closest('.message-more-menu') && !target.closest('.message-more-btn')) {
        setOpenMsgMenuId(null);
      }

      // Close reply attachment window if clicking outside
      if (!target.closest('#reply-attachment-window') && !target.closest('#reply-attachment-btn') && !target.closest('#reply-attachment-btn-toolbar')) {
        setShowReplyAttachmentWindow(false);
      }

      // Close AI drafts dropdown if clicking outside
      if (!target.closest('#reply-ai-dropdown') && !target.closest('#reply-ai-btn')) {
        setShowReplyAiDrafts(false);
      }

      // Close labels modal if clicking outside
      if (!target.closest('#labels-popover') && !target.closest('.labels-trigger-btn')) {
        setShowLabelsModal(false);
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Hotkey support (R for reply, Shift+R for reply all, E for done, A for archive, M for more)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only listen when in thread view and not typing inside input/textarea/contentEditable
      if (!selectedEmail) return;
      
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('[contenteditable="true"]') ||
          target.closest('.rich-text-editor') ||
          target.closest('#reply-composer-container') ||
          target.closest('#note-to-self-container'))
      ) {
        // If typing inside an editor or input, only allow Escape or Cmd/Ctrl+Enter
        if (e.key === 'Escape') {
          if (showReplyAttachmentWindow) {
            setShowReplyAttachmentWindow(false);
          } else if (showReplyAiDrafts) {
            setShowReplyAiDrafts(false);
          } else if (showLabelsModal) {
            setShowLabelsModal(false);
          }
        }
        return;
      }

      if (e.key === 'R' && e.shiftKey) {
        e.preventDefault();
        setIsReplyAll(true);
        setShowReplyComposer(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsReplyAll(false);
        setShowReplyComposer(true);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        handleMarkDone(selectedEmail.id);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleArchive(selectedEmail.id);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setShowMoreActions(prev => !prev);
      } else if (e.key === 'Escape') {
        if (showReplyAttachmentWindow) {
          setShowReplyAttachmentWindow(false);
        } else if (showReplyAiDrafts) {
          setShowReplyAiDrafts(false);
        } else if (showLabelsModal) {
          setShowLabelsModal(false);
        } else if (openMsgMenuId) {
          setOpenMsgMenuId(null);
        } else if (showMoreActions) {
          setShowMoreActions(false);
        } else if (showReplyComposer) {
          setShowReplyComposer(false);
        } else {
          onSelectEmail(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmail, showReplyComposer, showReplyAttachmentWindow, showReplyAiDrafts, openMsgMenuId, showMoreActions, showLabelsModal]);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 2500);
  };

  const handleMarkDone = (emailId: string) => {
    if (onMarkDone) {
      onMarkDone(emailId);
    } else {
      showToast('Thread marked as Done');
      onSelectEmail(null);
    }
  };

  const handleArchive = (emailId: string) => {
    if (onArchive) {
      onArchive(emailId);
    } else {
      showToast('Thread Archived');
      onSelectEmail(null);
    }
  };

  const handleForwardEmailAction = (email: InboxEmail) => {
    if (onForwardEmail) {
      onForwardEmail(email);
    } else {
      showToast('Opening forward compose...');
    }
  };

  const handleMarkUnreadAction = () => {
    if (!selectedEmail) return;
    if (onMarkUnread) {
      onMarkUnread(selectedEmail.id);
    } else {
      showToast('Marked as unread');
      onSelectEmail(null);
    }
  };

  const handleToggleNotificationAction = () => {
    if (!selectedEmail) return;
    if (onToggleNotification) {
      onToggleNotification(selectedEmail.id);
    }
    showToast(selectedEmail.hasNotification ? 'Push notifications disabled' : 'Push notifications enabled for this thread');
  };

  const handlePrintThreadAction = () => {
    window.print();
  };

  const handleToggleLabel = (label: string) => {
    if (!selectedEmail) return;
    const current = selectedEmail.labels || selectedEmail.tags || [];
    let updated: string[];
    if (current.includes(label)) {
      updated = current.filter(l => l !== label);
    } else {
      updated = [...current, label];
    }
    if (onUpdateLabels) {
      onUpdateLabels(selectedEmail.id, updated);
    }
    showToast(`Labels updated: ${updated.join(', ') || 'None'}`);
  };

  const handleAddNewCustomLabel = () => {
    if (!selectedEmail || !newCustomLabel.trim()) return;
    const label = newCustomLabel.trim();
    const current = selectedEmail.labels || selectedEmail.tags || [];
    if (!current.includes(label)) {
      const updated = [...current, label];
      if (onUpdateLabels) {
        onUpdateLabels(selectedEmail.id, updated);
      }
      showToast(`Added label "${label}"`);
    }
    setNewCustomLabel('');
  };

  const handleSaveNoteToSelf = () => {
    if (!selectedEmail || !noteInputText.trim()) return;
    onAddClipNote(selectedEmail.id, noteInputText.trim());
    setNoteInputText('');
    showToast('Note saved to self');
  };

  // Reply Attachment Handlers
  const handleReplyFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAtts: EmailAttachment[] = Array.from(files).map(file => {
      const sizeMb = file.size / (1024 * 1024);
      const sizeStr = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      return {
        id: `reply-att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: sizeStr,
        sizeBytes: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl
      };
    });
    setReplyAttachments(prev => [...prev, ...newAtts]);
    setShowReplyAttachmentWindow(true);
  };

  const handleAddReplySampleAttachment = (sampleType: 'pdf' | 'img' | 'doc') => {
    let sample: EmailAttachment;
    if (sampleType === 'pdf') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Project_Scope_Addendum.pdf',
        size: '1.2 MB',
        sizeBytes: 1200000,
        type: 'application/pdf'
      };
    } else if (sampleType === 'img') {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Design_Wireframe_Mockup.png',
        size: '2.1 MB',
        sizeBytes: 2100000,
        type: 'image/png',
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
      };
    } else {
      sample = {
        id: `att-${Date.now()}`,
        name: 'Updated_Requirements_Doc.docx',
        size: '480 KB',
        sizeBytes: 480000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
    }
    setReplyAttachments(prev => [...prev, sample]);
    setShowReplyAttachmentWindow(true);
  };

  const handleRemoveReplyAttachment = (id: string) => {
    setReplyAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleApplyAiReplyDraft = (type: 'thanks' | 'schedule' | 'confirm' | 'polite') => {
    let draftHtml = '';
    let draftText = '';
    const sender = selectedEmail?.senderName || 'there';
    if (type === 'thanks') {
      draftHtml = `<p>Hi ${sender},</p><p>Thanks for following up on this. Everything looks great from our end!</p><p>Best,<br/>Mehmet</p>`;
      draftText = `Hi ${sender},\n\nThanks for following up on this. Everything looks great from our end!\n\nBest,\nMehmet`;
    } else if (type === 'schedule') {
      draftHtml = `<p>Hi ${sender},</p><p>Let's coordinate a quick 15-minute sync tomorrow afternoon to walk through the details. What time works best for you?</p><p>Best,<br/>Mehmet</p>`;
      draftText = `Hi ${sender},\n\nLet's coordinate a quick 15-minute sync tomorrow afternoon to walk through the details. What time works best for you?\n\nBest,\nMehmet`;
    } else if (type === 'confirm') {
      draftHtml = `<p>Hi ${sender},</p><p>Confirmed! I've reviewed the latest revisions and we are ready to proceed with the next phase.</p><p>Best regards,<br/>Mehmet</p>`;
      draftText = `Hi ${sender},\n\nConfirmed! I've reviewed the latest revisions and we are ready to proceed with the next phase.\n\nBest regards,\nMehmet`;
    } else {
      draftHtml = `<p>Hi ${sender},</p><p>Thank you for reaching out. I've noted the updates and will get back to you with additional information shortly.</p><p>Cheers,<br/>Mehmet</p>`;
      draftText = `Hi ${sender},\n\nThank you for reaching out. I've noted the updates and will get back to you with additional information shortly.\n\nCheers,\nMehmet`;
    }
    setReplyHtml(draftHtml);
    setReplyText(draftText);
    if (replyEditorRef.current) {
      replyEditorRef.current.setHtml(draftHtml);
      replyEditorRef.current.focus();
    }
    setShowReplyAiDrafts(false);
  };

  const handleSendInlineReply = () => {
    if (!selectedEmail) return;
    const bodyHtml = replyEditorRef.current?.getHtml().trim() || replyHtml.trim();
    const bodyText = replyEditorRef.current?.getText().trim() || replyText.trim();
    
    if (!bodyText && replyAttachments.length === 0 && !bodyHtml) return;
    
    // Format reply body with attachments note if any
    let finalBody = bodyHtml || bodyText;
    if (replyAttachments.length > 0) {
      const attList = replyAttachments.map(a => `<p>• 📎 <strong>${a.name}</strong> (${a.size})</p>`).join('');
      finalBody = finalBody ? `${finalBody}<br/><hr/><p><em>Attachments:</em></p>${attList}` : `<p><em>Attached files:</em></p>${attList}`;
    }

    onSendReply(selectedEmail.id, finalBody);
    setReplyHtml('');
    setReplyText('');
    setReplyAttachments([]);
    setShowReplyAttachmentWindow(false);
    setShowReplyComposer(false);
    showToast('Reply sent successfully');
  };

  // Filter emails based on category, sub-filters, and search
  const deletedCount = emails.filter(e => e.isDeleted === true).length;

  const filteredEmails = emails.filter(e => {
    // Trash filter: only show deleted emails
    if (activeSubFilter === 'trash') {
      if (!e.isDeleted) return false;
    } else {
      // Normal views must exclude deleted emails
      if (e.isDeleted) return false;

      if (activeSubFilter === 'reply_later') {
        if (!e.replyLater) return false;
      } else if (activeSubFilter === 'set_aside') {
        if (!e.setAside) return false;
      } else if (activeSubFilter === 'done') {
        if (e.category !== 'imbox' || !e.isRead) return false;
      } else if (activeSubFilter === 'spam') {
        if (!e.tags?.includes('Spam')) return false;
      } else if (activeSubFilter === 'archived') {
        if (!e.tags?.includes('Archived')) return false;
      } else {
        // Default: 'inbox' (All Inbox)
        if (e.category !== 'imbox') return false;
      }
    }

    // Address filter
    if (selectedAddressFilter !== 'all') {
      const match = e.recipientEmail?.toLowerCase().includes(selectedAddressFilter.toLowerCase()) ||
                    e.senderEmail.toLowerCase().includes(selectedAddressFilter.toLowerCase());
      if (!match) return false;
    }

    // Search query
    const q = searchQuery.toLowerCase();
    if (q) {
      const text = `${e.subject} ${e.senderName} ${e.senderEmail} ${e.body}`.toLowerCase();
      if (!text.includes(q)) return false;
    }

    return true;
  });

  const unreadCount = emails.filter(e => e.category === 'imbox' && !e.isRead && !e.isDeleted).length;
  const feedCount = emails.filter(e => e.category === 'feed' && !e.isDeleted).length;
  const paperTrailCount = emails.filter(e => e.category === 'papertrail' && !e.isDeleted).length;

  // -------------------------------------------------------------
  // THREAD / MESSAGE DETAIL VIEW (Screenshot 2 exact replica)
  // -------------------------------------------------------------
  if (selectedEmail) {
    const threadMessages = selectedEmail.threadMessages && selectedEmail.threadMessages.length > 0
      ? selectedEmail.threadMessages
      : [
          {
            id: 'orig-msg',
            senderName: selectedEmail.senderName,
            senderEmail: selectedEmail.senderEmail,
            avatar: selectedEmail.avatar || selectedEmail.senderName.slice(0, 2).toUpperCase(),
            body: selectedEmail.body,
            receivedAt: selectedEmail.receivedAt,
            isOutbound: false
          }
        ];

    const recipient = selectedEmail.recipientEmail || 'hi@rezb.de';

    return (
      <div className="py-8 px-4 sm:px-6 font-sans">
        
        {/* Centered Thread Card Container (Dark layout in content div) */}
        <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative pb-32 text-stone-100 select-text">
          
          {/* Thread Card Top Header: Back button, centered to address */}
          <div className="relative flex items-center justify-between pb-4 border-b border-[#2a2826]">
            
            {/* Back Button (Bolder, Stronger) */}
            <button
              id="thread-back-btn"
              onClick={() => onSelectEmail(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#262523] hover:bg-[#32302d] border-2 border-[#3d3a36] text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer shadow-sm z-10"
            >
              <ArrowLeft className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
              <span>Back to Inbox</span>
            </button>

            {/* Centered Recipient Address Badge */}
            <div className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm font-mono font-bold text-stone-300 bg-[#252422] px-3.5 py-1.5 rounded-xl border border-[#383532] shadow-xs">
              to {recipient}
            </div>

            {/* Right empty spacer for symmetrical balance */}
            <div className="w-24 sm:w-32" />
          </div>

          {/* If email is deleted, show a sticky top alert banner */}
          {selectedEmail.isDeleted && (
            <div className="bg-rose-950/60 border-2 border-rose-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200 animate-in fade-in duration-150 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-black text-white text-sm sm:text-base">This thread is currently in the Trash</div>
                  <div className="text-xs text-rose-300/80">Deleted {selectedEmail.deletedAt || 'recently'}. You can restore it to your inbox or delete it forever.</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onRestoreEmail?.(selectedEmail.id);
                    showToast('Thread restored to Inbox');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#2b2926] hover:bg-[#383531] border border-stone-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restore to Inbox</span>
                </button>
                <button
                  onClick={() => {
                    onPermanentDelete?.(selectedEmail.id);
                    showToast('Thread permanently deleted');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Forever</span>
                </button>
              </div>
            </div>
          )}

          {/* Overlapping Dual Avatars + Large Serif Subject */}
          <div className="text-center pt-3 pb-2 space-y-3">
            <div className="flex items-center justify-center -space-x-3">
              <div className="w-14 h-14 rounded-full bg-[#133732] text-[#2dd4bf] border-3 border-[#181716] flex items-center justify-center font-black text-base shadow-xl">
                {selectedEmail.avatar || selectedEmail.senderName.slice(0, 2).toUpperCase()}
              </div>
              <div className="w-14 h-14 rounded-full bg-[#1e4e47] text-[#3ddad1] border-3 border-[#181716] flex items-center justify-center font-black text-base shadow-xl">
                YO
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {selectedEmail.subject}
            </h1>

            {/* Quick Badges & Actions Bar (Labels, Notifications, Note to Self, Print) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-1">
              
              {/* Category Badge */}
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase bg-[#242220] border border-[#383532] text-stone-300">
                {selectedEmail.category === 'imbox' ? '📥 Inbox' : selectedEmail.category === 'feed' ? '📰 Feed' : '📑 Paper Trail'}
              </span>

              {/* Labels Badge List */}
              {(selectedEmail.labels || selectedEmail.tags || []).filter(t => t !== 'Done' && t !== 'Archived').map(lbl => {
                const isUrgent = lbl.toLowerCase().includes('urgent');
                const isVip = lbl.toLowerCase().includes('vip');
                const isClient = lbl.toLowerCase().includes('client');
                const isDesign = lbl.toLowerCase().includes('design');
                const badgeColor = isUrgent 
                  ? 'bg-rose-950/70 text-rose-300 border-rose-800/80'
                  : isVip
                  ? 'bg-amber-950/70 text-amber-300 border-amber-800/80'
                  : isClient
                  ? 'bg-blue-950/70 text-blue-300 border-blue-800/80'
                  : isDesign
                  ? 'bg-purple-950/70 text-purple-300 border-purple-800/80'
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';

                return (
                  <span key={lbl} className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${badgeColor}`}>
                    <Tag className="w-3 h-3" />
                    <span>{lbl}</span>
                    <button 
                      onClick={() => handleToggleLabel(lbl)} 
                      className="hover:opacity-75 text-stone-400 hover:text-white cursor-pointer ml-0.5"
                      title="Remove label"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {/* + Label trigger button */}
              <div className="relative">
                <button
                  id="labels-trigger-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLabelsModal(!showLabelsModal);
                  }}
                  className="labels-trigger-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-[#242220] hover:bg-[#2e2c29] border border-[#3d3a36] text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-purple-400" />
                  <span>Label</span>
                </button>

                {/* Interactive Labels Manager Popover */}
                {showLabelsModal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLabelsModal(false)} />
                    <div
                      id="labels-popover"
                      className="absolute left-1/2 -translate-x-1/2 top-9 w-64 bg-[#1f1d1b] rounded-2xl shadow-2xl border-2 border-[#3d3a36] p-3 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="font-bold text-stone-300 flex items-center justify-between border-b border-[#33312e] pb-1.5">
                        <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-purple-400" /> Thread Labels</span>
                        <button onClick={() => setShowLabelsModal(false)} className="text-stone-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Preset Labels Grid */}
                      <div className="flex flex-wrap gap-1.5">
                        {availablePresetLabels.map(label => {
                          const activeLabels = selectedEmail.labels || selectedEmail.tags || [];
                          const isSelected = activeLabels.includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => handleToggleLabel(label)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-purple-950/80 text-purple-200 border-purple-600'
                                  : 'bg-[#282624] text-stone-300 border-[#3d3a36] hover:bg-[#343230]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Label input */}
                      <div className="pt-2 border-t border-[#33312e] flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="New label..."
                          value={newCustomLabel}
                          onChange={(e) => setNewCustomLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewCustomLabel();
                            }
                          }}
                          className="w-full bg-[#161514] border border-[#383532] rounded-lg px-2 py-1 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCustomLabel}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Push Notification Toggle Button */}
              <button
                onClick={handleToggleNotificationAction}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedEmail.hasNotification
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/60'
                    : 'bg-[#242220] text-stone-400 border-[#3d3a36] hover:text-stone-200 hover:bg-[#2e2c29]'
                }`}
                title={selectedEmail.hasNotification ? 'Push notifications active' : 'Turn on push notification for this email'}
              >
                {selectedEmail.hasNotification ? (
                  <>
                    <BellRing className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Push ON</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3 h-3 text-stone-400" />
                    <span>Notify Me</span>
                  </>
                )}
              </button>

              {/* Note to Self Button */}
              <button
                onClick={() => setShowNoteComposer(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  (selectedEmail.clipNotes && selectedEmail.clipNotes.length > 0)
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700/80 hover:bg-amber-900/60'
                    : 'bg-[#242220] text-stone-400 border-[#3d3a36] hover:text-stone-200 hover:bg-[#2e2c29]'
                }`}
                title="Open private notes sidebar"
              >
                <StickyNote className="w-3 h-3 text-amber-400" />
                <span>
                  Note to Self
                  {(selectedEmail.clipNotes?.length || 0) > 0 ? ` (${selectedEmail.clipNotes?.length})` : ''}
                </span>
              </button>

              {/* Print Thread Button */}
              <button
                onClick={handlePrintThreadAction}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#242220] hover:bg-[#2e2c29] border border-[#3d3a36] text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print this thread"
              >
                <Printer className="w-3 h-3 text-stone-400" />
                <span>Print</span>
              </button>

              {/* Star Button */}
              <button
                onClick={() => onToggleStar(selectedEmail.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedEmail.isStarred
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700/80'
                    : 'bg-[#242220] text-stone-400 border-[#3d3a36] hover:text-stone-200'
                }`}
              >
                <Star className={`w-3 h-3 ${selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} />
                <span>{selectedEmail.isStarred ? 'Starred' : 'Star'}</span>
              </button>

            </div>
          </div>

          {/* Thread Messages List */}
          <div className="space-y-6">
            {threadMessages.map((msg, idx) => (
              <div key={msg.id || idx} className="space-y-3">
                
                {/* Message Dark Outer Header */}
                <div className="flex items-center justify-between px-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#133732] text-[#2dd4bf] border-2 border-[#1c554e] flex items-center justify-center font-black text-xs shadow-md shrink-0">
                      {msg.avatar || msg.senderName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-sm sm:text-base">{msg.senderName}</span>
                        <span className="text-stone-400 font-medium text-xs">&lt;{msg.senderEmail}&gt;</span>
                      </div>
                      <div className="text-[11px] font-bold text-stone-500">to {recipient}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-stone-400 text-xs relative">
                    <span className="font-semibold text-stone-400">{msg.receivedAt || '3 Aug 2026, 18:06'}</span>
                    
                    {/* Message-specific More Menu */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMsgMenuId(openMsgMenuId === msg.id ? null : msg.id);
                        }}
                        className="message-more-btn p-1.5 hover:text-white rounded-lg hover:bg-[#252422] transition-colors cursor-pointer"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
                      </button>

                      {openMsgMenuId === msg.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setOpenMsgMenuId(null)} 
                          />
                          <div 
                            id="message-more-menu"
                            className="message-more-menu font-sans absolute right-0 top-8 w-64 bg-[#201e1c] rounded-2xl shadow-2xl border-2 border-[#3d3a36] py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs sm:text-sm"
                          >
                            <button
                              onClick={() => {
                                handleForwardEmailAction(selectedEmail);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Forward className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                              <span>Forward</span>
                            </button>

                            <button
                              onClick={() => {
                                handleMarkUnreadAction();
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Mail className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                              <span>Mark as Unread</span>
                            </button>

                            <button
                              onClick={() => {
                                handlePrintThreadAction();
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Printer className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
                              <span>Print this Thread</span>
                            </button>

                            <button
                              onClick={() => {
                                setShowLabelsModal(true);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Tag className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
                              <span>Label Thread</span>
                            </button>

                            <button
                              onClick={() => {
                                setShowNoteComposer(true);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <StickyNote className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                              <span>Note to Self</span>
                            </button>

                            <button
                              onClick={() => {
                                handleToggleNotificationAction();
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Bell className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                              <span>{selectedEmail.hasNotification ? 'Turn Off Notifications' : 'Push Notification'}</span>
                            </button>

                            <div className="h-px bg-[#2f2d2a] my-1" />

                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(msg.body);
                                setOpenMsgMenuId(null);
                                showToast('Message copied to clipboard');
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Copy className="w-4 h-4 text-stone-400" strokeWidth={2.5} />
                              <span>Copy Message</span>
                            </button>

                            <button
                              onClick={() => {
                                onToggleReplyLater(selectedEmail.id);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Clock className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                              <span>{selectedEmail.replyLater ? 'Remove Reply Later' : 'Queue in Reply Later'}</span>
                            </button>

                            <button
                              onClick={() => {
                                onToggleSetAside(selectedEmail.id);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Bookmark className="w-4 h-4 text-indigo-400" strokeWidth={2.5} />
                              <span>{selectedEmail.setAside ? 'Remove Set Aside' : 'Pin to Set Aside'}</span>
                            </button>

                            <button
                              onClick={() => {
                                onToggleStar(selectedEmail.id);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Star className={`w-4 h-4 ${selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} strokeWidth={2.5} />
                              <span>{selectedEmail.isStarred ? 'Unstar Email' : 'Star Email'}</span>
                            </button>

                            <div className="h-px bg-[#2f2d2a] my-1" />

                            <button
                              onClick={() => {
                                onMoveCategory(selectedEmail.id, 'feed');
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Layers className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                              <span>Move to Feed</span>
                            </button>

                            <button
                              onClick={() => {
                                onMoveCategory(selectedEmail.id, 'papertrail');
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer font-sans"
                            >
                              <Receipt className="w-4 h-4 text-indigo-400" strokeWidth={2.5} />
                              <span>Move to Paper Trail</span>
                            </button>

                            <div className="h-px bg-[#2f2d2a] my-1" />

                            <button
                              onClick={() => {
                                onDeleteEmail(selectedEmail.id);
                                setOpenMsgMenuId(null);
                              }}
                              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 font-bold cursor-pointer font-sans"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* White Document Body Card with EmailContentRenderer */}
                <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-9 shadow-xl font-sans text-sm sm:text-base leading-relaxed space-y-5 border border-stone-200">
                  <EmailContentRenderer content={msg.body} />

                  {/* Clean Signature links */}
                  <div className="pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-800 space-y-1">
                    <div className="font-bold text-stone-950">{msg.senderName}</div>
                    <div className="space-y-0.5 text-blue-600 font-medium text-xs">
                      <div><a href="https://sendline.io" target="_blank" rel="noreferrer" className="hover:underline">https://sendline.io</a></div>
                      <div><a href="https://rezb.com" target="_blank" rel="noreferrer" className="hover:underline">https://rezb.com</a></div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right Side-Window / Slide-Over Drawer for Note to Self */}
          {showNoteComposer && (
            <>
              {/* Dimmed backdrop for mobile / focus */}
              <div 
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity" 
                onClick={() => setShowNoteComposer(false)} 
              />

              <div 
                id="note-to-self-sidewindow" 
                className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[#1c1a18] border-l-2 border-[#3d3a36] shadow-2xl z-50 flex flex-col text-stone-200 animate-in slide-in-from-right duration-200"
              >
                {/* Sidewindow Header */}
                <div className="p-5 border-b border-[#33312e] bg-[#22201d] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <StickyNote className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                        <span>Notes to Self</span>
                        <Pin className="w-3.5 h-3.5 text-amber-400" />
                      </h3>
                      <p className="text-[11px] text-stone-400 font-medium">Private to this thread only</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowNoteComposer(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-colors cursor-pointer"
                    title="Close notes window"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sidewindow Content Area: Notes List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {selectedEmail.clipNotes && selectedEmail.clipNotes.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Saved Notes ({selectedEmail.clipNotes.length})
                      </div>
                      {selectedEmail.clipNotes.map((note) => (
                        <div 
                          key={note.id} 
                          className="bg-[#262421] border border-amber-800/40 hover:border-amber-700/60 rounded-2xl p-4 space-y-2 text-stone-200 shadow-md transition-colors relative group"
                        >
                          <p className="text-xs sm:text-sm whitespace-pre-line text-amber-100 font-medium leading-relaxed">
                            {note.text}
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[11px]">
                            <span className="text-amber-400/80 font-semibold">{note.createdAt || 'Saved note'}</span>
                            {onDeleteClipNote && (
                              <button
                                onClick={() => onDeleteClipNote(selectedEmail.id, note.id)}
                                className="text-stone-400 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete note"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4 space-y-2 text-stone-400">
                      <StickyNote className="w-10 h-10 text-stone-600 mx-auto" />
                      <p className="font-bold text-sm text-stone-300">No notes yet</p>
                      <p className="text-xs text-stone-500">Jot down private thoughts, follow-up reminders, or instructions for this email thread.</p>
                    </div>
                  )}
                </div>

                {/* Sidewindow Footer: Note Input Area */}
                <div className="p-4 border-t border-[#33312e] bg-[#22201d] space-y-3">
                  <textarea
                    placeholder="Write a private note to self..."
                    value={noteInputText}
                    onChange={(e) => setNoteInputText(e.target.value)}
                    rows={3}
                    className="w-full bg-[#181716] border border-[#3e3b37] rounded-2xl p-3 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveNoteToSelf();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">Press ⌘+Enter to save</span>
                    <button
                      type="button"
                      onClick={handleSaveNoteToSelf}
                      disabled={!noteInputText.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* In-Place Interactive Reply Box (Unified RichTextEditor & Attachments) */}
          {showReplyComposer && (
            <div id="reply-composer-container" className="mt-6 bg-[#242220] border-2 border-[#3d3a36] rounded-3xl p-5 sm:p-6 space-y-4 animate-in fade-in duration-150 shadow-xl relative text-stone-100">
              
              {/* Hidden file input for attachments */}
              <input 
                ref={replyFileInputRef}
                type="file" 
                multiple 
                className="hidden" 
                onChange={(e) => handleReplyFileUpload(e.target.files)} 
              />

              {/* Reply Header */}
              <div className="space-y-2 pb-2 border-b border-[#33312e]">
                {/* Top Control Bar with Mode Switcher & Right Tools */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-stone-200 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="flex items-center bg-[#191816] rounded-xl p-0.5 border border-[#383532]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsReplyAll(false);
                          setCcRecipients([]);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          !isReplyAll ? 'bg-[#ea583a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsReplyAll(true);
                          setCcRecipients(['team@minimalstudio.design']);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isReplyAll ? 'bg-[#ea583a] text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <ReplyAll className="w-3.5 h-3.5" />
                        <span>Reply All</span>
                      </button>
                    </div>
                    
                    <span className="font-black text-white">
                      {isReplyAll ? `Reply All to ${selectedEmail.senderName} & thread` : `Reply to ${selectedEmail.senderName}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Smart Reply Suggestions */}
                    <div className="relative">
                      <button
                        id="reply-ai-btn"
                        type="button"
                        onClick={() => setShowReplyAiDrafts(!showReplyAiDrafts)}
                        className="px-2.5 py-1 rounded-xl bg-[#282522] hover:bg-[#34302c] text-amber-300 border border-[#443e38] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        title="AI Smart Reply Suggestions"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Smart Reply</span>
                      </button>

                      {showReplyAiDrafts && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowReplyAiDrafts(false)} 
                          />
                          <div 
                            id="reply-ai-dropdown" 
                            className="absolute right-0 top-9 w-60 bg-[#1c1a18] rounded-2xl border-2 border-[#3d3a36] shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <div className="px-2.5 py-1 font-bold text-stone-400 text-[11px] uppercase tracking-wider">
                              Choose quick draft:
                            </div>
                            <button
                              onClick={() => handleApplyAiReplyDraft('thanks')}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <span>👍 Looks Great, Thanks!</span>
                            </button>
                            <button
                              onClick={() => handleApplyAiReplyDraft('schedule')}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <span>📅 Schedule Quick Sync</span>
                            </button>
                            <button
                              onClick={() => handleApplyAiReplyDraft('confirm')}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <span>✅ Confirm & Proceed</span>
                            </button>
                            <button
                              onClick={() => handleApplyAiReplyDraft('polite')}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <span>✉️ Received, Reviewing</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Expand/Collapse Recipient & Subject Header Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowRecipientDetails(!showRecipientDetails)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-[#2d2b28] cursor-pointer transition-colors"
                      title={showRecipientDetails ? "Collapse recipients & subject" : "Expand recipients & subject"}
                    >
                      {showRecipientDetails ? (
                        <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                      )}
                    </button>

                    <button 
                      onClick={() => setShowReplyComposer(false)}
                      className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-[#2d2b28] cursor-pointer transition-colors"
                      title="Close reply editor"
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Detailed Expandable Recipient Rows (To, CC, BCC, Subject) */}
                {showRecipientDetails && (
                  <div className="space-y-1.5 pt-1 text-xs sm:text-sm font-sans animate-in fade-in duration-100">
                    {/* To Row */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-[#33312e] min-h-[38px]">
                      <span className="text-stone-400 font-bold w-16 shrink-0">To</span>
                      <div className="flex items-center gap-1.5 flex-wrap flex-1">
                        {toRecipients.map((email) => (
                          <span
                            key={email}
                            className="bg-[#1b2624] text-[#38d9a9] border border-[#2b594f] rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRecipient('to', email)}
                              className="text-stone-400 hover:text-white rounded-full p-0.5 cursor-pointer"
                              title="Remove recipient"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="email"
                          placeholder={toRecipients.length === 0 ? "Add recipient email..." : ""}
                          value={toInput}
                          onChange={(e) => setToInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddRecipient('to', toInput);
                            }
                          }}
                          onBlur={() => handleAddRecipient('to', toInput)}
                          className="bg-transparent text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none min-w-[120px] flex-1 font-normal font-sans"
                        />
                      </div>
                    </div>

                    {/* CC Row */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-[#33312e] min-h-[38px]">
                      <span className="text-stone-400 font-bold w-16 shrink-0">CC</span>
                      <div className="flex items-center gap-1.5 flex-wrap flex-1">
                        {ccRecipients.map((email) => (
                          <span
                            key={email}
                            className="bg-[#262320] text-amber-200 border border-amber-800/60 rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRecipient('cc', email)}
                              className="text-stone-400 hover:text-white rounded-full p-0.5 cursor-pointer"
                              title="Remove CC"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="email"
                          placeholder={ccRecipients.length === 0 ? "Add CC recipients..." : ""}
                          value={ccInput}
                          onChange={(e) => setCcInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddRecipient('cc', ccInput);
                            }
                          }}
                          onBlur={() => handleAddRecipient('cc', ccInput)}
                          className="bg-transparent text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none min-w-[120px] flex-1 font-normal font-sans"
                        />
                      </div>
                    </div>

                    {/* BCC Row */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-[#33312e] min-h-[38px]">
                      <span className="text-stone-400 font-bold w-16 shrink-0">BCC</span>
                      <div className="flex items-center gap-1.5 flex-wrap flex-1">
                        {bccRecipients.map((email) => (
                          <span
                            key={email}
                            className="bg-[#242129] text-purple-200 border border-purple-800/60 rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRecipient('bcc', email)}
                              className="text-stone-400 hover:text-white rounded-full p-0.5 cursor-pointer"
                              title="Remove BCC"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="email"
                          placeholder={bccRecipients.length === 0 ? "Add BCC recipients..." : ""}
                          value={bccInput}
                          onChange={(e) => setBccInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddRecipient('bcc', bccInput);
                            }
                          }}
                          onBlur={() => handleAddRecipient('bcc', bccInput)}
                          className="bg-transparent text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none min-w-[120px] flex-1 font-normal font-sans"
                        />
                      </div>
                    </div>

                    {/* Subject Row (Editable) */}
                    <div className="flex items-center gap-2 py-1.5 border-b border-[#33312e] min-h-[38px]">
                      <span className="text-stone-400 font-bold w-16 shrink-0">Subject</span>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        placeholder="Subject..."
                        className="bg-transparent text-xs sm:text-sm text-white font-medium placeholder-stone-600 focus:outline-none flex-1 font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text Editor Component (Light Paper Canvas + Floating Formatting Bar) */}
              <div className="relative">
                <RichTextEditor
                  ref={replyEditorRef}
                  initialHtml={replyHtml}
                  placeholder={`Write your reply to ${selectedEmail.senderName}...`}
                  minHeight="180px"
                  autoFocus={true}
                  showToolbar={showReplyToolbar}
                  onChange={(html, text) => {
                    setReplyHtml(html);
                    setReplyText(text);
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleSendInlineReply();
                    }
                  }}
                />
              </div>

              {/* Attached Files List (If files are attached) */}
              {replyAttachments.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-stone-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#ea583a]" />
                      Attached files ({replyAttachments.length}):
                    </span>
                    <button
                      onClick={() => setShowReplyAttachmentWindow(true)}
                      className="text-[#ea583a] hover:underline cursor-pointer"
                    >
                      + Add more files
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {replyAttachments.map(att => (
                      <div
                        key={att.id}
                        className="bg-[#181716] border-2 border-[#383532] rounded-xl px-3 py-1.5 flex items-center gap-2.5 text-xs text-stone-200 shadow-sm group hover:border-[#4a4743] transition-colors"
                      >
                        {att.previewUrl ? (
                          <img src={att.previewUrl} alt={att.name} className="w-6 h-6 rounded object-cover border border-stone-700" />
                        ) : att.name.endsWith('.pdf') ? (
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
                          onClick={() => handleRemoveReplyAttachment(att.id)}
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

              {/* Expandable Attachment Window / Panel */}
              {showReplyAttachmentWindow && (
                <>
                  {/* Backdrop to dismiss when clicking on space */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowReplyAttachmentWindow(false)} 
                  />
                  <div 
                    id="reply-attachment-window"
                    className="relative z-50 bg-[#191816] border-2 border-[#ea583a]/40 rounded-2xl p-4 space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#2d2b28]">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-[#ea583a]" />
                        <span className="font-black text-sm text-white">Attachment Manager</span>
                      </div>
                      <button 
                        onClick={() => setShowReplyAttachmentWindow(false)}
                        className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-[#2a2826] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Drag and drop upload zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingReplyFile(true);
                      }}
                      onDragLeave={() => setIsDraggingReplyFile(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingReplyFile(false);
                        handleReplyFileUpload(e.dataTransfer.files);
                      }}
                      className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                        isDraggingReplyFile 
                          ? 'border-[#ea583a] bg-[#ea583a]/10' 
                          : 'border-[#383532] hover:border-[#4d4a46] bg-[#141312]'
                      }`}
                    >
                      <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-stone-200">
                        Drag and drop files here, or{' '}
                        <button
                          type="button"
                          onClick={() => replyFileInputRef.current?.click()}
                          className="text-[#ea583a] hover:underline font-extrabold cursor-pointer"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium mt-1">
                        Supports PDF, PNG, JPG, DOCX, ZIP up to 25MB
                      </p>
                    </div>

                    {/* Quick Sample Attachments */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Quick Add Sample Files:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddReplySampleAttachment('pdf')}
                          className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-400" />
                          <span>+ Scope_Addendum.pdf (1.2 MB)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReplySampleAttachment('img')}
                          className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>+ Wireframe_Mockup.png (2.1 MB)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReplySampleAttachment('doc')}
                          className="px-3 py-1.5 rounded-xl bg-[#252422] hover:bg-[#302e2b] border border-[#383532] text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>+ Requirements.docx (480 KB)</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setShowReplyAttachmentWindow(false)}
                        className="px-4 py-1.5 rounded-xl bg-[#282624] hover:bg-[#33312e] text-white text-xs font-bold cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Bottom Control Row */}
              <div className="p-3 sm:p-4 bg-[#141312] border-t border-[#282725] flex items-center justify-between flex-wrap gap-2 select-none">
                
                {/* Left Actions: Send Reply split pill, Attachments, "A" formatting toggle, Smart Reply */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  
                  {/* Primary Coral Send Reply Split Pill */}
                  <div className="relative inline-flex items-stretch rounded-full shadow-md">
                    <button
                      type="button"
                      disabled={!replyText.trim() && replyAttachments.length === 0 && !replyHtml.trim()}
                      onClick={handleSendInlineReply}
                      className="h-10 px-4 sm:px-5 rounded-l-full bg-[#ea583a] hover:bg-[#d84b2e] active:brightness-95 disabled:opacity-50 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" strokeWidth={2.5} />
                      <span>Send reply</span>
                    </button>

                    <button
                      type="button"
                      disabled={!replyText.trim() && replyAttachments.length === 0 && !replyHtml.trim()}
                      onClick={() => setShowReplySendOptions(!showReplySendOptions)}
                      className="h-10 px-3 rounded-r-full bg-[#d84b2e] hover:bg-[#c23f24] disabled:opacity-50 text-white text-xs border-l border-white/20 transition-colors cursor-pointer flex items-center justify-center"
                      title="More send options"
                    >
                      <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>

                    {/* Send options popover */}
                    {showReplySendOptions && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowReplySendOptions(false)} />
                        <div className="absolute bottom-full mb-2 left-0 w-56 bg-[#1c1a18] rounded-2xl border-2 border-[#383532] shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => { setShowReplySendOptions(false); handleSendInlineReply(); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252422] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-[#ea583a]" strokeWidth={2.5} />
                            <span>Send immediately</span>
                          </button>
                          <button
                            onClick={() => { setShowReplySendOptions(false); handleSendInlineReply(); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252422] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                            <span>Send tomorrow at 8 AM</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Paperclip Attach Icon */}
                  <button
                    id="reply-attachment-btn"
                    type="button"
                    onClick={() => setShowReplyAttachmentWindow(!showReplyAttachmentWindow)}
                    className={`h-10 px-3 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      replyAttachments.length > 0 
                        ? 'bg-[#ea583a]/20 text-[#ea583a] border-2 border-[#ea583a]/40' 
                        : 'bg-[#22201e] text-stone-400 hover:text-white hover:bg-[#2e2b28] border-2 border-[#383532]'
                    }`}
                    title="Attach Files to reply"
                  >
                    <Paperclip className="w-4 h-4" strokeWidth={2.5} />
                    {replyAttachments.length > 0 && <span className="text-[11px] font-black">({replyAttachments.length})</span>}
                  </button>

                  {/* "A" Formatting Toolbar Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowReplyToolbar(!showReplyToolbar)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border-2 ${
                      showReplyToolbar
                        ? 'bg-[#ea583a] text-white border-[#ea583a] shadow-xs'
                        : 'bg-[#22201e] text-stone-400 hover:text-white hover:bg-[#2e2b28] border-[#383532]'
                    }`}
                    title="Toggle Formatting Toolbar"
                  >
                    <span className="font-black text-sm underline decoration-2 underline-offset-2">A</span>
                  </button>

                  {/* AI Smart Reply Suggestions */}
                  <div className="relative">
                    <button
                      id="reply-ai-btn-bottom"
                      type="button"
                      onClick={() => setShowReplyAiDrafts(!showReplyAiDrafts)}
                      className="h-10 px-3.5 rounded-full bg-[#252320] hover:bg-[#34302c] text-amber-300 border-2 border-[#443e38] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="AI Smart Reply Suggestions"
                    >
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span>Smart Reply</span>
                    </button>

                    {showReplyAiDrafts && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowReplyAiDrafts(false)} 
                        />
                        <div 
                          id="reply-ai-dropdown" 
                          className="absolute bottom-full mb-2 left-0 w-64 bg-[#1c1a18] rounded-2xl border-2 border-[#383532] shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="px-2.5 py-1 font-bold text-stone-400 text-[11px] uppercase tracking-wider">
                            Choose quick reply draft:
                          </div>
                          <button
                            onClick={() => { setShowReplyAiDrafts(false); handleApplyAiReplyDraft('thanks'); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <span>👍 Looks Great, Thanks!</span>
                          </button>
                          <button
                            onClick={() => { setShowReplyAiDrafts(false); handleApplyAiReplyDraft('schedule'); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <span>📅 Schedule Quick Sync</span>
                          </button>
                          <button
                            onClick={() => { setShowReplyAiDrafts(false); handleApplyAiReplyDraft('confirm'); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <span>✅ Confirm & Proceed</span>
                          </button>
                          <button
                            onClick={() => { setShowReplyAiDrafts(false); handleApplyAiReplyDraft('polite'); }}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#282624] text-stone-200 hover:text-white font-bold flex items-center gap-2 cursor-pointer"
                          >
                            <span>✉️ Received, Reviewing</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>

                {/* Right: Discard button and keyboard shortcut */}
                <div className="flex items-center gap-2.5">
                  <div className="text-xs text-stone-400 font-sans hidden sm:block">
                    <kbd className="px-2 py-0.5 rounded bg-[#181716] border border-[#383532] text-stone-300 font-bold text-[11px]">⌘ Enter</kbd>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReplyComposer(false)}
                    className="h-10 w-10 rounded-full text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 border-2 border-[#383532] hover:border-rose-900/40 transition-colors cursor-pointer flex items-center justify-center"
                    title="Discard reply"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Floating Bottom Action Dock (Bolder, Stronger, Bigger) - Hidden when reply composer is open */}
          {!showReplyComposer && (
            <div 
              id="dock-action-bar" 
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#201e1c]/95 backdrop-blur-xl border-2 border-[#3d3a36] rounded-full p-2 flex items-center gap-2 shadow-2xl z-40 select-none animate-in fade-in duration-150"
            >
              {/* Reply Button (Bolder, Bigger Coral/Orange Pill) */}
              <button
                id="dock-reply-btn"
                onClick={() => {
                  setIsReplyAll(false);
                  setShowReplyComposer(true);
                }}
                className="px-5 py-2.5 rounded-full bg-[#ea583a] hover:bg-[#d84b2e] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-transform active:scale-95 shadow-lg cursor-pointer"
              >
                <Reply className="w-4 h-4" strokeWidth={2.5} />
                <span>Reply</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#bd3e23] font-bold ml-0.5">R</kbd>
              </button>

            {/* Reply All Button */}
            <button
              id="dock-reply-all-btn"
              onClick={() => {
                setIsReplyAll(true);
                setShowReplyComposer(true);
              }}
              className="px-4 py-2.5 rounded-full hover:bg-[#2e2c29] text-stone-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-[#44403c]"
              title="Reply to all recipients (Shift+R)"
            >
              <ReplyAll className="w-4 h-4 text-[#ea583a]" strokeWidth={2.5} />
              <span>Reply All</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2825] border border-[#3e3b37] text-stone-400 font-bold">⇧R</kbd>
            </button>

            {/* Done Button (Bolder, Stronger) */}
            <button
              id="dock-done-btn"
              onClick={() => handleMarkDone(selectedEmail.id)}
              className="px-4 py-2.5 rounded-full hover:bg-[#2e2c29] text-stone-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-[#44403c]"
            >
              <CheckCircle2 className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
              <span>Done</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2825] border border-[#3e3b37] text-stone-400 font-bold">E</kbd>
            </button>

            {/* Archive Button (Bolder, Stronger) */}
            <button
              id="dock-archive-btn"
              onClick={() => handleArchive(selectedEmail.id)}
              className="px-4 py-2.5 rounded-full hover:bg-[#2e2c29] text-stone-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-[#44403c]"
            >
              <Archive className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
              <span>Archive</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2825] border border-[#3e3b37] text-stone-400 font-bold">A</kbd>
            </button>

            {/* More Button (Bolder, Stronger) */}
            <div className="relative">
              <button
                id="dock-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreActions(!showMoreActions);
                }}
                className="px-4 py-2.5 rounded-full hover:bg-[#2e2c29] text-stone-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-[#44403c]"
              >
                <MoreHorizontal className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
                <span>More</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2825] border border-[#3e3b37] text-stone-400 font-bold">M</kbd>
              </button>

              {/* More Actions Dropdown */}
              {showMoreActions && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreActions(false)} />
                  <div 
                    id="dock-more-menu"
                    className="absolute bottom-14 right-0 w-64 bg-[#201e1c] rounded-2xl shadow-2xl border-2 border-[#3d3a36] py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs sm:text-sm max-h-[80vh] overflow-y-auto"
                  >
                    {/* Forward Email */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        handleForwardEmailAction(selectedEmail);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Forward className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                      <span>Forward</span>
                    </button>

                    {/* Mark as Unread */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        handleMarkUnreadAction();
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                      <span>Mark as Unread</span>
                    </button>

                    {/* Print this Thread */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        handlePrintThreadAction();
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
                      <span>Print this Thread</span>
                    </button>

                    {/* Label Thread */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        setShowLabelsModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
                      <span>Label Thread</span>
                    </button>

                    {/* Note to Self */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        setShowNoteComposer(true);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <StickyNote className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                      <span>Note to Self</span>
                    </button>

                    {/* Push Notification */}
                    <button
                      onClick={() => {
                        setShowMoreActions(false);
                        handleToggleNotificationAction();
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                      <span>{selectedEmail.hasNotification ? 'Turn Off Notifications' : 'Push Notification'}</span>
                    </button>

                    <div className="h-px bg-[#2f2d2a] my-1" />

                    <button
                      onClick={() => {
                        onToggleReplyLater(selectedEmail.id);
                        setShowMoreActions(false);
                        showToast(selectedEmail.replyLater ? 'Removed from Reply Later' : 'Added to Reply Later shelf');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                      <span>{selectedEmail.replyLater ? 'Remove Reply Later' : 'Queue in Reply Later'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onToggleSetAside(selectedEmail.id);
                        setShowMoreActions(false);
                        showToast(selectedEmail.setAside ? 'Removed from Set Aside' : 'Pinned to Set Aside pile');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-indigo-400" strokeWidth={2.5} />
                      <span>{selectedEmail.setAside ? 'Remove Set Aside' : 'Pin to Set Aside'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onToggleStar(selectedEmail.id);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} strokeWidth={2.5} />
                      <span>{selectedEmail.isStarred ? 'Unstar Email' : 'Star Email'}</span>
                    </button>

                    <div className="h-px bg-[#2f2d2a] my-1" />

                    <button
                      onClick={() => {
                        onMoveCategory(selectedEmail.id, 'feed');
                        setShowMoreActions(false);
                        showToast('Moved to Feed');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                      <span>Move to Feed</span>
                    </button>

                    <button
                      onClick={() => {
                        onMoveCategory(selectedEmail.id, 'papertrail');
                        setShowMoreActions(false);
                        showToast('Moved to Paper Trail');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#2c2a28] text-stone-200 hover:text-white font-bold cursor-pointer"
                    >
                      <Receipt className="w-4 h-4 text-indigo-400" strokeWidth={2.5} />
                      <span>Move to Paper Trail</span>
                    </button>

                    <div className="h-px bg-[#2f2d2a] my-1" />

                    <button
                      onClick={() => {
                        onDeleteEmail(selectedEmail.id);
                        setShowMoreActions(false);
                        showToast('Email moved to Trash');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
          )}

          {/* Toast feedback */}
          {actionToast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full border-2 border-stone-700 shadow-2xl z-50 animate-in fade-in duration-100">
              {actionToast}
            </div>
          )}

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // INBOX LIST VIEW (Screenshot 1 replica with dark content card)
  // -------------------------------------------------------------
  return (
    <div className="py-8 px-4 sm:px-6 font-sans">
      
      {/* Centered Main Card Container (Dark layout in content div) */}
      <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        
        {/* Card Header: Left = Icon & Title; Right = Category Navigation Pills (Option A) */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2a2826]">
          
          {/* Left: Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ea583a] text-white flex items-center justify-center shadow-md shrink-0">
              <Mail className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Inbox
            </h1>
          </div>

          {/* Right: Category Navigation Pills (Symmetrical with Feed, Paper Trail, Screener) */}
          <div className="flex items-center gap-1.5 bg-[#222120] p-1 rounded-2xl border-2 border-[#33312e] shrink-0">
            <button
              onClick={() => {
                if (onTabSwitch) onTabSwitch('imbox');
                setActiveSubFilter('inbox');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-[#ea583a] text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white shadow-xs animate-pulse" />
              )}
            </button>

            <button
              onClick={() => onTabSwitch?.('feed')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Feed</span>
              {feedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-stone-700 text-stone-300">
                  {feedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabSwitch?.('papertrail')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Paper Trail</span>
              {paperTrailCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-stone-700 text-stone-300">
                  {paperTrailCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabSwitch?.('screener')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Screener</span>
              {pendingScreenerCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                  {pendingScreenerCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Workflow & Filter Pills: All Inbox, Reply Later, Set Aside, Done, Spam, Archived */}
        <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar border-b border-[#282725]">
          <button
            onClick={() => setActiveSubFilter('inbox')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubFilter === 'inbox'
                ? 'bg-[#ea583a] text-white shadow-xs font-black'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <span>All Inbox</span>
          </button>

          {/* Reply Later Filter Pill */}
          <button
            onClick={() => {
              setActiveSubFilter('reply_later');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeSubFilter === 'reply_later'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : replyLaterCount > 0
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Reply Later</span>
            {replyLaterCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeSubFilter === 'reply_later' ? 'bg-stone-950 text-amber-400' : 'bg-amber-500 text-stone-950'
              }`}>
                {replyLaterCount}
              </span>
            )}
          </button>

          {/* Set Aside Filter Pill */}
          <button
            onClick={() => {
              setActiveSubFilter('set_aside');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeSubFilter === 'set_aside'
                ? 'bg-indigo-500 text-white font-black shadow-xs'
                : setAsideCount > 0
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20'
                  : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Set Aside</span>
            {setAsideCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeSubFilter === 'set_aside' ? 'bg-white text-indigo-700' : 'bg-indigo-500 text-white'
              }`}>
                {setAsideCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubFilter('done')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubFilter === 'done'
                ? 'bg-[#2a2825] text-white border-2 border-[#45413d] shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <span>Done</span>
          </button>

          <button
            onClick={() => setActiveSubFilter('spam')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubFilter === 'spam'
                ? 'bg-[#2a2825] text-white border-2 border-[#45413d] shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <span>Spam</span>
          </button>

          <button
            onClick={() => setActiveSubFilter('archived')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubFilter === 'archived'
                ? 'bg-[#2a2825] text-white border-2 border-[#45413d] shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <span>Archived</span>
          </button>

          {/* Deleted / Trash Filter Pill */}
          <button
            id="trash-subfilter-pill"
            onClick={() => setActiveSubFilter('trash')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeSubFilter === 'trash'
                ? 'bg-rose-600 text-white font-black shadow-xs'
                : deletedCount > 0
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20'
                  : 'text-stone-400 hover:text-white hover:bg-[#232220]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Trash</span>
            {deletedCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeSubFilter === 'trash' ? 'bg-white text-rose-700' : 'bg-rose-500 text-white'
              }`}>
                {deletedCount}
              </span>
            )}
          </button>
        </div>

        {/* Trash Banner Header (Visible when Trash subfilter is active) */}
        {activeSubFilter === 'trash' && (
          <div className="bg-[#211615] border-2 border-rose-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-rose-100 shadow-lg animate-in fade-in duration-150">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-sm">
                <Trash2 className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <div className="font-black text-white text-base flex items-center gap-2">
                  <span>Trash &amp; Deleted Emails</span>
                  <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800/80 font-mono font-bold px-2 py-0.5 rounded-full">
                    {deletedCount} {deletedCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="text-xs text-stone-300 font-medium">
                  Emails in Trash can be brought back with one click or permanently removed.
                </div>
              </div>
            </div>

            {deletedCount > 0 && (
              <button
                id="empty-trash-btn"
                onClick={() => {
                  if (onEmptyTrash) {
                    onEmptyTrash();
                    showToast('Trash emptied successfully');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0 active:scale-95"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                <span>Empty Trash</span>
              </button>
            )}
          </div>
        )}

        {/* Email Items List (Bolder, Stronger, Bigger user initials, badges, and typography) */}
        <div className="space-y-2.5">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => {
              const recipient = email.recipientEmail || 'hi@rezb.de';
              const avatarInitials = email.avatar || email.senderName.slice(0, 2).toUpperCase();

              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`border-2 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group flex items-start sm:items-center justify-between gap-4 shadow-sm ${
                    email.isDeleted 
                      ? 'bg-[#1e1716] hover:bg-[#251d1c] border-rose-950/60 hover:border-rose-800/60' 
                      : 'bg-[#1c1b1a] hover:bg-[#242321] border-[#282624] hover:border-[#3d3a36]'
                  }`}
                >
                  {/* Left: Avatar + Content Stack */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    
                    {/* Circle Avatar (Bolder & Bigger Deep Teal or Rose if deleted) */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-sm tracking-wider shrink-0 group-hover:scale-105 transition-transform shadow-md ${
                      email.isDeleted
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800/80'
                        : 'bg-[#133732] text-[#2dd4bf] border-[#1c554e]'
                    }`}>
                      {avatarInitials}
                    </div>

                    {/* Sender, Subject, Recipient Pill, Snippet */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      
                      {/* Top Line: Sender Email / Name + Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-sm sm:text-base truncate">
                          {email.senderEmail || email.senderName}
                        </span>
                        {email.isDeleted && (
                          <span className="bg-rose-900/60 text-rose-300 border border-rose-700/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <Trash2 className="w-2.5 h-2.5" />
                            <span>Deleted</span>
                          </span>
                        )}
                        {email.hasAttachments && (
                          <Paperclip className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={2.5} />
                        )}
                      </div>

                      {/* Middle Line: Subject */}
                      <div className="text-xs sm:text-sm font-bold text-stone-100 truncate">
                        {email.subject}
                      </div>

                      {/* Bottom Line: Recipient Pill + Preview Snippet */}
                      <div className="flex items-center gap-2.5 text-xs text-stone-400 truncate">
                        <span className="bg-[#262422] text-stone-300 border border-[#383532] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0">
                          {recipient}
                        </span>
                        <span className="truncate text-stone-400 text-xs sm:text-sm font-medium">
                          {email.preview || email.body.slice(0, 90)}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Right: Actions / Date */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
                    {/* If in Trash, show Quick Action Buttons */}
                    {email.isDeleted ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            onRestoreEmail?.(email.id);
                            showToast('Email restored to Inbox');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#2b2926] hover:bg-[#383531] border border-stone-600 text-stone-200 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Restore to Inbox"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden md:inline">Restore</span>
                        </button>
                        <button
                          onClick={() => {
                            onPermanentDelete?.(email.id);
                            showToast('Email permanently deleted');
                          }}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-600 border border-rose-800 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Delete Forever"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Delete</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm text-stone-400 font-bold font-mono whitespace-nowrap">
                          {email.receivedAt}
                        </span>

                        {/* Glowing Teal Unread Indicator Dot */}
                        {!email.isRead ? (
                          <span className="w-3 h-3 rounded-full bg-[#2dd4bf] shadow-md shadow-teal-400/80 animate-pulse" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-transparent" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#232220] text-stone-400 border-2 border-[#383633] flex items-center justify-center mx-auto shadow-md">
                {activeSubFilter === 'trash' ? (
                  <Trash2 className="w-7 h-7 text-rose-400" strokeWidth={2.5} />
                ) : (
                  <Mail className="w-7 h-7 text-stone-400" strokeWidth={2.5} />
                )}
              </div>
              <h3 className="text-base font-black text-white">
                {activeSubFilter === 'trash' ? 'Trash is empty' : 'No emails found in this view'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto font-medium">
                {activeSubFilter === 'trash' 
                  ? 'Deleted emails will appear here where you can restore them or permanently empty them.'
                  : (searchQuery ? 'Try adjusting your search keywords.' : 'Your inbox is completely clear!')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
