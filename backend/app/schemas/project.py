"""Pydantic schemas for Projects."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.repository import RepositoryResponse


class ProjectBase(BaseModel):
    slug: str = Field(..., description="Unique URL-friendly slug, e.g. aura-core-services")
    name: str = Field(..., description="Display name of the project")
    description: Optional[str] = Field(None, description="Detailed project description")
    tier: str = Field(default="tier-1-mission-critical", description="Operational SLA tier")
    owner_team: str = Field(default="Core Platform Swarm", description="Owning engineering team")


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    tier: Optional[str] = None
    owner_team: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    repositories: List[RepositoryResponse] = []

    model_config = ConfigDict(from_attributes=True)
