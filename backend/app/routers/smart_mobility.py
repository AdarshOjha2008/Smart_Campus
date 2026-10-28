import json
import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import TransitLocation, BusSchedule
from ..schemas import TransitLocationOut, BusScheduleOut, FareRequest

router = APIRouter(prefix="/api/transit", tags=["Smart Mobility"])


# ── Locations ──────────────────────────────────────────────────────────────────
@router.get("/locations", response_model=list[TransitLocationOut])
def list_locations(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """All transit locations (colleges, hospitals, malls, transit hubs)."""
    q = db.query(TransitLocation)
    if category:
        q = q.filter(TransitLocation.category == category)
    return q.all()


@router.get("/locations/{loc_id}", response_model=TransitLocationOut)
def get_location(loc_id: str, db: Session = Depends(get_db)):
    loc = db.query(TransitLocation).filter(TransitLocation.loc_id == loc_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc


# ── Bus Schedules ──────────────────────────────────────────────────────────────
@router.get("/schedules", response_model=list[BusScheduleOut])
def list_schedules(
    stop_id: Optional[str] = Query(None, description="Filter schedules by stop id"),
    db: Session = Depends(get_db),
):
    """Bus schedules. Optionally filter by stop_id (matches TransitLocation.loc_id)."""
    q = db.query(BusSchedule)
    if stop_id:
        q = q.filter(BusSchedule.stop_id == stop_id)
    return q.all()


# ── Fare Calculator ────────────────────────────────────────────────────────────
def _haversine_km(lat1, lng1, lat2, lng2) -> float:
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)) * 1.25, 1)


@router.post("/fare")
def calculate_fare(req: FareRequest, db: Session = Depends(get_db)):
    """
    Calculate transit fares and ETA between two transit locations.
    Returns bus combo fare, Rapido bike/auto/cab estimates, and route steps.
    """
    orig = db.query(TransitLocation).filter(TransitLocation.loc_id == req.origin_id).first()
    dest = db.query(TransitLocation).filter(TransitLocation.loc_id == req.dest_id).first()
    if not orig:
        raise HTTPException(status_code=404, detail=f"Origin '{req.origin_id}' not found")
    if not dest:
        raise HTTPException(status_code=404, detail=f"Destination '{req.dest_id}' not found")
    if req.origin_id == req.dest_id:
        raise HTTPException(status_code=400, detail="Origin and destination must differ")

    dist = _haversine_km(orig.lat, orig.lng, dest.lat, dest.lng)

    base_bus = 35 if dist > 25 else (15 if dist < 10 else 25)
    leg_cost = orig.transfer_cost + dest.transfer_cost
    combo_fare = base_bus + leg_cost
    eta_mins = round(dist * 2.2 + (15 if leg_cost > 0 else 5))

    steps = [
        {
            "step": 1,
            "type": "bus",
            "description": f"Take BRTS/City Bus from {orig.nearest_bus_stop} to {dest.nearest_bus_stop}",
            "fare": base_bus,
        }
    ]
    if dest.transfer_cost > 0:
        steps.append({
            "step": 2,
            "type": "last_mile",
            "description": f"Switch at {dest.nearest_bus_stop} → {dest.transfer_mode} to {dest.name}",
            "fare": dest.transfer_cost,
        })
    else:
        steps.append({
            "step": 2,
            "type": "direct",
            "description": "Destination is directly on the BRTS corridor — no transfer needed.",
            "fare": 0,
        })

    return {
        "origin": orig.name,
        "destination": dest.name,
        "distance_km": dist,
        "combo": {
            "fare": combo_fare,
            "eta_mins": eta_mins,
            "steps": steps,
        },
        "rapido": {
            "bike": round(15 + dist * 8),
            "auto": round(25 + dist * 12),
            "cab": round(50 + dist * 18),
        },
        "stand_auto": round(dist * 18 + 20),
    }
