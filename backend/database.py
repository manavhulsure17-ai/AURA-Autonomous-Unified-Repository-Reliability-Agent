"""SQLite database engine, declarative Base, and session management for AURA."""

import os
import sys
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Ensure backend dir is on path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from app.core.config import settings
    DATABASE_URL = settings.DATABASE_URL
    DEBUG = settings.DEBUG
except Exception:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aura.db")
    DEBUG = os.getenv("DEBUG", "true").lower() in ("true", "1", "t")

# SQLite connection args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=DEBUG,
    future=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for obtaining an isolated SQLite session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    """Create all tables defined on Base metadata."""
    Base.metadata.create_all(bind=engine)
