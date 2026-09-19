export type ViewKey =
  | 'dashboard'
  | 'projects'
  | 'repositories'
  | 'ai-agents'
  | 'context-engine'
  | 'code-health'
  | 'security-center'
  | 'refactoring'
  | 'change-impact'
  | 'test-suite'
  | 'ci-cd-pipeline'
  | 'incidents'
  | 'telemetry'
  | 'self-healing'
  | 'audit-logs'
  | 'settings';

export interface AgentInfo {
  id: string;
  name: string;
  codeName: string;
  status: 'active' | 'ready' | 'alert' | 'reviewing' | 'testing' | 'investigating' | 'standby' | 'idle' | 'streaming';
  model: string;
  latency: string;
  description: string;
  memoryUsage?: string;
  confidence?: number;
  traceId: string;
  activeTask?: string;
  category: 'coordinator' | 'analyzer' | 'executor' | 'reliability';
}

export interface SecurityFinding {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  category: string;
  file: string;
  line: number;
  detectionEngine: string;
  evidenceSnippet: string;
  explanation: string;
  blastRadius: string;
  remediation: string;
  status: 'Open' | 'Triaged' | 'Remediated' | 'Pending Upgrade';
  confidence: number;
}

export interface RefactoringProposal {
  id: string;
  number: number;
  branch: string;
  title: string;
  author: string;
  safetyGate: 'Low Risk' | 'Medium Risk' | 'High Risk';
  sandboxStatus: string;
  sandboxDuration: string;
  securityVector: {
    tag: string;
    headline: string;
    description: string;
    cwe: string;
  };
  astIntegrity: {
    status: string;
    headline: string;
    description: string;
    testedRoutesCount: number;
  };
  refactorDelta: {
    netLines: number;
    headline: string;
    description: string;
    additions: number;
    deletions: number;
  };
  thoughtStream: Array<{
    agent: string;
    color: string;
    message: string;
  }>;
  verificationChecks: Array<{
    title: string;
    subtitle: string;
    status: string;
    valid: boolean;
  }>;
  applied: boolean;
}

export interface ImpactNode {
  id: string;
  label: string;
  type: 'source' | 'critical' | 'high' | 'medium' | 'low' | 'test';
  severityText: string;
  subtitle: string;
  x: number;
  y: number;
  loc?: number;
  latencyDelta?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  tag: string;
  agent: string;
  message: string;
  hash: string;
  status: 'verified' | 'pending' | 'alert';
}

export interface PipelineStage {
  number: string;
  name: string;
  status: 'passed' | 'failed' | 'active' | 'queued' | 'pending';
  duration: string;
  meta: string;
}

export interface AuthUser {
  email: string;
  name?: string;
  pin: string;
  registeredAt: string;
  role?: string;
}
