"""Comprehensive pytest test suite verifying Project and Repository API endpoints
correctly interact with the SQLite database.

Validates:
1. SQLite schema and table creation (projects and repository_metadata tables, columns, pragmas)
2. Direct SQLite persistence on Project creation (POST /projects, POST /api/v1/projects)
3. SQLite unique constraint enforcement on project slug
4. SQLite querying and pagination (GET /projects, GET /api/v1/projects, skip/limit)
5. SQLite record retrieval by primary key and unique slug
6. SQLite mutation on Project update (PUT /api/v1/projects/{id})
7. SQLite row removal on Project deletion (DELETE /api/v1/projects/{id})
8. Repository foreign key binding and relationship integrity in SQLite
9. Foreign key validation preventing orphaned repositories in SQLite
10. Repository filtering by project_id and pagination in SQLite
11. Repository metrics and scan timestamp updates in SQLite (PUT / POST scan)
12. Cascade deletion in SQLite (deleting Project cleans up associated Repository rows)
13. Database connectivity and query execution via health check endpoint
"""

import pytest
from datetime import datetime
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from models import Project, RepositoryMetadata


# ==============================================================================
# 1. SQLite Schema & Table Structure Verification
# ==============================================================================

def test_sqlite_schema_and_tables_exist(sqlite_engine, db_session):
    """Verify SQLite database schema initializes projects and repository_metadata tables."""
    inspector = inspect(sqlite_engine)
    table_names = inspector.get_table_names()

    assert "projects" in table_names, "Table 'projects' should exist in SQLite database"
    assert "repository_metadata" in table_names, "Table 'repository_metadata' should exist in SQLite database"

    # Verify columns in projects table
    project_columns = {col["name"]: col for col in inspector.get_columns("projects")}
    expected_project_cols = ["id", "slug", "name", "description", "tier", "owner_team", "created_at", "updated_at"]
    for col_name in expected_project_cols:
        assert col_name in project_columns, f"Column '{col_name}' missing from SQLite 'projects' table"

    # Verify columns in repository_metadata table
    repo_columns = {col["name"]: col for col in inspector.get_columns("repository_metadata")}
    expected_repo_cols = [
        "id", "project_id", "name", "repo_url", "default_branch",
        "language", "ast_nodes_count", "cyclomatic_complexity",
        "security_score", "open_cves_count", "is_active",
        "last_scanned_at", "created_at", "updated_at",
    ]
    for col_name in expected_repo_cols:
        assert col_name in repo_columns, f"Column '{col_name}' missing from SQLite 'repository_metadata' table"

    # Execute SQLite PRAGMA table_info directly
    pragma_rows = db_session.execute(text("PRAGMA table_info(projects)")).fetchall()
    pragma_col_names = [row[1] for row in pragma_rows]
    assert "slug" in pragma_col_names
    assert "id" in pragma_col_names


# ==============================================================================
# 2. Project Creation & Direct SQLite Persistence Verification
# ==============================================================================

