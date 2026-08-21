import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  GitFork, 
  Cpu, 
  Mail, 
  FileText, 
  Workflow, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Code,
  ShieldCheck,
  Server,
  Zap
} from 'lucide-react';

export const UnifiedArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'fork' | 'schema' | 'roadmap'>('layers');

  return (
    <div className="w-full min-h-screen bg-[#0D1117] text-stone-100 p-6 lg:p-12 space-y-10 font-sans antialiased select-none">
      
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              System Architecture & Schema
            </h1>
            <p className="text-xs text-stone-400">
              Technical blueprints for the unified block schema, dual renderers, and database models.
            </p>
          </div>

          <div className="flex items-center bg-[#161B22] p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'layers' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              System Layers (SL1)
            </button>
            <button
              onClick={() => setActiveTab('fork')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'fork' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Fork-on-Use (SL5)
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schema' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Data Model (SL2)
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roadmap' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Build Order (SL8)
            </button>
          </div>
        </div>

        {/* Tab 1: System Layers (SL1) */}
        {activeTab === 'layers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 gap-4">
              
              {/* Layer 1: Brand Kit */}
              <div className="p-6 rounded-3xl bg-[#161B22] border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center text-xs font-black text-indigo-400">1</span>
                    <h3 className="font-bold text-white text-sm">Brand Kit</h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">Layer 1: Global Identity</span>
                </div>
                <p className="text-xs text-stone-400 pl-9">
                  Colors, fonts, logo initials, spacing scales, and border radii that propagate dynamically to all child documents.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-stone-600">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Layer 2: Shared Block Library */}
              <div className="p-6 rounded-3xl bg-[#161B22] border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-xs font-black text-blue-400">2</span>
                    <h3 className="font-bold text-white text-sm">Shared Block Library</h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">Layer 2: Primitives</span>
                </div>
                <p className="text-xs text-stone-400 pl-9">
                  Universal block types (Header, Text, Image, Button, Spacer, Form Slot, Product Card, Footer) configured with context capability matrices.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-stone-600">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Layer 3: Template Library */}
              <div className="p-6 rounded-3xl bg-[#161B22] border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-xs font-black text-emerald-400">3</span>
                    <h3 className="font-bold text-white text-sm">Template Library</h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">Layer 3: JSON Layouts</span>
                </div>
                <p className="text-xs text-stone-400 pl-9">
                  Product-agnostic JSON block documents (Spring Launch, Weekly Digest, VIP Invitation) saved as reusable blueprints.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-stone-600">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Layer 4: Dual Renderers to Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Email Renderer Side */}
                <div className="p-6 rounded-3xl bg-[#1E242C] border border-blue-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Email Renderer (Table HTML 600px)</span>
                  </div>
                  <div className="space-y-2 pl-2 border-l-2 border-blue-500/40">
                    <div className="text-xs font-semibold text-stone-200">✉️ Campaigns (Email sends to audience)</div>
                    <div className="text-xs font-semibold text-stone-200">⚡ Workflows (Triggered email steps)</div>
                  </div>
                </div>

                {/* Web Renderer Side */}
                <div className="p-6 rounded-3xl bg-[#1E242C] border border-emerald-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Web Renderer (Interactive Pages)</span>
                  </div>
                  <div className="space-y-2 pl-2 border-l-2 border-emerald-500/40">
                    <div className="text-xs font-semibold text-stone-200">📝 Forms (Opt-in capture & embed script)</div>
                    <div className="text-xs font-semibold text-stone-200">🛍️ Checkout (Sales page & instant payment)</div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Fork-on-Use (SL5) */}
        {activeTab === 'fork' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-8 rounded-3xl bg-[#161B22] border border-stone-800 space-y-6">
              
              <div className="flex items-center gap-3">
                <GitFork className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">The One Rule: Fork-on-Use</h3>
                  <p className="text-xs text-stone-400">Applying a template copies the block document so edits never mutate other live assets.</p>
                </div>
              </div>

              {/* Flowchart Representation */}
              <div className="p-6 rounded-2xl bg-[#0D1117] border border-stone-800 space-y-6">
                
                <div className="text-center p-4 rounded-xl bg-stone-900 border border-stone-800 max-w-sm mx-auto">
                  <div className="text-xs font-bold text-stone-400 uppercase">Universal Template</div>
                  <div className="font-serif font-bold text-white text-sm">Spring launch (JSONB document)</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-800">
                  
                  {/* Campaign Fork */}
                  <div className="p-4 rounded-xl bg-[#161B22] border border-stone-800 space-y-2">
                    <div className="text-[10px] font-black uppercase text-blue-400">Fork #1: Campaign</div>
                    <div className="text-xs font-semibold text-white">Footer Auto-Injected</div>
                    <p className="text-[11px] text-stone-400">Dispatched to segments with deduplication & scheduling.</p>
                  </div>

                  {/* Form Fork */}
                  <div className="p-4 rounded-xl bg-[#161B22] border border-stone-800 space-y-2">
                    <div className="text-[10px] font-black uppercase text-emerald-400">Fork #2: Form</div>
                    <div className="text-xs font-semibold text-white">Adds Inputs + Submit Slot</div>
                    <p className="text-[11px] text-stone-400">Published via hosted URL or vanilla JS embed script.</p>
                  </div>

                  {/* Workflow Fork */}
                  <div className="p-4 rounded-xl bg-[#161B22] border border-stone-800 space-y-2">
                    <div className="text-[10px] font-black uppercase text-purple-400">Fork #3: Workflow</div>
                    <div className="text-xs font-semibold text-white">Email Steps in Sequence</div>
                    <p className="text-[11px] text-stone-400">Executes on form submission triggers with condition branching.</p>
                  </div>

                </div>

              </div>

              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300 flex items-center gap-3">
                <Sparkles className="w-5 h-5 shrink-0 text-blue-400" />
                <span>
                  <strong>Global Brand Link:</strong> While block copies diverge safely per channel, the Brand Kit remains linked—updating brand colors or fonts updates the entire suite automatically.
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Data Model & Schema (SL2) */}
        {activeTab === 'schema' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TEMPLATES */}
              <div className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">TEMPLATES</span>
                  <span className="text-[10px] font-mono text-stone-500">PostgreSQL JSONB</span>
                </div>
                <div className="font-mono text-xs text-stone-300 space-y-1 bg-[#0D1117] p-3 rounded-xl">
                  <div>• id: UUID (PK)</div>
                  <div>• name: VARCHAR(255)</div>
                  <div>• brand_kit_id: UUID (FK)</div>
                  <div>• blocks: JSONB</div>
                  <div>• created_at: TIMESTAMP</div>
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">DOCUMENTS</span>
                  <span className="text-[10px] font-mono text-stone-500">Forked Snapshots</span>
                </div>
                <div className="font-mono text-xs text-stone-300 space-y-1 bg-[#0D1117] p-3 rounded-xl">
                  <div>• id: UUID (PK)</div>
                  <div>• template_id: UUID (FK)</div>
                  <div>• context: VARCHAR(50)</div>
                  <div>• blocks: JSONB</div>
                  <div>• version: INTEGER</div>
                </div>
              </div>

              {/* WORKFLOWS & STEPS */}
              <div className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-400">WORKFLOW_STEPS</span>
                  <span className="text-[10px] font-mono text-stone-500">Automation Graph</span>
                </div>
                <div className="font-mono text-xs text-stone-300 space-y-1 bg-[#0D1117] p-3 rounded-xl">
                  <div>• id: UUID (PK)</div>
                  <div>• workflow_id: UUID (FK)</div>
                  <div>• document_id: UUID (FK)</div>
                  <div>• step_type: VARCHAR(50)</div>
                  <div>• config: JSONB</div>
                </div>
              </div>

              {/* ENROLLMENTS */}
              <div className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">ENROLLMENTS</span>
                  <span className="text-[10px] font-mono text-stone-500">Worker Queue State</span>
                </div>
                <div className="font-mono text-xs text-stone-300 space-y-1 bg-[#0D1117] p-3 rounded-xl">
                  <div>• id: UUID (PK)</div>
                  <div>• subscriber_id: UUID (FK)</div>
                  <div>• current_step_id: UUID</div>
                  <div>• wake_at: TIMESTAMP</div>
                  <div>• status: VARCHAR(50)</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: 4-Phase Build Order (SL8) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4 animate-in fade-in">
            {[
              {
                phase: 'Phase 1',
                title: 'Block Schema, Single-Screen Editor & Campaigns End-to-End',
                desc: 'Universal JSON document schema, Email table HTML renderer (600px), segment dispatch with deduplication, and BullMQ worker queue integration.',
                completed: true
              },
              {
                phase: 'Phase 2',
                title: 'Form Context & Web Renderer',
                desc: 'CTA-to-Input slot transformation, vanilla JS embed script generator, double opt-in toggle, and hosted opt-in pages.',
                completed: true
              },
              {
                phase: 'Phase 3',
                title: 'Workflow Engine & Branching Simulator',
                desc: 'Subscriber enrollments on form submission triggers, delay timer wake_at worker cycle, and webhook condition evaluations (Opened welcome email -> Discount vs Reminder).',
                completed: true
              },
              {
                phase: 'Phase 4',
                title: 'Template Library & Global Brand Kit Synchronizer',
                desc: 'Fork-on-use architecture, preset gallery, and cross-channel brand styling synchronization.',
                completed: true
              }
            ].map((p, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#161B22] border border-stone-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {p.phase} • Complete
                    </span>
                    <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
