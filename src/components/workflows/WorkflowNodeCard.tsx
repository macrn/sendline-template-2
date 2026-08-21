import React from 'react';
import { 
  WorkflowNode, 
  WorkflowNodeType 
} from '../../types';
import { 
  Zap, 
  Mail, 
  Clock, 
  GitFork, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Tag, 
  Gift, 
  Eye, 
  MousePointer, 
  Sparkles,
  ShoppingBag,
  FileText,
  Copy
} from 'lucide-react';

interface WorkflowNodeCardProps {
  node: WorkflowNode;
  isSelected?: boolean;
  selectedNodeId?: string | null;
  onSelect: (node: WorkflowNode) => void;
  onAddStepAfter: (nodeId: string, branch?: 'yes' | 'no') => void;
  onDeleteNode: (nodeId: string) => void;
  onEditEmailInStudio?: (node: WorkflowNode) => void;
  showAnalytics?: boolean;
  highlightedNodeId?: string | null;
}

export const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  node,
  isSelected,
  selectedNodeId,
  onSelect,
  onAddStepAfter,
  onDeleteNode,
  onEditEmailInStudio,
  showAnalytics = true,
  highlightedNodeId
}) => {
  const isHighlighted = highlightedNodeId === node.id;
  const isNodeSelected = isSelected ?? (selectedNodeId === node.id);

  // Render Trigger Node
  if (node.type === 'trigger') {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`w-80 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md text-left p-4 relative group ${
            isHighlighted
              ? 'border-amber-500 ring-4 ring-amber-200/60 scale-105'
              : isNodeSelected 
                ? 'border-stone-900 ring-2 ring-stone-900/20' 
                : 'border-amber-300/80 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                Trigger (Entry Rule)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {node.triggerConfig?.triggerType === 'form_submission' ? 'Form Entry' :
               node.triggerConfig?.triggerType === 'checkout_purchase' ? 'Stripe Checkout' :
               node.triggerConfig?.triggerType === 'loyalty_tier_reached' ? 'Loyalty Tier' : 'Segment Event'}
            </span>
          </div>

          <h4 className="font-extrabold text-stone-900 text-sm tracking-tight mb-1">
            {node.title}
          </h4>
          <p className="text-xs text-stone-600 font-medium line-clamp-2 mb-3">
            {node.description || node.triggerConfig?.targetName || 'Configured trigger event'}
          </p>

          {node.triggerConfig?.targetName && (
            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-semibold text-amber-950 flex items-center gap-1.5 truncate">
              {node.triggerConfig.triggerType === 'form_submission' ? (
                <FileText className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              ) : node.triggerConfig.triggerType === 'checkout_purchase' ? (
                <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              )}
              <span className="truncate">{node.triggerConfig.targetName}</span>
            </div>
          )}

          {showAnalytics && node.stats && (
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
              <span>Total Enrolled</span>
              <span className="text-stone-900 font-black">{node.stats.enrolledCount.toLocaleString()} leads</span>
            </div>
          )}
        </div>

        {/* Stem Connector */}
        <div className="w-0.5 h-6 bg-stone-300" />

        {/* Add Step Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddStepAfter(node.id);
          }}
          className="w-6 h-6 rounded-full bg-white border-2 border-stone-400 hover:border-stone-900 hover:bg-stone-950 hover:text-white text-stone-600 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
          title="Add step after trigger"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Stem Connector bottom */}
        <div className="w-0.5 h-6 bg-stone-300" />
      </div>
    );
  }

  // Render Email Node
  if (node.type === 'email') {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`w-84 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md text-left p-4 relative group ${
            isHighlighted
              ? 'border-indigo-500 ring-4 ring-indigo-200/60 scale-105'
              : isNodeSelected 
                ? 'border-stone-900 ring-2 ring-stone-900/20' 
                : 'border-stone-200 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-900 flex items-center justify-center">
                <Mail className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-950">
                Send Email
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity rounded-md hover:bg-rose-50"
                title="Delete node"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h4 className="font-extrabold text-stone-900 text-sm tracking-tight mb-1">
            {node.title}
          </h4>

          {/* Subject Line & Preview Snippet */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 mb-3 space-y-1">
            <div className="text-[11px] font-bold text-stone-900 truncate">
              <span className="text-stone-500 font-semibold mr-1">Subj:</span>
              {node.emailConfig?.subject || 'Editorial newsletter subject'}
            </div>
            {node.emailConfig?.previewText && (
              <div className="text-[10px] text-stone-500 font-medium truncate">
                <span className="text-stone-400 mr-1">Pre:</span>
                {node.emailConfig.previewText}
              </div>
            )}
          </div>

          {/* Email Visual Thumbnail */}
          {node.emailConfig?.thumbnailUrl && (
            <div className="relative h-28 rounded-xl overflow-hidden mb-3 border border-stone-200 group/img">
              <img 
                src={node.emailConfig.thumbnailUrl} 
                alt="Email preview" 
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-2.5 justify-between">
                <span className="text-[11px] font-bold text-white tracking-tight truncate max-w-[180px]">
                  {node.emailConfig.layoutHeadline || 'Visual Template'}
                </span>
                {onEditEmailInStudio && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEmailInStudio(node);
                    }}
                    className="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Edit Design</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Analytics Bar */}
          {showAnalytics && node.stats && (
            <div className="pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-600 font-bold bg-stone-50 p-1.5 rounded-lg">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Open:</span>
                <span className="font-extrabold text-stone-900">{node.stats.openRate ?? 65}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600 font-bold bg-stone-50 p-1.5 rounded-lg">
                <MousePointer className="w-3.5 h-3.5 text-emerald-500" />
                <span>Click:</span>
                <span className="font-extrabold text-stone-900">{node.stats.clickRate ?? 28}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Stem Connector */}
        <div className="w-0.5 h-6 bg-stone-300" />

        {/* Add Step Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddStepAfter(node.id);
          }}
          className="w-6 h-6 rounded-full bg-white border-2 border-stone-400 hover:border-stone-900 hover:bg-stone-950 hover:text-white text-stone-600 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
          title="Add step after email"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Stem Connector bottom */}
        <div className="w-0.5 h-6 bg-stone-300" />
      </div>
    );
  }

  // Render Time Delay Node
  if (node.type === 'delay') {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`w-72 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md text-left p-3.5 relative group ${
            isHighlighted
              ? 'border-blue-500 ring-4 ring-blue-200/60 scale-105'
              : isNodeSelected 
                ? 'border-stone-900 ring-2 ring-stone-900/20' 
                : 'border-stone-200 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-300 text-blue-900 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-950">
                Time Delay
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity rounded-md hover:bg-rose-50"
              title="Delete node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-stone-900">
              Wait {node.delayConfig?.value ?? 2} {node.delayConfig?.unit ?? 'days'}
            </span>
            {node.delayConfig?.timeOfDay && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                At {node.delayConfig.timeOfDay} recipient time
              </span>
            )}
          </div>
        </div>

        {/* Stem Connector */}
        <div className="w-0.5 h-6 bg-stone-300" />

        {/* Add Step Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddStepAfter(node.id);
          }}
          className="w-6 h-6 rounded-full bg-white border-2 border-stone-400 hover:border-stone-900 hover:bg-stone-950 hover:text-white text-stone-600 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
          title="Add step after delay"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Stem Connector bottom */}
        <div className="w-0.5 h-6 bg-stone-300" />
      </div>
    );
  }

  // Render Action Node
  if (node.type === 'action') {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`w-76 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md text-left p-3.5 relative group ${
            isHighlighted
              ? 'border-emerald-500 ring-4 ring-emerald-200/60 scale-105'
              : isNodeSelected 
                ? 'border-stone-900 ring-2 ring-stone-900/20' 
                : 'border-stone-200 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center">
                {node.actionConfig?.actionType === 'award_loyalty_points' ? (
                  <Gift className="w-3.5 h-3.5 text-emerald-600" />
                ) : node.actionConfig?.actionType === 'issue_coupon' ? (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                Action Event
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity rounded-md hover:bg-rose-50"
              title="Delete node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="font-extrabold text-stone-900 text-xs tracking-tight mb-1">
            {node.title}
          </h4>

          {node.actionConfig?.segmentName && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
              <Tag className="w-3 h-3 text-emerald-700" />
              <span>Segment: {node.actionConfig.segmentName}</span>
            </div>
          )}

          {node.actionConfig?.pointsValue && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
              <Gift className="w-3 h-3 text-amber-700" />
              <span>+{node.actionConfig.pointsValue} Loyalty Points</span>
            </div>
          )}

          {node.actionConfig?.couponDiscount && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-900">
              <Sparkles className="w-3 h-3 text-purple-700" />
              <span>Coupon: {node.actionConfig.couponDiscount}</span>
            </div>
          )}
        </div>

        {/* Stem Connector */}
        <div className="w-0.5 h-6 bg-stone-300" />

        {/* Add Step Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddStepAfter(node.id);
          }}
          className="w-6 h-6 rounded-full bg-white border-2 border-stone-400 hover:border-stone-900 hover:bg-stone-950 hover:text-white text-stone-600 flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
          title="Add step after action"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Stem Connector bottom */}
        <div className="w-0.5 h-6 bg-stone-300" />
      </div>
    );
  }

  // Render Condition Node (Branching Fork)
  if (node.type === 'condition') {
    return (
      <div className="flex flex-col items-center">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          className={`w-80 rounded-2xl bg-white border-2 transition-all cursor-pointer shadow-sm hover:shadow-md text-left p-4 relative group ${
            isHighlighted
              ? 'border-purple-500 ring-4 ring-purple-200/60 scale-105'
              : isNodeSelected 
                ? 'border-stone-900 ring-2 ring-stone-900/20' 
                : 'border-purple-300 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 border border-purple-300 text-purple-900 flex items-center justify-center">
                <GitFork className="w-4 h-4 text-purple-700" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-950">
                Condition Branch (If / Else)
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity rounded-md hover:bg-rose-50"
              title="Delete condition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="font-extrabold text-stone-900 text-sm tracking-tight mb-1">
            {node.title}
          </h4>
          <p className="text-xs text-stone-600 font-medium mb-3">
            {node.description || 'Checks recipient interaction or segment membership'}
          </p>

          <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200 text-xs font-semibold text-purple-950 flex items-center justify-between">
            <span className="capitalize">
              {node.conditionConfig?.conditionType === 'opened_email' ? 'Opened Email' :
               node.conditionConfig?.conditionType === 'clicked_link' ? 'Clicked Specific Link' :
               node.conditionConfig?.conditionType === 'purchased_product' ? 'Completed Purchase' : 'Segment Match'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-950 font-black">
              2 Paths (Yes / No)
            </span>
          </div>
        </div>

        {/* Forked Branches Rendering */}
        <div className="w-full flex justify-center items-start mt-4 pt-2 relative">
          
          {/* Connecting Branch Header Bar */}
          <div className="absolute top-0 left-1/4 right-1/4 h-4 border-t-2 border-l-2 border-r-2 border-stone-300 rounded-t-xl" />

          {/* Left Branch: YES */}
          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black shadow-xs mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>YES</span>
            </div>

            {/* Yes branch children */}
            {node.yesBranch && node.yesBranch.length > 0 ? (
              node.yesBranch.map((child) => (
                <WorkflowNodeCard
                  key={child.id}
                  node={child}
                  selectedNodeId={selectedNodeId}
                  onSelect={onSelect}
                  onAddStepAfter={onAddStepAfter}
                  onDeleteNode={onDeleteNode}
                  onEditEmailInStudio={onEditEmailInStudio}
                  showAnalytics={showAnalytics}
                  highlightedNodeId={highlightedNodeId}
                />
              ))
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStepAfter(node.id, 'yes');
                  }}
                  className="px-3 py-2 rounded-xl bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-600 text-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Action to Yes</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Branch: NO */}
          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs font-black shadow-xs mb-3">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>NO</span>
            </div>

            {/* No branch children */}
            {node.noBranch && node.noBranch.length > 0 ? (
              node.noBranch.map((child) => (
                <WorkflowNodeCard
                  key={child.id}
                  node={child}
                  selectedNodeId={selectedNodeId}
                  onSelect={onSelect}
                  onAddStepAfter={onAddStepAfter}
                  onDeleteNode={onDeleteNode}
                  onEditEmailInStudio={onEditEmailInStudio}
                  showAnalytics={showAnalytics}
                  highlightedNodeId={highlightedNodeId}
                />
              ))
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStepAfter(node.id, 'no');
                  }}
                  className="px-3 py-2 rounded-xl bg-white border-2 border-dashed border-rose-300 hover:border-rose-600 text-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Action to No</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
