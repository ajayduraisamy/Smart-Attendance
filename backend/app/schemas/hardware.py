from pydantic import BaseModel
from typing import Optional


class HardwareCommand(BaseModel):
    emp_id: str
    command: int
    index: Optional[int] = None


class HardwareUpload(BaseModel):
    emp_id: str
    type: str
    index: Optional[int] = None
    data: Optional[str] = None
    image: Optional[str] = None