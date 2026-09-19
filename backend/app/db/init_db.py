"""Database initialization and seeding helper."""

from datetime import datetime
from sqlalchemy.orm import Session
from app.db.database import Base, engine, SessionLocal
from app.models.project import Project
from app.models.repository import RepositoryMetadata


def init_db(db: Session) -> None:
    """Create all schema tables and seed initial project & repository records."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Check if existing projects exist
    existing_project = db.query(Project).filter(Project.slug == "demo-ecommerce-api").first()
    if not existing_project:
        demo_project = Project(
            slug="demo-ecommerce-api",
            name="Demo E-Commerce Microservices",
            description="Core payment and user authentication service with static taint tracking and AST AST resolution.",
            tier="tier-1-mission-critical",
            owner_team="AURA Core Swarm",
        )
        db.add(demo_project)
        db.commit()
        db.refresh(demo_project)

        repo_meta = RepositoryMetadata(
            project_id=demo_project.id,
            name="demo-ecommerce-api",
            repo_url="https://github.com/aura-swarm/demo-ecommerce-api.git",
            default_branch="main",
            language="Python",
            ast_nodes_count=84200,
            cyclomatic_complexity=3.4,
            security_score=98.5,
            open_cves_count=0,
            is_active=True,
            last_scanned_at=datetime.utcnow(),
        )
        db.add(repo_meta)
        db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
        print("Database schema created and initial records seeded successfully.")
    finally:
        db.close()
