"""SQLAlchemy models for Projects."""

try:
    from models import Project
except ImportError:
    from backend.models import Project

__all__ = ["Project"]

