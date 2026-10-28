"""
main.py – Smart Campus FastAPI backend.

Serves three original HTML pages exactly as-is via dedicated routes:
  GET /b1-mart          → B1_Mart_updated(6).html  (the B1 Mart storefront)
  GET /mobility         → index (1).html            (Raipur Transit Rapido+ v2)

All data APIs are available under /api/* as before.
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from .database import Base, engine
from .seed import seed_database
from .routers import events, complaints, mart, mobility, academics, auth, admin, notices
from .routers import smart_mobility
from fastapi.middleware.cors import CORSMiddleware

# ── Paths to the original HTML files (kept in-place, never moved) ─────────────
_BACKEND_ROOT = Path("C:/Users/Lenovo/Desktop/BACKEND")
_B1_MART_HTML   = _BACKEND_ROOT / "B1_Mart_updated(6).html"
_MOBILITY_HTML  = _BACKEND_ROOT / "index (1).html"

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Campus API",
    version="3.0.0",
    description=(
        "Backend for the IIIT-NR Smart Campus hub. "
        "Serves B1 Mart and Smart Mobility pages directly as HTML, "
        "plus JSON APIs for all campus data."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-campus-smxf.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── DB + seed ─────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)
seed_database()

# ── API routers ───────────────────────────────────────────────────────────────
for router in [
    events.router,
    complaints.router,
    mart.router,
    mobility.router,
    academics.router,
    auth.router,
    admin.router,
    notices.router,
    smart_mobility.router,
]:
    app.include_router(router)


# ── HTML page routes (serve original files exactly as they are) ───────────────
@app.get("/b1-mart", response_class=FileResponse, include_in_schema=False)
def serve_b1_mart():
    """Serve the B1 Mart storefront HTML page (B1_Mart_updated(6).html)."""
    return FileResponse(
        path=str(_B1_MART_HTML),
        media_type="text/html",
        filename=None,          # keep it inline, no download
    )


@app.get("/mobility", response_class=FileResponse, include_in_schema=False)
def serve_mobility():
    """Serve the Raipur Transit Smart Mobility HTML page (index (1).html)."""
    return FileResponse(
        path=str(_MOBILITY_HTML),
        media_type="text/html",
        filename=None,
    )


# ── Root Landing Page ──────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def index():
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Campus Backend API</title>
  <style>
    body {
      background: #030704;
      color: #e2e8f0;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #051209;
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 24px;
      padding: 36px;
      max-width: 540px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(34,197,94,0.15);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.4);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      font-family: monospace;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80;
    }
    h1 {
      margin: 16px 0 8px;
      font-size: 26px;
      font-weight: 800;
      color: #fff;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      margin: 0 0 24px;
      line-height: 1.5;
    }
    .links {
      display: grid;
      gap: 10px;
    }
    a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #020703;
      border: 1px solid rgba(34, 197, 94, 0.25);
      color: #e2e8f0;
      text-decoration: none;
      padding: 14px 18px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    a:hover {
      border-color: #4ade80;
      background: #081a0e;
      transform: translateY(-1px);
    }
    a.primary {
      background: linear-gradient(135deg, #10b981, #22c55e);
      color: #000;
      font-weight: 800;
      border: 0;
      box-shadow: 0 0 20px rgba(34,197,94,0.35);
    }
    a.primary:hover {
      filter: brightness(1.1);
    }
    .arrow {
      color: #4ade80;
    }
    a.primary .arrow {
      color: #000;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> BACKEND ONLINE • PORT 8000</div>
    <h1>Smart Campus FastAPI</h1>
    <p>The backend server is running and healthy. You can explore the interactive API docs or launch the React frontend.</p>
    <div class="links">
      <a href="http://localhost:5173" class="primary">
        <span>🚀 Open Frontend Application</span>
        <span class="arrow">↗</span>
      </a>
      <a href="/docs">
        <span>📘 Swagger API Documentation</span>
        <span class="arrow">/docs ↗</span>
      </a>
      <a href="/b1-mart">
        <span>🛒 B1 Mart Storefront</span>
        <span class="arrow">/b1-mart ↗</span>
      </a>
      <a href="/mobility">
        <span>🚌 Raipur Transit Smart Mobility</span>
        <span class="arrow">/mobility ↗</span>
      </a>
      <a href="/api/health">
        <span>🩺 Health Check JSON</span>
        <span class="arrow">/api/health ↗</span>
      </a>
    </div>
  </div>
</body>
</html>"""


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {
        "status": "online",
        "project": "Smart Campus",
        "pages": {
            "b1_mart": "http://127.0.0.1:8000/b1-mart",
            "mobility": "http://127.0.0.1:8000/mobility",
        },
        "api_docs": "http://127.0.0.1:8000/docs",
        "features": [
            "B1 Mart (HTML page + /api/mart/* JSON API)",
            "Smart Mobility (HTML page + /api/transit/* JSON API)",
            "Auth, Events, Notices, Complaints",
        ],
    }
