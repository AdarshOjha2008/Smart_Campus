from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import (
    LoginRequest,
    SignupRequest,
    StudentSignupRequest,
    TeacherSignupRequest,
    UserOut,
    AuthResponse,
    ProfileUpdate,
)
from ..auth import (
    verify_password,
    hash_password,
    create_token,
    current_user,
    validate_iiitnr_email,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _register_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: Optional[str] = None,
    roll_no: str = "",
    branch: str = "",
    department: str = "",
    semester: str = "",
) -> AuthResponse:
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty.")
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    clean_email, assigned_role = validate_iiitnr_email(email, expected_role=role)

    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email is already registered.")

    if assigned_role == "teacher":
        final_branch = department.strip() or branch.strip() or "Computer Science & Engineering"
        final_roll_no = ""
        final_semester = ""
    else:
        final_branch = branch.strip() or "B.Tech CSE"
        final_roll_no = roll_no.strip()
        final_semester = semester.strip() or "Sem 1"

    new_user = User(
        name=name.strip(),
        email=clean_email,
        password_hash=hash_password(password),
        role=assigned_role,
        roll_no=final_roll_no,
        branch=final_branch,
        semester=final_semester,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token(new_user)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(new_user),
    )


def _login_user(
    db: Session,
    email: str,
    password: str,
    required_role: Optional[str] = None,
) -> AuthResponse:
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    clean_email = email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    if required_role:
        norm_required = "teacher" if required_role.lower() in ["teacher", "faculty"] else required_role.lower()
        norm_user_role = "teacher" if user.role.lower() in ["teacher", "faculty"] else user.role.lower()
        if norm_user_role != norm_required:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied: This account is registered as '{user.role}', not '{required_role}'."
            )

    token = create_token(user)
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


# --- SIGN UP / REGISTER ENDPOINTS ---

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    """
    Sign up for students and teachers with @iiitnr.edu.in domain validation:
    - Students' email frame must contain digits.
    - Teachers' email frame must contain NO digits.
    - If role is not provided, it is automatically detected based on the email frame.
    """
    return _register_user(
        db=db,
        name=data.name,
        email=data.email,
        password=data.password,
        role=data.role,
        roll_no=data.roll_no or "",
        branch=data.branch or "",
        department=data.department or "",
        semester=data.semester or "",
    )


@router.post("/signup/student", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup_student(data: StudentSignupRequest, db: Session = Depends(get_db)):
    """Dedicated student sign up: requires @iiitnr.edu.in with digits in the username frame."""
    return _register_user(
        db=db,
        name=data.name,
        email=data.email,
        password=data.password,
        role="student",
        roll_no=data.roll_no or "",
        branch=data.branch or "B.Tech CSE",
        semester=data.semester or "Sem 1",
    )


@router.post("/signup/teacher", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup_teacher(data: TeacherSignupRequest, db: Session = Depends(get_db)):
    """Dedicated teacher sign up: requires @iiitnr.edu.in with NO digits in the username frame."""
    return _register_user(
        db=db,
        name=data.name,
        email=data.email,
        password=data.password,
        role="teacher",
        department=data.department or "Computer Science & Engineering",
    )


# --- SIGN IN / LOGIN ENDPOINTS ---

@router.post("/login", response_model=AuthResponse)
@router.post("/signin", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Unified login for students and teachers."""
    return _login_user(db=db, email=data.email, password=data.password, required_role=data.role)


@router.post("/login/student", response_model=AuthResponse)
@router.post("/signin/student", response_model=AuthResponse)
def login_student(data: LoginRequest, db: Session = Depends(get_db)):
    """Dedicated login endpoint for students."""
    return _login_user(db=db, email=data.email, password=data.password, required_role="student")


@router.post("/login/teacher", response_model=AuthResponse)
@router.post("/signin/teacher", response_model=AuthResponse)
def login_teacher(data: LoginRequest, db: Session = Depends(get_db)):
    """Dedicated login endpoint for teachers."""
    return _login_user(db=db, email=data.email, password=data.password, required_role="teacher")


# --- PROFILE ENDPOINTS ---

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user


@router.put("/profile", response_model=UserOut)
def update_profile(data: ProfileUpdate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    if data.name is not None and data.name.strip():
        user.name = data.name.strip()
    if data.roll_no is not None:
        user.roll_no = data.roll_no.strip()
    if data.branch is not None or data.department is not None:
        user.branch = (data.department or data.branch or "").strip()
    if data.semester is not None:
        user.semester = data.semester.strip()

    if data.email is not None and data.email.strip().lower() != user.email:
        clean_email, _ = validate_iiitnr_email(data.email, expected_role=user.role)
        existing = db.query(User).filter(User.email == clean_email, User.id != user.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use.")
        user.email = clean_email

    db.commit()
    db.refresh(user)
    return user
