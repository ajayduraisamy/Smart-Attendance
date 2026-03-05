from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime

from app.database import Base


class Leave(Base):

    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False,
        index=True
    )

    start_date = Column(Date, nullable=False)

    end_date = Column(Date, nullable=False)

    leave_type = Column(String(50), default="CASUAL")
    # CASUAL / SICK / PAID / UNPAID

    reason = Column(String(255), nullable=True)

    status = Column(String(20), default="PENDING")
    # PENDING / APPROVED / REJECTED

    approved_by = Column(Integer, nullable=True)
    # Admin / HR user ID

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationship
    employee = relationship("Employee", backref="leaves")