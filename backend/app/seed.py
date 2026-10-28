"""
seed.py – populates the Smart Campus database with demo data.
Includes:
  • Users (student + teacher)
  • Events, Notices
  • B1 Mart items (all 54 products from B1_Mart_updated(6).html)
  • Legacy Mobility rows
  • Transit Locations + Bus Schedules (from smart mobility.html)
"""
import json
from datetime import date
from .database import SessionLocal
from .auth import hash_password
from .models import (
    User, Event, Notice, MartItem, Mobility,
    TransitLocation, BusSchedule, Course,
)


def seed_database():
    db = SessionLocal()
    try:
        _seed_users(db)
        _seed_events(db)
        _seed_notices(db)
        _seed_mart(db)
        _seed_mobility(db)
        _seed_transit(db)
        _seed_courses(db)
        db.commit()
    finally:
        db.close()


# ── Users ─────────────────────────────────────────────────────────────────────
def _seed_users(db):
    if db.query(User).first():
        return
    db.add_all([
        User(
            name="Demo Student",
            email="student21@iiitnr.edu.in",
            password_hash=hash_password("student123"),
            role="student",
            roll_no="21BCS001",
            branch="B.Tech CSE",
            semester="Sem 5",
        ),
        User(
            name="Demo Teacher",
            email="teacher@iiitnr.edu.in",
            password_hash=hash_password("teacher123"),
            role="teacher",
            branch="Computer Science & Engineering",
            semester="",
        ),
    ])


# ── Events ────────────────────────────────────────────────────────────────────
def _seed_events(db):
    if db.query(Event).first():
        return
    db.add_all([
        Event(title="Freshers' Welcome Night", date="2026-10-05", location="IIIT-NR Auditorium", description="Annual welcome event for first-year students."),
        Event(title="Hackathon 2026", date="2026-10-15", location="CS Lab Complex", description="24-hour coding competition."),
        Event(title="Cultural Fest – Invicta", date="2026-11-01", location="Campus Grounds", description="Annual cultural festival."),
    ])


# ── Notices ───────────────────────────────────────────────────────────────────
def _seed_notices(db):
    if db.query(Notice).first():
        return
    db.add_all([
        Notice(title="Mid-semester exam schedule released", category="Academic", target="All Branches", date=str(date.today()), author="Academic Office"),
        Notice(title="Library will be closed on Oct 2nd", category="Administrative", target="All Branches", date=str(date.today()), author="Library Admin"),
    ])


