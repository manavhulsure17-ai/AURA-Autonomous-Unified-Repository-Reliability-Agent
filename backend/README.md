# AURA Backend Service (FastAPI + SQLAlchemy + Pydantic)

The AURA Backend provides RESTful APIs for managing monitored projects, code repository metadata, Tree-sitter AST nodes, and autonomous agent orchestration state.

---

## 1. Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI app initialization, middleware, lifecycle
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Pydantic BaseSettings and environment config
│   ├── db/
│   │   ├── __init__.py
│   │   ├── database.py        # SQLAlchemy engine, SessionLocal, get_db dependency
│   │   └── init_db.py         # Table creation & initial seeding logic
│   ├── models/
│   │   ├── __init__.py
│   │   ├── project.py         # Project SQLAlchemy ORM model
│   │   └── repository.py      # RepositoryMetadata SQLAlchemy ORM model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── project.py         # ProjectBase, ProjectCreate, ProjectResponse
│   │   └── repository.py      # RepositoryBase, RepositoryCreate, RepositoryResponse
│   └── api/
│       ├── __init__.py
│       ├── router.py          # Master APIRouter prefixing /api/v1
│       └── v1/
│           ├── __init__.py
│           ├── projects.py    # CRUD endpoints for Projects
│           └── repositories.py # CRUD endpoints for Repositories
├── tests/
│   ├── __init__.py
│   ├── conftest.py            # Pytest fixtures and in-memory SQLite TestClient
│   ├── test_projects.py       # Comprehensive project tests
│   └── test_repositories.py   # Comprehensive repository metadata tests
├── run.py                     # CLI Runner script
├── requirements.txt           # Python dependencies
├── .env.example               # Example environment variables
└── README.md                  # Documentation
```

---

## 2. Models and Data Schema

### Projects (`projects` table)
- `id` (Integer, Primary Key)
- `slug` (String, Unique, Index)
- `name` (String, Index)
- `description` (Text, Nullable)
- `tier` (String, e.g. `tier-1-mission-critical`)
- `owner_team` (String, e.g. `Core Platform Swarm`)
- `created_at` (DateTime, UTC)
- `updated_at` (DateTime, UTC)
- Relationship: `repositories` (One-to-many with `RepositoryMetadata`, cascading delete)

### Repository Metadata (`repository_metadata` table)
- `id` (Integer, Primary Key)
- `project_id` (Integer, Foreign Key `projects.id`)
- `name` (String, Index)
- `repo_url` (String)
- `default_branch` (String, default `main`)
- `language` (String, e.g. `Python`, `TypeScript`)
- `ast_nodes_count` (Integer, total indexed Tree-sitter AST nodes)
- `cyclomatic_complexity` (Float)
- `security_score` (Float, 0-100)
- `open_cves_count` (Integer)
- `is_active` (Boolean)
- `last_scanned_at` (DateTime, Nullable)
- `created_at` (DateTime, UTC)
- `updated_at` (DateTime, UTC)

---

## 3. Running Locally

### Step 1: Install Dependencies
```bash
python3 -m pip install -r backend/requirements.txt
```

### Step 2: Initialize Database
```bash
python3 backend/run.py --init-db
```
This generates the SQLite database `aura.db` with sample project metadata.

### Step 3: Start FastAPI Server
```bash
python3 backend/run.py
```
Or directly with Uvicorn:
```bash
uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

### Step 4: Run Tests
```bash
pytest backend/tests -v
```
Or via the runner:
```bash
python3 backend/run.py --test
```

---

## 4. API Endpoints

- `GET /`: Service metadata and links.
- `GET /health`: Database connectivity health check.
- `GET /docs`: Interactive Swagger UI.
- `GET /redoc`: ReDoc API documentation.
- `GET /api/v1/projects`: List all projects.
- `POST /api/v1/projects`: Register a new project.
- `GET /api/v1/projects/{id}`: Fetch project details by ID.
- `GET /api/v1/projects/by-slug/{slug}`: Fetch project by unique slug.
- `PUT /api/v1/projects/{id}`: Update project metadata.
- `DELETE /api/v1/projects/{id}`: Delete project and cascade-remove repositories.
- `GET /api/v1/repositories`: List repository metadata (filter by `?project_id=`).
- `POST /api/v1/repositories`: Register new repository under a project.
- `GET /api/v1/repositories/{id}`: Fetch repository metadata.
- `PUT /api/v1/repositories/{id}`: Update repository metadata.
- `DELETE /api/v1/repositories/{id}`: Delete repository metadata.
- `POST /api/v1/repositories/{id}/scan`: Trigger Tree-sitter AST scan refresh.
