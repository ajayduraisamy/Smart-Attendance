from datetime import date, time
from pydantic import BaseModel


class AttendanceMark(BaseModel):

    emp_id: str
    emp_name: str
    device_id: str
    office_id: int | None = None
    source: str = "ONLINE"   # ONLINE / OFFLINE


class AttendanceOut(BaseModel):

    id: int
    emp_id: str
    emp_name: str
    device_id: str
    office_id: int | None
    date: date
    in_time: time | None
    out_time: time | None
    type: str
    source: str

    class Config:
        orm_mode = True
