import React, { useState } from 'react';
import { 
  EmailTemplate, 
  FormItem, 
  WorkflowItem, 
  WorkflowNode, 
  AppView 
} from '../../types';
import { INITIAL_TEMPLATES } from '../../data/mockData';
import { PREBUILT_FORM_TEMPLATES as FORM_TEMPLATES, FormTemplatePreset } from '../../data/formTemplates';
import { INITIAL_WORKFLOWS } from '../../data/workflowData';
import { 
  Layers, 
  Mail, 
  FileText, 
  GitFork, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Check, 
  Plus, 
  Edit3, 
  Eye, 
  Filter,
  Palette,
  ExternalLink,
  ChevronRight,
  Folder
} from 'lucide-react';

export type StudioUsageTarget = 'campaign' | 'workflow' | 'form' | 'library';

interface TemplateUsageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate | null;
  formTemplate?: FormTemplatePreset | null;
  workflows?: WorkflowItem[];
  forms?: FormItem[];
  onSelectUsage: (
    target: StudioUsageTarget, 
    payload?: { 
      template?: EmailTemplate; 
      workflowId?: string; 
      workflowStepId?: string; 
      formId?: string;
      formTemplate?: FormTemplatePreset;
    }
  ) => void;
}

export const TemplateUsageSelectorModal: React.FC<TemplateUsageSelectorModalProps> = ({
  isOpen,
  onClose,
  template,
  formTemplate,
  workflows = INITIAL_WORKFLOWS,
  forms = [],
  onSelectUsage
}) => {
  const [selectedTarget, setSelectedTarget] = useState<StudioUsageTarget>('campaign');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [selectedWorkflowStepId, setSelectedWorkflowStepId] = useState<string>('');
  const [selectedFormId, setSelectedFormId] = useState<string>(forms[0]?.id || '');

  if (!isOpen) return null;

  const currentWf = workflows.find(w => w.id === selectedWorkflowId);
  
  // Extract email steps from selected workflow
  const getWorkflowEmailSteps = (root?: WorkflowNode): WorkflowNode[] => {
    if (!root) return [];
    const steps: WorkflowNode[] = [];
    const traverse = (node: WorkflowNode) => {
      if (node.type === 'email') steps.push(node);
      if (node.nextNodes) node.nextNodes.forEach(traverse);
      if (node.yesBranch) node.yesBranch.forEach(traverse);
      if (node.noBranch) node.noBranch.forEach(traverse);
    };
    traverse(root);
    return steps;
  };

  const emailSteps = currentWf ? getWorkflowEmailSteps(currentWf.rootTriggerNode) : [];

  const handleConfirm = () => {
    onSelectUsage(selectedTarget, {
      template: template || undefined,
      formTemplate: formTemplate || undefined,
      workflowId: selectedTarget === 'workflow' ? selectedWorkflowId : undefined,
      workflowStepId: selectedTarget === 'workflow' ? (selectedWorkflowStepId || emailSteps[0]?.id) : undefined,
      formId: selectedTarget === 'form' ? selectedFormId : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            <span>Design Engine • Usage Router</span>
          </div>
          <h2 className="text-xl font-black text-stone-950 tracking-tight">
            How would you like to use this design?
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Apply <strong className="text-stone-900">{template?.name || formTemplate?.title || 'this design'}</strong> directly to your active campaign broadcast, an automated workflow step, or an opt-in form.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Target Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Campaign */}
            <button
              type="button"
              onClick={() => setSelectedTarget('campaign')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedTarget === 'campaign'
                  ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                  selectedTarget === 'campaign' ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-900'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm tracking-tight">Email Campaign</div>
                <div className={`text-[11px] mt-1 leading-snug ${
                  selectedTarget === 'campaign' ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  One-time broadcast blast to subscriber segment
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold">
                <span>Select & Edit</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* 2. Automated Workflow Step */}
            <button
              type="button"
              onClick={() => setSelectedTarget('workflow')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedTarget === 'workflow'
                  ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                  selectedTarget === 'workflow' ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-900'
                }`}>
                  <GitFork className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm tracking-tight">Workflow Step</div>
                <div className={`text-[11px] mt-1 leading-snug ${
                  selectedTarget === 'workflow' ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  Automated drip trigger (welcome, recovery, delivery)
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold">
                <span>Configure Step</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            {/* 3. Form / Interactive */}
            <button
              type="button"
              onClick={() => setSelectedTarget('form')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedTarget === 'form'
                  ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                  selectedTarget === 'form' ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-900'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-sm tracking-tight">Opt-in / Form</div>
                <div className={`text-[11px] mt-1 leading-snug ${
                  selectedTarget === 'form' ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  Interactive data capture, waitlists, surveys
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold">
                <span>Open Form Hub</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>

          {/* Conditional Sub-selectors */}
          {selectedTarget === 'workflow' && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 animate-in fade-in duration-150">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-stone-700" />
                <span>Target Automation Workflow & Step</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Select Workflow</label>
                  <select
                    value={selectedWorkflowId}
                    onChange={(e) => {
                      setSelectedWorkflowId(e.target.value);
                      setSelectedWorkflowStepId('');
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none"
                  >
                    {workflows.map(w => (
                      <option key={w.id} value={w.id}>{w.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Select Email Step</label>
                  <select
                    value={selectedWorkflowStepId || (emailSteps[0]?.id || '')}
                    onChange={(e) => setSelectedWorkflowStepId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-900 focus:outline-none"
                  >
                    {emailSteps.length > 0 ? (
                      emailSteps.map(step => (
                        <option key={step.id} value={step.id}>{step.title}</option>
                      ))
                    ) : (
                      <option value="">No email steps in this flow</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedTarget === 'form' && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3 animate-in fade-in duration-150">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-700" />
                <span>Form Target</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Forms contain interactive data fields (text, email, dropdowns, surveys). Choosing this will launch the interactive Form Studio or integrate with your lead capture flows.
              </p>
            </div>
          )}

          {selectedTarget === 'campaign' && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1 animate-in fade-in duration-150">
              <div className="text-xs font-bold text-stone-900">Direct Campaign Customizer</div>
              <p className="text-xs text-stone-600">
                Launch directly into the visual email designer loaded with this template, configure subject and recipients, and schedule your send.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Proceed with Selection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
