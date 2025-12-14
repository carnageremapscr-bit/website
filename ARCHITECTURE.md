# Carnage Remaps Portal - System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CARNAGE REMAPS DEALER PORTAL                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
           ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
           │   PUBLIC    │     │ DEALER AUTH │     │   EMBED     │
           │  (Login)    │     │  (Portal)   │     │  (Widget)   │
           └─────────────┘     └─────────────┘     └─────────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │         VEHICLE DATABASE SYSTEM         │
                    └─────────────────────────────────────────┘
```

---

## Vehicle Database Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA SOURCES                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐  │
│  │  VEHICLE_DATABASE   │    │ VEHICLE_ENGINE_DB   │    │ MANUFACTURER_ENGINES│  │
│  │  (66 manufacturers) │    │ (Year-specific)     │    │ (Generic fallback)  │  │
│  └─────────────────────┘    └─────────────────────┘    └─────────────────────┘  │
│           │                          │                          │               │
│           │                          │                          │               │
│  ┌────────┴────────┐        ┌────────┴────────┐        ┌────────┴────────┐      │
│  │ Models per make │        │ Engines per     │        │ All engines for │      │
│  │ e.g. Audi:      │        │ model + year    │        │ a manufacturer  │      │
│  │ A1, A3, A4...   │        │ e.g. A3 2021-24:│        │ (no year data)  │      │
│  │                 │        │ 1.5 TFSI-150hp  │        │                 │      │
│  │                 │        │ 2.0 TFSI-190hp  │        │                 │      │
│  └─────────────────┘        └─────────────────┘        └─────────────────┘      │
│                                                                                  │
│  ┌─────────────────────┐                                                        │
│  │   GENERIC_ENGINES   │  ← Final fallback for unknown manufacturers            │
│  │  1.0-70hp, 1.2-80hp │                                                        │
│  │  1.4-90hp, etc.     │                                                        │
│  └─────────────────────┘                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Vehicle Lookup Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         VEHICLE SELECTION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

     USER SELECTS                    SYSTEM LOOKS UP                  DISPLAYS
     ────────────                    ───────────────                  ────────

  ┌──────────────┐
  │ Manufacturer │ ──────────────► VEHICLE_DATABASE ──────────────► Models List
  │  (e.g. Audi) │                     │
  └──────────────┘                     │
         │                             ▼
         │                    ┌─────────────────┐
         ▼                    │ Get all models  │
  ┌──────────────┐            │ for this make   │
  │    Model     │            └─────────────────┘
  │  (e.g. A3)   │
  └──────────────┘
         │
         │          ┌──────────────────────────────────────────────────────────┐
         │          │                                                          │
         ▼          ▼                                                          │
  ┌────────────────────────────┐                                               │
  │ findModelInDatabase()      │                                               │
  │ Tries multiple key formats:│                                               │
  │  • a3                      │                                               │
  │  • a-3                     │                                               │
  │  • etc.                    │                                               │
  └────────────────────────────┘                                               │
         │                                                                     │
         ├─── FOUND in VEHICLE_ENGINE_DATABASE ──► Year ranges from database   │
         │    (e.g. 2017-2020, 2021-2024)                                      │
         │                                                                     │
         └─── NOT FOUND ──► Fallback year ranges                               │
              (2021-2024, 2017-2020, 2013-2016, 2009-2012, 2005-2008, 2000-2004)│
                                                                               │
         │                                                                     │
         ▼                                                                     │
  ┌──────────────┐                                                             │
  │  Year Range  │                                                             │
  │ (e.g. 2021-24│                                                             │
  └──────────────┘                                                             │
         │                                                                     │
         ├─── FOUND engines for model+year ──► Specific engines                │
         │    (e.g. 1.5 TFSI-150hp, 2.0 TFSI-190hp)                            │
         │                                                                     │
         ├─── NOT FOUND ──► MANUFACTURER_ENGINES fallback                      │
         │    (all engines for that brand)                                     │
         │                                                                     │
         └─── STILL NOT FOUND ──► GENERIC_ENGINES                              │
              (basic engine list)                                              │
         │                                                                     │
         ▼                                                                     │
  ┌──────────────┐                                                             │
  │    Engine    │                                                             │
  │(e.g. 2.0 TDI)│                                                             │
  └──────────────┘                                                             │
         │                                                                     │
         ▼                                                                     │
  ┌─────────────────────────────┐                                              │
  │ Display Tuning Results      │                                              │
  │ • Stage 1 gains calculated  │                                              │
  │ • Options shown             │                                              │
  │ • Contact buttons           │                                              │
  └─────────────────────────────┘                                              │
```

---

## File Structure

