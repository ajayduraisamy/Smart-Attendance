# 📊 Seeded Test Data

**Database**: attendance_db  
**Seeded On**: February 12, 2026  
**Data Status**: ✅ Ready for Testing

---

## 🏢 Offices (3 Created)

| ID | Name | Location | Status |
|---|------|----------|--------|
| 1 | Headquarters | New York, USA | Active |
| 2 | Branch Office | San Francisco, USA | Active |
| 3 | Development Center | Remote, USA | Active |

---

## 👥 Users (5 Created)

### 1. Admin User
```
ID: 1
Name: Admin User
Email: admin@attendance.com
Password: admin@123 (Bcrypt hashed)
Role: admin
Status: Active
Created: 2026-02-12
```

**Admin Access**:
- Dashboard
- Employees Management
- Devices Management
- Offices Management
- Users Management
- Reports & Analytics
- Leave Management
- Settings

---

### 2. HR User
```
ID: 2
Name: HR Manager
Email: hr@attendance.com
Password: hr@123 (Bcrypt hashed)
Role: hr
Status: Active
Created: 2026-02-12
```

**HR Access**:
- Dashboard
- Attendance Tracking
- Employees Management
- Leave Management & Approval
- Reports & Analytics
- Settings

---

### 3. Employee 1 - John Doe
```
ID: 3
Name: John Doe
Email: john@attendance.com
Password: emp@123 (Bcrypt hashed)
Role: employee
Status: Active
Created: 2026-02-12

Employee Record:
- Emp ID: EMP001
- Phone: 0000000000
- Office: Headquarters (ID: 1)
- Status: Active
```

**Employee Access**:
- Dashboard (Own stats only)
- View Own Attendance
- Apply for Leave
- My Profile

---

### 4. Employee 2 - Jane Smith
```
ID: 4
Name: Jane Smith
Email: jane@attendance.com
Password: emp@123 (Bcrypt hashed)
Role: employee
Status: Active
Created: 2026-02-12

Employee Record:
- Emp ID: EMP002
- Phone: 0000000000
- Office: Headquarters (ID: 1)
- Status: Active
```

---

### 5. Employee 3 - Mike Johnson
```
ID: 5
Name: Mike Johnson
Email: mike@attendance.com
Password: emp@123 (Bcrypt hashed)
Role: employee
Status: Active
Created: 2026-02-12

Employee Record:
- Emp ID: EMP003
- Phone: 0000000000
- Office: Headquarters (ID: 1)
- Status: Active
```

---

## 🔐 Authentication Details

### Password Hashing
- **Algorithm**: Bcrypt
- **Cost Factor**: 12
- **Hash Example**: `$2b$12$JrumbljfQxHzbE8suXS5puaXeMVEBinyz7eX5VZiQVnkryOJA1m2y`

### JWT Token
- **Algorithm**: HS256
- **Expiry**: Configured in backend
- **Storage**: Browser localStorage (key: `token`)
- **Auto-Logout**: 401 responses trigger automatic logout

---

## 📝 SQL Queries (For Reference)

### View All Users
```sql
SELECT id, name, email, role, is_active, created_at FROM users;
```

### Expected Output
```
 id |   name    |        email         | role  | is_active |         created_at
----+-----------+----------------------+-------+-----------+-----------------------------
  1 | Admin User| admin@attendance.com | admin | t         | 2026-02-12 13:10:39.625
  2 | HR Manager| hr@attendance.com    | hr    | t         | 2026-02-12 13:10:39.883
  3 | John Doe  | john@attendance.com  | employee| t       | 2026-02-12 13:10:40.789
  4 | Jane Smith| jane@attendance.com  | employee| t       | 2026-02-12 13:10:40.789
  5 | Mike Johnson| mike@attendance.com| employee| t       | 2026-02-12 13:10:40.789
```

### View All Offices
```sql
SELECT id, name, location, status FROM offices;
```

### Expected Output
```
 id |        name         |       location       | status
----+---------------------+----------------------+--------
  1 | Headquarters        | New York, USA        | t
  2 | Branch Office       | San Francisco, USA   | t
  3 | Development Center  | Remote, USA          | t
```

---

## 🧪 Testing Data Verification

After seeding, verify data is in database:

### Using psql Command Line
```bash
psql -U postgres -d attendance_db -c "SELECT COUNT(*) as user_count FROM users;"
psql -U postgres -d attendance_db -c "SELECT COUNT(*) as office_count FROM offices;"
```

### Using Python
```python
from app.database import SessionLocal
from app.models.user import User
from app.models.office import Office

db = SessionLocal()

# Count users
user_count = db.query(User).count()
print(f"Total Users: {user_count}")  # Should be 5

# Count offices
office_count = db.query(Office).count()
print(f"Total Offices: {office_count}")  # Should be 3

# List all users
users = db.query(User).all()
for user in users:
    print(f"{user.name} ({user.email}) - {user.role}")
```

---

## 🔄 Data Flow on Login

1. User enters email and password
2. Frontend sends POST to `/users/login`
3. Backend verifies credentials using Bcrypt
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend stores user data (name, email, role)
7. User is redirected to `/dashboard`
8. All subsequent requests include JWT token in header

---

## 📋 Database Schema Overview

### users table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,  -- 'admin', 'hr', 'employee'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### offices table
```sql
CREATE TABLE offices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    location VARCHAR(200),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### employees table
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    gender VARCHAR(10),
    blood_group VARCHAR(10),
    date_of_birth DATE,
    office_id INTEGER REFERENCES offices(id),
    is_active BOOLEAN DEFAULT true
);
```

---

## ✅ Ready to Test!

All data is seeded and ready for testing. Here's what you can test:

1. **Login with 3 different roles** - See menu changes
2. **CRUD Operations** - Add/Edit/Delete employees
3. **Role-Based Access** - Try accessing restricted pages
4. **Token Management** - Logout and verify token removal
5. **API Integration** - All API calls will work with seeded data

---

**Data Seed File**: `backend/seed.py`  
**Last Run**: February 12, 2026  
**Status**: ✅ Successfully Seeded
