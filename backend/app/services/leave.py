from sqlalchemy.orm import Session
from app.models.leave import Leave
from app.models.employee import Employee
from datetime import date


def apply_leave(data, db: Session):

    employee = db.query(Employee).filter(
        Employee.id == data.employee_id,
        Employee.status == True
    ).first()

    if not employee:
        return None

    leave = Leave(
        employee_id=data.employee_id,
        start_date=data.start_date,
        end_date=data.end_date,
        reason=data.reason,
        leave_type=data.leave_type
    )

    db.add(leave)
    db.commit()
    db.refresh(leave)

    return leave


def get_employee_leaves(employee_id: int, db: Session):

    return db.query(Leave).filter(
        Leave.employee_id == employee_id
    ).all()


def update_leave_status(leave_id: int, status: str, db: Session):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        return None

    leave.status = status

    db.commit()
    db.refresh(leave)

    return leave


def get_leaves_by_date(check_date: date, db: Session):

    return db.query(Leave).filter(
        Leave.start_date <= check_date,
        Leave.end_date >= check_date,
        Leave.status == "APPROVED"
    ).all()