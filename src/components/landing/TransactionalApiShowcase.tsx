import React, { useState } from 'react';
import { AppView } from '../../types';
import { Terminal, Copy, Check, Zap, ArrowRight, ShieldCheck, Code, Play } from 'lucide-react';

interface TransactionalApiShowcaseProps {
  onNavigate: (view: AppView) => void;
}

export const TransactionalApiShowcase: React.FC<TransactionalApiShowcaseProps> = ({ onNavigate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'node' | 'python'>('node');
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const codeSnippets = {
    node: `import { Sendline } from '@sendline/sdk';

const sendline = new Sendline(process.env.SENDLINE_API_KEY);

await sendline.emails.send({
  from: 'hello@yourbrand.com',
  to: 'customer@domain.com',
  subject: 'Your Order #9281 is Confirmed',
  template: 'order-confirmation-editorial',
  vars: {
    customerName: 'Alex Rivera',
    loyaltyPointsEarned: 150,
    voucherCode: 'WELCOME-15'
  }
});`,
    curl: `curl -X POST https://api.sendline.io/v1/emails/send \\
  -H "Authorization: Bearer snd_live_9482710398" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "hello@yourbrand.com",
    "to": "customer@domain.com",
    "subject": "Your Order #9281 is Confirmed",
    "template": "order-confirmation-editorial"
  }'`,
    python: `from sendline import Sendline

client = Sendline(api_key="snd_live_9482710398")

response = client.emails.send(
    from_email="hello@yourbrand.com",
    to="customer@domain.com",
    subject="Your Order #9281 is Confirmed",
    template="order-confirmation-editorial"
)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <section id="transactional" className="py-24 bg-[#FAF8F5] border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Transactional Delivery
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Sub-30ms email delivery for developers.
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            Automated SPF, DKIM, and DMARC authentication, pre-warmed dedicated IP pools, and clean REST APIs designed for instant integration.
          </p>
        </div>

        {/* Code Showcase Box */}
        <div className="max-w-5xl mx-auto bg-stone-950 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-900">
          
          {/* Header with language switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-700" />
              <span className="w-3 h-3 rounded-full bg-stone-700" />
              <span className="w-3 h-3 rounded-full bg-stone-700" />
              <span className="ml-2 text-xs font-mono text-stone-400">api.sendline.io/v1/emails/send</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800">
                <button
                  onClick={() => setSelectedLanguage('node')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedLanguage === 'node' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Node.js
                </button>
                <button
                  onClick={() => setSelectedLanguage('curl')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedLanguage === 'curl' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedLanguage === 'python' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="py-6 font-mono text-xs sm:text-sm text-stone-300 overflow-x-auto leading-relaxed">
            <pre>{codeSnippets[selectedLanguage]}</pre>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>TLS 1.3 Direct Fiber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-300 font-bold">24ms</span> latency
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendTest}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono flex items-center gap-2 border border-stone-700 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                <span>{testSent ? '✓ 200 OK Delivered (24ms)' : 'Send Live Test'}</span>
              </button>

              <button
                onClick={() => onNavigate('transactional')}
                className="px-5 py-2 rounded-full bg-white text-stone-950 hover:bg-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Full API Docs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
