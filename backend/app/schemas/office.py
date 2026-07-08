from pydantic import BaseModel


class OfficeBase(BaseModel):
    name: str
    location: str | None = None


class OfficeCreate(OfficeBase):
    pass


class OfficeUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    status: bool | None = None


class OfficeOut(OfficeBase):
    id: int
    status: bool

    model_config = {"from_attributes": True}