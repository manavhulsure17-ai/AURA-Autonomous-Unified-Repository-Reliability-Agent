# AURA 21-Step Competition Demo Scenario Guide

This guide provides a step-by-step walkthrough to reproduce the complete end-to-end AURA demonstration described in Section 33.

---

## 🎯 How to Follow the Demo in the UI

At the top of the AURA interface, you will see the **Interactive Demo Guide Banner**:
- Displays `STEP X OF 21`
- Includes a direct action button (e.g. `Inspect Vulnerability`, `Trigger Test Failure`, `Approve Recovery`)
- Provides `Prev` and `Next` navigation controls to jump between steps instantly.

---

## 📋 The 21 Steps Explained

| Step | Title | Target View | Expected Outcome |
|---|---|---|---|
| **01** | Open AURA Mission Control | `dashboard` | View cluster HUD, active agent telemetry, and system stats. |
| **02** | Open Demo Repository | `repositories` | Inspect `demo-ecommerce-api` code tree, `backend/auth.py`, and Git commits. |
| **03** | Click: Analyze Repository | `repositories` | Triggers AST indexing across 142 files; 84k symbol nodes cached. |
| **04** | Show Agents Working | `ai-agents` | Inspect 13 specialized agents exchanging structured JSON messages. |
| **05** | Show Detected Problems | `code-health` | Review cyclomatic complexity spikes and architectural coupling reports. |
| **06** | Open Security Center | `security-center` | Triage Critical CWE-89 SQL Injection in `backend/auth.py:47`. |
| **07** | Open Change Impact | `change-impact` | Query blast radius of auth changes; view 18 transitively impacted nodes. |
| **08** | Open Refactoring | `refactoring` | Review Proposal #24: Parameterized query synthesis. |
| **09** | Show Git Diff | `refactoring` | Inspect unified color-coded diff showing replacement of raw f-strings. |
| **10** | Run Tests (Intentional Failure) | `test-suite` | Click "Trigger Test Failure". Observe regression assertion error in `test_auth.py`. |
| **11** | Debug Agent Investigates | `test-suite` | Click "Debug Agent Investigate". Dissects stack trace and AST bounds. |
| **12** | Show Root-Cause Analysis | `test-suite` | Review root cause diagnosis with 94% confidence. |
| **13** | Generate Repair | `test-suite` | Click "Generate Repair". Staged parameterized fix into sandbox harness. |
| **14** | Run Tests Again | `test-suite` | Click "Run Tests Again". All 12/12 deterministic tests pass in 842ms. |
| **15** | Start CI/CD Simulation | `ci-cd-pipeline` | Launch 7-stage automated CI/CD pipeline. |
| **16** | Simulate Deployment Failure | `incidents` | Click "Simulate Deployment Failure". Triggers connection pool exhaustion (INC-001). |
| **17** | Incident Agent Investigates | `incidents` | Correlates 500 error spike with commit `8f3c11d` (`max_pool_size=5`). |
| **18** | Generate Recovery Plan | `self-healing` | Reliability Agent generates hotfix restoring pool size to 50. |
| **19** | Approve Recovery Gate | `self-healing` | Human operator signs off on the self-healing rollout plan. |
| **20** | Recover Deployment | `self-healing` | Hotfix deployed. P99 response time drops from 4,820ms back to 38ms. |
| **21** | Final Verification | `dashboard` | Full verification attestation: Build ✓ Tests ✓ Security ✓ Deployment ✓ Health ✓. |
