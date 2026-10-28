# Smart Campus — Integrated Full-Stack Version

This version integrates the Campus Hub React frontend, Smart Campus FastAPI backend, B1 Mart storefront (`B1_Mart_updated(6).html`), and RaipurTransit Smart Mobility system (`index (1).html`) into one cohesive platform.

## Architecture

- **`frontend/`** — React + Vite + Tailwind unified campus dashboard
  - Includes: Campus Hub, Timetable, Quick Bunk, Multi-Subject, GPA Predictor, Campus Feed, **🛒 B1 Mart**, and **🚌 Smart Mobility**.
- **`backend/`** — Python + FastAPI + Uvicorn + SQLAlchemy + SQLite
  - Serves REST APIs (`/api/*`) for auth, notices, events, timetable, mart items, transit locations, bus schedules, and fare calculations.
  - Serves direct, in-place HTML storefronts:
    - `/b1-mart` → Serves `B1_Mart_updated(6).html`
    - `/mobility` → Serves `index (1).html`

---

## How to Run

### 1. Start Backend (FastAPI)
```powershell
cd C:\Users\Lenovo\Desktop\BACKEND\integrated\backend
..\..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend Home**: http://127.0.0.1:8000
- **API Health**: http://127.0.0.1:8000/api/health
- **Swagger Docs**: http://127.0.0.1:8000/docs
- **B1 Mart Page**: http://127.0.0.1:8000/b1-mart
- **Smart Mobility Page**: http://127.0.0.1:8000/mobility

### 2. Start Frontend (React + Vite)
```powershell
cd C:\Users\Lenovo\Desktop\BACKEND\integrated\frontend
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## Unified Features

### 🛒 B1 Mart Integration
- Accessible directly from the **"🛒 B1 Mart"** navigation tab in the unified React frontend.
- Also accessible at `http://localhost:5173/b1-mart` (via Vite proxy) and `http://127.0.0.1:8000/b1-mart` (direct backend).
- Features all 47+ shelf products (Snacks, Biscuits, Chocolates, Beverages, Soft Drinks, Ice Creams), search filtering, cart drawer, and pickup slot selection.
- Backend JSON API available at `/api/mart/`.

### 🚌 Smart Mobility Integration
- Accessible directly from the **"🚌 Smart Mobility"** navigation tab in the unified React frontend.
- Also accessible at `http://localhost:5173/mobility` (via Vite proxy) and `http://127.0.0.1:8000/mobility` (direct backend).
- Features:
  - Interactive Leaflet transit map for Raipur & Nava Raipur.
  - Multi-leg BRTS + shared auto route breakdown with savings calculation.
  - Live Rapido fare estimator (Bike, Auto, Cab) with direct booking deep-link.
  - Bus schedules and frequency timelines for major stops (IIIT-NR, HNLU, Zora, Airport, Telibandha, etc.).
  - Spot directory for universities, hospitals, malls, and transit terminals.
- Backend JSON API available at `/api/transit/locations`, `/api/transit/schedules`, and `/api/transit/fare`.

---

## Authentication Rules & Demo Accounts
- **Domain**: All user emails must end with `@iiitnr.edu.in`.
- **Students**: The local part before `@` **must contain at least one digit** (e.g., `student21@iiitnr.edu.in`).
- **Teachers**: The local part before `@` **must contain NO digits** (e.g., `teacher@iiitnr.edu.in`).

### Demo Accounts
- **Student**: `student21@iiitnr.edu.in` / `student123`
- **Teacher**: `teacher@iiitnr.edu.in` / `teacher123`
