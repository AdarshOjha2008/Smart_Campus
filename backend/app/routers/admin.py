from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Complaint, Event, MartItem, Notice, User
from ..auth import admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/summary")
def summary(db: Session = Depends(get_db), user=Depends(admin_user)):
    return {"users": db.query(User).count(), "events": db.query(Event).count(), "complaints": db.query(Complaint).count(), "mart_items": db.query(MartItem).count(), "notices": db.query(Notice).count()}

@router.patch("/complaints/{complaint_id}/status")
def update_status(complaint_id: int, status: str, db: Session = Depends(get_db), user=Depends(admin_user)):
    item = db.get(Complaint, complaint_id)
    if not item: raise HTTPException(status_code=404, detail="Complaint not found")
    item.status = status; db.commit(); return {"id": item.id, "status": item.status}
