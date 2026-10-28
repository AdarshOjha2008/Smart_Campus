from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Event
from ..schemas import EventCreate, EventOut

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("/", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.date).all()

@router.post("/", response_model=EventOut)
def create_event(data: EventCreate, db: Session = Depends(get_db)):
    item = Event(**data.model_dump()); db.add(item); db.commit(); db.refresh(item); return item
