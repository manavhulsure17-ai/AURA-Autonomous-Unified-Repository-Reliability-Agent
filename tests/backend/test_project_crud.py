"""Unit tests for Project CRUD operations verifying FastAPI endpoints and SQLite database connectivity.

Covers:
- Project creation via POST /projects and POST /api/v1/projects
- Direct verification of persisted records in SQLite database
- Unique slug constraint enforcement in SQLite (returns 400 on duplicate)
- Listing projects with pagination (skip, limit) against SQLite
- Retrieving single project by primary key ID and by unique slug
- Project update via PUT /api/v1/projects/{id} and SQLite mutation verification
- Project deletion via DELETE /api/v1/projects/{id} and SQLite row removal
- Error handling for missing records (404 Not Found)
"""

import pytest
from datetime import datetime
from sqlalchemy import text
from models import Project


def test_create_project_persists_to_sqlite(client, db_session):
    """Verify POST /projects persists a project record into the SQLite database."""
    payload = {
        "slug": "billing-engine",
        "name": "Billing & Invoicing Engine",
        "description": "Core payment and invoicing services",
        "tier": "tier-1-mission-critical",
        "owner_team": "Billing Swarm",
    }
    response = client.post("/projects", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["slug"] == "billing-engine"
    assert data["name"] == "Billing & Invoicing Engine"
    assert data["id"] is not None

    # Verify directly against SQLite database using ORM
    proj_in_db = db_session.query(Project).filter_by(slug="billing-engine").first()
    assert proj_in_db is not None, "Project record was not found in SQLite database"
    assert proj_in_db.id == data["id"]
    assert proj_in_db.name == "Billing & Invoicing Engine"
    assert proj_in_db.tier == "tier-1-mission-critical"
    assert proj_in_db.owner_team == "Billing Swarm"
    assert isinstance(proj_in_db.created_at, datetime)
    assert isinstance(proj_in_db.updated_at, datetime)

    # Verify directly using raw SQL
    raw_row = db_session.execute(
        text("SELECT id, slug, name, owner_team FROM projects WHERE slug = :s"),
        {"s": "billing-engine"},
    ).fetchone()
    assert raw_row is not None
    assert raw_row[1] == "billing-engine"
    assert raw_row[2] == "Billing & Invoicing Engine"


def test_create_project_via_api_v1(client, db_session):
    """Verify POST /api/v1/projects persists project and increments SQLite record count."""
    initial_count = db_session.query(Project).count()

    payload = {
        "slug": "auth-sentinel",
        "name": "Auth Sentinel",
        "description": "Zero-trust session authorization",
        "tier": "tier-1-mission-critical",
        "owner_team": "Security Swarm",
    }
    response = client.post("/api/v1/projects", json=payload)
    assert response.status_code == 201

    # Verify SQLite row count increased by 1
    new_count = db_session.query(Project).count()
    assert new_count == initial_count + 1

    db_entity = db_session.query(Project).filter_by(slug="auth-sentinel").first()
    assert db_entity.name == "Auth Sentinel"


def test_project_unique_slug_enforcement(client, db_session):
    """Verify duplicate project slug is rejected with 400 and does not write duplicate to SQLite."""
    payload = {
        "slug": "shared-slug",
        "name": "Original Project",
        "tier": "tier-2-standard",
    }
    res1 = client.post("/api/v1/projects", json=payload)
    assert res1.status_code == 201

    # Attempt second insertion with same slug
    res2 = client.post("/api/v1/projects", json={
        "slug": "shared-slug",
        "name": "Conflicting Duplicate",
        "tier": "tier-3-experimental",
    })
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

    # Direct SQLite assertion: exactly one row exists for this slug
    slug_count = db_session.query(Project).filter_by(slug="shared-slug").count()
    assert slug_count == 1


def test_list_projects_and_pagination_from_sqlite(client, db_session):
    """Verify GET endpoints retrieve projects from SQLite with skip/limit pagination."""
    # Seed 5 projects directly into SQLite
    for i in range(1, 6):
        db_session.add(
            Project(
                slug=f"cluster-{i}",
                name=f"Cluster {i}",
                tier="tier-2-standard",
                owner_team="Infra Swarm",
            )
        )
    db_session.commit()

    # Query all projects
    res_all = client.get("/projects")
    assert res_all.status_code == 200
    all_data = res_all.json()
    assert len(all_data) == 5

    # Query with skip=2 and limit=2 via /projects
    res_paged = client.get("/projects?skip=2&limit=2")
    assert res_paged.status_code == 200
    paged_data = res_paged.json()
    assert len(paged_data) == 2
    assert paged_data[0]["slug"] == "cluster-3"
    assert paged_data[1]["slug"] == "cluster-4"

    # Query with skip=1 and limit=3 via /api/v1/projects
    res_v1_paged = client.get("/api/v1/projects?skip=1&limit=3")
    assert res_v1_paged.status_code == 200
    v1_data = res_v1_paged.json()
    assert len(v1_data) == 3
    assert v1_data[0]["slug"] == "cluster-2"


def test_get_project_by_id_and_slug(client, db_session):
    """Verify single project retrieval by ID and by slug from SQLite."""
    p = Project(
        slug="gateway-router",
        name="Gateway Router",
        description="Ingress traffic director",
        tier="tier-1-mission-critical",
    )
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)
    proj_id = p.id

    # Retrieve by ID
    res_id = client.get(f"/api/v1/projects/{proj_id}")
    assert res_id.status_code == 200
    assert res_id.json()["slug"] == "gateway-router"

    # Retrieve by slug
    res_slug = client.get("/api/v1/projects/by-slug/gateway-router")
    assert res_slug.status_code == 200
    assert res_slug.json()["id"] == proj_id

    # 404 on non-existent ID
    missing_id_res = client.get("/api/v1/projects/999999")
    assert missing_id_res.status_code == 404

    # 404 on non-existent slug
    missing_slug_res = client.get("/api/v1/projects/by-slug/does-not-exist")
    assert missing_slug_res.status_code == 404


