from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.schemas.biometric import (
    RFIDEnroll,
    FingerEnroll,
    FaceEnroll
)

from app.core.auth import require_role


router = APIRouter(
    prefix="/biometrics",
    tags=["Biometrics"]
)


# =====================================================
# Enroll RFID
# =====================================================
@router.post("/rfid")
def enroll_rfid(
    data: RFIDEnroll,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin", "hr"))
):

    emp = db.query(Employee).filter(
        Employee.emp_id == data.emp_id,
        Employee.status == True
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Prevent duplicate RFID assignment
    existing = db.query(Employee).filter(
        Employee.rfid_uid == data.rfid_uid
    ).first()

    if existing and existing.id != emp.id:
        raise HTTPException(
            status_code=400,
            detail="RFID already assigned to another employee"
        )

    emp.rfid_uid = data.rfid_uid

    db.commit()

    return {"message": "RFID enrolled successfully"}


# =====================================================
# Enroll Fingerprint
# =====================================================
@router.post("/fingerprint")
def enroll_fingerprint(
    data: FingerEnroll,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin", "hr"))
):

    emp = db.query(Employee).filter(
        Employee.emp_id == data.emp_id,
        Employee.status == True
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    emp.fingerprint_template = data.fingerprint_template

    db.commit()

    return {"message": "Fingerprint enrolled successfully"}


# =====================================================
# Enroll Face
# =====================================================
@router.post("/face")
def enroll_face(
    data: FaceEnroll,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin", "hr"))
):

    emp = db.query(Employee).filter(
        Employee.emp_id == data.emp_id,
        Employee.status == True
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    emp.face_embedding = data.face_embedding

    db.commit()

    return {"message": "Face enrolled successfully"}