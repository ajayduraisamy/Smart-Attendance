from pydantic import BaseModel, EmailStr
from typing import Literal


# ============================
# CREATE USER
# ============================
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["admin", "hr"]


# ============================
# LOGIN
# ============================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ============================
# OUTPUT
# ============================
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        orm_mode = True