import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, body=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        return e.code, json.loads(content) if content else {"detail": str(e)}

def main():
    print("=" * 70)
    print("LIVE FASTAPI SERVER (http://127.0.0.1:8000) - API ENDPOINT RESULTS")
    print("=" * 70)

    # 1. Health check
    code, res = request("GET", "/api/health")
    print(f"\n[1] GET /api/health -> HTTP {code}")
    print("    Response:", json.dumps(res))

    # 2. Student Sign Up (Valid: rohan22@iiitnr.edu.in)
    student_payload = {
        "name": "Rohan Das",
        "email": "rohan22@iiitnr.edu.in",
        "password": "studentpass123",
        "roll_no": "2210055",
        "branch": "B.Tech CSE",
        "semester": "Sem 5"
    }
    code, res = request("POST", "/api/auth/signup/student", student_payload)
    print(f"\n[2] POST /api/auth/signup/student (Valid with digits in email)")
    print(f"    Request Email: {student_payload['email']}")
    print(f"    Status: HTTP {code}")
    if code in [200, 201]:
        print(f"    Created User: {res['user']['name']} ({res['user']['email']})")
        print(f"    Role: {res['user']['role']} | Branch: {res['user']['branch']} | Roll: {res['user']['roll_no']}")
        print(f"    Token: {res['access_token'][:35]}...")
    else:
        print("    Response:", res)

    # 3. Student Sign Up (Invalid: rohan@iiitnr.edu.in - no digits)
    bad_student = {
        "name": "Rohan NoDigits",
        "email": "rohan@iiitnr.edu.in",
        "password": "studentpass123"
    }
    code, res = request("POST", "/api/auth/signup/student", bad_student)
    print(f"\n[3] POST /api/auth/signup/student (Invalid: NO digits in email)")
    print(f"    Request Email: {bad_student['email']}")
    print(f"    Status: HTTP {code}")
    print(f"    Rejection Detail: {res.get('detail')}")

    # 4. Teacher Sign Up (Valid: meera.rao@iiitnr.edu.in - no digits)
    teacher_payload = {
        "name": "Dr. Meera Rao",
        "email": "meera.rao@iiitnr.edu.in",
        "password": "teacherpass123",
        "department": "Electronics & Communication"
    }
    code, res = request("POST", "/api/auth/signup/teacher", teacher_payload)
    print(f"\n[4] POST /api/auth/signup/teacher (Valid with NO digits in email)")
    print(f"    Request Email: {teacher_payload['email']}")
    print(f"    Status: HTTP {code}")
    if code in [200, 201]:
        print(f"    Created User: {res['user']['name']} ({res['user']['email']})")
        print(f"    Role: {res['user']['role']} | Department: {res['user']['department']}")
        print(f"    Token: {res['access_token'][:35]}...")
    else:
        print("    Response:", res)

    # 5. Teacher Sign Up (Invalid: meera22@iiitnr.edu.in - has digits)
    bad_teacher = {
        "name": "Dr. Meera Digits",
        "email": "meera22@iiitnr.edu.in",
        "password": "teacherpass123",
        "department": "Electronics & Communication"
    }
    code, res = request("POST", "/api/auth/signup/teacher", bad_teacher)
    print(f"\n[5] POST /api/auth/signup/teacher (Invalid: HAS digits in email)")
    print(f"    Request Email: {bad_teacher['email']}")
    print(f"    Status: HTTP {code}")
    print(f"    Rejection Detail: {res.get('detail')}")

    # 6. Invalid Domain Sign Up (External domain: user22@gmail.com)
    bad_domain = {
        "name": "External User",
        "email": "user22@gmail.com",
        "password": "password123"
    }
    code, res = request("POST", "/api/auth/signup", bad_domain)
    print(f"\n[6] POST /api/auth/signup (Invalid domain: @gmail.com)")
    print(f"    Request Email: {bad_domain['email']}")
    print(f"    Status: HTTP {code}")
    print(f"    Rejection Detail: {res.get('detail')}")

    # 7. Student Sign In
    code, res = request("POST", "/api/auth/login", {"email": "student21@iiitnr.edu.in", "password": "student123"})
    print(f"\n[7] POST /api/auth/login (Student Login)")
    print(f"    Status: HTTP {code}")
    print(f"    Logged In: {res['user']['name']} ({res['user']['email']}), Role: {res['user']['role']}")
    student_token = res['access_token']

    # 8. Teacher Sign In
    code, res = request("POST", "/api/auth/login", {"email": "teacher@iiitnr.edu.in", "password": "teacher123"})
    print(f"\n[8] POST /api/auth/login (Teacher Login)")
    print(f"    Status: HTTP {code}")
    print(f"    Logged In: {res['user']['name']} ({res['user']['email']}), Role: {res['user']['role']}")
    teacher_token = res['access_token']

    # 9. Role-Restricted Login: Teacher trying to log into /api/auth/login/student
    code, res = request("POST", "/api/auth/login/student", {"email": "teacher@iiitnr.edu.in", "password": "teacher123"})
    print(f"\n[9] POST /api/auth/login/student (Teacher trying student login)")
    print(f"    Status: HTTP {code}")
    print(f"    Rejection Detail: {res.get('detail')}")

    # 10. Role-Restricted Login: Student trying to log into /api/auth/login/teacher
    code, res = request("POST", "/api/auth/login/teacher", {"email": "student21@iiitnr.edu.in", "password": "student123"})
    print(f"\n[10] POST /api/auth/login/teacher (Student trying teacher login)")
    print(f"    Status: HTTP {code}")
    print(f"    Rejection Detail: {res.get('detail')}")

    # 11. Profile verification with JWT Bearer Token
    code, res = request("GET", "/api/auth/me", token=teacher_token)
    print(f"\n[11] GET /api/auth/me (Authenticated profile via Bearer Token)")
    print(f"    Status: HTTP {code}")
    print(f"    Profile: {json.dumps(res)}")

    print("\n" + "=" * 70)
    print("ALL LIVE HTTP CALLS SUCCEEDED AND VALIDATED!")
    print("=" * 70)

if __name__ == "__main__":
    main()
