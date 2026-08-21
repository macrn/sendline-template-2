import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Curated Editorial Campaign Studio',
      sendline: 'Included (Magazine-grade typography & responsive layout)',
      competitorA: 'Rigid block editor',
      competitorB: 'Basic HTML template only'
    },
    {
      feature: 'Sub-30ms Transactional Delivery & SMTP',
      sendline: 'Sub-30ms direct fiber TLS 1.3 delivery',
      competitorA: 'Delayed marketing queues',
      competitorB: 'Standard (no visual builder)'
    },
    {
      feature: 'First-Time Sender Screener & Mailbox',
      sendline: 'Native Screener with @sendline.io & Custom Domains',
      competitorA: 'Not available',
      competitorB: 'Not available'
    },
    {
      feature: 'Built-in Loyalty & Rewards Engine',
      sendline: 'Native (Points on opens, clicks & checkouts)',
      competitorA: 'Requires expensive third-party apps',
      competitorB: 'Not available'
    },
    {
      feature: 'Subscriber List Pricing Penalties',
      sendline: 'Zero penalties (Pay for send volume only)',
      competitorA: 'Aggressive pricing tier hikes',
      competitorB: 'Charges for inactive contacts'
    },
    {
      feature: 'Automated SPF, DKIM & DMARC Auth',
      sendline: '1-Click Guided Verification & Warm IP Pools',
      competitorA: 'Complex manual DNS',
      competitorB: 'Manual configuration'
    }
  ];

  return (
    <section id="comparison" className="py-24 bg-[#FAF8F5] border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Platform Comparison
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Why modern brands choose Sendline
          </h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            One cohesive system replacing 4 fragmented software subscriptions.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto bg-white rounded-3xl border border-stone-200 shadow-sm max-w-5xl mx-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70">
                <th className="py-5 px-6 font-bold text-stone-900 w-1/3">Feature Capability</th>
                <th className="py-5 px-6 font-bold text-stone-950 bg-stone-100/80">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black">sendline</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-950 text-white">All-in-One</span>
                  </div>
                </th>
                <th className="py-5 px-6 font-medium text-stone-500">Legacy Marketing ESP</th>
                <th className="py-5 px-6 font-medium text-stone-500">Standard API Senders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-stone-900">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 bg-stone-50/40 font-medium text-stone-950">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.sendline}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>{row.competitorA}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>{row.competitorB}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
