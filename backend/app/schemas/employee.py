from datetime import date
from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):

    emp_id: str
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    position: str
    joined_date: date
    office_id: int | None = None


class EmployeeUpdate(BaseModel):

    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    position: str | None = None
    status: bool | None = None
    office_id: int | None = None


class EmployeeOut(BaseModel):

    id: int
    emp_id: str
    name: str
    email: str | None
    phone: str | None
    position: str
    joined_date: date
    status: bool
    office_id: int | None

    class Config:
        orm_mode = True
