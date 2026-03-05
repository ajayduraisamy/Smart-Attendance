from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# Create Employee
class EmployeeCreate(BaseModel):
    emp_id: str
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    position: str
    joined_date: date
    office_id: int
    rfid_uid: str | None = None


# Update Employee
class EmployeeUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    position: str | None = None
    status: bool | None = None
    office_id: int | None = None
    rfid_uid: str | None = None


# Response Model
class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    emp_id: str
    name: str
    email: str | None
    phone: str | None
    position: str
    joined_date: date
    status: bool
    office_id: int
    rfid_uid: str | None
    created_at: datetime


# Device Sync Schema
class EmployeeDeviceSync(BaseModel):
    emp_id: str
    name: str
    rfid_uid: str | None
    face_embedding: bytes | None