"""Pytest configuration and fixtures for backend SQLite and FastAPI CRUD tests.

Located in tests/backend/conftest.py.
Configures:
- SQLite test engine with StaticPool (sharing single in-memory database across connections)
- PRAGMA foreign_keys=ON listener
- Clean schema creation per test function
- FastAPI TestClient fixture with get_db dependency override
- Direct db_session fixture for database state verification
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Ensure backend directory is in sys.path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from database import Base, get_db
from models import Project, RepositoryMetadata
from main import app

# Isolated in-memory SQLite database for testing with StaticPool
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Enforce foreign key constraints in SQLite
@event.listens_for(test_engine, "connect")
def _set_test_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
    future=True,
)


@pytest.fixture(scope="function", autouse=True)
def init_test_database():
    """Create fresh database schema in SQLite before each test and drop after."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    """Provide an isolated database session connected directly to the test SQLite database."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client():
    """Provide a FastAPI TestClient configured to use the test SQLite database."""
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="session")
def sqlite_engine():
    """Provide reference to the test SQLite engine for direct SQL schema inspections."""
    return test_engine
