from datetime import datetime, date
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.models.device import Device


def mark_attendance(emp_id: str, device_id: int, source: str, db: Session):

    today = date.today()
    now = datetime.now().time()

    # Get employee
    employee = db.query(Employee).filter(
        Employee.emp_id == emp_id,
        Employee.status == True
    ).first()

    if not employee:
        return None

    # Get device
    device = db.query(Device).filter(
        Device.id == device_id,
        Device.status == True
    ).first()

    if not device:
        return None

    # Check today's attendance
    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.date == today
    ).first()

    # First scan → Check-in
    if not attendance:

        attendance = Attendance(
            employee_id=employee.id,
            device_id=device.id,
            office_id=device.office_id,
            date=today,
            check_in=now,
            source=source
        )

        db.add(attendance)

    # Second scan → Check-out
    else:

        attendance.check_out = now

    db.commit()
    db.refresh(attendance)

    return attendance


def get_daily_attendance(report_date: date, db: Session):

    total = db.query(Employee).filter(
        Employee.status == True
    ).count()

    present = db.query(Attendance).filter(
        Attendance.date == report_date
    ).count()

    absent = total - present

    return {
        "date": report_date,
        "total_employees": total,
        "present": present,
        "absent": absent,
        "absent_rate": round((absent / total * 100), 2) if total > 0 else 0
    }


def get_absent_employees(report_date: date, db: Session):

    present_ids = db.query(
        Attendance.employee_id
    ).filter(
        Attendance.date == report_date
    ).all()

    present_ids = [x[0] for x in present_ids]

    absent = db.query(Employee).filter(
        Employee.status == True,
        ~Employee.id.in_(present_ids)
    ).all()

    return absent