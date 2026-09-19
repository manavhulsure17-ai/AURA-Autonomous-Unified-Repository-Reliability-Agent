import React, { useState } from 'react';
import { ViewKey } from '../types';

export interface DemoStep {
  step: number;
  title: string;
  targetView: ViewKey;
  description: string;
  actionText: string;
  badge: string;
  autoActionKey?: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Open AURA Mission Control',
    targetView: 'dashboard',
    description: 'AURA Autonomous Unified Repository & Reliability Agent initialization and cluster telemetry check.',
    actionText: 'View Dashboard',
    badge: 'System Ready',
  },
  {
    step: 2,
    title: 'Open Demo Repository',
    targetView: 'repositories',
    description: 'Inspect demo-ecommerce-api repository structure, code files, and recent Git commits.',
    actionText: 'Browse Repository',
    badge: 'Repo Loaded',
  },
  {
    step: 3,
    title: 'Click: Analyze Repository',
    targetView: 'repositories',
    description: 'Trigger full repository AST indexing and multi-agent scanning across 142 files.',
    actionText: 'Trigger Analysis',
    badge: 'AST Indexing',
    autoActionKey: 'analyze_repo',
  },
  {
    step: 4,
    title: 'Show Agents Working',
    targetView: 'ai-agents',
    description: 'Observe 13 specialist cognitive agents collaborating with structured JSON message protocols.',
    actionText: 'Inspect Swarm',
    badge: '13 Agents Active',
  },
  {
    step: 5,
    title: 'Show Detected Problems',
    targetView: 'code-health',
    description: 'Review architecture report: cyclomatic complexity spikes, duplicated auth query in 2 modules.',
    actionText: 'View Code Health',
    badge: '4 Bottlenecks',
  },
  {
    step: 6,
    title: 'Open Security Center',
    targetView: 'security-center',
    description: 'Inspect CWE-89 SQL Injection in backend/auth.py:47 with live AST exploit simulator.',
    actionText: 'Inspect Vulnerability',
    badge: 'Critical CWE-89',
  },
  {
    step: 7,
    title: 'Open Change Impact',
    targetView: 'change-impact',
    description: 'Query "What will break if authentication is changed?" and render the interactive blast radius graph.',
    actionText: 'Inspect Blast Radius',
    badge: 'Impact Analysis',
  },
  {
    step: 8,
    title: 'Open Refactoring',
    targetView: 'refactoring',
    description: 'Generate Refactoring Proposal #24: parameterized query synthesis with zero AST contract breakage.',
    actionText: 'View Proposal #24',
    badge: 'PR Ready',
  },
  {
    step: 9,
    title: 'Show Git Diff',
    targetView: 'refactoring',
    description: 'Inspect unified color-coded Git diff for backend/auth.py and services/user_service.py.',
    actionText: 'Inspect Diff',
    badge: 'Unified Diff',
  },
  {
    step: 10,
    title: 'Run Tests (Intentional Failure)',
    targetView: 'test-suite',
    description: 'Run sandbox pytest suite with an intentional regression failure to trigger the Debug Agent.',
    actionText: 'Trigger Test Failure',
    badge: 'Intentional Fail',
    autoActionKey: 'test_failure',
  },
  {
    step: 11,
    title: 'Debug Agent Investigates',
    targetView: 'test-suite',
    description: 'Debug Agent analyzes stack trace, recent commit 8f3c11d, and affected syntax nodes.',
    actionText: 'Debug Diagnosis',
    badge: 'Root Cause 94%',
    autoActionKey: 'debug_investigate',
  },
  {
    step: 12,
    title: 'Show Root-Cause Analysis',
    targetView: 'test-suite',
    description: 'Review AST evidence and confidence score explaining the assertion failure in detail.',
    actionText: 'View Root Cause',
    badge: 'Evidence Verified',
  },
  {
    step: 13,
    title: 'Generate Repair',
    targetView: 'test-suite',
    description: 'Testing & Developer agents synthesize AST-compliant parameter patch for the test harness.',
    actionText: 'Generate Patch',
    badge: 'Patch Ready',
    autoActionKey: 'generate_repair',
  },
  {
    step: 14,
    title: 'Run Tests Again (12/12 Pass)',
    targetView: 'test-suite',
    description: 'Re-run pytest in isolated Docker sandbox aura-sandbox-c1. All 12 tests pass deterministically.',
    actionText: 'Re-run Tests',
    badge: '12/12 Passed',
    autoActionKey: 'rerun_tests_pass',
  },
  {
    step: 15,
    title: 'Start CI/CD Simulation',
    targetView: 'ci-cd-pipeline',
    description: 'Dispatch commit into automated CI/CD pipeline: Build, Tests, Security Scan, Package, Deploy.',
    actionText: 'Launch Pipeline',
    badge: 'CI/CD Running',
    autoActionKey: 'start_cicd',
  },
  {
    step: 16,
    title: 'Simulate Deployment Failure',
    targetView: 'incidents',
    description: 'Simulate container health check failure and 500 error spike from DB pool exhaustion (INC-001).',
    actionText: 'Simulate Outage',
    badge: 'INC-001 Triggered',
    autoActionKey: 'simulate_outage',
  },
  {
    step: 17,
    title: 'Incident Agent Investigates',
    targetView: 'incidents',
    description: 'Incident Agent correlates OTEL telemetry spike with Deployment #42 configuration change.',
    actionText: 'Review Investigation',
    badge: 'Correlated 1.4s',
  },
  {
    step: 18,
    title: 'Generate Recovery Plan',
    targetView: 'self-healing',
    description: 'Synthesize automated config patch restoring max_pool_size=50 in config/database.py.',
    actionText: 'Inspect Hotfix',
    badge: 'Hotfix Synthesized',
    autoActionKey: 'generate_recovery',
  },
  {
    step: 19,
    title: 'Approve Recovery (Human Gate)',
    targetView: 'self-healing',
    description: 'Human operator signs off on the self-healing rollout to authorize container hotfix rollout.',
    actionText: 'Authorize Recovery',
    badge: 'Human Signoff',
    autoActionKey: 'approve_recovery',
  },
  {
    step: 20,
    title: 'Recover Deployment',
    targetView: 'self-healing',
    description: 'Autonomous zero-downtime hotfix applied. Latency drops from 4,820ms back to 38ms.',
    actionText: 'Execute Rollout',
    badge: 'Hotfix Deployed',
    autoActionKey: 'deploy_hotfix',
  },
  {
    step: 21,
    title: 'Final Verification',
    targetView: 'dashboard',
    description: 'Full verification attestation: Build ✓ Tests ✓ Security ✓ Deployment ✓ Telemetry Health ✓.',
    actionText: 'Complete Verification',
    badge: '100% Healed',
    autoActionKey: 'final_verification',
  },
];

interface InteractiveDemoGuideProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onNavigate: (view: ViewKey) => void;
  onTriggerAction?: (actionKey: string) => void;
}

export const InteractiveDemoGuide: React.FC<InteractiveDemoGuideProps> = ({
  currentStepIndex,
  onSelectStep,
  onNavigate,
  onTriggerAction,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      onSelectStep(nextIdx);
      onNavigate(DEMO_STEPS[nextIdx].targetView);
      if (DEMO_STEPS[nextIdx].autoActionKey && onTriggerAction) {
        onTriggerAction(DEMO_STEPS[nextIdx].autoActionKey!);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      onSelectStep(prevIdx);
      onNavigate(DEMO_STEPS[prevIdx].targetView);
    }
  };

  const handleRunCurrentStep = () => {
    onNavigate(currentStep.targetView);
    if (currentStep.autoActionKey && onTriggerAction) {
      onTriggerAction(currentStep.autoActionKey);
    }
  };

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-68 z-40">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161c28] border border-[#00f0ff]/50 text-[#00f0ff] font-mono text-xs shadow-xl hover:bg-[#242a36] cursor-pointer transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
          <span>Step {currentStep.step}/21: {currentStep.title}</span>
          <span className="material-symbols-outlined text-[14px]">expand_less</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#080e1a] border-b border-[#00f0ff]/30 px-4 py-2 font-mono text-xs shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {/* Left side: step counter and title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded bg-[#00f0ff] text-[#00363a] font-bold font-mono text-[11px]">
              STEP {currentStep.step} OF 21
            </span>
            <span className="px-2 py-0.5 rounded bg-[#242a36] text-[#00dbe9] text-[10px] hidden sm:inline">
              {currentStep.badge}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#dde2f3] truncate text-xs">{currentStep.title}</h4>
              <span className="text-[10px] text-[#849495] hidden md:inline">&bull;</span>
              <span className="text-[11px] text-[#b9cacb] font-sans truncate hidden md:inline">
                {currentStep.description}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-2 py-1 rounded bg-[#161c28] hover:bg-[#242a36] text-[#b9cacb] disabled:opacity-40 text-[11px] flex items-center gap-1 cursor-pointer"
            title="Previous Step"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={handleRunCurrentStep}
            className="px-3 py-1 rounded bg-[#00f0ff] text-[#00363a] hover:bg-[#7df4ff] font-bold text-[11px] flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">play_arrow</span>
            <span>{currentStep.actionText}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            className="px-2.5 py-1 rounded bg-[#161c28] hover:bg-[#242a36] text-[#00f0ff] disabled:opacity-40 text-[11px] flex items-center gap-1 cursor-pointer font-semibold"
            title="Next Step"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>

          {/* Quick Step Selector Dropdown */}
          <select
            value={currentStepIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              onSelectStep(idx);
              onNavigate(DEMO_STEPS[idx].targetView);
            }}
            className="bg-[#161c28] text-[#b9cacb] border border-[#3b494b]/40 rounded px-2 py-1 text-[10px] outline-none cursor-pointer"
          >
            {DEMO_STEPS.map((s, idx) => (
              <option key={s.step} value={idx}>
                {s.step}. {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-[#849495] hover:text-[#dde2f3] cursor-pointer"
            title="Minimize Guide"
          >
            <span className="material-symbols-outlined text-[15px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* Sequential Phase Trackers */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1.5 mt-1 border-t border-[#3b494b]/20">
        <span className="text-[10px] text-[#849495] uppercase font-semibold mr-1 shrink-0">Phases:</span>
        {[
          { phase: 1, label: 'Phase 1: Ingestion & Security', range: 'Steps 1–6', startIdx: 0, endIdx: 5, color: '#00f0ff' },
          { phase: 2, label: 'Phase 2: Blast Radius & Refactor', range: 'Steps 7–9', startIdx: 6, endIdx: 8, color: '#d0bcff' },
          { phase: 3, label: 'Phase 3: Sandbox Pytest & Debug', range: 'Steps 10–14', startIdx: 9, endIdx: 13, color: '#ffb4ab' },
          { phase: 4, label: 'Phase 4: CI/CD & Self-Healing', range: 'Steps 15–21', startIdx: 14, endIdx: 20, color: '#65f2b5' },
        ].map((p) => {
          const isCurrentPhase = currentStepIndex >= p.startIdx && currentStepIndex <= p.endIdx;
          const isCompletedPhase = currentStepIndex > p.endIdx;
          return (
            <button
              key={p.phase}
              onClick={() => {
                onSelectStep(p.startIdx);
                onNavigate(DEMO_STEPS[p.startIdx].targetView);
                if (DEMO_STEPS[p.startIdx].autoActionKey && onTriggerAction) {
                  onTriggerAction(DEMO_STEPS[p.startIdx].autoActionKey!);
                }
              }}
              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isCurrentPhase
                  ? 'bg-[#242a36] text-[#dde2f3] font-bold border border-[#00f0ff]/50 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                  : isCompletedPhase
                  ? 'bg-[#161c28] text-[#65f2b5] hover:bg-[#242a36]'
                  : 'bg-[#161c28] text-[#849495] hover:bg-[#242a36] hover:text-[#dde2f3]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isCompletedPhase ? '#65f2b5' : isCurrentPhase ? p.color : '#849495',
                }}
              ></span>
              <span>{p.label}</span>
              <span className="text-[9px] opacity-70">({p.range})</span>
              {isCompletedPhase && <span className="material-symbols-outlined text-[12px] text-[#65f2b5]">check</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
