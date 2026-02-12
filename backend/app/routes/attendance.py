from datetime import datetime, date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.attendance import Attendance
from app.models.device import Device
from app.models.employee import Employee
from app.schemas.attendance import AttendanceMark, AttendanceOut
from pydantic import BaseModel 
from typing import List

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


# Mark Attendance (From Device)
@router.post("/mark", response_model=AttendanceOut)
def mark_attendance(
    data: AttendanceMark,
    db: Session = Depends(get_db)
):

    # Verify Device
    device = db.query(Device).filter(
        Device.device_id == data.device_id,
        Device.status == True
    ).first()

    if not device:
        raise HTTPException(401, "Invalid device")

    # Verify Employee
    emp = db.query(Employee).filter(
        Employee.emp_id == data.emp_id,
        Employee.status == True
    ).first()

    if not emp:
        raise HTTPException(404, "Employee not found")

    today = date.today()
    now = datetime.now().time()

    # Check existing attendance today
    last = db.query(Attendance).filter(
        Attendance.emp_id == data.emp_id,
        Attendance.date == today
    ).order_by(Attendance.id.desc()).first()

    # First Entry → IN
    if not last or last.type == "OUT":

        record = Attendance(
            emp_id=data.emp_id,
            emp_name=data.emp_name,
            device_id=data.device_id,
            office_id=data.office_id,
            date=today,
            in_time=now,
            type="IN",
            source=data.source
        )

    # Second Entry → OUT
    else:

        record = Attendance(
            emp_id=data.emp_id,
            emp_name=data.emp_name,
            device_id=data.device_id,
            office_id=data.office_id,
            date=today,
            out_time=now,
            type="OUT",
            source=data.source
        )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# Get Attendance By Date
@router.get("/by-date/{day}", response_model=list[AttendanceOut])
def attendance_by_date(
    day: date,
    db: Session = Depends(get_db)
):

    return db.query(Attendance).filter(
        Attendance.date == day
    ).all()


# Get Attendance By Employee
@router.get("/by-employee/{emp_id}", response_model=list[AttendanceOut])
def attendance_by_employee(
    emp_id: str,
    db: Session = Depends(get_db)
):

    return db.query(Attendance).filter(
        Attendance.emp_id == emp_id
    ).all()




class OfflineAttendance(BaseModel):
    emp_id: str
    emp_name: str
    device_id: str
    office_id: int | None
    date: str
    in_time: str | None
    out_time: str | None
    type: str
    source: str


@router.post("/offline-sync")
def offline_sync(
    records: List[OfflineAttendance],
    db: Session = Depends(get_db)
):

    for record in records:

        att = Attendance(
            emp_id=record.emp_id,
            emp_name=record.emp_name,
            device_id=record.device_id,
            office_id=record.office_id,
            date=record.date,
            in_time=record.in_time,
            out_time=record.out_time,
            type=record.type,
            source="OFFLINE"
        )

        db.add(att)

    db.commit()

    return {"message": "Offline records synced"}
