from sqlalchemy.orm import Session
from app.models.employee import Employee


# Get employee by emp_id
def get_employee_by_emp_id(emp_id: str, db: Session) -> Employee | None:
    return db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()


# Get employee by database id
def get_employee_by_id(employee_id: int, db: Session) -> Employee | None:
    return db.query(Employee).filter(
        Employee.id == employee_id
    ).first()


# Get all active employees
def get_all_active_employees(db: Session):
    return db.query(Employee).filter(
        Employee.status == True
    ).all()


# Get employees by office (important for device sync)
def get_employees_by_office(office_id: int, db: Session):
    return db.query(Employee).filter(
        Employee.office_id == office_id,
        Employee.status == True
    ).all()


# Create employee
def create_employee(data, db: Session) -> Employee:
    employee = Employee(**data.dict())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


# Update employee
def update_employee(employee: Employee, update_data, db: Session):
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


# Deactivate employee
def deactivate_employee(employee: Employee, db: Session):
    employee.status = False
    db.commit()
    db.refresh(employee)
    return employee


# Update biometric data
def update_employee_biometric(
    emp_id: str,
    biometric_type: str,
    data,
    db: Session
) -> bool:

    emp = get_employee_by_emp_id(emp_id, db)

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