import React, { useState } from 'react';
import { AgentInfo, AuditLogEntry, ViewKey } from '../../types';

interface AiAgentsViewProps {
  agents: AgentInfo[];
  auditLogs: AuditLogEntry[];
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const AiAgentsView: React.FC<AiAgentsViewProps> = ({
  agents,
  auditLogs,
  onNavigate,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'aura status',
      output:
        'AURA Swarm v1.4.0: 13/13 agents synchronized. AST cache: 84k nodes. Security gate: 1 Critical blocked. Docker isolation: OK.',
    },
    {
      cmd: 'aura doctor',
      output:
        '[PASS] AST Parser (0.42ms)\n[PASS] Semgrep Engine (ruleset: owasp-top10)\n[PASS] Pytest Sandbox (aura-sandbox-c1 online)\n[WARN] 1 SQL Injection pending human authorization in PROP-024.',
    },
  ]);

  const filteredAgents = agents.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let output = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      output =
        'Available AURA commands:\n  aura status            - Print swarm health and agent statuses\n  aura analyze           - Run full AST taint and complexity analysis\n  aura security          - Review active security findings\n  aura impact <file>     - Compute blast radius of file\n  aura doctor            - Run local diagnostics on Docker sandbox & AST\n  aura test              - Execute deterministic pytest in sandbox\n  aura heal              - Trigger incident correlation and self-healing\n  aura refactor          - Synthesize AST-compliant parameter patch\n  clear                  - Clear terminal buffer';
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lower === 'aura status') {
      output = 'AURA Swarm v1.4.0: 13/13 agents active. Cluster: us-east-auracore-01. Consensus: 4/4.';
    } else if (lower === 'aura analyze') {
      output = 'Dispatched AST scanner across 142 files. Indexed 84k symbols. Found 1 SQL injection in backend/auth.py:47.';
      onShowToast('Analysis run complete.', 'bolt');
    } else if (lower === 'aura security') {
      output = 'SEC-001: Critical CWE-89 in backend/auth.py:47 [BLOCKING]\nSEC-002: Hardcoded JWT secret in config/jwt.py:14 [TRIAGED]\nSEC-003: Unsafe deserialization in workers/tasks.py:82';
    } else if (lower.startsWith('aura impact')) {
      output = 'Blast radius for backend/auth.py: 18 coupled files, 7 endpoints, 2 breaking API routes.';
    } else if (lower === 'aura test') {
      output = 'Docker container aura-sandbox-c1 running: 12 passed in 842ms. Zero flakiness detected.';
    } else if (lower === 'aura refactor') {
      output = 'Generated Refactoring Proposal #24: Parameterized query binding staged for human review.';
    } else if (lower === 'aura doctor') {
      output = 'Doctor diagnosis: Docker sandbox ONLINE. Telemetry stream SYNCED. All 13 agents healthy.';
    } else if (lower === 'aura heal') {
      output = 'Correlating incidents: INC-001 diagnosed as connection pool starvation. Recovery patch generated.';
    } else {
      output = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd, output }]);
    setTerminalInput('');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            Multi-Agent Swarm Orchestration & Structured Message Bus
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            13 COGNITIVE SPECIALISTS (Sections 4 & 5)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#00f0ff]">
            Context Latency: 0.42ms
          </span>
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#65f2b5]">
            Consensus: 4/4 Verified
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Swarm Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-[#161c28] p-1 rounded-lg border border-[#3b494b]/30">
            {[
              { key: 'all', label: 'All Agents (13)' },
              { key: 'coordinator', label: 'Coordinators' },
              { key: 'analyzer', label: 'Analyzers' },
              { key: 'executor', label: 'Executors' },
              { key: 'reliability', label: 'Reliability & SRE' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeCategory === tab.key
                    ? 'bg-[#00f0ff] text-[#00363a] font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-[#b9cacb] hover:text-[#dde2f3] hover:bg-[#242a36]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onShowToast('All 13 agent neural weights re-synchronized with AST graph.', 'sync')}
            className="px-3 py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-xs text-[#00f0ff] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">sync</span>
            <span>Sync Swarm</span>
          </button>
        </div>

        {/* 13 Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2 hover:border-[#00f0ff] transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#dde2f3] leading-tight group-hover:text-[#00f0ff]">
                        {agent.name}
                      </h4>
                      <span className="text-[10px] text-[#849495]">{agent.codeName}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      agent.status === 'alert'
                        ? 'bg-[#93000a] text-[#ffdad6]'
                        : agent.status === 'active'
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        : agent.status === 'reviewing'
                        ? 'bg-[#571bc1]/30 text-[#d0bcff]'
                        : 'bg-[#65f2b5]/10 text-[#65f2b5]'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="text-[10px] text-[#b9cacb] flex items-center justify-between bg-[#080e1a] px-2 py-1 rounded">
                  <span>Model: {agent.model}</span>
                  <span className="text-[#00dbe9]">{agent.latency}</span>
                </div>

                <p className="text-xs text-[#b9cacb] leading-relaxed line-clamp-2 font-sans">
                  {agent.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#3b494b]/20 text-[10px] flex items-center justify-between text-[#849495]">
                <span>Trace: {agent.traceId}</span>
                <span className="text-[#00f0ff] font-bold group-hover:underline">Inspect Agent &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Developer CLI Terminal & PostgreSQL Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* CLI Terminal (8 Cols) */}
          <div className="lg:col-span-8 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#00f0ff]">terminal</span>
                <span className="text-xs text-[#dde2f3] font-semibold">
                  AURA Swarm Developer CLI (Section 26)
                </span>
              </div>
              <span className="text-[10px] text-[#849495]">Type 'help' for commands</span>
            </div>

            <div className="h-64 overflow-y-auto text-xs p-3 bg-[#080e1a] rounded-lg border border-[#3b494b]/30 space-y-2 select-text">
              <div className="text-[#849495] text-[11px]">
                AURA Autonomous Runtime v1.4.0 [x86_64-linux-gnu]
                <br />
                Type `help` to list commands or `aura doctor` to inspect sandboxes.
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[#00f0ff] flex items-center gap-1.5">
                    <span className="text-[#849495]">&gt;</span>
                    <span className="font-semibold">{item.cmd}</span>
                  </div>
                  <pre className="text-[#b9cacb] text-[11px] whitespace-pre-wrap font-mono pl-3">
                    {item.output}
                  </pre>
                </div>
              ))}

              <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 pt-1">
                <span className="text-[#00f0ff] font-bold">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="aura analyze, aura impact backend/auth.py, aura doctor..."
                  className="w-full bg-transparent text-[#dde2f3] outline-none text-xs placeholder:text-[#849495]"
                />
              </form>
            </div>
          </div>

          {/* Immutable Audit Trail (4 Cols) */}
          <div className="lg:col-span-4 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
              <span className="text-xs text-[#dde2f3] font-semibold">Immutable Audit Trail</span>
              <span className="text-[10px] text-[#65f2b5]">Ed25519</span>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#00dbe9] font-bold">{log.tag}</span>
                    <span className="text-[#849495]">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#b9cacb] font-sans">{log.message}</p>
                  <div className="text-[9px] text-[#849495] truncate">Sig: {log.hash}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('audit-logs')}
              className="w-full py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#00f0ff] text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Complete Audit Ledger</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structured Agent Inspector Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161c28] border border-[#00f0ff]/50 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f0ff] text-[22px]">psychology</span>
                <div>
                  <h3 className="text-sm font-bold text-[#dde2f3]">{selectedAgent.name}</h3>
                  <span className="text-[11px] text-[#849495]">{selectedAgent.codeName} &bull; Category: {selectedAgent.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-[#849495] hover:text-[#dde2f3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Agent Metadata Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#080e1a] p-2 rounded border border-[#3b494b]/20">
                <span className="text-[10px] text-[#849495] block">MODEL</span>
                <span className="text-[#00f0ff] font-bold">{selectedAgent.model}</span>
              </div>
              <div className="bg-[#080e1a] p-2 rounded border border-[#3b494b]/20">
                <span className="text-[10px] text-[#849495] block">CONFIDENCE</span>
                <span className="text-[#65f2b5] font-bold">{selectedAgent.confidence || 94}%</span>
              </div>
              <div className="bg-[#080e1a] p-2 rounded border border-[#3b494b]/20">
                <span className="text-[10px] text-[#849495] block">EXEC LATENCY</span>
                <span className="text-[#00dbe9] font-bold">{selectedAgent.latency}</span>
              </div>
              <div className="bg-[#080e1a] p-2 rounded border border-[#3b494b]/20">
                <span className="text-[10px] text-[#849495] block">TRACE ID</span>
                <span className="text-[#dde2f3] font-bold">{selectedAgent.traceId}</span>
              </div>
            </div>

            {/* Structured JSON Message Exchange (Section 5 Standard) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#dde2f3]">Structured Message Exchange (Section 5 Schema)</span>
                <span className="text-[10px] text-[#65f2b5]">JSON VALIDATED</span>
              </div>
              <div className="bg-[#080e1a] p-3 rounded-lg border border-[#3b494b]/30 text-xs font-mono text-[#b9cacb] overflow-x-auto max-h-48">
                <pre>{JSON.stringify({
                  sender: selectedAgent.codeName,
                  recipient: "OrchestratorAgent",
                  task_id: `TASK-${selectedAgent.traceId.toUpperCase()}`,
                  message_type: "ANALYSIS_AND_PROPOSAL",
                  confidence: (selectedAgent.confidence || 94) / 100,
                  context_summary: selectedAgent.description,
                  artifacts: [
                    "ast_path: backend.auth.authenticate_user",
                    "cwe: CWE-89",
                    "pytest_file: tests/test_auth.py",
                    "sandbox_container: aura-sandbox-c1"
                  ],
                  timestamp: new Date().toISOString()
                }, null, 2)}</pre>
              </div>
            </div>

            {/* Cognitive Mission & Guardrails */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#dde2f3]">System Guardrails & Sandboxing</span>
              <p className="text-[#b9cacb] font-sans">
                This agent operates under strict determinism boundaries. It cannot apply patches directly to production without human approval gate validation. All code execution runs in ephemeral Docker sandboxes with no host socket access.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3b494b]/30">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-1.5 rounded bg-[#242a36] text-[#dde2f3] hover:bg-[#343946] text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
