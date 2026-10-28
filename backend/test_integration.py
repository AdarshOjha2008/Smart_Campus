"""
test_integration.py – Verification script for integrated backend & frontend endpoints.
Tests:
  1. Health check & feature flags
  2. B1 Mart HTML direct page serving (/b1-mart)
  3. Smart Mobility HTML direct page serving (/mobility)
  4. B1 Mart JSON API (/api/mart/)
  5. Smart Mobility JSON API (/api/transit/locations, /api/transit/schedules, /api/transit/fare)
  6. Authentication flow (Student with digits, Teacher without digits)
"""
import os
from fastapi import HTTPException
from app.database import Base, engine, SessionLocal
from app.seed import seed_database
from app.main import serve_b1_mart, serve_mobility, health
from app.routers import mart, smart_mobility
from app.schemas import LoginRequest, StudentSignupRequest, TeacherSignupRequest, FareRequest
from app.routers.auth import login, signup_student, signup_teacher

def run_tests():
    print("=" * 70)
    print("INTEGRATED BACKEND & FRONTEND VERIFICATION SUITE")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    seed_database()
    db = SessionLocal()

    # 1. Health check
    print("\n[TEST 1] API Health Endpoint")
    h = health()
    print(f"  -> Status: {h.get('status')}")
    print(f"  -> Pages: {h.get('pages')}")
    assert h.get("status") == "online"
    assert "b1_mart" in h.get("pages")
    assert "mobility" in h.get("pages")
    print("  -> PASSED")

    # 2. B1 Mart HTML direct page serving
    print("\n[TEST 2] Serve B1 Mart Storefront HTML (/b1-mart)")
    mart_response = serve_b1_mart()
    assert os.path.exists(mart_response.path), f"File not found: {mart_response.path}"
    with open(mart_response.path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "B1 Mart" in content or "B1 <span>Mart</span>" in content
    assert "pickup" in content.lower()
    print(f"  -> File: {mart_response.path} ({len(content)} chars)")
    print("  -> PASSED: B1 Mart HTML successfully served in-place")

    # 3. Smart Mobility HTML direct page serving
    print("\n[TEST 3] Serve Smart Mobility HTML (/mobility)")
    mobility_response = serve_mobility()
    assert os.path.exists(mobility_response.path), f"File not found: {mobility_response.path}"
    with open(mobility_response.path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "RaipurTransit" in content
    assert "Rapido" in content
    assert "Leaflet" in content or "leaflet" in content
    print(f"  -> File: {mobility_response.path} ({len(content)} chars)")
    print("  -> PASSED: Smart Mobility (index 1) HTML successfully served in-place")

    # 4. B1 Mart JSON API
    print("\n[TEST 4] B1 Mart Products API (/api/mart/)")
    items = mart.list_items(category=None, q=None, in_stock=None, db=db)
    print(f"  -> Total products in database: {len(items)}")
    assert len(items) >= 40, f"Expected at least 40 products, got {len(items)}"
    sample = items[0]
    print(f"  -> Sample: {sample.name} | Category: {sample.category} | Price: Rs.{sample.price} | Stock: {sample.stock}")
    print("  -> PASSED")

    # 5. Smart Mobility JSON API
    print("\n[TEST 5] Smart Mobility Locations & Fare Calculation API")
    locs = smart_mobility.list_locations(category=None, db=db)
    print(f"  -> Transit locations in database: {len(locs)}")
    assert len(locs) >= 10, f"Expected at least 10 locations, got {len(locs)}"

    schedules = smart_mobility.list_schedules(stop_id="iiitnr", db=db)
    print(f"  -> Bus schedules for IIIT-NR stop: {len(schedules)}")
    assert len(schedules) >= 1

    fare_calc = smart_mobility.calculate_fare(FareRequest(origin_id="iiitnr", dest_id="airport"), db=db)
    print(f"  -> Fare Calc IIIT-NR -> Airport: Distance {fare_calc['distance_km']} km, Combo Fare Rs.{fare_calc['combo']['fare']}")
    assert fare_calc["distance_km"] > 0
    print("  -> PASSED")

    # 6. Authentication tests
    print("\n[TEST 6] Authentication (Domain & Role Enforcement)")
    # Student login
    st_login = login(LoginRequest(email="student21@iiitnr.edu.in", password="student123"), db=db)
    print(f"  -> Student Login: Success for {st_login.user.name} (Role: {st_login.user.role})")
    assert st_login.user.role == "student"

    # Teacher login
    tc_login = login(LoginRequest(email="teacher@iiitnr.edu.in", password="teacher123"), db=db)
    print(f"  -> Teacher Login: Success for {tc_login.user.name} (Role: {tc_login.user.role})")
    assert tc_login.user.role == "teacher"
    print("  -> PASSED")

    print("\n" + "=" * 70)
    print("ALL 6 INTEGRATION TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
