from pydantic import BaseModel


class DeviceCreate(BaseModel):
    device_id: str
    office_id: int


class DeviceUpdate(BaseModel):
    office_id: int | None = None
    status: bool | None = None


class DeviceOut(BaseModel):
    id: int
    device_id: str
    api_key: str
    office_id: int
    status: bool

    model_config = {"from_attributes": True}


class DeviceVerify(BaseModel):
    device_id: str
    api_key: str