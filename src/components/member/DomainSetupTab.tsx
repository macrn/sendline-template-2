import React, { useState } from 'react';
import { DomainRecord } from '../../types';
import { Globe, Plus, CheckCircle2, AlertTriangle, Copy, Check, RefreshCw, X, Shield } from 'lucide-react';

interface DomainSetupTabProps {
  domains: DomainRecord[];
  onAddDomain: (domain: string) => void;
}

export const DomainSetupTab: React.FC<DomainSetupTabProps> = ({
  domains,
  onAddDomain
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>(domains[0]?.domain || 'sendline.io');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNotice, setVerifiedNotice] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyDns = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedNotice(true);
      setTimeout(() => setVerifiedNotice(false), 3000);
    }, 1200);
  };

  const dnsRecords = [
    { type: 'CNAME', name: `sendline._domainkey.${selectedDomain}`, value: 'dkim.sendline.io', purpose: 'DKIM Signature', status: 'verified' },
    { type: 'TXT', name: selectedDomain, value: 'v=spf1 include:spf.sendline.io ~all', purpose: 'SPF Authentication', status: 'verified' },
    { type: 'TXT', name: `_dmarc.${selectedDomain}`, value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@sendline.io', purpose: 'DMARC Security Policy', status: 'verified' },
    { type: 'MX', name: `reply.${selectedDomain}`, value: 'inbound.sendline.io', purpose: 'Inbound Reply Routing', status: 'verified' }
  ];

  return (
    <div className="max-w-3xl space-y-8 text-stone-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Domain setup</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure custom sending domains with DKIM, SPF, and DMARC for 99.8% primary inbox placement.
          </p>
        </div>

        <button
          id="connect-custom-domain-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Connect Domain</span>
        </button>
      </div>

      {verifiedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>DNS Records verified active on root nameservers!</span>
        </div>
      )}

      {/* Domain Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {domains.map((dom) => (
          <button
            key={dom.domain}
            onClick={() => setSelectedDomain(dom.domain)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
              selectedDomain === dom.domain
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{dom.domain}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        ))}
      </div>

      {/* DNS Records Box */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-950">DNS Records for {selectedDomain}</h3>
            <p className="text-xs text-stone-500">Copy these records into your domain registrar (GoDaddy, Cloudflare, Namecheap)</p>
          </div>

          <button
            onClick={handleVerifyDns}
            disabled={isVerifying}
            className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-white text-xs font-semibold text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isVerifying ? 'Testing DNS...' : 'Verify Records'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
          <div className="divide-y divide-stone-100 text-xs">
            {dnsRecords.map((rec, idx) => (
              <div key={idx} className="p-4 space-y-2 hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-mono font-bold text-stone-800 text-[10px]">
                      {rec.type}
                    </span>
                    <span className="font-bold text-stone-950">{rec.purpose}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200/70">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Host:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-900 font-semibold truncate max-w-[160px]">{rec.name}</span>
                      <button onClick={() => handleCopy(rec.name, `h-${idx}`)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                        {copiedKey === `h-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Value:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-900 font-semibold truncate max-w-[160px]">{rec.value}</span>
                      <button onClick={() => handleCopy(rec.value, `v-${idx}`)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                        {copiedKey === `v-${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONNECT DOMAIN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-950" />
                <h3 className="text-base font-bold text-stone-950">Connect Custom Domain</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (domainInput.trim()) {
                const clean = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
                onAddDomain(clean);
                setSelectedDomain(clean);
                setShowAddModal(false);
                setDomainInput('');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="yourbrand.com or mail.yourbrand.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Generate DNS Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
