from sqlalchemy.orm import Session
from app.models.leave import Leave
from datetime import date


def apply_leave(
    emp_id: str,
    start_date: date,
    end_date: date,
    reason: str,
    db: Session
) -> Leave:
    """Create a new leave request"""
    
    leave = Leave(
        emp_id=emp_id,
        start_date=start_date,
        end_date=end_date,
        reason=reason,
        status="PENDING"
    )
    
    db.add(leave)
    db.commit()
    db.refresh(leave)
    
    return leave


def approve_leave(leave_id: int, db: Session) -> bool:
    """Approve a leave request"""
    
    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()
    
    if not leave:
        return False
    
    leave.status = "APPROVED"
    db.commit()
    
    return True


def reject_leave(leave_id: int, reason: str, db: Session) -> bool:
    """Reject a leave request"""
    
    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()
    
    if not leave:
        return False
    
    leave.status = "REJECTED"
    leave.remarks = reason
    db.commit()
    
    return True


def get_pending_leaves(db: Session) -> list:
    """Get all pending leave requests"""
    
    return db.query(Leave).filter(
        Leave.status == "PENDING"
    ).all()
