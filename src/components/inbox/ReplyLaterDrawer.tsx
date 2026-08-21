import React, { useState } from 'react';
import { InboxEmail } from '../../types';
import { 
  Clock, 
  X, 
  Send, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Inbox, 
  CornerUpLeft, 
  Trash2,
  Sparkles
} from 'lucide-react';

interface ReplyLaterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  replyLaterEmails: InboxEmail[];
  onSelectEmail: (email: InboxEmail) => void;
  onRemoveFromReplyLater: (emailId: string) => void;
  onSendReply: (emailId: string, replyText: string) => void;
}

export const ReplyLaterDrawer: React.FC<ReplyLaterDrawerProps> = ({
  isOpen,
  onClose,
  replyLaterEmails,
  onSelectEmail,
  onRemoveFromReplyLater,
  onSendReply
}) => {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [focusReplyText, setFocusReplyText] = useState('');
  const [replyToast, setReplyToast] = useState(false);

  if (!isOpen) return null;

  const currentFocusEmail = focusIndex !== null ? replyLaterEmails[focusIndex] : null;

  const handleSendAndNext = () => {
    if (!currentFocusEmail || !focusReplyText.trim()) return;
    onSendReply(currentFocusEmail.id, focusReplyText.trim());
    onRemoveFromReplyLater(currentFocusEmail.id);
    setFocusReplyText('');
    setReplyToast(true);
    setTimeout(() => setReplyToast(false), 2000);

    if (focusIndex !== null && focusIndex < replyLaterEmails.length - 1) {
      // Stay on same index
    } else {
      setFocusIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200 font-sans">
      
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#181716] rounded-t-3xl border-t-2 border-x-2 border-[#2e2c2a] shadow-2xl overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom duration-200 text-stone-100">
        
        {/* Top Handle & Header */}
        <div className="p-4 sm:p-5 border-b border-[#282725] flex items-center justify-between bg-[#141312] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/30 border-2 border-amber-500 text-amber-300 flex items-center justify-center font-black text-xs shadow-xs">
              <Clock className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-white">
                  Reply Later Shelf
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border-2 border-amber-800">
                  {replyLaterEmails.length} Queued
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium mt-0.5">
                Answer on your own schedule when you have dedicated focus time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {replyLaterEmails.length > 0 && focusIndex === null && (
              <button
                id="start-focus-reply-btn"
                onClick={() => setFocusIndex(0)}
                className="px-4 py-2 rounded-2xl bg-[#ea583a] hover:bg-[#d44827] text-white text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer border-2 border-rose-400"
              >
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span>Start Focus Reply Flow</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#252422] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* FOCUS REPLY MODE: 1-by-1 Flow */}
          {currentFocusEmail ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-[#282725]">
                <span>
                  Focus Mode: Email {focusIndex! + 1} of {replyLaterEmails.length}
                </span>
                <button
                  onClick={() => setFocusIndex(null)}
                  className="font-bold text-stone-300 hover:text-white underline cursor-pointer"
                >
                  Exit Focus Mode
                </button>
              </div>

              {/* Thread Context Card */}
              <div className="p-5 rounded-3xl bg-[#222120] border border-[#33312e] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#183835] text-[#2dd4bf] flex items-center justify-center font-bold text-xs">
                      {currentFocusEmail.avatar || currentFocusEmail.senderName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{currentFocusEmail.senderName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{currentFocusEmail.senderEmail}</div>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400">{currentFocusEmail.receivedAt}</span>
                </div>

                <div className="text-xs font-bold text-stone-100">{currentFocusEmail.subject}</div>
                <div className="text-xs text-stone-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line p-3 bg-[#1a1918] rounded-2xl border border-[#2c2a28]">
                  {currentFocusEmail.body}
                </div>
              </div>

              {/* Focus Reply Composer */}
              <div className="p-5 rounded-3xl bg-[#222120] border border-[#33312e] shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                  <CornerUpLeft className="w-3.5 h-3.5 text-[#e55331]" />
                  <span>Write Reply to {currentFocusEmail.senderName}</span>
                </div>

                <textarea
                  rows={4}
                  autoFocus
                  placeholder="Type your response..."
                  value={focusReplyText}
                  onChange={(e) => setFocusReplyText(e.target.value)}
                  className="w-full bg-[#1a1918] text-white text-xs p-3.5 rounded-2xl border border-[#33312e] focus:outline-none focus:border-[#e55331] resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      if (focusIndex! < replyLaterEmails.length - 1) {
                        setFocusIndex(focusIndex! + 1);
                      } else {
                        setFocusIndex(null);
                      }
                    }}
                    className="text-xs text-stone-400 hover:text-white font-semibold cursor-pointer"
                  >
                    Skip to Next
                  </button>

                  <button
                    onClick={handleSendAndNext}
                    disabled={!focusReplyText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#e55331] hover:bg-[#d44827] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send & Next</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LIST VIEW OF QUEUED EMAILS */
            <div className="space-y-3">
              {replyLaterEmails.length > 0 ? (
                replyLaterEmails.map((email, idx) => (
                  <div
                    key={email.id}
                    className="bg-[#222120] hover:bg-[#282725] border border-[#33312e] rounded-2xl p-4 transition-all flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onSelectEmail(email);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-[#183835] text-[#2dd4bf] border border-[#224e4a] flex items-center justify-center font-bold text-xs shrink-0">
                        {email.avatar || email.senderName.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{email.senderName}</span>
                          <span className="text-[11px] text-stone-400 font-mono truncate">{email.senderEmail}</span>
                        </div>
                        <div className="text-xs text-stone-300 font-medium truncate">{email.subject}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocusIndex(idx);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2e2c2a] hover:bg-[#383533] text-stone-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <CornerUpLeft className="w-3 h-3 text-[#e55331]" />
                        <span>Reply</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromReplyLater(email.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-[#2c2a28] cursor-pointer"
                        title="Remove from Shelf"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-2">
                  <Clock className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                  <div className="text-xs font-bold text-white">Your Reply Later Shelf is empty</div>
                  <p className="text-[11px] text-stone-400">
                    Use the "Reply Later" action on any email when you want to batch replies.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
