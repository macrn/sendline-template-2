import React, { useState } from 'react';
import { Layers, CheckCircle2, ExternalLink, RefreshCw, Zap } from 'lucide-react';

export const IntegrationsTab: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'shopify', name: 'Shopify', desc: 'Sync customer orders, abandoned carts, and product catalog', connected: true, icon: '🛍️' },
    { id: 'zapier', name: 'Zapier', desc: 'Connect 5,000+ apps with Sendline triggers and actions', connected: true, icon: '⚡' },
    { id: 'wordpress', name: 'WordPress & WooCommerce', desc: 'Embed opt-in forms and sync subscriber purchases', connected: false, icon: '🌐' },
    { id: 'webflow', name: 'Webflow', desc: 'Direct form hook connections for high-design landing pages', connected: true, icon: '🎨' },
    { id: 'instagram', name: 'Instagram Feed', desc: 'Live visual gallery block sync in email templates', connected: true, icon: '📸' },
    { id: 'ga4', name: 'Google Analytics 4', desc: 'UTM campaign tracking and conversion attribution', connected: true, icon: '📊' },
    { id: 'slack', name: 'Slack Alerts', desc: 'Receive notifications when high-value VIP orders occur', connected: false, icon: '💬' }
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(item => item.id === id ? { ...item, connected: !item.connected } : item));
  };

  return (
    <div className="max-w-3xl space-y-8 text-stone-900">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Integrations</h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Connect your e-commerce storefronts, website builders, and analytics tools.
        </p>
      </div>

      <div className="rounded-3xl border border-stone-200 overflow-hidden bg-white shadow-xs divide-y divide-stone-100">
        {integrations.map((item) => (
          <div key={item.id} className="p-5 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-xl shadow-xs">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-950">{item.name}</span>
                  {item.connected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      CONNECTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
              </div>
            </div>

            <button
              onClick={() => toggleConnection(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                item.connected
                  ? 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200'
                  : 'bg-stone-950 hover:bg-stone-800 text-white shadow-xs'
              }`}
            >
              {item.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
