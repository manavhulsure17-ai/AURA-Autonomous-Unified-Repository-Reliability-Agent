"""Database engine and session management."""

try:
    from database import Base, engine, SessionLocal, get_db, create_tables
except ImportError:
    from backend.database import Base, engine, SessionLocal, get_db, create_tables

__all__ = ["Base", "engine", "SessionLocal", "get_db", "create_tables"]

