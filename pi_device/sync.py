import requests

from database import get_connection


API_URL = "http://127.0.0.1:8000"
DEVICE_ID = "PI_01"
API_KEY = "PASTE_DEVICE_API_KEY_HERE"


def sync_employees():

    headers = {
        "X-Device-ID": DEVICE_ID,
        "X-API-KEY": API_KEY
    }

    try:
        res = requests.get(
            f"{API_URL}/devices/sync-data",
            headers=headers,
            timeout=5
        )

        if res.status_code != 200:
            print("Sync failed ❌")
            return

        data = res.json()

        conn = get_connection()
        cur = conn.cursor()

        # Clear old data
        cur.execute("DELETE FROM employees_local")

        for emp in data["employees"]:

            cur.execute("""
            INSERT INTO employees_local
            VALUES (?, ?, ?, ?, ?)
            """, (
                emp["emp_id"],
                emp["name"],
                emp["rfid_uid"],
                emp["fingerprint_template"],
                emp["face_embedding"]
            ))

        conn.commit()
        conn.close()

        print("Employees synced successfully ")

    except Exception as e:
        print("Offline mode enabled", e)



def upload_offline_attendance():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM attendance_local
        WHERE synced = 0
    """)

    rows = cur.fetchall()

    if not rows:
        print("No offline records ✔")
        conn.close()
        return

    payload = []

    for row in rows:
        payload.append({
            "emp_id": row["emp_id"],
            "emp_name": row["emp_name"],
            "device_id": row["device_id"],
            "office_id": row["office_id"],
            "date": row["date"],
            "in_time": row["in_time"],
            "out_time": row["out_time"],
            "type": row["type"],
            "source": row["source"]
        })

    try:
        res = requests.post(
            f"{API_URL}/attendance/offline-sync",
            json=payload,
            timeout=5
        )

        if res.status_code == 200:
            cur.execute("""
                UPDATE attendance_local
                SET synced = 1
                WHERE synced = 0
            """)
            conn.commit()
            print("Offline attendance uploaded ✔")

        else:
            print("Upload failed ❌")

    except Exception as e:
        print("Still offline ⚠", e)

    conn.close()

if __name__ == "__main__":
    sync_employees()
    upload_offline_attendance()
