import React from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Send, 
  Code, 
  Edit3, 
  Save, 
  GitFork, 
  Sparkles, 
  Check, 
  Layers,
  FileText
} from 'lucide-react';

export type WizardStep = 'choose-template' | 'design-email' | 'choose-audience' | 'send';
export type StudioMode = 'campaign' | 'workflow-step' | 'standalone-template' | 'form-step';

interface FlodeskWizardNavProps {
  currentStep: WizardStep;
  onStepChange: (step: WizardStep) => void;
  onClose: () => void;
  onNext?: () => void;
  onSendTest?: () => void;
  onExportCode?: () => void;
  title?: string;
  onTitleChange?: (newTitle: string) => void;
  canContinue?: boolean;
  isSending?: boolean;
  theme?: 'dark' | 'light';
  
  // Dynamic Studio Mode Context
  studioMode?: StudioMode;
  workflowContext?: {
    workflowName: string;
    stepTitle: string;
  };
  onSaveToWorkflow?: () => void;
  onSaveToLibrary?: () => void;
}

export const FlodeskWizardNav: React.FC<FlodeskWizardNavProps> = ({
  currentStep,
  onStepChange,
  onClose,
  onNext,
  onSendTest,
  onExportCode,
  title,
  onTitleChange,
  canContinue = true,
  isSending = false,
  theme = 'dark',
  studioMode = 'campaign',
  workflowContext,
  onSaveToWorkflow,
  onSaveToLibrary
}) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);

  const steps: Array<{ id: WizardStep; label: string }> = [
    { id: 'choose-template', label: 'CHOOSE TEMPLATE' },
    { id: 'design-email', label: 'DESIGN EMAIL' },
    { id: 'choose-audience', label: 'CHOOSE AUDIENCE' },
    { id: 'send', label: 'SEND' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <header className={`h-16 px-4 sm:px-8 border-b flex items-center justify-between shrink-0 z-40 transition-colors select-none ${
      theme === 'light' 
        ? 'bg-white border-stone-200 text-stone-900 shadow-xs' 
        : 'bg-[#0B0F17] border-white/10 text-white'
    }`}>
      
      {/* Left: Back / Exit & Template Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white'
          }`}
          title={studioMode === 'workflow-step' ? 'Back to Workflow Studio' : 'Exit to Workspace'}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">
            {studioMode === 'workflow-step' ? 'Back to Flow' : 'Exit'}
          </span>
        </button>

        {/* Workflow breadcrumb badge if in workflow-step mode */}
        {studioMode === 'workflow-step' && workflowContext && (
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <GitFork className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline font-mono opacity-80">{workflowContext.workflowName} ›</span>
              <span>{workflowContext.stepTitle}</span>
            </div>
          </div>
        )}

        {studioMode !== 'workflow-step' && title !== undefined && currentStep === 'design-email' && (
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 text-xs font-bold text-stone-300 hover:text-white group text-left cursor-pointer"
                title="Click to rename"
              >
                <span className="truncate max-w-[180px]">{title || 'Untitled Campaign'}</span>
                <Edit3 className="w-3 h-3 text-stone-500 group-hover:text-stone-300 shrink-0" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Center: Flodesk Minimalist Breadcrumb Steps OR Workflow Context Notice */}
      {studioMode === 'campaign' ? (
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPassed = idx < currentStepIndex;
            const isAccessible = idx <= currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  disabled={!isAccessible}
                  onClick={() => {
                    if (isAccessible) {
                      onStepChange(step.id);
                    }
                  }}
                  className={`text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] transition-all px-1 py-1 rounded whitespace-nowrap ${
                    isActive
                      ? theme === 'light'
                        ? 'text-stone-950 font-black border-b-2 border-stone-950 cursor-default'
                        : 'text-white font-black border-b-2 border-white cursor-default'
                      : isPassed
                      ? theme === 'light'
                        ? 'text-stone-600 hover:text-stone-900 cursor-pointer'
                        : 'text-stone-400 hover:text-stone-200 cursor-pointer'
                      : 'text-stone-400/40 cursor-not-allowed opacity-50 select-none'
                  }`}
                  title={!isAccessible ? `Complete current step to proceed to ${step.label}` : undefined}
                >
                  {step.label}
                </button>

                {idx < steps.length - 1 && (
                  <span className={`text-[10px] select-none font-normal ${
                    theme === 'light' ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    ›
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      ) : studioMode === 'workflow-step' ? (
        <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Editing Automated Workflow Step Email</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
          <Layers className="w-3.5 h-3.5 text-stone-400" />
          <span>Reusable Master Template Editor</span>
        </div>
      )}

      {/* Right Side Action Controls */}
      <div className="flex items-center gap-2">
        {/* Export HTML code button */}
        {onExportCode && (currentStep === 'design-email' || studioMode === 'workflow-step' || studioMode === 'standalone-template') && (
          <button
            onClick={onExportCode}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Export Clean HTML"
          >
            <Code className="w-4 h-4" />
          </button>
        )}

        {/* Send Test action */}
        {onSendTest && (
          <button
            onClick={onSendTest}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10'
            }`}
            title="Send test email"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Send test</span>
          </button>
        )}

        {/* Workflow Save & Return Button */}
        {studioMode === 'workflow-step' && onSaveToWorkflow && (
          <button
            onClick={onSaveToWorkflow}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save & Return to Flow</span>
          </button>
        )}

        {/* Standalone Library Save */}
        {studioMode === 'standalone-template' && onSaveToLibrary && (
          <button
            onClick={onSaveToLibrary}
            className="px-4 py-2 rounded-xl bg-white text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:bg-stone-200 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Library</span>
          </button>
        )}

        {/* Primary Step Advance Button for Campaign Mode */}
        {studioMode === 'campaign' && currentStep === 'design-email' && onNext && (
          <button
            onClick={onNext}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-stone-950 text-white hover:bg-stone-800'
                : 'bg-white text-stone-950 hover:bg-stone-200'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </header>
  );
};
