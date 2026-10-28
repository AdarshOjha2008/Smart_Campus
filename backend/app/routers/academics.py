from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Course

router = APIRouter(prefix="/api/academics", tags=["Academics"])

@router.get("/")
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()
