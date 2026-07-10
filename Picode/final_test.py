import requests
import time
import cv2
import base64
import sqlite3
import threading
import json
import numpy as np

from picamera2 import Picamera2
from mfrc522 import SimpleMFRC522
from pyfingerprint.pyfingerprint import PyFingerprint
import face_recognition
import RPi.GPIO as GPIO

RELAY_PIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)
GPIO.output(RELAY_PIN, GPIO.LOW)

API_URL = "https://aislyntech-attendance.hf.space"
DEVICE_ID = "Aislyn001"
DEVICE_API_KEY = ""
DB_NAME = "smart_attendance.db"


def device_headers():
    return {"X-Device-ID": DEVICE_ID, "X-API-Key": DEVICE_API_KEY}


def open_door():
    try:
        print(">>> Door Relay ON")
        GPIO.output(RELAY_PIN, GPIO.HIGH)
        time.sleep(5)
        GPIO.output(RELAY_PIN, GPIO.LOW)
        print(">>> Door Relay OFF")
    except Exception as e:
        print("Relay Error:", e)


def init_db():
    conn = sqlite3.connect(DB_NAME)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            emp_id TEXT PRIMARY KEY,
            name TEXT,
            rfid TEXT,
            fingerprint1 TEXT, fingerprint2 TEXT, fingerprint3 TEXT, fingerprint4 TEXT, fingerprint5 TEXT,
            face1 TEXT, face2 TEXT, face3 TEXT, face4 TEXT, face5 TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS attendance_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emp_id TEXT,
            date TEXT,
            time TEXT,
            type TEXT,
            synced INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()
    print(">>> Local DB Ready")


def sync_worker():
    while True:
        try:
            conn = sqlite3.connect(DB_NAME)
            conn.row_factory = sqlite3.Row
            unsynced = conn.execute("SELECT * FROM attendance_logs WHERE synced = 0").fetchall()
            if unsynced:
                records = []
                for r in unsynced:
                    records.append({"emp_id": r["emp_id"], "date": r["date"], "check_in": r["time"], "source": r["type"]})
                payload = {"device_id": DEVICE_ID, "records": records}
                res = requests.post(f"{API_URL}/hardware/sync-attendance", json=payload, headers=device_headers(), timeout=10)
                if res.status_code == 200:
                    conn.execute("UPDATE attendance_logs SET synced = 1 WHERE synced = 0")
                    conn.commit()
                    print(f">>> [SYNC] Uploaded {len(records)} offline records")
            conn.close()
        except Exception:
            pass
        time.sleep(30)


def save_attendance_local(emp_id, bio_type):
    conn = sqlite3.connect(DB_NAME)
    conn.execute("INSERT INTO attendance_logs (emp_id, date, time, type, synced) VALUES (?,?,?,?,0)",
                 (emp_id, time.strftime('%Y-%m-%d'), time.strftime('%H:%M:%S'), bio_type))
    conn.commit()
    conn.close()


def mark_attendance(emp_id, name, bio_type):
    save_attendance_local(emp_id, bio_type)
    print(f"\n>>> ATTENDANCE: {name} ({emp_id}) via {bio_type}")
    open_door()
    payload = {"identifier": emp_id, "type": bio_type.lower(), "device_id": DEVICE_ID}
    try:
        res = requests.post(f"{API_URL}/hardware/verify-and-record", json=payload, headers=device_headers(), timeout=5)
        if res.status_code == 200:
            print(">>> [ONLINE] Attendance recorded on server")
            conn = sqlite3.connect(DB_NAME)
            conn.execute("UPDATE attendance_logs SET synced = 1 WHERE emp_id = ? AND time = ?",
                         (emp_id, time.strftime('%H:%M:%S')))
            conn.commit()
            conn.close()
    except Exception:
        print(">>> [OFFLINE] Attendance saved locally")


# ─────────────────────────────────────────────
# ENROLLMENT MODE (triggered by dashboard command)
# ─────────────────────────────────────────────
def enroll_rfid():
    print("\n[ENROLL RFID] Tap card now...")
    reader = SimpleMFRC522()
    uid, _ = reader.read()
    uid_str = str(uid)
    print(f">>> RFID Captured: {uid_str}")
    res = requests.post(f"{API_URL}/hardware/upload", json={
        "emp_id": current_cmd["emp_id"], "type": "rfid", "data": uid_str
    }, headers=device_headers(), timeout=10)
    if res.status_code == 200:
        print(">>> RFID Enrolled Successfully")
    return uid_str


def enroll_finger(index):
    print(f"\n[ENROLL FINGER {index}/4] Place finger...")
    f = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)
    if not f.verifyPassword():
        print(">>> Sensor password error")
        return False
    while not f.readImage():
        time.sleep(0.1)
    f.convertImage(0x01)
    time.sleep(1.5)
    print("Place same finger again...")
    while not f.readImage():
        time.sleep(0.1)
    f.convertImage(0x02)
    if f.compareCharacteristics() == 0:
        print(">>> Fingerprint mismatch")
        return False
    f.createTemplate()
    position = f.storeTemplate()
    print(f">>> Finger {index} stored at slot {position}")
    res = requests.post(f"{API_URL}/hardware/upload", json={
        "emp_id": current_cmd["emp_id"], "type": "finger", "index": index, "data": str(position)
    }, headers=device_headers(), timeout=10)
    return res.status_code == 200


