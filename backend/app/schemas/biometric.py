from pydantic import BaseModel


class RFIDEnroll(BaseModel):

    emp_id: str
    rfid_uid: str


class FingerEnroll(BaseModel):

    emp_id: str
    fingerprint_template: bytes


class FaceEnroll(BaseModel):

    emp_id: str
    face_embedding: bytes