from datetime import datetime, date

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

#



router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/mark")
def mark_attendance(data: AttendanceMark, db: Session = Depends(get_db)):

    emp = db.query(Employee).filter(Employee.emp_id == data.emp_id).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    device = db.query(Device).filter(Device.id == data.device_id).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    today = date.today()
    now_time = datetime.now().time()

    record = db.query(Attendance).filter(
        Attendance.employee_id == emp.id,
        Attendance.date == today
    ).first()

    # FIRST SCAN → CHECK IN
    if not record:

        record = Attendance(
            employee_id=emp.id,
            device_id=device.id,
            office_id=emp.office_id,
            date=today,
            check_in=now_time,
            source=data.source
        )

        db.add(record)
        db.commit()

        return {
            "employee": emp.name,
            "status": "CHECK IN",
            "time": str(now_time)
        }

    # NEXT SCANS → UPDATE CHECK OUT
    else:

        record.check_out = now_time
        db.commit()

        return {
            "employee": emp.name,
            "status": "EXIT / UPDATE",
            "time": str(now_time)
        }



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