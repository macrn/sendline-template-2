import React, { useState, useEffect, useRef } from 'react';
import { AppView, InboxEmail, ScreenerItem, MailboxCategory } from '../../types';
import { MailboxTopNav } from './MailboxTopNav';
import { ImboxView } from './ImboxView';
import { FeedView } from './FeedView';
import { PaperTrailView } from './PaperTrailView';
import { ScreenerView } from './ScreenerView';
import { ReplyLaterDrawer } from './ReplyLaterDrawer';
import { SetAsideDrawer } from './SetAsideDrawer';
import { ClipsModal } from './ClipsModal';
import { ComposeModal, EmailAttachment } from './ComposeModal';
import { ExternalLink, Sparkles, Shield, ArrowRight, RotateCcw, Undo2, Trash2, Send, X, Check, CheckCircle2, Archive, Clock, Bookmark, Star, Layers, Receipt, Inbox } from 'lucide-react';

interface InboxHubProps {
  emails: InboxEmail[];
  screenerItems: ScreenerItem[];
  onScreenDecision: (id: string, decision: 'in' | 'out' | 'feed' | 'papertrail') => void;
  onSendEmail: (email: InboxEmail) => void;
  onNavigate: (view: AppView) => void;
  availableMailboxes?: string[];
  isStandalone?: boolean;
}

interface PendingUndoAction {
  id: string;
  type: 'delete' | 'send_outbound' | 'send_reply' | 'mark_done' | 'archive' | 'reply_later' | 'set_aside' | 'star' | 'move_category' | 'screener_decision';
  title: string;
  description: string;
  secondsRemaining: number;
  data: any;
}