# ── B1 Mart (all 54 products) ─────────────────────────────────────────────────
_MART_ITEMS = [
    dict(id=1,  name="Lay's Classic Salted Chips",             brand="Lay's",       category="Snacks",      price=20, stock=18, img="https://m.media-amazon.com/images/I/41al0zUFKtL._AC_.jpg"),
    dict(id=2,  name="Oreo Original Biscuits",                 brand="Oreo",        category="Biscuits",    price=30, stock=0,  img="https://clipart-library.com/2023/oreo-biscuits-white-chocolate-mondelez-international-biscuit.jpg"),
    dict(id=3,  name="Coca-Cola 250 ml",                       brand="Coca-Cola",   category="Soft Drinks", price=20, stock=24, img="https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola_200ml_glass_bottle_20080201.jpg"),
    dict(id=5,  name="Pepsi 250 ml",                           brand="Pepsi",       category="Soft Drinks", price=20, stock=16, img="https://aapkabazar.co/_next/image?q=75&url=https%3A%2F%2Fimage.aapkabazar.co%2Fproduct%2F372%2F1740297449300.png%3Ftype%3Dpng&w=1080"),
    dict(id=7,  name="Cadbury Dairy Milk 52g",                 brand="Cadbury",     category="Chocolates",  price=50, stock=14, img="https://shopsuki.ph/cdn/shop/files/104709920_7f5fa240-1709-4a08-95d4-f8360710e5a4_800x.jpg?v=1774254113"),
    dict(id=8,  name="Nestlé KitKat 2 Finger 18.5g",          brand="Nestlé",      category="Chocolates",  price=20, stock=20, img="https://www.starquik.com/cdn/shop/files/SQ106515_FOP_ab7167af-169c-488d-b19d-1cdf23432c6a.jpg?v=1776845758"),
    dict(id=9,  name="Cadbury 5 Star 19.5g",                   brand="Cadbury",     category="Chocolates",  price=10, stock=22, img="https://www.wholesalemartindia.in/auth/upload/product-photo/5%20star%2020.jpgP010349.jpg"),
    dict(id=10, name="Cadbury Perk 13g",                       brand="Cadbury",     category="Chocolates",  price=5,  stock=30, img="https://www.bigbasket.com/media/uploads/p/m/20005969-2_7-cadbury-cadbury-perk-chocolate-bar.jpg"),
    dict(id=11, name="Nestlé Munch Nuts 30g",                  brand="Nestlé",      category="Chocolates",  price=20, stock=17, img="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/rc-upload-1770221714496-98.jpg"),
    dict(id=12, name="Snickers Peanut 40g",                    brand="Snickers",    category="Chocolates",  price=45, stock=9,  img="https://cdn.grofers.com/da/cms-assets/cms/product/rc-upload-1776058612378-608.jpg"),
    dict(id=13, name="Kurkure Masala Munch 75g",               brand="Kurkure",     category="Snacks",      price=20, stock=26, img="https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/NI_CATALOG/IMAGES/CIW/2024/8/5/77e61fae-297d-4dfb-a54b-ea78ca91c331_3845_1.png"),
    dict(id=14, name="Bingo Mad Angles Masala 60g",            brand="Bingo!",      category="Snacks",      price=19, stock=15, img="https://www.snackspause.com/cdn/shop/files/81o3GOapL2L.jpg?v=1729965324&width=1946"),
    dict(id=15, name="Haldiram's Aloo Bhujia 210g",            brand="Haldiram's",  category="Snacks",      price=55, stock=11, img="https://desigourmet.es/cdn/shop/files/F6_f16274a5-c02e-4d70-be4c-97c62b6696df.jpg?v=1700306302&width=370"),
    dict(id=16, name="Uncle Chipps Spicy Treat 53g",           brand="Uncle Chipps",category="Snacks",      price=20, stock=13, img="https://cdn.grofers.com/da/cms-assets/cms/product/4b8fed68-be22-41b8-b865-94f1351cf07d.jpg"),
    dict(id=17, name="Too Yumm! Bhoot Karare 71.5g",           brand="Too Yumm!",   category="Snacks",      price=24, stock=8,  img="https://cdn.grofers.com/da/cms-assets/cms/product/rc-upload-1778238133959-75.jpg"),
    dict(id=19, name="Lay's India's Magic Masala 58g",         brand="Lay's",       category="Snacks",      price=25, stock=21, img="https://m.media-amazon.com/images/I/41al0zUFKtL._AC_.jpg"),
    dict(id=20, name="Kurkure Puffcorn Cheese 58g",            brand="Kurkure",     category="Snacks",      price=20, stock=12, img="https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/NI_CATALOG/IMAGES/CIW/2024/8/5/77e61fae-297d-4dfb-a54b-ea78ca91c331_3845_1.png"),
    dict(id=21, name="Lay's India's Magic Masala 45g",         brand="Lay's",       category="Snacks",      price=25, stock=20, img="https://www.vishalmegamart.com/dw/image/v2/BGHT_PRD/on/demandware.static/-/Sites-vmm-fmcg-master-catalog/default/dw023f1b34/images/large/1310019025.JPG"),
    dict(id=22, name="Bingo! Mad Angles Masala 90g",           brand="Bingo!",      category="Snacks",      price=20, stock=14, img="https://www.snackspause.com/cdn/shop/products/IMG_1166.jpg?v=1670641302"),
    dict(id=23, name="Too Yumm! Indian Masala Chips 45g",      brand="Too Yumm!",   category="Snacks",      price=25, stock=10, img="https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b34d6353491a81c8e13534/8906090572941_1-640x640.png"),
    dict(id=24, name="Balaji Masala Masti Wafers 135g",        brand="Balaji",      category="Snacks",      price=40, stock=12, img="https://www.balajiwafers.com/cdn/shop/files/Crunchem__Masala_Masti_Wafers_Carousal_01_4ec160eb-3668-495f-9a39-8bcd2b67158f.jpg?v=1746169125&width=500"),
    dict(id=26, name="Diet Coke 300 ml",                       brand="Coca-Cola",   category="Soft Drinks", price=40, stock=12, img="https://commons.wikimedia.org/wiki/Special:FilePath/Diet_Coke_Logo.svg"),
    dict(id=28, name="Fanta Orange 250 ml",                    brand="Fanta",       category="Soft Drinks", price=20, stock=16, img="https://cdn.grofers.com/cdn-cgi/image/f%3Dauto%2Cfit%3Dscale-down%2Cq%3D70%2Cmetadata%3Dnone%2Cw%3D1080/da/cms-assets/cms/product/rc-upload-1772682797673-145.png"),
    dict(id=29, name="Sprite 250 ml",                          brand="Sprite",      category="Soft Drinks", price=20, stock=17, img="https://cdn.freshngreen.online/assets/uploads/product/11887.jpg"),
    dict(id=30, name="Thums Up 250 ml",                        brand="Thums Up",    category="Soft Drinks", price=20, stock=20, img="https://imgwlns.gumlet.io/images/products/314496-1.jpg"),
    dict(id=31, name="Mountain Dew 250 ml",                    brand="Mountain Dew",category="Soft Drinks", price=20, stock=13, img="https://www.vishalmegamart.com/on/demandware.static/-/Sites-vmm-fmcg-master-catalog/default/dwab5caf25/images/large/1310013090.jpg"),
    dict(id=32, name="Amul Vanilla Royale Ice Cream 500ml",    brand="Amul",        category="Ice Creams",  price=95, stock=9,  img="https://www.bbassets.com/media/uploads/p/l/40344418_1-amul-vanilla-royale-ice-cream.jpg"),
    dict(id=33, name="Mother Dairy Choco Brownie Fudge 500ml", brand="Mother Dairy",category="Ice Creams",  price=150,stock=7,  img="https://www.bbassets.com/media/uploads/p/l/900456916_1-mother-dairy-choco-brownie-fudge-ice-cream.jpg"),
    dict(id=34, name="Vadilal Premium Vanilla 500ml",          brand="Vadilal",     category="Ice Creams",  price=180,stock=6,  img="https://www.kesargrocery.com/images/P/Ice%20Cream%20Tub%20-%20Vanilla%20%28500ml%29%2001.png"),
    dict(id=35, name="Havmor Taj Mahal Ice Cream",             brand="Havmor",      category="Ice Creams",  price=180,stock=5,  img="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/d2d6197b-c5d7-4c92-a1ad-ce9aef12623d.jpg"),
    dict(id=36, name="Amul Coffee Bar",                        brand="Amul",        category="Ice Creams",  price=40, stock=12, img="https://www.bbassets.com/media/uploads/p/l/40344364_1-amul-coffee-bar-ice-cream-stick.jpg"),
    dict(id=37, name="Amul Rajwadi Kulfi",                     brand="Amul",        category="Ice Creams",  price=30, stock=12, img=""),
    dict(id=38, name="Amul Gold Bar",                          brand="Amul",        category="Ice Creams",  price=40, stock=12, img="https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Ch_272%2Cw_252/597cc17a78c7f2f4e2ec905e91c8678d"),
    dict(id=39, name="Monster Energy Drink 350 ml",            brand="Monster",     category="Beverages",   price=125,stock=10, img=""),
    dict(id=40, name="HELL Energy Drink 250 ml",               brand="HELL",        category="Beverages",   price=100,stock=10, img=""),
    dict(id=41, name="Gatorade 500 ml",                        brand="Gatorade",    category="Beverages",   price=20, stock=10, img="https://www.instacart.com/image-server/1864x1864/www.instacart.com/assets/domains/product-image/file/large_911ac00d-583f-4bd4-9850-e542539013b0.jpeg"),
    dict(id=43, name="Lay's American Style Cream & Onion 20g", brand="Lay's",       category="Snacks",      price=20, stock=20, img="https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b34c20599518a53f5e2699/8901491983167_1.jpg"),
    dict(id=45, name="Lay's Spanish Tomato Tango 20g",         brand="Lay's",       category="Snacks",      price=20, stock=20, img="https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/c/698b75fe3cb1459d93cad1c0d944bb30/ddc3eb0c-c916-4451-afdb-1f7fda8700b2-2024-05-01t18-02-49-281z-640x640.png"),
    dict(id=46, name="Lay's Masala Twist",                     brand="Lay's",       category="Snacks",      price=20, stock=15, img="https://nazarjanssupermarket.com/cdn/shop/files/LAYS_WAVY_MASALA_TWIST_31GM.png?v=1759239967&width=600"),
    dict(id=47, name="Haldiram's Bhel",                        brand="Haldiram's",  category="Snacks",      price=50, stock=12, img="https://aapkabazar.co/_next/image?q=75&url=https%3A%2F%2Fimage.aapkabazar.co%2Fproduct%2F2357%2F1769936201416.png&w=3840"),
    dict(id=48, name="Haldiram's Bhakharwadi",                 brand="Haldiram's",  category="Snacks",      price=70, stock=10, img="https://cdn.grofers.com/da/cms-assets/cms/product/rc-upload-1780465754293-310.jpg"),
    dict(id=49, name="Britannia Treat Jim Jam 10g",            brand="Britannia",   category="Biscuits",    price=10, stock=20, img="https://www.starquik.com/cdn/shop/files/SQ102075_35c849b4-88f4-4fe2-aa3b-9d2e20ca1d3c.jpg?v=1751628370"),
    dict(id=50, name="Britannia Bourbon Biscuits",             brand="Britannia",   category="Biscuits",    price=10, stock=20, img="https://admin.superg.in/APP-API/Assets/products/britannia-bourbon-original-sandwich-biscuits-20-g6e5025ccc7d638ae4e724da8938450a6.png"),
    dict(id=51, name="Lotte Choco Pie",                        brand="Lotte",       category="Biscuits",    price=10, stock=15, img="https://www.wholesalemartindia.in/auth/upload/product-photo/lotte%20choco.jpgP010361.jpg"),
    dict(id=52, name="Parle Hide & Seek 10g",                  brand="Parle",       category="Biscuits",    price=10, stock=20, img="https://www.starquik.com/cdn/shop/files/SQ101942_FOP_99614ca4-76aa-4623-8fd7-52468bab43c4.jpg?v=1776848154"),
    dict(id=53, name="Lahori Zeera 200 ml",                    brand="Lahori",      category="Beverages",   price=10, stock=20, img="https://www.jiomart.com/images/product/original/rv4q0xqv8j/lahori-zeera-200-ml-product-images-o590000145-p590000145-0-202203170948.jpg"),
    dict(id=54, name="Lahori Lemon 200 ml",                    brand="Lahori",      category="Beverages",   price=10, stock=20, img="https://lahorizeera.com/cdn/shop/files/Artboard_6.png?crop=center&height=1200&v=1730894127&width=1200"),
]


