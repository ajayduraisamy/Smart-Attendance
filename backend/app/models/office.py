from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Office(Base):
    __tablename__ = "offices"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), unique=True, nullable=False, index=True)

    location = Column(String(200), nullable=True)

    status = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships (IMPORTANT for future linking)
    devices = relationship("Device", back_populates="office")
    
    employees = relationship("Employee", back_populates="office")