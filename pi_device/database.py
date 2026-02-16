import sqlite3


def get_connection():
    conn = sqlite3.connect("local.db")
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees_local (
        emp_id TEXT PRIMARY KEY,
        emp_name TEXT,
        rfid_uid TEXT,
        fingerprint_template BLOB,
        face_embedding BLOB
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance_local (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id TEXT,
        emp_name TEXT,
        device_id TEXT,
        office_id INTEGER,
        date TEXT,
        in_time TEXT,
        out_time TEXT,
        type TEXT,
        source TEXT,
        synced INTEGER DEFAULT 0
    )
    """)

    conn.commit()
    conn.close()
