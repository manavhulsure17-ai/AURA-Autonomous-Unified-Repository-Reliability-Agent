"""Unit tests verifying SQLite database connectivity and schema integrity for FastAPI.

Validates:
- Engine connection and dialect recognition (sqlite)
- Tables initialization ('projects' and 'repository_metadata')
- SQLite foreign key pragma enforcement (PRAGMA foreign_keys = 1)
- Raw SQL query execution on SQLite engine
- Transaction isolation and rollback semantics
- FastAPI /health endpoint validating database connectivity
"""

import pytest
from sqlalchemy import inspect, text
from models import Project, RepositoryMetadata


def test_sqlite_engine_connectivity_and_dialect(sqlite_engine):
    """Verify SQLAlchemy engine successfully connects to SQLite and dialect is sqlite."""
    assert sqlite_engine.dialect.name == "sqlite"
    with sqlite_engine.connect() as conn:
        result = conn.execute(text("SELECT 1 AS alive")).scalar()
        assert result == 1


def test_sqlite_foreign_keys_pragma_enabled(db_session):
    """Verify SQLite PRAGMA foreign_keys is explicitly enabled for relational integrity."""
    fk_status = db_session.execute(text("PRAGMA foreign_keys")).scalar()
    assert fk_status == 1, f"Expected PRAGMA foreign_keys to be 1 (ON), got {fk_status}"


def test_sqlite_tables_and_columns_exist(sqlite_engine, db_session):
    """Verify SQLite database schema initializes projects and repository_metadata tables."""
    inspector = inspect(sqlite_engine)
    table_names = inspector.get_table_names()

    assert "projects" in table_names, "Table 'projects' must exist in SQLite database"
    assert "repository_metadata" in table_names, "Table 'repository_metadata' must exist in SQLite database"

    # Check projects table columns
    project_columns = {col["name"]: col for col in inspector.get_columns("projects")}
    expected_project_cols = ["id", "slug", "name", "description", "tier", "owner_team", "created_at", "updated_at"]
    for col in expected_project_cols:
        assert col in project_columns, f"Expected column '{col}' in 'projects' table"

    # Check repository_metadata table columns
    repo_columns = {col["name"]: col for col in inspector.get_columns("repository_metadata")}
    expected_repo_cols = [
        "id", "project_id", "name", "repo_url", "default_branch",
        "language", "ast_nodes_count", "cyclomatic_complexity",
        "security_score", "open_cves_count", "is_active",
        "last_scanned_at", "created_at", "updated_at"
    ]
    for col in expected_repo_cols:
        assert col in repo_columns, f"Expected column '{col}' in 'repository_metadata' table"


def test_sqlite_transaction_rollback(db_session):
    """Verify database transactions can be rolled back without leaking records."""
    initial_count = db_session.query(Project).count()

    temp_proj = Project(
        slug="rollback-project",
        name="Rollback Candidate",
        tier="tier-3-experimental",
    )
    db_session.add(temp_proj)
    db_session.flush()

    # Verify present before rollback
    assert db_session.query(Project).filter_by(slug="rollback-project").count() == 1

    # Roll back transaction
    db_session.rollback()

    # Verify completely absent after rollback
    assert db_session.query(Project).count() == initial_count
    assert db_session.query(Project).filter_by(slug="rollback-project").first() is None


def test_fastapi_health_endpoint_connectivity(client):
    """Verify FastAPI /health endpoint executes SELECT 1 against SQLite and returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert payload["database"] == "connected"
    assert payload["engine"] == "sqlite"
