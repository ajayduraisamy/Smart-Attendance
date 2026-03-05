from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)

    device_id = Column(String(50), unique=True, nullable=False, index=True)

    api_key = Column(String(255), nullable=False)

    office_id = Column(
        Integer,
        ForeignKey("offices.id"),
        nullable=False,
        index=True
    )

    status = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    last_seen = Column(DateTime(timezone=True), nullable=True)
    
    office = relationship("Office", back_populates="devices")
    #office = relationship("Office", backref="devices")