import React, { useState } from 'react';
import { InboxEmail } from '../../types';
import { 
  Layers, 
  BookOpen, 
  Clock, 
  StickyNote, 
  Inbox, 
  Receipt, 
  EyeOff, 
  Check, 
  Share2, 
  ArrowLeft, 
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';

interface FeedViewProps {
  emails: InboxEmail[];
  onMoveCategory: (emailId: string, category: 'imbox' | 'feed' | 'papertrail') => void;
  onScreenOutSender: (senderEmail: string, emailId: string) => void;
  onAddClipNote: (emailId: string, noteText: string) => void;
  searchQuery?: string;
  onTabSwitch?: (tab: 'imbox' | 'feed' | 'papertrail' | 'screener') => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  emails,
  onMoveCategory,
  onScreenOutSender,
  onAddClipNote,
  searchQuery = '',
  onTabSwitch
}) => {
  const [readingEmail, setReadingEmail] = useState<InboxEmail | null>(null);
  const [clipInputId, setClipInputId] = useState<string | null>(null);
  const [clipText, setClipText] = useState('');

  const feedEmails = emails.filter(e => {
    if (e.category !== 'feed' || e.isDeleted) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.subject.toLowerCase().includes(q) ||
      e.senderName.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q)
    );
  });

  const handleSaveClip = (emailId: string) => {
    if (!clipText.trim()) return;
    onAddClipNote(emailId, clipText.trim());
    setClipText('');
    setClipInputId(null);
  };

  // Full-screen Clean Reader View for Newsletter
  if (readingEmail) {
    return (
      <div className="py-8 px-4 sm:px-6 select-none font-sans">
        <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#2a2826]">
            <button
              onClick={() => setReadingEmail(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#262523] hover:bg-[#32302d] border-2 border-[#3d3a36] text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-stone-300" strokeWidth={2.5} />
              <span>Back to Feed</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => onMoveCategory(readingEmail.id, 'imbox')}
                className="px-4 py-2 rounded-2xl bg-[#262523] hover:bg-[#32302d] border-2 border-[#3d3a36] text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Inbox className="w-4 h-4 text-[#ea583a]" strokeWidth={2.5} />
                <span>Move to Inbox</span>
              </button>
            </div>
          </div>

          {/* Newsletter Header */}
          <div className="py-6 space-y-3 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-xs sm:text-sm font-black px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border-2 border-emerald-800 shadow-sm">
                {readingEmail.feedMeta?.publicationName || readingEmail.senderName}
              </span>
              <span className="text-xs font-bold text-stone-400 font-mono">
                {readingEmail.feedMeta?.readingTime || '3 min read'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
              {readingEmail.subject}
            </h1>

            <div className="text-xs sm:text-sm text-stone-400 font-mono font-medium">
              Published by {readingEmail.senderEmail} · {readingEmail.receivedAt}
            </div>
          </div>

          {/* Clean White Magazine Paper for Reading Content */}
          <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-10 shadow-xl font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line border border-stone-200">
            {readingEmail.body}
          </div>

        </div>
      </div>
    );
  }

  // Feed Stream View
  return (
    <div className="py-8 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-4xl mx-auto bg-[#181716] border-2 border-[#2b2927] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        
        {/* Header: Left = Icon & Title; Right = Category Navigation Pills */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2a2826]">
          
          {/* Left: Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Layers className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              Feed
            </h1>
          </div>

          {/* Right: Category Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-[#222120] p-1 rounded-2xl border-2 border-[#33312e] shrink-0">
            <button
              onClick={() => onTabSwitch?.('imbox')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-300 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Inbox</span>
            </button>

            <button
              onClick={() => onTabSwitch?.('feed')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Feed</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-200">
                {feedEmails.length}
              </span>
            </button>

            <button
              onClick={() => onTabSwitch?.('papertrail')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Paper Trail</span>
            </button>

            <button
              onClick={() => onTabSwitch?.('screener')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-stone-400 hover:text-white hover:bg-[#2c2a27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Screener</span>
            </button>
          </div>
        </div>

        {/* Subtitle / Explanation banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-200">
          <Layers className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.5} />
          <span>
            <strong>The Feed:</strong> Your calm personal reading lounge for newsletters, marketing updates, and blog subscriptions without inbox guilt.
          </span>
        </div>

        {/* Newsletter Article Cards */}
        <div className="space-y-4">
          {feedEmails.length > 0 ? (
            feedEmails.map((email) => (
              <div
                key={email.id}
                className="bg-[#1c1b1a] hover:bg-[#232220] border-2 border-[#292725] hover:border-[#3d3a36] rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-sm"
              >
                {/* Meta & Reading Time */}
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-400 text-xs sm:text-sm">
                      {email.feedMeta?.publicationName || email.senderName}
                    </span>
                    <span>·</span>
                    <span className="font-mono font-bold">{email.receivedAt}</span>
                  </div>
                  <span className="bg-[#262422] px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-stone-300 border border-[#383532]">
                    {email.feedMeta?.readingTime || '4 min read'}
                  </span>
                </div>

                {/* Subject & Excerpt */}
                <div 
                  onClick={() => setReadingEmail(email)}
                  className="cursor-pointer space-y-2 group"
                >
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white group-hover:text-emerald-300 transition-colors">
                    {email.subject}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 line-clamp-3 leading-relaxed font-medium">
                    {email.body}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-[#282624] text-xs">
                  <button
                    onClick={() => setReadingEmail(email)}
                    className="px-4 py-2 rounded-2xl bg-[#282624] hover:bg-[#33312e] text-white font-bold flex items-center gap-2 transition-colors cursor-pointer border border-[#383532] shadow-xs"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                    <span>Read Full Issue</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onMoveCategory(email.id, 'imbox')}
                      className="p-2 rounded-xl hover:bg-[#282624] text-stone-400 hover:text-white transition-colors cursor-pointer"
                      title="Move to Inbox"
                    >
                      <Inbox className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onScreenOutSender(email.senderEmail, email.id)}
                      className="p-2 rounded-xl hover:bg-[#282624] text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Unsubscribe / Screen Out"
                    >
                      <EyeOff className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#232220] text-emerald-400 border-2 border-[#383633] flex items-center justify-center mx-auto shadow-md">
                <Layers className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-black text-white">No newsletters in Feed</h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-sm mx-auto font-medium">
                When newsletters or blog digests arrive, screen them into Feed to keep your main inbox calm.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
