from pydantic import BaseModel


class DeviceCreate(BaseModel):
    device_id: str
    office_id: int | None = None


class DeviceOut(BaseModel):
    id: int
    device_id: str
    api_key: str
    office_id: int | None
    status: bool

    class Config:
        orm_mode = True


class DeviceVerify(BaseModel):
    device_id: str
    api_key: str
