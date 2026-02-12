from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.leave import Leave
from app.schemas.leave import LeaveCreate
from app.core.auth import get_current_user


router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"]
)


# Apply Leave
@router.post("/apply")
def apply_leave(
    data: LeaveCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    leave = Leave(
        emp_id=data.emp_id,
        start_date=data.start_date,
        end_date=data.end_date,
        reason=data.reason
    )

    db.add(leave)
    db.commit()

    return {"message": "Leave Applied"}


# Approve Leave (HR/Admin)
@router.put("/approve/{leave_id}")
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    leave.status = "APPROVED"

    db.commit()

    return {"message": "Leave Approved"}

# Reject Leave (HR/Admin)
@router.put("/reject/{leave_id}")    
def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    leave.status = "REJECTED"

    db.commit()

    return {"message": "Leave Rejected"}        
