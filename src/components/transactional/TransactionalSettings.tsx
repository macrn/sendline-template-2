import React, { useState } from 'react';
import { ApiKey, TransactionalWebhook } from '../../types';
import { 
  Key, 
  Server, 
  Plus, 
  Copy, 
  Check, 
  Radio, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  Code2,
  Send
} from 'lucide-react';

interface TransactionalSettingsProps {
  apiKeys: ApiKey[];
  webhooks: TransactionalWebhook[];
  onAddApiKey: (key: ApiKey) => void;
  onDeleteApiKey: (id: string) => void;
  onAddWebhook: (wh: TransactionalWebhook) => void;
  onDeleteWebhook: (id: string) => void;
}

export const TransactionalSettings: React.FC<TransactionalSettingsProps> = ({
  apiKeys,
  webhooks,
  onAddApiKey,
  onDeleteApiKey,
  onAddWebhook,
  onDeleteWebhook
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'node' | 'python' | 'curl' | 'go'>('node');

  // SMTP Test State
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<string | null>(null);

  // New Key Modal State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'production' | 'staging'>('production');

  // New Webhook Modal State
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [webhookTestFeedback, setWebhookTestFeedback] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestSmtp = () => {
    setTestingSmtp(true);
    setSmtpTestResult(null);
    setTimeout(() => {
      setTestingSmtp(false);
      setSmtpTestResult('220 smtp-relay.sendline.io ESMTP Ready · TLS 1.3 Handshake OK · Auth Accepted');
      setTimeout(() => setSmtpTestResult(null), 5000);
    }, 800);
  };

  const handleTestWebhook = (whId: string) => {
    setTestingWebhookId(whId);
    setTimeout(() => {
      setTestingWebhookId(null);
      setWebhookTestFeedback(`HTTP 200 OK: Endpoint acknowledged event in 18ms`);
      setTimeout(() => setWebhookTestFeedback(null), 4000);
    }, 600);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const prefix = newKeyEnv === 'production' ? 'sl_live_' : 'sl_test_';
    const randHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullKey = prefix + randHex;

    const newKey: ApiKey = {
      id: 'key-' + Date.now(),
      name: newKeyName,
      keyPrefix: prefix + randHex.substring(0, 6) + '...',
      fullKey,
      created: 'Just now',
      lastUsed: 'Never',
      environment: newKeyEnv,
      rateLimit: newKeyEnv === 'production' ? '10,000 req/sec' : '500 req/sec'
    };

    onAddApiKey(newKey);
    setShowKeyModal(false);
    setNewKeyName('');
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookName || !newWebhookUrl) return;

    const newWh: TransactionalWebhook = {
      id: 'wh-' + Date.now(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: ['delivered', 'opened', 'clicked', 'bounced'],
      status: 'active',
      createdAt: 'Just now',
      lastFired: 'Never',
      secretKey: 'whsec_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    onAddWebhook(newWh);
    setShowWebhookModal(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. SMTP RELAY CONFIGURATION CARD */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-stone-700" />
              <span>SMTP Relay Parameters</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Connect external applications, ecommerce platforms, or custom backend services.
            </p>
          </div>

          <button
            onClick={handleTestSmtp}
            disabled={testingSmtp}
            className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {testingSmtp ? (
              <span className="animate-spin w-3 h-3 border-2 border-stone-800 border-t-transparent rounded-full" />
            ) : (
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{testingSmtp ? 'Testing connection...' : 'Test SMTP connection'}</span>
          </button>
        </div>

        {smtpTestResult && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{smtpTestResult}</span>
          </div>
        )}

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[11px] font-medium text-stone-500">SMTP Host</span>
            <div className="flex items-center justify-between text-xs font-mono text-stone-900 font-medium">
              <span className="truncate">smtp-relay.sendline.io</span>
              <button 
                onClick={() => copyToClipboard('smtp-relay.sendline.io', 'smtp-host')}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
              >
                {copiedId === 'smtp-host' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[11px] font-medium text-stone-500">Port & Security</span>
            <div className="text-xs font-mono text-stone-900 font-medium">
              587 (STARTTLS) / 465 (SSL)
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[11px] font-medium text-stone-500">Login Username</span>
            <div className="flex items-center justify-between text-xs font-mono text-stone-900 font-medium">
              <span>apikey</span>
              <button 
                onClick={() => copyToClipboard('apikey', 'smtp-user')}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
              >
                {copiedId === 'smtp-user' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
            <span className="text-[11px] font-medium text-stone-500">Relay Password</span>
            <div className="flex items-center justify-between text-xs font-mono text-stone-900 font-medium">
              <span>••••••••••••••••</span>
              <button 
                onClick={() => copyToClipboard(apiKeys[0]?.fullKey || 'sl_live_99fa7e882b4540d99a38f7194c20b8f0', 'smtp-pass')}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
              >
                {copiedId === 'smtp-pass' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. REST API KEYS MANAGEMENT */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-stone-700" />
              <span>API Keys</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Secret authentication keys for REST endpoints and transactional mail dispatches.
            </p>
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Generate key</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {apiKeys.map((key) => {
            const isRevealed = visibleKeyId === key.id;
            const displayKey = isRevealed ? (key.fullKey || 'sl_live_99fa7e882b4540d99a38f7194c20b8f0') : key.keyPrefix;

            return (
              <div key={key.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{key.name}</div>
                      <div className="text-[11px] text-stone-400">Created: {key.created}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                    key.environment === 'production' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}>
                    {key.environment}
                  </span>
                </div>

                {/* Key Token Box */}
                <div className="p-2 rounded-lg bg-white border border-stone-200 flex items-center justify-between font-mono text-xs text-stone-800">
                  <span className="truncate pr-2">{displayKey}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setVisibleKeyId(isRevealed ? null : key.id)}
                      className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
                      title={isRevealed ? 'Hide secret' : 'Reveal secret'}
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(key.fullKey || 'sl_live_99fa7e882b4540d99a38f7194c20b8f0', key.id)}
                      className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
                      title="Copy key"
                    >
                      {copiedId === key.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-200/60">
                  <span>Limit: <span className="text-stone-800 font-medium">{key.rateLimit}</span></span>
                  <button
                    onClick={() => onDeleteApiKey(key.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Revoke key"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. EVENT WEBHOOKS */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-stone-700" />
              <span>Event Webhooks</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Receive live webhook POST requests for delivery, open, click, and bounce events.
            </p>
          </div>

          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add endpoint</span>
          </button>
        </div>

        {webhookTestFeedback && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{webhookTestFeedback}</span>
          </div>
        )}

        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-900">{wh.name}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 capitalize">
                      {wh.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-stone-600 truncate mt-0.5">
                    {wh.url}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestWebhook(wh.id)}
                    disabled={testingWebhookId === wh.id}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {testingWebhookId === wh.id ? (
                      <span className="animate-spin w-3 h-3 border border-stone-800 border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-3 h-3 text-stone-500" />
                    )}
                    <span>{testingWebhookId === wh.id ? 'Sending...' : 'Test ping'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteWebhook(wh.id)}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-200/60">
                <span className="text-[11px] text-stone-400 font-medium">Events:</span>
                {wh.events.map((e, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    event.{e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CODE EXAMPLES */}
      <div className="p-5 sm:p-6 rounded-xl bg-stone-900 text-white space-y-3 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-stone-300" />
            <h3 className="text-sm font-semibold text-stone-100">
              API Quickstart
            </h3>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-800 border border-stone-700">
            {(['node', 'python', 'curl', 'go'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase transition-all cursor-pointer ${
                  selectedLanguage === lang ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code View */}
        <pre className="p-3.5 rounded-lg bg-black/40 border border-stone-800 font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto">
          {selectedLanguage === 'node' && `import { Sendline } from '@sendline/sdk';

const sendline = new Sendline({
  apiKey: process.env.SENDLINE_API_KEY
});

const response = await sendline.emails.send({
  from: 'orders@sendline.io',
  to: 'client@company.com',
  template: 'order-confirmation',
  params: {
    ORDER_NUMBER: 'SL-94821',
    TOTAL_AMOUNT: '$380.00'
  }
});
console.log('Message ID:', response.id);`}

          {selectedLanguage === 'python' && `from sendline import Sendline

client = Sendline(api_key="sl_live_99fa7e...")

response = client.emails.send(
    sender="orders@sendline.io",
    to="client@company.com",
    template="order-confirmation",
    params={"ORDER_NUMBER": "SL-94821", "TOTAL_AMOUNT": "$380.00"}
)
print(f"Message ID: {response.id}")`}

          {selectedLanguage === 'curl' && `curl -X POST https://api.sendline.io/v1/smtp/email \\
  -H "Authorization: Bearer sl_live_99fa7e882b4540d99a38f7194c20b8f0" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "orders@sendline.io",
    "to": "client@company.com",
    "template": "order-confirmation",
    "params": {
      "ORDER_NUMBER": "SL-94821",
      "TOTAL_AMOUNT": "$380.00"
    }
  }'`}

          {selectedLanguage === 'go' && `package main

import (
    "fmt"
    "github.com/sendline/sendline-go"
)

func main() {
    client := sendline.NewClient("sl_live_99fa7e...")
    msg, err := client.SendEmail(&sendline.EmailPayload{
        From:     "orders@sendline.io",
        To:       "client@company.com",
        Template: "order-confirmation",
    })
    if err != nil {
        panic(err)
    }
    fmt.Println("Dispatched in latency:", msg.LatencyMs)
}`}
        </pre>
      </div>

      {/* CREATE API KEY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden text-stone-900 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Generate New API Key</h3>
              <button onClick={() => setShowKeyModal(false)} className="p-1 text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApiKey} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Key name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Backend Service"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Environment</label>
                <select
                  value={newKeyEnv}
                  onChange={(e) => setNewKeyEnv(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="production">Production (10,000 req/sec)</option>
                  <option value="staging">Staging / Development (500 req/sec)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium text-xs shadow-xs"
                >
                  Generate key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE WEBHOOK MODAL */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden text-stone-900 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Add Webhook Endpoint</h3>
              <button onClick={() => setShowWebhookModal(false)} className="p-1 text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Webhook name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Order Status Sync"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Endpoint URL (HTTPS)</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.yourbrand.com/webhooks/email"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium text-xs shadow-xs"
                >
                  Save endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
