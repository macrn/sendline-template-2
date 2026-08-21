import React from 'react';
import { InboxEmail } from '../../types';
import { 
  Bookmark, 
  X, 
  ExternalLink, 
  Trash2, 
  Inbox, 
  Paperclip,
  Check
} from 'lucide-react';

interface SetAsideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setAsideEmails: InboxEmail[];
  onSelectEmail: (email: InboxEmail) => void;
  onRemoveFromSetAside: (emailId: string) => void;
}

export const SetAsideDrawer: React.FC<SetAsideDrawerProps> = ({
  isOpen,
  onClose,
  setAsideEmails,
  onSelectEmail,
  onRemoveFromSetAside
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200 font-sans">
      
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#181716] rounded-t-3xl border-t-2 border-x-2 border-[#2e2c2a] shadow-2xl overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom duration-200 text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#282725] flex items-center justify-between bg-[#141312] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/30 border-2 border-indigo-500 text-indigo-300 flex items-center justify-center font-black text-xs shadow-xs">
              <Bookmark className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-white">
                  Set Aside Reference Pile
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border-2 border-indigo-800">
                  {setAsideEmails.length} Pinned
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium mt-0.5">
                Keep important tickets, codes, or active projects within arm's reach.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-[#252422] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* List of Pinned Emails */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {setAsideEmails.length > 0 ? (
            setAsideEmails.map((email) => (
              <div
                key={email.id}
                className="bg-[#222120] hover:bg-[#282725] border-2 border-[#33312e] hover:border-[#423f3b] rounded-2xl p-4 sm:p-5 transition-all flex items-center justify-between gap-4 cursor-pointer shadow-xs"
                onClick={() => {
                  onClose();
                  onSelectEmail(email);
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-2xl bg-[#143a35] text-[#2dd4bf] border-2 border-[#246059] flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {email.avatar || email.senderName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs sm:text-sm">{email.senderName}</span>
                      <span className="text-xs text-stone-400 font-mono font-medium truncate">{email.senderEmail}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-stone-200 font-bold truncate">{email.subject}</div>
                    <div className="text-xs text-stone-400 truncate font-medium">{email.preview || email.body.slice(0, 80)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-stone-400 font-mono font-bold hidden sm:inline">{email.receivedAt}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromSetAside(email.id);
                    }}
                    className="p-2 text-stone-400 hover:text-rose-400 rounded-xl hover:bg-[#2c2a28] cursor-pointer transition-colors"
                    title="Unpin / Remove from Set Aside"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <Bookmark className="w-9 h-9 text-indigo-400 mx-auto opacity-80" strokeWidth={2.5} />
              <div className="text-sm font-black text-white">Your Set Aside pile is empty</div>
              <p className="text-xs text-stone-400 font-medium">
                Pin emails here by clicking "Set Aside" when you need them for ongoing reference.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
