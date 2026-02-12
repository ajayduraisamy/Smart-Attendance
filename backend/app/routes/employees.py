from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeOut
)

from app.core.auth import require_role


router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# Create Employee (Admin / HR)
@router.post("/", response_model=EmployeeOut)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    existing = db.query(Employee).filter(
        Employee.emp_id == data.emp_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists"
        )

    emp = Employee(**data.dict())

    db.add(emp)
    db.commit()
    db.refresh(emp)

    return emp


# Update Employee
@router.put("/{emp_id}", response_model=EmployeeOut)
def update_employee(
    emp_id: str,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    emp = db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()

    if not emp:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    for key, value in data.dict(exclude_unset=True).items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)

    return emp


# Deactivate Employee
@router.delete("/{emp_id}")
def deactivate_employee(
    emp_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    emp = db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()

    if not emp:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    emp.status = False

    db.commit()

    return {"message": "Employee deactivated successfully"}


# List Employees (Admin / HR)
@router.get("/", response_model=list[EmployeeOut])
def list_employees(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    return db.query(Employee).all()
