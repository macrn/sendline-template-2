import React, { useState } from 'react';
import { TransactionalTemplate } from '../../types';
import { 
  Plus, 
  Search, 
  Eye, 
  Send, 
  X, 
  Copy, 
  Check,
  Code
} from 'lucide-react';

interface TransactionalTemplatesProps {
  templates: TransactionalTemplate[];
  onAddTemplate: (tmpl: TransactionalTemplate) => void;
  onUpdateTemplate: (tmpl: TransactionalTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onSendTestWithTemplate: (tmpl: TransactionalTemplate) => void;
}

export const TransactionalTemplates: React.FC<TransactionalTemplatesProps> = ({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSendTestWithTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TransactionalTemplate | null>(null);
  const [copiedTagId, setCopiedTagId] = useState<string | null>(null);

  // New Template Form
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('notifications@sendline.io');
  const [htmlBody, setHtmlBody] = useState(`<div style="font-family:sans-serif;padding:32px;color:#18181b;">
  <h2 style="font-size:20px;font-weight:600;margin-bottom:12px;">Hello {{ contact.FIRSTNAME }},</h2>
  <p style="color:#52525b;font-size:14px;line-height:1.6;">Your order #{{ params.ORDER_ID }} has been confirmed and is being processed.</p>
  <a href="{{ params.ACTION_URL }}" style="background:#18181b;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;font-size:13px;font-weight:500;">View Order Details</a>
</div>`);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyTag = (tTag: string, id: string) => {
    navigator.clipboard.writeText(tTag);
    setCopiedTagId(id);
    setTimeout(() => setCopiedTagId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) return;

    const newTmpl: TransactionalTemplate = {
      id: 'tmpl-tx-' + Date.now(),
      name,
      tag: tag.toLowerCase().replace(/\s+/g, '-') || 'general-tx',
      subject,
      sender,
      status: 'active',
      lastModified: 'Just now',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      htmlBody,
      variables: ['contact.FIRSTNAME', 'params.ORDER_ID', 'params.ACTION_URL']
    };

    onAddTemplate(newTmpl);
    setShowCreateModal(false);
    setName('');
    setTag('');
    setSubject('');
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by name, tag, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-normal text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
          />
        </div>

        <button
          id="btn-create-tx-template"
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New template</span>
        </button>
      </div>

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((tmpl) => (
          <div 
            key={tmpl.id} 
            className="p-5 rounded-xl bg-white border border-stone-200 space-y-3.5 hover:border-stone-300 transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">
                      {tmpl.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {tmpl.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Subject: <span className="text-stone-800 font-medium">{tmpl.subject}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer border border-stone-200/60"
                    title="Preview template"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSendTestWithTemplate(tmpl)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer border border-stone-200/60"
                    title="Send test with template"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* API Tag Box */}
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs text-stone-700">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-stone-400 text-[11px] font-medium">Tag:</span>
                  <span className="font-mono text-stone-800 truncate font-medium">"{tmpl.tag}"</span>
                </div>
                <button
                  onClick={() => handleCopyTag(tmpl.tag, tmpl.id)}
                  className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-600 text-[11px] font-medium flex items-center gap-1 cursor-pointer border border-stone-200"
                >
                  {copiedTagId === tmpl.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTagId === tmpl.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Dynamic Tokens */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-stone-400 font-medium">Tokens:</span>
                {tmpl.variables.map((v, i) => (
                  <span key={i} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                    {`{{ ${v} }}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats Footer */}
            <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-medium text-stone-800">{tmpl.sentCount.toLocaleString()}</span> sent
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 font-medium">{tmpl.openRate}% open</span>
                <span className="text-indigo-700 font-medium">{tmpl.clickRate}% click</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE NEW TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-stone-900 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">
                New Transactional Template
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-left">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Template name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2FA Security Verification Code"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">API tag identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. security-2fa-code"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">From address</label>
                  <input
                    type="email"
                    required
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Subject line</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Your verification code is {{ params.CODE }}"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">HTML content</label>
                <textarea
                  rows={5}
                  value={htmlBody}
                  onChange={(e) => setHtmlBody(e.target.value)}
                  className="w-full p-3 rounded-lg bg-stone-900 text-stone-200 font-mono text-xs focus:outline-none border border-stone-800"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <span className="font-medium text-stone-700">Tokens:</span> <code className="text-stone-800">{`{{ contact.FIRSTNAME }}`}, {`{{ params.ORDER_ID }}`}</code>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs cursor-pointer"
                >
                  Save template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW TEMPLATE MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden text-stone-900 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{previewTemplate.name}</h3>
                <p className="text-xs text-stone-500 font-mono">Tag: {previewTemplate.tag}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800">
                Subject: {previewTemplate.subject}
              </div>

              <div 
                className="p-5 rounded-xl bg-white border border-stone-200 text-stone-900"
                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlBody }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
