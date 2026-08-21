import React, { useState } from 'react';
import { TransactionalLog, TransactionalTemplate } from '../../types';
import { 
  Send, 
  CheckCircle2, 
  Eye, 
  MousePointerClick, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  Server, 
  Zap,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface TransactionalStatisticsProps {
  logs: TransactionalLog[];
  templates: TransactionalTemplate[];
  onNavigateTab: (tab: 'logs' | 'templates' | 'settings' | 'blockers' | 'sandbox') => void;
  onSelectLog?: (log: TransactionalLog) => void;
}

const TIMEFRAME_CHART_DATA = {
  '7d': [
    { date: 'Aug 11', requests: 38200, delivered: 38110, opens: 24800, clicks: 8400, bounces: 58 },
    { date: 'Aug 12', requests: 41500, delivered: 41380, opens: 27100, clicks: 9200, bounces: 64 },
    { date: 'Aug 13', requests: 39800, delivered: 39710, opens: 25900, clicks: 8800, bounces: 52 },
    { date: 'Aug 14', requests: 44200, delivered: 44090, opens: 29400, clicks: 10100, bounces: 71 },
    { date: 'Aug 15', requests: 37600, delivered: 37520, opens: 24100, clicks: 7900, bounces: 48 },
    { date: 'Aug 16', requests: 40900, delivered: 40810, opens: 26800, clicks: 9050, bounces: 61 },
    { date: 'Aug 17', requests: 42320, delivered: 42331, opens: 26468, clicks: 9020, bounces: 66 },
  ],
  '30d': [
    { date: 'Week 1', requests: 68400, delivered: 68250, opens: 44100, clicks: 14800, bounces: 98 },
    { date: 'Week 2', requests: 71200, delivered: 71050, opens: 46200, clicks: 15600, bounces: 105 },
    { date: 'Week 3', requests: 69800, delivered: 69650, opens: 45300, clicks: 15100, bounces: 92 },
    { date: 'Week 4', requests: 75120, delivered: 75001, opens: 48968, clicks: 16970, bounces: 125 },
  ],
  'today': [
    { date: '00:00', requests: 1200, delivered: 1198, opens: 720, clicks: 240, bounces: 2 },
    { date: '04:00', requests: 850, delivered: 849, opens: 510, clicks: 170, bounces: 1 },
    { date: '08:00', requests: 5400, delivered: 5388, opens: 3600, clicks: 1240, bounces: 8 },
    { date: '12:00', requests: 12400, delivered: 12370, opens: 8100, clicks: 2790, bounces: 19 },
    { date: '16:00', requests: 14200, delivered: 14160, opens: 9250, clicks: 3180, bounces: 22 },
    { date: '20:00', requests: 8270, delivered: 8256, opens: 5288, clicks: 1800, bounces: 14 },
  ]
};

export const TransactionalStatistics: React.FC<TransactionalStatisticsProps> = ({
  logs,
  templates,
  onNavigateTab,
  onSelectLog
}) => {
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d'>('7d');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeMetric, setActiveMetric] = useState<'delivered' | 'opens' | 'clicks' | 'bounces'>('delivered');

  const chartData = TIMEFRAME_CHART_DATA[timeframe];

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-white border border-stone-200">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-stone-500 pl-1">
            Time period:
          </span>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 border border-stone-200/80">
            {(['today', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t === 'today' ? 'Today' : t === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500">Tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-stone-50 text-xs font-medium text-stone-800 py-1.5 px-3 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 cursor-pointer"
            >
              <option value="all">All tags</option>
              <option value="ecommerce-orders">ecommerce-orders</option>
              <option value="auth-tokens">auth-tokens</option>
              <option value="loyalty-triggers">loyalty-triggers</option>
              <option value="billing-invoices">billing-invoices</option>
            </select>
          </div>

          <button
            onClick={() => onNavigateTab('sandbox')}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Send test</span>
          </button>
        </div>
      </div>

      {/* 2. MINIMALIST KPI METRIC TILES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Requests / Sent */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium">Requests</span>
            <Send className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight">
            284,520
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2%</span>
          </div>
        </div>

        {/* Card 2: Delivered */}
        <div 
          onClick={() => setActiveMetric('delivered')}
          className={`p-4 rounded-xl bg-white border cursor-pointer transition-all space-y-1.5 ${
            activeMetric === 'delivered' ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-stone-700">Delivered</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight flex items-baseline gap-1.5">
            <span>99.4%</span>
            <span className="text-xs font-normal text-stone-500">283.9k</span>
          </div>
          <div className="text-[11px] font-medium text-stone-500">
            Avg speed <span className="text-emerald-700">23ms</span>
          </div>
        </div>

        {/* Card 3: Opens */}
        <div 
          onClick={() => setActiveMetric('opens')}
          className={`p-4 rounded-xl bg-white border cursor-pointer transition-all space-y-1.5 ${
            activeMetric === 'opens' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-stone-700">Opened</span>
            <Eye className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight flex items-baseline gap-1.5">
            <span>65.0%</span>
            <span className="text-xs font-normal text-stone-500">184.5k</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600">
            <TrendingUp className="w-3 h-3" />
            <span>+3.8%</span>
          </div>
        </div>

        {/* Card 4: Clicks */}
        <div 
          onClick={() => setActiveMetric('clicks')}
          className={`p-4 rounded-xl bg-white border cursor-pointer transition-all space-y-1.5 ${
            activeMetric === 'clicks' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-stone-700">Clicked</span>
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight flex items-baseline gap-1.5">
            <span>22.0%</span>
            <span className="text-xs font-normal text-stone-500">62.4k</span>
          </div>
          <div className="text-[11px] font-medium text-stone-500">
            CTR <span className="text-stone-700 font-medium">33.8%</span>
          </div>
        </div>

        {/* Card 5: Bounces */}
        <div 
          onClick={() => setActiveMetric('bounces')}
          className={`p-4 rounded-xl bg-white border cursor-pointer transition-all space-y-1.5 ${
            activeMetric === 'bounces' ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-stone-700">Bounces</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight flex items-baseline gap-1.5">
            <span>0.15%</span>
            <span className="text-xs font-normal text-stone-500">420</span>
          </div>
          <div className="text-[11px] font-medium text-stone-500">
            280 soft · 140 hard
          </div>
        </div>

        {/* Card 6: Blocked */}
        <div 
          onClick={() => onNavigateTab('blockers')}
          className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 cursor-pointer transition-all space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-medium text-stone-700">Blocked</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-semibold text-stone-900 tracking-tight flex items-baseline gap-1.5">
            <span>0.05%</span>
            <span className="text-xs font-normal text-stone-500">149</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 group-hover:text-stone-900">
            <span>Suppressed</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. DELIVERY & ENGAGEMENT CHART */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <span>Delivery & Performance</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Daily volume trends and engagement metrics
            </p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 border border-stone-200/80">
            {(['delivered', 'opens', 'clicks', 'bounces'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer capitalize ${
                  activeMetric === m
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={
                      activeMetric === 'delivered' ? '#10b981' :
                      activeMetric === 'opens' ? '#3b82f6' :
                      activeMetric === 'clicks' ? '#6366f1' : '#f43f5e'
                    } 
                    stopOpacity={0.15}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={
                      activeMetric === 'delivered' ? '#10b981' :
                      activeMetric === 'opens' ? '#3b82f6' :
                      activeMetric === 'clicks' ? '#6366f1' : '#f43f5e'
                    } 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eeee" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c1917', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={
                  activeMetric === 'delivered' ? '#059669' :
                  activeMetric === 'opens' ? '#2563eb' :
                  activeMetric === 'clicks' ? '#4f46e5' : '#e11d48'
                } 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMetric)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. TWO-COLUMN BREAKDOWN: TOP TEMPLATES & INBOX PLACEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Top Transactional Templates */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Top Templates
              </h3>
              <p className="text-xs text-stone-500">
                Performance by transactional template
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('templates')}
              className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-900 truncate">
                      {tmpl.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono shrink-0">
                      {tmpl.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Subject: {tmpl.subject}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div className="text-xs font-semibold text-stone-900">{tmpl.sentCount.toLocaleString()} sent</div>
                    <div className="text-[11px] text-stone-500 font-medium">{tmpl.openRate}% open · {tmpl.clickRate}% click</div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('logs')}
                    className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer border border-stone-200/60"
                    title="View logs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mailbox Provider Placement */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Inbox Placement
            </h3>
            <p className="text-xs text-stone-500">
              Delivery success by major mailbox provider
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Google / Gmail</span>
                <span className="text-stone-900 font-medium">99.8%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Apple Mail (iCloud)</span>
                <span className="text-stone-900 font-medium">99.6%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.6%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Microsoft Outlook</span>
                <span className="text-stone-900 font-medium">99.1%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '99.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Yahoo Mail</span>
                <span className="text-stone-900 font-medium">98.9%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '98.9%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>IP Reputation: 99 / 100</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-normal">
              Authentication active: SPF, DKIM 2048-bit, DMARC alignment verified.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
