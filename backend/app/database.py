from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD


# ===============================
# DATABASE URL
# ===============================
DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT or 5432}/{DB_NAME}"
)

# ===============================
# ENGINE CONFIGURATION
# ===============================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,     # auto reconnect if connection drops
    pool_size=5,            # number of persistent connections
    max_overflow=10,        # extra connections if needed
    echo=False              # NEVER True in production
)


# ===============================
# SESSION
# ===============================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ===============================
# BASE MODEL
# ===============================
Base = declarative_base()


# ===============================
# DEPENDENCY
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()