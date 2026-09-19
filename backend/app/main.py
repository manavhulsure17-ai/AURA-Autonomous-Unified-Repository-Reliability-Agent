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

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
