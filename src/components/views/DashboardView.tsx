import React, { useState } from 'react';
import { AgentInfo, RefactoringProposal } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: any) => void;
  onShowToast: (msg: string, icon?: string) => void;
  proposal: RefactoringProposal;
  agents: AgentInfo[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onShowToast,
  proposal,
  agents,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeCycle, setActiveCycle] = useState(492);
  const [streamLogs, setStreamLogs] = useState<string[]>([
    '[10:14:02] [MANAGER] Dispatched task SEC-SCAN-402 to SecurityAgent',
    '[10:14:05] [SECURITY] Potential SQL injection flagged in backend/auth.py:47 (Confidence: 0.94)',
    '[10:14:08] [DEVELOPER] Synthesizing AST-compliant parameterized patch',
    '[10:14:12] [DOCKER-SB] Running pytest in container aura-sandbox-c1...',
    '[10:14:15] [DOCKER-SB] ✓ All 12 regression tests passed in 842ms. Zero flakiness.',
    '[10:14:18] [ORCHESTRATOR] Patch staged as PROP-024. Blocked for human operator signoff.',
    '[10:14:22] [TELEMETRY] Awaiting command input_',
  ]);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    onShowToast('Dispatched Full Multi-Agent Swarm Analysis across 142 files...', 'bolt');
    setTimeout(() => {
      setAnalyzing(false);
      setActiveCycle((c) => c + 1);
      setStreamLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] [SWARM] Analysis cycle #${activeCycle + 1} completed across 142 files. Zero contract breakage detected.`,
        ...prev,
      ]);
      onShowToast('Analysis Complete: Context AST verified. 1 Security gate pending approval.', 'task_alt');
    }, 1800);
  };

  const handleApproveProposal = () => {
    onShowToast('PROP-024: Applied to branch refactor/aura-patch-auth-fix deterministically.', 'verified');
    onNavigate('refactoring');
  };

  const handleExportJsonl = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(streamLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_telemetry_trace_cycle_${activeCycle}.jsonl`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported trace to aura_telemetry_trace.jsonl', 'receipt_long');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* Command Center Header HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] animate-pulse"></span>
          <span className="text-xs text-[#dbfcff] uppercase tracking-widest font-mono font-semibold">
            Mission Control
          </span>
          <span className="text-[10px] text-[#849495] font-mono px-1.5 py-0.5 rounded bg-[#242a36]">
            CLUSTER: us-east-auracore-01
          </span>
          <span className="hidden md:inline text-[10px] text-[#b9cacb] font-mono">
            PID: 9024 // EPOCH: 1714205820
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#b9cacb] text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a202c]">
            <span className="material-symbols-outlined text-[14px] text-[#65f2b5]">memory</span>
            <span className="text-[#dde2f3]">vCPU: 18.2%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a202c]">
            <span className="material-symbols-outlined text-[14px] text-[#00dbe9]">speed</span>
            <span className="text-[#dde2f3]">P99: 142ms</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a202c] text-[#65f2b5]">
            <span className="material-symbols-outlined text-[14px]">sensors</span>
            <span>STREAM SYNCED</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Top Stats Overview Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* 1. Repository Health */}
          <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#00f0ff]/5 blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#849495] font-mono font-medium">
                  Repository Health
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#dbfcff] font-bold tracking-tight">91.4</span>
                  <span className="text-xs text-[#b9cacb] font-mono">/ 100</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#65f2b5]/10 text-[#65f2b5] text-[10px] font-mono font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +2.1%
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[#b9cacb] text-[10px] font-mono">
              <span>32 repos indexed</span>
              <span className="text-[#849495]">•</span>
              <span>142k LoC analyzed</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#2f3542] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00dbe9] to-[#65f2b5] rounded-full w-[91.4%]"></div>
            </div>
          </div>

          {/* 2. Active Multi-Agents */}
          <div
            onClick={() => onNavigate('ai-agents')}
            className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg relative overflow-hidden group cursor-pointer hover:border-[#d0bcff]/40 transition-colors"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#d0bcff]/5 blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#849495] font-mono font-medium">
                  Multi-Agent Swarm
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#d0bcff] font-bold tracking-tight">13</span>
                  <span className="text-xs text-[#d0bcff] font-mono">Agents Active</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#571bc1]/20 text-[#d0bcff] text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-ping"></span> 7 Running
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[#b9cacb] text-[10px] font-mono">
              <span className="text-[#d0bcff] font-medium">Orchestrator active</span>
              <span className="text-[#849495]">•</span>
              <span>Context engine live</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#2f3542] rounded-full overflow-hidden flex gap-0.5">
              <div className="h-full bg-[#d0bcff] rounded-full w-7/12"></div>
              <div className="h-full bg-[#65f2b5] rounded-full w-3/12"></div>
              <div className="h-full bg-[#343946] rounded-full w-2/12"></div>
            </div>
          </div>

          {/* 3. Security Vulnerabilities */}
          <div
            onClick={() => onNavigate('security-center')}
            className="bg-[#161c28] p-3.5 rounded-xl border border-[#ffb4ab]/20 shadow-lg relative overflow-hidden group cursor-pointer hover:border-[#ffb4ab]/50 transition-colors"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#93000a]/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#ffb4ab] font-mono font-medium">
                  Security Posture
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl text-[#ffb4ab] font-bold tracking-tight">1</span>
                  <span className="text-[10px] text-[#ffb4ab] uppercase font-semibold font-mono">Crit</span>
                  <span className="text-lg text-[#dde2f3] ml-2 font-bold">3</span>
                  <span className="text-[10px] text-[#b9cacb] font-mono">High</span>
                  <span className="text-lg text-[#dde2f3] ml-1 font-bold">6</span>
                  <span className="text-[10px] text-[#b9cacb] font-mono">Med</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#93000a] text-[#ffdad6] text-[10px] font-mono font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">gpp_maybe</span> Action Req
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[#b9cacb] text-[10px] font-mono truncate">
              <span className="text-[#ffb4ab] truncate">backend/auth.py:47 SQLi</span>
              <span className="text-[#00f0ff] hover:underline cursor-pointer ml-1 shrink-0 font-medium">
                Patch Ready
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#2f3542] rounded-full overflow-hidden flex gap-1">
              <div className="h-full bg-[#ffb4ab] rounded-full w-2/12"></div>
              <div className="h-full bg-amber-400 rounded-full w-4/12"></div>
              <div className="h-full bg-[#343946] rounded-full w-6/12"></div>
            </div>
          </div>

          {/* 4. CI/CD Self-Healing */}
          <div
            onClick={() => onNavigate('self-healing')}
            className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg relative overflow-hidden group cursor-pointer hover:border-[#65f2b5]/40 transition-colors"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#65f2b5]/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#849495] font-mono font-medium">
                  Autonomous Remediation
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-[#d8ffe7] font-bold tracking-tight">100%</span>
                  <span className="text-xs text-[#4edea3] font-mono">Healed</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#65f2b5]/10 text-[#65f2b5] text-[10px] font-mono font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span> 0 Failures
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[#b9cacb] text-[10px] font-mono">
              <span>INC-084 auto-fixed</span>
              <span className="text-[#849495]">•</span>
              <span className="text-[#00f0ff]">Δt: 1.4s recovery</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#2f3542] rounded-full overflow-hidden">
              <div className="h-full bg-[#65f2b5] rounded-full w-full"></div>
            </div>
          </div>
        </section>

        {/* Main Content Workspace: Left 8 Cols, Right 4 Cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* LEFT COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            {/* Active Repository Context Banner */}
            <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-l from-[#00f0ff]/10 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#00f0ff] text-[#00363a] text-[10px] font-mono font-bold uppercase tracking-wider">
                      Target Monolith
                    </span>
                    <span className="text-lg text-[#dde2f3] font-bold">demo-ecommerce-api</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a202c] text-[#b9cacb] text-[10px] font-mono">
                      <span className="material-symbols-outlined text-[14px]">commit</span>
                      <span className="text-[#00dbe9]">4a9f81d</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[#b9cacb] text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#849495]">fork_right</span>
                      branch: <strong className="text-[#dde2f3] ml-0.5">main</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#849495]">terminal</span>
                      Python 3.12 / FastAPI
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#849495]">database</span>
                      Postgres 16 (AWS RDS Aurora)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={analyzing}
                    className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] transition-all text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(0,240,255,0.35)] cursor-pointer disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${analyzing ? 'animate-spin' : ''}`}>
                      {analyzing ? 'autorenew' : 'bolt'}
                    </span>
                    <span>{analyzing ? 'Analyzing Swarm...' : 'Run Full Multi-Agent Analysis'}</span>
                  </button>
                  <div className="flex items-center gap-2 text-[#b9cacb] text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#242a36] text-[#00dbe9]">aura analyze --deep</span>
                    <span>Press ⌘+Shift+A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* End-to-End Workflow Pipeline Tracker */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">account_tree</span>
                  <span className="text-sm text-[#dde2f3] font-semibold">Autonomous Lifecycle Pipeline Tracker</span>
                </div>
                <span className="text-[10px] text-[#b9cacb] font-mono">CYCLE #{activeCycle} // 8 PHASES</span>
              </div>

              {/* Pipeline Horizontal Sequence */}
              <div className="overflow-x-auto pb-1">
                <div className="flex items-center min-w-[700px] justify-between relative py-2 px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#2f3542] z-0"></div>

                  {/* 1. Connect */}
                  <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Connect</span>
                    <span className="text-[9px] text-[#65f2b5] font-mono">DONE</span>
                  </div>

                  {/* 2. Indexing */}
                  <div className="relative z-10 flex flex-col items-center group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Indexing</span>
                    <span className="text-[9px] text-[#65f2b5] font-mono">DONE</span>
                  </div>

                  {/* 3. Context AST */}
                  <div
                    onClick={() => onNavigate('context-engine')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Context AST</span>
                    <span className="text-[9px] text-[#65f2b5] font-mono">DONE</span>
                  </div>

                  {/* 4. Agent Scan */}
                  <div
                    onClick={() => onNavigate('security-center')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Agent Scan</span>
                    <span className="text-[9px] text-[#65f2b5] font-mono">DONE</span>
                  </div>

                  {/* 5. Refactor & Diff */}
                  <div
                    onClick={() => onNavigate('refactoring')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#d0bcff] text-[#3c0091] flex items-center justify-center shadow-lg ring-4 ring-[#d0bcff]/20 animate-pulse">
                      <span className="material-symbols-outlined text-[16px]">rule_settings</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#d0bcff] mt-1.5">Refactor & Diff</span>
                    <span className="text-[9px] text-[#e9ddff] uppercase font-semibold font-mono">APPROVAL REQ</span>
                  </div>

                  {/* 6. Sandbox Tests */}
                  <div
                    onClick={() => onNavigate('test-suite')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#65f2b5]/20 text-[#65f2b5] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Sandbox Tests</span>
                    <span className="text-[9px] text-[#65f2b5] font-mono">12/12 PASS</span>
                  </div>

                  {/* 7. Deploy */}
                  <div
                    onClick={() => onNavigate('ci-cd-pipeline')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#242a36] text-[#7df4ff] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Deploy</span>
                    <span className="text-[9px] text-[#00dbe9] font-mono">QUEUED READY</span>
                  </div>

                  {/* 8. Self-Heal */}
                  <div
                    onClick={() => onNavigate('self-healing')}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#242a36] text-[#d0bcff] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[16px]">healing</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#dde2f3] mt-1.5">Self-Heal</span>
                    <span className="text-[9px] text-[#d0bcff] font-mono">WATCHING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Autonomous Agent Matrix (Top 6 Agents) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">neurology</span>
                  <span className="text-sm text-[#dde2f3] font-semibold">Real-Time Autonomous Agent Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#849495]">Arbitration protocol:</span>
                  <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#65f2b5] text-[10px] font-mono">
                    Consensus 4/4
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {agents.slice(0, 6).map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => onNavigate('ai-agents')}
                    className="bg-[#161c28] p-3 rounded-xl border border-[#3b494b]/30 shadow-md hover:border-[#00f0ff]/30 transition-all space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[15px]">psychology</span>
                        </div>
                        <div>
                          <h4 className="text-xs text-[#dde2f3] font-semibold leading-tight">{agent.name}</h4>
                          <span className="text-[10px] text-[#849495] font-mono">{agent.codeName}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium flex items-center gap-1 ${
                        agent.status === 'alert'
                          ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                          : agent.status === 'active'
                          ? 'bg-[#00f0ff]/20 text-[#00dbe9]'
                          : agent.status === 'reviewing'
                          ? 'bg-[#571bc1]/20 text-[#d0bcff]'
                          : 'bg-[#65f2b5]/10 text-[#65f2b5]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'alert' ? 'bg-[#ffb4ab] animate-ping' : 'bg-current'}`}></span>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#b9cacb] line-clamp-2 leading-relaxed font-sans">{agent.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono border-t border-[#3b494b]/20 text-[#b9cacb]">
                      <span>
                        Confidence: <strong className="text-[#65f2b5]">{agent.confidence || 95}%</strong>
                      </span>
                      <span className="text-[#849495]">{agent.traceId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Cluster Nodes & Semantic Mesh */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#dde2f3] font-semibold">Dynamic Cluster Nodes & Semantic Mesh</span>
                <span className="text-[10px] text-[#00f0ff] font-mono">LIVE TOPOLOGY</span>
              </div>
              <div className="relative w-full h-36 bg-[#080e1a] rounded-lg overflow-hidden flex items-center justify-center border border-[#3b494b]/30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="cyanLine" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  <line stroke="url(#cyanLine)" strokeDasharray="4,4" strokeWidth="2" x1="70" x2="210" y1="68" y2="68" />
                  <line stroke="#00f0ff" strokeOpacity="0.5" strokeWidth="1.5" x1="210" x2="360" y1="68" y2="35" />
                  <line stroke="#d0bcff" strokeOpacity="0.5" strokeWidth="1.5" x1="210" x2="360" y1="68" y2="100" />
                  <line stroke="#65f2b5" strokeOpacity="0.6" strokeWidth="1.5" x1="360" x2="500" y1="35" y2="68" />
                  <line stroke="#65f2b5" strokeOpacity="0.6" strokeWidth="1.5" x1="360" x2="500" y1="100" y2="68" />
                  <line stroke="#65f2b5" strokeWidth="2" x1="500" x2="640" y1="68" y2="68" />
                </svg>

                {/* Overlaid interactive nodes */}
                <div className="absolute left-6 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#242a36] border border-[#3b494b]/40 flex items-center justify-center text-[#00f0ff] shadow-lg">
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                  </div>
                  <span className="text-[9px] text-[#b9cacb] font-mono mt-1">Ingest: API</span>
                </div>

                <div className="absolute left-[180px] flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <span className="text-[9px] text-[#00f0ff] font-mono mt-1">Orchestrator</span>
                </div>

                <div className="absolute left-[330px] top-2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#242a36] border border-[#3b494b]/40 flex items-center justify-center text-[#d0bcff] shadow-md">
                    <span className="material-symbols-outlined text-[16px]">security</span>
                  </div>
                  <span className="text-[9px] text-[#b9cacb] font-mono mt-0.5">AST Sec</span>
                </div>

                <div className="absolute left-[330px] bottom-2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#242a36] border border-[#3b494b]/40 flex items-center justify-center text-[#d0bcff] shadow-md">
                    <span className="material-symbols-outlined text-[16px]">difference</span>
                  </div>
                  <span className="text-[9px] text-[#b9cacb] font-mono mt-0.5">Refactor Unit</span>
                </div>

                <div className="absolute left-[470px] flex flex-col items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#242a36] border border-[#65f2b5]/40 flex items-center justify-center text-[#65f2b5] shadow-md">
                    <span className="material-symbols-outlined text-[18px]">deployed_code</span>
                  </div>
                  <span className="text-[9px] text-[#65f2b5] font-mono mt-1">Sandbox C1</span>
                </div>

                <div className="absolute right-6 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#65f2b5]/20 border border-[#65f2b5]/40 flex items-center justify-center text-[#65f2b5] shadow-[0_0_12px_rgba(101,242,181,0.2)]">
                    <span className="material-symbols-outlined text-[20px]">rocket</span>
                  </div>
                  <span className="text-[9px] text-[#65f2b5] font-mono mt-1">Production</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (4 Cols): Human in Loop Queue & Logs */}
          <div className="lg:col-span-4 space-y-3">
            {/* Human-in-the-Loop Approval Queue */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#d0bcff]/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d0bcff] animate-ping"></span>
                  <h3 className="text-sm text-[#dde2f3] font-semibold">Human-in-the-Loop Queue</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#571bc1]/20 text-[#d0bcff] text-[10px] font-mono font-semibold uppercase">
                  1 Pending
                </span>
              </div>

              {/* Proposal Card */}
              <div className="bg-[#1a202c] p-3 rounded-lg border border-[#3b494b]/30 space-y-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00f0ff] font-mono font-semibold">PROP-024</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 text-[9px] font-mono font-semibold">
                      RISK: MEDIUM
                    </span>
                  </div>
                  <h4 className="text-xs text-[#dde2f3] font-semibold mt-1 leading-snug">
                    Deduplicate authentication middleware & fix SQL injection
                  </h4>
                </div>

                {/* Scope metadata */}
                <div className="p-2 rounded bg-[#080e1a] text-[10px] font-mono space-y-1">
                  <div className="flex items-center justify-between text-[#b9cacb]">
                    <span>Target:</span>
                    <span className="text-[#dde2f3]">backend/auth.py</span>
                  </div>
                  <div className="flex items-center justify-between text-[#b9cacb]">
                    <span>Sandbox Verification:</span>
                    <span className="text-[#65f2b5] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span> 12/12 pytest passed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#b9cacb]">
                    <span>Synthesized By:</span>
                    <span className="text-[#d0bcff]">RefactoringAgent v1.4</span>
                  </div>
                </div>

                {/* Mini Git Diff visual snippet */}
                <div className="p-2 rounded bg-[#080e1a] font-mono text-[10px] leading-tight space-y-1 overflow-x-auto text-[#b9cacb] border border-[#3b494b]/20">
                  <div className="text-[#ffb4ab] bg-[#93000a]/20 px-1 py-0.5 rounded">
                    - query = f"SELECT * FROM users WHERE id='&#123;user_id&#125;'"
                  </div>
                  <div className="text-[#65f2b5] bg-[#65f2b5]/10 px-1 py-0.5 rounded">
                    + query = "SELECT * FROM users WHERE id = :id"
                  </div>
                  <div className="text-[#65f2b5] bg-[#65f2b5]/10 px-1 py-0.5 rounded">
                    + res = await db.execute(query, &#123;"id": user_id&#125;)
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[11px]">
                  <button
                    onClick={() => onNavigate('refactoring')}
                    className="py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>Diff</span>
                  </button>
                  <button
                    onClick={handleApproveProposal}
                    className="py-1.5 rounded bg-[#65f2b5] text-[#002113] hover:opacity-90 font-semibold transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(101,242,181,0.25)] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">merge_type</span>
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onShowToast('Proposal #24 marked as rejected by human engineer.', 'cancel')}
                    className="py-1.5 rounded bg-[#242a36] hover:bg-[#93000a]/30 hover:text-[#ffdad6] text-[#b9cacb] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Swarm Execution Log */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-lg space-y-2 flex flex-col">
              <div className="flex items-center justify-between pb-1 border-b border-[#3b494b]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">terminal</span>
                  <span className="text-xs text-[#dde2f3] font-semibold">Live Swarm Execution Log</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65f2b5] animate-pulse"></span>
                  <span className="text-[9px] text-[#65f2b5] uppercase font-mono">STREAMING</span>
                </div>
              </div>

              <div className="h-56 overflow-y-auto font-mono text-[10px] leading-relaxed p-2.5 bg-[#080e1a] rounded-lg space-y-1.5 text-[#b9cacb] border border-[#3b494b]/30 select-text">
                {streamLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <span className="text-[#dde2f3] font-sans">{log}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[#b9cacb] text-[10px] font-mono pt-1">
                <span className="text-[#849495]">Buffer: {streamLogs.length}/1000 lines</span>
                <button
                  onClick={handleExportJsonl}
                  className="text-[#00f0ff] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">download</span>
                  <span>Export .jsonl trace</span>
                </button>
              </div>
            </div>

            {/* Self-Healing Sentinel Widget */}
            <div className="bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#dde2f3] font-semibold">Self-Healing Sentinel</span>
                <span className="text-[10px] text-[#65f2b5] font-mono">SLA 99.99%</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#1a202c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#65f2b5]">check_circle</span>
                    <div>
                      <div className="text-[#dde2f3] text-[11px] font-medium font-sans">Auto-Restart Worker #4</div>
                      <div className="text-[#849495] text-[9px]">OOM spike handled gracefully</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4edea3]">0.4s ago</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#1a202c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#65f2b5]">healing</span>
                    <div>
                      <div className="text-[#dde2f3] text-[11px] font-medium font-sans">DB Connection Pool Flush</div>
                      <div className="text-[#849495] text-[9px]">Deadlock averted automatically</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#4edea3]">12m ago</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#1a202c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">swap_horiz</span>
                    <div>
                      <div className="text-[#dde2f3] text-[11px] font-medium font-sans">Traffic Route Diverted</div>
                      <div className="text-[#849495] text-[9px]">Canary v1.40 deployment validated</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00dbe9]">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
