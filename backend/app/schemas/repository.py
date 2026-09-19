"""Pydantic schemas for Repository Metadata."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class RepositoryBase(BaseModel):
    name: str = Field(..., description="Repository name, e.g. demo-ecommerce-api")
    repo_url: str = Field(..., description="Source code URL or local git reference")
    default_branch: str = Field(default="main", description="Target default branch")
    language: str = Field(default="Python", description="Primary code language")
    ast_nodes_count: int = Field(default=0, ge=0, description="Total indexed Tree-sitter AST nodes")
    cyclomatic_complexity: float = Field(default=0.0, ge=0.0, description="Average cyclomatic complexity")
    security_score: float = Field(default=100.0, ge=0.0, le=100.0, description="Security health score (0-100)")
    open_cves_count: int = Field(default=0, ge=0, description="Open vulnerability count")
    is_active: bool = Field(default=True, description="Active status in swarm monitoring")


class RepositoryCreate(RepositoryBase):
    project_id: int = Field(..., description="Parent project identifier")


class RepositoryUpdate(BaseModel):
    name: Optional[str] = None
    repo_url: Optional[str] = None
    default_branch: Optional[str] = None
    language: Optional[str] = None
    ast_nodes_count: Optional[int] = None
    cyclomatic_complexity: Optional[float] = None
    security_score: Optional[float] = None
    open_cves_count: Optional[int] = None
    is_active: Optional[bool] = None
    last_scanned_at: Optional[datetime] = None


class RepositoryResponse(RepositoryBase):
    id: int
    project_id: int
    last_scanned_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
