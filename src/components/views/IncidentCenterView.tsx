import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface IncidentCenterViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const IncidentCenterView: React.FC<IncidentCenterViewProps> = ({ onNavigate, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'correlation' | 'timeline'>('overview');
  const [incidentStatus, setIncidentStatus] = useState<'Active' | 'Mitigating' | 'Resolved'>('Active');

  const handleAuthorizeRecovery = () => {
    onShowToast('Incident INC-001: Authorized automated hotfix. Routing to Self-Healing...', 'verified');
    onNavigate('self-healing');
  };

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_#ffb4ab] animate-pulse"></span>
          <span className="text-xs text-[#ffb4ab] uppercase tracking-widest font-semibold">
            Incident Investigation Center (Section 25)
          </span>
          <span className="text-[10px] text-[#ffdad6] px-1.5 py-0.5 rounded bg-[#93000a]/40 font-bold">
            SEV-1 ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('telemetry')}
            className="px-2.5 py-1.5 rounded bg-[#242a36] hover:bg-[#323948] text-[#dde2f3] text-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">query_stats</span>
            <span>View Raw Telemetry</span>
          </button>
          <button
            onClick={handleAuthorizeRecovery}
            className="px-3 py-1.5 rounded bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">healing</span>
            <span>Review & Approve Recovery Plan &rarr;</span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Incident Summary Card */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#ffb4ab]/40 shadow-lg space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] text-xs font-bold font-mono">
                INC-001
              </span>
              <h2 className="text-sm font-bold text-[#dde2f3]">
                HTTP 500 Spike & Connection Pool Exhaustion on /api/v1/checkout
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#849495]">Status:</span>
              <span className="text-[#ffb4ab] font-bold uppercase">{incidentStatus}</span>
              <span className="text-[#849495]">&bull;</span>
              <span className="text-[#849495]">Triggered: 14 mins ago</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-[#3b494b]/20 text-xs">
            <div>
              <span className="text-[10px] text-[#849495] block">AFFECTED SERVICE</span>
              <span className="text-[#dde2f3] font-bold">demo-ecommerce-api / pods [xq9k2, p4lm8]</span>
            </div>
            <div>
              <span className="text-[10px] text-[#849495] block">RECENT DEPLOYMENT</span>
              <span className="text-[#ffb4ab] font-bold">Deployment #42 (18 mins ago)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#849495] block">CORRELATED COMMIT</span>
              <span className="text-[#00f0ff] font-bold">8f3c11d by dev-charlie</span>
            </div>
            <div>
              <span className="text-[10px] text-[#849495] block">ROOT CAUSE CONFIDENCE</span>
              <span className="text-[#65f2b5] font-bold">91% (Incident Agent)</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#3b494b]/30 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            <span>AI Investigation Report</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">speed</span>
            <span>Correlated Metrics & Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('correlation')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'correlation'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">compare</span>
            <span>Git Diff vs Telemetry Spike</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-[#00f0ff] text-[#00363a] font-bold'
                : 'text-[#b9cacb] hover:bg-[#242a36]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">timeline</span>
            <span>Event Timeline</span>
          </button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Col: Diagnostic Findings (7 Cols) */}
            <div className="lg:col-span-7 bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#3b494b]/20">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">verified_user</span>
                <h3 className="text-xs font-bold text-[#dde2f3]">Autonomous Incident Agent Findings</h3>
              </div>

              <div className="space-y-2 text-xs font-sans text-[#b9cacb]">
                <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#dde2f3] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">error</span>
                    <span>1. Telemetry Anomaly Detected</span>
                  </div>
                  <p className="text-[11px]">
                    At 10:14:10 UTC, 500 error rate surged from 0.01% to 18.4% within 90 seconds. P99 response time degraded from 38ms to 4,820ms.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#dde2f3] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#00f0ff]">git</span>
                    <span>2. Correlated Deployment #42 & Commit 8f3c11d</span>
                  </div>
                  <p className="text-[11px]">
                    Commit <code className="text-[#00f0ff]">8f3c11d</code> by dev-charlie lowered <code className="text-[#65f2b5]">max_pool_size</code> from 50 to 5 in <code className="text-[#dde2f3]">config/database.py:15</code>. Under concurrent load of 120 checkout requests, threads exhausted the 5-connection pool in 1.2s.
                  </p>
                </div>

                <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/20 space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#dde2f3] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#65f2b5]">healing</span>
                    <span>3. Synthesized Self-Healing Recovery Proposal</span>
                  </div>
                  <p className="text-[11px]">
                    Reliability Agent generated an AST configuration patch restoring <code className="text-[#65f2b5]">max_pool_size = 50</code> and adding dynamic pool autoscaling. Isolated Docker pytest passed in 1.4s.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#849495]">Awaiting human operator approval</span>
                <button
                  onClick={handleAuthorizeRecovery}
                  className="px-4 py-2 rounded bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Proceed to Self-Healing Rollout (Demo Step 18) &rarr;</span>
                </button>
              </div>
            </div>

            {/* Right Col: Error Logs & Stack Trace (5 Cols) */}
            <div className="lg:col-span-5 bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">bug_report</span>
                  <span className="text-xs font-bold text-[#dde2f3]">Extracted Stack Trace</span>
                </div>
                <span className="text-[10px] text-[#849495]">Pod: ecommerce-api-7b89-xq9k2</span>
              </div>

              <div className="bg-[#080e1a] rounded-lg p-3 text-[11px] font-mono space-y-1 text-[#ffb4ab] max-h-[380px] overflow-y-auto border border-[#3b494b]/20 leading-relaxed">
                <div>sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out, timeout 30.00</div>
                <div className="text-[#b9cacb] pl-2">File "/app/services/checkout_service.py", line 42, in process_order</div>
                <div className="text-[#dde2f3] pl-4">db = next(get_db())</div>
                <div className="text-[#b9cacb] pl-2">File "/app/config/database.py", line 28, in get_db</div>
                <div className="text-[#dde2f3] pl-4">db = SessionLocal()</div>
                <div className="text-[#849495] pt-2">--- OpenTelemetry Trace context ---</div>
                <div className="text-[#00dbe9]">trace_id: 4bf92f3577b34da6a3ce929d0e0e4736</div>
                <div className="text-[#00dbe9]">span_id: 00f067aa0ba902b7</div>
                <div className="text-[#00dbe9]">error.type: sqlalchemy.exc.TimeoutError</div>
                <div className="text-[#00dbe9]">http.status_code: 500</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
              <span className="text-xs font-bold text-[#dde2f3]">Correlated Real-time Metrics</span>
              <span className="text-[10px] text-[#65f2b5]">Ingested via OpenTelemetry Collector</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-[#080e1a] border border-[#ffb4ab]/30 space-y-1">
                <span className="text-[10px] text-[#849495]">P99 RESPONSE LATENCY</span>
                <div className="text-xl font-bold text-[#ffb4ab]">4,820 ms</div>
                <span className="text-[10px] text-[#ffb4ab] font-mono">▲ +12,500% over baseline (38ms)</span>
              </div>
              <div className="p-3 rounded bg-[#080e1a] border border-[#ffb4ab]/30 space-y-1">
                <span className="text-[10px] text-[#849495]">HTTP 500 ERROR RATE</span>
                <div className="text-xl font-bold text-[#ffb4ab]">18.4%</div>
                <span className="text-[10px] text-[#ffb4ab] font-mono">▲ Critical SLA violation (&gt;1%)</span>
              </div>
              <div className="p-3 rounded bg-[#080e1a] border border-[#3b494b]/30 space-y-1">
                <span className="text-[10px] text-[#849495]">POSTGRES CONNECTION POOL</span>
                <div className="text-xl font-bold text-amber-400">5 / 5 (100%)</div>
                <span className="text-[10px] text-amber-400 font-mono">Queue depth: 84 threads waiting</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Correlation */}
        {activeTab === 'correlation' && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
            <span className="text-xs font-bold text-[#dde2f3]">Correlated Git Commit 8f3c11d Diff vs Telemetry Spike</span>
            <div className="bg-[#080e1a] p-3 rounded font-mono text-xs space-y-1 border border-[#3b494b]/20">
              <div className="text-[#849495]">--- a/config/database.py</div>
              <div className="text-[#849495]">+++ b/config/database.py</div>
              <div className="text-[#00f0ff]">@@ -14,3 +14,3 @@ class DatabaseConfig:</div>
              <div className="bg-[#93000a]/30 text-[#ffb4ab]">- max_pool_size = 50</div>
              <div className="bg-[#ffb4ab]/20 text-[#ffdad6] font-bold">+ max_pool_size = 5 # memory optimization</div>
            </div>
            <p className="text-xs text-[#b9cacb] font-sans">
              Incident Agent matched the deployment timestamp (10:12:00) with the latency spike timestamp (10:14:10) and identified this parameter reduction as the sole root cause.
            </p>
          </div>
        )}

        {/* Tab Content: Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-2">
            <span className="text-xs font-bold text-[#dde2f3]">Incident Event Timeline</span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                <span>10:11:45 &bull; Commit <code>8f3c11d</code> pushed by dev-charlie</span>
                <span className="text-[#65f2b5]">Git push</span>
              </div>
              <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                <span>10:12:00 &bull; Deployment #42 rollout completed</span>
                <span className="text-[#00f0ff]">K8s rollout</span>
              </div>
              <div className="p-2.5 rounded bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-center justify-between">
                <span>10:14:10 &bull; Alert: 500 error spike &gt; 5% on /checkout</span>
                <span className="text-[#ffb4ab] font-bold">SEV-1 ALERT</span>
              </div>
              <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                <span>10:14:12 &bull; IncidentAgent correlated logs and commit 8f3c11d</span>
                <span className="text-[#65f2b5]">AI Diagnosis</span>
              </div>
              <div className="p-2.5 rounded bg-[#080e1a] flex items-center justify-between">
                <span>10:14:18 &bull; Self-Healing patch generated & sandbox verified</span>
                <span className="text-[#00dbe9]">Staged</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
