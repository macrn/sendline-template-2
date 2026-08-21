import React, { useState } from 'react';
import { TransactionalLog, TransactionalTemplate } from '../../types';
import { 
  Zap, 
  Send, 
  CheckCircle2, 
  Check, 
  Copy, 
  ArrowRight, 
  Clock,
  Terminal
} from 'lucide-react';

interface TransactionalSandboxProps {
  templates: TransactionalTemplate[];
  onDispatchTest: (log: TransactionalLog) => void;
  onViewLogs: () => void;
}

export const TransactionalSandbox: React.FC<TransactionalSandboxProps> = ({
  templates,
  onDispatchTest,
  onViewLogs
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [recipient, setRecipient] = useState('developer.test@sendline.io');
  const [customSubject, setCustomSubject] = useState('');
  const [region, setRegion] = useState('us-east-1 (N. Virginia)');
  const [jsonParams, setJsonParams] = useState(`{
  "contact": {
    "FIRSTNAME": "Jordan",
    "EMAIL": "developer.test@sendline.io"
  },
  "params": {
    "ORDER_NUMBER": "ORD-77492",
    "TOTAL_AMOUNT": "$149.00",
    "VERIFICATION_CODE": "849201"
  }
}`);

  const [isSending, setIsSending] = useState(false);
  const [lastDispatchedLog, setLastDispatchedLog] = useState<TransactionalLog | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return;

    setIsSending(true);
    setLastDispatchedLog(null);

    const calculatedLatency = Math.floor(Math.random() * 25 + 15); // 15-40ms

    setTimeout(() => {
      const newLog: TransactionalLog = {
        id: 'tx-' + Math.floor(Math.random() * 90000 + 10000),
        recipient,
        template: selectedTemplate?.tag || 'order-confirmation',
        event: 'delivered',
        timestamp: 'Just now',
        latencyMs: calculatedLatency,
        region: region.split(' ')[0],
        ipPool: 'Dedicated-Warm-01',
        smtpResponse: '250 2.0.0 OK: Message accepted for delivery',
        subject: customSubject || selectedTemplate?.subject || 'Live Transactional Test',
        sender: selectedTemplate?.sender || 'notifications@sendline.io',
        tag: selectedTemplate?.tag || 'sandbox-test',
        messageId: `<sl.${Date.now()}@${region.split(' ')[0]}.sendline.io>`,
        tlsVersion: 'TLS 1.3 / ECDHE-RSA-AES256-GCM-SHA384'
      };

      setIsSending(false);
      setLastDispatchedLog(newLog);
      onDispatchTest(newLog);
    }, 600);
  };

  const copyResponseJson = () => {
    if (!lastDispatchedLog) return;
    navigator.clipboard.writeText(JSON.stringify(lastDispatchedLog, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header card */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 text-left">
        <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>API Sandbox & Test Console</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Send test transactional emails and inspect the live server response payload in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Test Dispatch Form */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4 text-left">
          <form onSubmit={handleSend} className="space-y-3.5">
            
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Transactional template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-400 cursor-pointer"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.tag})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Recipient email</label>
                <input
                  type="email"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Relay region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                  <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</option>
                  <option value="ap-southeast-1 (Singapore)">ap-southeast-1 (Singapore)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Subject line (Optional override)</label>
              <input
                type="text"
                placeholder={selectedTemplate?.subject || 'Leave blank to use template subject'}
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-stone-700">JSON template parameters</label>
                <span className="text-[10px] text-stone-400">JSON format</span>
              </div>
              <textarea
                rows={6}
                value={jsonParams}
                onChange={(e) => setJsonParams(e.target.value)}
                className="w-full p-3 rounded-lg bg-stone-900 text-stone-200 font-mono text-xs focus:outline-none border border-stone-800 leading-relaxed"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Routing through {region.split(' ')[0]}...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Send test email</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Response Inspector */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-stone-900 text-stone-100 space-y-3.5 text-left">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs font-medium text-stone-200">Server Response</span>
            </div>

            {lastDispatchedLog && (
              <button
                onClick={copyResponseJson}
                className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {lastDispatchedLog ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs font-medium text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>250 OK: Message accepted</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-300">
                  {lastDispatchedLog.latencyMs}ms
                </span>
              </div>

              <pre className="p-3 rounded-lg bg-black/40 font-mono text-[11px] text-stone-300 border border-stone-800 overflow-x-auto max-h-64 leading-relaxed">
                {JSON.stringify({
                  status: 'delivered',
                  id: lastDispatchedLog.id,
                  recipient: lastDispatchedLog.recipient,
                  template: lastDispatchedLog.template,
                  latencyMs: lastDispatchedLog.latencyMs,
                  region: lastDispatchedLog.region,
                  tlsVersion: lastDispatchedLog.tlsVersion,
                  smtpResponse: lastDispatchedLog.smtpResponse,
                  timestamp: lastDispatchedLog.timestamp
                }, null, 2)}
              </pre>

              <button
                onClick={onViewLogs}
                className="w-full py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
              >
                <span>View in logs feed</span>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </button>
            </div>
          ) : (
            <div className="py-14 text-center text-stone-500 space-y-1.5">
              <Clock className="w-6 h-6 text-stone-600 mx-auto" />
              <p className="text-xs font-medium text-stone-400">Awaiting test execution</p>
              <p className="text-[11px] text-stone-500">
                Click "Send test email" to trigger a live dispatch.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
