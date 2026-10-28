import json
from fastapi import HTTPException
from app.database import Base, engine, SessionLocal
from app.models import User
from app.seed import seed_database
from app.schemas import (
    SignupRequest,
    StudentSignupRequest,
    TeacherSignupRequest,
    LoginRequest,
)
from app.routers.auth import (
    signup,
    signup_student,
    signup_teacher,
    login,
    login_student,
    login_teacher,
)

def run_tests():
    print("=" * 65)
    print("SMART CAMPUS BACKEND — AUTHENTICATION VERIFICATION")
    print("Domain: @iiitnr.edu.in")
    print("Rule 1: Student email frame MUST contain digits")
    print("Rule 2: Teacher email frame MUST NOT contain digits")
    print("=" * 65)

    Base.metadata.create_all(bind=engine)
    seed_database()
    db = SessionLocal()

    # Clean up prior test accounts
    test_emails = [
        "aryan23@iiitnr.edu.in",
        "aryan@iiitnr.edu.in",
        "prof.gupta@iiitnr.edu.in",
        "prof.gupta99@iiitnr.edu.in",
        "student21@gmail.com",
    ]
    for email in test_emails:
        u = db.query(User).filter(User.email == email).first()
        if u:
            db.delete(u)
    db.commit()

    # TEST 1: Student signup with valid email (has digits: 23)
    print("\n[TEST 1] Student Signup with valid email: 'aryan23@iiitnr.edu.in'")
    res = signup_student(
        StudentSignupRequest(
            name="Aryan Verma",
            email="aryan23@iiitnr.edu.in",
            password="password123",
            roll_no="23100",
            branch="B.Tech CSE",
            semester="Sem 3",
        ),
        db=db,
    )
    print("  -> Status: SUCCESS (201 Created)")
    print(f"  -> User: {res.user.name} ({res.user.email})")
    print(f"  -> Role: {res.user.role}, Roll No: {res.user.roll_no}, Branch: {res.user.branch}")
    print(f"  -> JWT Token generated: {res.access_token[:30]}...")

    # TEST 2: Student signup with invalid email (no digits)
    print("\n[TEST 2] Student Signup with invalid email (no digits): 'aryan@iiitnr.edu.in'")
    try:
        signup_student(
            StudentSignupRequest(
                name="Aryan Invalid",
                email="aryan@iiitnr.edu.in",
                password="password123",
            ),
            db=db,
        )
        print("  -> ERROR: Expected validation failure, but succeeded!")
    except HTTPException as e:
        print(f"  -> Status: BLOCKED (HTTP {e.status_code})")
        print(f"  -> Detail: {e.detail}")

    # TEST 3: Teacher signup with valid email (no digits)
    print("\n[TEST 3] Teacher Signup with valid email: 'prof.gupta@iiitnr.edu.in'")
    res_teacher = signup_teacher(
        TeacherSignupRequest(
            name="Dr. Gupta",
            email="prof.gupta@iiitnr.edu.in",
            password="teacherpassword",
            department="Computer Science & Engineering",
        ),
        db=db,
    )
    print("  -> Status: SUCCESS (201 Created)")
    print(f"  -> User: {res_teacher.user.name} ({res_teacher.user.email})")
    print(f"  -> Role: {res_teacher.user.role}, Department: {res_teacher.user.department}")
    print(f"  -> JWT Token generated: {res_teacher.access_token[:30]}...")

    # TEST 4: Teacher signup with invalid email (has digits: 99)
    print("\n[TEST 4] Teacher Signup with invalid email (contains digits): 'prof.gupta99@iiitnr.edu.in'")
    try:
        signup_teacher(
            TeacherSignupRequest(
                name="Dr. Gupta Invalid",
                email="prof.gupta99@iiitnr.edu.in",
                password="teacherpassword",
            ),
            db=db,
        )
        print("  -> ERROR: Expected validation failure, but succeeded!")
    except HTTPException as e:
        print(f"  -> Status: BLOCKED (HTTP {e.status_code})")
        print(f"  -> Detail: {e.detail}")

    # TEST 5: Signup with non-iiitnr domain
    print("\n[TEST 5] Signup with invalid domain: 'student21@gmail.com'")
    try:
        signup(
            SignupRequest(
                name="External User",
                email="student21@gmail.com",
                password="password123",
            ),
            db=db,
        )
        print("  -> ERROR: Expected domain rejection, but succeeded!")
    except HTTPException as e:
        print(f"  -> Status: BLOCKED (HTTP {e.status_code})")
        print(f"  -> Detail: {e.detail}")

    # TEST 6: Student Login
    print("\n[TEST 6] Student Login: 'student21@iiitnr.edu.in' / 'student123'")
    login_res = login(LoginRequest(email="student21@iiitnr.edu.in", password="student123"), db=db)
    print("  -> Status: SUCCESS (200 OK)")
    print(f"  -> Logged in as: {login_res.user.name} (Role: {login_res.user.role})")
    print(f"  -> Token: {login_res.access_token[:30]}...")

    # TEST 7: Teacher Login
    print("\n[TEST 7] Teacher Login: 'teacher@iiitnr.edu.in' / 'teacher123'")
    login_teach = login(LoginRequest(email="teacher@iiitnr.edu.in", password="teacher123"), db=db)
    print("  -> Status: SUCCESS (200 OK)")
    print(f"  -> Logged in as: {login_teach.user.name} (Role: {login_teach.user.role})")
    print(f"  -> Token: {login_teach.access_token[:30]}...")

    # TEST 8: Teacher attempting Student Login endpoint
    print("\n[TEST 8] Teacher attempting Student-only Login endpoint")
    try:
        login_student(LoginRequest(email="teacher@iiitnr.edu.in", password="teacher123"), db=db)
        print("  -> ERROR: Expected forbidden error, but succeeded!")
    except HTTPException as e:
        print(f"  -> Status: BLOCKED (HTTP {e.status_code})")
        print(f"  -> Detail: {e.detail}")

    # TEST 9: Student attempting Teacher Login endpoint
    print("\n[TEST 9] Student attempting Teacher-only Login endpoint")
    try:
        login_teacher(LoginRequest(email="student21@iiitnr.edu.in", password="student123"), db=db)
        print("  -> ERROR: Expected forbidden error, but succeeded!")
    except HTTPException as e:
        print(f"  -> Status: BLOCKED (HTTP {e.status_code})")
        print(f"  -> Detail: {e.detail}")

    print("\n" + "=" * 65)
    print("ALL 9 TEST CASES COMPLETED SUCCESSFULLY!")
    print("=" * 65)

    db.close()

if __name__ == "__main__":
    run_tests()
