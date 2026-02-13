from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Boolean,
    ForeignKey,
    LargeBinary
)

from sqlalchemy.orm import relationship

from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(String(50), unique=True, nullable=False)

    name = Column(String(100), nullable=False)

    email = Column(String(100), nullable=True)

    phone = Column(String(20), nullable=True)

    address = Column(String(255), nullable=True)

    photo = Column(String(255), nullable=True)

    gender = Column(String(10), nullable=True)

    blood_group = Column(String(10), nullable=True)

    date_of_birth = Column(Date, nullable=True)

    
    position = Column(String(100), nullable=False)

    joined_date = Column(Date, nullable=False)

    office_id = Column(Integer, nullable=True)

    status = Column(Boolean, default=True)


    # Biometric Data
    rfid_uid = Column(String(100), unique=True, nullable=True)

    fingerprint_template = Column(LargeBinary, nullable=True)

    face_embedding = Column(LargeBinary, nullable=True)
