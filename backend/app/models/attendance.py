from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Date,
    Time,
    DateTime,
    String
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False,
        index=True
    )

    device_id = Column(
        Integer,
        ForeignKey("devices.id"),
        nullable=False,
        index=True
    )

    office_id = Column(
        Integer,
        ForeignKey("offices.id"),
        nullable=False,
        index=True
    )

    date = Column(Date, nullable=False)

    check_in = Column(Time, nullable=True)

    check_out = Column(Time, nullable=True)

    source = Column(String(10), default="ONLINE")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")

    device = relationship("Device")

    office = relationship("Office")