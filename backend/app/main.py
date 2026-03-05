import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine

# Models
from app.models import attendance, device, employee, leave, office, user

# Routes
from app.routes import biometrics, devices, employees, leaves, offices, reports, users
from app.routes import attendance as attendance_router


app = FastAPI(
    title="Smart Attendance System",
    version="1.0.0",
)

raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Useful for Vite dev ports like 5173/5174 and any alternate local port.
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.exception_handler(SQLAlchemyError)
# def db_exception_handler(_: Request, exc: SQLAlchemyError):
#     return JSONResponse(
#         status_code=503,
#         content={"detail": "Database error", "error": exc.__class__.__name__},
#     )


@app.exception_handler(Exception)
def unhandled_exception_handler(_: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": exc.__class__.__name__},
    )


# Create tables
user.Base.metadata.create_all(bind=engine)
employee.Base.metadata.create_all(bind=engine)
device.Base.metadata.create_all(bind=engine)
office.Base.metadata.create_all(bind=engine)
attendance.Base.metadata.create_all(bind=engine)
leave.Base.metadata.create_all(bind=engine)



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
