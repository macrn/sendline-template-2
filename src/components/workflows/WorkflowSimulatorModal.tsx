import React, { useState } from 'react';
import { WorkflowItem, WorkflowNode } from '../../types';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Zap, 
  GitFork, 
  Gift, 
  Tag, 
  X, 
  Sparkles, 
  ArrowRight,
  User,
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';

interface WorkflowSimulatorModalProps {
  workflow: WorkflowItem;
  isOpen: boolean;
  onClose: () => void;
  onHighlightNode?: (nodeId: string | null) => void;
}

interface SimulationStepLog {
  nodeId: string;
  nodeType: string;
  title: string;
  timestamp: string;
  status: 'completed' | 'waiting' | 'branch_yes' | 'branch_no' | 'action_fired';
  details: string;
  emailPreview?: {
    subject: string;
    sender: string;
    preview: string;
  };
}

export const WorkflowSimulatorModal: React.FC<WorkflowSimulatorModalProps> = ({
  workflow,
  isOpen,
  onClose,
  onHighlightNode
}) => {
  // Test contact state
  const [testContact, setTestContact] = useState({
    name: 'Camille Dupont',
    email: 'camille.dupont@atelier-paris.com',
    segment: 'New Leads 2026',
    loyaltyPoints: 350
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [simulationLogs, setSimulationLogs] = useState<SimulationStepLog[]>([]);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'decision_needed' | 'finished'>('idle');
  const [pendingConditionNode, setPendingConditionNode] = useState<WorkflowNode | null>(null);

  if (!isOpen) return null;

  // Flatten nodes for simulation execution
  const startSimulation = () => {
    const trigger = workflow.rootTriggerNode;
    const initialLog: SimulationStepLog = {
      nodeId: trigger.id,
      nodeType: 'trigger',
      title: trigger.title,
      timestamp: 'Just now (00:00)',
      status: 'completed',
      details: `Trigger Event Fired: ${trigger.triggerConfig?.targetName || 'Form / Checkout trigger'} for ${testContact.email}`
    };

    setSimulationLogs([initialLog]);
    setCurrentStepIndex(1);
    setSimulationState('running');
    if (onHighlightNode) onHighlightNode(trigger.id);

    // Process next immediate nodes
    setTimeout(() => {
      processNextNodes(trigger.nextNodes || [], [initialLog]);
    }, 600);
  };

  const processNextNodes = (nodes: WorkflowNode[], currentLogs: SimulationStepLog[]) => {
    if (!nodes || nodes.length === 0) {
      setSimulationState('finished');
      if (onHighlightNode) onHighlightNode(null);
      return;
    }

    const nextNode = nodes[0];
    if (onHighlightNode) onHighlightNode(nextNode.id);

    if (nextNode.type === 'action') {
      const actionLog: SimulationStepLog = {
        nodeId: nextNode.id,
        nodeType: 'action',
        title: nextNode.title,
        timestamp: '+0s after trigger',
        status: 'action_fired',
        details: `Action Executed: ${nextNode.actionConfig?.segmentName ? `Assigned segment "${nextNode.actionConfig.segmentName}"` : nextNode.actionConfig?.pointsValue ? `Awarded +${nextNode.actionConfig.pointsValue} Loyalty Points` : 'Profile updated'}`
      };
      const updatedLogs = [...currentLogs, actionLog];
      setSimulationLogs(updatedLogs);

      setTimeout(() => {
        processNextNodes(nextNode.nextNodes || [], updatedLogs);
      }, 700);
    } 
    else if (nextNode.type === 'email') {
      const emailLog: SimulationStepLog = {
        nodeId: nextNode.id,
        nodeType: 'email',
        title: nextNode.title,
        timestamp: '+1s (Instant Delivery)',
        status: 'completed',
        details: `Sent visual email to ${testContact.email}`,
        emailPreview: {
          subject: nextNode.emailConfig?.subject || 'Welcome Email',
          sender: nextNode.emailConfig?.senderName || 'Sendline Studio',
          preview: nextNode.emailConfig?.previewText || 'Here is your link...'
        }
      };
      const updatedLogs = [...currentLogs, emailLog];
      setSimulationLogs(updatedLogs);

      setTimeout(() => {
        processNextNodes(nextNode.nextNodes || [], updatedLogs);
      }, 800);
    }
    else if (nextNode.type === 'delay') {
      const delayLog: SimulationStepLog = {
        nodeId: nextNode.id,
        nodeType: 'delay',
        title: nextNode.title,
        timestamp: `+${nextNode.delayConfig?.value ?? 2} ${nextNode.delayConfig?.unit ?? 'days'} Simulated Wait`,
        status: 'waiting',
        details: `Paused subscriber for ${nextNode.delayConfig?.value ?? 2} ${nextNode.delayConfig?.unit ?? 'days'} (Simulated virtual time skip).`
      };
      const updatedLogs = [...currentLogs, delayLog];
      setSimulationLogs(updatedLogs);

      setTimeout(() => {
        processNextNodes(nextNode.nextNodes || [], updatedLogs);
      }, 900);
    }
    else if (nextNode.type === 'condition') {
      // Condition requires branch decision from user
      setPendingConditionNode(nextNode);
      setSimulationState('decision_needed');
      const conditionLog: SimulationStepLog = {
        nodeId: nextNode.id,
        nodeType: 'condition',
        title: nextNode.title,
        timestamp: 'Waiting for recipient behavior',
        status: 'waiting',
        details: `Condition Check: ${nextNode.conditionConfig?.conditionType === 'opened_email' ? 'Did contact open the previous email?' : 'Did contact click the link?'}`
      };
      setSimulationLogs([...currentLogs, conditionLog]);
    }
  };

  const handleBranchDecision = (branchChoice: 'yes' | 'no') => {
    if (!pendingConditionNode) return;

    const chosenBranch = branchChoice === 'yes' ? pendingConditionNode.yesBranch : pendingConditionNode.noBranch;
    const branchLog: SimulationStepLog = {
      nodeId: pendingConditionNode.id,
      nodeType: 'condition',
      title: branchChoice === 'yes' ? 'Decision: YES (Recipient Engaged)' : 'Decision: NO (No Action Taken)',
      timestamp: 'Decision Evaluated',
      status: branchChoice === 'yes' ? 'branch_yes' : 'branch_no',
      details: branchChoice === 'yes' 
        ? `Contact opened email within timeframe $\\rightarrow$ Routing to YES pathway.`
        : `Contact did not open $\\rightarrow$ Routing to NO fallback pathway.`
    };

    const updatedLogs = [...simulationLogs, branchLog];
    setSimulationLogs(updatedLogs);
    setSimulationState('running');
    setPendingConditionNode(null);

    setTimeout(() => {
      processNextNodes(chosenBranch || [], updatedLogs);
    }, 700);
  };

  const resetSimulation = () => {
    setSimulationLogs([]);
    setCurrentStepIndex(0);
    setSimulationState('idle');
    setPendingConditionNode(null);
    if (onHighlightNode) onHighlightNode(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center shadow-xs">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-stone-950 tracking-tight">
                  Workflow Live Simulator
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 uppercase">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Test contact journeys, conditional branches, and automated actions in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onHighlightNode) onHighlightNode(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* Test Contact Profile Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-sm">
                CD
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                  <span>{testContact.name}</span>
                  <span className="text-[10px] font-normal px-2 py-0.2 rounded bg-stone-200 text-stone-700">
                    {testContact.segment}
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  {testContact.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {simulationState === 'idle' ? (
                <button
                  onClick={startSimulation}
                  className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Test Run</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Branch Decision Alert */}
          {simulationState === 'decision_needed' && (
            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-300 animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <GitFork className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                  Simulation Decision Required
                </h4>
              </div>
              <p className="text-xs text-purple-900 font-medium mb-3">
                The subscriber has reached condition node <strong className="font-black">"{pendingConditionNode?.title}"</strong>. Which contact behavior would you like to simulate?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleBranchDecision('yes')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simulate: Opened / Clicked (YES Path)</span>
                </button>
                <button
                  onClick={() => handleBranchDecision('no')}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Simulate: No Interaction (NO Path)</span>
                </button>
              </div>
            </div>
          )}

          {/* Execution Timeline Logs */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
              Execution Timeline & Activity Logs ({simulationLogs.length} Events)
            </h4>

            {simulationLogs.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-stone-200 text-center text-stone-400 space-y-2">
                <Zap className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-bold text-stone-600">No active simulation running</p>
                <p className="text-[11px] text-stone-400">Click "Start Test Run" above to watch your workflow fire step-by-step.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {simulationLogs.map((log, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-2xl border transition-all text-xs ${
                      log.status === 'branch_yes'
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : log.status === 'branch_no'
                        ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                        : log.status === 'action_fired'
                        ? 'bg-purple-50/70 border-purple-300 text-purple-950'
                        : 'bg-white border-stone-200 text-stone-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {log.nodeType === 'trigger' && <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                        {log.nodeType === 'email' && <Mail className="w-3.5 h-3.5 text-indigo-600" />}
                        {log.nodeType === 'delay' && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                        {log.nodeType === 'condition' && <GitFork className="w-3.5 h-3.5 text-purple-600" />}
                        {log.nodeType === 'action' && <Gift className="w-3.5 h-3.5 text-emerald-600" />}
                        <span className="font-extrabold text-stone-900">{log.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">{log.timestamp}</span>
                    </div>

                    <p className="text-stone-600 text-[11px] mb-1 font-medium">
                      {log.details}
                    </p>

                    {log.emailPreview && (
                      <div className="mt-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] space-y-0.5">
                        <div className="font-bold text-stone-900">
                          Subject: {log.emailPreview.subject}
                        </div>
                        <div className="text-stone-500">
                          From: {log.emailPreview.sender}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {simulationState === 'finished' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-black">Simulation Completed Successfully!</div>
                  <div className="text-emerald-800 text-[11px]">
                    All emails delivered, delays calculated, and actions persisted for {testContact.email}.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Status: <strong className="text-stone-900 font-bold capitalize">{simulationState}</strong>
          </span>
          <button
            onClick={() => {
              if (onHighlightNode) onHighlightNode(null);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
          >
            Done Testing
          </button>
        </div>
      </div>
    </div>
  );
};
