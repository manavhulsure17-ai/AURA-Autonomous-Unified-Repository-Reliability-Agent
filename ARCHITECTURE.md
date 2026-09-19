# AURA System Architecture

## 1. Architectural Philosophy: Determinism vs. Reasoning

AURA follows a strict design tenet: **Deterministic software for execution; AI models for reasoning.**

```
+-------------------------------------------------------------+
|                      HUMAN OPERATOR                         |
|             (Visual Mission Control & Approvals)            |
+-------------------------------------------------------------+
                              ▲
                              │ Approvals & Directives
                              ▼
+-------------------------------------------------------------+
|               MULTI-AGENT COGNITIVE SWARM                   |
|  ManagerAgent | ContextAgent | SecurityAgent | TestingAgent |
|  RefactorAgent| IncidentAgent| DebugAgent   | Reliability  |
+-------------------------------------------------------------+
                              ▲
                              │ Structured JSON Message Bus
                              ▼
+-------------------------------------------------------------+
|              DETERMINISTIC CONTEXT ENGINE                   |
|  - Tree-sitter AST Graph Parser                             |
|  - Call Hierarchy & Cross-File Symbol Resolution            |
|  - Git Diff & Blast Radius Calculator                       |
|  - OpenTelemetry Metric Aggregator                          |
+-------------------------------------------------------------+
                              ▲
                              │ Subprocess & Socket IPC
                              ▼
+-------------------------------------------------------------+
|              ISOLATED EXECUTION SANDBOX                     |
|  - Docker Container `aura-sandbox-c1` (No host privileges)  |
|  - Deterministic Pytest Test Runner                         |
|  - Semgrep Static Analysis Engine                           |
|  - Ed25519 Cryptographic Audit Trail Logger                 |
+-------------------------------------------------------------+
```

### Key Principles

1. **AI Never Directly Touches Production**: Agents cannot write files to live branches or deploy to production without passing automated test gates and receiving explicit human sign-off.
2. **Context Over Large Prompts**: Agents do not receive entire repositories in raw prompts. Instead, the Context Engine queries Tree-sitter AST graphs to fetch only the relevant symbol nodes, callers, callees, and type definitions.
3. **Reproducibility**: All test executions and code validations are performed inside immutable Docker containers with fixed seeds and mock network boundaries.
4. **Observable Reasoning**: Every agent message contains explicit `confidence` scores, `context_summary`, and `artifacts` referencing exact code lines and commit hashes.

---

## 2. Multi-Agent Swarm Hierarchy

The 13 specialist agents are organized into 4 functional tiers:

### Tier 1: Coordinators
- **ManagerAgent (`AURA-ORCH-001`)**: Decomposes high-level directives into dependency-ordered DAG tasks and manages consensus across the swarm.
- **PlannerAgent (`AURA-PLAN-002`)**: Generates structured execution plans with fallback contingencies and risk thresholds.

### Tier 2: Analyzers
- **ContextAgent (`AURA-CTX-003`)**: Traverses AST syntax graphs and resolves cross-file symbol references.
- **ArchitectureAgent (`AURA-ARCH-004`)**: Computes modular coupling, cyclomatic complexity, and detects architectural drift.
- **SecurityAgent (`AURA-SEC-005`)**: Evaluates static taint paths (CWE-89, CWE-79) and secret leakage.
- **DependencyAgent (`AURA-DEP-006`)**: Audits dependency trees for CVEs, licensing conflicts, and abandoned packages.

### Tier 3: Executors
- **DeveloperAgent (`AURA-DEV-007`)**: Synthesizes clean, idiomatically typed code patches complying with existing project style.
- **RefactoringAgent (`AURA-REF-008`)**: Minimizes net line churn while eliminating code smells and dead logic.
- **TestingAgent (`AURA-TEST-009`)**: Synthesizes boundary-condition test cases and verifies deterministic pass rates.
- **DebugAgent (`AURA-DBG-010`)**: Analyzes exception stack traces and bisects commit histories to find root causes.

### Tier 4: Reliability & SRE
- **CiCdAgent (`AURA-CICD-011`)**: Manages multi-stage pipeline rollouts and automated rollback triggers.
- **TelemetryAgent (`AURA-TEL-012`)**: Aggregates OpenTelemetry spans, latency percentiles (P95/P99), and error rate spikes.
- **IncidentAgent (`AURA-INC-013`)**: Correlates production telemetry anomalies with recent Git deployments and synthesizes self-healing mitigations.

---

## 3. Sandboxed Execution Model

To ensure security and safety:
- Code generation runs in ephemeral Docker containers created per task (`aura-sandbox-c*`).
- Containers run with `--network none` (or restricted mock bridge), read-only root filesystems, and temporary scratch volumes.
- Any execution exceeding timeouts (e.g., 30 seconds for test runs) is terminated immediately.
- Container standard out and error streams are captured, hashed, and committed to the immutable audit log.
