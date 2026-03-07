from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.models.device import Device
router = APIRouter(
    prefix="/hardware",
    tags=["Hardware"]
)


@router.get("/employees-pending")
def get_pending_employees(db: Session = Depends(get_db)):

    employees = db.query(Employee).filter(
        Employee.status == True,
        Employee.rfid_uid == None,
        Employee.fingerprint_1 == None,
        Employee.face_embedding_1 == None
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

    # ---------------- RFID ----------------
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

    # ---------------- FINGERPRINT ----------------
    elif biometric_type == "fingerprint":

        data_bytes = biometric_data.encode()

        if emp.fingerprint_1 is None:
            emp.fingerprint_1 = data_bytes

        elif emp.fingerprint_2 is None:
            emp.fingerprint_2 = data_bytes

        elif emp.fingerprint_3 is None:
            emp.fingerprint_3 = data_bytes

        elif emp.fingerprint_4 is None:
            emp.fingerprint_4 = data_bytes

        elif emp.fingerprint_5 is None:
            emp.fingerprint_5 = data_bytes

        else:
            raise HTTPException(
                status_code=400,
                detail="Maximum fingerprint samples reached"
            )

    # ---------------- FACE ----------------
    elif biometric_type == "face":

        data_bytes = biometric_data.encode()

        if emp.face_embedding_1 is None:
            emp.face_embedding_1 = data_bytes

        elif emp.face_embedding_2 is None:
            emp.face_embedding_2 = data_bytes

        elif emp.face_embedding_3 is None:
            emp.face_embedding_3 = data_bytes

        elif emp.face_embedding_4 is None:
            emp.face_embedding_4 = data_bytes

        elif emp.face_embedding_5 is None:
            emp.face_embedding_5 = data_bytes

        else:
            raise HTTPException(
                status_code=400,
                detail="Maximum face samples reached"
            )

    else:
        raise HTTPException(status_code=400, detail="Invalid biometric type")

    db.commit()

    return {"message": "Biometric assigned successfully"}



@router.get("/employees-device")
def get_device_employees(
    device_id: str,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    employees = db.query(Employee).filter(
        Employee.status == True
    ).all()

    result = []

    for emp in employees:

        result.append({
            "emp_id": emp.emp_id,
            "name": emp.name,
            "rfid": emp.rfid_uid,

            "fingerprints": [
                emp.fingerprint_1,
                emp.fingerprint_2,
                emp.fingerprint_3,
                emp.fingerprint_4,
                emp.fingerprint_5
            ],

            "faces": [
                emp.face_embedding_1,
                emp.face_embedding_2,
                emp.face_embedding_3,
                emp.face_embedding_4,
                emp.face_embedding_5
            ]
        })

    return result


@router.post("/sync-attendance")
def sync_attendance(
    data: dict,
    db: Session = Depends(get_db)
):

    device_id = data.get("device_id")
    records = data.get("records")

    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    saved = 0

    from app.models.attendance import Attendance
    from datetime import datetime

    for item in records:

        emp = db.query(Employee).filter(
            Employee.emp_id == item["emp_id"]
        ).first()

        if not emp:
            continue

        attendance = Attendance(
            employee_id = emp.id,
            date = item["date"],
            check_in = item["check_in"],
            check_out = item.get("check_out"),
            source = item["source"],
            device_id = device.id
        )

        db.add(attendance)
        saved += 1

    db.commit()

    return {
        "message": "Attendance synced",
        "records_saved": saved
    }