```
website/
├── index.html                 # Main portal page
├── embed.html                 # Embeddable widget for external sites
├── server.js                  # Express backend (Railway deployment)
├── package.json               # Node.js dependencies
├── start-backend.bat          # Local development script
├── TUNING_GUIDE.md           # Tuning options documentation
├── ARCHITECTURE.md           # This file
│
└── assets/
    ├── css/
    │   └── carnage.css       # Main stylesheet
    │
    ├── js/
    │   ├── main.js           # Main application logic (13,500+ lines)
    │   │   ├── VEHICLE_DATABASE         (line 40)
    │   │   ├── MANUFACTURER_ENGINES     (line 98)
    │   │   ├── GENERIC_ENGINES          (line 137)
    │   │   ├── VEHICLE_ENGINE_DATABASE  (line 140)
    │   │   ├── findModelInDatabase()    (line 5243)
    │   │   ├── Public search handlers   (line 10897)
    │   │   ├── Upload form handlers     (line 5463)
    │   │   └── Vehicle search handlers  (line 6700)
    │   │
    │   ├── auth.js           # Authentication helpers
    │   ├── supabase-*.js     # Supabase integration files
    │   └── support.js        # Support ticket system
    │
    └── media/
        └── logo.avif         # Company logo
```

---

## Three Search Interfaces

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SEARCH INTERFACE COMPARISON                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┬─────────────────────────┬─────────────────────────────┐
│     PUBLIC SEARCH       │     UPLOAD FORM         │    VEHICLE TUNING SEARCH    │
│     (Login Page)        │     (File Upload)       │    (Dealer Dashboard)       │
├─────────────────────────┼─────────────────────────┼─────────────────────────────┤
│                         │                         │                             │
│  Location:              │  Location:              │  Location:                  │
│  Login screen           │  Upload section         │  Vehicle Tuning tab         │
│  (unauthenticated)      │  (authenticated)        │  (authenticated)            │
│                         │                         │                             │
├─────────────────────────┼─────────────────────────┼─────────────────────────────┤
│                         │                         │                             │
│  Purpose:               │  Purpose:               │  Purpose:                   │
│  Show tuning potential  │  Tag uploaded files     │  Browse vehicle database    │
│  to prospective dealers │  with vehicle info      │  and view tuning specs      │
│                         │                         │                             │
├─────────────────────────┼─────────────────────────┼─────────────────────────────┤
│                         │                         │                             │
│  Data Source:           │  Data Source:           │  Data Source:               │
│  VEHICLE_ENGINE_DB      │  VEHICLE_ENGINE_DB      │  VEHICLE_ENGINE_DB          │
│  → MANUFACTURER_ENGINES │  → MANUFACTURER_ENGINES │  → MANUFACTURER_ENGINES     │
│  → GENERIC_ENGINES      │  → GENERIC_ENGINES      │  → GENERIC_ENGINES          │
│                         │                         │                             │
├─────────────────────────┼─────────────────────────┼─────────────────────────────┤
│                         │                         │                             │
│  Output:                │  Output:                │  Output:                    │
│  Inline results card    │  Populates file tags    │  Detailed tuning card       │
│  with Stage 1 gains     │  for organization       │  with full specifications   │
│  + Contact buttons      │                         │                             │
│                         │                         │                             │
└─────────────────────────┴─────────────────────────┴─────────────────────────────┘
```

---

## Tuning Calculations

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         STAGE 1 TUNING CALCULATIONS                              │
└─────────────────────────────────────────────────────────────────────────────────┘

  Engine String Input                    Parsing                      Output
  ───────────────────                    ───────                      ──────

  "2.0 TDI - 150hp"     ───►    ┌─────────────────────┐
                                │ Extract HP value    │
                                │ hp = 150            │
                                └─────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │ Detect fuel type    │
                                │ TDI → Diesel        │
                                │ TFSI → Petrol       │
                                └─────────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         │                                 │
                         ▼                                 ▼
                ┌─────────────────┐               ┌─────────────────┐
                │     DIESEL      │               │     PETROL      │
                │ torque = hp×2.2 │               │ torque = hp×1.1 │
                │ power gain: 25% │               │ power gain: 20% │
                │ torque gain: 30%│               │ torque gain: 25%│
                └─────────────────┘               └─────────────────┘
                         │                                 │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │ Calculate Stage 1:  │
                                │ Power: 150 → 188hp  │
                                │ Torque: 330 → 429Nm │
                                │ (+38hp, +99Nm)      │
                                └─────────────────────┘
```

---

