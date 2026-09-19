"""Base FastAPI entry point for AURA Multi-Agent Platform.

Integrates SQLite session management from backend/database.py and SQLAlchemy
models for Project and RepositoryMetadata from backend/models.py.
Provides root, health check, and initial routes for project listing and repository
metadata registration.
"""

import sys
import os
from contextlib import asynccontextmanager
from typing import List, Optional

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import SQLite session management from database.py
try:
    from database import Base, engine, get_db, SessionLocal, create_tables
except ImportError:
    from backend.database import Base, engine, get_db, SessionLocal, create_tables

# Import SQLAlchemy base models from models.py
try:
    from models import Project, RepositoryMetadata
except ImportError:
    from backend.models import Project, RepositoryMetadata

# Import app configuration, schemas, and router
from app.core.config import settings
from app.db.init_db import init_db
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.repository import RepositoryCreate, RepositoryResponse
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context: guarantees SQLite schemas are created and seeded on startup."""
    create_tables()
    with SessionLocal() as db:
        init_db(db)
    yield


# Initialize FastAPI application entry point
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AURA Multi-Agent Platform - Project & Repository Metadata Service",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS middleware for local development and secure frontend communication
default_local_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

# Merge any custom configured origins from settings or environment
allowed_origins = list(default_local_origins)
if hasattr(settings, "CORS_ORIGINS") and settings.CORS_ORIGINS:
    for origin in settings.CORS_ORIGINS:
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Include API v1 routes
app.include_router(api_router)


# ==========================================
# Root & Health Check Endpoints
# ==========================================

@app.get("/", tags=["system"], summary="Root platform metadata")
def read_root():
    """Root endpoint defining platform status and core route discovery."""
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "endpoints": {
            "root": "/",
            "health": "/health",
            "list_projects": "/projects",
            "register_repository": "/repositories",
            "api_v1": settings.API_V1_STR,
        },
    }


@app.get("/health", tags=["system"], summary="Service health check")
def health_check(db: Session = Depends(get_db)):
    """Health check validating SQLite session and database query execution."""
    db_healthy = False
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception as exc:
        db_healthy = False
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": str(exc),
        }

    return {
        "status": "healthy" if db_healthy else "degraded",
        "database": "connected" if db_healthy else "disconnected",
        "engine": "sqlite",
    }


# ==========================================
# Project Routes (using models.Project)
# ==========================================

@app.get(
    "/projects",
    response_model=List[ProjectResponse],
    tags=["projects"],
    summary="List all projects",
)
def list_projects(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Max projects to return"),
    db: Session = Depends(get_db),
):
    """List all projects using the Project model and SQLite session."""
    return db.query(Project).offset(skip).limit(limit).all()


@app.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["projects"],
    summary="Create a new project",
)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
):
    """Create and persist a new Project entity."""
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with slug '{project_in.slug}' already exists",
        )

    project = Project(
        slug=project_in.slug,
        name=project_in.name,
        description=project_in.description,
        tier=project_in.tier,
        owner_team=project_in.owner_team,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# ==========================================
# Repository Metadata Routes (using models.RepositoryMetadata)
# ==========================================

@app.post(
    "/repositories",
    response_model=RepositoryResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["repositories"],
    summary="Register repository metadata",
)
def register_repository_metadata(
    repo_in: RepositoryCreate,
    db: Session = Depends(get_db),
):
    """Register repository metadata associated with a parent Project."""
    parent_project = db.query(Project).filter(Project.id == repo_in.project_id).first()
    if not parent_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent project with ID {repo_in.project_id} does not exist",
        )

    repository = RepositoryMetadata(
        project_id=repo_in.project_id,
        name=repo_in.name,
        repo_url=repo_in.repo_url,
        default_branch=repo_in.default_branch,
        language=repo_in.language,
        ast_nodes_count=repo_in.ast_nodes_count,
        cyclomatic_complexity=repo_in.cyclomatic_complexity,
        security_score=repo_in.security_score,
        open_cves_count=repo_in.open_cves_count,
        is_active=repo_in.is_active,
    )

    db.add(repository)
    db.commit()
    db.refresh(repository)
    return repository


@app.get(
    "/repositories",
    response_model=List[RepositoryResponse],
    tags=["repositories"],
    summary="List repository metadata",
)
def list_repositories(
    project_id: Optional[int] = Query(None, description="Filter by parent project ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List repository metadata records using RepositoryMetadata model."""
    query = db.query(RepositoryMetadata)
    if project_id is not None:
        query = query.filter(RepositoryMetadata.project_id == project_id)
    return query.offset(skip).limit(limit).all()


if __name__ == "__main__":
    import uvicorn
    host = settings.HOST
    port = settings.PORT
    print(f"Starting AURA FastAPI entry point on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
