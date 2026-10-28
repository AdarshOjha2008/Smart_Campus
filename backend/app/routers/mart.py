from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import MartItem
from ..schemas import MartItemCreate, MartItemOut

router = APIRouter(prefix="/api/mart", tags=["B1 Mart"])


@router.get("/", response_model=list[MartItemOut])
def list_items(
    category: Optional[str] = Query(None, description="Filter by category"),
    q: Optional[str] = Query(None, description="Search by name or brand"),
    in_stock: Optional[bool] = Query(None, description="Only show in-stock items"),
    db: Session = Depends(get_db),
):
    """Return B1 Mart items with optional category, text-search and stock filters."""
    query = db.query(MartItem)
    if category:
        query = query.filter(MartItem.category == category)
    if q:
        like = f"%{q}%"
        query = query.filter(
            MartItem.name.ilike(like) | MartItem.brand.ilike(like)
        )
    if in_stock is True:
        query = query.filter(MartItem.stock > 0)
    elif in_stock is False:
        query = query.filter(MartItem.stock == 0)
    return query.all()


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    """Return distinct product categories available in B1 Mart."""
    rows = db.query(MartItem.category).distinct().all()
    return [r[0] for r in rows]


@router.get("/{item_id}", response_model=MartItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(MartItem).filter(MartItem.id == item_id).first()
    if not item:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=MartItemOut)
def create_item(data: MartItemCreate, db: Session = Depends(get_db)):
    item = MartItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
