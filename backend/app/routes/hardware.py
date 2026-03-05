from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee

router = APIRouter(
    prefix="/hardware",
    tags=["Hardware"]
)


@router.get("/employees-pending")
def get_pending_employees(db: Session = Depends(get_db)):

    employees = db.query(Employee).filter(
        Employee.status == True,
        Employee.rfid_uid == None,
        Employee.fingerprint_template == None,
        Employee.face_embedding == None
    ).all()

    return [
        {
            "emp_id": emp.emp_id,
            "name": emp.name
        }
        for emp in employees
    ]

@router.put("/assign-biometric")
def assign_biometric(data: dict, db: Session = Depends(get_db)):

    emp_id = data.get("emp_id")
    biometric_type = data.get("biometric_type")
    biometric_data = data.get("data")

    emp = db.query(Employee).filter(Employee.emp_id == emp_id).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # CHECK DUPLICATE RFID
    if biometric_type == "rfid":

        existing = db.query(Employee).filter(
            Employee.rfid_uid == biometric_data,
            Employee.emp_id != emp_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"RFID already assigned to employee {existing.emp_id}"
            )

        emp.rfid_uid = biometric_data


    elif biometric_type == "fingerprint":

        emp.fingerprint_template = biometric_data.encode()


    elif biometric_type == "face":

        emp.face_embedding = biometric_data.encode()

    else:
        raise HTTPException(status_code=400, detail="Invalid biometric type")

    db.commit()

    return {"message": "Biometric assigned successfully"}