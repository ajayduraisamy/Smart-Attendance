from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import date

from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.core.auth import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ==============================
# Daily Summary
# ==============================
@router.get("/daily-summary")
def daily_summary(
    report_date: date,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        # Total active employees
        total = db.query(Employee).filter(
            Employee.status == True
        ).count()

        # Employees who checked in
        present = db.query(Attendance.employee_id).filter(
            Attendance.date == report_date,
            Attendance.check_in != None
        ).distinct().count()

        absent = total - present

        return {
            "date": report_date,
            "total_employees": total,
            "present": present,
            "absent": absent
        }

    except Exception as e:
        print("DAILY SUMMARY ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to generate summary")


# ==============================
# Absent Employees List
# ==============================
@router.get("/absent-list")
def absent_list(
    report_date: date,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        # Employees who are present
        present_ids = db.query(
            Attendance.employee_id
        ).filter(
            Attendance.date == report_date,
            Attendance.check_in != None
        ).subquery()

        # Employees not in attendance
        absent = db.query(Employee).filter(
            Employee.status == True,
            ~Employee.id.in_(present_ids)
        ).all()

        return absent

    except Exception as e:
        print("ABSENT ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to get absent list")


# ==============================
# Monthly Report
# ==============================
@router.get("/monthly")
def monthly_report(year: int, month: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        # JOIN panni Employee details-aiyum sethu edukkurom
        results = db.query(Attendance, Employee).join(
            Employee, Attendance.employee_id == Employee.id
        ).filter(
            extract("year", Attendance.date) == year,
            extract("month", Attendance.date) == month
        ).all()

        # React-ku thevaiyana names (emp_name, in_time) correct-aa format panrom
        return [
            {
                "id": att.id,
                "emp_id": emp.emp_id,   # React looks for r.emp_id
                "emp_name": emp.name,   # React looks for r.emp_name
                "date": att.date,
                "type": "Regular",     
                "in_time": att.check_in,
                "out_time": att.check_out
            } for att, emp in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get monthly report")