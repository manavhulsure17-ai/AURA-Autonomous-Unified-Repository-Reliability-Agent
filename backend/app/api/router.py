"""Master API router."""

from fastapi import APIRouter
from app.core.config import settings
from app.api.v1 import api_v1_router

api_router = APIRouter(prefix=settings.API_V1_STR)
api_router.include_router(api_v1_router)

__all__ = ["api_router"]
