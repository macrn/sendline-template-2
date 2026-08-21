import React, { useState } from 'react';
import { WorkflowItem, FormItem, CheckoutProduct } from '../../types';
import { WorkflowTemplateGalleryModal } from './WorkflowTemplateGalleryModal';
import { WorkflowSimulatorModal } from './WorkflowSimulatorModal';
import { 
  GitFork, 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Sliders, 
  TrendingUp, 
  Users, 
  Mail, 
  MousePointer, 
  CheckCircle2, 
  PauseCircle, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Sparkles, 
  FileText, 
  ShoppingBag, 
  Gift, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface WorkflowsHubProps {
  workflows: WorkflowItem[];
  onOpenWorkflowStudio: (workflow: WorkflowItem) => void;
  onCreateWorkflow: (workflow: WorkflowItem) => void;
  onUpdateWorkflow: (workflow: WorkflowItem) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  forms?: FormItem[];
  products?: CheckoutProduct[];
}

export const WorkflowsHub: React.FC<WorkflowsHubProps> = ({
  workflows,
  onOpenWorkflowStudio,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  forms = [],
  products = []
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  
  // Template gallery modal
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  
  // Simulator test modal
  const [testingWorkflow, setTestingWorkflow] = useState<WorkflowItem | null>(null);

  // Overall metrics calculation
  const totalEnrolledAll = workflows.reduce((acc, w) => acc + (w.totalEnrolled || 0), 0);
  const activeCount = workflows.filter(w => w.status === 'active').length;
  const avgOpenRate = workflows.length > 0
    ? (workflows.reduce((acc, w) => acc + (w.avgOpenRate || 0), 0) / workflows.length).toFixed(1)
    : '0.0';
  const avgClickRate = workflows.length > 0
    ? (workflows.reduce((acc, w) => acc + (w.avgClickRate || 0), 0) / workflows.length).toFixed(1)
    : '0.0';

  // Categories list
  const categories = ['All', 'Welcome Series', 'Post-Purchase', 'Loyalty & Rewards', 'Abandonment Recovery', 'Lead Magnet Delivery'];

  // Filtered workflows
  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateFromScratch = () => {
    const newWorkflow: WorkflowItem = {
      id: `wf-${Date.now()}`,
      title: 'Untitled Automation Flow',
      description: 'Custom automated customer journey trigger and response',
      status: 'draft',
      category: 'Custom',
      totalEnrolled: 0,
      totalCompleted: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rootTriggerNode: {
        id: `node-trigger-${Date.now()}`,
        type: 'trigger',
        title: 'Form Submitted',
        description: 'Trigger when visitor submits lead form',
        triggerConfig: {
          triggerType: 'form_submission',
          targetName: 'Any Active Form'
        },
        stats: {
          enrolledCount: 0,
          completedCount: 0
        },
        nextNodes: []
      }
    };

    onCreateWorkflow(newWorkflow);
    setIsGalleryOpen(false);
    onOpenWorkflowStudio(newWorkflow);
  };

  const handleSelectRecipeTemplate = (templateId: string) => {
    // Clone starter template logic
    const templateName = templateId.replace('tmpl-', '').replace(/-/g, ' ');
    const newWorkflow: WorkflowItem = {
      id: `wf-cloned-${Date.now()}`,
      title: templateName.charAt(0).toUpperCase() + templateName.slice(1) + ' Flow',
      description: 'Automated workflow blueprint with pre-configured delay and visual email',
      status: 'draft',
      category: 'Welcome Series',
      totalEnrolled: 0,
      totalCompleted: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rootTriggerNode: {
        id: `node-trigger-${Date.now()}`,
        type: 'trigger',
        title: 'Subscriber Entry Event',
        triggerConfig: {
          triggerType: 'form_submission',
          targetName: 'Lead Generation Form'
        },
        nextNodes: [
          {
            id: `node-email-${Date.now()}`,
            type: 'email',
            title: 'Welcome & Value Delivery Email',
            emailConfig: {
              subject: 'Welcome to our studio ✨ Here is your gift',
              previewText: 'Everything you need to get started today.',
              senderName: 'Sendline Team',
              senderEmail: 'hello@sendline.io',
              thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
              accentColor: '#D97706',
              buttonText: 'Get Started'
            },
            nextNodes: [
              {
                id: `node-delay-${Date.now()}`,
                type: 'delay',
                title: 'Wait 2 Days',
                delayConfig: {
                  delayType: 'relative',
                  value: 2,
                  unit: 'days'
                }
              }
            ]
          }
        ]
      }
    };

    onCreateWorkflow(newWorkflow);
    setIsGalleryOpen(false);
    onOpenWorkflowStudio(newWorkflow);
  };

  const handleToggleStatus = (workflow: WorkflowItem) => {
    const nextStatus = workflow.status === 'active' ? 'paused' : 'active';
    onUpdateWorkflow({
      ...workflow,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDuplicate = (workflow: WorkflowItem) => {
    const duplicated: WorkflowItem = {
      ...workflow,
      id: `wf-copy-${Date.now()}`,
      title: `${workflow.title} (Copy)`,
      status: 'draft',
      totalEnrolled: 0,
      totalCompleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onCreateWorkflow(duplicated);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 lg:p-10 font-sans text-stone-900 text-left">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center shadow-xs">
                <GitFork className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                Visual Automation Studio
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-stone-950 tracking-tight">
              Workflows & Lifecycle Automations
            </h1>
            <p className="text-stone-600 text-sm font-medium mt-1">
              Create Flodesk-style visual email journeys with conditional branching, delays, and loyalty triggers.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Workflow</span>
            </button>
          </div>
        </div>

        {/* Global Analytics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">Active Automations</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-950 tracking-tight">
              {activeCount} <span className="text-xs font-bold text-stone-400">/ {workflows.length} total</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">Total Leads Enrolled</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-950 tracking-tight">
              {totalEnrolledAll.toLocaleString()}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">Avg. Open Rate</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-950 tracking-tight text-indigo-950">
              {avgOpenRate}%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">Avg. Click Rate</span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <MousePointer className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-950 tracking-tight text-purple-950">
              {avgClickRate}%
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900 w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
            >
              <div>
                {/* Card Top Badges & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {workflow.category}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(workflow)}
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer ${
                        workflow.status === 'active'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : workflow.status === 'paused'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        workflow.status === 'active' ? 'bg-emerald-500' : workflow.status === 'paused' ? 'bg-amber-500' : 'bg-stone-400'
                      }`} />
                      <span className="capitalize">{workflow.status}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(workflow)}
                      className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Duplicate workflow"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteWorkflow(workflow.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete workflow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Workflow Title & Description */}
                <h3 
                  onClick={() => onOpenWorkflowStudio(workflow)}
                  className="font-extrabold text-stone-950 text-base tracking-tight mb-1.5 group-hover:text-indigo-950 cursor-pointer"
                >
                  {workflow.title}
                </h3>
                <p className="text-xs text-stone-600 font-medium line-clamp-2 leading-relaxed mb-4">
                  {workflow.description}
                </p>

                {/* Trigger Pill */}
                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-semibold text-amber-950 flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                    Entry
                  </span>
                  <span className="truncate">{workflow.rootTriggerNode.title}: {workflow.rootTriggerNode.triggerConfig?.targetName || 'Default trigger'}</span>
                </div>
              </div>

              {/* Performance Stats & Actions */}
              <div>
                <div className="py-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="p-2 rounded-xl bg-stone-50">
                    <div className="text-[10px] font-bold text-stone-500">Enrolled</div>
                    <div className="font-extrabold text-stone-900">{workflow.totalEnrolled.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50">
                    <div className="text-[10px] font-bold text-stone-500">Open %</div>
                    <div className="font-extrabold text-indigo-900">{workflow.avgOpenRate}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50">
                    <div className="text-[10px] font-bold text-stone-500">Click %</div>
                    <div className="font-extrabold text-emerald-900">{workflow.avgClickRate}%</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWorkflowStudio(workflow)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open Canvas Studio</span>
                  </button>

                  <button
                    onClick={() => setTestingWorkflow(workflow)}
                    className="py-2.5 px-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black flex items-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
                    title="Test contact simulator"
                  >
                    <Play className="w-3.5 h-3.5 fill-amber-950" />
                    <span>Test</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="p-12 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
            <GitFork className="w-10 h-10 mx-auto text-stone-300" />
            <h3 className="text-base font-extrabold text-stone-950">No workflows found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No automations matched your filters. Create a new automated flow from our proven creator templates.
            </p>
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold cursor-pointer"
            >
              Browse Workflow Templates
            </button>
          </div>
        )}
      </div>

      {/* Template Gallery Modal */}
      <WorkflowTemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectTemplate={handleSelectRecipeTemplate}
        onStartFromScratch={handleCreateFromScratch}
      />

      {/* Simulator Modal */}
      {testingWorkflow && (
        <WorkflowSimulatorModal
          workflow={testingWorkflow}
          isOpen={!!testingWorkflow}
          onClose={() => setTestingWorkflow(null)}
        />
      )}
    </div>
  );
};
