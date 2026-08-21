import React, { useState } from 'react';
import { EmailTemplate } from '../../../types';
import { TemplatePreviewCard } from './TemplatePreviewCard';
import { 
  Check, 
  ChevronDown, 
  Plus, 
  Paperclip, 
  Users, 
  User, 
  Upload, 
  X, 
  HelpCircle, 
  Sparkles, 
  Smile, 
  Split, 
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
  MapPin,
  Calendar,
  Phone,
  Tag,
  Filter,
  Trash2,
  Eye,
  CheckCheck
} from 'lucide-react';

export interface ParsedCsvContact {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  dob?: string;
  phone?: string;
  gender?: string;
  tags?: string[];
}

export interface AudienceState {
  fromName: string;
  fromEmail: string;
  subject: string;
  subjectB?: string;
  isAbTest: boolean;
  previewText: string;
  recipients: Array<{
    type: 'individual' | 'segment' | 'csv';
    label: string;
    count: number;
    contacts?: ParsedCsvContact[];
  }>;
  excludedRecipients?: Array<{
    type: 'individual' | 'segment';
    label: string;
  }>;
}

interface ChooseAudienceStepProps {
  template: EmailTemplate;
  audienceState: AudienceState;
  onUpdateAudience: (updates: Partial<AudienceState>) => void;
  onContinueToSend: () => void;
  onBackToDesign: () => void;
}

