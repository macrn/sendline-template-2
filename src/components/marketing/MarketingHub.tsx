import React, { useState } from 'react';
import { AppView, EmailTemplate, Campaign, SubscriberContact, AudienceSegment } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Eye, 
  Calendar, 
  Clock, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Send,
  SlidersHorizontal,
  Filter,
  LayoutGrid,
  List,
  X,
  Smartphone,
  Monitor,
  Check,
  Tag,
  BarChart3,
  Users,
  TrendingUp,
  Download,
  Upload,
  UserPlus,
  Mail,
  MoreHorizontal,
  ExternalLink,
  DollarSign,
  MousePointerClick,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  PieChart,
  Edit3,
  Trash2,
  Share2,
  FolderPlus,
  Folder,
  RefreshCw
} from 'lucide-react';
import { TemplateDetailModal } from './TemplateDetailModal';
import { INITIAL_SUBSCRIBERS, INITIAL_SEGMENTS } from '../../data/mockData';
import { INITIAL_FOLDERS, INITIAL_SAVED_EMAILS } from '../../data/mockMemberData';
import { MyTemplatesFolderView } from '../member/MyTemplatesFolderView';
import { UserFolder, UserSavedEmail } from '../../types/member';

export type MarketingTab = 'campaigns' | 'saved-emails' | 'templates' | 'audience' | 'segments';

interface MarketingHubProps {
  campaigns: Campaign[];
  templates: EmailTemplate[];
  onOpenTemplateEditor: (template?: EmailTemplate) => void;
  onNavigate: (view: AppView) => void;
  subscribers?: SubscriberContact[];
  segments?: AudienceSegment[];
  initialTab?: MarketingTab;
  onSaveCampaign?: (campaign: Campaign) => void;
  folders?: UserFolder[];
  savedEmails?: UserSavedEmail[];
  onSelectTemplateUsage?: (template: EmailTemplate) => void;
}

