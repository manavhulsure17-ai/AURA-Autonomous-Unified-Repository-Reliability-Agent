import React, { useState } from 'react';
import { ViewKey } from '../../types';

interface CiCdPipelineViewProps {
  onNavigate: (view: ViewKey) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

interface Stage {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'queued';
  duration: string;
  command: string;
  logs: string[];
}

export const CiCdPipelineView: React.FC<CiCdPipelineViewProps> = ({ onNavigate, onShowToast }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasSimulatedFailure, setHasSimulatedFailure] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-deploy');

  const defaultStages: Stage[] = [
    {
      id: 'stage-commit',
      name: '1. Commit & Checkout',
      status: 'passed',
      duration: '1.2s',
      command: 'git checkout -b release/v2.4.1 && git verify-commit HEAD',
      logs: [
        '[09:00:01] Ingested commit 8f3c11d by dev-charlie',
        '[09:00:02] Cryptographic signature verified against GPG key 0x9024AURA',
        '[09:00:02] Clean working tree initialized in sandbox container aura-run-c4',
      ],
    },
    {
      id: 'stage-build',
      name: '2. Build & AST Parsing',
      status: 'passed',
      duration: '4.8s',
      command: 'pip install -r requirements.txt && python -m compileall .',
      logs: [
        '[09:00:03] Wheel cache hit: 48 packages retrieved from local registry',
        '[09:00:05] Tree-sitter AST parser analyzed 142 files in 640ms',
        '[09:00:07] Bytecode compilation verified. Zero syntax errors.',
      ],
    },
    {
      id: 'stage-test',
      name: '3. Deterministic Pytest',
      status: 'passed',
      duration: '3.2s',
      command: 'pytest tests/ --maxfail=1 --disable-warnings -v',
      logs: [
        '[09:00:08] pytest running in isolated container aura-sandbox-c1',
        '[09:00:09] tests/test_auth.py::test_auth_parameterized_query_syntax PASSED [25%]',
        '[09:00:10] tests/test_auth.py::test_sqli_exploit_rejection PASSED [50%]',
        '[09:00:11] tests/test_auth.py::test_jwt_token_claims_decode PASSED [100%]',
        '[09:00:11] 12 passed in 1.42s (zero flakiness detected)',
      ],
    },
    {
      id: 'stage-security',
      name: '4. Security Gate (AST)',
      status: 'passed',
      duration: '2.4s',
      command: 'semgrep --config=auto --error && bandit -r backend/',
      logs: [
        '[09:00:12] Semgrep AST rule evaluation: 38 rules checked',
        '[09:00:13] Bandit AST inspection: No high-severity taint flows in approved branch',
        '[09:00:14] Security gate passed: 0 critical, 0 blocking findings',
      ],
    },
    {
      id: 'stage-package',
      name: '5. Docker Container Package',
      status: 'passed',
      duration: '8.1s',
      command: 'docker build -t aura/ecommerce-api:v2.4.1 .',
      logs: [
        '[09:00:15] Building multi-stage container image: python:3.12-slim',
        '[09:00:19] Image digest: sha256:4a9f81d830b04b901f4c398ae',
        '[09:00:23] Pushed to private harbor registry at 127.0.0.1:5000/aura',
      ],
    },
    {
      id: 'stage-deploy',
      name: '6. Kubernetes Rolling Deploy',
      status: hasSimulatedFailure ? 'failed' : 'passed',
      duration: hasSimulatedFailure ? '14.2s (Crash)' : '11.5s',
      command: 'kubectl apply -f k8s/deployment.yaml && kubectl rollout status deployment/ecommerce-api',
      logs: hasSimulatedFailure
        ? [
            '[09:00:24] Rolling update triggered for replica set ecommerce-api-7b89',
            '[09:00:28] Pod ecommerce-api-7b89-xq9k2 status: Running',
            '[09:00:32] ERROR: Liveness probe failed: HTTP 500 on /health/ready',
            '[09:00:35] FATAL: Connection pool timeout (max_pool_size=5 exhausted by 120 concurrent connections)',
            '[09:00:38] Rollout failed! Circuit breaker triggered. Incident INC-001 created.',
          ]
        : [
            '[09:00:24] Rolling update triggered for replica set ecommerce-api-7b89',
            '[09:00:28] Pod ecommerce-api-7b89-xq9k2 status: Running',
            '[09:00:31] Readiness probe HTTP 200 OK received in 12ms',
            '[09:00:35] Deployment verified successfully across 4 cluster nodes.',
          ],
    },
    {
      id: 'stage-health',
      name: '7. Health & Synthetic Probes',
      status: hasSimulatedFailure ? 'failed' : 'passed',
      duration: hasSimulatedFailure ? '2.1s' : '4.2s',
      command: 'curl -f https://internal-api.cluster.local/healthz && k6 run load_smoke.js',
      logs: hasSimulatedFailure
        ? [
            '[09:00:39] Synthetic probe /healthz returned status 503 Service Unavailable',
            '[09:00:40] P99 Latency exploded: 4,820ms (SLA threshold: 200ms)',
            '[09:00:40] Alert dispatched to IncidentAgent & Reliability swarm.',
          ]
        : [
            '[09:00:36] Synthetic probe /healthz returned status 200 OK (8ms)',
            '[09:00:39] P99 Latency: 38ms (Well within SLA threshold)',
            '[09:00:40] All 10 synthetic endpoints reporting Nominal status.',
          ],
    },
  ];

  const handleStartPipeline = () => {
    setIsRunning(true);
    onShowToast('Dispatched Pipeline run #1042 across 7 isolated stages...', 'sync');
    setTimeout(() => {
      setIsRunning(false);
      onShowToast('CI/CD Pipeline #1042 execution completed.', 'task_alt');
    }, 1800);
  };

