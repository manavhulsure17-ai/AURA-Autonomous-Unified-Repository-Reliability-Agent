import React, { useState } from 'react';
import { PipelineStage, ViewKey } from '../../types';

interface SelfHealingViewProps {
  stages: PipelineStage[];
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const SelfHealingView: React.FC<SelfHealingViewProps> = ({
  stages: initialStages,
  onNavigate,
  onShowToast,
}) => {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recovered, setRecovered] = useState<boolean>(false);

  const handleExecuteRecovery = () => {
    setIsRecovering(true);
    onShowToast('Executing automated self-healing hotfix rollout to staging cluster...', 'auto_mode');
    setTimeout(() => {
      setIsRecovering(false);
      setRecovered(true);
      setStages((prev) =>
        prev.map((s) => {
          if (s.number === '07') return { ...s, status: 'passed', duration: 'RECOVERED (200 OK)', meta: 'P99 38ms' };
          if (s.number === '08') return { ...s, status: 'passed', duration: 'REMEDIED', meta: 'Fix deployed' };
          if (s.number === '09') return { ...s, status: 'passed', duration: 'DEPLOYED', meta: 'v1.4.3-healed' };
          return s;
        })
      );
      onShowToast('Self-Healing Complete: Incident INC-001 resolved. Cluster latency back to normal.', 'verified');
    }, 2000);
  };