export const ChooseAudienceStep: React.FC<ChooseAudienceStepProps> = ({
  template,
  audienceState,
  onUpdateAudience,
  onContinueToSend,
  onBackToDesign
}) => {
  // 3 Substeps: 0 = Sender Info, 1 = Subject Line, 2 = Recipients
  const [subStep, setSubStep] = useState<number>(0);

  // Modals for Recipient picking
  const [showSegmentModal, setShowSegmentModal] = useState<boolean>(false);
  const [showIndividualModal, setShowIndividualModal] = useState<boolean>(false);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAddSenderModal, setShowAddSenderModal] = useState<boolean>(false);
  const [newSenderEmail, setNewSenderEmail] = useState<string>('');

  // Segment modal local state
  const [selectedIncludeSegment, setSelectedIncludeSegment] = useState<string>('');
  const [selectedExcludeSegment, setSelectedExcludeSegment] = useState<string>('');

  // Individual modal local state
  const [individualInput, setIndividualInput] = useState<string>('');
  const [individualList, setIndividualList] = useState<string[]>(
    audienceState.recipients.filter(r => r.type === 'individual').map(r => r.label)
  );
  const [excludeIndividualInput, setExcludeIndividualInput] = useState<string>('');

  // CSV Drag and drop state
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvCount, setCsvCount] = useState<number>(0);
  const [parsedCsvContacts, setParsedCsvContacts] = useState<ParsedCsvContact[]>([]);
  const [inspectingCsvRecipient, setInspectingCsvRecipient] = useState<{ label: string; contacts: ParsedCsvContact[] } | null>(null);
  const [contactSearchQuery, setContactSearchQuery] = useState<string>('');

  const availableSenders = [
    'mehmetarslan@yahoo.com',
    'marketing@sendline.io',
    'editorial@sendline.io',
    'newsletter@sendline.io'
  ];

  const availableSegments = [
    { label: 'All VIP Subscribers', count: 68400 },
    { label: 'Loyalty Gold & Diamond Members', count: 1240 },
    { label: 'Recent 30-Day Customers', count: 4890 },
    { label: 'Editorial Newsletter Readership', count: 24300 },
    { label: 'Flash Sale Waitlist', count: 3120 }
  ];

  const emojis = ['✨', '🔥', '💎', '💌', '🎉', '⚡', '🎁', '🚀', '🖤', '🌸', '💫'];

  const handleAddEmoji = (emoji: string) => {
    onUpdateAudience({ subject: (audienceState.subject || '') + ' ' + emoji });
    setShowEmojiPicker(false);
  };

  const handleAddIndividual = (emailToAdd?: string) => {
    const val = (emailToAdd || individualInput).trim();
    if (!val || !val.includes('@')) return;
    if (!individualList.includes(val)) {
      setIndividualList([...individualList, val]);
    }
    setIndividualInput('');
  };

  const handleRemoveIndividual = (emailToRemove: string) => {
    setIndividualList(individualList.filter(e => e !== emailToRemove));
  };

  const handleSaveSegments = () => {
    if (selectedIncludeSegment) {
      const segObj = availableSegments.find(s => s.label === selectedIncludeSegment);
      const newRecipients = [
        ...audienceState.recipients.filter(r => r.label !== selectedIncludeSegment),
        {
          type: 'segment' as const,
          label: selectedIncludeSegment,
          count: segObj?.count || 1000
        }
      ];
      onUpdateAudience({ recipients: newRecipients });
    }
    setShowSegmentModal(false);
  };

  const handleSaveIndividuals = () => {
    const currentNonIndividuals = audienceState.recipients.filter(r => r.type !== 'individual');
    const newIndividualRecipients = individualList.map(email => ({
      type: 'individual' as const,
      label: email,
      count: 1
    }));
    onUpdateAudience({ recipients: [...currentNonIndividuals, ...newIndividualRecipients] });
    setShowIndividualModal(false);
  };

  const parseCsvText = (text: string): ParsedCsvContact[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];

    const headerLine = lines[0].toLowerCase();
    const delimiter = headerLine.includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail') || h.includes('e-mail'));
    const fnIdx = headers.findIndex(h => h.includes('first') || h === 'fname' || h === 'prenom');
    const lnIdx = headers.findIndex(h => h.includes('last') || h === 'lname' || h === 'nom');
    const nameIdx = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'full_name');
    const locIdx = headers.findIndex(h => h.includes('location') || h.includes('city') || h.includes('country') || h.includes('state') || h.includes('address'));
    const dobIdx = headers.findIndex(h => h.includes('dob') || h.includes('birth') || h.includes('bday') || h.includes('born'));
    const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel') || h.includes('cell'));
    const genderIdx = headers.findIndex(h => h.includes('gender') || h.includes('sex'));
    const tagsIdx = headers.findIndex(h => h.includes('tag') || h.includes('interest') || h.includes('group') || h.includes('category'));

    const contacts: ParsedCsvContact[] = [];
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (row.length === 0) continue;

      let email = '';
      if (emailIdx !== -1 && row[emailIdx]) {
        email = row[emailIdx].trim();
      } else {
        // Fallback: look for @ in any column
        const found = row.find(c => c.includes('@') && c.includes('.'));
        if (found) email = found.trim();
      }

      if (email && email.includes('@') && !seenEmails.has(email.toLowerCase())) {
        seenEmails.add(email.toLowerCase());
        
        const firstName = fnIdx !== -1 ? row[fnIdx] : undefined;
        const lastName = lnIdx !== -1 ? row[lnIdx] : undefined;
        const fullName = nameIdx !== -1 ? row[nameIdx] : (firstName ? `${firstName} ${lastName || ''}`.trim() : undefined);
        const location = locIdx !== -1 ? row[locIdx] : undefined;
        const dob = dobIdx !== -1 ? row[dobIdx] : undefined;
        const phone = phoneIdx !== -1 ? row[phoneIdx] : undefined;
        const gender = genderIdx !== -1 ? row[genderIdx] : undefined;
        const tags = tagsIdx !== -1 && row[tagsIdx] ? row[tagsIdx].split(/[|;]/).map(t => t.trim()).filter(Boolean) : undefined;

        contacts.push({
          email,
          name: fullName,
          firstName,
          lastName,
          location,
          dob,
          phone,
          gender,
          tags
        });
      }
    }

    return contacts;
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const parsed = parseCsvText(text);
          setParsedCsvContacts(parsed);
          setCsvCount(parsed.length);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSampleCsv = () => {
    const headers = 'email,first_name,last_name,location,dob,phone,gender,tags';
    const sampleRows = [
      'sophia.laurent@parisian.fr,Sophia,Laurent,"Paris, France",1992-04-18,+33 6 12 34 56 78,Female,"VIP Customer|Fashion Readership"',
      'marcus.vance@studio.co,Marcus,Vance,"New York, NY",1988-11-03,+1 212-555-0194,Male,"Editorial Member|Design"',
      'elena.rostova@atelier.io,Elena,Rostova,"London, UK",1995-07-22,+44 20 7946 0912,Female,"Luxury VIP|Waitlist"',
      'kenji.sato@ginza.jp,Kenji,Sato,"Tokyo, Japan",1990-09-14,+81 90-1234-5678,Male,"Brand Ambassador|Collector"',
      'chloe.dupuis@montreal.ca,Chloe,Dupuis,"Montreal, Canada",1994-01-30,+1 514-555-0182,Female,"Active Subscriber|Lifestyle"'
    ];
    const csvContent = [headers, ...sampleRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sendline_subscribers_marketing_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveCsv = () => {
    if (csvFileName) {
      const newRecipients = [
        ...audienceState.recipients,
        {
          type: 'csv' as const,
          label: `Import: ${csvFileName}`,
          count: parsedCsvContacts.length || csvCount || 250,
          contacts: parsedCsvContacts.length > 0 ? parsedCsvContacts : undefined
        }
      ];
      onUpdateAudience({ recipients: newRecipients });
    }
    setShowCsvModal(false);
  };

  const handleRemoveRecipient = (labelToRemove: string) => {
    onUpdateAudience({
      recipients: audienceState.recipients.filter(r => r.label !== labelToRemove)
    });
    setIndividualList(individualList.filter(e => e !== labelToRemove));
  };

  const totalRecipientCount = audienceState.recipients.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#0A0D14] text-white overflow-hidden select-none">
      
      {/* LEFT COLUMN: Scaled Live Email Card Preview (As shown in screenshots 3, 4, 6, 7, 8) */}
      <div className="w-full lg:w-1/2 bg-[#0E121B] border-r border-white/10 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[460px] space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-500">Live Card Rendering</span>
            <button 
              onClick={onBackToDesign}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              Edit in canvas ↗
            </button>
          </div>
          <TemplatePreviewCard template={template} maxHeight="max-h-[68vh]" />
        </div>
      </div>

      {/* RIGHT COLUMN: 3-Substep Paginated Wizard Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto bg-[#0A0D14]">
        
        {/* Top Pagination Dots and Step Header */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setSubStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  subStep === idx 
                    ? 'bg-white scale-125' 
                    : idx < subStep 
                    ? 'bg-emerald-400' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* SUBSTEP 0: SENDER INFO (Screenshot 8) */}
          {subStep === 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
                  Who's this email coming from?
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Choose the name and verified email address your recipients will see in their inbox.
                </p>
              </div>

              <div className="space-y-5 max-w-lg">
                {/* From Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-300 tracking-wide uppercase">
                    From name
                  </label>
                  <input
                    type="text"
                    value={audienceState.fromName}
                    onChange={(e) => onUpdateAudience({ fromName: e.target.value })}
                    placeholder="e.g. Mehmet Arslan or Sendline Team"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all font-medium"
                  />
                </div>

                {/* From Email Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-300 tracking-wide uppercase">
                    From email
                  </label>
                  <div className="relative">
                    <select
                      value={audienceState.fromEmail}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') {
                          setShowAddSenderModal(true);
                        } else {
                          onUpdateAudience({ fromEmail: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3.5 bg-[#121620] border border-white/15 rounded-2xl text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all appearance-none cursor-pointer font-medium"
                    >
                      {availableSenders.map(email => (
                        <option key={email} value={email} className="bg-stone-900 text-white">
                          {email}
                        </option>
                      ))}
                      <option value="ADD_NEW" className="bg-stone-900 text-emerald-400 font-bold">
                        + Add new sender email address...
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Helper text with link */}
                <p className="text-xs text-stone-400 pt-2 leading-relaxed">
                  If you'd like to send from a different email address,{' '}
                  <button
                    onClick={() => setShowAddSenderModal(true)}
                    className="text-white underline underline-offset-2 hover:text-emerald-400 font-medium cursor-pointer"
                  >
                    manage senders here.
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SUBSTEP 1: SUBJECT LINE & PREVIEW TEXT (Screenshot 7) */}
          {subStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
                  Write your subject line
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Craft an engaging subject and preview snippet that stands out in crowded inboxes.
                </p>
              </div>

              <div className="space-y-6 max-w-lg">
                {/* Subject Line Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300 tracking-wide uppercase">
                      Subject line
                    </label>
                    <button
                      onClick={() => onUpdateAudience({ isAbTest: !audienceState.isAbTest })}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>{audienceState.isAbTest ? 'Remove A/B test' : 'Add A/B test'}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={audienceState.subject}
                      onChange={(e) => onUpdateAudience({ subject: e.target.value })}
                      placeholder="✨ Limited Time: 25% Off All Editorial Services!"
                      className="w-full pl-4 pr-12 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer"
                      title="Insert emoji"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Emoji Quick Picker */}
                  {showEmojiPicker && (
                    <div className="p-2 bg-[#171D29] border border-white/15 rounded-xl flex items-center gap-2 shadow-2xl animate-fadeIn">
                      {emojis.map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => handleAddEmoji(em)}
                          className="p-1.5 text-base hover:bg-white/10 rounded-lg transition-transform hover:scale-125 cursor-pointer"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Optional A/B Test Variant B */}
                {audienceState.isAbTest && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">Variant B (50% Audience Split)</span>
                    </div>
                    <input
                      type="text"
                      value={audienceState.subjectB || ''}
                      onChange={(e) => onUpdateAudience({ subjectB: e.target.value })}
                      placeholder="Exclusive VIP Access: Claim your 25% discount voucher"
                      className="w-full px-4 py-3 bg-stone-900 border border-emerald-500/40 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                )}

                {/* Preview Text Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-stone-300 tracking-wide uppercase">
                        Preview text
                      </label>
                      <div className="group relative">
                        <HelpCircle className="w-3.5 h-3.5 text-stone-500 hover:text-stone-300 cursor-pointer" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-stone-900 border border-white/20 rounded-lg text-[10px] text-stone-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-xl">
                          The preview text snippet displayed right next to your subject line in Apple Mail, Gmail, and Outlook.
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500">
                      {audienceState.previewText.length} / 90
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    maxLength={90}
                    value={audienceState.previewText}
                    onChange={(e) => onUpdateAudience({ previewText: e.target.value })}
                    placeholder="Unlock big savings on branding, coaching, and more—don't miss out!"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-all resize-none font-medium"
                  />
                  <p className="text-[11px] text-stone-500">
                    A snippet of text that will appear in the inbox preview next to the subject line.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUBSTEP 2: RECIPIENTS (Screenshots 6, 4) */}
          {subStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white tracking-tight">
                  {audienceState.recipients.length === 0 
                    ? 'Choose your recipients' 
                    : `${totalRecipientCount.toLocaleString()} recipient${totalRecipientCount === 1 ? '' : 's'} chosen`}
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Send to saved segments, individual emails, or import a fresh CSV subscriber list.
                </p>
              </div>

              {/* If no recipients selected yet (Screenshot 6) */}
              {audienceState.recipients.length === 0 ? (
                <div className="space-y-3.5 max-w-lg">
                  <button
                    onClick={() => setShowSegmentModal(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <span>+ Add segments</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => setShowIndividualModal(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span>+ Add individuals</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => setShowCsvModal(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-5 h-5 text-amber-400" />
                      <span>📎 Upload CSV</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : (
                /* Recipients chosen list (Screenshot 4) */
                <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Included
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {audienceState.recipients.map((rec) => (
                        <div
                          key={rec.label}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white shadow-xs"
                        >
                          {rec.type === 'segment' && <Users className="w-3.5 h-3.5 text-emerald-400" />}
                          {rec.type === 'individual' && <User className="w-3.5 h-3.5 text-blue-400" />}
                          {rec.type === 'csv' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                          
                          <span>{rec.label}</span>
                          {rec.count > 1 && (
                            <span className="text-[10px] opacity-60">({rec.count.toLocaleString()})</span>
                          )}

                          {rec.type === 'csv' && rec.contacts && rec.contacts.length > 0 && (
                            <button
                              onClick={() => setInspectingCsvRecipient({ label: rec.label, contacts: rec.contacts || [] })}
                              title="Inspect imported subscribers"
                              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleRemoveRecipient(rec.label)}
                            className="p-0.5 rounded-full hover:bg-white/20 text-stone-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add more button */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setShowSegmentModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Segment</span>
                    </button>
                    <button
                      onClick={() => setShowIndividualModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Individual</span>
                    </button>
                    <button
                      onClick={() => setShowCsvModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Upload CSV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between max-w-lg mt-8">
          {subStep > 0 ? (
            <button
              onClick={() => setSubStep(subStep - 1)}
              className="text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={onBackToDesign}
              className="text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Design
            </button>
          )}

          <button
            onClick={() => {
              if (subStep < 2) {
                setSubStep(subStep + 1);
              } else {
                onContinueToSend();
              }
            }}
            className="px-8 py-3.5 rounded-full bg-white text-stone-950 font-bold text-xs shadow-xl hover:bg-stone-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RECIPIENT MODALS & OVERLAYS (Flodesk Reference Screenshots 1, 2, 5)       */}
      {/* ========================================================================= */}

      {/* MODAL 1: CHOOSE SEGMENTS (Screenshot 2) */}
      {showSegmentModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowSegmentModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <X className="w-4 h-4" />
              <span>esc</span>
            </button>

            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mb-6">
              Choose segments
            </h3>

            <div className="space-y-6">
              {/* Include */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                  Include
                </label>
                <div className="relative">
                  <select
                    value={selectedIncludeSegment}
                    onChange={(e) => setSelectedIncludeSegment(e.target.value)}
                    className="w-full px-4 py-3.5 bg-stone-900 border border-white/15 rounded-2xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-white"
                  >
                    <option value="">Start typing to find a segment</option>
                    {availableSegments.map(seg => (
                      <option key={seg.label} value={seg.label}>
                        {seg.label} ({seg.count.toLocaleString()} subscribers)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Exclude */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                  Exclude
                </label>
                <div className="relative">
                  <select
                    value={selectedExcludeSegment}
                    onChange={(e) => setSelectedExcludeSegment(e.target.value)}
                    className="w-full px-4 py-3.5 bg-stone-900 border border-white/15 rounded-2xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-white"
                  >
                    <option value="">Start typing to find a segment</option>
                    <option value="Unsubscribed Contacts">Unsubscribed Contacts</option>
                    <option value="Bounced Addresses">Bounced Addresses</option>
                    <option value="Inactive 90+ Days">Inactive 90+ Days</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <p className="text-xs text-stone-400">
                Excluded segments override included segments.
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveSegments}
                  disabled={!selectedIncludeSegment}
                  className="px-8 py-3 rounded-full bg-white text-stone-950 font-bold text-xs shadow-xl hover:bg-stone-200 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CHOOSE INDIVIDUALS (Screenshot 5) */}
      {showIndividualModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowIndividualModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <X className="w-4 h-4" />
              <span>esc</span>
            </button>

            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mb-6">
              Choose individuals
            </h3>

            <div className="space-y-6">
              {/* Include */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                    Include
                  </label>
                  {individualList.length > 0 && (
                    <button
                      onClick={() => setIndividualList([])}
                      className="text-xs text-stone-400 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="p-3 bg-stone-900 border border-white/15 rounded-2xl min-h-[52px] flex flex-wrap items-center gap-2">
                  {individualList.map(email => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs text-white"
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveIndividual(email)}
                        className="hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  <input
                    type="email"
                    placeholder={individualList.length === 0 ? "Type emails, separated by Enter or comma" : "Add more emails..."}
                    value={individualInput}
                    onChange={(e) => setIndividualInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddIndividual();
                      }
                    }}
                    className="flex-1 min-w-[180px] bg-transparent text-xs text-white focus:outline-none py-1"
                  />
                </div>
              </div>

              {/* Exclude */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wide">
                  Exclude
                </label>
                <input
                  type="text"
                  placeholder="Type emails, separated by comma"
                  value={excludeIndividualInput}
                  onChange={(e) => setExcludeIndividualInput(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-900 border border-white/15 rounded-2xl text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <p className="text-xs text-stone-400">
                Excluded individuals override included individuals.
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveIndividuals}
                  disabled={individualList.length === 0 && !individualInput}
                  className="px-8 py-3 rounded-full bg-white text-stone-950 font-bold text-xs shadow-xl hover:bg-stone-200 disabled:opacity-40 transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: IMPORT CSV (Screenshot 1 & Rich Marketing Field Importer) */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setShowCsvModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs z-10"
            >
              <X className="w-4 h-4" />
              <span>esc</span>
            </button>

            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mb-1">
              Import subscribers
            </h3>
            <p className="text-xs text-stone-400 mb-5 leading-relaxed">
              Upload any CSV with headers like <span className="text-emerald-400 font-mono">email, first_name, last_name, location, dob, phone, tags</span>. We automatically clean duplicates and map demographic attributes.
            </p>

            {/* Drop Zone */}
            <div className="overflow-y-auto space-y-4 pr-1">
              <label className="border-2 border-dashed border-white/20 hover:border-emerald-500/50 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/8 group">
                <Upload className="w-8 h-8 text-stone-400 group-hover:text-emerald-400 transition-colors mb-2" />
                <span className="text-sm font-bold text-white">
                  {csvFileName || 'Click or drag to upload your CSV file'}
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5">Supports CSV files up to 50MB</span>
                {csvFileName && parsedCsvContacts.length > 0 && (
                  <span className="text-xs text-emerald-400 mt-2 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Successfully parsed {parsedCsvContacts.length} valid subscribers
                  </span>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>

              {/* Parsed Contacts Preview Table */}
              {parsedCsvContacts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-300 uppercase tracking-wider text-[10px]">
                      Data Preview ({parsedCsvContacts.length} detected)
                    </span>
                    <span className="text-stone-500 text-[11px]">Showing first 4 rows</span>
                  </div>
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-stone-900/60 max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-white/5 text-stone-400 uppercase font-mono text-[9px] border-b border-white/10">
                        <tr>
                          <th className="p-2.5">Email</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Location</th>
                          <th className="p-2.5">DOB</th>
                          <th className="p-2.5">Phone</th>
                          <th className="p-2.5">Tags</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-stone-200">
                        {parsedCsvContacts.slice(0, 4).map((c, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-2.5 font-medium text-white">{c.email}</td>
                            <td className="p-2.5 text-stone-400">{c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || '—'}</td>
                            <td className="p-2.5">
                              {c.location ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {c.location}
                                </span>
                              ) : <span className="text-stone-600">—</span>}
                            </td>
                            <td className="p-2.5">
                              {c.dob ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-blue-300 bg-blue-400/10 px-2 py-0.5 rounded-md border border-blue-400/20">
                                  <Calendar className="w-2.5 h-2.5" />
                                  {c.dob}
                                </span>
                              ) : <span className="text-stone-600">—</span>}
                            </td>
                            <td className="p-2.5 text-stone-400 font-mono text-[10px]">{c.phone || '—'}</td>
                            <td className="p-2.5">
                              {c.tags && c.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {c.tags.slice(0, 2).map((t, ti) => (
                                    <span key={ti} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-stone-300">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : <span className="text-stone-600">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button 
                onClick={handleDownloadSampleCsv}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1.5 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV Template</span>
              </button>

              <button
                onClick={handleSaveCsv}
                disabled={!csvFileName || parsedCsvContacts.length === 0}
                className="px-8 py-3 rounded-full bg-white text-stone-950 font-bold text-xs shadow-xl hover:bg-stone-200 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Import {parsedCsvContacts.length > 0 ? `(${parsedCsvContacts.length})` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT CSV CONTACTS */}
      {inspectingCsvRecipient && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn max-h-[85vh] flex flex-col">
            <button
              onClick={() => setInspectingCsvRecipient(null)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-xl font-serif-display font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{inspectingCsvRecipient.label}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {inspectingCsvRecipient.contacts.length} imported subscriber profiles with demographic metadata.
              </p>
            </div>

            {/* Search filter */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by email, name, location, or tag..."
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-900 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-white"
              />
            </div>

            {/* Contact List */}
            <div className="overflow-y-auto flex-1 border border-white/10 rounded-2xl bg-stone-900/60 divide-y divide-white/5">
              {inspectingCsvRecipient.contacts
                .filter(c => {
                  if (!contactSearchQuery) return true;
                  const q = contactSearchQuery.toLowerCase();
                  return (
                    c.email.toLowerCase().includes(q) ||
                    (c.name && c.name.toLowerCase().includes(q)) ||
                    (c.location && c.location.toLowerCase().includes(q)) ||
                    (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
                  );
                })
                .map((c, i) => (
                  <div key={i} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.email}</span>
                        {c.name && <span className="text-xs text-stone-400">({c.name})</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {c.location && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            <MapPin className="w-2.5 h-2.5" />
                            {c.location}
                          </span>
                        )}
                        {c.dob && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-300 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                            <Calendar className="w-2.5 h-2.5" />
                            {c.dob}
                          </span>
                        )}
                        {c.phone && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 font-mono">
                            <Phone className="w-2.5 h-2.5" />
                            {c.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center">
                        {c.tags.map((t, ti) => (
                          <span key={ti} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-stone-300 border border-white/10">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setInspectingCsvRecipient(null)}
                className="px-6 py-2.5 rounded-full bg-white text-stone-950 font-bold text-xs hover:bg-stone-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD SENDER MODAL */}
      {showAddSenderModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowAddSenderModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif-display font-bold text-white mb-2">
              Add Verified Sender
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Enter a custom domain email address to send your editorial emails from.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="hello@yourbrand.com"
                value={newSenderEmail}
                onChange={(e) => setNewSenderEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-900 border border-white/15 rounded-2xl text-xs text-white focus:outline-none focus:border-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddSenderModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newSenderEmail && newSenderEmail.includes('@')) {
                      onUpdateAudience({ fromEmail: newSenderEmail });
                      setShowAddSenderModal(false);
                    }
                  }}
                  disabled={!newSenderEmail || !newSenderEmail.includes('@')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-40 cursor-pointer"
                >
                  Verify & Use
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
