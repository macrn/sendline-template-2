import React, { useState } from 'react';
import { AppView, DomainRecord } from '../../types';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  Server, 
  Users, 
  Plus, 
  Check, 
  Activity, 
  HardDrive, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Wifi,
  Sparkles
} from 'lucide-react';

interface AdminPanelProps {
  domains: DomainRecord[];
  onAddDomain: (domain: DomainRecord) => void;
  onNavigate: (view: AppView) => void;
  initialTab?: 'routing' | 'domains' | 'ips' | 'team';
  onTabChange?: (tab: 'routing' | 'domains' | 'ips' | 'team') => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  domains,
  onAddDomain,
  onNavigate,
  initialTab = 'routing',
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<'routing' | 'domains' | 'ips' | 'team'>(initialTab);
  const [primaryRegion, setPrimaryRegion] = useState<string>('us-east-1');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [routingSavedToast, setRoutingSavedToast] = useState(false);

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tab: 'routing' | 'domains' | 'ips' | 'team') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const teamMembers = [
    { name: 'Mehmet Arslan', email: 'mehmet@sendline.io', role: 'Owner & Architect', access: 'Super Admin' },
    { name: 'Sarah Jenkins', email: 'sarah@nordicapparel.com', role: 'VP of Brand Marketing', access: 'Campaign Editor' },
    { name: 'David Thorne', email: 'david@enterprise-relay.io', role: 'Lead DevOps Engineer', access: 'API & Infrastructure' }
  ];

  const ipPools = [
    {
      ip: '198.51.100.42',
      region: 'US-East (N. Virginia)',
      reputation: 99,
      dailyVolume: '480,000 / 1,000,000',
      status: 'Warm & Optimal',
      assignedDomain: 'sendline.io + VIP Pools'
    },
    {
      ip: '198.51.100.43',
      region: 'US-West (Oregon)',
      reputation: 98,
      dailyVolume: '310,000 / 1,000,000',
      status: 'Warm & Optimal',
      assignedDomain: 'mail.nordicapparel.com'
    },
    {
      ip: '203.0.113.19',
      region: 'EU-Central (Frankfurt)',
      reputation: 99,
      dailyVolume: '195,000 / 500,000',
      status: 'Warm & Optimal',
      assignedDomain: 'GDPR Dedicated Node'
    }
  ];

  const handleSaveRouting = (regionId: string) => {
    setPrimaryRegion(regionId);
    setRoutingSavedToast(true);
    setTimeout(() => setRoutingSavedToast(false), 2500);
  };

  const handleCreateDomain = () => {
    if (!newDomainName.trim()) return;
    const newDom: DomainRecord = {
      id: 'dom-' + Date.now(),
      domain: newDomainName.toLowerCase().trim(),
      status: 'verified',
      region: 'US-East (N. Virginia)',
      spfStatus: 'valid',
      dkimStatus: 'valid',
      dmarcStatus: 'valid',
      bimiStatus: 'valid',
      monthlyVolume: 0,
      createdAt: 'Today'
    };
    onAddDomain(newDom);
    setShowDomainModal(false);
    setNewDomainName('');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Settings & Infrastructure
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Multi-Region Active
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Configure US-first global routing, custom sending domains, dedicated warm IP pools, and team access control.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto">
          <button
            id="admin-tab-routing"
            onClick={() => handleTabSelect('routing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'routing'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Multi-Region Routing</span>
          </button>

          <button
            id="admin-tab-domains"
            onClick={() => handleTabSelect('domains')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'domains'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Custom Domains</span>
          </button>

          <button
            id="admin-tab-ips"
            onClick={() => handleTabSelect('ips')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ips'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Dedicated Warm IPs</span>
          </button>

          <button
            id="admin-tab-team"
            onClick={() => handleTabSelect('team')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'team'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & RBAC</span>
          </button>
        </div>
      </div>

      {/* 1. MULTI-REGION ROUTING VIEW */}
      {activeTab === 'routing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-700" />
                Primary Global Ingress & Relay Cluster
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Direct all transactional API payloads and marketing dispatches through your preferred low-latency edge node.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* US-East Node */}
              <div
                onClick={() => handleSaveRouting('us-east-1')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  primaryRegion === 'us-east-1'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-stone-50 border-stone-200/80 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className={`text-sm font-semibold ${primaryRegion === 'us-east-1' ? 'text-white' : 'text-stone-900'}`}>
                      US-East-1 (N. Virginia)
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${primaryRegion === 'us-east-1' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    18ms Latency
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${primaryRegion === 'us-east-1' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Primary North American fiber corridor directly connected to AWS, Google, and Microsoft exchanges.
                </p>

                <div className={`flex items-center justify-between text-xs pt-2 border-t ${primaryRegion === 'us-east-1' ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <span>Capacity: 50,000 msg/sec</span>
                  {primaryRegion === 'us-east-1' && (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Primary
                    </span>
                  )}
                </div>
              </div>

              {/* US-West Node */}
              <div
                onClick={() => handleSaveRouting('us-west-2')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  primaryRegion === 'us-west-2'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-stone-50 border-stone-200/80 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className={`text-sm font-semibold ${primaryRegion === 'us-west-2' ? 'text-white' : 'text-stone-900'}`}>
                      US-West-2 (Oregon)
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${primaryRegion === 'us-west-2' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    22ms Latency
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${primaryRegion === 'us-west-2' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Optimized Pacific rim cluster with dedicated IP warmed pools for West Coast and APAC traffic.
                </p>

                <div className={`flex items-center justify-between text-xs pt-2 border-t ${primaryRegion === 'us-west-2' ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <span>Capacity: 35,000 msg/sec</span>
                  {primaryRegion === 'us-west-2' && (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Primary
                    </span>
                  )}
                </div>
              </div>

              {/* EU-Central Node */}
              <div
                onClick={() => handleSaveRouting('eu-central-1')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  primaryRegion === 'eu-central-1'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-stone-50 border-stone-200/80 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className={`text-sm font-semibold ${primaryRegion === 'eu-central-1' ? 'text-white' : 'text-stone-900'}`}>
                      EU-Central-1 (Frankfurt)
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${primaryRegion === 'eu-central-1' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    29ms Latency
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${primaryRegion === 'eu-central-1' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Full GDPR data residency compliance with localized data-at-rest encryption for European subscribers.
                </p>

                <div className={`flex items-center justify-between text-xs pt-2 border-t ${primaryRegion === 'eu-central-1' ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <span>Capacity: 30,000 msg/sec</span>
                  {primaryRegion === 'eu-central-1' && (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Primary
                    </span>
                  )}
                </div>
              </div>

              {/* APAC Node */}
              <div
                onClick={() => handleSaveRouting('ap-northeast-1')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  primaryRegion === 'ap-northeast-1'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-stone-50 border-stone-200/80 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className={`text-sm font-semibold ${primaryRegion === 'ap-northeast-1' ? 'text-white' : 'text-stone-900'}`}>
                      AP-Northeast-1 (Tokyo)
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${primaryRegion === 'ap-northeast-1' ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    38ms Latency
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${primaryRegion === 'ap-northeast-1' ? 'text-stone-300' : 'text-stone-600'}`}>
                  Low latency delivery node for Asia-Pacific enterprise customers with automated cross-ocean failover.
                </p>

                <div className={`flex items-center justify-between text-xs pt-2 border-t ${primaryRegion === 'ap-northeast-1' ? 'border-stone-800 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <span>Capacity: 25,000 msg/sec</span>
                  {primaryRegion === 'ap-northeast-1' && (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Primary
                    </span>
                  )}
                </div>
              </div>

            </div>

            {routingSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Primary Global Routing Gateway updated! Active node changed to <strong>{primaryRegion}</strong>.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CUSTOM DOMAINS VIEW */}
      {activeTab === 'domains' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-stone-900">Verified Sending & Receiving Domains</h2>
              <p className="text-xs text-stone-500">Send marketing and transactional emails under your exact branded domain</p>
            </div>

            <button
              id="admin-add-domain-btn"
              onClick={() => setShowDomainModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-stone-300" />
              <span>Add Custom Domain</span>
            </button>
          </div>

          <div className="rounded-xl bg-white border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Domain Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Region</th>
                    <th className="py-3 px-4">SPF</th>
                    <th className="py-3 px-4">DKIM</th>
                    <th className="py-3 px-4">DMARC</th>
                    <th className="py-3 px-4">Monthly Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {domains.map((dom) => (
                    <tr key={dom.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-900 font-mono">{dom.domain}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {dom.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{dom.region}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold font-mono">100% OK</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold font-mono">2048-bit</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold font-mono">p=reject</td>
                      <td className="py-3 px-4 font-mono text-stone-700">{dom.monthlyVolume.toLocaleString()} msgs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED WARM IPS VIEW */}
      {activeTab === 'ips' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ipPools.map((ip, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-900">{ip.ip}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Score: {ip.reputation}/100
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-stone-900">{ip.region}</div>
                  <div className="text-xs text-stone-500">{ip.assignedDomain}</div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Daily Throughput:</span>
                    <strong className="text-stone-900 font-mono">{ip.dailyVolume}</strong>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>IP Status:</span>
                    <strong className="text-emerald-700">{ip.status}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TEAM & RBAC VIEW */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-stone-900">Team Members & Permissions</h2>
              <p className="text-xs text-stone-500">Manage fine-grained workspace permissions for designers and engineers</p>
            </div>

            <button
              onClick={() => alert('Invite member modal opened')}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-stone-300" />
              <span>Invite Teammate</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-semibold flex items-center justify-center text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900">{member.name}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-medium text-stone-900">{member.role}</div>
                    <div className="text-[11px] text-stone-500 font-semibold">{member.access}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-stone-200 p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Add New Sending Domain
              </h3>
              <button onClick={() => setShowDomainModal(false)} className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-600 font-medium block mb-1">Domain or Subdomain</label>
                <input
                  type="text"
                  placeholder="e.g. mail.acme-corp.com"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-mono focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>

              <p className="text-stone-500 leading-relaxed text-[11px]">
                Upon adding, Sendline will generate 2048-bit DKIM keys and SPF verification records for your DNS provider.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowDomainModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDomain}
                className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Verify & Add Domain
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
