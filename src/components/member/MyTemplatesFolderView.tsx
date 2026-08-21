import React, { useState } from 'react';
import { UserFolder, UserSavedEmail } from '../../types/member';
import { EmailTemplate } from '../../types';
import { 
  Folder, 
  FolderPlus, 
  Plus, 
  Sparkles, 
  Search, 
  Clock, 
  Trash2, 
  Edit3, 
  Copy, 
  Send, 
  MoreVertical, 
  ChevronRight, 
  Check, 
  X,
  FileText,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { TemplateDetailModal } from '../marketing/TemplateDetailModal';

interface MyTemplatesFolderViewProps {
  folders?: UserFolder[];
  savedEmails?: UserSavedEmail[];
  onCreateFolder: (name: string, description?: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveToFolder: (emailId: string, folderId: string) => void;
  onCustomizeEmail: (template: EmailTemplate) => void;
  onNewEmail: () => void;
}

export const MyTemplatesFolderView: React.FC<MyTemplatesFolderViewProps> = ({
  folders = [],
  savedEmails = [],
  onCreateFolder,
  onDeleteFolder,
  onMoveToFolder,
  onCustomizeEmail,
  onNewEmail
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedDetailTemplate, setSelectedDetailTemplate] = useState<EmailTemplate | null>(null);
  const [moveDropdownEmailId, setMoveDropdownEmailId] = useState<string | null>(null);

  const filteredEmails = (savedEmails || []).filter(email => {
    const matchesFolder = selectedFolderId === 'all' || email.folderId === selectedFolderId;
    const matchesSearch = searchQuery === '' || 
      email.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.templateSnapshot?.headline && email.templateSnapshot.headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (email.templateSnapshot?.description && email.templateSnapshot.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const activeFolder = (folders || []).find(f => f.id === selectedFolderId);

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const convertToEmailTemplate = (saved: UserSavedEmail): EmailTemplate => {
    if (saved.templateSnapshot) {
      return {
        ...saved.templateSnapshot,
        name: saved.title || saved.templateSnapshot.name
      };
    }
    return {
      id: saved.id,
      name: saved.title,
      category: 'Editorial',
      thumbnailColor: '#FAF8F5',
      subject: saved.title,
      preheader: saved.title,
      headline: saved.title,
      body: 'Crafted with Sendline Email Studio.',
      accentColor: '#1C1917',
      ctaUrl: 'https://sendline.io',
      badgeText: saved.status.toUpperCase(),
      description: 'Customized email design',
      scriptOverlay: 'Curated Edition',
      ctaText: 'View Details',
      paletteTheme: 'sand',
      fontFamily: 'serif',
      frameShape: 'rounded',
      notes: `Saved in folder: ${(folders || []).find(f => f.id === saved.folderId)?.name || 'General'}`
    };
  };

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

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans text-stone-900">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              My Folders & Saved Emails
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
              {savedEmails.length} Saved Templates
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            All templates you drafted, customized, or created are organized into folders. Click any template to inspect details or customize in studio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="create-new-folder-btn"
            onClick={() => setShowNewFolderModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          <button
            id="new-email-template-btn"
            onClick={onNewEmail}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-stone-300" />
            <span>New Email</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Structure: Folder Pills/List + Emails Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FOLDER NAVIGATION SIDEBAR */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2">
            Folders
          </div>

          <div className="space-y-1">
            {/* All Emails Filter */}
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedFolderId === 'all'
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>All Templates & Drafts</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                selectedFolderId === 'all' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {savedEmails.length}
              </span>
            </button>

            {/* Custom Folders */}
            {folders.map((f) => {
              const count = savedEmails.filter(e => e.folderId === f.id).length;
              const isSelected = selectedFolderId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder className="w-4 h-4 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {count}
                    </span>
                    {f.id !== 'fld-drafts' && f.id !== 'fld-spring' && folders.length > 2 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFolder(f.id);
                          if (selectedFolderId === f.id) setSelectedFolderId('all');
                        }}
                        className="p-1 hover:text-rose-400 text-stone-400"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT EMAILS LIST / GRID */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved templates, headlines, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-950 shadow-xs"
              />
            </div>

            <div className="text-xs text-stone-500 font-semibold">
              Showing {filteredEmails.length} {filteredEmails.length === 1 ? 'template' : 'templates'} in <strong className="text-stone-900">{activeFolder ? activeFolder.name : 'All Folders'}</strong>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmails.map((email) => {
              const templateObj = convertToEmailTemplate(email);
              const pal = getPalettePreview(templateObj.paletteTheme);
              const folderName = (folders || []).find(f => f.id === email.folderId)?.name || 'General';

              return (
                <div
                  key={email.id}
                  className="rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  {/* Top Preview Banner */}
                  <div
                    style={{ backgroundColor: pal.outer }}
                    onClick={() => setSelectedDetailTemplate(templateObj)}
                    className="p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between h-48 border-b border-stone-200/80"
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-xs">
                        {folderName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        email.status === 'Sent' ? 'bg-emerald-100 text-emerald-800' :
                        email.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' : 'bg-stone-200 text-stone-800'
                      }`}>
                        {email.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Miniature Card */}
                    <div
                      style={{ backgroundColor: pal.card, color: pal.text }}
                      className={`p-3 text-center shadow-md my-auto ${
                        templateObj.frameShape === 'arch' ? 'rounded-t-2xl rounded-b-lg' : 'rounded-xl'
                      }`}
                    >
                      <div className="text-[10px] font-serif italic opacity-75">Curated Edition</div>
                      <div className="text-xs font-bold uppercase tracking-tight line-clamp-1">{templateObj.headline}</div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono relative z-10">
                      <span>{email.lastEditedText}</span>
                      <span className="capitalize font-semibold">{templateObj.paletteTheme}</span>
                    </div>
                  </div>

                  {/* Body & Actions */}
                  <div className="p-4 space-y-3 bg-white">
                    <div>
                      <div 
                        onClick={() => setSelectedDetailTemplate(templateObj)}
                        className="text-sm font-bold text-stone-950 group-hover:text-pink-600 transition-colors cursor-pointer"
                      >
                        {email.title}
                      </div>
                      <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {templateObj.description || email.audienceLabel || 'Curated template draft'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      {/* Move to folder dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setMoveDropdownEmailId(moveDropdownEmailId === email.id ? null : email.id)}
                          className="text-[11px] font-semibold text-stone-600 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
                        >
                          <Folder className="w-3 h-3" />
                          <span>Move</span>
                        </button>

                        {moveDropdownEmailId === email.id && (
                          <div className="absolute left-0 bottom-full mb-1 w-44 rounded-xl bg-white border border-stone-200 shadow-xl py-1 z-30 text-xs">
                            <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase">Move to folder</div>
                            {folders.map(f => (
                              <button
                                key={f.id}
                                onClick={() => {
                                  onMoveToFolder(email.id, f.id);
                                  setMoveDropdownEmailId(null);
                                }}
                                className="w-full px-2.5 py-1.5 text-left font-medium hover:bg-stone-100 text-stone-800 flex items-center justify-between"
                              >
                                <span>{f.name}</span>
                                {email.folderId === f.id && <Check className="w-3 h-3 text-emerald-600" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Customize Button */}
                      <button
                        onClick={() => setSelectedDetailTemplate(templateObj)}
                        className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredEmails.length === 0 && (
            <div className="p-12 rounded-3xl bg-[#FAF8F5] border border-stone-200 text-center space-y-4">
              <Folder className="w-10 h-10 text-stone-400 mx-auto" />
              <div className="text-sm font-bold text-stone-900">No saved templates in this folder</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Customize any template from the template studio or start a new email to save drafts here automatically.
              </p>
              <button
                onClick={onNewEmail}
                className="px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
              >
                Create Email
              </button>
            </div>
          )}

        </div>

      </div>

      {/* CREATE NEW FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-stone-950" />
                <h3 className="text-base font-bold text-stone-950">Create New Folder</h3>
              </div>
              <button onClick={() => setShowNewFolderModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Folder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Autumn Capsule 2026, VIP Club"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-950 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE DETAIL MODAL */}
      {selectedDetailTemplate && (
        <TemplateDetailModal
          template={selectedDetailTemplate}
          onClose={() => setSelectedDetailTemplate(null)}
          onCustomize={(tmpl) => {
            setSelectedDetailTemplate(null);
            onCustomizeEmail(tmpl);
          }}
        />
      )}

    </div>
  );
};
