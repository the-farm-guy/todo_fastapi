from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = 'sqlite:///./items.db'
Base = declarative_base()

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL set in environment")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} 
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()