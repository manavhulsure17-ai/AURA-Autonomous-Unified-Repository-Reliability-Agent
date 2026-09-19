"""Unit tests for RepositoryMetadata CRUD operations verifying FastAPI endpoints and SQLite database connectivity.

Covers:
- Repository registration via POST /repositories and POST /api/v1/repositories
- Verification of SQLite foreign key binding to parent Project
- Validation preventing orphaned repositories with non-existent project_id (404)
- Repository listing, filtering by project_id, and pagination against SQLite
- Repository retrieval by ID and 404 handling
- Updating repository metrics (ast_nodes_count, security_score, cyclomatic_complexity)
- AST scan execution via POST /api/v1/repositories/{id}/scan mutating last_scanned_at in SQLite
- Individual repository deletion via DELETE /api/v1/repositories/{id}
- Cascade deletion in SQLite (deleting parent Project removes all child repositories)
"""

import pytest
from datetime import datetime
from sqlalchemy import text
from models import Project, RepositoryMetadata


def test_create_repository_binds_to_parent_project_in_sqlite(client, db_session):
    """Verify repository creation stores row in SQLite with foreign key to parent Project."""
    parent = Project(slug="monorepo-core", name="Monorepo Core", tier="tier-1-mission-critical")
    db_session.add(parent)
    db_session.commit()
    db_session.refresh(parent)
    project_id = parent.id

    payload = {
        "project_id": project_id,
        "name": "core-kernel",
        "repo_url": "https://github.com/aura/core-kernel.git",
        "default_branch": "main",
        "language": "Rust",
        "ast_nodes_count": 14200,
        "cyclomatic_complexity": 2.8,
        "security_score": 99.1,
        "open_cves_count": 0,
        "is_active": True,
    }
    response = client.post("/repositories", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["project_id"] == project_id
    assert res_data["name"] == "core-kernel"
    repo_id = res_data["id"]

    # Direct SQLite verification
    db_session.expire_all()
    repo_in_db = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert repo_in_db is not None, "Repository record not found in SQLite"
    assert repo_in_db.project_id == project_id
    assert repo_in_db.language == "Rust"
    assert repo_in_db.ast_nodes_count == 14200
    assert repo_in_db.security_score == 99.1

    # Verify bidirectional relationship in SQLite
    assert repo_in_db.project.slug == "monorepo-core"
    parent_in_db = db_session.query(Project).filter_by(id=project_id).first()
    assert len(parent_in_db.repositories) == 1
    assert parent_in_db.repositories[0].name == "core-kernel"


def test_create_repository_rejects_invalid_project_id(client, db_session):
    """Verify attempting to create a repository with non-existent project_id fails with 404."""
    bad_payload = {
        "project_id": 888888,
        "name": "orphan-repository",
        "repo_url": "https://github.com/aura/orphan.git",
    }
    res1 = client.post("/repositories", json=bad_payload)
    assert res1.status_code == 404
    assert "does not exist" in res1.json()["detail"]

    res2 = client.post("/api/v1/repositories", json=bad_payload)
    assert res2.status_code == 404
    assert "not found" in res2.json()["detail"].lower()

    # Direct SQLite assertion: zero repository rows written
    assert db_session.query(RepositoryMetadata).count() == 0


def test_list_repositories_filtering_by_project_id(client, db_session):
    """Verify GET /repositories?project_id=... filters SQLite records by project."""
    p1 = Project(slug="alpha-team", name="Alpha Team")
    p2 = Project(slug="beta-team", name="Beta Team")
    db_session.add_all([p1, p2])
    db_session.commit()
    db_session.refresh(p1)
    db_session.refresh(p2)

    # Attach 2 repositories to p1 and 1 to p2
    r1 = RepositoryMetadata(project_id=p1.id, name="alpha-api", repo_url="http://alpha/api")
    r2 = RepositoryMetadata(project_id=p1.id, name="alpha-web", repo_url="http://alpha/web")
    r3 = RepositoryMetadata(project_id=p2.id, name="beta-worker", repo_url="http://beta/worker")
    db_session.add_all([r1, r2, r3])
    db_session.commit()

    # Query all repositories
    all_res = client.get("/repositories")
    assert all_res.status_code == 200
    assert len(all_res.json()) == 3

    # Filter for p1
    p1_res = client.get(f"/repositories?project_id={p1.id}")
    assert p1_res.status_code == 200
    p1_list = p1_res.json()
    assert len(p1_list) == 2
    assert {item["name"] for item in p1_list} == {"alpha-api", "alpha-web"}

    # Filter for p2 via api/v1
    p2_res = client.get(f"/api/v1/repositories?project_id={p2.id}")
    assert p2_res.status_code == 200
    p2_list = p2_res.json()
    assert len(p2_list) == 1
    assert p2_list[0]["name"] == "beta-worker"


def test_get_repository_by_id(client, db_session):
    """Verify single repository lookup by primary key ID and 404 handling."""
    p = Project(slug="lookup-proj", name="Lookup Proj")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)

    repo = RepositoryMetadata(project_id=p.id, name="target-repo", repo_url="http://lookup/repo")
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    repo_id = repo.id

    res = client.get(f"/api/v1/repositories/{repo_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "target-repo"

    # Non-existent ID returns 404
    missing_res = client.get("/api/v1/repositories/999999")
    assert missing_res.status_code == 404


def test_update_repository_metrics_in_sqlite(client, db_session):
    """Verify PUT /api/v1/repositories/{id} mutates repository metrics in SQLite."""
    p = Project(slug="metrics-proj", name="Metrics Proj")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)

    repo = RepositoryMetadata(
        project_id=p.id,
        name="metrics-repo",
        repo_url="http://repo",
        ast_nodes_count=500,
        security_score=75.0,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    repo_id = repo.id

    update_payload = {
        "ast_nodes_count": 2800,
        "security_score": 96.5,
        "cyclomatic_complexity": 3.2,
        "is_active": True,
    }
    put_res = client.put(f"/api/v1/repositories/{repo_id}", json=update_payload)
    assert put_res.status_code == 200
    assert put_res.json()["ast_nodes_count"] == 2800

    # Direct SQLite assertion
    db_session.expire_all()
    in_db = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert in_db.ast_nodes_count == 2800
    assert in_db.security_score == 96.5
    assert in_db.cyclomatic_complexity == 3.2


def test_trigger_repository_ast_scan_in_sqlite(client, db_session):
    """Verify POST /api/v1/repositories/{id}/scan updates last_scanned_at timestamp in SQLite."""
    p = Project(slug="scan-proj", name="Scan Proj")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)

    repo = RepositoryMetadata(project_id=p.id, name="scan-repo", repo_url="http://repo")
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    repo_id = repo.id

    assert repo.last_scanned_at is None

    scan_res = client.post(f"/api/v1/repositories/{repo_id}/scan")
    assert scan_res.status_code == 200
    assert scan_res.json()["last_scanned_at"] is not None

    # Direct SQLite assertion
    db_session.expire_all()
    scanned_db = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert scanned_db.last_scanned_at is not None
    assert isinstance(scanned_db.last_scanned_at, datetime)


