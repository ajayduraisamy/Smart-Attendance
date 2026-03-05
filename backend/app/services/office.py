from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.office import Office


def create_office(name: str, location: str | None, db: Session) -> Office:

    existing = db.query(Office).filter(
        Office.name == name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Office already exists"
        )

    office = Office(
        name=name,
        location=location
    )

    db.add(office)
    db.commit()
    db.refresh(office)

    return office


def get_active_offices(db: Session):
    return db.query(Office).filter(
        Office.status == True
    ).all()


def get_office_by_id(office_id: int, db: Session):
    return db.query(Office).filter(
        Office.id == office_id
    ).first()


def update_office(
    office_id: int,
    name: str | None,
    location: str | None,
    status: bool | None,
    db: Session
):

    office = get_office_by_id(office_id, db)

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    # Prevent duplicate name
    if name and name != office.name:
        existing = db.query(Office).filter(
            Office.name == name
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Office name already exists"
            )

        office.name = name

    if location is not None:
        office.location = location

    if status is not None:
        office.status = status

    db.commit()
    db.refresh(office)

    return office


def deactivate_office(office_id: int, db: Session):

    office = get_office_by_id(office_id, db)

    if not office:
        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )

    office.status = False
    db.commit()

    return office