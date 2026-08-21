import React from 'react';
import { InboxEmail } from '../../types';
import { StickyNote, X, ExternalLink, ArrowRight } from 'lucide-react';

interface ClipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: InboxEmail[];
  onSelectEmail: (email: InboxEmail) => void;
}

export const ClipsModal: React.FC<ClipsModalProps> = ({
  isOpen,
  onClose,
  emails,
  onSelectEmail
}) => {
  if (!isOpen) return null;

  // Extract all clips across emails
  const allClips: Array<{
    clipId: string;
    text: string;
    createdAt: string;
    email: InboxEmail;
  }> = [];

  emails.forEach(email => {
    if (email.clipNotes && email.clipNotes.length > 0) {
      email.clipNotes.forEach(cn => {
        allClips.push({
          clipId: cn.id,
          text: cn.text,
          createdAt: cn.createdAt,
          email
        });
      });
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-150 font-sans">
      
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#181716] rounded-3xl border-2 border-[#2e2c2a] shadow-2xl overflow-hidden flex flex-col z-10 text-stone-100">
        
        {/* Header */}
        <div className="p-5 border-b border-[#282725] flex items-center justify-between bg-[#141312]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/30 border-2 border-amber-500 text-amber-300 flex items-center justify-center font-black text-xs shadow-xs">
              <StickyNote className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Clips & Notes
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                Private notes and excerpts clipped from your conversations.
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

        {/* List of Clips */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {allClips.length > 0 ? (
            allClips.map((item) => (
              <div
                key={item.clipId}
                className="p-4 sm:p-5 rounded-2xl bg-[#222120] border-2 border-[#33312e] hover:border-[#44413e] transition-all space-y-3 cursor-pointer shadow-xs"
                onClick={() => {
                  onClose();
                  onSelectEmail(item.email);
                }}
              >
                <div className="text-xs sm:text-sm text-amber-300 font-medium leading-relaxed whitespace-pre-line bg-[#181716] p-3.5 rounded-xl border border-amber-900/40">
                  "{item.text}"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2c2a28] text-xs text-stone-400">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-black text-white truncate">{item.email.subject}</span>
                    <span>·</span>
                    <span className="truncate font-medium">{item.email.senderName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#ea583a] font-bold shrink-0 ml-2">
                    <span>View Thread</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-2">
              <StickyNote className="w-9 h-9 text-amber-400 mx-auto opacity-70" strokeWidth={2.5} />
              <div className="text-sm font-black text-white">No Clips saved yet</div>
              <p className="text-xs text-stone-400 font-medium">
                When viewing an email, highlight text or add a Clip to store key notes here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
