from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Complaint
from ..schemas import ComplaintCreate, ComplaintOut

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.get("/", response_model=list[ComplaintOut])
def list_complaints(db: Session = Depends(get_db)):
    return db.query(Complaint).order_by(Complaint.id.desc()).all()

@router.post("/", response_model=ComplaintOut)
def create_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    item = Complaint(**data.model_dump()); db.add(item); db.commit(); db.refresh(item); return item
