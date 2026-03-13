

from fastapi import Response
import csv
from io import StringIO
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee

from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/hardware", tags=["Hardware"])


# ----------------------------
# COMMAND STATE (RAM)
# ----------------------------

hardware_state = {
    "emp_id": None,
    "command": 0,
    "index": None
}


# ----------------------------
# SCHEMAS
# ----------------------------

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


# ----------------------------
# SEND COMMAND (FROM DASHBOARD)
# ----------------------------

@router.post("/command")
def send_command(data: HardwareCommand):
    hardware_state["emp_id"] = data.emp_id
    hardware_state["command"] = data.command
    hardware_state["index"] = data.index

    print("Hardware command:", hardware_state)

    return {
        "message": "Command stored",
        "state": hardware_state
    }


# ----------------------------
# DEVICE READ COMMAND
# ----------------------------

@router.get("/command")
def get_command():
    return hardware_state


# ----------------------------
# RESET COMMAND
# ----------------------------

@router.post("/reset")
def reset_command():
    hardware_state["emp_id"] = None
    hardware_state["command"] = 0
    hardware_state["index"] = None
    return {"message": "Command reset"}


# ----------------------------
# UPLOAD BIOMETRIC FROM DEVICE
# ----------------------------

@router.post("/upload")
def upload_biometric(data: HardwareUpload, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.emp_id == data.emp_id).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # RFID
    if data.type == "rfid":
        emp.rfid_uid = data.data

    # Fingerprint
    elif data.type == "finger":
        if data.index == 1:
            emp.fingerprint_1 = data.data
        elif data.index == 2:
            emp.fingerprint_2 = data.data
        elif data.index == 3:
            emp.fingerprint_3 = data.data
        elif data.index == 4:
            emp.fingerprint_4 = data.data

    # Face Recognition
    elif data.type == "face":
        if data.index == 1:
            emp.face_embedding_1 = data.data
            emp.face_image_1 = data.image
        elif data.index == 2:
            emp.face_embedding_2 = data.data
            emp.face_image_2 = data.image
        elif data.index == 3:
            emp.face_embedding_3 = data.data
            emp.face_image_3 = data.image
        elif data.index == 4:
            emp.face_embedding_4 = data.data
            emp.face_image_4 = data.image
        elif data.index == 5:
            emp.face_embedding_5 = data.data
            emp.face_image_5 = data.image

    else:
        raise HTTPException(status_code=400, detail="Invalid biometric type")

    db.commit()
    
    # IMPORTANT: Reset the hardware state after successful upload
    hardware_state["emp_id"] = None
    hardware_state["command"] = 0
    hardware_state["index"] = None

    print(f"Biometric stored for: {data.emp_id}, command reset to 0")

    return {"message": "Biometric saved successfully"}

# ----------------------------
# GET FACE PREVIEW
# ----------------------------

@router.get("/face-preview/{index}")
def get_face_preview(index: int, emp_id: str, db: Session = Depends(get_db)):
    """
    Get face preview image for an employee
    Usage: /hardware/face-preview/1?emp_id=AT0001
    """
    print(f"Fetching face preview for emp_id: {emp_id}, index: {index}")
    
    emp = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Get the appropriate face image based on index
    image = None
    if index == 1:
        image = emp.face_image_1
    elif index == 2:
        image = emp.face_image_2
    elif index == 3:
        image = emp.face_image_3
    elif index == 4:
        image = emp.face_image_4
    elif index == 5:
        image = emp.face_image_5
    
    if not image:
        return {"image": None, "message": f"No face image found for index {index}"}
    
    return {"image": image}



@router.get("/download/employees-csv")
def download_employees_csv(db: Session = Depends(get_db)):
    """
    Download all employees data as CSV file with custom filename
    Format: HH-MM-DD-MM-YYYY (12-hour format)
    """
    # Get all employees
    employees = db.query(Employee).all()
    
    # Create CSV in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header row
    writer.writerow([
        'id', 'emp_id', 'name', 'email', 'phone', 'address',
        'gender', 'blood_group', 'date_of_birth', 'position', 'joined_date',
        'office_id', 'status', 'rfid_uid',
        'fingerprint_1', 'fingerprint_2', 'fingerprint_3', 'fingerprint_4',
        'face_image_1', 'face_image_2', 'face_image_3', 'face_image_4', 'face_image_5',
        'face_embedding_1', 'face_embedding_2', 'face_embedding_3', 'face_embedding_4', 'face_embedding_5',
        'created_at', 'updated_at'
    ])
    
    # Write each employee's data
    for emp in employees:
        joined_date = emp.joined_date.strftime('%Y-%m-%d') if emp.joined_date else ''
        date_of_birth = emp.date_of_birth.strftime('%Y-%m-%d') if emp.date_of_birth else ''
        created_at = emp.created_at.strftime('%Y-%m-%d %H:%M:%S') if emp.created_at else ''
        updated_at = emp.updated_at.strftime('%Y-%m-%d %H:%M:%S') if emp.updated_at else ''
        
        writer.writerow([
            emp.id, emp.emp_id, emp.name, emp.email or '', emp.phone or '', emp.address or '',
            emp.gender or '', emp.blood_group or '', date_of_birth, emp.position, joined_date,
            emp.office_id, emp.status, emp.rfid_uid or '',
            emp.fingerprint_1 or '', emp.fingerprint_2 or '', emp.fingerprint_3 or '', emp.fingerprint_4 or '',
            emp.face_image_1 or '', emp.face_image_2 or '', emp.face_image_3 or '', emp.face_image_4 or '', emp.face_image_5 or '',
            emp.face_embedding_1 or '', emp.face_embedding_2 or '', emp.face_embedding_3 or '', emp.face_embedding_4 or '', emp.face_embedding_5 or '',
            created_at, updated_at
        ])
    
    # --- UPDATED FILENAME LOGIC ---
    # %I = 12hr Hour, %M = Minute, %p = AM/PM, %d = Day, %m = Month, %Y = Year
    # Example: employees_03-15-PM-13-03-2026.csv
    time_stamp = datetime.now().strftime('%I-%M-%p-%d-%m-%Y')
    filename = f"employees_{time_stamp}.csv"
    
    # Return as downloadable file
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )