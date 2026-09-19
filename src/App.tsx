import React, { useState } from 'react';
import { ViewKey, AgentInfo, SecurityFinding, RefactoringProposal, ImpactNode, AuditLogEntry, PipelineStage } from './types';
import {
  INITIAL_AGENTS,
  INITIAL_SECURITY_FINDINGS,
  INITIAL_PROPOSAL,
  INITIAL_IMPACT_NODES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PIPELINE_STAGES,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InteractiveDemoGuide, DEMO_STEPS } from './components/InteractiveDemoGuide';
import { DashboardView } from './components/views/DashboardView';
import { SecurityCenterView } from './components/views/SecurityCenterView';
import { RefactoringView } from './components/views/RefactoringView';
import { ChangeImpactView } from './components/views/ChangeImpactView';
import { SelfHealingView } from './components/views/SelfHealingView';
import { CiCdPipelineView } from './components/views/CiCdPipelineView';
import { IncidentCenterView } from './components/views/IncidentCenterView';
import { TelemetryView } from './components/views/TelemetryView';
import { RepositoriesView } from './components/views/RepositoriesView';
import { ProjectsView } from './components/views/ProjectsView';
import { AiAgentsView } from './components/views/AiAgentsView';
import { ContextEngineView } from './components/views/ContextEngineView';
import { TestSuiteView } from './components/views/TestSuiteView';
import { CodeHealthView } from './components/views/CodeHealthView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { Toast } from './components/Toast';
import { LoginPage } from './components/LoginPage';
import { AuthUser } from './types';
import { getCurrentUser, logoutUser } from './utils/authStorage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [currentView, setCurrentView] = useState<ViewKey>('dashboard');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [findings, setFindings] = useState<SecurityFinding[]>(INITIAL_SECURITY_FINDINGS);
  const [proposal, setProposal] = useState<RefactoringProposal>(INITIAL_PROPOSAL);
  const [impactNodes, setImpactNodes] = useState<ImpactNode[]>(INITIAL_IMPACT_NODES);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string | null; icon?: string }>({
    message: null,
    icon: 'info',
  });

  const showToast = (message: string, icon: string = 'info') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast({ message: null, icon: 'info' });
    }, 4000);
  };

  const handleApplyProposal = () => {
    setProposal((prev) => ({ ...prev, applied: true }));
    setFindings((prev) =>
      prev.map((f) => (f.id === 'SEC-001' ? { ...f, status: 'Remediated' } : f))
    );
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        tag: 'COMMIT_PATCH',
        agent: 'Refactoring Agent',
        message: 'Proposal #24 approved & applied to refactor/aura-patch-auth-fix.',
        hash: 'ed25519:7df3...90ea',
        status: 'verified',
      },
      ...prev,
    ]);
  };

  const handleDemoActionTrigger = (actionKey: string) => {
    if (actionKey === 'analyze_repo') {
      showToast('Context Engine ingested demo-ecommerce-api repository. 84k AST nodes parsed.', 'bolt');
    } else if (actionKey === 'test_failure') {
      showToast('Executed pytest in sandbox: test_auth_parameterized_query_syntax intentionally failed (Step 10).', 'warning');
    } else if (actionKey === 'debug_investigate') {
      showToast('Debug Agent dispatched to analyze stack trace & AST parameter bounds (Step 11).', 'psychology');
    } else if (actionKey === 'generate_repair') {
      showToast('Testing & Developer agents synthesized parameter fix (Step 13).', 'build');
    } else if (actionKey === 'rerun_tests_pass') {
      showToast('Pytest re-run in Docker sandbox: 12/12 passed (Step 14)!', 'verified');
    } else if (actionKey === 'start_cicd') {
      showToast('Triggered CI/CD Pipeline cycle across all 7 stages (Step 15).', 'rocket_launch');
    } else if (actionKey === 'simulate_outage') {
      showToast('SEV-1 Outage INC-001 simulated: Connection pool starvation detected (Step 16).', 'emergency');
    } else if (actionKey === 'generate_recovery') {
      showToast('Reliability Agent synthesized recovery patch (max_pool_size=50) (Step 18).', 'build');
    } else if (actionKey === 'approve_recovery') {
      showToast('Human operator signed Ed25519 authorization for hotfix deployment (Step 19).', 'verified_user');
    } else if (actionKey === 'deploy_hotfix') {
      showToast('Rolling hotfix deployed to Kubernetes cluster. Latency dropped to 38ms (Step 20)!', 'healing');
    } else if (actionKey === 'final_verification') {
      showToast('All 21 steps verified: Swarm, Tests, Security, CI/CD, and Self-Healing passed (Step 21)!', 'verified');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    showToast('Signed out of session. Access locked.', 'logout');
  };

  const activeAgentsCount = agents.filter((a) => a.status !== 'ready' && a.status !== 'idle').length;
  const openSecurityCount = findings.filter((f) => f.status === 'Open').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080d18] text-[#dde2f3] font-sans selection:bg-[#00f0ff] selection:text-[#00363a]">
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome, ${user.name || user.email}! Authentication verified.`, 'verified_user');
          }}
        />
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast({ message: null, icon: 'info' })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e131f] text-[#dde2f3] flex flex-col font-sans selection:bg-[#00f0ff] selection:text-[#00363a]">
      {/* Top Fixed Header */}
      <Header
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activeAgentsCount={activeAgentsCount}
        healthPercent={94.2}
        selfHealingState={pipelineStages[7].status === 'passed' ? 'STANDBY' : 'LIVE'}
        currentUser={currentUser}
        onLogout={handleLogout}
        onThemeToggled={(themeName) =>
          showToast(`Switched to ${themeName === 'dark' ? 'Dark' : 'Light'} Theme.`, themeName === 'dark' ? 'dark_mode' : 'light_mode')
        }
      />

      {/* Main Structural Layout */}
      <div className="flex flex-1 pt-16">
        {/* Left Fixed Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          openCountSecurity={openSecurityCount}
          openCountIncidents={1}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 ml-64 p-0 overflow-x-hidden min-h-[calc(100vh-4rem)] flex flex-col">
          {/* Interactive 21-Step Competition Walkthrough Banner */}
          <InteractiveDemoGuide
            currentStepIndex={currentStepIndex}
            onSelectStep={(idx) => setCurrentStepIndex(idx)}
            onNavigate={(view) => setCurrentView(view)}
            onTriggerAction={handleDemoActionTrigger}
          />

          <div className="p-3 md:p-4 pb-12 flex-1">
            {currentView === 'dashboard' && (
              <DashboardView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
                proposal={proposal}
                agents={agents}
              />
            )}

            {currentView === 'projects' && (
              <ProjectsView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'repositories' && (
              <RepositoriesView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
                onRunAnalysis={() => showToast('Swarm analysis cycle triggered on demo repository.', 'bolt')}
              />
            )}

            {currentView === 'security-center' && (
              <SecurityCenterView
                findings={findings}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'refactoring' && (
              <RefactoringView
                proposal={proposal}
                onApplyProposal={handleApplyProposal}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'change-impact' && (
              <ChangeImpactView
                nodes={impactNodes}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'test-suite' && (
              <TestSuiteView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
                initialFailureMode={currentStepIndex >= 9 && currentStepIndex < 13}
              />
            )}

            {currentView === 'ci-cd-pipeline' && (
              <CiCdPipelineView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'incidents' && (
              <IncidentCenterView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'telemetry' && (
              <TelemetryView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'self-healing' && (
              <SelfHealingView
                stages={pipelineStages}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'ai-agents' && (
              <AiAgentsView
                agents={agents}
                auditLogs={auditLogs}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'context-engine' && (
              <ContextEngineView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'code-health' && (
              <CodeHealthView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'audit-logs' && (
              <AuditLogsView
                logs={auditLogs}
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                onNavigate={(view) => setCurrentView(view)}
                onShowToast={showToast}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K / Cmd+K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
        onShowToast={showToast}
      />

      {/* Action Toast Indicator */}
      <Toast
        message={toast.message}
        icon={toast.icon}
        onClose={() => setToast({ message: null, icon: 'info' })}
      />
    </div>
  );
}
