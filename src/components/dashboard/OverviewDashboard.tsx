import React, { useState } from 'react';
import { AppView, Campaign, TransactionalLog, ScreenerItem } from '../../types';
import { 
  Send, 
  Sparkles, 
  Zap, 
  Inbox, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Eye, 
  MousePointerClick, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Plus,
  Users,
  Layers,
  Check,
  X,
  Radio,
  FileText,
  Mail,
  Activity,
  Server,
  Award,
  Filter
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

interface OverviewDashboardProps {
  onNavigate: (view: AppView) => void;
  campaigns: Campaign[];
  transactionalLogs: TransactionalLog[];
  screenerItems: ScreenerItem[];
}

const DASHBOARD_CHART_DATA = {
  '7d': [
    { date: 'Aug 11', marketing: 12500, transactional: 38200, opens: 32400, clicks: 11200 },
    { date: 'Aug 12', marketing: 18400, transactional: 41500, opens: 39600, clicks: 13500 },
    { date: 'Aug 13', marketing: 14200, transactional: 39800, opens: 35100, clicks: 12100 },
    { date: 'Aug 14', marketing: 28900, transactional: 44200, opens: 49800, clicks: 17400 },
    { date: 'Aug 15', marketing: 11800, transactional: 37600, opens: 31900, clicks: 10800 },
    { date: 'Aug 16', marketing: 16500, transactional: 40900, opens: 38200, clicks: 13100 },
    { date: 'Aug 17', marketing: 22100, transactional: 42331, opens: 43560, clicks: 15320 },
  ],
  '30d': [
    { date: 'Week 1', marketing: 84000, transactional: 268000, opens: 228000, clicks: 78000 },
    { date: 'Week 2', marketing: 96000, transactional: 284000, opens: 247000, clicks: 86000 },
    { date: 'Week 3', marketing: 91000, transactional: 279000, opens: 240000, clicks: 82000 },
    { date: 'Week 4', marketing: 108000, transactional: 295000, opens: 262000, clicks: 92000 },
  ],
  'today': [
    { date: '00:00', marketing: 400, transactional: 1200, opens: 980, clicks: 320 },
    { date: '04:00', marketing: 200, transactional: 850, opens: 640, clicks: 210 },
    { date: '08:00', marketing: 4200, transactional: 5400, opens: 6100, clicks: 2150 },
    { date: '12:00', marketing: 8600, transactional: 12400, opens: 13800, clicks: 4800 },
    { date: '16:00', marketing: 6200, transactional: 14200, opens: 13100, clicks: 4500 },
    { date: '20:00', marketing: 2500, transactional: 8270, opens: 6940, clicks: 2340 },
  ]
};

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  campaigns,
  transactionalLogs,
  screenerItems
}) => {
  const [localScreeners, setLocalScreeners] = useState<ScreenerItem[]>(screenerItems);
  const [screenerToast, setScreenerToast] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d'>('7d');
  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'opens' | 'clicks'>('all');

  const handleQuickApprove = (id: string, name: string) => {
    setLocalScreeners(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' as const } : s));
    setScreenerToast(`Approved ${name} into Imbox`);
    setTimeout(() => setScreenerToast(null), 3000);
  };

  const handleQuickBlock = (id: string, name: string) => {
    setLocalScreeners(prev => prev.map(s => s.id === id ? { ...s, status: 'blocked' as const } : s));
    setScreenerToast(`Filtered ${name} to The Feed`);
    setTimeout(() => setScreenerToast(null), 3000);
  };

  const pendingScreeners = localScreeners.filter(s => s.status === 'pending');
  const chartData = DASHBOARD_CHART_DATA[timeframe];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Toast Feedback */}
      {screenerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{screenerToast}</span>
        </div>
      )}

      {/* 1. TOP HEADER & ACTION SWITCHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-950 tracking-tight">
              Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Workspace Operational</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-sans leading-relaxed">
            Real-time workspace telemetry across audience segments, marketing broadcasts, mailbox queue, and transactional delivery.
          </p>
        </div>

        {/* Action Hub Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('audience')}
            className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span>Audience (469k)</span>
          </button>

          <button
            onClick={() => onNavigate('inbox')}
            className="px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Inbox className="w-3.5 h-3.5 text-stone-500" />
            <span>Screener</span>
            {pendingScreeners.length > 0 && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                {pendingScreeners.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('marketing')}
            className="px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-stone-300" />
            <span>Draft Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC CARDS (5 CLEAN KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
        
        {/* Metric 1: Total Audience */}
        <div 
          onClick={() => onNavigate('audience')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[128px] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Audience</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif-display text-stone-950 tracking-tight text-center">
              469,100
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 font-semibold pt-2 border-t border-stone-100 text-center">
            <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>+14.2k active</span>
          </div>
        </div>

        {/* Metric 2: Broadcast Reach */}
        <div 
          onClick={() => onNavigate('marketing')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[128px] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Open Rate</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif-display text-stone-950 tracking-tight text-center">
              58.5%
            </div>
          </div>

          <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 text-center">
            <span className="text-stone-900 font-semibold">21.4%</span> CTR
          </div>
        </div>

        {/* Metric 3: Transactional Success */}
        <div 
          onClick={() => onNavigate('transactional')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[128px] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Transactional</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif-display text-stone-950 tracking-tight text-center">
              99.84%
            </div>
          </div>

          <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 text-center">
            <span className="text-stone-900 font-semibold">24ms</span> latency
          </div>
        </div>

        {/* Metric 4: Mailbox Screener */}
        <div 
          onClick={() => onNavigate('inbox')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[128px] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Screener</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif-display text-stone-950 tracking-tight text-center">
              {pendingScreeners.length} Pending
            </div>
          </div>

          <div className="text-[11px] text-amber-800 font-semibold pt-2 border-t border-stone-100 text-center truncate">
            {pendingScreeners.length > 0 ? '1-click triage' : 'Queue triaged'}
          </div>
        </div>

        {/* Metric 5: Domain & Auth Health */}
        <div 
          onClick={() => onNavigate('transactional')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[128px] shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">Auth Health</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif-display text-emerald-800 tracking-tight text-center">
              100% Valid
            </div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 text-center font-medium">
            DKIM/SPF/DMARC
          </div>
        </div>

      </div>

      {/* 3. TIME PERIOD & WORKSPACE TELEMETRY CHART */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-5 text-left">
        
        {/* Filter & Metric Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-stone-700" />
              <span>Workspace Delivery & Engagement Activity</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Aggregate dispatches across marketing broadcasts and transactional SMTP triggers.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Metric Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 border border-stone-200/80">
              <button
                onClick={() => setActiveChartMetric('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeChartMetric === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Volume
              </button>
              <button
                onClick={() => setActiveChartMetric('opens')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeChartMetric === 'opens'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Opens
              </button>
              <button
                onClick={() => setActiveChartMetric('clicks')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeChartMetric === 'clicks'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Clicks
              </button>
            </div>

            {/* Timeframe Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 border border-stone-200/80">
              {(['today', '7d', '30d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    timeframe === t
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t === 'today' ? 'Today' : t === '7d' ? '7d' : '30d'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTransactional" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#78716c' }} 
                axisLine={{ stroke: '#e7e5e4' }} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#78716c' }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c1917', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                labelStyle={{ fontWeight: 600, color: '#f5f5f4', marginBottom: '4px' }}
              />
              {activeChartMetric === 'all' && (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="transactional" 
                    name="Transactional" 
                    stroke="#18181b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTransactional)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="marketing" 
                    name="Marketing Broadcasts" 
                    stroke="#059669" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorMarketing)" 
                  />
                </>
              )}
              {activeChartMetric === 'opens' && (
                <Area 
                  type="monotone" 
                  dataKey="opens" 
                  name="Opens" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOpens)" 
                />
              )}
              {activeChartMetric === 'clicks' && (
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  name="Clicks" 
                  stroke="#db2777" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOpens)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span>Transactional Mail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Marketing Broadcasts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>User Engagement</span>
            </div>
          </div>

          <div className="font-mono text-stone-700 font-medium">
            Total Dispatched: <span className="text-stone-900">429,231 msgs</span>
          </div>
        </div>

      </div>

      {/* 4. TWO BALANCED OPERATIONAL PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Recent Broadcast Campaigns (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 space-y-4 text-left shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold font-serif-display text-stone-950 flex items-center gap-2 tracking-tight">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Recent Campaigns & Broadcasts</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Newsletter releases, product launches, and automated marketing flows.
              </p>
            </div>

            <button
              onClick={() => onNavigate('marketing')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {campaigns.slice(0, 4).map((cmp) => (
              <div key={cmp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 -mx-2 px-3 rounded-xl transition-colors">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-serif-display text-stone-950 truncate">{cmp.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize font-sans ${
                      cmp.status === 'Sent' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80' : 
                      cmp.status === 'Scheduled' ? 'bg-blue-50 text-blue-800 border border-blue-200/80' : 
                      'bg-stone-100 text-stone-700 border border-stone-200/80'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 font-sans truncate">
                    {cmp.subject} · <span className="text-stone-700 font-medium">{cmp.audience}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs shrink-0 font-sans">
                  {cmp.status === 'Sent' && (
                    <div className="text-right text-xs">
                      <span className="text-emerald-800 font-semibold">{cmp.openRate}% open</span>
                      <span className="text-stone-300 mx-1.5">/</span>
                      <span className="text-indigo-800 font-semibold">{cmp.clickRate}% click</span>
                    </div>
                  )}
                  {cmp.status !== 'Sent' && (
                    <span className="text-xs text-stone-400 font-sans">{cmp.date}</span>
                  )}

                  <button
                    onClick={() => onNavigate('marketing')}
                    className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                    title="Open in Studio"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
            <button
              onClick={() => onNavigate('audience')}
              className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>Explore 469,100 contacts</span>
            </button>

            <button
              onClick={() => onNavigate('marketing')}
              className="px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create broadcast</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mailbox Screener Queue (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 space-y-4 text-left shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-stone-700" />
                <h2 className="text-lg font-bold font-serif-display text-stone-950 tracking-tight">
                  The Screener
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 font-sans">
                  {pendingScreeners.length} Waiting
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                First-time senders triaged with 1-click controls.
              </p>
            </div>

            <button
              onClick={() => onNavigate('inbox')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>Imbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Senders List */}
          <div className="space-y-2.5">
            {pendingScreeners.length > 0 ? (
              pendingScreeners.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="font-serif-display font-semibold text-stone-950 text-sm truncate">{item.senderName}</div>
                    <div className="text-xs text-stone-500 font-sans truncate mt-0.5">{item.senderEmail}</div>
                  </div>
                  
                  {/* Direct Triage Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleQuickApprove(item.id, item.senderName)}
                      className="px-3.5 py-1.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Allow into Imbox"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Allow</span>
                    </button>
                    <button
                      onClick={() => handleQuickBlock(item.id, item.senderName)}
                      className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer border border-stone-200 bg-white"
                      title="Filter to Feed"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                <div className="text-xs font-semibold text-emerald-900 font-sans">Screener Queue Clear</div>
                <div className="text-[11px] text-emerald-700 font-sans">All first-time senders triaged.</div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('inbox')}
            className="w-full py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-sans"
          >
            <span>Open Mailbox & Imbox</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>

      </div>

      {/* 5. REAL-TIME AUDIT & DISPATCH STREAM */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 space-y-4 text-left shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold font-serif-display text-stone-950 flex items-center gap-2 tracking-tight">
              <Server className="w-4 h-4 text-stone-700" />
              <span>Real-Time Workspace Event Stream</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-sans">
              Live edge dispatches, authenticated webhooks, and inbox placement verification.
            </p>
          </div>

          <button
            onClick={() => onNavigate('transactional')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>Full logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px] font-sans">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-600">
                <th className="py-3 px-3.5">Event Type</th>
                <th className="py-3 px-3.5">Recipient / Target</th>
                <th className="py-3 px-3.5">Template / Channel</th>
                <th className="py-3 px-3.5">Edge Latency</th>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {transactionalLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-stone-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>SMTP Dispatch</span>
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-stone-900 font-medium text-xs">
                    {log.recipient}
                  </td>

                  <td className="py-3 px-3.5 text-stone-600 text-xs">
                    {log.template}
                  </td>

                  <td className="py-3 px-3.5 text-stone-900 text-xs font-semibold">
                    {log.latencyMs}ms
                  </td>

                  <td className="py-3 px-3.5 text-stone-400 text-xs">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 capitalize">
                      {log.event}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. MODULAR PRODUCT SUITE SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
        
        {/* Module 1: Marketing Studio */}
        <div 
          onClick={() => onNavigate('marketing')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group space-y-2 text-left shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold font-serif-display text-stone-950 flex items-center justify-between">
              <span>Marketing Studio</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
              Visual campaign builder, broadcast scheduling & analytics.
            </p>
          </div>
        </div>

        {/* Module 2: Transactional SMTP & API */}
        <div 
          onClick={() => onNavigate('transactional')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group space-y-2 text-left shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold font-serif-display text-stone-950 flex items-center justify-between">
              <span>Transactional Engine</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
              REST APIs, SMTP relay parameters, dynamic templates & webhooks.
            </p>
          </div>
        </div>

        {/* Module 3: Mailbox & Screener */}
        <div 
          onClick={() => onNavigate('inbox')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group space-y-2 text-left shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold font-serif-display text-stone-950 flex items-center justify-between">
              <span>Mailbox & Screener</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
              Imbox sorting, The Feed, The Paper Trail & distraction control.
            </p>
          </div>
        </div>

        {/* Module 4: Audience & Loyalty */}
        <div 
          onClick={() => onNavigate('loyalty')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 transition-all cursor-pointer group space-y-2 text-left shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold font-serif-display text-stone-950 flex items-center justify-between">
              <span>Loyalty & Rewards</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-stone-500 font-sans mt-1 leading-relaxed">
              Customer VIP tiers, coupon codes & referral automations.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
