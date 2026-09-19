# AURA Platform API Specification

The AURA backend exposes high-performance REST and WebSocket endpoints for repository operations, multi-agent task dispatch, testing, and real-time telemetry streaming.

---

## 1. Projects & Repositories

### `GET /api/v1/projects`
Retrieves all registered workspaces and repositories.
**Response**:
```json
[
  {
    "id": "proj-ecommerce-01",
    "name": "demo-ecommerce-api",
    "git_url": "https://github.com/aura-corp/demo-ecommerce-api.git",
    "default_branch": "main",
    "health_score": 84,
    "vulnerabilities": 1,
    "last_indexed_at": "2026-04-18T10:14:02Z"
  }
]
```

### `POST /api/v1/projects`
Registers a new Git repository or local directory for AST indexing.
**Request**:
```json
{
  "name": "billing-microservice",
  "git_url": "https://github.com/aura-corp/billing.git",
  "default_branch": "main"
}
```

### `GET /api/v1/repositories/{repo_id}/tree`
Returns the indexed file hierarchy and symbol statistics.

---

## 2. Multi-Agent & Context Engine

### `POST /api/v1/analysis/scan`
Triggers full multi-agent AST and security sweep across the repository.
**Request**:
```json
{
  "repo_id": "demo-ecommerce-api",
  "commit_hash": "4a9f81d",
  "scanners": ["security", "ast", "complexity", "dependency"]
}
```

### `GET /api/v1/impact`
Computes the transitive blast radius for a target file or symbol.
**Query Parameters**:
- `file`: `backend/auth.py`
- `depth`: `3`

**Response**:
```json
{
  "target": "backend/auth.py",
  "impacted_files_count": 18,
  "breaking_routes": ["POST /auth/login", "GET /users/me"],
  "test_suites_to_run": ["tests/test_auth.py", "tests/test_users.py"],
  "nodes": [
    { "id": "backend/auth.py", "type": "source", "severity": "Critical" },
    { "id": "services/user_service.py", "type": "critical", "severity": "Critical" }
  ]
}
```

---

## 3. Refactoring & Testing

### `POST /api/v1/refactoring/propose`
Synthesizes an AST-compliant patch with unified Git diff.

### `POST /api/v1/sandboxes/run-tests`
Executes test suites inside an isolated Docker sandbox container.
**Response**:
```json
{
  "container_id": "aura-sandbox-c1",
  "duration_ms": 842,
  "passed": 12,
  "failed": 0,
  "flakiness_ratio": 0.00,
  "exit_code": 0
}
```

---

## 4. CI/CD & Self-Healing Telemetry

### `GET /api/v1/incidents`
Lists active and triaged production incidents.

### `POST /api/v1/incidents/{incident_id}/remediate`
Applies an approved self-healing configuration hotfix.

### `WS /api/v1/telemetry/stream`
WebSocket connection streaming live OpenTelemetry metrics (CPU, memory, P99 latency, 500 error rates) at 100ms sampling intervals.
