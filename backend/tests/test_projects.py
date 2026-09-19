"""Unit tests for Projects API verifying SQLite database interaction."""

from models import Project


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "docs_url" in data


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"


def test_create_and_get_project(client, db_session):
    payload = {
        "slug": "billing-service",
        "name": "Billing Microservice",
        "description": "Handles Stripe and invoicing webhooks with idempotency.",
        "tier": "tier-1-mission-critical",
        "owner_team": "Payments Swarm",
    }
    create_res = client.post("/api/v1/projects", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["slug"] == "billing-service"
    assert created_data["name"] == "Billing Microservice"
    project_id = created_data["id"]

    # Direct SQLite assertion: record was persisted into SQLite database
    db_proj = db_session.query(Project).filter_by(id=project_id).first()
    assert db_proj is not None
    assert db_proj.slug == "billing-service"
    assert db_proj.name == "Billing Microservice"
    assert db_proj.tier == "tier-1-mission-critical"

    # Fetch by ID via API
    get_res = client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["slug"] == "billing-service"

    # Fetch by slug via API
    slug_res = client.get("/api/v1/projects/by-slug/billing-service")
    assert slug_res.status_code == 200
    assert slug_res.json()["name"] == "Billing Microservice"


def test_duplicate_project_slug_rejected(client, db_session):
    payload = {
        "slug": "duplicate-test",
        "name": "Original",
    }
    r1 = client.post("/api/v1/projects", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/api/v1/projects", json=payload)
    assert r2.status_code == 400
    assert "already exists" in r2.json()["detail"]

    # Direct SQLite assertion: only 1 project exists in SQLite
    count = db_session.query(Project).filter_by(slug="duplicate-test").count()
    assert count == 1


def test_update_and_delete_project(client, db_session):
    payload = {
        "slug": "temp-project",
        "name": "Temporary Project",
    }
    create_res = client.post("/api/v1/projects", json=payload)
    p_id = create_res.json()["id"]

    # Direct SQLite assertion: project exists initially
    assert db_session.query(Project).filter_by(id=p_id).first() is not None

    # Update via API
    update_res = client.put(f"/api/v1/projects/{p_id}", json={"name": "Renamed Temp Project"})
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Renamed Temp Project"

    # Direct SQLite assertion: update persisted to SQLite
    db_session.expire_all()
    updated_in_db = db_session.query(Project).filter_by(id=p_id).first()
    assert updated_in_db.name == "Renamed Temp Project"

    # Delete via API
    del_res = client.delete(f"/api/v1/projects/{p_id}")
    assert del_res.status_code == 204

    # Direct SQLite assertion: deleted from SQLite table
    db_session.expire_all()
    assert db_session.query(Project).filter_by(id=p_id).first() is None

    # Verify deleted via API
    not_found = client.get(f"/api/v1/projects/{p_id}")
    assert not_found.status_code == 404