export const InboxHub: React.FC<InboxHubProps> = ({
  emails,
  screenerItems,
  onScreenDecision,
  onSendEmail,
  onNavigate,
  availableMailboxes = ['mehmet@sendline.io', 'support@minimalstudio.design', 'billing@acmedtc.com'],
  isStandalone = false
}) => {
  const [activeCategory, setActiveCategory] = useState<MailboxCategory>('imbox');
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMailboxEmail, setActiveMailboxEmail] = useState<string>('all');
  
  // Drawer & Modal States
  const [showReplyLaterDrawer, setShowReplyLaterDrawer] = useState(false);
  const [showSetAsideDrawer, setShowSetAsideDrawer] = useState(false);
  const [showClipsModal, setShowClipsModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeDraft, setComposeDraft] = useState<any | null>(null);
  const [restoredReplyDraft, setRestoredReplyDraft] = useState<{ emailId: string; body: string; attachments?: EmailAttachment[] } | null>(null);

  // Local mutable email state to handle instant UI updates
  const [localEmails, setLocalEmails] = useState<InboxEmail[]>(emails);

  // -------------------------------------------------------------
  // UNDO SYSTEM STATE & 5-SECOND COUNTDOWN CONTROLLER
  // -------------------------------------------------------------
  const [pendingUndo, setPendingUndo] = useState<PendingUndoAction | null>(null);
  const undoIntervalRef = useRef<any>(null);
  const pendingUndoRef = useRef<PendingUndoAction | null>(null);
  pendingUndoRef.current = pendingUndo;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, []);

  // Keyboard shortcut listener: Cmd+Z, Ctrl+Z, or 'z' triggers undo if toast is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pendingUndoRef.current) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('[contenteditable="true"]') ||
          target.closest('.rich-text-editor'))
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        triggerUndo();
      } else if (e.key.toLowerCase() === 'z' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        triggerUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startUndoCountdown = (action: Omit<PendingUndoAction, 'secondsRemaining'>) => {
    if (undoIntervalRef.current) {
      clearInterval(undoIntervalRef.current);
    }

    const newAction: PendingUndoAction = {
      ...action,
      secondsRemaining: 5
    };
    setPendingUndo(newAction);

    undoIntervalRef.current = setInterval(() => {
      setPendingUndo(prev => {
        if (!prev) {
          clearInterval(undoIntervalRef.current);
          return null;
        }
        if (prev.secondsRemaining <= 1) {
          clearInterval(undoIntervalRef.current);
          // Commit action finalize
          finalizePendingAction(prev);
          return null;
        }
        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1
        };
      });
    }, 1000);
  };

  const finalizePendingAction = (action: PendingUndoAction) => {
    if (action.type === 'send_outbound') {
      const data = action.data;
      const newEmail: InboxEmail = {
        id: 'em-' + Date.now(),
        senderName: 'Mehmet Arslan',
        senderEmail: data.from,
        recipientEmail: data.to,
        avatar: 'MA',
        subject: data.subject,
        preview: data.body.slice(0, 90),
        body: data.body,
        receivedAt: 'Just now',
        category: 'imbox',
        isRead: true,
        hasAttachments: (data.attachments && data.attachments.length > 0) || false,
        attachments: data.attachments,
        tags: ['Outbound', 'Direct'],
        threadMessages: [
          {
            id: 'msg-out-1',
            senderName: 'Mehmet Arslan',
            senderEmail: data.from,
            avatar: 'MA',
            body: data.body,
            receivedAt: 'Just now',
            isOutbound: true
          }
        ]
      };
      onSendEmail(newEmail);
      setLocalEmails(prev => [newEmail, ...prev]);
      setActiveCategory('imbox');
      setSelectedEmail(newEmail);
    } else if (action.type === 'send_reply') {
      const { emailId, replyText } = action.data;
      const newThreadMsg = {
        id: 'msg-' + Date.now(),
        senderName: 'Mehmet Arslan',
        senderEmail: activeMailboxEmail !== 'all' ? activeMailboxEmail : 'mehmet@sendline.io',
        avatar: 'MA',
        body: replyText,
        receivedAt: 'Just now',
        isOutbound: true
      };

      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          const existingMessages = e.threadMessages || [
            {
              id: 'orig',
              senderName: e.senderName,
              senderEmail: e.senderEmail,
              avatar: e.avatar,
              body: e.body,
              receivedAt: e.receivedAt,
              isOutbound: false
            }
          ];
          return {
            ...e,
            isRead: true,
            threadMessages: [...existingMessages, newThreadMsg]
          };
        }
        return e;
      }));

      setSelectedEmail(prev => {
        if (prev && prev.id === emailId) {
          const existingMessages = prev.threadMessages || [
            {
              id: 'orig',
              senderName: prev.senderName,
              senderEmail: prev.senderEmail,
              avatar: prev.avatar,
              body: prev.body,
              receivedAt: prev.receivedAt,
              isOutbound: false
            }
          ];
          return {
            ...prev,
            isRead: true,
            threadMessages: [...existingMessages, newThreadMsg]
          };
        }
        return prev;
      });
    }
  };

  const triggerUndo = () => {
    if (!pendingUndo) return;
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);

    const action = pendingUndo;
    setPendingUndo(null);

    if (action.type === 'delete') {
      const emailId = action.data.id;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, isDeleted: false, deletedAt: undefined };
        }
        return e;
      }));
      // Restore selected email if it was open
      if (action.data.wasSelected) {
        setSelectedEmail({ ...action.data.email, isDeleted: false, deletedAt: undefined });
      }
    } else if (action.type === 'send_outbound') {
      // Restore compose draft and re-open modal
      setComposeDraft(action.data);
      setShowComposeModal(true);
    } else if (action.type === 'send_reply') {
      // Re-populate reply composer in thread
      setRestoredReplyDraft(action.data);
    } else if (action.type === 'mark_done') {
      const { emailId, prevIsRead, prevTags, wasSelected, email } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, isRead: prevIsRead, tags: prevTags };
        }
        return e;
      }));
      if (wasSelected) {
        setSelectedEmail({ ...email, isRead: prevIsRead, tags: prevTags });
      }
    } else if (action.type === 'archive') {
      const { emailId, prevTags, wasSelected, email } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, tags: prevTags };
        }
        return e;
      }));
      if (wasSelected) {
        setSelectedEmail({ ...email, tags: prevTags });
      }
    } else if (action.type === 'reply_later') {
      const { emailId, previousState } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, replyLater: previousState };
        }
        return e;
      }));
      if (selectedEmail && selectedEmail.id === emailId) {
        setSelectedEmail(prev => prev ? { ...prev, replyLater: previousState } : null);
      }
    } else if (action.type === 'set_aside') {
      const { emailId, previousState } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, setAside: previousState };
        }
        return e;
      }));
      if (selectedEmail && selectedEmail.id === emailId) {
        setSelectedEmail(prev => prev ? { ...prev, setAside: previousState } : null);
      }
    } else if (action.type === 'star') {
      const { emailId, previousState } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, isStarred: previousState };
        }
        return e;
      }));
      if (selectedEmail && selectedEmail.id === emailId) {
        setSelectedEmail(prev => prev ? { ...prev, isStarred: previousState } : null);
      }
    } else if (action.type === 'move_category') {
      const { emailId, prevCategory, wasSelected, email } = action.data;
      setLocalEmails(prev => prev.map(e => {
        if (e.id === emailId) {
          return { ...e, category: prevCategory };
        }
        return e;
      }));
      setActiveCategory(prevCategory);
      if (wasSelected) {
        setSelectedEmail({ ...email, category: prevCategory });
      }
    } else if (action.type === 'screener_decision') {
      const { id } = action.data;
      onScreenDecision(id, 'pending' as any);
      setActiveCategory('screener');
    }
  };

  const handleSendNowImmediately = () => {
    if (!pendingUndo) return;
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    const action = pendingUndo;
    setPendingUndo(null);
    finalizePendingAction(action);
  };

  // Filtered emails based on selected mailbox address in the global bar
  const displayedEmails = localEmails.filter(e => {
    if (activeMailboxEmail && activeMailboxEmail !== 'all') {
      const match = (e.recipientEmail?.toLowerCase() === activeMailboxEmail.toLowerCase()) ||
                    (e.senderEmail?.toLowerCase() === activeMailboxEmail.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  // Sync if parent emails change
  React.useEffect(() => {
    setLocalEmails(emails);
  }, [emails]);

  // Derived counts
  const pendingScreenerCount = screenerItems.filter(s => s.status === 'pending').length;
  const unreadImboxCount = displayedEmails.filter(e => e.category === 'imbox' && !e.isRead && !e.isDeleted).length;
  const replyLaterEmails = displayedEmails.filter(e => e.replyLater && !e.isDeleted);
  const setAsideEmails = displayedEmails.filter(e => e.setAside && !e.isDeleted);
  const totalClipsCount = displayedEmails.reduce((acc, e) => acc + (e.clipNotes?.length || 0), 0);

  // Actions
  const handleToggleReplyLater = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const previousState = !!targetEmail.replyLater;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, replyLater: !previousState };
      }
      return e;
    }));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, replyLater: !previousState } : null);
    }

    startUndoCountdown({
      id: 'undo-replylater-' + Date.now(),
      type: 'reply_later',
      title: previousState ? 'Removed from Reply Later' : 'Queued in Reply Later shelf',
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, previousState }
    });
  };

  const handleToggleSetAside = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const previousState = !!targetEmail.setAside;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, setAside: !previousState };
      }
      return e;
    }));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, setAside: !previousState } : null);
    }

    startUndoCountdown({
      id: 'undo-setaside-' + Date.now(),
      type: 'set_aside',
      title: previousState ? 'Removed from Set Aside' : 'Pinned to Set Aside reference pile',
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, previousState }
    });
  };

  const handleAddClipNote = (emailId: string, noteText: string) => {
    const newNote = {
      id: 'cn-' + Date.now(),
      text: noteText,
      createdAt: 'Just now'
    };

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        const existing = e.clipNotes || [];
        return { ...e, clipNotes: [newNote, ...existing] };
      }
      return e;
    }));

    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? {
        ...prev,
        clipNotes: [newNote, ...(prev.clipNotes || [])]
      } : null);
    }
  };

  const handleDeleteClipNote = (emailId: string, noteId: string) => {
    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, clipNotes: (e.clipNotes || []).filter(n => n.id !== noteId) };
      }
      return e;
    }));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? {
        ...prev,
        clipNotes: (prev.clipNotes || []).filter(n => n.id !== noteId)
      } : null);
    }
  };

  const handleMoveCategory = (emailId: string, category: 'imbox' | 'feed' | 'papertrail') => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const prevCategory = targetEmail.category;
    const wasSelected = selectedEmail?.id === emailId;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, category };
      }
      return e;
    }));
    if (wasSelected) {
      setSelectedEmail(null);
    }
    setActiveCategory(category);

    const categoryName = category === 'imbox' ? 'Inbox' : category === 'feed' ? 'The Feed' : 'Paper Trail';
    startUndoCountdown({
      id: 'undo-move-' + Date.now(),
      type: 'move_category',
      title: `Moved to ${categoryName}`,
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, prevCategory, wasSelected, email: targetEmail }
    });
  };

  const handleMarkDone = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const prevIsRead = targetEmail.isRead;
    const prevTags = targetEmail.tags || [];
    const wasSelected = selectedEmail?.id === emailId;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        const tags = e.tags || [];
        return { ...e, isRead: true, tags: tags.includes('Done') ? tags : [...tags, 'Done'] };
      }
      return e;
    }));
    if (wasSelected) {
      setSelectedEmail(null);
    }

    startUndoCountdown({
      id: 'undo-done-' + Date.now(),
      type: 'mark_done',
      title: 'Thread marked as Done',
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, prevIsRead, prevTags, wasSelected, email: targetEmail }
    });
  };

  const handleArchive = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const prevTags = targetEmail.tags || [];
    const wasSelected = selectedEmail?.id === emailId;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        const tags = e.tags || [];
        return { ...e, tags: tags.includes('Archived') ? tags : [...tags, 'Archived'] };
      }
      return e;
    }));
    if (wasSelected) {
      setSelectedEmail(null);
    }

    startUndoCountdown({
      id: 'undo-archive-' + Date.now(),
      type: 'archive',
      title: 'Thread Archived',
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, prevTags, wasSelected, email: targetEmail }
    });
  };

  const handleScreenOutSender = (senderEmail: string, emailId: string) => {
    setLocalEmails(prev => prev.filter(e => e.id !== emailId));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  // -------------------------------------------------------------
  // DELETE & TRASH HANDLERS WITH 5-SECOND UNDO
  // -------------------------------------------------------------
  const handleDeleteEmail = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;

    const wasSelected = selectedEmail?.id === emailId;

    // Mark as deleted in local state
    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, isDeleted: true, deletedAt: 'Just now' };
      }
      return e;
    }));

    if (wasSelected) {
      setSelectedEmail(null);
    }

    // Trigger 5-second Undo notification
    startUndoCountdown({
      id: 'undo-del-' + Date.now(),
      type: 'delete',
      title: 'Email moved to Trash',
      description: targetEmail.subject || targetEmail.senderName,
      data: { id: emailId, wasSelected, email: targetEmail }
    });
  };

  const handleRestoreEmail = (emailId: string) => {
    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, isDeleted: false, deletedAt: undefined };
      }
      return e;
    }));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, isDeleted: false, deletedAt: undefined } : null);
    }
  };

  const handlePermanentDelete = (emailId: string) => {
    setLocalEmails(prev => prev.filter(e => e.id !== emailId));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleEmptyTrash = () => {
    setLocalEmails(prev => prev.filter(e => !e.isDeleted));
    if (selectedEmail && selectedEmail.isDeleted) {
      setSelectedEmail(null);
    }
  };

  const handleToggleStar = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const previousState = !!targetEmail.isStarred;

    setLocalEmails(prev => prev.map(e => {
      if (e.id === emailId) {
        return { ...e, isStarred: !previousState };
      }
      return e;
    }));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => prev ? { ...prev, isStarred: !previousState } : null);
    }

    startUndoCountdown({
      id: 'undo-star-' + Date.now(),
      type: 'star',
      title: previousState ? 'Thread Unstarred' : 'Thread Starred',
      description: targetEmail.subject || targetEmail.senderName,
      data: { emailId, previousState }
    });
  };

  const handleMarkUnread = (emailId: string) => {
    setLocalEmails(prev => prev.map(e => (e.id === emailId ? { ...e, isRead: false } : e)));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleForwardEmail = (email: InboxEmail) => {
    const formattedDate = email.receivedAt || 'Recent';
    const forwardBody = `<p><br></p><p><br></p><div style="border-left: 2px solid #ea583a; padding-left: 12px; margin-top: 16px; color: #78716c;"><p><strong>---------- Forwarded message ---------</strong></p><p><strong>From:</strong> ${email.senderName} &lt;${email.senderEmail}&gt;</p><p><strong>Date:</strong> ${formattedDate}</p><p><strong>Subject:</strong> ${email.subject}</p><p><strong>To:</strong> ${email.recipientEmail || 'you'}</p></div><div style="margin-top: 12px;">${email.body}</div>`;

    setComposeDraft({
      from: activeMailboxEmail !== 'all' ? activeMailboxEmail : 'mehmet@sendline.io',
      to: '',
      subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
      body: forwardBody,
      attachments: email.attachments || []
    });
    setShowComposeModal(true);
  };

  const handleUpdateLabels = (emailId: string, labels: string[]) => {
    setLocalEmails(prev => prev.map(e => (e.id === emailId ? { ...e, labels, tags: labels } : e)));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => (prev ? { ...prev, labels, tags: labels } : null));
    }
  };

  const handleToggleNotification = (emailId: string) => {
    const targetEmail = localEmails.find(e => e.id === emailId);
    if (!targetEmail) return;
    const nextState = !targetEmail.hasNotification;

    setLocalEmails(prev => prev.map(e => (e.id === emailId ? { ...e, hasNotification: nextState } : e)));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(prev => (prev ? { ...prev, hasNotification: nextState } : null));
    }
  };

  // -------------------------------------------------------------
  // SEND HANDLERS WITH 5-SECOND UNDO
  // -------------------------------------------------------------
  const handleSendReply = (emailId: string, replyText: string) => {
    // Show Undo Send toast with 5s countdown
    startUndoCountdown({
      id: 'undo-reply-' + Date.now(),
      type: 'send_reply',
      title: 'Sending reply...',
      description: replyText.slice(0, 45) + (replyText.length > 45 ? '...' : ''),
      data: { emailId, replyText }
    });
  };

  const handleSendOutbound = (data: { 
    from: string; 
    to: string; 
    subject: string; 
    body: string;
    attachments?: Array<{ id: string; name: string; size: string; type: string; previewUrl?: string }>;
    cc?: string;
    bcc?: string;
  }) => {
    // Clear draft state and start 5-second undo countdown
    setComposeDraft(null);
    startUndoCountdown({
      id: 'undo-outbound-' + Date.now(),
      type: 'send_outbound',
      title: 'Sending email...',
      description: `To: ${data.to} • "${data.subject}"`,
      data
    });
  };

  const handleScreenDecisionHub = (id: string, decision: 'in' | 'out' | 'feed' | 'papertrail') => {
    const item = screenerItems.find(s => s.id === id);
    onScreenDecision(id, decision);
    if (decision === 'feed') {
      setActiveCategory('feed');
    } else if (decision === 'papertrail') {
      setActiveCategory('papertrail');
    } else if (decision === 'in') {
      setActiveCategory('imbox');
    }

    const title = decision === 'in'
      ? 'Approved & Added to Inbox'
      : decision === 'out'
        ? 'Screened Out (Blocked)'
        : decision === 'feed'
          ? 'Routed to The Feed'
          : 'Routed to Paper Trail';

    startUndoCountdown({
      id: 'undo-screener-' + Date.now(),
      type: 'screener_decision',
      title,
      description: item ? `${item.senderName} (${item.senderEmail})` : 'Screener decision applied',
      data: { id, decision }
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-stone-900 flex flex-col font-sans selection:bg-[#ea583a] selection:text-white relative">
      
      {/* Top Banner if embedded in Workspace Engine informing about standalone URL access */}
      {!isStandalone && (
        <div className="bg-amber-50 text-amber-900 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
            <span className="font-extrabold text-stone-900">Sendline Mailbox Experience:</span>
            <span className="text-amber-800 hidden sm:inline font-medium">
              Accessible directly via dedicated URL <code className="text-[#ea583a] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-amber-200">https://mail.sendline.io</code>
            </span>
          </div>

          <button
            onClick={() => onNavigate('standalone-mailbox')}
            className="px-3 py-1 rounded-xl bg-white hover:bg-stone-50 border-2 border-amber-300 text-stone-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-105"
          >
            <span>Open Standalone Web App View</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ea583a]" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Main Mailbox Navigation Bar */}
      <MailboxTopNav
        activeTab={activeCategory}
        onTabChange={(tab) => {
          setActiveCategory(tab);
          setSelectedEmail(null);
        }}
        pendingScreenerCount={pendingScreenerCount}
        unreadImboxCount={unreadImboxCount}
        replyLaterCount={replyLaterEmails.length}
        setAsideCount={setAsideEmails.length}
        clipsCount={totalClipsCount}
        onOpenCompose={() => {
          setComposeDraft(null);
          setShowComposeModal(true);
        }}
        onOpenReplyLater={() => setShowReplyLaterDrawer(true)}
        onOpenSetAside={() => setShowSetAsideDrawer(true)}
        onOpenClips={() => setShowClipsModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeMailboxEmail={activeMailboxEmail}
        availableMailboxes={availableMailboxes}
        onSelectMailbox={setActiveMailboxEmail}
        isStandalone={isStandalone}
        onNavigateToWorkspace={() => onNavigate('dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeCategory === 'imbox' && (
          <ImboxView
            emails={displayedEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={setSelectedEmail}
            onToggleReplyLater={handleToggleReplyLater}
            onToggleSetAside={handleToggleSetAside}
            onAddClipNote={handleAddClipNote}
            onMoveCategory={handleMoveCategory}
            onScreenOutSender={handleScreenOutSender}
            onSendReply={handleSendReply}
            onDeleteEmail={handleDeleteEmail}
            onMarkDone={handleMarkDone}
            onArchive={handleArchive}
            onRestoreEmail={handleRestoreEmail}
            onPermanentDelete={handlePermanentDelete}
            onEmptyTrash={handleEmptyTrash}
            onToggleStar={handleToggleStar}
            onOpenCompose={() => {
              setComposeDraft(null);
              setShowComposeModal(true);
            }}
            searchQuery={searchQuery}
            onTabSwitch={(tab) => {
              setActiveCategory(tab);
              setSelectedEmail(null);
            }}
            pendingScreenerCount={pendingScreenerCount}
            replyLaterCount={replyLaterEmails.length}
            setAsideCount={setAsideEmails.length}
            clipsCount={totalClipsCount}
            onOpenReplyLater={() => setShowReplyLaterDrawer(true)}
            onOpenSetAside={() => setShowSetAsideDrawer(true)}
            onOpenClips={() => setShowClipsModal(true)}
            availableMailboxes={availableMailboxes}
            restoredReplyDraft={restoredReplyDraft}
            onMarkUnread={handleMarkUnread}
            onForwardEmail={handleForwardEmail}
            onUpdateLabels={handleUpdateLabels}
            onToggleNotification={handleToggleNotification}
            onDeleteClipNote={handleDeleteClipNote}
          />
        )}

        {activeCategory === 'feed' && (
          <FeedView
            emails={displayedEmails}
            onMoveCategory={handleMoveCategory}
            onScreenOutSender={handleScreenOutSender}
            onAddClipNote={handleAddClipNote}
            searchQuery={searchQuery}
            onTabSwitch={(tab) => {
              setActiveCategory(tab);
              setSelectedEmail(null);
            }}
          />
        )}

        {activeCategory === 'papertrail' && (
          <PaperTrailView
            emails={displayedEmails}
            onMoveCategory={handleMoveCategory}
            onScreenOutSender={handleScreenOutSender}
            searchQuery={searchQuery}
            onTabSwitch={(tab) => {
              setActiveCategory(tab);
              setSelectedEmail(null);
            }}
          />
        )}

        {activeCategory === 'screener' && (
          <ScreenerView
            screenerItems={screenerItems}
            onScreenDecision={handleScreenDecisionHub}
            onTabSwitch={(tab) => {
              setActiveCategory(tab);
              setSelectedEmail(null);
            }}
          />
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING 5-SECOND UNDO TOAST BAR (DELETE & SEND)              */}
      {/* ------------------------------------------------------------- */}
      {pendingUndo && (
        <div 
          id="undo-toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200"
        >
          <div className="bg-[#1b1918] border-2 border-[#ea583a] text-white shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-4 sm:gap-6 min-w-[320px] sm:min-w-[420px] max-w-lg">
            
            {/* Left: Animated Circular Countdown Timer */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-stone-700/60"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  className="stroke-[#ea583a] transition-all duration-1000 ease-linear"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={100}
                  strokeDashoffset={100 - ((pendingUndo.secondsRemaining / 5) * 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-black text-xs text-white">
                {pendingUndo.secondsRemaining}s
              </span>
            </div>

            {/* Middle: Title & Description */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                {pendingUndo.type === 'delete' ? (
                  <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'send_outbound' || pendingUndo.type === 'send_reply' ? (
                  <Send className="w-3.5 h-3.5 text-teal-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'mark_done' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'archive' ? (
                  <Archive className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'reply_later' ? (
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'set_aside' ? (
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'star' ? (
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'move_category' ? (
                  <Layers className="w-3.5 h-3.5 text-teal-400 shrink-0" strokeWidth={2.5} />
                ) : pendingUndo.type === 'screener_decision' ? (
                  <Shield className="w-3.5 h-3.5 text-[#ea583a] shrink-0" strokeWidth={2.5} />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5 text-stone-300 shrink-0" strokeWidth={2.5} />
                )}
                <span className="font-black text-sm text-white truncate">
                  {pendingUndo.title}
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate font-medium">
                {pendingUndo.description}
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Primary Undo Button */}
              <button
                id="undo-action-btn"
                onClick={triggerUndo}
                className="px-4 py-2 rounded-xl bg-[#ea583a] hover:bg-[#d94e32] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                title="Undo (Shortcut: Z or Cmd+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Undo</span>
                <span className="hidden sm:inline text-[10px] bg-black/30 font-mono px-1 py-0.2 rounded font-normal">Z</span>
              </button>

              {/* Optional: Send Now immediately button for outbound/reply */}
              {pendingUndo.type !== 'delete' && (
                <button
                  onClick={handleSendNowImmediately}
                  className="px-2.5 py-2 rounded-xl bg-[#282624] hover:bg-[#383531] border border-stone-600 text-stone-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Send immediately without delay"
                >
                  <span>Send Now</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Reply Later Bottom Shelf Drawer */}
      <ReplyLaterDrawer
        isOpen={showReplyLaterDrawer}
        onClose={() => setShowReplyLaterDrawer(false)}
        replyLaterEmails={replyLaterEmails}
        onSelectEmail={(email) => {
          setActiveCategory('imbox');
          setSelectedEmail(email);
        }}
        onRemoveFromReplyLater={handleToggleReplyLater}
        onSendReply={handleSendReply}
      />

      {/* Set Aside Bottom Pile Drawer */}
      <SetAsideDrawer
        isOpen={showSetAsideDrawer}
        onClose={() => setShowSetAsideDrawer(false)}
        setAsideEmails={setAsideEmails}
        onSelectEmail={(email) => {
          setActiveCategory('imbox');
          setSelectedEmail(email);
        }}
        onRemoveFromSetAside={handleToggleSetAside}
      />

      {/* Clips & Thread Notes Modal */}
      <ClipsModal
        isOpen={showClipsModal}
        onClose={() => setShowClipsModal(false)}
        emails={localEmails}
        onSelectEmail={(email) => {
          setActiveCategory(email.category);
          setSelectedEmail(email);
        }}
      />

      {/* Write / Compose Modal */}
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => {
          setShowComposeModal(false);
          setComposeDraft(null);
        }}
        availableMailboxes={availableMailboxes}
        activeMailboxEmail={activeMailboxEmail !== 'all' ? activeMailboxEmail : 'mehmet@sendline.io'}
        onSendOutbound={handleSendOutbound}
        initialDraft={composeDraft}
      />

    </div>
  );
};