  const handleSimulateDeploymentFailure = () => {
    setHasSimulatedFailure(true);
    setSelectedStageId('stage-deploy');
    onShowToast('Simulated deployment bottleneck! Incident INC-001 created.', 'warning');
    setTimeout(() => {
      onNavigate('incidents');
    }, 1200);
  };

  const handleResetPipeline = () => {
    setHasSimulatedFailure(false);
    onShowToast('Reset pipeline state to Nominal / Clean.', 'refresh');
  };

  const currentStage = defaultStages.find((s) => s.id === selectedStageId) || defaultStages[0];

  return (
    <div className="flex flex-col w-full text-[#dde2f3] space-y-4 font-mono">
      {/* HUD Ribbon */}
      <div className="px-4 py-2.5 bg-[#080e1a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border-b border-[#3b494b]/30">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${hasSimulatedFailure ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#65f2b5]'}`}></span>
          <span className="text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            CI/CD Pipeline Orchestrator (Section 24)
          </span>
          <span className="text-[10px] text-[#849495] px-1.5 py-0.5 rounded bg-[#242a36]">
            Pipeline #1042 &bull; commit: 8f3c11d
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasSimulatedFailure ? (
            <>
              <button
                onClick={() => onNavigate('incidents')}
                className="px-3 py-1.5 rounded bg-[#93000a] hover:bg-[#b50012] text-[#ffdad6] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,180,171,0.3)]"
              >
                <span className="material-symbols-outlined text-[15px]">emergency</span>
                <span>Investigate INC-001 &rarr;</span>
              </button>
              <button
                onClick={handleResetPipeline}
                className="px-2.5 py-1.5 rounded bg-[#242a36] hover:bg-[#323948] text-[#b9cacb] text-xs cursor-pointer"
              >
                Reset Pipeline
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSimulateDeploymentFailure}
                className="px-2.5 py-1.5 rounded bg-[#93000a]/30 border border-[#ffb4ab]/40 hover:bg-[#93000a]/50 text-[#ffdad6] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title="Step 16 in Demo Scenario"
              >
                <span className="material-symbols-outlined text-[15px]">report_problem</span>
                <span>Simulate Deployment Failure (Demo Step 16)</span>
              </button>
              <button
                onClick={handleStartPipeline}
                disabled={isRunning}
                className="px-3 py-1.5 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[15px] ${isRunning ? 'animate-spin' : ''}`}>
                  {isRunning ? 'refresh' : 'play_arrow'}
                </span>
                <span>{isRunning ? 'Running Pipeline...' : 'Start CI/CD Pipeline (Demo Step 15)'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Pipeline Visual Stepper */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3b494b]/20">
            <div>
              <span className="text-xs text-[#849495]">PIPELINE WORKFLOW</span>
              <h3 className="text-sm font-bold text-[#dde2f3]">Autonomous Build & Verification Flow</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hasSimulatedFailure ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#65f2b5]/20 text-[#65f2b5]'}`}>
                {hasSimulatedFailure ? 'DEGRADE: RECOVERY NEEDED' : 'ALL STAGES GREEN'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {defaultStages.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStageId(st.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedStageId === st.id
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'border-[#3b494b]/30 bg-[#080e1a] hover:bg-[#1a202c]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#849495]">{st.duration}</span>
                  {st.status === 'passed' ? (
                    <span className="material-symbols-outlined text-[16px] text-[#65f2b5]">check_circle</span>
                  ) : st.status === 'failed' ? (
                    <span className="material-symbols-outlined text-[16px] text-[#ffb4ab] animate-pulse">error</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-[#00f0ff] animate-spin">refresh</span>
                  )}
                </div>

                <div className="text-xs font-bold text-[#dde2f3] mt-2 truncate">{st.name}</div>
                <div className="text-[10px] mt-1 uppercase font-semibold">
                  {st.status === 'passed' ? (
                    <span className="text-[#65f2b5]">Passed</span>
                  ) : st.status === 'failed' ? (
                    <span className="text-[#ffb4ab]">Failed</span>
                  ) : (
                    <span className="text-[#00f0ff]">Running</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Stage Log Console */}
        <div className="bg-[#161c28] p-4 rounded-xl border border-[#3b494b]/30 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#3b494b]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">terminal</span>
              <span className="text-xs font-bold text-[#dde2f3]">Console Output: {currentStage.name}</span>
            </div>
            <code className="text-[11px] text-[#00dbe9] bg-[#080e1a] px-2 py-0.5 rounded border border-[#3b494b]/30 truncate max-w-md">
              $ {currentStage.command}
            </code>
          </div>

          <div className="bg-[#080e1a] rounded-lg p-3 text-xs font-mono space-y-1 max-h-64 overflow-y-auto border border-[#3b494b]/20">
            {currentStage.logs.map((line, i) => (
              <div
                key={i}
                className={`${
                  line.includes('ERROR') || line.includes('FATAL')
                    ? 'text-[#ffb4ab] bg-[#93000a]/20 px-1 py-0.5 rounded font-bold'
                    : line.includes('passed') || line.includes('PASSED') || line.includes('OK')
                    ? 'text-[#65f2b5]'
                    : 'text-[#b9cacb]'
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          {currentStage.status === 'failed' && (
            <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#ffdad6]">
                <span className="material-symbols-outlined text-[#ffb4ab]">smart_toy</span>
                <span><strong>CI/CD Agent Assessment:</strong> Stage failed due to connection pool bottleneck. Incident INC-001 opened.</span>
              </div>
              <button
                onClick={() => onNavigate('self-healing')}
                className="px-3 py-1 rounded bg-[#00f0ff] text-[#00363a] font-bold text-xs hover:bg-[#7df4ff] cursor-pointer"
              >
                Open Self-Healing Workflow &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
