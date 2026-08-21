import React, { useState } from 'react';
import { UniversalTemplate, BrandKit, WorkflowSimulationStep, WorkflowEnrollment } from './unifiedTypes';
import { DEFAULT_WORKFLOW_STEPS } from './unifiedData';
import { 
  Zap, 
  Mail, 
  Clock, 
  GitBranch, 
  CheckCircle, 
  Check, 
  Play, 
  FastForward, 
  RotateCcw, 
  Eye, 
  Terminal, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';

interface UnifiedFormWorkflowSimulatorProps {
  template: UniversalTemplate;
  brandKit: BrandKit;
}

export const UnifiedFormWorkflowSimulator: React.FC<UnifiedFormWorkflowSimulatorProps> = ({
  template,
  brandKit
}) => {
  const [emailInput, setEmailInput] = useState('mehmet@sendline.io');
  const [logs, setLogs] = useState<string[]>([
    'Waiting for a submission...'
  ]);
  const [activeStepId, setActiveStepId] = useState<string>('wf-step-delay');
  const [simulatedBranch, setSimulatedBranch] = useState<'yes' | 'no' | null>(null);
  const [previewEmailStep, setPreviewEmailStep] = useState<WorkflowSimulationStep | null>(null);
  const [enrollments, setEnrollments] = useState<WorkflowEnrollment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Form Submission Simulator matching SL7
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSubmitting(true);
    const newEnrollmentId = `enr-${Date.now().toString().slice(-4)}`;
    
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      setActiveStepId('wf-step-delay');
      setSimulatedBranch(null);

      const timestamp = new Date().toLocaleTimeString();
      const newLogs = [
        `[${timestamp}] ⚡ Event received: Form submitted by ${emailInput}`,
        `[${timestamp}] 📝 Enrolled into "Spring Launch Sequence" (Enrollment ID: #${newEnrollmentId})`,
        `[${timestamp}] ✉️ Step 1 Executed: "Welcome Email" dispatched (200 OK via SES/Resend)`,
        `[${timestamp}] ⏱️ Step 2 Active: Setting wake_at = +48h (Worker in sleep cycle)`
      ];
      setLogs(newLogs);

      setEnrollments(prev => [
        {
          id: newEnrollmentId,
          subscriberEmail: emailInput,
          currentStepId: 'wf-step-delay',
          enrolledAt: timestamp,
          wakeAt: 'In 2 days',
          status: 'waiting',
          logs: newLogs
        },
        ...prev
      ]);
    }, 600);
  };

  // Fast forward simulation to test conditions
  const handleSimulateFastForward = (opened: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    setSimulatedBranch(opened ? 'yes' : 'no');

    if (opened) {
      setActiveStepId('wf-step-yes-discount');
      setLogs(prev => [
        `[${timestamp}] ⏩ Fast-forward: 48h timer elapsed. Evaluating enrollment conditions...`,
        `[${timestamp}] 🎯 Webhook Event: Subscriber ${emailInput} opened Welcome email!`,
        `[${timestamp}] 🔀 Branching YES: Condition matched -> Routing to "Discount code" step`,
        `[${timestamp}] ✉️ Step 3 Executed: "Discount code" email with code SPRING15 dispatched!`,
        ...prev
      ]);
    } else {
      setActiveStepId('wf-step-no-reminder');
      setLogs(prev => [
        `[${timestamp}] ⏩ Fast-forward: 48h timer elapsed. Evaluating enrollment conditions...`,
        `[${timestamp}] ⚠️ Webhook Event: No open recorded within 48h window.`,
        `[${timestamp}] 🔀 Branching NO: Routing to "Gentle reminder" step`,
        `[${timestamp}] ✉️ Step 3 Executed: "Gentle reminder" email lookbook dispatched.`,
        ...prev
      ]);
    }
  };

  const handleResetSimulation = () => {
    setLogs(['Waiting for a submission...']);
    setActiveStepId('wf-step-trigger');
    setSimulatedBranch(null);
    setHasSubmitted(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-stone-100 p-6 lg:p-12 space-y-12 font-sans antialiased select-none">
      
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section 1: Live Interactive Form Preview (Matches Top Half of SL7) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Form Preview (Hosted Opt-in Runtime)
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Endpoint Ready
            </span>
          </div>

          <div 
            className="rounded-3xl p-8 shadow-2xl border border-stone-800 text-center max-w-lg mx-auto transition-all"
            style={{
              backgroundColor: brandKit.canvasBackgroundColor,
              color: brandKit.textColor
            }}
          >
            {/* Circle Logo Badge */}
            <div className="w-12 h-12 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-blue-200 font-bold text-sm mx-auto mb-5 shadow-sm">
              {brandKit.logoText || 'SL'}
            </div>

            {/* Title & Subtext */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {template.name === 'Spring launch' ? 'The spring collection is here' : template.name}
              </h2>
              <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                Join the list and be first to see every new piece.
              </p>
            </div>

            {/* Form Input Field + Subscribe Button */}
            <form onSubmit={handleFormSubmit} className="space-y-3 max-w-xs mx-auto text-left">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1E242C] border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-200 text-stone-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            {hasSubmitted && (
              <div className="mt-4 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold animate-in fade-in">
                ✓ Enrollment webhook triggered in real time!
              </div>
            )}
          </div>
        </div>

        {/* Section 2: "Behind the scenes" Engine Simulation (Matches Lower Half of SL7) */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Behind the scenes</span>
              </h3>
              <p className="text-xs text-stone-400">
                Live worker state, delay evaluation, and branching decisions per subscriber.
              </p>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateFastForward(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Simulate subscriber opening welcome email within 48h"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Test Branch: Opened (Yes)</span>
              </button>

              <button
                onClick={() => handleSimulateFastForward(false)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 border border-amber-600/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Simulate subscriber not opening email within 48h"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Test Branch: Not Opened (No)</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
                title="Reset simulation state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Terminal Log Stream */}
          <div className="p-4 rounded-2xl bg-[#080B0F] border border-stone-800 font-mono text-xs space-y-1.5 overflow-x-auto max-h-44">
            <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1">
              Event Stream Output
            </div>
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`${
                  log.includes('⚡') 
                    ? 'text-yellow-400 font-bold' 
                    : log.includes('✉️') 
                      ? 'text-blue-300' 
                      : log.includes('🔀') 
                        ? 'text-emerald-300 font-bold' 
                        : log.includes('⚠️')
                          ? 'text-amber-300'
                          : 'text-stone-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Visual Workflow Steps (Matches SL7 Architecture Timeline) */}
          <div className="space-y-3 pt-2">
            
            {/* Step 1: Trigger */}
            <div className="p-4 rounded-2xl bg-[#161B22] border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-yellow-950/60 border border-yellow-600/60 flex items-center justify-center text-yellow-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Spring launch form submitted
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Triggers automation on opt-in API call
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                Triggered
              </span>
            </div>

            {/* Step 2: Email (Welcome) */}
            <div className="p-4 rounded-2xl bg-[#161B22] border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-950/60 border border-blue-600/60 flex items-center justify-center text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Email • sends immediately
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Welcome • Uses Spring launch template
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setPreviewEmailStep(DEFAULT_WORKFLOW_STEPS[1])}
                className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Preview Email</span>
              </button>
            </div>

            {/* Step 3: Delay (Wait 2 days) */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              activeStepId === 'wf-step-delay' 
                ? 'bg-[#1C232E] border-blue-500/80 shadow-md ring-1 ring-blue-500/30' 
                : 'bg-[#161B22] border-stone-800'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-600/60 flex items-center justify-center text-purple-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Wait 2 days
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Worker sets wake_at = +48h before condition check
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60">
                {activeStepId === 'wf-step-delay' ? 'Active Timer' : 'Elapsed'}
              </span>
            </div>

            {/* Step 4: Condition Branch */}
            <div className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Opened the welcome email?
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Evaluates email webhook open event before progressing
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Branches: YES vs NO (Matches SL7) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* YES Branch: Discount Code */}
                <div className={`p-4 rounded-xl border transition-all ${
                  simulatedBranch === 'yes'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-[#12161E] border-stone-800/80 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                      YES Branch
                    </span>
                    <button
                      onClick={() => setPreviewEmailStep(DEFAULT_WORKFLOW_STEPS[4])}
                      className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>Preview</span>
                    </button>
                  </div>
                  <div className="text-xs font-bold text-stone-100">
                    Email: Discount code (15% OFF)
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Uses Spring launch template with coupon code block
                  </div>
                </div>

                {/* NO Branch: Gentle Reminder */}
                <div className={`p-4 rounded-xl border transition-all ${
                  simulatedBranch === 'no'
                    ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-[#12161E] border-stone-800/80 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                      NO Branch
                    </span>
                    <button
                      onClick={() => setPreviewEmailStep(DEFAULT_WORKFLOW_STEPS[5])}
                      className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Preview</span>
                    </button>
                  </div>
                  <div className="text-xs font-bold text-stone-100">
                    Email: Gentle reminder
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Uses Spring launch template with lookbook highlight
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Rendered Step Email Inspection Modal */}
      {previewEmailStep && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase text-blue-400">Workflow Email Step</span>
                <h4 className="font-serif font-bold text-white text-base">{previewEmailStep.title}</h4>
              </div>
              <button
                onClick={() => setPreviewEmailStep(null)}
                className="text-stone-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md bg-stone-800"
              >
                Close
              </button>
            </div>

            <div 
              className="p-6 rounded-2xl border border-stone-800 space-y-4 text-center"
              style={{
                backgroundColor: brandKit.canvasBackgroundColor,
                color: brandKit.textColor
              }}
            >
              <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-500/50 flex items-center justify-center text-blue-200 font-bold text-xs mx-auto">
                {brandKit.logoText || 'SL'}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">{previewEmailStep.emailSubject}</div>
                <div className="text-xs text-stone-400">{previewEmailStep.emailPreviewText}</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-xs text-stone-300">
                {previewEmailStep.id === 'wf-step-yes-discount' 
                  ? '🏷️ Voucher Activated: Use code SPRING15 for 15% off at checkout' 
                  : '📖 Lookbook Link: Explore the Spring Lookbook Edition'}
              </div>

              <div className="text-[10px] text-stone-500 pt-3 border-t border-stone-800">
                Unsubscribe • Preferences • Studio Lane, Köln
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
