from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.models.device import Device


def mark_attendance(
    emp_id: str,
    emp_name: str,
    device_id: str,
    office_id: int,
    source: str,
    db: Session
) -> Attendance:
    """Mark attendance entry (IN/OUT) for an employee"""
    
    today = date.today()
    now = datetime.now().time()
    
    # Check last attendance record
    last = db.query(Attendance).filter(
        Attendance.emp_id == emp_id,
        Attendance.date == today
    ).order_by(Attendance.id.desc()).first()
    
    # First Entry → IN
    if not last or last.type == "OUT":
        attendance_type = "IN"
        in_time = now
        out_time = None
    else:
        attendance_type = "OUT"
        in_time = None
        out_time = now
    
    record = Attendance(
        emp_id=emp_id,
        emp_name=emp_name,
        device_id=device_id,
        office_id=office_id,
        date=today,
        in_time=in_time,
        out_time=out_time,
        type=attendance_type,
        source=source
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record


def get_daily_attendance(report_date: date, db: Session) -> dict:
    """Get daily attendance summary"""
    
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
        "absent": absent,
        "absent_rate": round((absent / total * 100), 2) if total > 0 else 0
    }


def get_absent_employees(report_date: date, db: Session) -> list:
    """Get list of absent employees for a specific date"""
    
    present_emp_ids = db.query(Attendance.emp_id).filter(
        Attendance.date == report_date,
        Attendance.type == "IN"
    ).distinct().all()
    
    present_ids = [emp[0] for emp in present_emp_ids]
    
    absent = db.query(Employee).filter(
        Employee.status == True,
        ~Employee.emp_id.in_(present_ids)
    ).all()
    
    return absent