def test_update_project_modifies_sqlite(client, db_session):
    """Verify PUT /api/v1/projects/{id} mutates SQLite record and updates modified fields."""
    p = Project(
        slug="queue-consumer",
        name="Queue Consumer V1",
        description="Initial version",
        tier="tier-2-standard",
        owner_team="Events Team",
    )
    db_session.add(p)
    db_session.commit()
    db_session.refresh(p)
    proj_id = p.id

    update_payload = {
        "name": "Queue Consumer V2",
        "description": "Upgraded partitioned Kafka consumer",
        "tier": "tier-1-mission-critical",
    }
    update_res = client.put(f"/api/v1/projects/{proj_id}", json=update_payload)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["name"] == "Queue Consumer V2"
    assert updated_data["tier"] == "tier-1-mission-critical"

    # Direct SQLite verification
    db_session.expire_all()
    in_db = db_session.query(Project).filter_by(id=proj_id).first()
    assert in_db.name == "Queue Consumer V2"
    assert in_db.description == "Upgraded partitioned Kafka consumer"
    assert in_db.tier == "tier-1-mission-critical"
    # Unchanged fields remain intact
    assert in_db.owner_team == "Events Team"

    # 404 on updating non-existent project
    missing_update = client.put("/api/v1/projects/999999", json={"name": "Ghost"})
    assert missing_update.status_code == 404


def test_delete_project_removes_from_sqlite(client, db_session):
    """Verify DELETE /api/v1/projects/{id} deletes the record from SQLite database."""
    p = Project(slug="decommission-service", name="To Decommission", tier="tier-3-experimental")
    db_session.add(p)
    db_session.commit()
    proj_id = p.id

    # Verify exists in SQLite initially
    assert db_session.query(Project).filter_by(id=proj_id).first() is not None

    del_res = client.delete(f"/api/v1/projects/{proj_id}")
    assert del_res.status_code == 204

    # Direct SQLite assertion: record is completely absent
    db_session.expire_all()
    assert db_session.query(Project).filter_by(id=proj_id).first() is None
    count = db_session.execute(
        text("SELECT COUNT(*) FROM projects WHERE id = :id"),
        {"id": proj_id},
    ).scalar()
    assert count == 0

    # Subsequent GET returns 404
    get_res = client.get(f"/api/v1/projects/{proj_id}")
    assert get_res.status_code == 404

    # Deleting again returns 404
    del_again = client.delete(f"/api/v1/projects/{proj_id}")
    assert del_again.status_code == 404
