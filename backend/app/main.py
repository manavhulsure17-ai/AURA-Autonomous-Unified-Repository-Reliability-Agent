"""FastAPI application entrypoint for AURA Backend."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.db.database import Base, engine, get_db
from app.db.init_db import init_db
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle context: ensures DB schemas are initialized on boot."""
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        init_db(db)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AURA Multi-Agent Catalog & Metadata Backend API (FastAPI + SQLAlchemy + Pydantic)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Cross-Origin Resource Sharing (CORS) for local frontend communication
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

# Mount API Routers
app.include_router(api_router)


@app.get("/", tags=["root"])
def read_root():
    """Root metadata endpoint."""
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "api_v1_endpoints": {
            "projects": f"{settings.API_V1_STR}/projects",
            "repositories": f"{settings.API_V1_STR}/repositories",
        },
    }


@app.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    """Health check validating database connectivity."""
    db_healthy = False
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception:
        db_healthy = False

    return {
        "status": "healthy" if db_healthy else "degraded",
        "database": "connected" if db_healthy else "disconnected",
    }
