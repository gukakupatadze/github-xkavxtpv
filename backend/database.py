"""
PostgreSQL Database Connection and Session Management
DataLab Georgia - Production Database Configuration
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# PostgreSQL connection settings
POSTGRES_URL = os.environ.get(
    'POSTGRES_URL', 
    'postgresql+asyncpg://datalab_user:datalab_pass123@localhost:5432/datalab_georgia'
)

# Validate connection string
if not POSTGRES_URL:
    raise ValueError("POSTGRES_URL environment variable is required")

# Create async engine
engine = create_async_engine(
    POSTGRES_URL,
    echo=False,  # Disable SQL logging in production
    future=True,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Create async session maker
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for ORM models
Base = declarative_base()

async def get_session():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logging.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()

async def init_db():
    """Initialize database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logging.info("Database tables initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize database: {e}")
        raise

async def close_db():
    """Close database connections"""
    try:
        await engine.dispose()
        logging.info("Database connections closed successfully")
    except Exception as e:
        logging.error(f"Error closing database connections: {e}")