def _seed_mart(db):
    if db.query(MartItem).first():
        return
    for d in _MART_ITEMS:
        db.add(MartItem(**d))


# ── Legacy Mobility ───────────────────────────────────────────────────────────
def _seed_mobility(db):
    if db.query(Mobility).first():
        return
    db.add_all([
        Mobility(vehicle="Institute Bus", route="IIIT-NR → Railway Station", timing="7:00 AM, 5:00 PM", availability="Available"),
        Mobility(vehicle="Auto Rickshaw", route="Campus Gate → Zora", timing="On-demand", availability="Available"),
        Mobility(vehicle="BRTS Bus", route="IIIT-NR → Telibandha", timing="Every 20 min", availability="Available"),
    ])


# ── Smart Transit Locations (from smart mobility.html LOCATIONS object) ───────
_TRANSIT_LOCATIONS = [
    dict(loc_id="iiitnr",        name="IIIT Naya Raipur",                    category="college",  lat=21.1285, lng=81.7662, bus_corridor=True,  nearest_bus_stop="IIITNR Bus Stop",                 transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="hnlu",          name="HNLU Naya Raipur",                    category="college",  lat=21.1398, lng=81.7690, bus_corridor=True,  nearest_bus_stop="HNLU Bus Stop",                   transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="nit_raipur",    name="NIT Raipur (GE Road)",                category="college",  lat=21.2497, lng=81.6050, bus_corridor=True,  nearest_bus_stop="NIT GE Road Stop",                transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="kalinga",       name="Kalinga University",                  category="college",  lat=21.2052, lng=81.7780, bus_corridor=False, nearest_bus_stop="Kotni Turn / Kalinga Stop",        transfer_mode="Shared Auto / E-Rickshaw",           transfer_cost=15),
    dict(loc_id="balco_hospital",name="Balco Medical Centre",                category="hospital", lat=21.1550, lng=81.7850, bus_corridor=False, nearest_bus_stop="Sector 36 Naya Raipur",            transfer_mode="Shared E-Rickshaw",                  transfer_cost=20),
    dict(loc_id="ambuja_mall",   name="Ambuja City Centre Mall (Pandri)",    category="mall",     lat=21.2618, lng=81.6685, bus_corridor=False, nearest_bus_stop="Telibandha Interchange",           transfer_mode="Shared Auto to Pandri ➔ E-Rickshaw", transfer_cost=40),
    dict(loc_id="magneto_mall",  name="Magneto Offroad / Mall (GE Road)",    category="mall",     lat=21.2386, lng=81.6789, bus_corridor=True,  nearest_bus_stop="Labhandi / Magneto Stop",          transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="zora",          name="Zora Bus Stop / Agri University",     category="transit",  lat=21.2415, lng=81.6880, bus_corridor=True,  nearest_bus_stop="Zora BRTS Stop",                  transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="airport",       name="Swami Vivekananda Airport (Mana)",    category="transit",  lat=21.1804, lng=81.7388, bus_corridor=False, nearest_bus_stop="Mana Camp / Airport Turn",         transfer_mode="Last-mile Shared Auto to Terminal",  transfer_cost=20),
    dict(loc_id="railway_station",name="Raipur Junction Railway Station",    category="transit",  lat=21.2570, lng=81.6296, bus_corridor=True,  nearest_bus_stop="Railway Station Bus Stand",        transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="telibandha",    name="Telibandha Bus Stop / Marine Drive",  category="transit",  lat=21.2380, lng=81.6590, bus_corridor=True,  nearest_bus_stop="Telibandha Express Hub",           transfer_mode="none",                              transfer_cost=0),
    dict(loc_id="cbd_naya_raipur",name="CBD Station (Nava Raipur)",          category="transit",  lat=21.1610, lng=81.7870, bus_corridor=True,  nearest_bus_stop="CBD Central Station",             transfer_mode="none",                              transfer_cost=0),
]

