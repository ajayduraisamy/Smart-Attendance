from sqlalchemy import Column, Integer, Date, String, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime

from app.database import Base


class Leave(Base):

    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(Integer, ForeignKey("employees.id"))

    start_date = Column(Date)
    end_date = Column(Date)

    reason = Column(String(255))

    status = Column(String(20), default="PENDING")
    # PENDING / APPROVED / REJECTED

    created_at = Column(DateTime(timezone=True), server_default=func.now())
