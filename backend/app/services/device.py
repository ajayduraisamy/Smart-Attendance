import secrets
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.device import Device
from app.models.office import Office
from app.models.employee import Employee


def create_device(device_id: str, office_id: int, db: Session) -> Device:
    """Create a new device with API key"""

    # Check duplicate device
    existing = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if existing:
        raise Exception("Device already exists")

    # Validate office
    office = db.query(Office).filter(
        Office.id == office_id,
        Office.status == True
    ).first()

    if not office:
        raise Exception("Invalid office")

    api_key = secrets.token_hex(32)

    device = Device(
        device_id=device_id,
        office_id=office_id,
        api_key=api_key,
        status=True
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device


def verify_device(device_id: str, api_key: str, db: Session) -> Device:
    """Verify device credentials"""

    device = db.query(Device).filter(
        Device.device_id == device_id,
        Device.api_key == api_key,
        Device.status == True
    ).first()

    if device:
        device.last_seen = datetime.utcnow()
        db.commit()

    return device


def sync_employee_data(device_id: str, api_key: str, db: Session) -> list:
    """Get employee data for device synchronization"""

    device = verify_device(device_id, api_key, db)

    if not device:
        return None

    employees = db.query(Employee).filter(
        Employee.status == True,
        Employee.office_id == device.office_id
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

    return result