def test_create_project_persists_to_sqlite_via_post_projects(client, db_session):
    """Verify POST /projects commits entity to SQLite table and can be queried directly."""
    payload = {
        "slug": "telemetry-core",
        "name": "Telemetry Ingestion Core",
        "description": "High-throughput OpenTelemetry collector service",
        "tier": "tier-1-mission-critical",
        "owner_team": "Reliability Swarm",
    }
    response = client.post("/projects", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["slug"] == "telemetry-core"
    assert res_data["id"] is not None

    # Direct SQLite verification using SQLAlchemy session
    sqlite_project = db_session.query(Project).filter_by(slug="telemetry-core").first()
    assert sqlite_project is not None, "Project was not persisted to SQLite database"
    assert sqlite_project.id == res_data["id"]
    assert sqlite_project.name == "Telemetry Ingestion Core"
    assert sqlite_project.tier == "tier-1-mission-critical"
    assert sqlite_project.owner_team == "Reliability Swarm"
    assert isinstance(sqlite_project.created_at, datetime)
    assert isinstance(sqlite_project.updated_at, datetime)

    # Direct SQLite verification using raw SQL
    raw_row = db_session.execute(
        text("SELECT id, slug, name, tier FROM projects WHERE slug = :s"),
        {"s": "telemetry-core"},
    ).fetchone()
    assert raw_row is not None
    assert raw_row[1] == "telemetry-core"
    assert raw_row[2] == "Telemetry Ingestion Core"


def test_create_project_persists_to_sqlite_via_api_v1(client, db_session):
    """Verify POST /api/v1/projects commits entity to SQLite and increments row count."""
    initial_count = db_session.query(Project).count()

    payload = {
        "slug": "auth-gateway",
        "name": "Authentication Gateway",
        "description": "OAuth 2.0 and JWT verification service",
        "tier": "tier-1-mission-critical",
        "owner_team": "Security Swarm",
    }
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 201

    new_count = db_session.query(Project).count()
    assert new_count == initial_count + 1

    db_proj = db_session.query(Project).filter_by(slug="auth-gateway").first()
    assert db_proj.name == "Authentication Gateway"


def test_sqlite_unique_slug_constraint_enforced_by_api(client, db_session):
    """Verify duplicate project slug is rejected and does not write duplicate to SQLite."""
    payload = {
        "slug": "unique-slug-test",
        "name": "First Instance",
        "tier": "tier-2-standard",
    }
    res1 = client.post("/api/v1/projects", json=payload)
    assert res1.status_code == 201

    # Attempt second insertion with same slug
    payload_duplicate = {
        "slug": "unique-slug-test",
        "name": "Duplicate Instance",
        "tier": "tier-3-experimental",
    }
    res2 = client.post("/api/v1/projects", json=payload_duplicate)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

    # Direct SQLite check: exactly 1 record exists with this slug
    rows = db_session.query(Project).filter_by(slug="unique-slug-test").all()
    assert len(rows) == 1
    assert rows[0].name == "First Instance"


# ==============================================================================
# 3. Project Retrieval & Pagination Direct from SQLite
# ==============================================================================

def test_list_projects_reads_from_sqlite_with_pagination(client, db_session):
    """Verify GET /projects and GET /api/v1/projects read SQLite table with skip and limit."""
    # Seed 5 projects directly into SQLite
    for i in range(1, 6):
        db_session.add(
            Project(
                slug=f"service-{i}",
                name=f"Service {i}",
                description=f"Auto-seeded service {i}",
                tier="tier-2-standard",
                owner_team="Platform Swarm",
            )
        )
    db_session.commit()

    # Query without pagination parameters
    res_all = client.get("/projects")
    assert res_all.status_code == 200
    assert len(res_all.json()) == 5

    # Query with skip=2 and limit=2 via /projects
    res_paged1 = client.get("/projects?skip=2&limit=2")
    assert res_paged1.status_code == 200
    paged1_data = res_paged1.json()
    assert len(paged1_data) == 2
    assert paged1_data[0]["slug"] == "service-3"
    assert paged1_data[1]["slug"] == "service-4"

    # Query with skip=1 and limit=3 via /api/v1/projects
    res_paged2 = client.get("/api/v1/projects?skip=1&limit=3")
    assert res_paged2.status_code == 200
    paged2_data = res_paged2.json()
    assert len(paged2_data) == 3
    assert paged2_data[0]["slug"] == "service-2"


def test_get_project_by_id_and_slug_from_sqlite(client, db_session):
    """Verify single project lookup by ID and slug reads SQLite and returns 404 for missing."""
    p = Project(
        slug="billing-engine",
        name="Billing Engine",
        description="Invoicing and subscription lifecycle",
        tier="tier-1-mission-critical",
    )
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)
    project_id = p.id

    # Lookup by ID
    res_id = client.get(f"/api/v1/projects/{project_id}")
    assert res_id.status_code == 200
    assert res_id.json()["slug"] == "billing-engine"

    # Lookup by slug
    res_slug = client.get("/api/v1/projects/by-slug/billing-engine")
    assert res_slug.status_code == 200
    assert res_slug.json()["id"] == project_id

    # Non-existent lookups
    res_missing_id = client.get("/api/v1/projects/999999")
    assert res_missing_id.status_code == 404

    res_missing_slug = client.get("/api/v1/projects/by-slug/non-existent-service")
    assert res_missing_slug.status_code == 404


