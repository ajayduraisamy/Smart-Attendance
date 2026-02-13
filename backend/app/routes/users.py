from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, require_role, get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


# Register Admin / HR
@router.post("/register", response_model=UserOut)
def register_user(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# Login
@router.post("/login")
def login_user(
    data: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "token_type": "bearer"
    }


# Logged user info
@router.get("/me")
def my_profile(
    user=Depends(get_current_user)
):
    return user


# Admin only test
@router.get("/admin-only")
def admin_only(
    user=Depends(require_role("admin"))
):
    return {"message": "Welcome Admin"}
