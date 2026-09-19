"""Tests for backend/main.py base FastAPI application and initial routes."""

import pytest
from fastapi.testclient import TestClient
from main import app
from app.db.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


@pytest.fixture(scope="module")
def main_client():
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)


def test_main_root_and_health(main_client):
    res_root = main_client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["status"] == "online"

    res_health = main_client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_main_list_and_create_project(main_client):
    # Test initial listing (may be empty initially)
    list_res = main_client.get("/projects")
    assert list_res.status_code == 200
    assert isinstance(list_res.json(), list)

    # Create project
    create_payload = {
        "slug": "main-project-alpha",
        "name": "Project Alpha",
        "description": "Created via backend/main.py initial routes",
        "tier": "tier-1-mission-critical",
        "owner_team": "Infrastructure Swarm",
    }
    create_res = main_client.post("/projects", json=create_payload)
    assert create_res.status_code == 201
    created_proj = create_res.json()
    assert created_proj["slug"] == "main-project-alpha"
    assert created_proj["id"] > 0

    # Verify project appears in listing
    list_res_after = main_client.get("/projects")
    assert list_res_after.status_code == 200
    slugs = [p["slug"] for p in list_res_after.json()]
    assert "main-project-alpha" in slugs


def test_main_register_repository_metadata(main_client):
    # First get or create parent project
    list_res = main_client.get("/projects")
    proj_id = list_res.json()[0]["id"]

    # Register repository metadata
    repo_payload = {
        "project_id": proj_id,
        "name": "alpha-auth-service",
        "repo_url": "https://github.com/aura/alpha-auth-service.git",
        "default_branch": "main",
        "language": "Python",
        "ast_nodes_count": 1420,
        "cyclomatic_complexity": 3.8,
        "security_score": 96.5,
        "open_cves_count": 0,
        "is_active": True,
    }
    repo_res = main_client.post("/repositories", json=repo_payload)
    assert repo_res.status_code == 201
    repo_data = repo_res.json()
    assert repo_data["name"] == "alpha-auth-service"
    assert repo_data["project_id"] == proj_id
    assert repo_data["ast_nodes_count"] == 1420

    # Verify listing repositories
    repos_list = main_client.get(f"/repositories?project_id={proj_id}")
    assert repos_list.status_code == 200
    names = [r["name"] for r in repos_list.json()]
    assert "alpha-auth-service" in names


def test_register_repository_invalid_project(main_client):
    bad_repo_payload = {
        "project_id": 99999,
        "name": "orphaned-repo",
        "repo_url": "https://github.com/aura/orphaned.git",
    }
    repo_res = main_client.post("/repositories", json=bad_repo_payload)
    assert repo_res.status_code == 404
    assert "does not exist" in repo_res.json()["detail"]
