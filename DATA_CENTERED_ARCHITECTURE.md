# TROOP TRACK - SYSTEM ARCHITECTURE

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                        ║
║                              TROOP TRACK - SYSTEM ARCHITECTURE                         ║
║                                                                                        ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║                              CLIENT LAYER (Users)                                      ║
║                                                                                        ║
║   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                     ║
║   │     Adjutant     │  │      Clerk       │  │     Soldier      │                     ║
║   │     (Admin)      │  │   (Support)      │  │   (End User)     │                     ║
║   │                  │  │                  │  │                  │                     ║
║   │ • Manage Soldiers│  │ • Justify Fitness│  │ • View Fitness   │                     ║
║   │ • Approve/Reject │  │   Tests          │  │   Status         │                     ║
║   │   Signups        │  │ • Send Reports   │  │ • View Assigned  │                     ║
║   │ • Create Weekly  │  │   to Adjutant    │  │   Plans          │                     ║
║   │   Fitness Plans  │  │ • View Soldier   │  │ • View Test      │                     ║
║   │ • Set IPFT Date  │  │   Records        │  │   Results        │                     ║
║   │ • View Reports   │  │ • Record Test    │  │ • Update Profile │                     ║
║   │ • View Dashboard │  │   Scores         │  │ • View Exercises │                     ║
║   │ • Remove Soldiers│  │                  │  │                  │                     ║
║   └──────────────────┘  └──────────────────┘  └──────────────────┘                     ║
║                                                                                        ║
║                                    │ HTTP/HTTPS │                                      ║
║                                    ▼            ▼                                      ║
║                                                                                        ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║                           PRESENTATION LAYER (Frontend)                                ║
║                                                                                        ║
║   ┌──────────────────────────────┐       ┌──────────────────────────────┐              ║
║   │                              │       │                              │              ║
║   │ • Next.js App Router         │       │ • Lucide Icons (UI Icons)    │              ║
║   │   (File-based Routing)       │       │ • Recharts (Data Charts)     │              ║
║   │ • React 19 (UI Components)   │  N    │ • React Hooks (useState,     │              ║
║   │ • Tailwind CSS (Styling)     │  e    │   useEffect, useMemo)        │              ║
║   │ • Radix UI (Select, Dialog,  │  x    │ • Component-Based            │              ║
║   │   Checkbox, Label)           │  t    │   Architecture               │              ║
║   │ • Class Variance Authority   │  .    │ • Client-Side State          │              ║
║   │   (Component Variants)       │  j    │   Management                 │              ║
║   │ • Tailwind Merge             │  s    │ • PDF-Lib (Report Export)     │              ║
║   │   (Class Merging)            │       │ • JWT Token (LocalStorage)   │              ║
║   │                              │  +    │                              │              ║
║   │                              │       │                              │              ║
║   │                              │  T    │                              │              ║
║   │                              │  u    │                              │              ║
║   │                              │  r    │                              │              ║
║   │                              │  b    │                              │              ║
║   │                              │  o    │                              │              ║
║   │                              │  p    │                              │              ║
║   │                              │  a    │                              │              ║
║   │                              │  c    │                              │              ║
║   │                              │  k    │                              │              ║
║   └──────────────────────────────┘       └──────────────────────────────┘              ║
║                                                                                        ║
║                                   │ REST API │                                         ║
║                                   ▼          ▼                                         ║
║                                                                                        ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║                          APPLICATION LAYER (Backend)                                   ║
║                                                                                        ║
║   ┌──────────────────────────────┐       ┌──────────────────────────────┐              ║
║   │                              │       │                              │              ║
║   │ • RESTful API Architecture   │       │ • /api/soldiers              │              ║
║   │ • JWT Authentication         │       │   (GET, DELETE)              │              ║
║   │   (jsonwebtoken)             │  N    │ • /api/soldiers/approve      │              ║
║   │ • Bcrypt Password Hashing    │  e    │   (POST: approve/reject)     │              ║
║   │   (bcryptjs)                 │  x    │ • /api/fitness               │              ║
║   │ • API Route Handlers         │  t    │   (GET, POST: status)        │              ║
║   │   (route.ts files)           │  .    │ • /api/fitness/plans         │              ║
║   │ • Request Validation         │  j    │   (GET, POST: weekly plans)  │              ║
║   │ • Error Handling             │  s    │ • /api/fitness/assign        │              ║
║   │ • BMI Auto-Calculation       │       │   (POST: assign plan)        │              ║
║   │ • Fitness Status             │  A    │ • /api/profile               │              ║
║   │   Computation                │  P    │   (GET, PATCH: user profile) │              ║
║   │ • UUID Generation            │  I    │ • /api/reports               │              ║
║   │   (crypto.randomUUID)        │       │   (clerk-report, new-soldiers│              ║
║   │ • Singleton DB Connection    │  R    │ • /api/soldier-fitness-tests │              ║
║   │   (sqlitecloud-client.ts)    │  o    │   (GET: test history)        │              ║
║   │                              │  u    │ • /api/high-risk-soldiers    │              ║
║   │                              │  t    │   (GET: unfit soldiers)      │              ║
║   │                              │  e    │ • /api/fitness-test          │              ║
║   │                              │  s    │   (POST: record test)        │              ║
║   │                              │       │ • /api/auth/login            │              ║
║   │                              │       │ • /api/auth/signup           │              ║
║   └──────────────────────────────┘       └──────────────────────────────┘              ║
║                                                                                        ║
║                             │ SQLite Cloud SDK │                                       ║
║                             ▼                  ▼                                       ║
║                                                                                        ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║                           DATA LAYER (Database)                                        ║
║                                                                                        ║
║   ┌────────────────┐                          ┌──────────────────────────┐             ║
║   │                │                          │                          │             ║
║   │   Tables:      │                          │   Features:              │             ║
║   │                │     ┌──────────────┐     │                          │             ║
║   │ • User         │     │              │     │ • Cloud-Hosted SQLite    │             ║
║   │   (Soldiers,   │     │   SQLite     │     │ • Prisma ORM Schema     │             ║
║   │   Clerks,      │     │   Cloud     │     │   Management             │             ║
║   │   Adjutants)   │     │              │     │ • Database Migrations    │             ║
║   │ • FitnessPlan  │     │   Database   │     │ • Indexed Queries        │             ║
║   │ • AssignedPlan │     │              │     │   (userId, email,        │             ║
║   │ • FitnessTest  │     └──────────────┘     │   createdAt)             │             ║
║   │ • Report       │                          │ • UUID Primary Keys      │             ║
║   │ • LoginSession │                          │ • JSON Storage           │             ║
║   │ • IpftDate     │                          │   (exercises, content)   │             ║
║   │                │                          │ • Singleton Connection   │             ║
║   └────────────────┘                          └──────────────────────────┘             ║
║                                                                                        ║
╠══════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║                           EXTERNAL SERVICES                                            ║
║                                                                                        ║
║   ┌──────────────────────────────┐       ┌──────────────────────────────┐              ║
║   │                              │       │                              │              ║
║   │       SQLite Cloud           │       │     Future Integrations      │              ║
║   │                              │       │                              │              ║
║   │ • Cloud Database Hosting     │       │ • Email Notifications        │              ║
║   │ • Remote DB Connection       │       │ • Push Notifications         │              ║
║   │ • @sqlitecloud/drivers       │       │ • File Storage (S3)          │              ║
║   │ • Environment Variable       │       │ • SMS Alerts                 │              ║
║   │   Based Config               │       │ • Biometric Integration      │              ║
║   │                              │       │                              │              ║
║   └──────────────────────────────┘       └──────────────────────────────┘              ║
║                                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## Layer-by-Layer Description

### 1. CLIENT LAYER (Users)

| User Role              | Access Level       | Key Functions                                                                                                                             |
| ---------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Adjutant** (Admin)   | Full System Access | Manage soldiers, approve/reject signups, create weekly fitness plans, set IPFT dates, view reports & dashboard analytics, remove soldiers |
| **Clerk** (Support)    | Moderate Access    | Justify fitness test results, send reports to adjutant, view soldier records, record test scores                                          |
| **Soldier** (End User) | Read-Only (mostly) | View personal fitness status, view assigned workout plans, view test results, update own profile, view weekly exercises                   |

### 2. PRESENTATION LAYER (Frontend)

| Technology                   | Purpose                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| **Next.js 16 + Turbopack**   | App Router, file-based routing, server/client components                 |
| **React 19**                 | Component-based UI with hooks (useState, useEffect, useMemo)             |
| **Tailwind CSS**             | Utility-first dark theme styling (slate-950 background, emerald accents) |
| **Radix UI**                 | Accessible primitives (Select, Dialog, Checkbox, Label, Separator)       |
| **Lucide Icons**             | Icon library for UI elements                                             |
| **Recharts**                 | Data visualization charts on dashboard                                   |
| **PDF-Lib**                  | Client-side PDF report generation                                        |
| **Class Variance Authority** | Component variant management (Button, Badge)                             |

### 3. APPLICATION LAYER (Backend)

| Feature              | Technology                                                |
| -------------------- | --------------------------------------------------------- |
| **API Architecture** | Next.js API Routes (RESTful, route.ts handlers)           |
| **Authentication**   | JWT tokens (jsonwebtoken) with bcryptjs password hashing  |
| **Database Client**  | Singleton SQLite Cloud connection (sqlitecloud-client.ts) |
| **Validation**       | Server-side field validation in each API route            |
| **Auto-Calculation** | BMI = weight / (height/100)², Fitness status computation  |
| **ID Generation**    | crypto.randomUUID() for all primary keys                  |

### 4. DATA LAYER (Database)

| Table            | Records                     | Key Fields                                                                           |
| ---------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| **User**         | Soldiers, Clerks, Adjutants | email, password, serviceNo, rank, unit, fitnessStatus, approved, height, weight, bmi |
| **FitnessPlan**  | Weekly workout plans        | title, status (Fit/Unfit), exercises (JSON), createdBy                               |
| **AssignedPlan** | Plan-to-Soldier assignments | userId, planId, assignedBy                                                           |
| **FitnessTest**  | Individual test results     | soldierUserId, exerciseName, result (Pass/Fail), score, justifiedBy                  |
| **Report**       | Clerk → Adjutant messages   | title, type, content (JSON), sentBy, sentTo, status                                  |
| **LoginSession** | Login audit trail           | userId, email, userType, ipAddress, loginAt                                          |
| **IpftDate**     | IPFT schedule dates         | date, setBy                                                                          |

### 5. EXTERNAL SERVICES

| Service                  | Purpose                                                                    |
| ------------------------ | -------------------------------------------------------------------------- |
| **SQLite Cloud**         | Cloud-hosted SQLite database with remote access via `@sqlitecloud/drivers` |
| **Future: Email**        | Notification emails for approvals, test results                            |
| **Future: Push**         | Real-time alerts to soldiers about new plans                               |
| **Future: File Storage** | Document/report file uploads                                               |

---

## Connection Protocols Between Layers

```
Client Layer  ──── HTTP/HTTPS ────▶  Presentation Layer (Browser)
Presentation  ──── REST API  ──────▶  Application Layer (Next.js API Routes)
Application   ──── SQLite Cloud SDK ▶  Data Layer (SQLite Cloud Database)
```

---

## Technology Stack Summary

| Layer        | Technologies                                                                        |
| ------------ | ----------------------------------------------------------------------------------- |
| **Client**   | Web Browser (Chrome, Firefox, Brave, etc.)                                          |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI, Lucide, Recharts, PDF-Lib |
| **Backend**  | Next.js API Routes, JWT, bcryptjs, crypto (UUID), Prisma ORM                        |
| **Database** | SQLite Cloud, Prisma Migrations, 7 Tables                                           |
| **DevOps**   | pnpm, Turbopack, ESLint, TypeScript Compiler                                        |
