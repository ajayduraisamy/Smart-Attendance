from datetime import datetime
import cv2
import numpy as np

from database import create_tables, get_connection
from rfid import scan_rfid
from fingerprint import scan_fingerprint
from face import match_face
from relay import unlock_door


DEVICE_ID = "PI_01"
OFFICE_ID = 1


def authenticate():

 

    # 1. RFID
    rfid = scan_rfid()

    # 2. Fingerprint
    finger = scan_fingerprint()

    # 3. Capture Face (Camera)
    cam = cv2.VideoCapture(0)

    print("Look at Camera...")

    ret, frame = cam.read()
    cam.release()

    if not ret:
        print("Camera Error ")
        return

    rgb = frame[:, :, ::-1]  

    # 4. Check Local DB
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM employees_local
        WHERE rfid_uid = ?
    """, (rfid,))

    emp = cursor.fetchone()

    if not emp:
        print("RFID Not Found ")
        conn.close()
        return

    # 5. Load Stored Face
    stored_embedding = np.frombuffer(
        emp["face_embedding"],
        dtype=np.float64
    )

    # 6. Match Face
    matched = match_face(stored_embedding, rgb)

    if not matched:
        print("Face Not Matched ")
        conn.close()
        return

    print("Face Verified ")
    print("Access Granted ")

    # 7. Save Attendance
    now = datetime.now()

    cursor.execute("""
        INSERT INTO attendance_local
        (emp_id, emp_name, device_id, office_id, date, in_time, type, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        emp["emp_id"],
        emp["emp_name"],
        DEVICE_ID,
        OFFICE_ID,
        now.date().isoformat(),
        now.time().isoformat(),
        "IN",
        "OFFLINE"
    ))

    conn.commit()
    conn.close()

   
    unlock_door()


if __name__ == "__main__":

    create_tables()

    while True:
        authenticate()
