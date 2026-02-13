from fastapi import FastAPI

from app.database import engine

# Models
from app.models import user, employee, device, office, attendance, leave, holiday

# Routes
from app.routes import users, employees, biometrics, devices, offices, reports, leaves


from app.routes import attendance as attendance_router


app = FastAPI(
    title="Smart Attendance System",
    version="1.0.0"
)
from fastapi.middleware.cors import CORSMiddleware




origins = [
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
user.Base.metadata.create_all(bind=engine)
employee.Base.metadata.create_all(bind=engine)
device.Base.metadata.create_all(bind=engine)
office.Base.metadata.create_all(bind=engine)
attendance.Base.metadata.create_all(bind=engine)
leave.Base.metadata.create_all(bind=engine)
holiday.Base.metadata.create_all(bind=engine)



# Register routes
app.include_router(users.router)
app.include_router(employees.router)
app.include_router(biometrics.router)
app.include_router(devices.router)
app.include_router(offices.router)
app.include_router(attendance_router.router)
app.include_router(reports.router)
app.include_router(leaves.router)


@app.get("/")
def root():
    return {"message": "Smart Attendance Backend is Running 🚀"}
