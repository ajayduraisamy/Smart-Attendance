from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

# Create Employee
class EmployeeCreate(BaseModel):
    emp_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    date_of_birth: Optional[date] = None
    position: str
    joined_date: date
    office_id: int


# Update Employee
class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    date_of_birth: Optional[date] = None
    position: Optional[str] = None
    joined_date: Optional[date] = None
    office_id: Optional[int] = None
    status: Optional[bool] = None
    rfid_uid: Optional[str] = None


# Response Model - FIXED: Now includes ALL fields from database
class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    # Basic Info
    id: int
    emp_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    date_of_birth: Optional[date] = None
    position: str
    joined_date: date
    office_id: int
    status: bool
    
    # RFID
    rfid_uid: Optional[str] = None
    
    # Fingerprints
    fingerprint_1: Optional[str] = None
    fingerprint_2: Optional[str] = None
    fingerprint_3: Optional[str] = None
    fingerprint_4: Optional[str] = None
    
    # Face Images
    face_image_1: Optional[str] = None
    face_image_2: Optional[str] = None
    face_image_3: Optional[str] = None
    face_image_4: Optional[str] = None
    face_image_5: Optional[str] = None
    
    # Face Embeddings
    face_embedding_1: Optional[str] = None
    face_embedding_2: Optional[str] = None
    face_embedding_3: Optional[str] = None
    face_embedding_4: Optional[str] = None
    face_embedding_5: Optional[str] = None
    
    # Audit
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Device Sync Schema
class EmployeeDeviceSync(BaseModel):
    emp_id: str
    name: str
    rfid_uid: Optional[str] = None
    face_embedding: Optional[bytes] = None