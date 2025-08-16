"""
Configuration for Vigilant Sentinel backend
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    app_name: str = "Vigilant Sentinel"
    debug: bool = True
    log_level: str = "INFO"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1
    
    # CORS
    cors_origins: List[str] = Field(default=["http://localhost:5173", "http://localhost:3000"])
    
    # AWS Configuration - Read from environment variables
    aws_default_region: str = Field(default="eu-west-1", env="AWS_DEFAULT_REGION")
    aws_profile: str = Field(default="default", env="AWS_PROFILE")
    bedrock_model_id: str = Field(default="anthropic.claude-3-haiku-20240307-v1:0", env="BEDROCK_MODEL_ID")
    bedrock_region: str = Field(default="eu-west-1", env="BEDROCK_REGION")
    
    # Security
    secret_key: str = "development-secret-key-change-in-production"
    jwt_secret: str = "development-jwt-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    
    # Redis (optional)
    redis_url: str = ""
    
    # Database (optional)
    database_url: str = ""
    
    # External APIs (optional)
    external_fraud_api_url: str = ""
    external_fraud_api_key: str = ""
    
    # Rate limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    # Monitoring
    enable_metrics: bool = False
    metrics_port: int = 9090
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


# Logging configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "formatter": "detailed",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
        },
    },
    "root": {
        "level": settings.log_level,
        "handlers": ["default"],  # Only console logging for development
    },
}
