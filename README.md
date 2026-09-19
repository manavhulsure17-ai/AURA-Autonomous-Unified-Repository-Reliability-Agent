# AURA — Autonomous Unified Repository & Reliability Agent

> **Understand. Secure. Improve. Test. Heal.**

AURA is an autonomous, multi-agent AI software engineering and reliability platform built for developers, DevOps, and platform teams. It unifies context-aware code analysis, security auditing, deterministic test generation, automated refactoring, and self-healing CI/CD operations under a single command center.

---

## 🚀 Key Capabilities

- **🧠 Deterministic Context Engine**: Full AST syntax indexing, caller/callee graphs, and cross-file symbol resolution powered by Tree-sitter. AI reasons over precise graph data rather than raw text windows.
- **🛡️ Shift-Left Security Center**: Automated taint analysis detecting CWE-89 (SQL Injection), CWE-79 (XSS), hardcoded secrets, and dependency CVEs with live AST proof-of-concept synthesis.
- **📐 Change Impact & Blast Radius**: Interactive dependency graph calculating transitively impacted endpoints, database migrations, and regression test suites before code is written.
- **⚡ Autonomous Refactoring & Git Diffs**: Synthesizes verified patches with AST integrity checks, preserving public APIs and minimizing net code churn.
- **🐳 Isolated Docker Sandboxes**: All AI-generated code, patches, and pytest suites run strictly inside ephemeral Docker containers (`aura-sandbox-c*`). No host access.
- **🩺 Self-Healing CI/CD & Incident Center**: Correlates OpenTelemetry metrics, container crashes, and recent Git commits (e.g. database pool exhaustion in commit `8f3c11d`), generating verified configuration hotfixes.
- **🔐 Human Approval Safety Gates**: Critical and high-risk actions remain blocked until authorized by a human operator.
- **📜 Immutable Audit Trail**: Every agent message, decision, diff, and execution is cryptographically signed (Ed25519) and logged in an immutable ledger.

---

## 🧭 The 21-Step Competition Demo Walkthrough

AURA features a built-in **Interactive Demo Guide** that takes you step-by-step through the 21-step workflow defined in Section 33:

1. **Open AURA**: Mission Control initialization and cluster health verification.
2. **Open Demo Repository**: Inspect `demo-ecommerce-api` structure, files, and recent commits.
3. **Analyze Repository**: Trigger full multi-agent AST indexing across 142 files.
4. **Inspect Swarm**: Observe 13 specialist cognitive agents collaborating.
5. **Review Code Health**: Inspect cyclomatic complexity spikes and architectural coupling.
6. **Open Security Center**: Triage CWE-89 SQL Injection in `backend/auth.py:47`.
7. **Change Impact Analysis**: Query *"What will be affected if authentication is changed?"* and view blast radius graph.
8. **Synthesize Refactoring**: Generate Proposal #24 (parameterized query binding).
9. **Unified Git Diff**: Inspect color-coded additions and deletions across affected files.
10. **Run Tests (Intentional Failure)**: Run sandbox test suite and observe regression failure in `test_auth_parameterized_query_syntax`.
11. **Debug Agent Investigation**: Observe Debug Agent dissecting stack traces and parameter bounds.
12. **Root-Cause Analysis**: Review verified root cause (94% confidence) explaining unhandled SQL syntax exception.
13. **Generate Repair**: Testing & Developer agents synthesize parameterized query fix.
14. **Re-run Tests (12/12 Pass)**: Pytest passes 100% deterministically in container `aura-sandbox-c1`.
15. **Start CI/CD Pipeline**: Launch 7-stage automated build, test, scan, and package workflow.
16. **Simulate Deployment Failure**: Trigger health check timeout and 500 error surge (SEV-1 incident `INC-001`).
17. **Incident Agent Investigation**: Autonomous agent correlates OTEL latency spike (4,820ms) to commit `8f3c11d` (`max_pool_size=5`).
18. **Generate Recovery Plan**: Reliability Agent synthesizes hotfix restoring pool size to 50.
19. **Human Approval Gate**: Human operator reviews diff and signs off on rollout.
20. **Deploy Hotfix**: Autonomous rolling update restores container latency to 38ms.
21. **Final Verification Attestation**: Build ✓ Tests ✓ Security ✓ Deployment ✓ Telemetry Health ✓.

---

## 💻 Developer CLI (`aura`)

AURA includes a built-in terminal and developer CLI:

```bash
# Verify system prerequisites and container sandboxes
aura doctor

# Index repository AST and run multi-agent security sweep
aura analyze

# Inspect active security vulnerabilities
aura security

# Compute transitive blast radius of a file
aura impact backend/auth.py

# Run deterministic test suite in isolated Docker container
aura test

# Synthesize AST-compliant refactoring proposal
aura refactor

# Correlate active incident telemetry and trigger self-healing
aura heal
```

---

## 📁 Repository Documentation Index

- [`ARCHITECTURE.md`](./ARCHITECTURE.md): Multi-agent orchestration, Context Engine, AST parsing, and sandboxed execution.
- [`API.md`](./API.md): Comprehensive REST & WebSocket API specification.
- [`AGENTS.md`](./AGENTS.md): Complete catalog of all 13 specialized cognitive agents and structured message protocols.
- [`SECURITY.md`](./SECURITY.md): Threat modeling, container isolation, credential redaction, and human safety gates.
- [`DEVELOPMENT.md`](./DEVELOPMENT.md): Local development setup, testing, and contribution guide.
- [`DEMO.md`](./DEMO.md): Step-by-step reproduction instructions for evaluators and judges.
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md): Common error recovery, Docker sandbox diagnostics, and telemetry sync.
