from sqlalchemy.orm import Session
from app.models.device import Device
import secrets


def create_device(device_id: str, office_id: int, db: Session) -> Device:
    """Create a new device with API key"""
    
    api_key = secrets.token_hex(32)
    
    device = Device(
        device_id=device_id,
        office_id=office_id,
        api_key=api_key
    )
    
    db.add(device)
    db.commit()
    db.refresh(device)
    
    return device


def verify_device(device_id: str, api_key: str, db: Session) -> Device:
    """Verify device credentials"""
    
    return db.query(Device).filter(
        Device.device_id == device_id,
        Device.api_key == api_key,
        Device.status == True
    ).first()


def sync_employee_data(device_id: str, api_key: str, db: Session) -> list:
    """Get employee data for device synchronization"""
    
    from app.models.employee import Employee
    
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
