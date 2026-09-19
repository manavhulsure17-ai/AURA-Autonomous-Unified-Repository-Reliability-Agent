"""Application configuration settings."""

import os
from typing import List

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    try:
        from pydantic import BaseSettings
        SettingsConfigDict = dict  # type: ignore
    except ImportError:
        class BaseSettings:  # type: ignore
            def __init__(self, **kwargs):
                for k, v in kwargs.items():
                    setattr(self, k, v)
        SettingsConfigDict = dict  # type: ignore


class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "AURA Multi-Agent Platform API")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aura.db")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "t")
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

    model_config = SettingsConfigDict(case_sensitive=True, extra="allow")


settings = Settings()