def enroll_face(index):
    print(f"\n[ENROLL FACE {index}/5] Look at camera...")
    picam2 = Picamera2()
    config = picam2.create_preview_configuration(main={"size": (640, 480), "format": "XBGR8888"})
    picam2.configure(config)
    picam2.start()
    time.sleep(1)
    frame = picam2.capture_array()
    frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGBA2BGR)
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    faces = face_recognition.face_locations(rgb)
    if len(faces) == 0:
        print(">>> No face detected")
        picam2.stop()
        picam2.close()
        return False
    enc = face_recognition.face_encodings(rgb, faces)[0].tolist()
    _, buffer = cv2.imencode(".jpg", frame_bgr)
    img_b64 = base64.b64encode(buffer).decode()
    picam2.stop()
    picam2.close()
    print(f">>> Face {index} Captured")
    res = requests.post(f"{API_URL}/hardware/upload", json={
        "emp_id": current_cmd["emp_id"], "type": "face", "index": index,
        "data": json.dumps(enc), "image": img_b64
    }, headers=device_headers(), timeout=10)
    return res.status_code == 200


current_cmd = {"emp_id": None, "command": 0, "index": None}


def check_pending_command():
    try:
        res = requests.get(f"{API_URL}/hardware/pending-command", headers=device_headers(), timeout=5)
        if res.status_code == 200:
            data = res.json()
            if data.get("command") and data["command"] != 0:
                return data
    except Exception:
        pass
    return None


def process_enrollment_command(cmd):
    global current_cmd
    current_cmd = cmd
    print(f"\n=== ENROLLMENT MODE for {cmd['emp_id']} ===")
    if cmd["command"] == 1:
        enroll_rfid()
    elif cmd["command"] == 2 and cmd.get("index"):
        enroll_finger(cmd["index"])
    elif cmd["command"] == 3 and cmd.get("index"):
        enroll_face(cmd["index"])
    else:
        print(f">>> Unknown command: {cmd}")
    current_cmd = {"emp_id": None, "command": 0, "index": None}


# ─────────────────────────────────────────────
# ATTENDANCE MODE
# ─────────────────────────────────────────────
def load_face_db():
    encodings, names, ids = [], [], []
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT emp_id, name, face1, face2, face3, face4, face5 FROM employees").fetchall()
    conn.close()
    for row in rows:
        for i in range(1, 6):
            if row[f"face{i}"]:
                encodings.append(np.array(json.loads(row[f"face{i}"])))
                names.append(row["name"])
                ids.append(row["emp_id"])
    return encodings, names, ids


def do_rfid():
    print("\n[RFID] Tap card...")
    reader = SimpleMFRC522()
    uid, _ = reader.read()
    uid_str = str(uid)
    print(f"UID: {uid_str}")
    conn = sqlite3.connect(DB_NAME)
    emp = conn.execute("SELECT emp_id, name FROM employees WHERE rfid = ?", (uid_str,)).fetchone()
    conn.close()
    if emp:
        mark_attendance(emp[0], emp[1], "RFID")
    else:
        print(">>> Not found locally, checking server...")
        payload = {"identifier": uid_str, "type": "rfid", "device_id": DEVICE_ID}
        try:
            res = requests.post(f"{API_URL}/hardware/verify-and-record", json=payload, headers=device_headers(), timeout=10)
            if res.status_code == 200:
                data = res.json()
                print(f">>> Server: {data.get('name')} - {data.get('status')}")
                open_door()
        except Exception:
            print(">>> Not found on server either")


def do_finger():
    print("\n[FINGER] Place finger...")
    f = PyFingerprint('/dev/serial0', 57600, 0xFFFFFFFF, 0x00000000)
    if not f.verifyPassword():
        print("Sensor error")
        return
    while not f.readImage():
        time.sleep(0.1)
    f.convertImage(0x01)
    result = f.searchTemplate()
    position = result[0]
    if position == -1:
        print(">>> Finger not recognized")
        return
    print(f">>> Matched slot: {position}")
    conn = sqlite3.connect(DB_NAME)
    emp = conn.execute("""SELECT emp_id, name FROM employees
                          WHERE fingerprint1=? OR fingerprint2=? OR fingerprint3=?
                          OR fingerprint4=? OR fingerprint5=?""",
                       (position, position, position, position, position)).fetchone()
    conn.close()
    if emp:
        mark_attendance(emp[0], emp[1], "FINGERPRINT")
    else:
        print(">>> Found in sensor but not in local DB")
        payload = {"identifier": str(position), "type": "fingerprint", "device_id": DEVICE_ID}
        try:
            res = requests.post(f"{API_URL}/hardware/verify-and-record", json=payload, headers=device_headers(), timeout=10)
            if res.status_code == 200:
                data = res.json()
                print(f">>> Server: {data.get('name')}")
                open_door()
        except Exception:
            pass


