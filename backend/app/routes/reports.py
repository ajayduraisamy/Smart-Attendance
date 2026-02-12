from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.core.auth import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# -----------------------------
# Daily Summary
# -----------------------------
@router.get("/daily-summary")
def daily_summary(
    report_date: date,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    total = db.query(Employee).filter(
        Employee.status == True
    ).count()

    present = db.query(Attendance).filter(
        Attendance.date == report_date,
        Attendance.type == "IN"
    ).count()

    absent = total - present

    return {
        "date": report_date,
        "total_employees": total,
        "present": present,
        "absent": absent
    }


# -----------------------------
# Absent Employees
# -----------------------------
@router.get("/absent-list")
def absent_list(
    report_date: date,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    present_ids = db.query(
        Attendance.emp_id
    ).filter(
        Attendance.date == report_date,
        Attendance.type == "IN"
    ).subquery()

    absent = db.query(Employee).filter(
        Employee.status == True,
        Employee.id.notin_(present_ids)
    ).all()

    return absent


# -----------------------------
# Monthly Report
# -----------------------------
@router.get("/monthly")
def monthly_report(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    data = db.query(Attendance).filter(
        Attendance.date.between(
            f"{year}-{month:02d}-01",
            f"{year}-{month:02d}-31"
        )
    ).all()

    return data
