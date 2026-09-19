import React, { useState } from 'react';
import { ImpactNode, ViewKey } from '../../types';

interface ChangeImpactViewProps {
  nodes: ImpactNode[];
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ChangeImpactView: React.FC<ChangeImpactViewProps> = ({
  nodes,
  onNavigate,
  onShowToast,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('backend/auth.py');
  const [queryInput, setQueryInput] = useState<string>(
    'Refactoring backend/auth.py to use asyncpg and parameterized queries'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'apis' | 'database' | 'env'>('apis');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleSimulate = (overrideQuery?: string) => {
    if (overrideQuery) setQueryInput(overrideQuery);
    setIsSimulating(true);
    onShowToast('Synthesizing AST call graph & transitive blast radius...', 'schema');
    setTimeout(() => {
      setIsSimulating(false);
      onShowToast('Impact simulation updated: 18 files coupled, 7 endpoints affected.', 'task_alt');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-mono font-semibold">
            Change Impact Synthesizer & Blast Radius Analyzer
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            AST TOKENS: 84,200 CACHED
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-amber-300 border border-amber-500/30">
            Overall Risk: MED-HIGH (68/100)
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Natural Query Search & Simulation Bar */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center bg-[#080e1a] px-3 py-2 rounded-lg border border-[#3b494b]/40 focus-within:border-[#00f0ff] transition-colors">
              <span className="material-symbols-outlined text-[18px] text-[#00f0ff] mr-2">search_check</span>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask what will break if you modify a file, class, or dependency..."
                className="w-full bg-transparent text-xs text-[#dde2f3] outline-none font-mono"
              />
            </div>
            <button
              onClick={() => handleSimulate()}
              disabled={isSimulating}
              className="px-4 py-2 bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_14px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSimulating ? 'animate-spin' : ''}`}>
                {isSimulating ? 'autorenew' : 'bolt'}
              </span>
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            <span className="text-[#849495]">Presets:</span>
            <button
              onClick={() => handleSimulate('Auth Service Replacement')}
              className="px-2 py-1 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] cursor-pointer"
            >
              Auth Service Replacement
            </button>
            <button
              onClick={() => handleSimulate('Database Migration to asyncpg')}
              className="px-2 py-1 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] cursor-pointer"
            >
              Database Migration to asyncpg
            </button>
            <button
              onClick={() => handleSimulate('Payment Gateway Upgrade to Stripe v14')}
              className="px-2 py-1 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] cursor-pointer"
            >
              Payment Gateway Upgrade
            </button>
          </div>
        </div>

        {/* 6 Blast Radius Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="bg-[#161c28] p-3 rounded-xl border border-amber-500/30 shadow-md">
            <span className="text-[10px] text-amber-300 uppercase font-mono font-medium">Overall Risk</span>
            <div className="text-xl font-bold text-amber-300 mt-1 font-mono">MED-HIGH</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">Blast Radius 68/100</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Affected Files</span>
            <div className="text-xl font-bold text-[#dde2f3] mt-1 font-mono">18 Files</div>
            <span className="text-[9px] text-[#00dbe9] font-mono">4 direct / 14 coupled</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Dependent APIs</span>
            <div className="text-xl font-bold text-[#dde2f3] mt-1 font-mono">7 Routes</div>
            <span className="text-[9px] text-[#ffb4ab] font-mono">3 broken signatures</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Test Coverage</span>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">4 Suites</div>
            <span className="text-[9px] text-amber-300 font-mono">14 test cases fail</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">DB Entities</span>
            <div className="text-xl font-bold text-[#dde2f3] mt-1 font-mono">2 Tables</div>
            <span className="text-[9px] text-[#b9cacb] font-mono">users, user_tokens</span>
          </div>

          <div className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md">
            <span className="text-[10px] text-[#849495] uppercase font-mono font-medium">Validation</span>
            <div className="text-xl font-bold text-[#65f2b5] mt-1 font-mono">2 / 4 Pass</div>
            <span className="text-[9px] text-[#65f2b5] font-mono">AST Tree Checked</span>
          </div>
        </div>

        {/* Interactive AST Graph (8 cols) & Node Inspector HUD (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Visual SVG Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">account_tree</span>
                <span className="text-xs text-[#dde2f3] font-semibold">
                  AST Call Hierarchy & Transitive Dependency Graph
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#849495]">
                <span>Click any node to inspect callers</span>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full h-[380px] bg-[#080e1a] rounded-lg border border-[#3b494b]/30 overflow-hidden select-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Connecting lines between source and dependent nodes */}
                <line x1="320" y1="260" x2="150" y2="90" stroke="#ffb4ab" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="320" y1="260" x2="550" y2="85" stroke="#f59e0b" strokeWidth="2" />
                <line x1="320" y1="260" x2="590" y2="255" stroke="#f59e0b" strokeWidth="2" />
                <line x1="320" y1="260" x2="160" y2="410" stroke="#00f0ff" strokeWidth="1.5" />
                <line x1="320" y1="260" x2="55" y2="220" stroke="#d0bcff" strokeWidth="1.5" />
                <line x1="550" y1="85" x2="690" y2="180" stroke="#65f2b5" strokeWidth="1.5" strokeDasharray="2,2" />
                <line x1="320" y1="260" x2="470" y2="480" stroke="#3b494b" strokeWidth="1" />
              </svg>

              {/* Render Nodes as absolutely positioned interactive HUD cards */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${Math.min(node.x, 620)}px`, top: `${Math.min(node.y, 300)}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg border transition-all cursor-pointer shadow-lg ${
                      isSelected
                        ? 'bg-[#242a36] border-[#00f0ff] ring-2 ring-[#00f0ff]/40 z-30 scale-105'
                        : node.type === 'source'
                        ? 'bg-[#1a202c] border-[#00f0ff]/60 z-20'
                        : node.type === 'critical'
                        ? 'bg-[#1a202c] border-[#ffb4ab]/60'
                        : node.type === 'high'
                        ? 'bg-[#1a202c] border-amber-500/60'
                        : 'bg-[#161c28] border-[#3b494b]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          node.type === 'source'
                            ? 'bg-[#00f0ff] animate-ping'
                            : node.type === 'critical'
                            ? 'bg-[#ffb4ab]'
                            : node.type === 'high'
                            ? 'bg-amber-400'
                            : 'bg-[#65f2b5]'
                        }`}
                      ></span>
                      <span className="text-[11px] font-bold text-[#dde2f3]">{node.label}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#b9cacb] mt-0.5">{node.severityText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Side HUD (4 Cols) */}
          <div className="lg:col-span-4 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
              <span className="text-xs text-[#dde2f3] font-semibold">Node Inspector</span>
              <span className="text-[10px] text-[#00f0ff] font-mono uppercase">{selectedNode.type}</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#849495]">Selected Target</div>
                <div className="text-sm font-bold text-[#dde2f3]">{selectedNode.label}</div>
              </div>

              <div className="p-2 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                <div className="text-[10px] text-[#b9cacb] flex justify-between">
                  <span>Impact Classification:</span>
                  <span className="text-amber-300 font-bold">{selectedNode.severityText}</span>
                </div>
                <div className="text-[10px] text-[#b9cacb] flex justify-between">
                  <span>Coupled Risk:</span>
                  <span className="text-[#dde2f3]">{selectedNode.subtitle}</span>
                </div>
              </div>

              {/* Upstream / Downstream Callers */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-[#849495] uppercase">Direct Callers (3)</span>
                <div className="p-1.5 rounded bg-[#1a202c] text-[10px] text-[#b9cacb] space-y-0.5">
                  <div>• api/v1/login.py :: login_post()</div>
                  <div>• api/v1/users.py :: get_current_user()</div>
                  <div>• middleware/jwt_auth.py :: dispatch()</div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-[#849495] uppercase">Transitive Downstream (4)</span>
                <div className="p-1.5 rounded bg-[#1a202c] text-[10px] text-[#b9cacb] space-y-0.5">
                  <div>• database/session.py :: async_sessionmaker</div>
                  <div>• services/checkout_service.py :: verify_order()</div>
                </div>
              </div>
            </div>

            {/* Actions for this node */}
            <div className="pt-2 border-t border-[#3b494b]/20 space-y-1.5">
              <button
                onClick={() => onShowToast(`Generated targeted test suite for ${selectedNode.label}`, 'task_alt')}
                className="w-full py-1.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#00363a] font-mono text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add_task</span>
                <span>Generate Targeted Tests</span>
              </button>
              <button
                onClick={() => onNavigate('refactoring')}
                className="w-full py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] font-mono text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
                <span>Stage Compatibility Patch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Impact Breakdown Drawer */}
        <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-[#3b494b]/30 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('apis')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === 'apis' ? 'bg-[#00f0ff] text-[#00363a] font-bold' : 'text-[#b9cacb] hover:text-[#dde2f3]'
                }`}
              >
                APIs (7)
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === 'database' ? 'bg-[#00f0ff] text-[#00363a] font-bold' : 'text-[#b9cacb] hover:text-[#dde2f3]'
                }`}
              >
                Database (2)
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === 'env' ? 'bg-[#00f0ff] text-[#00363a] font-bold' : 'text-[#b9cacb] hover:text-[#dde2f3]'
                }`}
              >
                CI/CD & Env (2)
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#849495]">SEVERITY SORTED</span>
          </div>

          {activeTab === 'apis' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-[#080e1a] border border-[#ffb4ab]/30 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">POST</span> /api/v1/auth/login
                  <div className="text-[10px] text-[#b9cacb]">Broken signature: requires `options.bind_params`</div>
                </div>
                <span className="text-[10px] text-[#ffb4ab] font-bold">BREAKING</span>
              </div>
              <div className="p-2 rounded bg-[#080e1a] border border-[#ffb4ab]/30 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">POST</span> /api/v1/auth/refresh
                  <div className="text-[10px] text-[#b9cacb]">Token verification protocol updated</div>
                </div>
                <span className="text-[10px] text-[#ffb4ab] font-bold">BREAKING</span>
              </div>
              <div className="p-2 rounded bg-[#080e1a] border border-[#3b494b]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#65f2b5] font-bold">GET</span> /api/v1/user/profile
                  <div className="text-[10px] text-[#b9cacb]">Transparent compatibility maintained</div>
                </div>
                <span className="text-[10px] text-[#65f2b5] font-bold">COMPATIBLE</span>
              </div>
              <div className="p-2 rounded bg-[#080e1a] border border-[#3b494b]/20 flex items-center justify-between">
                <div>
                  <span className="text-[#65f2b5] font-bold">GET</span> /api/v1/admin/audit
                  <div className="text-[10px] text-[#b9cacb]">Non-blocking downstream propagation</div>
                </div>
                <span className="text-[10px] text-[#65f2b5] font-bold">COMPATIBLE</span>
              </div>
            </div>
          ) : activeTab === 'database' ? (
            <div className="p-3 rounded bg-[#080e1a] font-mono text-xs space-y-2">
              <div className="text-[#dde2f3] font-bold">Table: users (Postgres 16)</div>
              <div className="text-[11px] text-[#b9cacb]">
                Schema remains unchanged. Prepared statement catalog created in Aurora connection cache.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded bg-[#080e1a] font-mono text-xs space-y-2">
              <div className="text-[#dde2f3] font-bold">Environment Variables:</div>
              <div className="text-[11px] text-[#b9cacb]">
                Requires <code className="text-[#00f0ff]">POSTGRES_POOL_SIZE &gt;= 20</code> to avoid asyncpg connection starvation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
