# AURA Troubleshooting Guide

This guide details common operational questions, error resolution steps, and recovery procedures.

---

## 1. Sandbox Execution Issues

### Issue: `Docker sandbox container timeout exceeded (30s)`
- **Root Cause**: Test suite contains an infinite loop or unmocked external network call that hung.
- **Remediation**:
  1. Inspect container logs with `aura doctor`.
  2. Verify that network calls are intercepted with pytest mocks.
  3. Increase container timeout in `config/sandbox.json` if heavy compilation is expected.

---

## 2. Telemetry & OpenTelemetry Collection

### Issue: `Telemetry stream disconnected or showing zero samples`
- **Root Cause**: Local OpenTelemetry collector daemon not listening on port `4317` (gRPC) or `4318` (HTTP).
- **Remediation**:
  1. Run `docker-compose ps otel-collector` to ensure the daemon is running.
  2. In the UI, click "Sync Swarm" in the AI Agents view or reload the telemetry stream.

---

## 3. Self-Healing & Incident Triage

### Issue: `Incident recovery plan fails validation tests`
- **Root Cause**: The synthesized config hotfix broke a secondary constraint or test assertion.
- **Remediation**:
  1. AURA automatically rejects hotfixes that fail sandbox regression tests.
  2. The Debug Agent is automatically dispatched to reformulate a secondary patch.
  3. If manual intervention is desired, select "Reject Hotfix" and inspect the stack trace in the Incident Center.
