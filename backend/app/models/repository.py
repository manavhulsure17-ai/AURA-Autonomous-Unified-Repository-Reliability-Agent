"""SQLAlchemy models for Repository Metadata."""

try:
    from models import RepositoryMetadata
except ImportError:
    from backend.models import RepositoryMetadata

__all__ = ["RepositoryMetadata"]

