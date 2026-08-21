import React, { useState } from 'react';
import { AppView, TransactionalLog, ApiKey, TransactionalTemplate, TransactionalWebhook, BlockedContact } from '../../types';
import { 
  INITIAL_TRANSACTIONAL_TEMPLATES, 
  INITIAL_TRANSACTIONAL_WEBHOOKS, 
  INITIAL_BLOCKED_CONTACTS 
} from '../../data/mockData';
import { 
  BarChart2, 
  Activity, 
  FileCode2, 
  Settings2, 
  ShieldAlert, 
  Zap, 
  Server, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';

import { TransactionalStatistics } from './TransactionalStatistics';
import { TransactionalLogs } from './TransactionalLogs';
import { TransactionalTemplates } from './TransactionalTemplates';
import { TransactionalSettings } from './TransactionalSettings';
import { TransactionalBlockers } from './TransactionalBlockers';
import { TransactionalSandbox } from './TransactionalSandbox';

interface TransactionalHubProps {
  logs: TransactionalLog[];
  apiKeys: ApiKey[];
  onAddLog: (log: TransactionalLog) => void;
  onNavigate: (view: AppView) => void;
}

export type TransactionalTab = 'statistics' | 'logs' | 'templates' | 'settings' | 'blockers' | 'sandbox';

export const TransactionalHub: React.FC<TransactionalHubProps> = ({
  logs,
  apiKeys,
  onAddLog,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<TransactionalTab>('statistics');
  const [templates, setTemplates] = useState<TransactionalTemplate[]>(INITIAL_TRANSACTIONAL_TEMPLATES);
  const [webhooks, setWebhooks] = useState<TransactionalWebhook[]>(INITIAL_TRANSACTIONAL_WEBHOOKS);
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>(INITIAL_BLOCKED_CONTACTS);
  const [localApiKeys, setLocalApiKeys] = useState<ApiKey[]>(apiKeys);

  // Handlers for templates
  const handleAddTemplate = (newTmpl: TransactionalTemplate) => {
    setTemplates(prev => [newTmpl, ...prev]);
  };

  const handleUpdateTemplate = (updated: TransactionalTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Handlers for API Keys & Webhooks
  const handleAddApiKey = (key: ApiKey) => {
    setLocalApiKeys(prev => [key, ...prev]);
  };

  const handleDeleteApiKey = (id: string) => {
    setLocalApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleAddWebhook = (wh: TransactionalWebhook) => {
    setWebhooks(prev => [wh, ...prev]);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  // Handlers for Blocked Contacts
  const handleAddBlockedContact = (c: BlockedContact) => {
    setBlockedContacts(prev => [c, ...prev]);
  };

  const handleUnblockContact = (id: string) => {
    setBlockedContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Transactional
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SMTP Relay Active
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Real-time SMTP relay, REST email triggers, delivery diagnostics, and suppression lists.
          </p>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto">
          <button
            id="tab-tx-statistics"
            onClick={() => setActiveTab('statistics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'statistics'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>

          <button
            id="tab-tx-logs"
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Logs</span>
          </button>

          <button
            id="tab-tx-templates"
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'templates'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            id="tab-tx-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Settings & Webhooks</span>
          </button>

          <button
            id="tab-tx-blockers"
            onClick={() => setActiveTab('blockers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blockers'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Blocked & Suppressed</span>
          </button>

          <button
            id="tab-tx-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>API Sandbox</span>
          </button>
        </div>
      </div>

      {/* 2. TAB VIEW ROUTING */}
      {activeTab === 'statistics' && (
        <TransactionalStatistics
          logs={logs}
          templates={templates}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'logs' && (
        <TransactionalLogs
          logs={logs}
          onAddLog={onAddLog}
        />
      )}

      {activeTab === 'templates' && (
        <TransactionalTemplates
          templates={templates}
          onAddTemplate={handleAddTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onSendTestWithTemplate={(tmpl) => {
            setActiveTab('sandbox');
          }}
        />
      )}

      {activeTab === 'settings' && (
        <TransactionalSettings
          apiKeys={localApiKeys}
          webhooks={webhooks}
          onAddApiKey={handleAddApiKey}
          onDeleteApiKey={handleDeleteApiKey}
          onAddWebhook={handleAddWebhook}
          onDeleteWebhook={handleDeleteWebhook}
        />
      )}

      {activeTab === 'blockers' && (
        <TransactionalBlockers
          blockedContacts={blockedContacts}
          onUnblockContact={handleUnblockContact}
          onAddBlockedContact={handleAddBlockedContact}
        />
      )}

      {activeTab === 'sandbox' && (
        <TransactionalSandbox
          templates={templates}
          onDispatchTest={(newLog) => {
            onAddLog(newLog);
          }}
          onViewLogs={() => setActiveTab('logs')}
        />
      )}

    </div>
  );
};
