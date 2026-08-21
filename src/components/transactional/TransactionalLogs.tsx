import React, { useState } from 'react';
import { TransactionalLog } from '../../types';
import { 
  Search, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  X,
  Filter
} from 'lucide-react';
import { LogDetailModal } from './LogDetailModal';

interface TransactionalLogsProps {
  logs: TransactionalLog[];
  onSelectLog?: (log: TransactionalLog) => void;
  onAddLog?: (log: TransactionalLog) => void;
}

export const TransactionalLogs: React.FC<TransactionalLogsProps> = ({
  logs,
  onSelectLog,
  onAddLog
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'blocked'>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<TransactionalLog | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [exportToast, setExportToast] = useState(false);

  const filteredLogs = logs.filter(l => {
    const matchesEvent = eventFilter === 'all' || l.event === eventFilter;
    const matchesTag = tagFilter === 'all' || l.tag === tagFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      l.recipient.toLowerCase().includes(query) ||
      l.template.toLowerCase().includes(query) ||
      (l.subject && l.subject.toLowerCase().includes(query)) ||
      (l.tag && l.tag.toLowerCase().includes(query)) ||
      l.id.toLowerCase().includes(query);

    return matchesEvent && matchesTag && matchesSearch;
  });

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Recipient,Status,Subject,Template,LatencyMs,Region,IPPool,Timestamp"].join(",") + "\n"
      + filteredLogs.map(e => `"${e.id}","${e.recipient}","${e.event}","${e.subject || ''}","${e.template}","${e.latencyMs}","${e.region}","${e.ipPool}","${e.timestamp}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sendline_transactional_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* Export Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Exported {filteredLogs.length} logs to CSV</span>
        </div>
      )}

      {/* 1. SEARCH & FILTERS BAR */}
      <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recipient, subject, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-normal text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Tag Filter */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-stone-50 text-xs font-medium text-stone-700 py-1.5 px-2.5 rounded-lg border border-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All tags</option>
              <option value="ecommerce-orders">ecommerce-orders</option>
              <option value="auth-tokens">auth-tokens</option>
              <option value="loyalty-triggers">loyalty-triggers</option>
              <option value="billing-invoices">billing-invoices</option>
              <option value="onboarding">onboarding</option>
            </select>

            {/* Live Indicator */}
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiveActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
              <span>{isLiveActive ? 'Live' : 'Paused'}</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export</span>
            </button>
          </div>

        </div>

        {/* Event Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-stone-100">
          <span className="text-xs text-stone-400 font-medium pr-1 shrink-0">
            Status:
          </span>
          {(['all', 'delivered', 'opened', 'clicked', 'bounced', 'blocked'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setEventFilter(filter)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all cursor-pointer shrink-0 ${
                eventFilter === filter
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {filter}
            </button>
          ))}
          
          <span className="ml-auto text-xs text-stone-400 font-medium">
            {filteredLogs.length} events
          </span>
        </div>

      </div>

      {/* 2. REAL-TIME LOGS TABLE */}
      <div className="rounded-xl bg-white border border-stone-200 overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/60 text-xs font-medium text-stone-500">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Template & Tag</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                      log.event === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : log.event === 'opened'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                        : log.event === 'clicked'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                        : log.event === 'bounced'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.event === 'delivered' ? 'bg-emerald-500' : 'bg-current'}`} />
                      <span>{log.event}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900">{log.recipient}</div>
                    <div className="text-[11px] text-stone-500 truncate max-w-xs">
                      {log.subject || `Message ID: ${log.id}`}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-stone-800 font-medium">{log.template}</div>
                    {log.tag && (
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                        {log.tag}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-emerald-700 font-medium">
                      {log.latencyMs} ms
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors inline-flex items-center"
                      title="View details"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="text-sm font-medium text-stone-800">No events match your criteria</p>
                      <p className="text-xs text-stone-500">Try adjusting your filters or search terms.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setEventFilter('all');
                          setTagFilter('all');
                        }}
                        className="mt-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white font-medium text-xs"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Log Modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onResendTest={(resendLog) => {
            if (onAddLog) {
              onAddLog({
                ...resendLog,
                id: 'tx-' + Math.floor(Math.random() * 90000 + 10000),
                timestamp: 'Just now',
                event: 'delivered'
              });
            }
          }}
        />
      )}

    </div>
  );
};
