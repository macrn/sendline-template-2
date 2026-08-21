import React, { useState } from 'react';
import { 
  WorkflowItem, 
  WorkflowNode, 
  WorkflowNodeType,
  WorkflowTriggerType,
  FormItem,
  CheckoutProduct
} from '../../types';
import { WorkflowNodeCard } from './WorkflowNodeCard';
import { WorkflowSimulatorModal } from './WorkflowSimulatorModal';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Mail, 
  Clock, 
  GitFork, 
  Tag, 
  Gift, 
  Zap, 
  Sliders, 
  FileText, 
  ShoppingBag,
  HelpCircle,
  Plus
} from 'lucide-react';

interface WorkflowStudioProps {
  workflow: WorkflowItem;
  onSave: (updatedWorkflow: WorkflowItem) => void;
  onBack: () => void;
  forms?: FormItem[];
  products?: CheckoutProduct[];
  onOpenEmailStudio?: (emailConfig: any, node?: WorkflowNode, workflow?: WorkflowItem) => void;
}

export const WorkflowStudio: React.FC<WorkflowStudioProps> = ({
  workflow: initialWorkflow,
  onSave,
  onBack,
  forms = [],
  products = [],
  onOpenEmailStudio
}) => {
  const [workflow, setWorkflow] = useState<WorkflowItem>(initialWorkflow);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(workflow.rootTriggerNode);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  
  // Add step modal state
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState<boolean>(false);
  const [addStepTarget, setAddStepTarget] = useState<{ parentId: string; branch?: 'yes' | 'no' } | null>(null);
  
  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to deep-find and update node in tree
  const updateNodeInTree = (root: WorkflowNode, updatedNode: WorkflowNode): WorkflowNode => {
    if (root.id === updatedNode.id) {
      return { ...root, ...updatedNode };
    }

    let newNextNodes = root.nextNodes ? root.nextNodes.map(n => updateNodeInTree(n, updatedNode)) : undefined;
    let newYesBranch = root.yesBranch ? root.yesBranch.map(n => updateNodeInTree(n, updatedNode)) : undefined;
    let newNoBranch = root.noBranch ? root.noBranch.map(n => updateNodeInTree(n, updatedNode)) : undefined;

    return {
      ...root,
      nextNodes: newNextNodes,
      yesBranch: newYesBranch,
      noBranch: newNoBranch
    };
  };

  // Helper to deep-delete node from tree
  const deleteNodeFromTree = (root: WorkflowNode, targetId: string): WorkflowNode => {
    if (root.id === targetId) return root; // Cannot delete root trigger

    let newNextNodes = root.nextNodes
      ? root.nextNodes.filter(n => n.id !== targetId).map(n => deleteNodeFromTree(n, targetId))
      : undefined;

    let newYesBranch = root.yesBranch
      ? root.yesBranch.filter(n => n.id !== targetId).map(n => deleteNodeFromTree(n, targetId))
      : undefined;

    let newNoBranch = root.noBranch
      ? root.noBranch.filter(n => n.id !== targetId).map(n => deleteNodeFromTree(n, targetId))
      : undefined;

    return {
      ...root,
      nextNodes: newNextNodes,
      yesBranch: newYesBranch,
      noBranch: newNoBranch
    };
  };

  // Helper to deep-insert node into tree
  const insertNodeIntoTree = (
    root: WorkflowNode, 
    parentId: string, 
    newNode: WorkflowNode, 
    branch?: 'yes' | 'no'
  ): WorkflowNode => {
    if (root.id === parentId) {
      if (branch === 'yes') {
        return {
          ...root,
          yesBranch: root.yesBranch ? [...root.yesBranch, newNode] : [newNode]
        };
      } else if (branch === 'no') {
        return {
          ...root,
          noBranch: root.noBranch ? [...root.noBranch, newNode] : [newNode]
        };
      } else {
        // Insert in standard nextNodes chain
        return {
          ...root,
          nextNodes: root.nextNodes ? [newNode, ...root.nextNodes] : [newNode]
        };
      }
    }

    return {
      ...root,
      nextNodes: root.nextNodes ? root.nextNodes.map(n => insertNodeIntoTree(n, parentId, newNode, branch)) : undefined,
      yesBranch: root.yesBranch ? root.yesBranch.map(n => insertNodeIntoTree(n, parentId, newNode, branch)) : undefined,
      noBranch: root.noBranch ? root.noBranch.map(n => insertNodeIntoTree(n, parentId, newNode, branch)) : undefined
    };
  };

  // Helper to extract all nodes flatly for navigation
  const getAllWorkflowNodes = (root: WorkflowNode): WorkflowNode[] => {
    const list: WorkflowNode[] = [root];
    if (root.nextNodes) {
      for (const child of root.nextNodes) {
        list.push(...getAllWorkflowNodes(child));
      }
    }
    if (root.yesBranch) {
      for (const child of root.yesBranch) {
        list.push(...getAllWorkflowNodes(child));
      }
    }
    if (root.noBranch) {
      for (const child of root.noBranch) {
        list.push(...getAllWorkflowNodes(child));
      }
    }
    return list;
  };

  const handleSelectNode = (node: WorkflowNode) => {
    setSelectedNode(node);
    setIsInspectorOpen(true);
  };

  const handleAddStepPrompt = (parentId: string, branch?: 'yes' | 'no') => {
    setAddStepTarget({ parentId, branch });
    setIsAddStepModalOpen(true);
  };

  const handleCreateStep = (nodeType: WorkflowNodeType) => {
    if (!addStepTarget) return;

    const newId = `node-${nodeType}-${Date.now()}`;
    let newNode: WorkflowNode;

    switch (nodeType) {
      case 'email':
        newNode = {
          id: newId,
          type: 'email',
          title: 'Send Visual Email',
          description: 'Editorial newsletter sent to subscriber',
          emailConfig: {
            subject: 'A personal note from our team ✨',
            previewText: 'Discover what we have prepared for you.',
            senderName: 'Sendline Studio',
            senderEmail: 'hello@sendline.io',
            layoutHeadline: 'Crafted for You',
            layoutSubhead: 'Curated designs, stories, and exclusive insights.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
            accentColor: '#10B981',
            buttonText: 'Read Full Story',
            buttonUrl: 'https://sendline.io'
          },
          stats: {
            enrolledCount: 120,
            completedCount: 120,
            openRate: 72.0,
            clickRate: 31.5
          }
        };
        break;
      case 'delay':
        newNode = {
          id: newId,
          type: 'delay',
          title: 'Wait 3 Days',
          description: 'Relative wait duration before next step',
          delayConfig: {
            delayType: 'relative',
            value: 3,
            unit: 'days',
            timeOfDay: '09:00',
            respectRecipientTimezone: true
          },
          stats: {
            enrolledCount: 120,
            completedCount: 120
          }
        };
        break;
      case 'condition':
        newNode = {
          id: newId,
          type: 'condition',
          title: 'Check: Opened Previous Email?',
          description: 'Split path into YES and NO branches',
          conditionConfig: {
            conditionType: 'opened_email',
            timeframeDays: 2
          },
          yesBranch: [],
          noBranch: []
        };
        break;
      case 'action':
        newNode = {
          id: newId,
          type: 'action',
          title: 'Apply VIP Tag & Loyalty Reward',
          description: 'Automated subscriber data change',
          actionConfig: {
            actionType: 'add_tag',
            tagName: 'Engaged-Subscriber',
            pointsValue: 50,
            note: 'Added during workflow automation'
          }
        };
        break;
      default:
        return;
    }

    const updatedRoot = insertNodeIntoTree(
      workflow.rootTriggerNode,
      addStepTarget.parentId,
      newNode,
      addStepTarget.branch
    );

    const updatedWf = { ...workflow, rootTriggerNode: updatedRoot, updatedAt: new Date().toISOString() };
    setWorkflow(updatedWf);
    setSelectedNode(newNode);
    setIsAddStepModalOpen(false);
    setAddStepTarget(null);
    showToast(`Added new ${nodeType} step to workflow`);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === workflow.rootTriggerNode.id) {
      showToast('Cannot delete the root entry trigger');
      return;
    }

    const updatedRoot = deleteNodeFromTree(workflow.rootTriggerNode, nodeId);
    const updatedWf = { ...workflow, rootTriggerNode: updatedRoot, updatedAt: new Date().toISOString() };
    setWorkflow(updatedWf);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(updatedRoot);
    }
    showToast('Deleted node from workflow');
  };

  const handleUpdateSelectedNode = (updates: Partial<WorkflowNode>) => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, ...updates };
    setSelectedNode(updatedNode);

    const updatedRoot = updateNodeInTree(workflow.rootTriggerNode, updatedNode);
    setWorkflow({ ...workflow, rootTriggerNode: updatedRoot, updatedAt: new Date().toISOString() });
  };

  const handleSaveAndPublish = () => {
    onSave(workflow);
    showToast('Workflow saved and published successfully!');
  };

  return (
    <div className="flex flex-col h-screen bg-[#FBF9F6] select-none text-stone-900 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-stone-950 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-stone-800 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-stone-200 bg-white px-6 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 text-left">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Back to Workflows Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflow.title}
                onChange={(e) => setWorkflow({ ...workflow, title: e.target.value })}
                className="font-extrabold text-stone-950 text-base tracking-tight bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-900 focus:outline-none px-1"
              />
              
              {/* Status Switcher */}
              <select
                value={workflow.status}
                onChange={(e) => setWorkflow({ ...workflow, status: e.target.value as any })}
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                  workflow.status === 'active'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : workflow.status === 'paused'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                <option value="active">Active / Publishing</option>
                <option value="draft">Draft Mode</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="text-[11px] text-stone-400 font-medium px-1">
              Category: {workflow.category} • Last updated just now
            </div>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold text-stone-700">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inspector Toggle Button */}
          <button
            onClick={() => {
              if (selectedNode) {
                setSelectedNode(null);
              } else {
                setSelectedNode(workflow.rootTriggerNode);
              }
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedNode
                ? 'bg-stone-900 border-stone-900 text-white'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title="Toggle Right Inspector Panel"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{selectedNode ? 'Inspector Active' : 'Show Inspector'}</span>
          </button>

          {/* Analytics Toggle */}
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              showAnalytics
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showAnalytics ? 'Metrics Visible' : 'Metrics Hidden'}</span>
          </button>

          {/* Test Simulator Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-amber-950" />
            <span>Test Simulator</span>
          </button>

          {/* Save & Publish */}
          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area (Canvas + Slide-over Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Visual Flow Canvas */}
        <div 
          className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"
          onClick={() => setSelectedNode(null)}
        >
          <div 
            className="flex flex-col items-center transition-transform duration-200 origin-top pb-24"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            
            {/* Root Trigger Node & Recursive Children */}
            <WorkflowNodeCard
              node={workflow.rootTriggerNode}
              isSelected={selectedNode?.id === workflow.rootTriggerNode.id}
              onSelect={handleSelectNode}
              onAddStepAfter={handleAddStepPrompt}
              onDeleteNode={handleDeleteNode}
              onEditEmailInStudio={(node) => {
                if (onOpenEmailStudio) onOpenEmailStudio(node.emailConfig);
              }}
              showAnalytics={showAnalytics}
              highlightedNodeId={highlightedNodeId}
            />

            {/* Render Linear Next Nodes */}
            {workflow.rootTriggerNode.nextNodes?.map((childNode) => (
              <WorkflowNodeCard
                key={childNode.id}
                node={childNode}
                isSelected={selectedNode?.id === childNode.id}
                onSelect={handleSelectNode}
                onAddStepAfter={handleAddStepPrompt}
                onDeleteNode={handleDeleteNode}
                onEditEmailInStudio={(node) => {
                  if (onOpenEmailStudio) onOpenEmailStudio(node.emailConfig);
                }}
                showAnalytics={showAnalytics}
                highlightedNodeId={highlightedNodeId}
              />
            ))}

            {/* End of Flow Marker */}
            <div className="mt-6 flex flex-col items-center">
              <div className="px-4 py-1.5 rounded-full bg-stone-200/80 border border-stone-300 text-stone-600 text-[11px] font-black uppercase tracking-wider">
                End of Workflow Journey
              </div>
            </div>
          </div>
        </div>

        {/* Slide-Over Inspector Panel */}
        {selectedNode && (
          <div className="w-96 border-l border-stone-200 bg-white shadow-xl flex flex-col h-full z-20 shrink-0 text-left overflow-y-auto">
            
            {/* Inspector Header */}
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-700" />
                <h3 className="font-extrabold text-stone-900 text-sm tracking-tight capitalize">
                  Configure {selectedNode.type} Step
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-7 h-7 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inspector Form Content */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto text-left text-xs">
              
              {/* Step Title & Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">Step Label</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => handleUpdateSelectedNode({ title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* 1. TRIGGER CONFIG */}
              {selectedNode.type === 'trigger' && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Trigger Entry Event</label>
                    <select
                      value={selectedNode.triggerConfig?.triggerType || 'form_submission'}
                      onChange={(e) => handleUpdateSelectedNode({
                        triggerConfig: {
                          ...selectedNode.triggerConfig,
                          triggerType: e.target.value as WorkflowTriggerType
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="form_submission">Form Submitted (Lead Magnet / Waitlist)</option>
                      <option value="checkout_purchase">Checkout Order Paid (Stripe)</option>
                      <option value="segment_added">Subscriber Added to Segment</option>
                      <option value="loyalty_tier_reached">Loyalty Tier Milestone Reached</option>
                      <option value="tag_added">Tag Applied to Contact</option>
                    </select>
                  </div>

                  {/* Target Form Select */}
                  {selectedNode.triggerConfig?.triggerType === 'form_submission' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-stone-700 block">Select Trigger Form</label>
                      <select
                        value={selectedNode.triggerConfig?.targetId || ''}
                        onChange={(e) => {
                          const form = forms.find(f => f.id === e.target.value);
                          handleUpdateSelectedNode({
                            triggerConfig: {
                              ...selectedNode.triggerConfig,
                              triggerType: 'form_submission',
                              targetId: e.target.value,
                              targetName: form ? form.title : 'Selected Form'
                            }
                          });
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="form-lookbook-2026">Summer Capsule Lookbook Waitlist</option>
                        <option value="form-newsletter-minimal">Minimalist Editorial Newsletter Opt-in</option>
                        {forms.map(f => (
                          <option key={f.id} value={f.id}>{f.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Target Product Select */}
                  {selectedNode.triggerConfig?.triggerType === 'checkout_purchase' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-stone-700 block">Select Digital Product</label>
                      <select
                        value={selectedNode.triggerConfig?.targetId || ''}
                        onChange={(e) => {
                          const prod = products.find(p => p.id === e.target.value);
                          handleUpdateSelectedNode({
                            triggerConfig: {
                              ...selectedNode.triggerConfig,
                              triggerType: 'checkout_purchase',
                              targetId: e.target.value,
                              targetName: prod ? prod.title : 'Selected Checkout Product'
                            }
                          });
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="prod-director-os">The Creative Director's Operating System ($49)</option>
                        <option value="prod-strategy-call">1-on-1 Newsletter Strategy Session ($350)</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* 2. EMAIL CONFIG */}
              {selectedNode.type === 'email' && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Subject Line</label>
                    <input
                      type="text"
                      value={selectedNode.emailConfig?.subject || ''}
                      onChange={(e) => handleUpdateSelectedNode({
                        emailConfig: {
                          ...selectedNode.emailConfig!,
                          subject: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Preview Snippet Text</label>
                    <input
                      type="text"
                      value={selectedNode.emailConfig?.previewText || ''}
                      onChange={(e) => handleUpdateSelectedNode({
                        emailConfig: {
                          ...selectedNode.emailConfig!,
                          previewText: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Sender Name</label>
                    <input
                      type="text"
                      value={selectedNode.emailConfig?.senderName || 'Sendline Studio'}
                      onChange={(e) => handleUpdateSelectedNode({
                        emailConfig: {
                          ...selectedNode.emailConfig!,
                          senderName: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Call to Action Button Text</label>
                    <input
                      type="text"
                      value={selectedNode.emailConfig?.buttonText || 'Download Freebie'}
                      onChange={(e) => handleUpdateSelectedNode({
                        emailConfig: {
                          ...selectedNode.emailConfig!,
                          buttonText: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none"
                    />
                  </div>

                  {onOpenEmailStudio && (
                    <button
                      onClick={() => onOpenEmailStudio(selectedNode.emailConfig, selectedNode, workflow)}
                      className="w-full py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit Full Design in Email Studio</span>
                    </button>
                  )}
                </div>
              )}

              {/* 3. TIME DELAY CONFIG */}
              {selectedNode.type === 'delay' && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="font-bold text-stone-700 block">Wait Value</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedNode.delayConfig?.value ?? 2}
                        onChange={(e) => handleUpdateSelectedNode({
                          delayConfig: {
                            ...selectedNode.delayConfig!,
                            value: parseInt(e.target.value) || 1
                          }
                        })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-stone-700 block">Unit</label>
                      <select
                        value={selectedNode.delayConfig?.unit ?? 'days'}
                        onChange={(e) => handleUpdateSelectedNode({
                          delayConfig: {
                            ...selectedNode.delayConfig!,
                            unit: e.target.value as any
                          }
                        })}
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Send at Specific Time of Day</label>
                    <input
                      type="time"
                      value={selectedNode.delayConfig?.timeOfDay || '09:00'}
                      onChange={(e) => handleUpdateSelectedNode({
                        delayConfig: {
                          ...selectedNode.delayConfig!,
                          timeOfDay: e.target.value
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                    Smart Timezone Delivery is enabled. Emails wait for the recipient's local morning window.
                  </div>
                </div>
              )}

              {/* 4. CONDITION CONFIG */}
              {selectedNode.type === 'condition' && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Condition Criteria</label>
                    <select
                      value={selectedNode.conditionConfig?.conditionType || 'opened_email'}
                      onChange={(e) => handleUpdateSelectedNode({
                        conditionConfig: {
                          ...selectedNode.conditionConfig!,
                          conditionType: e.target.value as any
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="opened_email">Opened Previous Email</option>
                      <option value="clicked_link">Clicked Specific Link</option>
                      <option value="purchased_product">Completed Checkout Purchase</option>
                      <option value="in_segment">Is in Target Segment</option>
                      <option value="has_tag">Has Contact Tag</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Evaluation Timeframe (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedNode.conditionConfig?.timeframeDays ?? 2}
                      onChange={(e) => handleUpdateSelectedNode({
                        conditionConfig: {
                          ...selectedNode.conditionConfig!,
                          timeframeDays: parseInt(e.target.value) || 1
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-950">
                    If condition is met within {selectedNode.conditionConfig?.timeframeDays ?? 2} days, contact moves down the <strong className="text-emerald-700">YES branch</strong>. Otherwise, they advance through the <strong className="text-rose-700">NO branch</strong>.
                  </div>
                </div>
              )}

              {/* 5. ACTION CONFIG */}
              {selectedNode.type === 'action' && (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Action Type</label>
                    <select
                      value={selectedNode.actionConfig?.actionType || 'add_to_segment'}
                      onChange={(e) => handleUpdateSelectedNode({
                        actionConfig: {
                          ...selectedNode.actionConfig!,
                          actionType: e.target.value as any
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="add_to_segment">Add Subscriber to Segment</option>
                      <option value="add_tag">Add Contact Tag</option>
                      <option value="award_loyalty_points">Award Loyalty Points</option>
                      <option value="issue_coupon">Issue Dynamic Promo Coupon</option>
                      <option value="remove_from_segment">Remove from Segment</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Segment / Tag Name</label>
                    <input
                      type="text"
                      value={selectedNode.actionConfig?.segmentName || selectedNode.actionConfig?.tagName || ''}
                      onChange={(e) => handleUpdateSelectedNode({
                        actionConfig: {
                          ...selectedNode.actionConfig!,
                          segmentName: e.target.value,
                          tagName: e.target.value
                        }
                      })}
                      placeholder="e.g. VIP-Members-2026"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 block">Loyalty Points to Award</label>
                    <input
                      type="number"
                      value={selectedNode.actionConfig?.pointsValue ?? 100}
                      onChange={(e) => handleUpdateSelectedNode({
                        actionConfig: {
                          ...selectedNode.actionConfig!,
                          pointsValue: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Step Selection Modal */}
      {isAddStepModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 p-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-950 text-base tracking-tight">
                Add Next Step
              </h3>
              <button
                onClick={() => setIsAddStepModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              Choose the type of automation step to insert into this pathway:
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Send Email */}
              <button
                onClick={() => handleCreateStep('email')}
                className="p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 text-left space-y-1.5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-indigo-950 text-xs">Send Email</div>
                <div className="text-[11px] text-stone-500 font-medium">Editorial visual campaign or notice</div>
              </button>

              {/* Time Delay */}
              <button
                onClick={() => handleCreateStep('delay')}
                className="p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-left space-y-1.5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-blue-950 text-xs">Time Delay</div>
                <div className="text-[11px] text-stone-500 font-medium">Wait hours, days, or scheduled time</div>
              </button>

              {/* Condition Branch */}
              <button
                onClick={() => handleCreateStep('condition')}
                className="p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 text-left space-y-1.5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GitFork className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-purple-950 text-xs">Condition (If/Else)</div>
                <div className="text-[11px] text-stone-500 font-medium">Split based on opens, clicks, tags</div>
              </button>

              {/* Action Event */}
              <button
                onClick={() => handleCreateStep('action')}
                className="p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-left space-y-1.5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-emerald-950 text-xs">Action Event</div>
                <div className="text-[11px] text-stone-500 font-medium">Award points, tag, or segment</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Contact Simulator Modal */}
      <WorkflowSimulatorModal
        workflow={workflow}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onHighlightNode={(nodeId) => setHighlightedNodeId(nodeId)}
      />
    </div>
  );
};
