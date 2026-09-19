# AURA Multi-Agent Catalog & Protocol Specification

AURA utilizes a coordinated swarm of 13 cognitive specialist agents. All agent-to-agent interactions are governed by a strict, structured JSON message schema.

---

## 1. Structured Agent Message Schema (Section 5 Standard)

Every agent message must conform to this typed schema:

```json
{
  "sender": "SecurityAgent",
  "recipient": "OrchestratorAgent",
  "task_id": "SEC-SCAN-402",
  "message_type": "ANALYSIS_AND_PROPOSAL",
  "confidence": 0.94,
  "context_summary": "Identified raw string interpolation query in backend/auth.py:47",
  "artifacts": [
    "ast_path: backend.auth.authenticate_user",
    "cwe: CWE-89",
    "pytest_file: tests/test_auth.py",
    "sandbox_container: aura-sandbox-c1"
  ],
  "timestamp": "2026-04-18T10:14:05Z"
}
```

---

## 2. The 13 Specialist Agents

| ID | Agent Name | Code Identifier | Tier | Model | Core Mandate |
|---|---|---|---|---|---|
| 01 | Manager Agent | `AURA-ORCH-001` | Coordinator | Gemini 2.5 Pro | DAG task decomposition and consensus orchestration |
| 02 | Planner Agent | `AURA-PLAN-002` | Coordinator | Gemini 2.5 Flash | Execution graph formulation and fallback branching |
| 03 | Context Agent | `AURA-CTX-003` | Analyzer | Gemini 2.5 Flash | Tree-sitter AST symbol resolution and cross-module linkage |
| 04 | Architecture Agent | `AURA-ARCH-004` | Analyzer | Gemini 2.5 Pro | Cyclomatic complexity, module cohesion, and coupling metrics |
| 05 | Security Agent | `AURA-SEC-005` | Analyzer | Gemini 2.5 Pro | Static taint analysis (CWE-89, CWE-79) and secret leakage |
| 06 | Dependency Agent | `AURA-DEP-006` | Analyzer | Gemini 2.5 Flash | CVE tracking, license compliance, and supply chain audits |
| 07 | Developer Agent | `AURA-DEV-007` | Executor | Gemini 2.5 Pro | Idiomatic code generation complying with AST syntax bounds |
| 08 | Refactoring Agent | `AURA-REF-008` | Executor | Gemini 2.5 Pro | Zero-contract breakage patch synthesis and churn minimization |
| 09 | Testing Agent | `AURA-TEST-009` | Executor | Gemini 2.5 Flash | Deterministic boundary test generation and coverage expansion |
| 10 | Debug Agent | `AURA-DBG-010` | Executor | Gemini 2.5 Pro | Stack trace dissection, bisect analysis, and root-cause isolation |
| 11 | CI/CD Agent | `AURA-CICD-011` | Reliability | Gemini 2.5 Flash | Multi-stage pipeline validation and deployment gating |
| 12 | Telemetry Agent | `AURA-TEL-012` | Reliability | Gemini 2.5 Flash | OpenTelemetry log and metric ingestion and anomaly detection |
| 13 | Incident Agent | `AURA-INC-013` | Reliability | Gemini 2.5 Pro | Production outage triage, commit correlation, and self-healing |

---

## 3. Cognitive Guardrails

- **No Unrestricted Execution**: Agents are strictly forbidden from issuing raw shell commands on the host machine.
- **Mandatory AST Grounding**: Any code generation must reference verified AST nodes emitted by the Context Engine.
- **Consensus Quorum**: Critical security fixes require approval from at least 3 independent agents (e.g., `SecurityAgent`, `TestingAgent`, and `ArchitectureAgent`) before presenting to the human operator.
