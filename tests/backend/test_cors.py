"""Unit tests verifying FastAPI CORSMiddleware configuration in backend/main.py.

Verifies:
- Preflight OPTIONS requests from local development origins (http://localhost:3000, http://localhost:5173, http://127.0.0.1:3000)
- Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, and Access-Control-Allow-Headers headers
- CORS headers on standard API endpoints (GET /projects, POST /projects, GET /health)
- Rejection/omission of CORS headers for untrusted external origins
- Support for localhost ports via regex
"""

import pytest
from fastapi.testclient import TestClient
from main import app


def test_cors_preflight_options_localhost_3000(client):
    """Verify CORS preflight OPTIONS request from localhost:3000 succeeds with expected headers."""
    response = client.options(
        "/api/v1/projects",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type,Authorization",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"
    allow_methods = response.headers.get("access-control-allow-methods", "")
    assert "POST" in allow_methods
    assert "GET" in allow_methods
    assert "DELETE" in allow_methods
    allow_headers = response.headers.get("access-control-allow-headers", "")
    assert "content-type" in allow_headers.lower() or "*" in allow_headers


def test_cors_preflight_options_vite_port_5173(client):
    """Verify CORS preflight OPTIONS request from default Vite dev server (port 5173)."""
    response = client.options(
        "/api/v1/repositories",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_preflight_options_127_0_0_1(client):
    """Verify CORS preflight OPTIONS request from loopback 127.0.0.1:3000."""
    response = client.options(
        "/health",
        headers={
            "Origin": "http://127.0.0.1:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://127.0.0.1:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_actual_get_request_localhost(client):
    """Verify GET requests from localhost include Access-Control-Allow-Origin."""
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_actual_post_request_localhost(client):
    """Verify POST request includes CORS response headers for local frontend."""
    payload = {
        "slug": "cors-test-proj",
        "name": "CORS Test Project",
        "tier": "tier-2-standard",
    }
    response = client.post(
        "/projects",
        json=payload,
        headers={"Origin": "http://localhost:3000"},
    )
    assert response.status_code == 201
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_untrusted_origin_omits_access_control(client):
    """Verify untrusted external origins do not receive CORS authorization headers."""
    response = client.get(
        "/health",
        headers={"Origin": "https://malicious-external-origin.com"},
    )
    assert response.status_code == 200
    # Starlette CORSMiddleware does NOT add access-control-allow-origin for disallowed origins
    assert response.headers.get("access-control-allow-origin") is None