_BUS_SCHEDULES = [
    dict(stop_id="hnlu",      route="Route 111 (BRTS Express)", destination="Raipur Railway Station via Telibandha",        times=json.dumps(["07:30 AM","08:15 AM","09:00 AM","10:30 AM","01:15 PM","04:30 PM","06:15 PM","08:00 PM"])),
    dict(stop_id="hnlu",      route="Route 222 (Local AC)",     destination="CBD Naya Raipur ➔ Zora ➔ GE Road",             times=json.dumps(["08:00 AM","09:30 AM","11:00 AM","02:00 PM","05:00 PM","07:30 PM"])),
    dict(stop_id="iiitnr",    route="Route 111 (BRTS Express)", destination="Raipur Railway Station via Telibandha & Zora", times=json.dumps(["07:40 AM","08:25 AM","09:10 AM","10:40 AM","01:25 PM","04:40 PM","06:25 PM","08:10 PM"])),
    dict(stop_id="iiitnr",    route="Route 303 (Airport Feeder)",destination="Mana Airport Turn ➔ Telibandha",              times=json.dumps(["08:15 AM","10:15 AM","12:15 PM","03:15 PM","06:15 PM"])),
    dict(stop_id="telibandha",route="Route 111 (BRTS)",         destination="Nava Raipur (HNLU / IIITNR)",                  times=json.dumps(["Every 20 mins from 07:00 AM to 09:00 PM"])),
    dict(stop_id="telibandha",route="City Shuttle",             destination="Pandri ➔ Ambuja Mall",                         times=json.dumps(["Every 15 mins (Auto/E-Rickshaw Stand)"])),
    dict(stop_id="zora",      route="Route 111 & 222",          destination="Telibandha ➔ Railway Station / Naya Raipur",   times=json.dumps(["Every 15 mins continuously"])),
]


def _seed_transit(db):
    if db.query(TransitLocation).first():
        return
    for d in _TRANSIT_LOCATIONS:
        db.add(TransitLocation(**d))
    for d in _BUS_SCHEDULES:
        db.add(BusSchedule(**d))


# ── Courses ───────────────────────────────────────────────────────────────────
def _seed_courses(db):
    if db.query(Course).first():
        return
    db.add_all([
        Course(code="CS301", name="Data Structures",   faculty="Dr. Sharma",   room="LH-101"),
        Course(code="CS302", name="Algorithms",        faculty="Dr. Verma",    room="LH-102"),
        Course(code="CS401", name="Machine Learning",  faculty="Dr. Gupta",    room="LH-201"),
    ])
