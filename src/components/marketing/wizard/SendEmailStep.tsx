import React, { useState } from 'react';
import { EmailTemplate, Campaign } from '../../../types';
import { TemplatePreviewCard } from './TemplatePreviewCard';
import { AudienceState } from './ChooseAudienceStep';
import { 
  Send, 
  Calendar, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  Mail, 
  TrendingUp, 
  Users, 
  ExternalLink,
  PartyPopper
} from 'lucide-react';

interface SendEmailStepProps {
  template: EmailTemplate;
  audienceState: AudienceState;
  onSaveCampaign: (campaign: Campaign) => void;
  onBackToAudience: () => void;
  onClose: () => void;
  onSendTestEmail: (email: string) => void;
}

export const SendEmailStep: React.FC<SendEmailStepProps> = ({
  template,
  audienceState,
  onSaveCampaign,
  onBackToAudience,
  onClose,
  onSendTestEmail
}) => {
  const [sendTiming, setSendTiming] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [scheduleTime, setScheduleTime] = useState<string>('09:00');
  const [timezone, setTimezone] = useState<string>('(GMT-07:00) Pacific Time');
  
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testEmail, setTestEmail] = useState<string>('subscriber@acme.com');
  const [testSentSuccess, setTestSentSuccess] = useState<boolean>(false);

  const totalRecipients = audienceState.recipients.reduce((sum, r) => sum + r.count, 0) || 68400;

  const handleSendOrSchedule = () => {
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsCelebrationOpen(true);

      const isScheduled = sendTiming === 'later';
      const newCampaign: Campaign = {
        id: 'camp-' + Date.now(),
        title: template.name || audienceState.subject.slice(0, 32) || 'Editorial Campaign',
        subject: audienceState.subject || template.subject,
        status: isScheduled ? 'Scheduled' : 'Sent',
        sentCount: totalRecipients,
        openRate: 59.4,
        clickRate: 22.8,
        revenueGenerated: '$31,400',
        date: isScheduled ? `Scheduled for ${scheduleDate} at ${scheduleTime}` : 'Just now',
        audience: audienceState.recipients.length > 0 
          ? audienceState.recipients.map(r => r.label).join(', ') 
          : 'All Subscribers',
        templateId: template.id
      };

      onSaveCampaign(newCampaign);
    }, 1200);
  };

  const handleSendTest = () => {
    onSendTestEmail(testEmail);
    setTestSentSuccess(true);
    setTimeout(() => {
      setTestSentSuccess(false);
      setShowTestModal(false);
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#0A0D14] text-white overflow-hidden select-none relative">
      
      {/* LEFT COLUMN: Scaled Live Email Card Preview (Screenshot 3) */}
      <div className="w-full lg:w-1/2 bg-[#0E121B] border-r border-white/10 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[460px] space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-500">Live Final Delivery Preview</span>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for dispatch
            </span>
          </div>
          <TemplatePreviewCard template={template} maxHeight="max-h-[68vh]" />
        </div>
      </div>

      {/* RIGHT COLUMN: When to send & Dispatch Panel (Screenshot 3) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto bg-[#0A0D14]">
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
              When should we send this email?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Deliver immediately or schedule for optimal engagement and peak open rates.
            </p>
          </div>

          {/* Timing Selection Cards (Now vs. Later) */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {/* Now Option */}
            <button
              onClick={() => setSendTiming('now')}
              className={`p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                sendTiming === 'now'
                  ? 'bg-white text-stone-950 border-white shadow-2xl scale-[1.02]'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${sendTiming === 'now' ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span className="text-base font-bold">Now</span>
              <span className={`text-xs ${sendTiming === 'now' ? 'text-stone-600' : 'text-stone-500'}`}>
                Deliver immediately
              </span>
            </button>

            {/* Later Option */}
            <button
              onClick={() => setSendTiming('later')}
              className={`p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                sendTiming === 'later'
                  ? 'bg-white text-stone-950 border-white shadow-2xl scale-[1.02]'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <Calendar className={`w-5 h-5 ${sendTiming === 'later' ? 'text-blue-600' : 'text-stone-400'}`} />
              <span className="text-base font-bold">Later</span>
              <span className={`text-xs ${sendTiming === 'later' ? 'text-stone-600' : 'text-stone-500'}`}>
                Pick date & time
              </span>
            </button>
          </div>

          {/* Now Mode Summary Box */}
          {sendTiming === 'now' && (
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl max-w-lg space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="text-stone-400">Target Audience</span>
                <span className="font-bold text-white">
                  {audienceState.recipients.length > 0
                    ? audienceState.recipients.map(r => r.label).join(', ')
                    : 'All VIP Subscribers (68,400)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="text-stone-400">Sender Identity</span>
                <span className="font-bold text-white">{audienceState.fromName || 'Sendline'} ({audienceState.fromEmail})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Estimated Delivery</span>
                <span className="font-bold text-emerald-400">Instant (&lt; 3.2 seconds)</span>
              </div>
            </div>
          )}

          {/* Later Mode Date/Time Pickers */}
          {sendTiming === 'later' && (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-lg space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3.5 py-3 bg-stone-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3.5 py-3 bg-stone-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-3 bg-stone-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-white appearance-none"
                  >
                    <option value="(GMT-07:00) Pacific Time">(GMT-07:00) Pacific Time (US & Canada)</option>
                    <option value="(GMT-04:00) Eastern Time">(GMT-04:00) Eastern Time (US & Canada)</option>
                    <option value="(GMT+00:00) London">(GMT+00:00) London, Dublin</option>
                    <option value="(GMT+01:00) Paris, Berlin">(GMT+01:00) Paris, Berlin, Rome</option>
                    <option value="(GMT+03:00) Istanbul">(GMT+03:00) Istanbul, Riyadh</option>
                  </select>
                  <Globe className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between max-w-lg mt-8">
          <button
            onClick={onBackToAudience}
            className="text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Audience
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTestModal(true)}
              className="px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Send a test
            </button>

            <button
              onClick={handleSendOrSchedule}
              disabled={isSending}
              className="px-8 py-3.5 rounded-full bg-white text-stone-950 font-black text-xs shadow-2xl hover:bg-stone-200 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : sendTiming === 'now' ? (
                <>
                  <Send className="w-3.5 h-3.5 text-stone-950" />
                  <span>Send now</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-stone-950" />
                  <span>Schedule campaign</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TEST SEND MODAL                                                           */}
      {/* ========================================================================= */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowTestModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif-display font-bold text-white mb-2">
              Send a test email
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Preview how this email renders in your personal inbox before broadcasting to subscribers.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-4 py-3.5 bg-stone-900 border border-white/15 rounded-2xl text-xs text-white focus:outline-none focus:border-white"
              />

              {testSentSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Test email successfully dispatched to {testEmail}!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTest}
                  className="px-6 py-2.5 rounded-xl bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Send test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLODESK HIGH FIVE CELEBRATION MODAL SCREEN                                */}
      {/* ========================================================================= */}
      {isCelebrationOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0D14]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#111622] border border-white/20 rounded-[36px] p-8 sm:p-12 shadow-2xl text-center space-y-6 relative animate-fadeIn">
            
            {/* Animated Celebration Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center shadow-2xl animate-bounce">
              <PartyPopper className="w-10 h-10 text-stone-950" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
                High five! 🎉
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-display font-black text-white tracking-tight">
                {sendTiming === 'now' ? 'Your email is on its way!' : 'Your campaign is scheduled!'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                {sendTiming === 'now'
                  ? `Successfully broadcasted to ${totalRecipients.toLocaleString()} subscribers with real-time open and click tracking enabled.`
                  : `Set to dispatch automatically on ${scheduleDate} at ${scheduleTime} ${timezone}.`}
              </p>
            </div>

            {/* Campaign Summary Card */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left space-y-2.5 max-w-md mx-auto text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Campaign Subject</span>
                <span className="font-bold text-white truncate max-w-[200px]">{audienceState.subject || template.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Recipients</span>
                <span className="font-bold text-white">{totalRecipients.toLocaleString()} subscribers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Sender Address</span>
                <span className="font-bold text-white">{audienceState.fromEmail}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-stone-950 font-black text-xs shadow-xl hover:bg-stone-200 transition-all cursor-pointer"
              >
                View in Campaign Hub →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
