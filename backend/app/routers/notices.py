from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Notice
from ..schemas import NoticeCreate, NoticeOut

router = APIRouter(prefix="/api/notices", tags=["Campus Feed"])

@router.get("", response_model=list[NoticeOut])
@router.get("/", response_model=list[NoticeOut])
def list_notices(db: Session = Depends(get_db)):
    return db.query(Notice).order_by(Notice.id.desc()).all()

@router.post("", response_model=NoticeOut)
@router.post("/", response_model=NoticeOut)
def create_notice(data: NoticeCreate, db: Session = Depends(get_db)):
    item = Notice(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
