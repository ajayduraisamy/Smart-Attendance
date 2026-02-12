import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceOut, DeviceVerify
from app.core.auth import require_role
from app.models.employee import Employee

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


# Admin creates device
@router.post("/", response_model=DeviceOut)
def create_device(
    data: DeviceCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    api_key = secrets.token_hex(32)

    device = Device(
        device_id=data.device_id,
        office_id=data.office_id,
        api_key=api_key
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device


# Device verifies itself
@router.post("/verify")
def verify_device(
    data: DeviceVerify,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.device_id == data.device_id,
        Device.api_key == data.api_key,
        Device.status == True
    ).first()

    if not device:
        raise HTTPException(401, "Invalid device credentials")

    return {"message": "Device verified"}




@router.get("/sync-data")
def sync_data(
    device_id: str,
    api_key: str,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.device_id == device_id,
        Device.api_key == api_key,
        Device.status == True
    ).first()

    if not device:
        raise HTTPException(401, "Invalid device")

    employees = db.query(Employee).filter(
        Employee.status == True
    ).all()

    result = []

    for emp in employees:
        result.append({
            "emp_id": emp.emp_id,
            "name": emp.name,
            "rfid_uid": emp.rfid_uid,
            "fingerprint_template": emp.fingerprint_template,
            "face_embedding": emp.face_embedding
        })

    return {"employees": result}
