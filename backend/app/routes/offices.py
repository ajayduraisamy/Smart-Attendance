from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.office import Office
from app.schemas.office import OfficeCreate, OfficeOut
from app.core.auth import require_role


router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)


# Create Office (Admin only)
@router.post("/", response_model=OfficeOut)
def create_office(
    data: OfficeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    existing = db.query(Office).filter(
        Office.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Office already exists"
        )

    office = Office(**data.dict())

    db.add(office)
    db.commit()
    db.refresh(office)

    return office


# List Offices
@router.get("/", response_model=list[OfficeOut])
def list_offices(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    return db.query(Office).all()
