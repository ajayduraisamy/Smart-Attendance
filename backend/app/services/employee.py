from sqlalchemy.orm import Session
from app.models.employee import Employee


def get_employee_by_id(emp_id: str, db: Session) -> Employee:
    """Get employee by employee ID"""
    return db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()


def get_all_active_employees(db: Session) -> list:
    """Get all active employees"""
    return db.query(Employee).filter(
        Employee.status == True
    ).all()


def update_employee_biometric(
    emp_id: str,
    biometric_type: str,
    data: str,
    db: Session
) -> bool:
    """Update employee biometric data (RFID, Fingerprint, Face)"""
    
    emp = get_employee_by_id(emp_id, db)
    
    if not emp:
        return False
    
    if biometric_type == "rfid":
        emp.rfid_uid = data
    elif biometric_type == "fingerprint":
        emp.fingerprint_template = data
    elif biometric_type == "face":
        emp.face_embedding = data
    else:
        return False
    
    db.commit()
    return True