  const handleRollback = () => {
    onShowToast('Rollback initiated to Deployment #41 (v1.4.1 stable).', 'undo');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${recovered ? 'bg-[#65f2b5]' : 'bg-[#ffb4ab] animate-ping'}`}></span>
          <span className="text-xs text-[#dde2f3] uppercase tracking-widest font-mono font-semibold">
            Automated CI/CD & Self-Healing Pipeline
          </span>
          <span className="text-[10px] text-[#ffdad6] font-mono px-1.5 py-0.5 rounded bg-[#93000a]">
            {recovered ? 'INCIDENT RESOLVED' : 'INC-001 CORRELATED'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[#1a202c] text-[#00f0ff]">
            Cluster: us-east-1 &bull; Target: demo-ecommerce-api
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Incident Alert Hero Banner */}
        <div className={`p-4 rounded-xl border shadow-xl transition-all ${
          recovered
            ? 'bg-[#161c28] border-[#65f2b5]/40'
            : 'bg-[#161c28] border-[#ffb4ab]/40 ring-1 ring-[#ffb4ab]/20'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  recovered ? 'bg-[#65f2b5] text-[#003824]' : 'bg-[#93000a] text-[#ffdad6]'
                }`}>
                  {recovered ? 'RESOLVED' : 'ACTIVE INCIDENT'}
                </span>
                <span className="text-lg text-[#dde2f3] font-bold">
                  INC-001: Database Connection Pool Starvation & 500 Outage
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#b9cacb]">
                <span>Correlated with Deployment #42 (commit 8f3c11d)</span>
                <span>•</span>
                <span className="text-[#00f0ff]">Root cause identified in 1.4s</span>
                <span>•</span>
                <span className="text-[#65f2b5]">Sandboxed remedy validated 50/50</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!recovered && (
                <button
                  onClick={handleExecuteRecovery}
                  disabled={isRecovering}
                  className="px-4 py-2 rounded-lg bg-[#65f2b5] text-[#002113] hover:opacity-90 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(101,242,181,0.3)] cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isRecovering ? 'animate-spin' : ''}`}>
                    {isRecovering ? 'refresh' : 'auto_mode'}
                  </span>
                  <span>{isRecovering ? 'Executing Recovery...' : 'Approve & Execute Self-Healing'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 9-Stage Autonomous Pipeline Matrix */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#dde2f3] font-semibold">9-Stage Autonomous Remediation Matrix</span>
            <span className="text-[10px] text-[#00dbe9] font-mono">DOCKER ENGINE VERIFIED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {stages.map((stg) => (
              <div
                key={stg.number}
                className={`p-2 rounded-lg border flex flex-col justify-between h-24 font-mono transition-all ${
                  stg.status === 'failed'
                    ? 'bg-[#93000a]/20 border-[#ffb4ab] text-[#ffdad6]'
                    : stg.status === 'active'
                    ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] animate-pulse'
                    : stg.status === 'passed'
                    ? 'bg-[#080e1a] border-[#65f2b5]/30 text-[#65f2b5]'
                    : 'bg-[#080e1a] border-[#3b494b]/30 text-[#849495]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span>{stg.number}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {stg.status === 'passed'
                      ? 'check_circle'
                      : stg.status === 'failed'
                      ? 'error'
                      : stg.status === 'active'
                      ? 'autorenew'
                      : 'schedule'}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#dde2f3] font-sans truncate">{stg.name}</div>
                <div className="text-[9px] truncate opacity-80">{stg.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Sparklines & Config Regression Diff */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Sparklines & Diagnostics (5 Cols) */}
          <div className="lg:col-span-5 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <span className="text-xs text-[#dde2f3] font-semibold">Telemetry Surge Telemetrics</span>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#b9cacb]">P99 Latency:</span>
                  <span className={recovered ? 'text-[#65f2b5]' : 'text-[#ffb4ab] font-bold'}>
                    {recovered ? '38ms (Healthy)' : '4,820ms (Spike)'}
                  </span>
                </div>
                <div className="h-6 w-full flex items-end gap-1">
                  {[20, 22, 25, 30, 45, 90, 100, 95, 80, recovered ? 15 : 90].map((val, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${val}%` }}
                      className={`flex-1 rounded-t ${recovered ? 'bg-[#65f2b5]' : 'bg-[#ffb4ab]'}`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#b9cacb]">DB Connection Pool:</span>
                  <span className={recovered ? 'text-[#65f2b5]' : 'text-amber-400 font-bold'}>
                    {recovered ? '18/50 Active (36%)' : '5/5 Saturating (100%)'}
                  </span>
                </div>
                <div className="h-2 bg-[#2f3542] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${recovered ? 'bg-[#65f2b5] w-[36%]' : 'bg-[#ffb4ab] w-full'}`}
                  ></div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#b9cacb]">HTTP 500 Refusal Rate:</span>
                  <span className={recovered ? 'text-[#65f2b5]' : 'text-[#ffb4ab] font-bold'}>
                    {recovered ? '0.00%' : '24.8% Requests Failing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Config Regression Diff & Sandbox Output (7 Cols) */}
          <div className="lg:col-span-7 bg-[#161c28] p-3.5 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#dde2f3] font-semibold">
                Synthesized Config Patch: <code className="text-[#00dbe9]">config/database.py</code>
              </span>
              <span className="text-[10px] text-[#65f2b5] font-mono">AST VALIDATED</span>
            </div>

            {/* Code Diff */}
            <div className="p-3 rounded bg-[#080e1a] font-mono text-xs leading-relaxed border border-[#3b494b]/20 select-text">
              <div className="text-[#849495]">@@ -15,5 +15,5 @@ class DatabaseConfig:</div>
              <div className="text-[#849495]">    pool_recycle = 3600</div>
              <div className="bg-[#93000a]/30 text-[#ffdad6] px-2 py-0.5 rounded -mx-1">
                -    max_pool_size = 5 # REGRESSION IN COMMIT 8f3c11d
              </div>
              <div className="bg-[#65f2b5]/20 text-[#65f2b5] px-2 py-0.5 rounded -mx-1 font-semibold">
                +    max_pool_size = 50 # HEALED: Restores pool buffer to handle 32 async workers
              </div>
              <div className="text-[#849495]">    pool_timeout = 30</div>
            </div>

            {/* Synthetic Sandbox Verification Node */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#b9cacb]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#65f2b5]">check_circle</span>
                  <span>Synthetic Sandbox Verification Logs (Container: aura-heal-sb8)</span>
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#080e1a] font-mono text-[11px] text-[#b9cacb] leading-relaxed border border-[#3b494b]/20 space-y-0.5">
                <div>[10:14:32 UTC] Injected healed database configuration</div>
                <div>[10:14:34 UTC] Executing load simulation: 50 concurrent checkout requests...</div>
                <div className="text-[#65f2b5] font-semibold">[10:14:35 UTC] P99 Latency: 38ms • Error Rate: 0.00% • All 50 passed.</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#3b494b]/30">
              <button
                onClick={handleRollback}
                className="px-3 py-1.5 rounded bg-[#242a36] hover:bg-[#343946] text-[#dde2f3] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">history</span>
                <span>Rollback to Deploy #41</span>
              </button>
              {!recovered && (
                <button
                  onClick={handleExecuteRecovery}
                  className="px-4 py-1.5 rounded bg-[#65f2b5] text-[#002113] hover:opacity-90 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>Authorize Hotfix</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
