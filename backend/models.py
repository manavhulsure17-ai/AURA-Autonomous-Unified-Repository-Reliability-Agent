"""SQLAlchemy base models for Project and RepositoryMetadata."""

import os
import sys
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

# Ensure backend directory is resolved in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from database import Base
except ImportError:
    from backend.database import Base


class Project(Base):
    """SQLAlchemy model representing a software project monitored by AURA agents."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=True)
    tier = Column(String(50), default="tier-1-mission-critical", nullable=False)
    owner_team = Column(String(100), default="Core Platform Swarm", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to repositories
    repositories = relationship(
        "RepositoryMetadata",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, slug='{self.slug}', name='{self.name}')>"


class RepositoryMetadata(Base):
    """SQLAlchemy model representing repository metrics, AST counts, and security posture."""
    __tablename__ = "repository_metadata"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(200), index=True, nullable=False)
    repo_url = Column(String(500), nullable=False)
    default_branch = Column(String(100), default="main", nullable=False)
    language = Column(String(50), default="Python", nullable=False)
    ast_nodes_count = Column(Integer, default=0, nullable=False)
    cyclomatic_complexity = Column(Float, default=0.0, nullable=False)
    security_score = Column(Float, default=100.0, nullable=False)
    open_cves_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_scanned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship back to parent project
    project = relationship(
        "Project",
        back_populates="repositories",
    )

    def __repr__(self) -> str:
        return (
            f"<RepositoryMetadata(id={self.id}, name='{self.name}', "
            f"lang='{self.language}', ast_nodes={self.ast_nodes_count})>"
        )
