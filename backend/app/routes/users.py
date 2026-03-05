from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, require_role, get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


# =====================================================
# REGISTER USER
# =====================================================
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
        password_hash=hash_password(data.password),
        role=data.role,
        is_active=True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# =====================================================
# LOGIN
# =====================================================
@router.post("/login")
def login_user(
    data: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={
            "user_id": user.id,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }


# =====================================================
# CURRENT USER PROFILE
# =====================================================
@router.get("/me", response_model=UserOut)
def my_profile(
    user: User = Depends(get_current_user)
):
    return user


# =====================================================
# ADMIN ONLY TEST
# =====================================================
@router.get("/admin-only")
def admin_only(
    user: User = Depends(require_role("admin"))
):
    return {"message": "Welcome Admin"}