def test_delete_repository_keeps_parent_project(client, db_session):
    """Verify deleting a repository removes it from SQLite but leaves the parent Project."""
    p = Project(slug="parent-keeper", name="Parent Keeper")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)
    proj_id = p.id

    repo = RepositoryMetadata(project_id=proj_id, name="disposable-repo", repo_url="http://repo")
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    repo_id = repo.id

    del_res = client.delete(f"/api/v1/repositories/{repo_id}")
    assert del_res.status_code == 204

    # Direct SQLite checks
    db_session.expire_all()
    assert db_session.query(RepositoryMetadata).filter_by(id=repo_id).first() is None
    # Parent project still exists
    assert db_session.query(Project).filter_by(id=proj_id).first() is not None


def test_cascade_deletion_cleans_up_repositories_in_sqlite(client, db_session):
    """Verify deleting a Project automatically cascades and cleans up child repositories in SQLite."""
    project = Project(slug="monorepo-parent", name="Monorepo Parent")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    project_id = project.id

    # Create 3 child repositories in SQLite
    repo1 = RepositoryMetadata(project_id=project_id, name="mod-core", repo_url="http://r1")
    repo2 = RepositoryMetadata(project_id=project_id, name="mod-api", repo_url="http://r2")
    repo3 = RepositoryMetadata(project_id=project_id, name="mod-cli", repo_url="http://r3")
    db_session.add_all([repo1, repo2, repo3])
    db_session.commit()

    # Pre-condition: records exist in SQLite
    assert db_session.query(Project).filter_by(id=project_id).count() == 1
    assert db_session.query(RepositoryMetadata).filter_by(project_id=project_id).count() == 3

    # Delete parent project via API endpoint
    delete_res = client.delete(f"/api/v1/projects/{project_id}")
    assert delete_res.status_code == 204

    # Post-condition: parent project and child repositories are removed from SQLite
    db_session.expire_all()
    assert db_session.query(Project).filter_by(id=project_id).first() is None

    child_count = db_session.query(RepositoryMetadata).filter_by(project_id=project_id).count()
    assert child_count == 0, f"Expected 0 child repositories after cascade, found {child_count}"

    # Confirm using raw SQL on SQLite table
    raw_count = db_session.execute(
        text("SELECT COUNT(*) FROM repository_metadata WHERE project_id = :pid"),
        {"pid": project_id},
    ).scalar()
    assert raw_count == 0