# ==============================================================================
# 4. Project Update & Direct SQLite Mutation
# ==============================================================================

def test_update_project_modifies_sqlite_record(client, db_session):
    """Verify PUT /api/v1/projects/{id} mutates SQLite row and updates fields."""
    p = Project(
        slug="search-indexer",
        name="Search Indexer Old",
        description="Initial description",
        tier="tier-2-standard",
        owner_team="Search Swarm",
    )
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)
    proj_id = p.id

    update_payload = {
        "name": "Search Indexer V2",
        "description": "Upgraded vector search indexer",
        "tier": "tier-1-mission-critical",
    }
    res = client.put(f"/api/v1/projects/{proj_id}", json=update_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Search Indexer V2"
    assert data["tier"] == "tier-1-mission-critical"

    # Direct SQLite query to verify mutation persisted
    db_session.expire_all()
    updated_in_db = db_session.query(Project).filter_by(id=proj_id).first()
    assert updated_in_db.name == "Search Indexer V2"
    assert updated_in_db.description == "Upgraded vector search indexer"
    assert updated_in_db.tier == "tier-1-mission-critical"
    # Unchanged fields remain intact
    assert updated_in_db.owner_team == "Search Swarm"


# ==============================================================================
# 5. Project Deletion & Direct SQLite Removal
# ==============================================================================

def test_delete_project_removes_record_from_sqlite(client, db_session):
    """Verify DELETE /api/v1/projects/{id} deletes row from SQLite table."""
    p = Project(slug="obsolete-worker", name="Obsolete Worker", tier="tier-3-experimental")
    db_session.add(p)
    db_session.commit()
    proj_id = p.id

    # Verify exists in SQLite
    assert db_session.query(Project).filter_by(id=proj_id).first() is not None

    del_res = client.delete(f"/api/v1/projects/{proj_id}")
    assert del_res.status_code == 204

    # Direct SQLite verification: row no longer exists
    db_session.expire_all()
    assert db_session.query(Project).filter_by(id=proj_id).first() is None
    count = db_session.execute(
        text("SELECT COUNT(*) FROM projects WHERE id = :id"),
        {"id": proj_id},
    ).scalar()
    assert count == 0


# ==============================================================================
# 6. Repository Creation & Foreign Key Association in SQLite
# ==============================================================================

def test_create_repository_binds_foreign_key_in_sqlite(client, db_session):
    """Verify POST /repositories registers repository with SQLite foreign key to parent Project."""
    # Seed parent project directly into SQLite
    parent = Project(slug="infra-hub", name="Infrastructure Hub", tier="tier-1-mission-critical")
    db_session.add(parent)
    db_session.commit()
    db_session.refresh(parent)
    proj_id = parent.id

    repo_payload = {
        "project_id": proj_id,
        "name": "k8s-operator",
        "repo_url": "https://github.com/aura/k8s-operator.git",
        "default_branch": "main",
        "language": "Go",
        "ast_nodes_count": 8940,
        "cyclomatic_complexity": 3.4,
        "security_score": 98.2,
        "open_cves_count": 0,
        "is_active": True,
    }
    res = client.post("/repositories", json=repo_payload)
    assert res.status_code == 201
    repo_data = res.json()
    repo_id = repo_data["id"]
    assert repo_data["project_id"] == proj_id

    # Direct SQLite query verifying foreign key relation
    db_session.expire_all()
    db_repo = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert db_repo is not None
    assert db_repo.project_id == proj_id
    assert db_repo.language == "Go"
    assert db_repo.ast_nodes_count == 8940

    # Verify SQLAlchemy relationship traversal in SQLite
    assert db_repo.project.slug == "infra-hub"
    parent_in_db = db_session.query(Project).filter_by(id=proj_id).first()
    assert len(parent_in_db.repositories) == 1
    assert parent_in_db.repositories[0].name == "k8s-operator"

    # Raw SQL join verification against SQLite
    joined_row = db_session.execute(
        text(
            "SELECT r.name, r.language, p.name FROM repository_metadata r "
            "JOIN projects p ON r.project_id = p.id WHERE r.id = :r_id"
        ),
        {"r_id": repo_id},
    ).fetchone()
    assert joined_row[0] == "k8s-operator"
    assert joined_row[1] == "Go"
    assert joined_row[2] == "Infrastructure Hub"


def test_create_repository_fails_with_nonexistent_project_id(client, db_session):
    """Verify creating repository with invalid project_id returns 404 and inserts nothing in SQLite."""
    bad_payload = {
        "project_id": 999999,
        "name": "orphan-codebase",
        "repo_url": "https://github.com/aura/orphan.git",
    }
    res1 = client.post("/repositories", json=bad_payload)
    assert res1.status_code == 404
    assert "does not exist" in res1.json()["detail"]

    res2 = client.post("/api/v1/repositories", json=bad_payload)
    assert res2.status_code == 404
    assert "not found" in res2.json()["detail"].lower()

    # Direct SQLite check: repository_metadata table remains empty
    assert db_session.query(RepositoryMetadata).count() == 0


# ==============================================================================
# 7. Repository Filtering by Project ID & Pagination in SQLite
# ==============================================================================

def test_list_repositories_filters_by_project_id_in_sqlite(client, db_session):
    """Verify GET /repositories?project_id=... executes filtered query against SQLite."""
    # Create two projects
    p1 = Project(slug="proj-alpha", name="Project Alpha")
    p2 = Project(slug="proj-beta", name="Project Beta")
    db_session.add_all([p1, p2])
    db_session.commit()
    db_session.refresh(p1)
    db_session.refresh(p2)

    # Attach 2 repos to p1, 1 repo to p2
    r1 = RepositoryMetadata(project_id=p1.id, name="alpha-api", repo_url="http://alpha/api")
    r2 = RepositoryMetadata(project_id=p1.id, name="alpha-ui", repo_url="http://alpha/ui")
    r3 = RepositoryMetadata(project_id=p2.id, name="beta-worker", repo_url="http://beta/worker")
    db_session.add_all([r1, r2, r3])
    db_session.commit()

    # Query all repos (unfiltered)
    res_all = client.get("/repositories")
    assert res_all.status_code == 200
    assert len(res_all.json()) == 3

    # Filter by project 1
    res_p1 = client.get(f"/repositories?project_id={p1.id}")
    assert res_p1.status_code == 200
    p1_repos = res_p1.json()
    assert len(p1_repos) == 2
    assert {r["name"] for r in p1_repos} == {"alpha-api", "alpha-ui"}

    # Filter by project 2 via API v1
    res_p2 = client.get(f"/api/v1/repositories?project_id={p2.id}")
    assert res_p2.status_code == 200
    p2_repos = res_p2.json()
    assert len(p2_repos) == 1
    assert p2_repos[0]["name"] == "beta-worker"


# ==============================================================================
# 8. Repository Updates, AST Scan, & Deletion in SQLite
# ==============================================================================

def test_update_and_scan_repository_persists_to_sqlite(client, db_session):
    """Verify repository metric updates and AST scan timestamp mutations persist to SQLite."""
    p = Project(slug="analytics-engine", name="Analytics Engine")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)

    repo = RepositoryMetadata(
        project_id=p.id,
        name="event-processor",
        repo_url="http://analytics/event-processor",
        ast_nodes_count=1000,
        security_score=80.0,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    repo_id = repo.id

    # Update metrics via PUT
    update_res = client.put(
        f"/api/v1/repositories/{repo_id}",
        json={
            "ast_nodes_count": 3500,
            "security_score": 94.5,
            "cyclomatic_complexity": 4.1,
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["ast_nodes_count"] == 3500

    # Direct SQLite assertion for update
    db_session.expire_all()
    updated_repo = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert updated_repo.ast_nodes_count == 3500
    assert updated_repo.security_score == 94.5
    assert updated_repo.cyclomatic_complexity == 4.1

    # Trigger AST scan
    assert updated_repo.last_scanned_at is None
    scan_res = client.post(f"/api/v1/repositories/{repo_id}/scan")
    assert scan_res.status_code == 200
    assert scan_res.json()["last_scanned_at"] is not None

    # Direct SQLite assertion for scan timestamp
    db_session.expire_all()
    scanned_repo = db_session.query(RepositoryMetadata).filter_by(id=repo_id).first()
    assert scanned_repo.last_scanned_at is not None
    assert isinstance(scanned_repo.last_scanned_at, datetime)


def test_delete_repository_removes_record_from_sqlite(client, db_session):
    """Verify DELETE /api/v1/repositories/{id} removes repository while keeping project."""
    p = Project(slug="keeper-project", name="Keeper Project")
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)

    repo = RepositoryMetadata(project_id=p.id, name="temp-repo", repo_url="http://repo")
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    r_id = repo.id

    del_res = client.delete(f"/api/v1/repositories/{r_id}")
    assert del_res.status_code == 204

    # Direct SQLite check
    db_session.expire_all()
    assert db_session.query(RepositoryMetadata).filter_by(id=r_id).first() is None
    # Parent project still intact
    assert db_session.query(Project).filter_by(id=p.id).first() is not None


# ==============================================================================
# 9. Cascade Deletion in SQLite
# ==============================================================================

def test_sqlite_cascade_delete_cleans_up_repositories(client, db_session):
    """Verify deleting a Project cascades and deletes all associated Repository records in SQLite."""
    project = Project(slug="monorepo-parent", name="Monorepo Parent")
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)
    project_id = project.id

    # Create 3 child repositories in SQLite
    repo1 = RepositoryMetadata(project_id=project_id, name="pkg-core", repo_url="http://r1")
    repo2 = RepositoryMetadata(project_id=project_id, name="pkg-web", repo_url="http://r2")
    repo3 = RepositoryMetadata(project_id=project_id, name="pkg-cli", repo_url="http://r3")
    db_session.add_all([repo1, repo2, repo3])
    db_session.commit()

    # Verify records exist in SQLite before delete
    assert db_session.query(Project).filter_by(id=project_id).count() == 1
    assert db_session.query(RepositoryMetadata).filter_by(project_id=project_id).count() == 3

    # Delete parent project via API endpoint
    delete_res = client.delete(f"/api/v1/projects/{project_id}")
    assert delete_res.status_code == 204

    # Direct SQLite assertion: parent project is deleted
    db_session.expire_all()
    assert db_session.query(Project).filter_by(id=project_id).first() is None

    # Direct SQLite assertion: all associated repositories are cascaded and deleted
    remaining_repos_count = db_session.query(RepositoryMetadata).filter_by(project_id=project_id).count()
    assert remaining_repos_count == 0, f"Expected 0 repositories after cascade delete, found {remaining_repos_count}"

    # Confirm using raw SQL on SQLite table
    raw_repo_count = db_session.execute(
        text("SELECT COUNT(*) FROM repository_metadata WHERE project_id = :p_id"),
        {"p_id": project_id},
    ).scalar()
    assert raw_repo_count == 0


# ==============================================================================
# 10. Database Health Check Endpoint Verification
# ==============================================================================

def test_health_check_verifies_sqlite_database_connectivity(client):
    """Verify GET /health executes SELECT 1 query on SQLite database and confirms connectivity."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert data["engine"] == "sqlite"
