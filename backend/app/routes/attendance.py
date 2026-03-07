from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.attendance import AttendanceMark, AttendanceOut
from app.services.attendance import mark_attendance
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.models.device import Device

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)
from datetime import date, datetime
import pytz 

IST = pytz.timezone('Asia/Kolkata')

# Mark Attendance (Device API)
@router.post("/mark", response_model=AttendanceOut)
def mark_attendance_api(
    data: AttendanceMark,
    db: Session = Depends(get_db)
):

    record = mark_attendance(
        emp_id=data.emp_id,
        device_id=data.device_id,
        source=data.source,
        db=db
    )

    if not record:
        raise HTTPException(400, "Invalid employee or device")

    return record




# Get Attendance By Date
@router.get("/by-date/{day}") 
def attendance_by_date(
    day: date,
    db: Session = Depends(get_db)
):

    results = db.query(Attendance, Employee).join(
        Employee, Attendance.employee_id == Employee.id
    ).filter(
        Attendance.date == day
    ).all()

  
    return [
        {
            "id": att.id,
            "emp_id": emp.emp_id,
            "name": emp.name,
            "date": att.date,
            "check_in": att.check_in,
            "check_out": att.check_out,
            "source": att.source
        } for att, emp in results
    ]


@router.get("/by-employee/{emp_id}")
def attendance_by_employee(
    emp_id: str,
    db: Session = Depends(get_db)
):
 
    results = db.query(Attendance, Employee).join(
        Employee, Attendance.employee_id == Employee.id
    ).filter(
        Employee.emp_id == emp_id 
    ).all()

    if not results:
        raise HTTPException(404, "No attendance records found for this employee")

  
    return [
        {
            "id": att.id,
            "emp_id": emp.emp_id,  
            "name": emp.name,     
            "date": att.date,
            "check_in": att.check_in,
            "check_out": att.check_out,
            "source": att.source
        } for att, emp in results
    ]

# Daily Attendance Summary
@router.get("/summary/{day}")
def attendance_summary(
    day: date,
    db: Session = Depends(get_db)
):

    total = db.query(Employee).filter(
        Employee.status == True
    ).count()

    present = db.query(Attendance).filter(
        Attendance.date == day
    ).count()

    absent = total - present

    return {
        "date": day,
        "total_employees": total,
        "present": present,
        "absent": absent
    }