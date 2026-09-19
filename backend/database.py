"""SQLAlchemy database engine, SessionLocal factory, and dependency injection function (get_db).

Configures SQLite session management, engine lifecycle, declarative Base,
and the FastAPI `get_db` dependency for database sessions.
"""

import os
import sys
from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Ensure backend directory is in sys.path for direct or package execution
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Retrieve database connection settings
try:
    from app.core.config import settings
    DATABASE_URL = settings.DATABASE_URL
    DEBUG = getattr(settings, "DEBUG", False)
except Exception:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aura.db")
    DEBUG = os.getenv("DEBUG", "false").lower() in ("true", "1", "t")

# SQLite connection arguments (disable same-thread check for multi-threaded FastAPI workers)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Initialize SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=DEBUG,
    future=True,
)

# Enforce SQLite foreign key constraints
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# Initialize SessionLocal factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

# Declarative Base for models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency injection function that provides an isolated SQLAlchemy session.
    
    Yields:
        Session: Active database session scoped to the current request context.
    Ensures:
        Session is closed cleanly when request processing completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    """Helper function to create all registered tables on Base metadata."""
    Base.metadata.create_all(bind=engine)


__all__ = [
    "engine",
    "SessionLocal",
    "Base",
    "get_db",
    "create_tables",
    "DATABASE_URL",
]
