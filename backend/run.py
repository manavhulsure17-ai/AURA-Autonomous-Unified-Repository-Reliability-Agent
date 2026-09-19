#!/usr/bin/env python3
"""AURA Backend Runner script.

Usage:
  python3 run.py            # Starts the FastAPI development server on port 8000
  python3 run.py --init-db  # Creates SQLite tables and seeds initial project metadata
  python3 run.py --test     # Runs pytest on backend test suites
"""

import sys
import os

# Ensure backend root is on Python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def main():
    if "--test" in sys.argv:
        import pytest
        test_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests")
        sys.exit(pytest.main(["-v", test_dir]))

    from app.db.database import SessionLocal, Base, engine
    from app.db.init_db import init_db

    print("Initializing AURA SQLite database schema...")
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        init_db(db)
    print("Database initialization complete.")

    if "--init-db" in sys.argv:
        sys.exit(0)

    try:
        import uvicorn
        from app.core.config import settings

        host = settings.HOST
        port = settings.PORT

        print(f"Starting AURA FastAPI server at http://{host}:{port}")
        print(f"Interactive Swagger Documentation: http://{host}:{port}/docs")
        print(f"ReDoc Documentation: http://{host}:{port}/redoc")
        uvicorn.run("app.main:app", host=host, port=port, reload=settings.DEBUG)
    except ImportError:
        print("uvicorn is not installed. Install requirements via: pip install -r requirements.txt")
        sys.exit(1)


if __name__ == "__main__":
    main()