## Database Coverage Statistics

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE COVERAGE                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

  VEHICLE_DATABASE (Manufacturers + Models)
  ──────────────────────────────────────────
  
  66 Manufacturers including:
  ├── Audi (22 models)
  ├── BMW (29 models)
  ├── Mercedes (34 models)
  ├── Volkswagen (23 models)
  ├── Ford (21 models)
  ├── Land Rover (10 models)
  ├── Porsche (12 models)
  └── ... and 59 more

  VEHICLE_ENGINE_DATABASE (Year-Specific Data)
  ────────────────────────────────────────────
  
  Detailed coverage for:
  ├── Audi: A1, A3, A4, A5, A6, A7, A8, Q2, Q3, Q5, Q7, Q8, TT, R8, RS3-RS7, etc.
  ├── BMW: 1-8 Series, X1-X7, M2-M8, Z4, i3, i4, iX
  ├── Mercedes: A/B/C/E/S Class, GLA/GLB/GLC/GLE/GLS, AMG GT, EQ series
  ├── Volkswagen: Polo, Golf, Jetta, Passat, Tiguan, Touareg, T-Roc, ID series
  ├── Ford: Fiesta, Focus, Mondeo, Kuga, Mustang, Transit, Ranger
  ├── Fiat: 500, Panda, Tipo, Ducato, Punto
  └── More manufacturers with detailed year-by-year engine data

  MANUFACTURER_ENGINES (Fallback)
  ────────────────────────────────
  
  20+ manufacturers with generic engine lists:
  ├── Audi: 40 engine variants
  ├── BMW: 16 engine variants
  ├── Mercedes: 18 engine variants
  ├── VW: 22 engine variants
  └── etc.

  GENERIC_ENGINES (Final Fallback)
  ─────────────────────────────────
  
  11 basic engine types:
  1.0-70hp, 1.2-80hp, 1.4-90hp, 1.5-100hp, 1.6-110hp,
  1.8-140hp, 2.0-150hp, 2.0-180hp, 2.2-150hp, 2.5-200hp, 3.0-250hp
```

---

## Embed Widget Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EMBED WIDGET (embed.html)                           │
└─────────────────────────────────────────────────────────────────────────────────┘

  External Website                    Carnage Portal                  API Server
  ────────────────                    ──────────────                  ──────────

  ┌─────────────────┐
  │  <iframe src=   │
  │  "embed.html">  │
  └─────────────────┘
          │
          ▼
  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
  │ Loads embed.html│ ──────► │ Fetches vehicle │ ──────► │ /api/vehicles   │
  │ in sandbox      │         │ data from API   │         │ Returns 66      │
  │                 │         │ with cache-bust │         │ manufacturers   │
  └─────────────────┘         └─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │ User selects:   │
                              │ • Manufacturer  │
                              │ • Model         │
                              │ • Year          │
                              │ • Engine        │
                              └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │ Results display │
                              │ INLINE (no      │
                              │ redirect!)      │
                              │                 │
                              │ • Stage 1 gains │
                              │ • Tuning options│
                              │ • Contact btns  │
                              └─────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
  │   Login Page    │         │    Supabase     │         │  Dealer Portal  │
  │                 │         │   Auth Service  │         │                 │
  └─────────────────┘         └─────────────────┘         └─────────────────┘
          │                           │                           │
          │  1. Enter credentials     │                           │
          │  ────────────────────►    │                           │
          │                           │                           │
          │  2. Validate              │                           │
          │  ◄────────────────────    │                           │
          │                           │                           │
          │  3. Return session token  │                           │
          │  ◄────────────────────    │                           │
          │                           │                           │
          │  4. Redirect to portal    │                           │
          │  ─────────────────────────────────────────────────►   │
          │                           │                           │
          │                           │  5. Validate session      │
          │                           │  ◄────────────────────    │
          │                           │                           │
          │                           │  6. Load dealer data      │
          │                           │  ────────────────────►    │
          │                           │                           │

  Portal Features (Authenticated):
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ • File Upload & Management                                                  │
  │ • Vehicle Tuning Database Search                                            │
  │ • Credit System & Purchases                                                 │
  │ • Support Ticket System                                                     │
  │ • Dealer Profile Management                                                 │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT STACK                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
  │     GitHub      │         │     Railway     │         │    Supabase     │
  │   Repository    │ ──────► │   Deployment    │ ──────► │   Backend DB    │
  └─────────────────┘         └─────────────────┘         └─────────────────┘
          │                           │                           │
          │                           │                           │
  • Source control            • Node.js hosting           • Auth service
  • Version history           • Auto-deploy on push       • File storage
  • main branch               • HTTPS/SSL                 • Database
                              • Custom domain             • Real-time
                                                          

  Production URL: https://web-production-df12d.up.railway.app
```

---

*Last updated: December 2024*
