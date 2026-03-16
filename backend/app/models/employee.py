from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Boolean,
    ForeignKey,
    DateTime,
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(String(50), unique=True, nullable=False, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=True, index=True)

    phone = Column(String(20), nullable=True)

    address = Column(String(255), nullable=True)

    photo = Column(Text, nullable=True)

    gender = Column(String(10), nullable=True)

    blood_group = Column(String(10), nullable=True)

    date_of_birth = Column(Date, nullable=True)

    position = Column(String(100), nullable=False)

    joined_date = Column(Date, nullable=False)

    office_id = Column(
        Integer,
        ForeignKey("offices.id"),
        nullable=False,
        index=True
    )

    status = Column(Boolean, default=True)

    # ---------------- RFID ----------------
    rfid_uid = Column(String(100), unique=True, nullable=True, index=True)

    # ---------------- Fingerprints ----------------
    fingerprint_1 = Column(Text, nullable=True)
    fingerprint_2 = Column(Text, nullable=True)
    fingerprint_3 = Column(Text, nullable=True)
    fingerprint_4 = Column(Text, nullable=True)

    # ---------------- Face Images (BASE64) ----------------
    face_image_1 = Column(Text, nullable=True)
    face_image_2 = Column(Text, nullable=True)
    face_image_3 = Column(Text, nullable=True)
    face_image_4 = Column(Text, nullable=True)
    face_image_5 = Column(Text, nullable=True)

    # ---------------- Face Embeddings ----------------
    face_embedding_1 = Column(Text, nullable=True)
    face_embedding_2 = Column(Text, nullable=True)
    face_embedding_3 = Column(Text, nullable=True)
    face_embedding_4 = Column(Text, nullable=True)
    face_embedding_5 = Column(Text, nullable=True)

    # ---------------- Relationships ----------------
    office = relationship("Office", back_populates="employees")

    attendance_records = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete"
    )

    # ---------------- Audit Fields ----------------
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )