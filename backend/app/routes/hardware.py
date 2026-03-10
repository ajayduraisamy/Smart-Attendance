from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import base64
import cv2
import numpy as np
import face_recognition
import json
from datetime import datetime

from app.database import get_db
from app.models.employee import Employee
from app.models.device import Device
from app.models.attendance import Attendance

router = APIRouter(
    prefix="/hardware",
    tags=["Hardware"]
)

# -------------------------------------------------
# GET EMPLOYEES WHO NEED BIOMETRIC ENROLLMENT
# -------------------------------------------------

@router.get("/employees-pending")
def get_pending_employees(db: Session = Depends(get_db)):

    employees = db.query(Employee).filter(
        Employee.status == True,
        or_(
            Employee.rfid_uid == None,
            Employee.fingerprint_1 == None,
            Employee.face_embedding_1 == None
        )
    ).all()

    return [
        {
            "emp_id": emp.emp_id,
            "name": emp.name
        }
        for emp in employees
    ]


# -------------------------------------------------
# ASSIGN BIOMETRICS
# -------------------------------------------------

@router.put("/assign-biometric")
def assign_biometric(data: dict, db: Session = Depends(get_db)):

    emp_id = data.get("emp_id")

    emp = db.query(Employee).filter(
        Employee.emp_id == emp_id
    ).first()

    if not emp:
        raise HTTPException(404, "Employee not found")

    # RFID
    if "rfid" in data and data["rfid"]:
        emp.rfid_uid = data["rfid"]

    # Fingerprint slot numbers
    if "fingerprints" in data and isinstance(data["fingerprints"], list):

        for i, slot in enumerate(data["fingerprints"][:5]):

            if slot is not None:

                setattr(
                    emp,
                    f"fingerprint_{i+1}",
                    int(slot)
                )

    # Face embeddings
    if "faces" in data and isinstance(data["faces"], list):

        for i, face in enumerate(data["faces"][:5]):

            if face:

                setattr(
    emp,
    f"face_embedding_{i+1}",
    face.encode()
)

    db.commit()

    return {"message": "Biometrics updated successfully"}


# -------------------------------------------------
# DEVICE EMPLOYEE SYNC
# -------------------------------------------------

@router.get("/employees-device")
def get_device_employees(device_id: str, db: Session = Depends(get_db)):

    device = db.query(Device).filter(
        Device.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    employees = db.query(Employee).filter(
        Employee.status == True,
        Employee.office_id == device.office_id
    ).all()

    result = []

    for emp in employees:

        result.append({
            "emp_id": emp.emp_id,
            "name": emp.name,
            "rfid": emp.rfid_uid,
            "fingerprints": [
                emp.fingerprint_1,
                emp.fingerprint_2,
                emp.fingerprint_3,
                emp.fingerprint_4,
                emp.fingerprint_5
            ],
            "faces": [
                emp.face_embedding_1,
                emp.face_embedding_2,
                emp.face_embedding_3,
                emp.face_embedding_4,
                emp.face_embedding_5
            ]
        })

    return result


# -------------------------------------------------
# ATTENDANCE SYNC
# -------------------------------------------------

@router.post("/sync-attendance")
def sync_attendance(data: dict, db: Session = Depends(get_db)):

    device_code = data.get("device_id")

    if not device_code:
        raise HTTPException(400, "Device ID required")

    records = data.get("records")

    device = db.query(Device).filter(
        Device.device_id == device_code
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    saved = 0

    for item in records:

        emp = db.query(Employee).filter(
            Employee.emp_id == item["emp_id"]
        ).first()

        if not emp:
            continue

        existing = db.query(Attendance).filter(
            Attendance.employee_id == emp.id,
            Attendance.date == item["date"]
        ).first()

        if existing:

            if item.get("check_out") and not existing.check_out:
                existing.check_out = item["check_out"]

        else:

            new_att = Attendance(
                employee_id = emp.id,
                office_id = emp.office_id,
                date = item["date"],
                check_in = item["check_in"],
                check_out = item.get("check_out"),
                source = item["source"],
                device_id = device.id
            )

            db.add(new_att)

        saved += 1

    db.commit()

    return {
        "message": "Attendance synced",
        "records_saved": saved
    }


# -------------------------------------------------
# VERIFY BIOMETRIC + RECORD ATTENDANCE
# -------------------------------------------------

@router.post("/verify-and-record")
def verify_and_record(data: dict, db: Session = Depends(get_db)):

    print("\n=========== NEW REQUEST ===========")
    print("Incoming Data:", data)

    bio_type = data.get("type")
    identifier = data.get("identifier")
    device_code = data.get("device_id")

    print("BIO TYPE:", bio_type)
    print("DEVICE CODE:", device_code)

    if not device_code:
        raise HTTPException(400, "Device ID required")

    device = db.query(Device).filter(
        Device.device_id == device_code
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    print("Device Found:", device.device_id)

    emp = None

    # -------------------------------------------------
    # RFID AUTH
    # -------------------------------------------------

    if bio_type == "rfid":

        print("RFID UID:", identifier)

        emp = db.query(Employee).filter(
            Employee.rfid_uid == identifier
        ).first()

        if emp:
            print("RFID matched employee:", emp.emp_id)


    # -------------------------------------------------
    # FINGERPRINT AUTH
    # -------------------------------------------------

    elif bio_type == "fingerprint":

        if identifier is None:
            raise HTTPException(400, "Fingerprint slot id required")

        slot_id = int(identifier)

        print("Fingerprint Slot Received:", slot_id)

        emp = db.query(Employee).filter(
            or_(
                Employee.fingerprint_1 == slot_id,
                Employee.fingerprint_2 == slot_id,
                Employee.fingerprint_3 == slot_id,
                Employee.fingerprint_4 == slot_id,
                Employee.fingerprint_5 == slot_id
            )
        ).first()

        if emp:
            print("Fingerprint matched employee:", emp.emp_id)
        else:
            print("Fingerprint slot not found in DB")


    # -------------------------------------------------
    # FACE AUTH
    # -------------------------------------------------

    elif bio_type == "face":

        print("Face verification started")

        try:

            # Decode base64 image
            img_bytes = base64.b64decode(identifier)

            np_arr = np.frombuffer(img_bytes, np.uint8)

            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            encodings = face_recognition.face_encodings(rgb)

            if len(encodings) == 0:
                print("No face detected")
                raise HTTPException(404, "No face detected")

            incoming_embedding = encodings[0]

            print("Incoming embedding length:", len(incoming_embedding))

            employees = db.query(Employee).filter(
                Employee.office_id == device.office_id
            ).all()

            print("Employees to compare:", len(employees))

            for e in employees:

                print("\nComparing with:", e.emp_id)

                faces = [
                    e.face_embedding_1,
                    e.face_embedding_2,
                    e.face_embedding_3,
                    e.face_embedding_4,
                    e.face_embedding_5
                ]

                for index, f in enumerate(faces):

                    if not f:
                        continue

                    try:

                        decoded = json.loads(f.decode())

                        # Handle double JSON encoding
                        if isinstance(decoded, str):
                            decoded = json.loads(decoded)

                        stored_embedding = np.array(decoded)

                        distance = np.linalg.norm(
                            stored_embedding - incoming_embedding
                        )

                        print(f"Face slot {index+1} distance:", distance)

                        # Slightly relaxed threshold for Raspberry Pi cameras
                        if distance < 0.50:

                            print("FACE MATCH FOUND:", e.emp_id)

                            emp = e
                            break

                    except Exception as err:

                        print("Face decode error:", err)

                if emp:
                    break

        except Exception as e:

            print("Face processing error:", str(e))

            raise HTTPException(
                status_code=500,
                detail=f"Face processing error: {str(e)}"
            )


    # -------------------------------------------------
    # VALIDATION
    # -------------------------------------------------

    if not emp:

        print("USER NOT RECOGNIZED")

        raise HTTPException(404, "User not recognized")

    print("Employee identified:", emp.emp_id)


    # -------------------------------------------------
    # ATTENDANCE LOGIC
    # -------------------------------------------------

    today = datetime.now().date()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == emp.id,
        Attendance.date == today
    ).first()

    if not attendance:

        new_att = Attendance(
            employee_id = emp.id,
            office_id = emp.office_id,
            date = today,
            check_in = datetime.now().time(),
            source = bio_type.upper(),
            device_id = device.id
        )

        db.add(new_att)

        status_msg = "CHECK-IN SUCCESS"

        print("Attendance created")

    elif not attendance.check_out:

        attendance.check_out = datetime.now().time()

        status_msg = "CHECK-OUT SUCCESS"

        print("Checkout recorded")

    else:

        status_msg = "ALREADY MARKED"

        print("Attendance already completed")

    db.commit()

    print("Attendance saved")

    return {
        "name": emp.name,
        "status": status_msg,
        "door_status": "OPEN"
    }