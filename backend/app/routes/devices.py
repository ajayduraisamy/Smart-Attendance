import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.device import Device
from app.models.employee import Employee
from app.models.office import Office
from app.schemas.device import DeviceCreate, DeviceOut, DeviceVerify
from app.core.auth import require_role

router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)

# =====================================================
# Admin: Create Device
# =====================================================
@router.post("/", response_model=DeviceOut)
def create_device(
    data: DeviceCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    existing = db.query(Device).filter(
        Device.device_id == data.device_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Device ID already exists")

    # Validate office if provided
    if data.office_id:
        office = db.query(Office).filter(
            Office.id == data.office_id,
            Office.status == True
        ).first()
        if not office:
            raise HTTPException(status_code=400, detail="Invalid office")

    api_key = secrets.token_hex(32)

    device = Device(
        device_id=data.device_id,
        office_id=data.office_id,
        api_key=api_key,
        status=True,
        created_at=datetime.utcnow()
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device


# =====================================================
# Admin: Get All Devices
# =====================================================
@router.get("/", response_model=list[DeviceOut])
def get_devices(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return db.query(Device).all()


# =====================================================
# Admin: Get Single Device
# =====================================================
@router.get("/{device_id}", response_model=DeviceOut)
def get_device(
    device_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    return device


# =====================================================
# Admin: Update Device Office
# =====================================================
@router.put("/{device_id}", response_model=DeviceOut)
def update_device(
    device_id: str,
    data: DeviceCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Validate office
    if data.office_id:
        office = db.query(Office).filter(
            Office.id == data.office_id,
            Office.status == True
        ).first()
        if not office:
            raise HTTPException(status_code=400, detail="Invalid office")

    device.office_id = data.office_id
    db.commit()
    db.refresh(device)

    return device


# =====================================================
# Admin: Enable / Disable Device (Soft Delete)
# =====================================================
@router.put("/{device_id}/status")
def update_device_status(
    device_id: str,
    status: bool = Query(...),
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    device.status = status
    db.commit()

    return {"message": "Device status updated"}


# =====================================================
# Admin: Deactivate Device (Soft Delete)
# =====================================================
@router.delete("/{device_id}")
def delete_device(
    device_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    device.status = False
    db.commit()

    return {"message": "Device deactivated successfully"}


# =====================================================
# Admin: Regenerate API Key
# =====================================================
@router.put("/{device_id}/regenerate-key")
def regenerate_api_key(
    device_id: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    device.api_key = secrets.token_hex(32)
    db.commit()
    db.refresh(device)

    return {"new_api_key": device.api_key}


# =====================================================
# Device: Verify Itself
# =====================================================
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
        raise HTTPException(status_code=401, detail="Invalid device credentials")

    device.last_seen = datetime.utcnow()
    db.commit()

    return {"message": "Device verified"}


# =====================================================
# Device: Sync Employees (Filtered by Office)
# =====================================================
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
        raise HTTPException(status_code=401, detail="Invalid device")

    device.last_seen = datetime.utcnow()
    db.commit()

    # Filter employees by same office
    employees = db.query(Employee).filter(
        Employee.status == True,
        Employee.office_id == device.office_id
    ).all()

    result = [
        {
            "emp_id": emp.emp_id,
            "name": emp.name,
            "rfid_uid": emp.rfid_uid,
            "fingerprint_template": emp.fingerprint_template,
            "face_embedding": emp.face_embedding
        }
        for emp in employees
    ]

    return {"employees": result}