from pydantic import BaseModel


class OfficeCreate(BaseModel):
    name: str
    location: str | None = None


class OfficeOut(BaseModel):
    id: int
    name: str
    location: str | None
    status: bool

    class Config:
        orm_mode = True
