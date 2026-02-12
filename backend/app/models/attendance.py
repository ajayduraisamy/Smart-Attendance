from sqlalchemy import Column, Integer, String, Date, Time, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(String(50), nullable=False)

    emp_name = Column(String(100), nullable=False)

    device_id = Column(String(50), nullable=False)

    office_id = Column(Integer, nullable=True)

    date = Column(Date, nullable=False)

    in_time = Column(Time, nullable=True)

    out_time = Column(Time, nullable=True)

    type = Column(String(10), nullable=False)  # IN / OUT

    source = Column(String(10), default="ONLINE")  # ONLINE / OFFLINE

    created_at = Column(DateTime(timezone=True), server_default=func.now())
