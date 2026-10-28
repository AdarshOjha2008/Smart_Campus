from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = None
    roll_no: Optional[str] = ""
    branch: Optional[str] = ""
    department: Optional[str] = ""
    semester: Optional[str] = ""

class StudentSignupRequest(BaseModel):
    name: str
    email: str
    password: str
    roll_no: Optional[str] = ""
    branch: Optional[str] = "B.Tech CSE"
    semester: Optional[str] = "Sem 1"

class TeacherSignupRequest(BaseModel):
    name: str
    email: str
    password: str
    department: Optional[str] = "Computer Science & Engineering"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    roll_no: str = ""
    branch: str = "B.Tech CSE"
    department: str = ""
    semester: str = "Sem 1"
    model_config = ConfigDict(from_attributes=True)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    email: Optional[str] = None
    branch: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[str] = None

# ── Events ────────────────────────────────────────────────────────────────────
class EventCreate(BaseModel):
    title: str
    date: str
    location: str
    description: str = ""

class EventOut(EventCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ── Complaints ────────────────────────────────────────────────────────────────
class ComplaintCreate(BaseModel):
    title: str
    category: str
    location: str
    description: str = ""

class ComplaintOut(ComplaintCreate):
    id: int
    status: str
    model_config = ConfigDict(from_attributes=True)

# ── B1 Mart ───────────────────────────────────────────────────────────────────
class MartItemCreate(BaseModel):
    name: str
    brand: str = ""
    category: str
    stock: int = 0
    price: float = 0
    img: str = ""

class MartItemOut(MartItemCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ── Smart Mobility ────────────────────────────────────────────────────────────
class TransitLocationOut(BaseModel):
    id: int
    loc_id: str
    name: str
    category: str
    lat: float
    lng: float
    bus_corridor: bool
    nearest_bus_stop: str
    transfer_mode: str
    transfer_cost: int
    model_config = ConfigDict(from_attributes=True)

class BusScheduleOut(BaseModel):
    id: int
    stop_id: str
    route: str
    destination: str
    times: str   # JSON string; frontend parses
    model_config = ConfigDict(from_attributes=True)

class FareRequest(BaseModel):
    origin_id: str
    dest_id: str

# ── Notices ───────────────────────────────────────────────────────────────────
class NoticeCreate(BaseModel):
    title: str
    category: str
    target: str = "All Branches"
    date: str
    description: str = ""
    author: str = "Campus Admin"

class NoticeOut(NoticeCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