export const MarketingHub: React.FC<MarketingHubProps> = ({
  campaigns: initialCampaigns,
  templates,
  onOpenTemplateEditor,
  onNavigate,
  subscribers: propSubscribers,
  segments: propSegments,
  initialTab = 'campaigns',
  onSaveCampaign,
  folders: propFolders,
  savedEmails: propSavedEmails,
  onSelectTemplateUsage
}) => {
  // Navigation & View Tabs
  const [activeTab, setActiveTab] = useState<MarketingTab>(initialTab);

  // Local state for campaigns, subscribers, segments, folders
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(initialCampaigns);
  const [subscribersList, setSubscribersList] = useState<SubscriberContact[]>(propSubscribers || INITIAL_SUBSCRIBERS);
  const [segmentsList, setSegmentsList] = useState<AudienceSegment[]>(propSegments || INITIAL_SEGMENTS);
  const [foldersList, setFoldersList] = useState<UserFolder[]>(propFolders || INITIAL_FOLDERS);
  const [savedEmailsList, setSavedEmailsList] = useState<UserSavedEmail[]>(propSavedEmails || INITIAL_SAVED_EMAILS);

  // Campaign Filters & Search
  const [campaignFilter, setCampaignFilter] = useState<'All' | 'Sent' | 'Scheduled' | 'Draft'>('All');
  const [campaignSearch, setCampaignSearch] = useState('');
  
  // Template Gallery Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateViewMode, setTemplateViewMode] = useState<'grid' | 'spacious'>('grid');

  // Audience & Contacts Filters
  const [audienceFilter, setAudienceFilter] = useState<'All' | 'Active' | 'VIP' | 'Unsubscribed'>('All');
  const [audienceSearch, setAudienceSearch] = useState('');

  // Segment Search
  const [segmentSearch, setSegmentSearch] = useState('');

  // Modals State
  const [selectedDetailTemplate, setSelectedDetailTemplate] = useState<EmailTemplate | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [selectedAnalyticsCampaign, setSelectedAnalyticsCampaign] = useState<Campaign | null>(null);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [showCreateSegmentModal, setShowCreateSegmentModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // New Campaign Form State
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignSubject, setNewCampaignSubject] = useState('');
  const [newCampaignAudience, setNewCampaignAudience] = useState(segmentsList[0]?.name || 'US VIP Customers & Active Subscribers');
  const [selectedTemplateForCampaign, setSelectedTemplateForCampaign] = useState<string>('tmpl-multi-service-sale');

  // New Subscriber Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubStatus, setNewSubStatus] = useState<'Active' | 'VIP'>('Active');
  const [newSubTags, setNewSubTags] = useState('Newsletter Reader, Website');

  // New Segment Form State
  const [newSegName, setNewSegName] = useState('');
  const [newSegDescription, setNewSegDescription] = useState('');
  const [newSegRule, setNewSegRule] = useState('Total spend > $500');
  const [newSegColor, setNewSegColor] = useState('#38d9a9');

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  // Filtered Campaigns
  const filteredCampaigns = campaignsList.filter(c => {
    const matchesStatus = campaignFilter === 'All' || c.status === campaignFilter;
    const matchesSearch = campaignSearch === '' || 
      c.title.toLowerCase().includes(campaignSearch.toLowerCase()) || 
      c.subject.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      c.audience.toLowerCase().includes(campaignSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Templates
  const categories = [
    'All', 
    'Editorial', 
    'Product Launch', 
    'E-commerce', 
    'VIP Rewards', 
    'Newsletter', 
    'Welcome Flow'
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = templateSearch === '' || 
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
      t.headline.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(templateSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Subscribers
  const filteredSubscribers = subscribersList.filter(s => {
    const matchesStatus = audienceFilter === 'All' || s.status === audienceFilter;
    const matchesSearch = audienceSearch === '' || 
      s.name.toLowerCase().includes(audienceSearch.toLowerCase()) || 
      s.email.toLowerCase().includes(audienceSearch.toLowerCase()) ||
      s.tags.some(tag => tag.toLowerCase().includes(audienceSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filtered Segments
  const filteredSegments = segmentsList.filter(seg => {
    return segmentSearch === '' || 
      seg.name.toLowerCase().includes(segmentSearch.toLowerCase()) ||
      seg.description.toLowerCase().includes(segmentSearch.toLowerCase());
  });

  // Palette color background resolver
  const getPalettePreview = (themeName?: string) => {
    switch (themeName) {
      case 'sunflower': return { outer: '#FBF5DF', card: '#2B3324', text: '#FDFBF7', btn: '#E8D284' };
      case 'lavender': return { outer: '#EDE9FE', card: '#2A3042', text: '#FFFFFF', btn: '#FFFFFF' };
      case 'olive': return { outer: '#E8EDE0', card: '#1E2C1E', text: '#FAF8F5', btn: '#C5D8B8' };
      case 'terracotta': return { outer: '#F7EFE6', card: '#6B4C28', text: '#FFF8F0', btn: '#F5E6D3' };
      case 'obsidian': return { outer: '#090D14', card: '#131926', text: '#FFFFFF', btn: '#6366F1' };
      case 'sand':
      default: return { outer: '#FAF8F5', card: '#FFFFFF', text: '#1C1917', btn: '#1C1917' };
    }
  };

  const getFontFamilyClass = (font: EmailTemplate['fontFamily']) => {
    switch (font) {
      case 'display-slab': return 'font-serif font-bold';
      case 'serif': return 'font-serif';
      case 'script-hand': return 'font-serif italic';
      case 'sans':
      default: return 'font-sans font-extrabold';
    }
  };

  // Handlers
  const handleCreateNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignTitle.trim()) return;

    const matchedTemplate = templates.find(t => t.id === selectedTemplateForCampaign) || templates[0];
    
    const newCamp: Campaign = {
      id: 'cmp-' + Date.now(),
      title: newCampaignTitle,
      subject: newCampaignSubject || `${newCampaignTitle} — Special Edition`,
      status: 'Draft',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      date: 'Draft created just now',
      audience: newCampaignAudience,
      templateId: matchedTemplate.id
    };

    setCampaignsList(prev => [newCamp, ...prev]);
    if (onSaveCampaign) onSaveCampaign(newCamp);

    setShowNewCampaignModal(false);
    showToast(`Draft created: "${newCamp.title}". Launching visual editor...`);
    
    // Launch editor with selected template & title
    setTimeout(() => {
      onOpenTemplateEditor({
        ...matchedTemplate,
        id: 'tmpl-custom-' + Date.now(),
        name: newCampaignTitle,
        subject: newCamp.subject
      });
    }, 600);
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const duplicated: Campaign = {
      ...campaign,
      id: 'cmp-dup-' + Date.now(),
      title: `${campaign.title} (Copy)`,
      status: 'Draft',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      date: 'Draft duplicated just now'
    };
    setCampaignsList(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${campaign.title}" to draft.`);
  };

  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;

    const newSub: SubscriberContact = {
      id: 'sub-' + Date.now(),
      name: newSubName.trim() || newSubEmail.split('@')[0],
      email: newSubEmail.trim(),
      status: newSubStatus,
      tags: newSubTags.split(',').map(t => t.trim()).filter(Boolean),
      openRate: 0,
      clickRate: 0,
      ordersCount: 0,
      totalSpent: '$0.00',
      joinedAt: 'Just now',
      lastActive: 'Just now',
      source: 'Manual Dashboard Entry'
    };

    setSubscribersList(prev => [newSub, ...prev]);
    setShowAddSubscriberModal(false);
    setNewSubName('');
    setNewSubEmail('');
    showToast(`Added contact: ${newSub.email}`);
  };

  const handleCreateSegmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegName.trim()) return;

    const newSeg: AudienceSegment = {
      id: 'seg-' + Date.now(),
      name: newSegName,
      description: newSegDescription || 'Custom dynamically filtered subscriber segment',
      filterRules: [newSegRule],
      subscriberCount: Math.floor(12000 + Math.random() * 45000),
      averageOpenRate: 58.4,
      growthRate: '+14.2% this month',
      color: newSegColor,
      isDynamic: true,
      createdAt: 'Today'
    };

    setSegmentsList(prev => [newSeg, ...prev]);
    setShowCreateSegmentModal(false);
    setNewSegName('');
    setNewSegDescription('');
    showToast(`Created segment: "${newSeg.name}"`);
  };

  const handleCreateFolder = (name: string, description?: string) => {
    const newFld: UserFolder = {
      id: 'fld-' + Date.now(),
      name,
      description: description || '',
      color: '#38d9a9',
      createdAt: 'Just now'
    };
    setFoldersList(prev => [...prev, newFld]);
    showToast(`Created folder: "${name}"`);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFoldersList(prev => prev.filter(f => f.id !== folderId));
    setSavedEmailsList(prev => prev.map(e => e.folderId === folderId ? { ...e, folderId: undefined } : e));
    showToast('Folder deleted');
  };

  const handleMoveToFolder = (emailId: string, folderId: string) => {
    setSavedEmailsList(prev => prev.map(e => e.id === emailId ? { ...e, folderId: folderId === 'none' ? undefined : folderId } : e));
    showToast('Email moved to folder');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans">
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{notificationToast}</span>
        </div>
      )}

      {/* 1. Top Header & Workspace Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Campaigns
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Broadcaster Active
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Track broadcast performance, manage saved email folders, and draft high-converting email campaigns.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          <button
            id="header-blank-canvas-btn"
            onClick={() => onOpenTemplateEditor({
              id: 'tmpl-blank-' + Date.now(),
              name: 'Minimal Blank Canvas',
              category: 'Editorial',
              thumbnailColor: '#FAF8F5',
              subject: 'Your Subject Line Here',
              preheader: 'A brief summary of your email content.',
              headline: 'BESPOKE STORY',
              body: 'Type your message with clean typography and generous whitespace.',
              accentColor: '#1C1917',
              fontFamily: 'serif',
              fontSize: 42,
              textAlign: 'center',
              ctaText: 'EXPLORE COLLECTION',
              ctaUrl: 'https://sendline.io',
              buttonShape: 'pill',
              paletteTheme: 'sand',
              frameShape: 'rounded'
            })}
            className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Blank Canvas</span>
          </button>

          <button
            id="header-draft-campaign-btn"
            onClick={() => setShowNewCampaignModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Draft Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Nav Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto text-left">
        <button
          id="tab-btn-campaigns"
          onClick={() => setActiveTab('campaigns')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'campaigns'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Campaigns ({campaignsList.length})</span>
        </button>

        <button
          id="tab-btn-saved-emails"
          onClick={() => setActiveTab('saved-emails')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'saved-emails'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Saved Folders & Emails ({savedEmailsList.length})</span>
        </button>

        <button
          id="tab-btn-templates"
          onClick={() => setActiveTab('templates')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'templates'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Templates ({templates.length})</span>
        </button>

        <button
          id="tab-btn-audience"
          onClick={() => setActiveTab('audience')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audience'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Audience ({subscribersList.length})</span>
        </button>

        <button
          id="tab-btn-segments"
          onClick={() => setActiveTab('segments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'segments'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Segments ({segmentsList.length})</span>
        </button>
      </div>

      {/* 3. MAIN BODY VIEW */}
      <div className="space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: CAMPAIGNS & PERFORMANCE                                           */}
        {/* ========================================================================= */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            
            {/* KPI METRICS BANNER */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
              
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Total Dispatched</span>
                  <span className="p-1 rounded-md bg-stone-50 text-stone-600">
                    <Send className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-1 py-1">
                  <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
                    469,100
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>99.8% Deliverability</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Avg. Open Rate</span>
                  <span className="p-1 rounded-md bg-stone-50 text-stone-600">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-1 py-1">
                  <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
                    58.5%
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>+4.2% vs average</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Avg. Click Rate</span>
                  <span className="p-1 rounded-md bg-stone-50 text-stone-600">
                    <MousePointerClick className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-1 py-1">
                  <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
                    21.4%
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-stone-500 text-xs font-normal pt-1 border-t border-stone-100">
                  <span>Top quartile ratio</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Attributed Revenue</span>
                  <span className="p-1 rounded-md bg-stone-50 text-stone-600">
                    <DollarSign className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-1 py-1">
                  <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
                    $61,050
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
                  <span>Across 3 broadcasts</span>
                </div>
              </div>

            </div>

            {/* CONTROLS BAR: STATUS FILTER, SEARCH, DRAFT BUTTON */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Sent', 'Scheduled', 'Draft'] as const).map((status) => {
                  const count = status === 'All' ? campaignsList.length : campaignsList.filter(c => c.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setCampaignFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        campaignFilter === status
                          ? 'bg-stone-950 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                      }`}
                    >
                      <span>{status}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        campaignFilter === status ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar & Quick Action */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 w-44 sm:w-60 font-sans"
                  />
                </div>

                <button
                  onClick={() => setShowNewCampaignModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-950 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Draft</span>
                </button>
              </div>

            </div>

            {/* CAMPAIGN PERFORMANCE TABLE */}
            <div className="rounded-2xl bg-white border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Campaign & Subject</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Audience Segment</th>
                      <th className="py-3 px-3 text-right">Dispatched</th>
                      <th className="py-3 px-3 text-right">Open Rate</th>
                      <th className="py-3 px-3 text-right">Click Rate</th>
                      <th className="py-3 px-3 text-right">Revenue</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-stone-50/80 transition-colors group">
                        
                        {/* Title & Subject */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-950 text-sm group-hover:text-stone-700 transition-colors">
                            {camp.title}
                          </div>
                          <div className="text-stone-500 text-xs line-clamp-1 mt-0.5">
                            {camp.subject}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {camp.date}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            camp.status === 'Sent' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            camp.status === 'Scheduled' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-stone-100 text-stone-700 border-stone-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              camp.status === 'Sent' ? 'bg-emerald-500' :
                              camp.status === 'Scheduled' ? 'bg-blue-500' :
                              'bg-stone-400'
                            }`} />
                            {camp.status}
                          </span>
                        </td>

                        {/* Audience */}
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200/60 max-w-[200px] truncate">
                            <Users className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{camp.audience}</span>
                          </span>
                        </td>

                        {/* Sent Volume */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {camp.status === 'Sent' ? (
                            <span className="font-bold text-stone-900">{camp.sentCount.toLocaleString()}</span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        {/* Open Rate */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {camp.status === 'Sent' ? (
                            <div>
                              <span className="font-bold text-emerald-700">{camp.openRate}%</span>
                              <div className="w-16 h-1 bg-stone-100 rounded-full ml-auto mt-1 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(camp.openRate, 100)}%` }} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        {/* Click Rate */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {camp.status === 'Sent' ? (
                            <div>
                              <span className="font-bold text-blue-700">{camp.clickRate}%</span>
                              <div className="w-16 h-1 bg-stone-100 rounded-full ml-auto mt-1 overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(camp.clickRate * 2, 100)}%` }} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        {/* Revenue */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          {camp.revenueGenerated ? (
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              {camp.revenueGenerated}
                            </span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Performance Insights */}
                            {camp.status === 'Sent' && (
                              <button
                                onClick={() => setSelectedAnalyticsCampaign(camp)}
                                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                title="View Performance Insights"
                              >
                                <BarChart3 className="w-3.5 h-3.5 text-stone-600" />
                                <span>Insights</span>
                              </button>
                            )}

                            {/* Edit / Duplicate */}
                            <button
                              onClick={() => {
                                const tmpl = templates.find(t => t.id === camp.templateId) || templates[0];
                                onOpenTemplateEditor({
                                  ...tmpl,
                                  name: camp.title,
                                  subject: camp.subject
                                });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                              title="Edit in Studio"
                            >
                              {camp.status === 'Draft' ? 'Edit Draft' : 'Open in Studio'}
                            </button>

                            <button
                              onClick={() => handleDuplicateCampaign(camp)}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Duplicate Campaign"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCampaigns.length === 0 && (
                <div className="p-12 text-center space-y-3">
                  <Mail className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700">No campaigns found</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Try adjusting your search query or status filter to see other campaigns.
                  </p>
                  <button
                    onClick={() => { setCampaignFilter('All'); setCampaignSearch(''); }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SAVED FOLDERS & EMAILS                                            */}
        {/* ========================================================================= */}
        {activeTab === 'saved-emails' && (
          <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-xs text-left">
            <MyTemplatesFolderView
              folders={foldersList}
              savedEmails={savedEmailsList}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onMoveToFolder={handleMoveToFolder}
              onCustomizeEmail={onOpenTemplateEditor}
              onNewEmail={() => onOpenTemplateEditor()}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TEMPLATES & DESIGN STUDIO                                         */}
        {/* ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            
            {/* Gallery Top Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const count = cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? 'bg-stone-950 text-white shadow-2xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Grid View Switcher */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search templates & styles..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 w-48 sm:w-60 font-sans"
                  />
                </div>

                <div className="flex items-center bg-white rounded-xl p-0.5 border border-stone-200">
                  <button
                    onClick={() => setTemplateViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      templateViewMode === 'grid' ? 'bg-stone-950 text-white' : 'text-stone-500 hover:text-stone-950'
                    }`}
                    title="Grid View (3 Columns)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTemplateViewMode('spacious')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      templateViewMode === 'spacious' ? 'bg-stone-950 text-white' : 'text-stone-500 hover:text-stone-950'
                    }`}
                    title="Spacious View (2 Columns)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* TEMPLATE CARDS GRID */}
            <div className={`grid gap-6 ${
              templateViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              
              {/* Card 0: Blank Canvas Creator */}
              <div 
                onClick={() => onOpenTemplateEditor({
                  id: 'tmpl-blank-' + Date.now(),
                  name: 'Minimal Blank Canvas',
                  category: 'Editorial',
                  thumbnailColor: '#FAF8F5',
                  subject: 'Your Subject Line Here',
                  preheader: 'A brief summary of your email content.',
                  headline: 'MINIMAL STORY',
                  body: 'Start typing your bespoke story here. Clean typography and generous margins will elevate your message naturally.',
                  accentColor: '#1C1917',
                  fontFamily: 'serif',
                  fontSize: 42,
                  textAlign: 'center',
                  ctaText: 'EXPLORE COLLECTION',
                  ctaUrl: 'https://sendline.io',
                  buttonShape: 'pill',
                  paletteTheme: 'sand',
                  frameShape: 'rounded',
                  monogram: 'SL',
                  scriptOverlay: 'Sendline Editorial',
                  sections: [
                    {
                      id: 'sec-logo-top',
                      type: 'logo',
                      monogramText: 'SL',
                      logoSubtitle: 'Sendline Editorial'
                    },
                    {
                      id: 'sec-headline-main',
                      type: 'text',
                      title: 'MINIMAL STORY',
                      subtitle: 'Sendline Editorial',
                      textAlign: 'center',
                      fontSize: 38
                    },
                    {
                      id: 'sec-body-main',
                      type: 'text',
                      body: 'Start typing your bespoke story here. Clean typography and generous margins will elevate your message naturally.',
                      textAlign: 'center'
                    },
                    {
                      id: 'sec-btn-main',
                      type: 'button',
                      ctaText: 'EXPLORE COLLECTION',
                      ctaUrl: 'https://sendline.io',
                      buttonShape: 'pill'
                    },
                    {
                      id: 'sec-footer-main',
                      type: 'footer',
                      footerNote: 'Delivered with care via Sendline High-Deliverability Network.'
                    }
                  ]
                })}
                className="rounded-3xl bg-white border-2 border-dashed border-stone-300 hover:border-stone-950 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[340px] cursor-pointer group transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-stone-950 group-hover:text-white flex items-center justify-center text-stone-700 transition-all shadow-xs">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="font-bold text-stone-950 text-base">Start from Blank Canvas</div>
                <p className="text-xs text-stone-500 max-w-xs">
                  Create a custom editorial layout from scratch with our drag & drop builder and fluid shape frames.
                </p>
                <span className="px-3.5 py-1.5 rounded-xl bg-stone-100 group-hover:bg-stone-950 group-hover:text-white text-stone-800 text-xs font-bold transition-colors">
                  Open Blank Studio →
                </span>
              </div>

              {filteredTemplates.map((template) => {
                const pal = getPalettePreview(template.paletteTheme);
                return (
                  <div
                    key={template.id}
                    className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-stone-400 transition-all flex flex-col justify-between group"
                  >
                    {/* Visual Card Live Mini-Canvas */}
                    <div 
                      style={{ backgroundColor: pal.outer }}
                      className="p-5 relative overflow-hidden min-h-[220px] flex flex-col justify-between transition-colors border-b border-stone-200/80"
                    >
                      {/* Top Header Pills */}
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-950 text-white">
                          {template.category}
                        </span>
                        {template.badgeText && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 text-stone-900 shadow-2xs">
                            {template.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Inner Card Shape Preview */}
                      <div 
                        style={{ backgroundColor: pal.card, color: pal.text }}
                        className={`p-4 my-3 text-center shadow-xs transition-all ${
                          template.frameShape === 'arch' ? 'rounded-t-[40px] rounded-b-xl' :
                          template.frameShape === 'scalloped' ? 'rounded-2xl border-2 border-stone-200' :
                          template.frameShape === 'square' ? 'rounded-none' : 'rounded-2xl'
                        }`}
                      >
                        {template.monogram && (
                          <div className="w-6 h-6 rounded-full border border-current mx-auto mb-1 flex items-center justify-center text-[9px] font-bold">
                            {template.monogram}
                          </div>
                        )}
                        {template.scriptOverlay && (
                          <div className="font-serif italic text-xs opacity-75 mb-0.5">
                            {template.scriptOverlay}
                          </div>
                        )}
                        <h3 className={`text-base leading-tight tracking-tight uppercase line-clamp-2 ${getFontFamilyClass(template.fontFamily)}`}>
                          {template.headline}
                        </h3>
                      </div>

                      {/* Quick Action Overlay on Hover */}
                      <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-xs z-20">
                        <button
                          onClick={() => setSelectedDetailTemplate(template)}
                          className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => {
                            if (onSelectTemplateUsage) {
                              onSelectTemplateUsage(template);
                            } else {
                              onOpenTemplateEditor(template);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white text-stone-950 hover:bg-stone-100 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Customize</span>
                        </button>
                      </div>

                      {/* Bottom Palette Swatch */}
                      <div className="flex items-center justify-between text-[11px] relative z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: pal.outer }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: pal.card }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: pal.btn }} />
                        </div>
                        <span className="text-[10px] font-bold text-stone-700 capitalize">
                          {template.paletteTheme}
                        </span>
                      </div>

                    </div>

                    {/* Card Footer Details */}
                    <div 
                      onClick={() => setSelectedDetailTemplate(template)}
                      className="p-5 space-y-3 bg-white cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-bold text-stone-950 group-hover:text-stone-700 transition-colors">
                          {template.name}
                        </div>
                        <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {template.description || template.subject}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <span className="text-stone-500">
                          Style: <strong className="text-stone-800 capitalize font-semibold">{template.fontFamily}</strong>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailTemplate(template);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-950 hover:text-white text-stone-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUDIENCE & CONTACTS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'audience' && (
          <div className="space-y-6">
            
            {/* Audience Top KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span>Total Subscribers</span>
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div className="text-2xl font-black text-stone-950 mt-2">
                  469,100
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1.5">
                  +14,200 net new this month
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span>Active & Engaged</span>
                  <Zap className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div className="text-2xl font-black text-stone-950 mt-2">
                  94.2%
                </div>
                <div className="text-[11px] font-semibold text-stone-500 mt-1.5">
                  Opened in last 60 days
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span>VIP High-Spenders</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-stone-950 mt-2">
                  18,500
                </div>
                <div className="text-[11px] font-semibold text-amber-700 mt-1.5">
                  Average LTV $1,240
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span>Unsubscribe Rate</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-950 mt-2">
                  0.02%
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1.5">
                  Well below 0.1% threshold
                </div>
              </div>

            </div>

            {/* Audience Controls Bar */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['All', 'Active', 'VIP', 'Unsubscribed'] as const).map((status) => {
                  const count = status === 'All' ? subscribersList.length : subscribersList.filter(s => s.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setAudienceFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        audienceFilter === status
                          ? 'bg-stone-950 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                      }`}
                    >
                      <span>{status}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        audienceFilter === status ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, or tag..."
                    value={audienceSearch}
                    onChange={(e) => setAudienceSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 w-48 sm:w-60 font-sans"
                  />
                </div>

                <button
                  onClick={() => showToast('Exporting contacts to CSV...')}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  title="Export Contacts CSV"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowAddSubscriberModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-950 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>

            </div>

            {/* SUBSCRIBERS TABLE */}
            <div className="rounded-2xl bg-white border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Tags</th>
                      <th className="py-3 px-3 text-right">Open Rate</th>
                      <th className="py-3 px-3 text-right">Orders</th>
                      <th className="py-3 px-3 text-right">Total Spent</th>
                      <th className="py-3 px-3">Last Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                        
                        {/* Contact Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {sub.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-stone-950 text-xs sm:text-sm">{sub.name}</div>
                              <div className="text-stone-500 text-xs font-normal">{sub.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            sub.status === 'VIP' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            sub.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            'bg-stone-100 text-stone-600 border-stone-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              sub.status === 'VIP' ? 'bg-amber-500' :
                              sub.status === 'Active' ? 'bg-emerald-500' :
                              'bg-stone-400'
                            }`} />
                            {sub.status}
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap items-center gap-1 max-w-xs">
                            {sub.tags.map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200/60 whitespace-nowrap">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Open Rate */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <span className="font-bold text-emerald-700">{sub.openRate}%</span>
                        </td>

                        {/* Orders */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap font-bold text-stone-800">
                          {sub.ordersCount}
                        </td>

                        {/* Total Spent */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap font-bold text-stone-950">
                          {sub.totalSpent}
                        </td>

                        {/* Last Active */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-stone-500 text-[11px]">
                          {sub.lastActive}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              showToast(`Targeting ${sub.email} in direct campaign...`);
                              setShowNewCampaignModal(true);
                              setNewCampaignTitle(`VIP Message to ${sub.name}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-950 hover:text-white text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Send Email
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SEGMENTS & SMART LISTS                                            */}
        {/* ========================================================================= */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div>
                <h2 className="text-base font-extrabold text-stone-950">Dynamic Subscriber Segments</h2>
                <p className="text-xs text-stone-500">Auto-updating smart lists powered by live engagement and customer purchase behavior</p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search segments..."
                    value={segmentSearch}
                    onChange={(e) => setSegmentSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 w-44 sm:w-60 font-sans"
                  />
                </div>

                <button
                  onClick={() => setShowCreateSegmentModal(true)}
                  className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Segment</span>
                </button>
              </div>
            </div>

            {/* Segments Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSegments.map((seg) => (
                <div 
                  key={seg.id}
                  className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  
                  <div className="space-y-3">
                    {/* Header: Name and color badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: seg.color }} />
                        <h3 className="font-extrabold text-stone-950 text-sm sm:text-base leading-snug group-hover:text-stone-700 transition-colors">
                          {seg.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                        Smart List
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {seg.description}
                    </p>

                    {/* Filter Rules Pills */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Active Filter Rules
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {seg.filterRules.map((rule, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-50 text-stone-700 border border-stone-200/70">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Action Dock */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Subscribers</div>
                        <div className="text-base font-black text-stone-950">{seg.subscriberCount.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-stone-400 uppercase">Avg. Open Rate</div>
                        <div className="text-base font-black text-emerald-700">{seg.averageOpenRate}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setNewCampaignAudience(seg.name);
                          setNewCampaignTitle(`${seg.name} Exclusive`);
                          setShowNewCampaignModal(true);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Target in Campaign</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: DRAFT NEW CAMPAIGN                                                 */}
      {/* ========================================================================= */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-950 text-base">Draft New Campaign</h3>
                  <p className="text-xs text-stone-500">Configure target audience and start editing in Studio</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewCampaignModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCampaign} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Campaign Title (Internal)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Editorial Lookbook & Private VIP Sale"
                  value={newCampaignTitle}
                  onChange={(e) => setNewCampaignTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Email Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. 25% Off Everything — Private Studio Access"
                  value={newCampaignSubject}
                  onChange={(e) => setNewCampaignSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Target Audience Segment</label>
                <select
                  value={newCampaignAudience}
                  onChange={(e) => setNewCampaignAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs cursor-pointer"
                >
                  {segmentsList.map(seg => (
                    <option key={seg.id} value={seg.name}>
                      {seg.name} ({seg.subscriberCount.toLocaleString()} contacts)
                    </option>
                  ))}
                  <option value="All Verified Subscribers">All Verified Subscribers (469,100 contacts)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Starting Template Layout</label>
                <select
                  value={selectedTemplateForCampaign}
                  onChange={(e) => setSelectedTemplateForCampaign(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs cursor-pointer"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category} · {t.fontFamily})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch in Studio</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CAMPAIGN PERFORMANCE INSIGHTS                                      */}
      {/* ========================================================================= */}
      {selectedAnalyticsCampaign && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Campaign Report</span>
                <h3 className="font-extrabold text-stone-950 text-base">{selectedAnalyticsCampaign.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedAnalyticsCampaign(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Delivered</div>
                  <div className="text-lg font-black text-stone-950 mt-1">{selectedAnalyticsCampaign.sentCount.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">99.8% Success</div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Open Rate</div>
                  <div className="text-lg font-black text-emerald-700 mt-1">{selectedAnalyticsCampaign.openRate}%</div>
                  <div className="text-[10px] text-stone-500">Unique Opens</div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Click-Through</div>
                  <div className="text-lg font-black text-blue-700 mt-1">{selectedAnalyticsCampaign.clickRate}%</div>
                  <div className="text-[10px] text-stone-500">CTA Engagement</div>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Revenue</div>
                  <div className="text-lg font-black text-amber-700 mt-1">{selectedAnalyticsCampaign.revenueGenerated || '$0.00'}</div>
                  <div className="text-[10px] text-stone-500">Attributed</div>
                </div>
              </div>

              {/* 24-Hour Velocity Curve Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>24-Hour Open Velocity</span>
                  <span className="text-stone-400 text-[11px] font-normal">Peak at Hour 3 (EST)</span>
                </div>
                <div className="h-28 rounded-2xl bg-stone-50 border border-stone-200 p-3 flex items-end justify-between gap-1">
                  {[22, 45, 88, 100, 75, 58, 42, 30, 24, 18, 14, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1, 1].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div 
                        className="w-full bg-stone-900 group-hover:bg-emerald-500 rounded-t-sm transition-all" 
                        style={{ height: `${val}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>0h (Send)</span>
                  <span>6h</span>
                  <span>12h</span>
                  <span>18h</span>
                  <span>24h</span>
                </div>
              </div>

              {/* Client & Device Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div className="space-y-2">
                  <div className="font-bold text-stone-800 text-xs">Device Distribution</div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-stone-600">Mobile (Apple Mail / iOS)</span>
                        <span className="font-bold text-stone-950">64%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-950 rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-stone-600">Desktop Webmail (Gmail / Chrome)</span>
                        <span className="font-bold text-stone-950">36%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-stone-600 rounded-full" style={{ width: '36%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-stone-800 text-xs">Top Clicked Links</div>
                  <div className="space-y-1 text-[11px] text-stone-600">
                    <div className="flex items-center justify-between py-1 border-b border-stone-100">
                      <span className="truncate max-w-[180px]">Primary Hero CTA Button</span>
                      <strong className="text-stone-950">72% clicks</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-stone-100">
                      <span className="truncate max-w-[180px]">Product Gallery Grid</span>
                      <strong className="text-stone-950">19% clicks</strong>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="truncate max-w-[180px]">Footer Store Link</span>
                      <strong className="text-stone-950">9% clicks</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Audience: {selectedAnalyticsCampaign.audience}</span>
              <button
                onClick={() => setSelectedAnalyticsCampaign(null)}
                className="px-4 py-2 rounded-xl bg-stone-950 text-white font-bold text-xs cursor-pointer"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SUBSCRIBER                                                     */}
      {/* ========================================================================= */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-950 text-base">Add New Contact</h3>
                  <p className="text-xs text-stone-500">Enroll subscriber into your audience list</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddSubscriberModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriberSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  placeholder="Sophia Bennett"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={newSubStatus}
                    onChange={(e) => setNewSubStatus(e.target.value as 'Active' | 'VIP')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="VIP">VIP Patron</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Opt-In Source</label>
                  <input
                    type="text"
                    disabled
                    value="Dashboard Entry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-semibold text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Tags (Comma-Separated)</label>
                <input
                  type="text"
                  placeholder="VIP, Wholesale, Fashion DTC"
                  value={newSubTags}
                  onChange={(e) => setNewSubTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Contact</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE SMART SEGMENT                                               */}
      {/* ========================================================================= */}
      {showCreateSegmentModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-950 text-base">Create Smart Segment</h3>
                  <p className="text-xs text-stone-500">Define dynamic filtering rules for your campaigns</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateSegmentModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSegmentSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Segment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Repeat Buyers ($500+)"
                  value={newSegName}
                  onChange={(e) => setNewSegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe who this segment is targeting..."
                  value={newSegDescription}
                  onChange={(e) => setNewSegDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Rule Condition</label>
                <select
                  value={newSegRule}
                  onChange={(e) => setNewSegRule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-950 font-semibold focus:outline-none focus:border-stone-950 text-xs cursor-pointer"
                >
                  <option value="Total spend > $500">Lifetime spend &gt; $500</option>
                  <option value="Open rate > 50%">Email open rate &gt; 50%</option>
                  <option value="Orders count >= 3">Completed orders &gt;= 3</option>
                  <option value="Joined in last 30 days">Joined in last 30 days</option>
                  <option value="Inactive > 60 days">Inactive &gt; 60 days</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Badge Accent Color</label>
                <div className="flex items-center gap-2">
                  {['#38d9a9', '#60a5fa', '#f59e0b', '#ec4899', '#a78bfa', '#94a3b8'].map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setNewSegColor(clr)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        newSegColor === clr ? 'border-stone-950 scale-110 shadow-2xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: clr }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateSegmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Create Segment</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FLODESK-STYLE TEMPLATE DETAIL & PALETTE INSPECTOR                  */}
      {/* ========================================================================= */}
      {selectedDetailTemplate && (
        <TemplateDetailModal
          template={selectedDetailTemplate}
          onClose={() => setSelectedDetailTemplate(null)}
          onCustomize={(tmpl) => {
            setSelectedDetailTemplate(null);
            if (onSelectTemplateUsage) {
              onSelectTemplateUsage(tmpl);
            } else {
              onOpenTemplateEditor(tmpl);
            }
          }}
        />
      )}

    </div>
  );
};
