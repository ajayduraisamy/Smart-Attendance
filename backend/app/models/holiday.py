from sqlalchemy import Column, Integer, Date, String
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime

from app.database import Base


class Holiday(Base):

    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, unique=True)

    name = Column(String(100))

    description = Column(String(255))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
