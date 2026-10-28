from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(300), nullable=False)
    role = Column(String(30), default="student")
    roll_no = Column(String(50), default="")
    branch = Column(String(100), default="B.Tech CSE")
    semester = Column(String(30), default="Sem 1")

    @property
    def department(self) -> str:
        return self.branch or ""


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    date = Column(String(30), nullable=False)
    location = Column(String(120), nullable=False)
    description = Column(Text, default="")


class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    category = Column(String(60), nullable=False)
    location = Column(String(120), nullable=False)
    description = Column(Text, default="")
    status = Column(String(30), default="Reported")


# ── B1 Mart ──────────────────────────────────────────────────────────────────
class MartItem(Base):
    __tablename__ = "mart_items"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    brand = Column(String(80), default="")
    category = Column(String(60), nullable=False)
    stock = Column(Integer, default=0)
    price = Column(Float, default=0)
    img = Column(Text, default="")


# ── Legacy simple mobility rows ───────────────────────────────────────────────
class Mobility(Base):
    __tablename__ = "mobility"
    id = Column(Integer, primary_key=True)
    vehicle = Column(String(80), nullable=False)
    route = Column(String(150), nullable=False)
    timing = Column(String(80), nullable=False)
    availability = Column(String(40), default="Available")


# ── Smart Mobility – Raipur Transit ──────────────────────────────────────────
class TransitLocation(Base):
    __tablename__ = "transit_locations"
    id = Column(Integer, primary_key=True)
    loc_id = Column(String(60), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(60), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    bus_corridor = Column(Boolean, default=False)
    nearest_bus_stop = Column(String(150), nullable=False)
    transfer_mode = Column(String(150), default="none")
    transfer_cost = Column(Integer, default=0)


class BusSchedule(Base):
    __tablename__ = "bus_schedules"
    id = Column(Integer, primary_key=True)
    stop_id = Column(String(60), nullable=False)   # matches TransitLocation.loc_id
    route = Column(String(120), nullable=False)
    destination = Column(String(200), nullable=False)
    times = Column(Text, default="")               # JSON-encoded list of time strings


# ── Academics ─────────────────────────────────────────────────────────────────
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    code = Column(String(30), nullable=False)
    name = Column(String(120), nullable=False)
    faculty = Column(String(100), nullable=False)
    room = Column(String(50), nullable=False)


class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True)
    title = Column(String(160), nullable=False)
    category = Column(String(60), nullable=False)
    target = Column(String(100), nullable=False, default="All Branches")
    date = Column(String(30), nullable=False)
    description = Column(Text, default="")
    author = Column(String(120), nullable=False, default="Campus Admin")
