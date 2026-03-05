from pydantic import BaseModel, ConfigDict
from datetime import date, datetime


class LeaveCreate(BaseModel):

    employee_id: int
    start_date: date
    end_date: date
    reason: str
    leave_type: str = "CASUAL"


class LeaveUpdateStatus(BaseModel):

    status: str   # APPROVED / REJECTED


class LeaveOut(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_id: int
    start_date: date
    end_date: date
    leave_type: str
    reason: str | None
    status: str
    created_at: datetime