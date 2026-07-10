# When to Run Which Pi Code

## 3 Scenarios — Simple Guide

---

### Scenario 1: Creating a New Employee (Add Employee Form)

**Dashboard page:** `/app/employees`
**Pi code to run:** `Picode/register.py`

**What happens step by step:**
1. You open the dashboard → fill employee name, ID, office, etc.
2. Click **Save Employee** → employee saved in MySQL (backend)
3. Now the biometric section appears on the same page
4. You click a biometric button (e.g., "Tap RFID Card" or "Finger 1")
5. Backend stores a command in memory: `{emp_id: "AT0001", command: 1, index: null}`
6. Pi running `register.py` picks up this command and activates the sensor
7. You tap RFID / place finger on the Pi → Pi captures it
8. Pi uploads data to backend → command resets to 0
9. Dashboard shows ✅ success

**Run this on Pi:**
```bash
python Picode/register.py
```

---

### Scenario 2: Updating Biometrics for Existing Employee

**Dashboard page:** `/app/employee-list` or `/app/employees`
**Pi code to run:** `Picode/register.py`

**What happens:**
- Same as Scenario 1
- The employee already exists, you're just re-capturing their fingerprint or face
- Dashboard sends command → Pi captures → uploads → done

**Run this on Pi:**
```bash
python Picode/register.py
```

---

### Scenario 3: Daily Attendance (Check-in / Check-out)

**Pi location:** At the office entrance door
**Pi code to run:** `Picode/server.py`

**What happens:**
1. Pi shows menu:
   ```
   1. RFID Tap
   2. Fingerprint Scan
   3. Face Recognition
   ```
2. Person selects option and uses the sensor
3. Pi checks local SQLite cache → matches employee
4. Opens door relay (GPIO 17, 5 seconds)
5. Saves attendance locally + sends to backend
6. If offline, syncs later automatically

**Run this on Pi:**
```bash
python Picode/server.py
```

---

## Quick Reference Table

| What you want to do | Dashboard page | Pi code to run |
|---|---|---|
| Add new employee + capture biometrics | `/app/employees` | `register.py` |
| Update biometrics (RFID/finger/face) | `/app/employee-list` | `register.py` |
| Daily check-in/check-out (at door) | No dashboard needed | `server.py` |

---

## Important Notes

- **`register.py`** and **`server.py`** can NOT run at the same time on one Pi (both need the same sensors)
- You need **two separate Pis** if you want enrollment + attendance simultaneously
- Or: use one Pi for enrollment first, then switch to `server.py` for daily use
- Both files need the same `DEVICE_ID` and `DEVICE_API_KEY` config values
