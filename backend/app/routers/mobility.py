from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Mobility

router = APIRouter(prefix="/api/mobility", tags=["Mobility"])

@router.get("/")
def list_mobility(db: Session = Depends(get_db)):
    return db.query(Mobility).all()
