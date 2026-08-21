import React, { useState } from 'react';
import { VerifiedSenderEmail } from '../../types/member';
import { Mail, Plus, CheckCircle2, Clock, Trash2, Star, ShieldCheck, X } from 'lucide-react';

interface EmailSetupTabProps {
  senders: VerifiedSenderEmail[];
  onAddSender: (sender: Omit<VerifiedSenderEmail, 'id'>) => void;
  onSetDefault: (id: string) => void;
  onDeleteSender: (id: string) => void;
}

export const EmailSetupTab: React.FC<EmailSetupTabProps> = ({
  senders,
  onAddSender,
  onSetDefault,
  onDeleteSender
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'form' | 'code'>('form');

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim()) {
      setStep('code');
    }
  };

  const handleConfirmCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim()) {
      onAddSender({
        email: newEmail.trim(),
        name: newName.trim() || newEmail.split('@')[0],
        isDefault: senders.length === 0,
        status: 'verified',
        verifiedAt: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      setStep('form');
      setNewEmail('');
      setNewName('');
      setVerificationCode('');
    }
  };

  return (
    <div className="max-w-3xl space-y-8 text-stone-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Email setup</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified "From" email addresses and default sender identities for your subscribers.
          </p>
        </div>

        <button
          id="add-sender-email-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sender Email</span>
        </button>
      </div>

      {/* Senders List */}
      <div className="rounded-3xl border border-stone-200 overflow-hidden bg-white shadow-xs">
        <div className="divide-y divide-stone-100">
          {senders.map((sender) => (
            <div key={sender.id} className="p-5 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-stone-800 font-bold text-xs">
                  <Mail className="w-5 h-5 text-stone-700" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-950">{sender.name}</span>
                    <span className="text-xs font-mono text-stone-500">({sender.email})</span>
                    {sender.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                        DEFAULT SENDER
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                    {sender.status === 'verified' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified {sender.verifiedAt}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!sender.isDefault && sender.status === 'verified' && (
                  <button
                    onClick={() => onSetDefault(sender.id)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Make Default
                  </button>
                )}

                {senders.length > 1 && (
                  <button
                    onClick={() => onDeleteSender(sender.id)}
                    className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverability notice */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-stone-600">
          <strong className="text-stone-900 font-bold block">Sender Verification & Reputation</strong>
          <p>
            Sending emails from a free provider (like @yahoo.com or @gmail.com) can trigger DMARC quarantine policies on Yahoo/Gmail recipient inboxes. For highest open rates, connect a custom domain in <strong>Domain setup</strong>.
          </p>
        </div>
      </div>

      {/* ADD SENDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-950" />
                <h3 className="text-base font-bold text-stone-950">Add Sender Email Address</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === 'form' ? (
              <form onSubmit={handleStartVerification} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">From Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Mehmet from Atelier Arslan"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Sender Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="hello@yourbrand.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950 font-mono"
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
                    Send Verification Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmCode} className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  We sent a 6-digit confirmation code to <strong className="text-stone-900 font-mono">{newEmail}</strong>. Enter it below to verify sender ownership:
                </p>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    placeholder="789012"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full text-center text-xl font-mono font-bold tracking-[0.3em] px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-950"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Confirm & Verify
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
