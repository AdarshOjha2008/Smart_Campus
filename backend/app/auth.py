from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import os
import re
from typing import Optional, Tuple
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

SECRET_KEY = "dev-smart-campus-secret-change-before-deployment"
ALGORITHM = "HS256"
ALLOWED_EMAIL_DOMAIN = "iiitnr.edu.in"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def validate_iiitnr_email(email: str, expected_role: Optional[str] = None) -> Tuple[str, str]:
    """
    Validates IIIT-NR email address:
    - Domain must be exactly @iiitnr.edu.in
    - Students' email frame (local part before @) must contain at least one digit
    - Teachers' email frame (local part before @) must contain NO digits
    - If expected_role is provided, verifies that the email frame matches that role
    
    Returns:
        tuple (clean_email, role) where role is "student" or "teacher".
    Raises:
        HTTPException with status 400 on validation failure.
    """
    if not email or not isinstance(email, str):
        raise HTTPException(status_code=400, detail="Email is required.")

    clean_email = email.strip().lower()

    if clean_email.count("@") != 1:
        raise HTTPException(status_code=400, detail="Invalid email format. Must contain exactly one '@'.")

    frame, domain = clean_email.split("@", 1)
    frame = frame.strip()
    domain = domain.strip()

    if not frame:
        raise HTTPException(status_code=400, detail="Email username frame cannot be empty.")

    if not re.match(r"^[a-z0-9._-]+$", frame):
        raise HTTPException(
            status_code=400,
            detail="Email username frame contains invalid characters. Use only letters, digits, dots, hyphens, and underscores."
        )

    if domain != ALLOWED_EMAIL_DOMAIN:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid email domain '@{domain}'. Only '@{ALLOWED_EMAIL_DOMAIN}' is permitted."
        )

    has_digits = any(char.isdigit() for char in frame)
    detected_role = "student" if has_digits else "teacher"

    if expected_role:
        norm_role = expected_role.strip().lower()
        if norm_role in ["faculty", "prof", "professor"]:
            norm_role = "teacher"

        if norm_role not in ["student", "teacher"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid role '{expected_role}'. Allowed roles are 'student' and 'teacher'."
            )

        if norm_role == "student" and not has_digits:
            raise HTTPException(
                status_code=400,
                detail="Student email frame must contain digits (e.g., student21@iiitnr.edu.in or 21100@iiitnr.edu.in)."
            )

        if norm_role == "teacher" and has_digits:
            raise HTTPException(
                status_code=400,
                detail="Teacher email frame must not contain any digits (e.g., teacher@iiitnr.edu.in or faculty@iiitnr.edu.in)."
            )

        return clean_email, norm_role

    return clean_email, detected_role


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120000)
    return salt.hex() + "$" + digest.hex()


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, digest_hex = stored.split("$", 1)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt_hex), 120000)
        return hmac.compare_digest(digest.hex(), digest_hex)
    except Exception:
        return False


def create_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = db.get(User, int(payload["sub"]))
    except Exception:
        user = None
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired login")
    return user


def admin_user(user: User = Depends(current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def student_user(user: User = Depends(current_user)):
    if user.role != "student":
        raise HTTPException(status_code=403, detail="Student access required")
    return user


def teacher_user(user: User = Depends(current_user)):
    if user.role not in ["teacher", "faculty"]:
        raise HTTPException(status_code=403, detail="Teacher access required")
    return user
