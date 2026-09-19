"""Unit tests for Repositories Metadata API."""

def test_create_and_query_repository(client):
    # First create parent project
    p_res = client.post("/api/v1/projects", json={
        "slug": "auth-monorepo",
        "name": "Auth Monorepo",
        "tier": "tier-1-mission-critical",
    })
    project_id = p_res.json()["id"]

    # Register repository metadata
    repo_payload = {
        "project_id": project_id,
        "name": "auth-service-core",
        "repo_url": "https://github.com/aura-swarm/auth-service-core.git",
        "default_branch": "main",
        "language": "Python",
        "ast_nodes_count": 5200,
        "cyclomatic_complexity": 2.8,
        "security_score": 95.0,
        "open_cves_count": 0,
        "is_active": True,
    }
    r_res = client.post("/api/v1/repositories", json=repo_payload)
    assert r_res.status_code == 201
    repo_data = r_res.json()
    assert repo_data["name"] == "auth-service-core"
    assert repo_data["ast_nodes_count"] == 5200
    repo_id = repo_data["id"]

    # Query all repos for project
    list_res = client.get(f"/api/v1/repositories?project_id={project_id}")
    assert list_res.status_code == 200
    repos = list_res.json()
    assert len(repos) >= 1

    # Trigger AST scan
    scan_res = client.post(f"/api/v1/repositories/{repo_id}/scan")
    assert scan_res.status_code == 200
    assert scan_res.json()["last_scanned_at"] is not None


def test_repository_invalid_project_id(client):
    repo_payload = {
        "project_id": 999999,
        "name": "orphan-repo",
        "repo_url": "https://github.com/aura/orphan.git",
    }
    res = client.post("/api/v1/repositories", json=repo_payload)
    assert res.status_code == 404
    assert "Parent project" in res.json()["detail"]
