import React, { useState } from 'react';
import { AppView } from '../../types';
import { Inbox, Check, X, Shield, ArrowRight, Sparkles, Filter, ChevronRight, Mail } from 'lucide-react';

interface InboxShowcaseProps {
  onNavigate: (view: AppView) => void;
}

export const InboxShowcase: React.FC<InboxShowcaseProps> = ({ onNavigate }) => {
  const [screenerSenders, setScreenerSenders] = useState([
    {
      id: '1',
      name: 'Sophia Laurent',
      email: 'sophia@laurentdesign.co',
      subject: 'Collaborative lookbook feature proposal for Spring 2026',
      preview: 'Hello! I have been following Sendline’s editorial templates for months and would love to propose...',
      date: '10m ago'
    },
    {
      id: '2',
      name: 'Growth Summit 2026',
      email: 'blast@spamconferences.biz',
      subject: 'URGENT: Keynote speaker slots filling fast! Act now!',
      preview: 'Dear marketing leader, our automated system identified you as a potential high-value attendee...',
      date: '45m ago'
    }
  ]);

  const [approvedCount, setApprovedCount] = useState(14);
  const [blockedCount, setBlockedCount] = useState(89);

  const handleScreenIn = (id: string) => {
    setScreenerSenders(screenerSenders.filter(s => s.id !== id));
    setApprovedCount(prev => prev + 1);
  };

  const handleScreenOut = (id: string) => {
    setScreenerSenders(screenerSenders.filter(s => s.id !== id));
    setBlockedCount(prev => prev + 1);
  };

  return (
    <section id="screener" className="py-24 bg-white border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            The Screener & Mailbox
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            You decide who gets into your inbox.
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            First-time senders wait at The Screener until you approve them with a single click. No cold outreach spam, no newsletter clutter in your primary discussions.
          </p>
        </div>

        {/* Screener Interactive Box */}
        <div className="max-w-5xl mx-auto bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
          
          {/* Top Bar Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-stone-950">The Screener</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {screenerSenders.length} Pending
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Approve genuine contacts once; block cold spammers forever.</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{approvedCount} Allowed in Inbox</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{blockedCount} Screened Out</span>
              </div>
            </div>
          </div>

          {/* Pending Senders List */}
          <div className="py-6 space-y-4">
            {screenerSenders.length > 0 ? (
              screenerSenders.map((sender) => (
                <div
                  key={sender.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-stone-300 transition-all"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-stone-950">{sender.name}</span>
                      <span className="text-xs text-stone-400 font-mono">{sender.email}</span>
                      <span className="text-[11px] text-stone-400">{sender.date}</span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800">{sender.subject}</div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {sender.preview}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleScreenOut(sender.id)}
                      className="px-4 py-2 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Screen Out</span>
                    </button>
                    <button
                      onClick={() => handleScreenIn(sender.id)}
                      className="px-5 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Screen In</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Your Screener is completely clear!</h4>
                <p className="text-xs text-stone-500 mt-1">All incoming senders have been processed.</p>
                <button
                  onClick={() => setScreenerSenders([
                    {
                      id: 'demo-1',
                      name: 'Elena Vance',
                      email: 'elena@vancestudio.com',
                      subject: 'Editorial campaign collaboration request',
                      preview: 'Hello team, love your magazine-grade email builder! Would love to sync...',
                      date: 'Just now'
                    }
                  ])}
                  className="mt-4 px-4 py-2 rounded-full bg-stone-100 text-stone-900 text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Reset Demo Sender
                </button>
              </div>
            )}
          </div>

          {/* Bottom CTA to open Mailbox */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Compatible with custom domains (<span className="font-mono text-stone-700">yourname@brand.com</span>) and <span className="font-mono text-stone-700">@sendline.io</span>.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                id="showcase-standalone-mailbox-btn"
                onClick={() => onNavigate('standalone-mailbox')}
                className="px-5 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Launch Standalone Mail (mail.sendline.io)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('inbox')}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View in Workspace</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
