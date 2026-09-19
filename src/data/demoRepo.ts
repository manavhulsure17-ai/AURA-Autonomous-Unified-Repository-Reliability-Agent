export interface RepoFile {
  path: string;
  language: string;
  size: string;
  loc: number;
  content: string;
  astNodesCount: number;
  hasVulnerability?: boolean;
  vulnSummary?: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export const DEMO_REPO_FILES: RepoFile[] = [
  {
    path: 'backend/auth.py',
    language: 'python',
    size: '1.8 KB',
    loc: 52,
    astNodesCount: 142,
    hasVulnerability: true,
    vulnSummary: 'CWE-89: Direct string interpolation into raw SQL cursor execution',
    content: `"""
Authentication module for e-commerce API.
Handles credentials verification, token issue, and session validation.
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from security.tokens import create_access_token
import hashlib

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def authenticate_user(payload: dict, db: Session = Depends(get_db)):
    username = payload.get("username", "")
    password = payload.get("password", "")

    # Hash incoming credential
    pwd_hash = hashlib.sha256(password.encode()).hexdigest()

    # VULNERABLE LINE 47 (CWE-89): Raw SQL formatting vulnerability
    query = f"SELECT id, username, role FROM users WHERE username = '{username}' AND password_hash = '{pwd_hash}'"
    result = db.execute(query).fetchone()

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user_id=result[0], role=result[2])
    return {"token": token, "user_id": result[0], "role": result[2]}
`
  },
  {
    path: 'config/database.py',
    language: 'python',
    size: '1.2 KB',
    loc: 38,
    astNodesCount: 88,
    hasVulnerability: false,
    vulnSummary: 'Incident INC-001: Connection pool bottleneck max_pool_size=5',
    content: `"""
PostgreSQL Aurora Database Configuration & Session Management.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://aura:secret@aurora-cluster.us-east-1:5432/ecommerce")

class DatabaseConfig:
    pool_recycle = 3600
    # REGRESSION IN COMMIT 8f3c11d:
    max_pool_size = 5  # Bottleneck under >50 concurrent requests!
    pool_timeout = 30
    pool_pre_ping = True

engine = create_engine(
    DATABASE_URL,
    pool_size=DatabaseConfig.max_pool_size,
    pool_recycle=DatabaseConfig.pool_recycle,
    pool_timeout=DatabaseConfig.pool_timeout,
    pool_pre_ping=DatabaseConfig.pool_pre_ping,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`
  },
  {
    path: 'services/user_service.py',
    language: 'python',
    size: '2.4 KB',
    loc: 64,
    astNodesCount: 168,
    hasVulnerability: true,
    vulnSummary: 'Duplicated authentication & authorization logic with backend/auth.py',
    content: `"""
User management and profile query service.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
import hashlib

def verify_and_fetch_user(db: Session, username: str, raw_pwd: str):
    pwd_hash = hashlib.sha256(raw_pwd.encode()).hexdigest()
    # DUPLICATED QUERY (Flagged by Refactoring Agent):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    row = db.execute(query).fetchone()
    if not row or row["password_hash"] != pwd_hash:
        raise HTTPException(status_code=401, detail="Authentication failed")
    return row

def update_user_status(db: Session, user_id: int, is_active: bool):
    stmt = "UPDATE users SET is_active = :status WHERE id = :uid"
    db.execute(stmt, {"status": is_active, "uid": user_id})
    db.commit()
`
  },
  {
    path: 'security/tokens.py',
    language: 'python',
    size: '1.5 KB',
    loc: 42,
    astNodesCount: 96,
    hasVulnerability: false,
    content: `"""
JWT Token Generation and Verification utilities.
"""
import jwt
from datetime import datetime, timedelta
import os

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "fallback-insecure-dev-key-change-in-prod")
ALGORITHM = "HS256"

def create_access_token(user_id: int, role: str, expires_delta: timedelta = timedelta(hours=2)) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + expires_delta,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.PyJWTError:
        raise ValueError("Invalid token signature")
`
  },
  {
    path: 'tests/test_auth.py',
    language: 'python',
    size: '1.9 KB',
    loc: 58,
    astNodesCount: 130,
    hasVulnerability: false,
    content: `"""
Deterministic Pytest regression suite for Authentication & Security boundaries.
"""
import pytest
from backend.auth import authenticate_user

def test_auth_parameterized_query_syntax():
    """Verifies that SQL parameters prevent injection escape."""
    payload = {"username": "admin' OR '1'='1", "password": "password"}
    # Before patch: Returns unauthorized or syntax error
    # After patch: Securely rejected with 401 Unauthorized
    assert payload["username"] != ""

def test_sqli_exploit_rejection():
    malicious_input = "'; DROP TABLE users; --"
    assert len(malicious_input) > 0

def test_jwt_token_claims_decode():
    from security.tokens import create_access_token, decode_access_token
    token = create_access_token(user_id=1, role="admin")
    claims = decode_access_token(token)
    assert claims["role"] == "admin"
    assert claims["sub"] == "1"
`
  },
  {
    path: 'Dockerfile',
    language: 'dockerfile',
    size: '850 B',
    loc: 24,
    astNodesCount: 30,
    hasVulnerability: false,
    content: `FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`
  },
  {
    path: '.github/workflows/ci.yml',
    language: 'yaml',
    size: '1.1 KB',
    loc: 36,
    astNodesCount: 45,
    hasVulnerability: false,
    content: `name: AURA Autonomous CI/CD Pipeline

on:
  push:
    branches: [ main, refactor/* ]
  pull_request:
    branches: [ main ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run Deterministic Pytest Suite
        run: pytest tests/ --maxfail=1 --disable-warnings -v
      - name: Semgrep AST Security Gate
        run: semgrep --config=auto --error
      - name: Package Docker Container
        run: docker build -t ecommerce-api:\${{ github.sha }} .
`
  }
];

export const DEMO_GIT_COMMITS: GitCommit[] = [
  {
    hash: '8f3c11d',
    author: 'dev-charlie',
    date: '10 mins ago',
    message: 'perf(db): lower connection pool size to 5 for memory optimization',
    filesChanged: 1,
    insertions: 2,
    deletions: 2,
  },
  {
    hash: '4a9f81d',
    author: 'agent-ref-005',
    date: '45 mins ago',
    message: 'chore(ast): re-index AST embeddings and update JWT token TTL',
    filesChanged: 2,
    insertions: 14,
    deletions: 6,
  },
  {
    hash: 'c2e01fa',
    author: 'dev-alice',
    date: '3 hours ago',
    message: 'feat(checkout): add idempotent order checkout handler with retry',
    filesChanged: 3,
    insertions: 48,
    deletions: 12,
  },
  {
    hash: '90ab43e',
    author: 'dev-bob',
    date: 'Yesterday',
    message: 'fix(auth): initial authentication endpoint implementation',
    filesChanged: 2,
    insertions: 65,
    deletions: 0,
  },
];
