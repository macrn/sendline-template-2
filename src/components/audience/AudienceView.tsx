import React, { useState } from 'react';
import { AppView, SubscriberContact, AudienceSegment } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Plus, 
  Eye, 
  Trash2, 
  Tag, 
  DollarSign, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  X,
  Send,
  Zap,
  TrendingUp,
  FileText,
  UserCheck,
  MapPin,
  Calendar,
  Phone,
  CheckCheck,
  ArrowUpRight
} from 'lucide-react';
import { INITIAL_SUBSCRIBERS, INITIAL_SEGMENTS } from '../../data/mockData';

interface AudienceViewProps {
  onNavigate: (view: AppView) => void;
  subscribers?: SubscriberContact[];
  segments?: AudienceSegment[];
  onOpenCampaignWithSegment?: (segmentName: string) => void;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  onNavigate,
  subscribers: propSubscribers,
  segments: propSegments,
  onOpenCampaignWithSegment
}) => {
  const [subscribers, setSubscribers] = useState<SubscriberContact[]>(propSubscribers || INITIAL_SUBSCRIBERS);
  const [segments, setSegments] = useState<AudienceSegment[]>(propSegments || INITIAL_SEGMENTS);
  const [activeTab, setActiveTab] = useState<'contacts' | 'segments'>('contacts');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'VIP' | 'Unsubscribed'>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals & Drawers
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showCreateSegmentModal, setShowCreateSegmentModal] = useState(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SubscriberContact | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CSV Import State
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [parsedCsvSubscribers, setParsedCsvSubscribers] = useState<SubscriberContact[]>([]);

  // New Contact Form
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactStatus, setNewContactStatus] = useState<'Active' | 'VIP'>('Active');
  const [newContactTags, setNewContactTags] = useState('Newsletter Reader, Storefront');

  // New Segment Form
  const [newSegName, setNewSegName] = useState('');
  const [newSegDesc, setNewSegDesc] = useState('');
  const [newSegRule, setNewSegRule] = useState('Total Spend > $1,000');
  const [newSegColor, setNewSegColor] = useState('#38d9a9');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Contacts
  const filteredSubscribers = subscribers.filter(s => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || s.tags.includes(selectedTag);
    return matchesStatus && matchesSearch && matchesTag;
  });

  // Filtered Segments
  const filteredSegments = segments.filter(seg => {
    return searchTerm === '' || 
      seg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seg.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Add Contact Handler
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactEmail.trim()) return;

    const newSub: SubscriberContact = {
      id: 'sub-' + Date.now(),
      name: newContactName.trim() || newContactEmail.split('@')[0],
      email: newContactEmail.trim(),
      status: newContactStatus,
      tags: newContactTags.split(',').map(t => t.trim()).filter(Boolean),
      openRate: 0,
      clickRate: 0,
      ordersCount: 0,
      totalSpent: '$0.00',
      joinedAt: 'Just now',
      lastActive: 'Just now',
      source: 'Direct Manual Entry'
    };

    setSubscribers(prev => [newSub, ...prev]);
    setShowAddContactModal(false);
    setNewContactName('');
    setNewContactEmail('');
    showToast(`Added ${newSub.email} to audience!`);
  };

  // CSV Parsing and Upload
  const parseAudienceCsv = (text: string): SubscriberContact[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return [];

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
    const fnIdx = headers.findIndex(h => h.includes('first') || h === 'fname');
    const lnIdx = headers.findIndex(h => h.includes('last') || h === 'lname');
    const nameIdx = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'full_name');
    const locIdx = headers.findIndex(h => h.includes('location') || h.includes('city') || h.includes('country') || h.includes('state'));
    const dobIdx = headers.findIndex(h => h.includes('dob') || h.includes('birth') || h.includes('bday'));
    const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('tel') || h.includes('mobile'));
    const tagsIdx = headers.findIndex(h => h.includes('tag') || h.includes('interest') || h.includes('group'));

    const parsed: SubscriberContact[] = [];
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (row.length === 0) continue;

      let email = '';
      if (emailIdx !== -1 && row[emailIdx]) {
        email = row[emailIdx].trim();
      } else {
        const found = row.find(c => c.includes('@') && c.includes('.'));
        if (found) email = found.trim();
      }

      if (email && email.includes('@') && !seenEmails.has(email.toLowerCase())) {
        seenEmails.add(email.toLowerCase());
        const firstName = fnIdx !== -1 ? row[fnIdx] : undefined;
        const lastName = lnIdx !== -1 ? row[lnIdx] : undefined;
        const fullName = nameIdx !== -1 ? row[nameIdx] : (firstName ? `${firstName} ${lastName || ''}`.trim() : email.split('@')[0]);
        const location = locIdx !== -1 ? row[locIdx] : undefined;
        const dob = dobIdx !== -1 ? row[dobIdx] : undefined;
        const phone = phoneIdx !== -1 ? row[phoneIdx] : undefined;
        const tags = tagsIdx !== -1 && row[tagsIdx] ? row[tagsIdx].split(/[|;]/).map(t => t.trim()).filter(Boolean) : ['CSV-Imported'];

        parsed.push({
          id: 'sub-csv-' + Date.now() + '-' + i,
          email,
          name: fullName || email.split('@')[0],
          firstName,
          lastName,
          location,
          dob,
          phone,
          status: 'Active',
          tags: tags && tags.length > 0 ? tags : ['CSV-Imported'],
          openRate: Math.floor(Math.random() * 40) + 40,
          clickRate: Math.floor(Math.random() * 20) + 15,
          totalSpent: `$${Math.floor(Math.random() * 500)}`,
          ordersCount: Math.floor(Math.random() * 5) + 1,
          joinedAt: 'Just now',
          lastActive: 'Just now',
          source: 'CSV Upload',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`
        });
      }
    }
    return parsed;
  };

  const handleCsvFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const res = parseAudienceCsv(text);
          setParsedCsvSubscribers(res);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleApplyCsvImport = () => {
    if (parsedCsvSubscribers.length > 0) {
      setSubscribers(prev => [...parsedCsvSubscribers, ...prev]);
      showToast(`Imported ${parsedCsvSubscribers.length} subscribers successfully!`);
      setShowImportCsvModal(false);
      setParsedCsvSubscribers([]);
      setCsvFileName(null);
    }
  };

  const handleDownloadSampleCsvTemplate = () => {
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

  // Create Segment Handler
  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegName.trim()) return;

    const newSeg: AudienceSegment = {
      id: 'seg-' + Date.now(),
      name: newSegName.trim(),
      description: newSegDesc.trim() || 'Custom segmented cohort',
      filterRules: [newSegRule],
      subscriberCount: Math.floor(14000 + Math.random() * 50000),
      averageOpenRate: 59.2,
      growthRate: '+16.5% this month',
      color: newSegColor,
      isDynamic: true,
      createdAt: 'Today'
    };

    setSegments(prev => [newSeg, ...prev]);
    setShowCreateSegmentModal(false);
    setNewSegName('');
    setNewSegDesc('');
    showToast(`Created segment "${newSeg.name}"`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Status,Tags,Total Spent,Orders,Joined"].join(",") + "\n"
      + subscribers.map(s => `"${s.name}","${s.email}","${s.status}","${s.tags.join(';')}",${s.totalSpent},${s.ordersCount},"${s.joinedAt}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sendline-audience-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${subscribers.length} contacts to CSV`);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg shadow-lg border border-stone-800 flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & ACTION SWITCHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Audience
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Sync Active</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage subscriber profiles, lifetime engagement values, and dynamic segmentation cohorts.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="audience-header-import-csv-btn"
            onClick={() => setShowImportCsvModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Import CSV</span>
          </button>

          <button
            id="audience-header-export-csv-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            id="audience-header-add-contact-btn"
            onClick={() => setShowAddContactModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-stone-300" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC BOXES (MATCHING OVERVIEW/TRANSACTIONAL STYLE: CENTERED NUMBERS, SMALLER FONT) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
        
        {/* Metric 1: Total Audience */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>Total Audience</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-base sm:text-lg font-semibold text-stone-900 font-mono tracking-tight text-center">
              469,100
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 font-medium pt-2 border-t border-stone-100 text-center">
            <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>+14.2k this month</span>
          </div>
        </div>

        {/* Metric 2: Active & Engaged */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-stone-400" />
              <span>Active & Engaged</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-base sm:text-lg font-semibold text-stone-900 font-mono tracking-tight text-center">
              94.2%
            </div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 text-center">
            Opened in last 60 days
          </div>
        </div>

        {/* Metric 3: VIP Spenders */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-400" />
              <span>VIP Spenders</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-base sm:text-lg font-semibold text-stone-900 font-mono tracking-tight text-center">
              18,500
            </div>
          </div>

          <div className="text-[11px] text-amber-700 font-medium pt-2 border-t border-stone-100 text-center">
            Avg. LTV $1,240
          </div>
        </div>

        {/* Metric 4: Unsubscribe Rate */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Unsubscribe Rate</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="text-base sm:text-lg font-semibold text-emerald-700 font-mono tracking-tight text-center">
              0.02%
            </div>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 text-center">
            Healthy sender reputation
          </div>
        </div>

      </div>

      {/* 3. TABS SWITCHER */}
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-stone-100 border border-stone-200/80 w-fit">
        <button
          id="audience-tab-contacts-btn"
          onClick={() => setActiveTab('contacts')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'contacts'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-stone-500" />
          <span>All Subscribers</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            activeTab === 'contacts' ? 'bg-stone-100 text-stone-900' : 'bg-stone-200/70 text-stone-600'
          }`}>
            {subscribers.length}
          </span>
        </button>

        <button
          id="audience-tab-segments-btn"
          onClick={() => setActiveTab('segments')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'segments'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-stone-500" />
          <span>Smart Segments</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            activeTab === 'segments' ? 'bg-stone-100 text-stone-900' : 'bg-stone-200/70 text-stone-600'
          }`}>
            {segments.length}
          </span>
        </button>
      </div>

      {/* 4. TAB CONTENT */}
      {activeTab === 'contacts' && (
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4 text-left">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            
            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['All', 'Active', 'VIP', 'Unsubscribed'] as const).map((status) => {
                const count = status === 'All' ? subscribers.length : subscribers.filter(s => s.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === status
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    <span>{status}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      statusFilter === status ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}

              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Tag: {selectedTag}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, email, tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white w-48 sm:w-64 transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddContactModal(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-stone-300" />
                <span>Add</span>
              </button>
            </div>

          </div>

          {/* CONTACTS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60 text-xs font-medium text-stone-500">
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Tags</th>
                  <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
                  <th className="py-2.5 px-3 text-right">Orders</th>
                  <th className="py-2.5 px-3 text-right">Open Rate</th>
                  <th className="py-2.5 px-3">Joined</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredSubscribers.map((contact) => (
                  <tr 
                    key={contact.id} 
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Name & Email */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-stone-100 text-stone-900 font-semibold flex items-center justify-center text-xs border border-stone-200 shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-all">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 text-xs group-hover:text-stone-700">
                            {contact.name}
                          </div>
                          <div className="text-stone-500 text-[11px] font-mono">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${
                        contact.status === 'VIP' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        contact.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          contact.status === 'VIP' ? 'bg-amber-500' :
                          contact.status === 'Active' ? 'bg-emerald-500' :
                          'bg-stone-400'
                        }`} />
                        {contact.status}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {contact.tags.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(t);
                            }}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-medium border border-stone-200/80 transition-colors cursor-pointer"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Total Spent */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-stone-900 font-medium">
                      {contact.totalSpent}
                    </td>

                    {/* Orders */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-stone-700">
                      {contact.ordersCount}
                    </td>

                    {/* Open Rate */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-emerald-700 font-medium">
                      {contact.openRate}%
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-stone-500 text-[11px]">
                      {contact.joinedAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-700 text-xs font-medium border border-stone-200 transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <Users className="w-6 h-6 text-stone-300 mx-auto" />
              <p className="text-xs font-semibold text-stone-700">No contacts matched your search</p>
              <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                Try adjusting your search query or reset the active filters.
              </p>
              <button
                onClick={() => { setStatusFilter('All'); setSearchTerm(''); setSelectedTag(null); }}
                className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 font-medium text-xs hover:bg-stone-200 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* 5. TAB 2: SMART AUDIENCE SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-stone-200 space-y-4 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Dynamic Segment Cohorts</h3>
              <p className="text-xs text-stone-500 mt-0.5">Auto-updating lists based on subscriber engagement & purchase behavior</p>
            </div>

            <button
              id="create-segment-top-btn"
              onClick={() => setShowCreateSegmentModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-stone-300" />
              <span>Create Segment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSegments.map((seg) => (
              <div
                key={seg.id}
                className="p-5 rounded-xl bg-stone-50/50 border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                      {seg.isDynamic ? 'Dynamic Sync' : 'Static'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                      {seg.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {seg.description}
                    </p>
                  </div>

                  {/* Filter Rules */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Rules Applied</div>
                    <div className="flex flex-wrap gap-1">
                      {seg.filterRules.map((rule, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-stone-400 text-[10px]">Audience Size</div>
                      <div className="text-xs font-semibold font-mono text-stone-900">{seg.subscriberCount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-stone-400 text-[10px]">Avg. Open Rate</div>
                      <div className="text-xs font-semibold font-mono text-emerald-700">{seg.averageOpenRate}%</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenCampaignWithSegment) {
                        onOpenCampaignWithSegment(seg.name);
                      } else {
                        onNavigate('marketing');
                      }
                    }}
                    className="w-full py-1.5 rounded-lg bg-white hover:bg-stone-900 hover:text-white text-stone-800 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Target in Campaign</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* CONTACT DETAILS DRAWER */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-stone-200">
            
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Contact Profile
                </span>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-semibold text-lg flex items-center justify-center shadow-xs">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{selectedContact.name}</h3>
                  <div className="text-xs text-stone-500 font-mono">{selectedContact.email}</div>
                  <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedContact.status}
                  </span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wide font-medium">Lifetime Spend</div>
                  <div className="text-base font-semibold font-mono text-stone-900 mt-1">{selectedContact.totalSpent}</div>
                  <div className="text-[11px] text-stone-500">{selectedContact.ordersCount} orders</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wide font-medium">Open Rate</div>
                  <div className="text-base font-semibold font-mono text-emerald-700 mt-1">{selectedContact.openRate}%</div>
                  <div className="text-[11px] text-stone-500">{selectedContact.clickRate}% click rate</div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-stone-900 uppercase tracking-wide">Tags & Audiences</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContact.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details & History */}
              <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Source:</span>
                  <span className="font-medium text-stone-900">{selectedContact.source}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Date Joined:</span>
                  <span className="font-medium text-stone-900">{selectedContact.joinedAt}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Last Engagement:</span>
                  <span className="font-medium text-stone-900">{selectedContact.lastActive}</span>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedContact(null);
                  onNavigate('marketing');
                }}
                className="flex-1 py-2.5 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Direct Email</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150 border border-stone-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-stone-900" />
                <h3 className="text-base font-semibold text-stone-900">Add Subscriber Contact</h3>
              </div>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. eleanor@atelier-design.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Status Tier</label>
                <select
                  value={newContactStatus}
                  onChange={(e) => setNewContactStatus(e.target.value as 'Active' | 'VIP')}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                >
                  <option value="Active">Active (Standard)</option>
                  <option value="VIP">VIP (High-Value / Top Spender)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Newsletter Reader, Wholesale, NYC"
                  value={newContactTags}
                  onChange={(e) => setNewContactTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs transition-all"
                >
                  Save Contact
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CREATE SEGMENT MODAL */}
      {showCreateSegmentModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150 border border-stone-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-900" />
                <h3 className="text-base font-semibold text-stone-900">Create Smart Segment</h3>
              </div>
              <button
                onClick={() => setShowCreateSegmentModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSegment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Segment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EU Spring Spenders"
                  value={newSegName}
                  onChange={(e) => setNewSegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief note about target criteria"
                  value={newSegDesc}
                  onChange={(e) => setNewSegDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Filter Condition</label>
                <select
                  value={newSegRule}
                  onChange={(e) => setNewSegRule(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                >
                  <option value="Total Spend > $1,000">Total Spend &gt; $1,000</option>
                  <option value="Open Rate > 60%">Open Rate &gt; 60%</option>
                  <option value="Joined < 30 days">Joined &lt; 30 days (Recent Signups)</option>
                  <option value="Tagged as VIP">Tagged as VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Color Indicator</label>
                <div className="flex items-center gap-2 pt-0.5">
                  {['#38d9a9', '#60a5fa', '#f59e0b', '#a78bfa', '#ec4899'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewSegColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${newSegColor === c ? 'scale-110 border-stone-900 shadow-xs' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateSegmentModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
                >
                  Save Segment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 3: IMPORT CSV SUBSCRIBERS */}
      {showImportCsvModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-stone-200 rounded-xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setShowImportCsvModal(false)}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-xs">
                <Upload className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-base font-semibold text-stone-900">
                Import Subscribers via CSV
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Upload any subscriber CSV with columns for <span className="font-mono text-stone-800 font-medium">email, first_name, last_name, location, dob, phone, tags</span>.
            </p>

            <div className="overflow-y-auto space-y-4 pr-1">
              <label className="border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-stone-100/50 group">
                <Upload className="w-7 h-7 text-stone-400 group-hover:text-stone-700 transition-colors mb-2" />
                <span className="text-xs font-semibold text-stone-900">
                  {csvFileName || 'Click or drag your CSV file to import'}
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5">Supports CSV files up to 50MB</span>
                {csvFileName && parsedCsvSubscribers.length > 0 && (
                  <span className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready to import {parsedCsvSubscribers.length} subscribers
                  </span>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileSelected}
                  className="hidden"
                />
              </label>

              {parsedCsvSubscribers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600 uppercase tracking-wider text-[10px]">
                      Parsed Preview ({parsedCsvSubscribers.length} detected)
                    </span>
                    <span className="text-stone-400 text-[11px]">Showing first 4 rows</span>
                  </div>
                  <div className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50/50 max-h-40 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-stone-100 text-stone-600 font-medium text-[10px] border-b border-stone-200">
                        <tr>
                          <th className="p-2">Email</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Location</th>
                          <th className="p-2">DOB</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Tags</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 text-stone-800">
                        {parsedCsvSubscribers.slice(0, 4).map((c, i) => (
                          <tr key={i} className="hover:bg-white transition-colors">
                            <td className="p-2 font-mono font-medium text-stone-900">{c.email}</td>
                            <td className="p-2 text-stone-600">{c.name || '—'}</td>
                            <td className="p-2 text-stone-500">
                              {c.location ? (
                                <span className="inline-flex items-center gap-1 text-[10px]">
                                  <MapPin className="w-2.5 h-2.5 text-stone-400" />
                                  {c.location}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="p-2 text-stone-500">{c.dob || '—'}</td>
                            <td className="p-2 text-stone-500 font-mono text-[10px]">{c.phone || '—'}</td>
                            <td className="p-2">
                              {c.tags && c.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {c.tags.slice(0, 2).map((t, ti) => (
                                    <span key={ti} className="text-[9px] bg-stone-200 px-1 py-0.2 rounded text-stone-700">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
              <button 
                onClick={handleDownloadSampleCsvTemplate}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-stone-400" />
                <span>Download Sample CSV</span>
              </button>

              <button
                onClick={handleApplyCsvImport}
                disabled={!csvFileName || parsedCsvSubscribers.length === 0}
                className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Import {parsedCsvSubscribers.length > 0 ? `(${parsedCsvSubscribers.length})` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
