import React, { useState } from 'react';
import { TransactionalLog } from '../../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  Mail, 
  FileCode,
  Eye,
  MousePointerClick
} from 'lucide-react';

interface LogDetailModalProps {
  log: TransactionalLog;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'preview' | 'headers'>('timeline');
  const [copiedId, setCopiedId] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const copyMessageId = () => {
    navigator.clipboard.writeText(log.messageId || log.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    }, 700);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-stone-900 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-400">
                ID: {log.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                log.event === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                log.event === 'opened' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                log.event === 'clicked' ? 'bg-pink-50 text-pink-700 border border-pink-200/60' :
                log.event === 'bounced' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                'bg-stone-100 text-stone-700'
              }`}>
                {log.event}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-stone-900 truncate">
              {log.subject || `Notification: ${log.template}`}
            </h2>
            <div className="text-xs text-stone-500">
              To: <span className="font-mono text-stone-800">{log.recipient}</span> · <span className="text-stone-700 font-medium">{log.latencyMs}ms</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResend}
              disabled={resending}
              className="px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              title="Resend email"
            >
              {resending ? (
                <span className="animate-spin w-3 h-3 border border-stone-800 border-t-transparent rounded-full" />
              ) : (
                <Send className="w-3 h-3 text-stone-500" />
              )}
              <span>{resending ? 'Sending...' : 'Resend'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resend Success Toast */}
        {resendSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Message re-dispatched successfully.</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-stone-200 bg-white">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2 px-3 text-xs font-medium transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 px-3 text-xs font-medium transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Message Content</span>
          </button>

          <button
            onClick={() => setActiveTab('headers')}
            className={`pb-2 px-3 text-xs font-medium transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'headers'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SMTP Headers</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* 1. TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              
              {/* Delivery Overview Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="text-[11px] font-medium text-stone-500">Status</div>
                  <div className="text-xs font-semibold text-stone-900 capitalize mt-0.5">{log.event}</div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="text-[11px] font-medium text-stone-500">Latency</div>
                  <div className="text-xs font-semibold text-stone-900 font-mono mt-0.5">{log.latencyMs}ms</div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="text-[11px] font-medium text-stone-500">Relay Region</div>
                  <div className="text-xs font-semibold text-stone-900 mt-0.5 truncate">{log.region}</div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="text-[11px] font-medium text-stone-500">IP Pool</div>
                  <div className="text-xs font-semibold text-stone-900 mt-0.5 truncate">{log.ipPool}</div>
                </div>
              </div>

              {/* Event Lifecycle Stepper */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
                <h3 className="text-xs font-semibold text-stone-900">
                  Event Trace
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-stone-200">
                  
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-[11px] shrink-0 z-10">
                      1
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900">API Dispatch Request Received</span>
                        <span className="text-[11px] text-stone-400">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Inbound payload authenticated via API key.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-[11px] shrink-0 z-10">
                      2
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900">Edge Pool Handshake & DKIM Signing</span>
                        <span className="text-[11px] text-stone-400">+{Math.floor(log.latencyMs * 0.3)}ms</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Routed through {log.ipPool} with 2048-bit DKIM key.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-[11px] shrink-0 z-10 ${
                      log.event === 'bounced' || log.event === 'blocked'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      3
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${log.event === 'bounced' ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {log.event === 'bounced' ? 'SMTP Bounce / MX Rejection' : 'Delivered to Recipient MX'}
                        </span>
                        <span className="text-[11px] text-stone-400">+{log.latencyMs}ms</span>
                      </div>
                      <div className="mt-1 p-2 rounded-lg bg-white font-mono text-[11px] text-stone-700 border border-stone-200">
                        {log.smtpResponse}
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  {(log.event === 'opened' || log.event === 'clicked') && (
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-[11px] shrink-0 z-10">
                        <Eye className="w-3 h-3" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-900">Message Opened</span>
                          <span className="text-[11px] text-stone-400">{log.openedAt || 'Engaged'}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Client: {log.userAgent || 'Apple Mail / Webmail'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 5 */}
                  {log.event === 'clicked' && (
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center font-medium text-[11px] shrink-0 z-10">
                        <MousePointerClick className="w-3 h-3" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-pink-900">Link Click Registered</span>
                          <span className="text-[11px] text-stone-400">Verified</span>
                        </div>
                        <div className="mt-1 p-1.5 rounded-lg bg-pink-50 text-pink-900 font-mono text-[11px] border border-pink-200 truncate">
                          {log.clickedUrl || 'https://sendline.io/auth/verify'}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* 2. MESSAGE PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">From:</span>
                  <span className="font-mono text-stone-800">{log.sender || 'orders@sendline.io'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">To:</span>
                  <span className="font-mono text-stone-800">{log.recipient}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Subject:</span>
                  <span className="font-medium text-stone-900">{log.subject || `Notification: ${log.template}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Template:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-stone-700 font-mono text-[11px] border border-stone-200">
                    {log.tag || log.template}
                  </span>
                </div>
              </div>

              {/* Rendered Container */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="max-w-md mx-auto space-y-3 p-4 rounded-lg bg-white border border-stone-200 text-stone-900 text-left">
                  <h4 className="text-sm font-semibold text-stone-900">
                    {log.subject || 'Your Transactional Update'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Hello, this is an automated confirmation dispatched to <span className="font-medium text-stone-800">{log.recipient}</span>.
                  </p>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono text-xs">
                    <div className="text-stone-400 text-[10px]">PAYLOAD TEMPLATE</div>
                    <div className="text-stone-800 font-medium mt-0.5">{log.template}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. HEADERS & DIAGNOSTICS TAB */}
          {activeTab === 'headers' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-stone-900 text-stone-200 font-mono text-xs space-y-2.5 overflow-x-auto">
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                  <span className="text-stone-400">Message-ID</span>
                  <button
                    onClick={copyMessageId}
                    className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-emerald-400 font-medium">{log.messageId || `<sl.${log.id}@us-east-1.sendline.io>`}</div>

                <div className="pt-1.5 border-t border-stone-800 space-y-1 text-[11px] text-stone-300">
                  <div><span className="text-stone-500">Auth-Results:</span> dkim=pass (2048-bit); spf=pass; dmarc=pass</div>
                  <div><span className="text-stone-500">TLS:</span> {log.tlsVersion || 'TLS 1.3 / AES256-GCM'}</div>
                  <div><span className="text-stone-500">Latency:</span> {log.latencyMs}ms</div>
                  <div><span className="text-stone-500">IP Pool:</span> {log.ipPool}</div>
                  <div><span className="text-stone-500">Region:</span> {log.region}</div>
                  <div><span className="text-stone-500">SMTP:</span> {log.smtpResponse}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-5 border-t border-stone-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
