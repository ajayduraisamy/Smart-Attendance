from sqlalchemy.orm import Session
from app.models.office import Office


def create_office(name: str, location: str, db: Session) -> Office:
    """Create a new office"""
    
    office = Office(
        name=name,
        location=location
    )
    
    db.add(office)
    db.commit()
    db.refresh(office)
    
    return office


def get_all_offices(db: Session) -> list:
    """Get all offices"""
    
    return db.query(Office).all()


def get_office_by_id(office_id: int, db: Session) -> Office:
    """Get office by ID"""
    
    return db.query(Office).filter(
        Office.id == office_id
    ).first()
