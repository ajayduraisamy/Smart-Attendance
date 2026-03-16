from datetime import date, time
from pydantic import BaseModel, ConfigDict


# Device Attendance Request
class AttendanceMark(BaseModel):

    emp_id: str
    device_id: str     # ← change this
    source: str = "ONLINE"  # ONLINE / OFFLINE / FACE / RFID / FINGER


# Attendance Response
class AttendanceOut(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_id: int
    device_id: int
    office_id: int

    date: date
    check_in: time | None
    check_out: time | None

    source: str
    status: str