def do_face():
    print("\n[FACE] Look at camera...")
    picam2 = Picamera2()
    config = picam2.create_preview_configuration(main={"size": (640, 480), "format": "XBGR8888"})
    picam2.configure(config)
    picam2.start()

    known_encodings, known_names, known_ids = load_face_db()
    print(f"Loaded {len(known_encodings)} face encodings")

    face_detect_time = None
    hold_time = 2
    identified = False

    try:
        while True:
            frame = picam2.capture_array()
            frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGBA2BGR)
            small = cv2.resize(frame_bgr, (0, 0), fx=0.5, fy=0.5)
            rgb_small = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
            face_locs = face_recognition.face_locations(rgb_small)
            face_encs = face_recognition.face_encodings(rgb_small, face_locs)

            if len(face_encs) > 0:
                if face_detect_time is None:
                    face_detect_time = time.time()
                elapsed = time.time() - face_detect_time
                cv2.putText(frame_bgr, f"Hold {int(hold_time - elapsed)}" if elapsed < hold_time else "Recognizing...",
                            (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                if elapsed >= hold_time and not identified:
                    matches = face_recognition.compare_faces(known_encodings, face_encs[0], tolerance=0.45)
                    if True in matches:
                        idx = matches.index(True)
                        identified = True
                        _, buffer = cv2.imencode(".jpg", frame_bgr)
                        img_b64 = base64.b64encode(buffer).decode()
                        mark_attendance(known_ids[idx], known_names[idx], "FACE")
                        picam2.stop()
                        picam2.close()
                        cv2.destroyAllWindows()
                        return
                    else:
                        print(">>> Face not recognized")
                        identified = True
                        picam2.stop()
                        picam2.close()
                        cv2.destroyAllWindows()
                        return
            else:
                face_detect_time = None

            cv2.imshow("Face Recognition", frame_bgr)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    except Exception as e:
        print("Camera Error:", e)
    finally:
        picam2.stop()
        picam2.close()
        cv2.destroyAllWindows()


def download_employees():
    try:
        res = requests.get(f"{API_URL}/hardware/download/employees-csv",
                           params={"device_id": DEVICE_ID, "api_key": DEVICE_API_KEY}, timeout=10)
        if res.status_code == 200:
            content = res.text
            lines = content.strip().split("\n")
            if len(lines) < 2:
                return
            headers = lines[0].split(",")
            conn = sqlite3.connect(DB_NAME)
            conn.execute("DELETE FROM employees")
            for line in lines[1:]:
                vals = line.split(",")
                if len(vals) >= 3:
                    eid = vals[1] if len(vals) > 1 else ""
                    name = vals[2] if len(vals) > 2 else ""
                    rfid = vals[14] if len(vals) > 14 else ""
                    f1 = vals[15] if len(vals) > 15 else ""
                    f2 = vals[16] if len(vals) > 16 else ""
                    f3 = vals[17] if len(vals) > 17 else ""
                    f4 = vals[18] if len(vals) > 18 else ""
                    img1 = vals[19] if len(vals) > 19 else ""
                    img2 = vals[20] if len(vals) > 20 else ""
                    img3 = vals[21] if len(vals) > 21 else ""
                    img4 = vals[22] if len(vals) > 22 else ""
                    img5 = vals[23] if len(vals) > 23 else ""
                    emb1 = vals[24] if len(vals) > 24 else ""
                    emb2 = vals[25] if len(vals) > 25 else ""
                    emb3 = vals[26] if len(vals) > 26 else ""
                    emb4 = vals[27] if len(vals) > 27 else ""
                    emb5 = vals[28] if len(vals) > 28 else ""
                    conn.execute("""INSERT OR REPLACE INTO employees
                        (emp_id, name, rfid, fingerprint1, fingerprint2, fingerprint3, fingerprint4, fingerprint5,
                         face1, face2, face3, face4, face5)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                                 (eid, name, rfid, f1, f2, f3, f4, "", img1, img2, img3, img4, img5))
            conn.commit()
            conn.close()
            print(f">>> Downloaded {len(lines)-1} employees from server")
    except Exception as e:
        print(f">>> Download error: {e}")


def main():
    init_db()
    threading.Thread(target=sync_worker, daemon=True).start()
    download_employees()
    print("\n========== FINAL TEST - Unified Terminal ==========")
    print("  - Dashboard commands → Enrollment mode")
    print("  - Manual scan → Attendance mode")
    print("===================================================\n")

    while True:
        print("\n1. RFID")
        print("2. Fingerprint")
        print("3. Face Recognition")
        print("4. Sync Employees from Server")
        print("5. Exit")

        choice = input("\nSelect: ")

        if choice == "5":
            break

        cmd = check_pending_command()
        if cmd:
            process_enrollment_command(cmd)
            download_employees()
        else:
            if choice == "1":
                do_rfid()
            elif choice == "2":
                do_finger()
            elif choice == "3":
                do_face()
            elif choice == "4":
                download_employees()
            else:
                print("Invalid option")

    GPIO.cleanup()


if __name__ == "__main__":
    try:
        main()
    finally:
        GPIO.cleanup()
