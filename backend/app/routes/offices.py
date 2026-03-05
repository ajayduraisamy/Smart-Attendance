from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.office import OfficeCreate, OfficeOut, OfficeUpdate
from app.core.auth import require_role
from app.services.office import (
    create_office,
    get_active_offices,
    update_office,
    deactivate_office
)


router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)


# =====================================================
# CREATE OFFICE (ADMIN ONLY)
# =====================================================
@router.post("/", response_model=OfficeOut)
def create_office_route(
    data: OfficeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return create_office(
        name=data.name,
        location=data.location,
        db=db
    )


# =====================================================
# LIST ACTIVE OFFICES
# =====================================================
@router.get("/", response_model=list[OfficeOut])
def list_offices(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return get_active_offices(db)


# =====================================================
# UPDATE OFFICE
# =====================================================
@router.put("/{office_id}", response_model=OfficeOut)
def update_office_route(
    office_id: int,
    data: OfficeUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return update_office(
        office_id=office_id,
        name=data.name,
        location=data.location,
        status=data.status,
        db=db
    )


# =====================================================
# SOFT DELETE
# =====================================================
@router.delete("/{office_id}")
def delete_office_route(
    office_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    deactivate_office(office_id, db)
    return {"message": "Office deactivated successfully"}