import React, { useState } from 'react';
import { BlockedContact } from '../../types';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Unlock
} from 'lucide-react';

interface TransactionalBlockersProps {
  blockedContacts: BlockedContact[];
  onUnblockContact: (id: string) => void;
  onAddBlockedContact: (contact: BlockedContact) => void;
}

export const TransactionalBlockers: React.FC<TransactionalBlockersProps> = ({
  blockedContacts,
  onUnblockContact,
  onAddBlockedContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [unblockToast, setUnblockToast] = useState<string | null>(null);

  // New Block Form
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState<'hard_bounce' | 'spam_complaint' | 'manual_block' | 'unsubscribed'>('manual_block');
  const [newDetails, setNewDetails] = useState('');

  const filteredContacts = blockedContacts.filter(c => {
    const matchesReason = reasonFilter === 'all' || c.reason === reasonFilter;
    const matchesSearch = c.email.toLowerCase().includes(searchQuery.toLowerCase()) || c.smtpDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesReason && matchesSearch;
  });

  const handleUnblock = (c: BlockedContact) => {
    onUnblockContact(c.id);
    setUnblockToast(`Removed ${c.email} from suppression list.`);
    setTimeout(() => setUnblockToast(null), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    const newContact: BlockedContact = {
      id: 'blk-' + Date.now(),
      email: newEmail,
      reason: newReason,
      blockedAt: 'Just now',
      smtpDetails: newDetails || 'Manually added by administrator'
    };

    onAddBlockedContact(newContact);
    setShowAddModal(false);
    setNewEmail('');
    setNewDetails('');
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* Toast Feedback */}
      {unblockToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{unblockToast}</span>
        </div>
      )}

      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
          <div className="text-xs font-medium text-stone-500">Suppressed contacts</div>
          <div className="text-xl font-semibold text-stone-900">{blockedContacts.length}</div>
          <p className="text-[11px] text-stone-400">Excluded from delivery to preserve IP reputation</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
          <div className="text-xs font-medium text-emerald-700">Domain reputation</div>
          <div className="text-xl font-semibold text-emerald-700">100% Clean</div>
          <p className="text-[11px] text-stone-400">Zero spam traps encountered</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
          <div className="text-xs font-medium text-stone-500">Auto-scrub filter</div>
          <div className="text-xl font-semibold text-stone-900">Active</div>
          <p className="text-[11px] text-stone-400">5xx hard bounces are automatically quarantined</p>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH & ADD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email address or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-normal text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="bg-stone-50 text-xs font-medium text-stone-700 py-1.5 px-2.5 rounded-lg border border-stone-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All reasons</option>
            <option value="hard_bounce">Hard bounce (5xx)</option>
            <option value="spam_complaint">Spam complaint (FBL)</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="manual_block">Manual block</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add contact</span>
          </button>
        </div>
      </div>

      {/* 3. SUPPRESSION LIST TABLE */}
      <div className="rounded-xl bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/60 text-xs font-medium text-stone-500">
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Diagnostic Details</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-900">
                    {contact.email}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      contact.reason === 'hard_bounce'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : contact.reason === 'spam_complaint'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : contact.reason === 'unsubscribed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-stone-100 text-stone-700 border border-stone-200/60'
                    }`}>
                      <span>{contact.reason.replace('_', ' ')}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-stone-500 text-xs max-w-xs truncate font-mono">
                    {contact.smtpDetails}
                  </td>

                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    {contact.blockedAt}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleUnblock(contact)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1"
                      title="Unblock contact"
                    >
                      <Unlock className="w-3 h-3 text-stone-500" />
                      <span>Unblock</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto" />
                      <p className="text-sm font-medium text-stone-900">No blocked contacts found</p>
                      <p className="text-xs text-stone-500">Your suppression list is clear for this filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD BLOCK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-stone-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden text-stone-900 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Add to Suppression List</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. recipient@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Reason</label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="manual_block">Manual block (Admin)</option>
                  <option value="hard_bounce">Hard bounce (5xx)</option>
                  <option value="spam_complaint">Spam complaint (FBL)</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">Diagnostic details</label>
                <input
                  type="text"
                  placeholder="e.g. Requested removal"
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium text-xs shadow-xs"
                >
                  Block contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
