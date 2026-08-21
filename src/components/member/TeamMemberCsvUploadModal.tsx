import React, { useState, useRef } from 'react';
import { TeamMember, AccessProfile, DomainMailbox, WorkspaceModuleId } from '../../types/member';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Users, 
  Trash2, 
  Sparkles,
  ArrowRight,
  Shield,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  Calendar
} from 'lucide-react';

interface ParsedMemberRow {
  id: string;
  name: string;
  email: string;
  title: string;
  dob: string;
  location: string;
  phone: string;
  profileName: string;
  mailboxEmail: string;
  isValid: boolean;
  validationError?: string;
}

interface TeamMemberCsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: AccessProfile[];
  mailboxes: DomainMailbox[];
  existingTeam: TeamMember[];
  onImportMembers: (members: Omit<TeamMember, 'id' | 'joinedAt'>[]) => void;
}

export const TeamMemberCsvUploadModal: React.FC<TeamMemberCsvUploadModalProps> = ({
  isOpen,
  onClose,
  profiles,
  mailboxes,
  existingTeam,
  onImportMembers
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedMemberRow[]>([]);
  const [defaultProfileId, setDefaultProfileId] = useState<string>(profiles[0]?.id || 'prof-support');
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Sample CSV Template Generator
  const handleDownloadSampleCsv = () => {
    const csvHeader = 'Full Name,Current Email,Job Title,Date of Birth,Location,Phone Number,Access Profile,Assigned Domain Mailbox\n';
    const sampleRows = [
      'Julian Vance,julian.vance@company.com,Senior Campaign Strategist,1992-06-14,"Paris, France",+33 1 42 68 55 10,Campaign & Content Strategist,sales@atelier-paris.com\n',
      'Maya Lin,maya.lin@growthagency.io,Customer Concierge Specialist,1995-11-03,"San Francisco, CA, USA",+1 415 555 0188,Customer Concierge & Screener,support@atelier-paris.com\n',
      'Liam Thorne,liam.t@cloudsystems.net,Transactional API Engineer,1990-03-22,"London, United Kingdom",+44 20 7946 0933,Transactional API & Systems Engineer,\n',
      'Chloe Dubois,chloe.dubois@atelier.fr,Compliance & Privacy Auditor,1994-08-30,"Lyon, France",+33 4 72 00 11 22,Legal, Privacy & Compliance Auditor,\n'
    ].join('');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sendline-team-members-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Parsing function
  const parseCSVContent = (text: string) => {
    setParseError(null);
    try {
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) {
        setParseError('The file is empty or missing data rows.');
        return;
      }

      // Helper to parse CSV row handling quotes
      const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if ((char === ',' || char === ';' || char === '\t') && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
      };

      const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
      
      const findColIdx = (aliases: string[]) => {
        return headers.findIndex(h => aliases.some(alias => h.includes(alias)));
      };

      const nameIdx = findColIdx(['name', 'fullname', 'membername', 'employee']);
      const emailIdx = findColIdx(['email', 'currentemail', 'loginemail', 'personalemail', 'mail']);
      const titleIdx = findColIdx(['title', 'jobtitle', 'position', 'role']);
      const dobIdx = findColIdx(['dob', 'birth', 'dateofbirth', 'birthday']);
      const locIdx = findColIdx(['location', 'city', 'country', 'address', 'region']);
      const phoneIdx = findColIdx(['phone', 'mobile', 'tel', 'cell', 'number']);
      const profileIdx = findColIdx(['profile', 'accessprofile', 'access', 'permission']);
      const mailboxIdx = findColIdx(['mailbox', 'domainmailbox', 'assignedmailbox', 'inbox']);

      if (emailIdx === -1) {
        setParseError('Could not locate an "Email" or "Current Email" column in the header row.');
        return;
      }

      const rows: ParsedMemberRow[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length === 0 || cols.every(c => c === '')) continue;

        const email = (cols[emailIdx] || '').trim();
        const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx].trim() : (email ? email.split('@')[0] : `Member ${i}`);
        const title = titleIdx !== -1 && cols[titleIdx] ? cols[titleIdx].trim() : 'Team Member';
        const dob = dobIdx !== -1 && cols[dobIdx] ? cols[dobIdx].trim() : '';
        const location = locIdx !== -1 && cols[locIdx] ? cols[locIdx].trim() : 'Remote';
        const phone = phoneIdx !== -1 && cols[phoneIdx] ? cols[phoneIdx].trim() : '';
        const profileName = profileIdx !== -1 && cols[profileIdx] ? cols[profileIdx].trim() : '';
        const mailboxEmail = mailboxIdx !== -1 && cols[mailboxIdx] ? cols[mailboxIdx].trim() : '';

        const isValidEmail = emailRegex.test(email);
        const isDuplicate = existingTeam.some(m => m.email.toLowerCase() === email.toLowerCase()) || 
                            rows.some(r => r.email.toLowerCase() === email.toLowerCase());

        let isValid = isValidEmail && !isDuplicate;
        let validationError: string | undefined;

        if (!email) {
          isValid = false;
          validationError = 'Missing email address';
        } else if (!isValidEmail) {
          isValid = false;
          validationError = 'Invalid email syntax';
        } else if (isDuplicate) {
          isValid = false;
          validationError = 'Email already exists in team';
        }

        rows.push({
          id: `parsed-${i}-${Date.now()}`,
          name,
          email,
          title,
          dob,
          location,
          phone,
          profileName,
          mailboxEmail,
          isValid,
          validationError
        });
      }

      setParsedRows(rows);
    } catch (err: any) {
      setParseError('Failed to parse the file: ' + (err?.message || 'Check CSV format'));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) parseCSVContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) parseCSVContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveRow = (id: string) => {
    setParsedRows(prev => prev.filter(r => r.id !== id));
  };

  const handleExecuteImport = () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);

    const defaultProfile = profiles.find(p => p.id === defaultProfileId) || profiles[0];

    const newMembersToImport: Omit<TeamMember, 'id' | 'joinedAt'>[] = validRows.map(row => {
      // Find matching profile by name or fall back to default
      const matchedProfile = profiles.find(p => 
        p.name.toLowerCase() === row.profileName.toLowerCase() ||
        p.id.toLowerCase() === row.profileName.toLowerCase()
      ) || defaultProfile;

      // Find matching mailbox
      const matchedMbx = mailboxes.find(m => 
        m.email.toLowerCase() === row.mailboxEmail.toLowerCase()
      );

      const generatedToken = 'inv_' + Math.random().toString(36).substring(2, 9);

      return {
        name: row.name,
        email: row.email,
        title: row.title,
        dob: row.dob || undefined,
        location: row.location || 'Remote',
        phone: row.phone || undefined,
        role: matchedProfile?.name === 'Executive & Workspace Admin' ? 'Admin' : 'Editor',
        profileId: matchedProfile ? matchedProfile.id : defaultProfile?.id,
        profileName: matchedProfile ? matchedProfile.name : defaultProfile?.name,
        status: 'Invited',
        assignedMailboxId: matchedMbx ? matchedMbx.id : undefined,
        assignedMailboxEmail: matchedMbx ? matchedMbx.email : undefined,
        allowedModules: matchedProfile ? matchedProfile.allowedModules : ['inbox'],
        inviteToken: generatedToken,
        inviteSentAt: 'Just now',
        notes: `Imported via CSV (${fileName || 'batch upload'})`
      };
    });

    setTimeout(() => {
      onImportMembers(newMembersToImport);
      setIsImporting(false);
      setImportSuccessCount(newMembersToImport.length);
      setTimeout(() => {
        onClose();
        setImportSuccessCount(null);
        setParsedRows([]);
        setFileName(null);
      }, 1400);
    }, 600);
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-stone-950 tracking-tight">
                Import Team Members via CSV / Excel
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bulk upload colleagues with personal email, job title, date of birth, location, phone, and access profiles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {importSuccessCount !== null ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-extrabold text-emerald-950">
                Successfully Imported {importSuccessCount} Team Members!
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                All team members have been provisioned with their assigned Access Profiles and personalized invite tokens.
              </p>
            </div>
          ) : (
            <>
              {/* Top Action / Download Template Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-stone-700" />
                    <span>Need the standard CSV format?</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Download our ready-to-fill template containing columns for Name, Email, Title, DOB, Location, Phone & Profiles.
                  </p>
                </div>

                <button
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-900 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-stone-700" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-stone-950 bg-stone-100 scale-[0.99]' 
                    : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-stone-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="text-sm font-bold text-stone-950">
                  {fileName ? `Selected File: ${fileName}` : 'Drop your CSV or Excel file here, or browse'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Supports .csv, .xlsx, .xls (Comma, semicolon, or tab-delimited)
                </p>
              </div>

              {parseError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parsed Rows Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-extrabold text-stone-950">
                        Parsed Members ({parsedRows.length})
                      </h4>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {validCount} Ready to Import
                      </span>
                      {invalidCount > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          {invalidCount} Needs Attention
                        </span>
                      )}
                    </div>

                    {/* Default Profile Assignment */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-stone-500">Fallback Profile:</span>
                      <select
                        value={defaultProfileId}
                        onChange={(e) => setDefaultProfileId(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white cursor-pointer"
                      >
                        {profiles.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
                    <div className="overflow-x-auto max-h-72">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Name & Title</th>
                            <th className="py-2.5 px-3">Personal Email</th>
                            <th className="py-2.5 px-3">DOB & Location</th>
                            <th className="py-2.5 px-3">Phone</th>
                            <th className="py-2.5 px-3">Access Profile</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {parsedRows.map((row) => (
                            <tr key={row.id} className={row.isValid ? 'hover:bg-stone-50/60' : 'bg-rose-50/30'}>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                {row.isValid ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Valid</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700" title={row.validationError}>
                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>{row.validationError || 'Invalid'}</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-stone-900">
                                <div className="font-bold">{row.name}</div>
                                <div className="text-[10px] text-stone-500 flex items-center gap-1">
                                  <Briefcase className="w-2.5 h-2.5" />
                                  <span>{row.title || 'Team Member'}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-stone-700">
                                {row.email}
                              </td>
                              <td className="py-2.5 px-3 text-stone-600">
                                {row.dob && (
                                  <div className="flex items-center gap-1 text-[10px] text-stone-500">
                                    <Calendar className="w-2.5 h-2.5" />
                                    <span>{row.dob}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-stone-400" />
                                  <span>{row.location || 'Remote'}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-stone-600 font-mono text-[11px]">
                                {row.phone ? (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5 text-stone-400" />
                                    <span>{row.phone}</span>
                                  </span>
                                ) : (
                                  <span className="text-stone-300">—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold border border-stone-200">
                                  <Shield className="w-2.5 h-2.5 text-stone-600" />
                                  <span>{row.profileName || profiles.find(p => p.id === defaultProfileId)?.name || 'Default'}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleRemoveRow(row.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
                                  title="Remove from batch"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
            </>
          )}

        </div>

        {/* Modal Footer */}
        {importSuccessCount === null && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={validCount === 0 || isImporting}
              onClick={handleExecuteImport}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                validCount > 0 && !isImporting
                  ? 'bg-stone-950 hover:bg-stone-800 scale-100'
                  : 'bg-stone-300 cursor-not-allowed opacity-60'
              }`}
            >
              {isImporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Importing Batch...</span>
                </>
              ) : (
                <>
                  <span>Import {validCount} Team Members</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
