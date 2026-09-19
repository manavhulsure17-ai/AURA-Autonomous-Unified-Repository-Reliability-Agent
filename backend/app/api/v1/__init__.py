from fastapi import APIRouter
from .projects import router as projects_router
from .repositories import router as repositories_router

api_v1_router = APIRouter()
api_v1_router.include_router(projects_router)
api_v1_router.include_router(repositories_router)

__all__ = ["api_v1_router"]
