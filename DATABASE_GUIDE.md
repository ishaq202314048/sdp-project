# TrackTroop - Database Persistence Complete ✅

## What's Now in the Database

### 1. **User Accounts** (All personal data persisted)

- **Location**: `User` table in SQLite
- **Data stored**:
  - `id` - Unique user identifier (UUID)
  - `email` - User email (unique, lowercase normalized)
  - `password` - Hashed with bcrypt (stored securely)
  - `fullName` - User's full name
  - `userType` - Role: "soldier", "clerk", or "adjutant"
  - `serviceNo` - Service number (for soldiers only)
  - `fitnessStatus` - Current fitness status ("Fit" or "Unfit")
  - `createdAt` - Account creation timestamp

**Current users in DB**: 6 total

- 3 Soldiers: a@gmail.com, a1@gmail.com, b@gmail.com
- 1 Clerk: a2@gmail.com
- 2 Adjutants: a3@gmail.com, adiba@gmail.com

---

### 2. **Login Sessions** (NEW - Automatically tracked)

- **Location**: `LoginSession` table in SQLite
- **Data stored on login**:
  - `id` - Session record ID (UUID)
  - `userId` - Which user logged in
  - `email` - User's email
  - `userType` - User's role
  - `ipAddress` - IP address of login (extracted from request headers)
  - `userAgent` - Browser/client information
  - `loginAt` - Exact timestamp of login

**How it works**:

1. User submits login credentials
2. System validates email + password
3. If valid → automatically creates a `LoginSession` record
4. Session is stored with IP, user-agent, and timestamp for audit purposes

**Inspect login sessions**: `node scripts/inspect-login-sessions.js`

---

### 3. **Fitness Plans** (Ready for data)

- **Location**: `FitnessPlan` table in SQLite
- **Data structure**:
  - `id` - Plan identifier
  - `title` - Plan name
  - `status` - "Fit" or "Unfit" category
  - `exercises` - JSON string of exercises (e.g., `[{"name":"Running","duration":"30min","focus":"Cardio"}]`)
  - `createdBy` - User ID who created the plan
  - `createdAt` - Timestamp

---

### 4. **Assigned Plans** (Ready for tracking)

- **Location**: `AssignedPlan` table in SQLite
- **Data structure**:
  - `id` - Assignment record ID
  - `userId` - Which soldier the plan is assigned to
  - `planId` - Which fitness plan
  - `assignedBy` - Clerk/adjutant who assigned it
  - `assignedAt` - Timestamp of assignment

---

## Database Location

📁 **File Path**: `/home/ishaq/Desktop/tracktroopMergedAuth/tracktroopMergedAuth/users.db`

This is a SQLite database file managed by Prisma.

---

## Scripts to Manage Data

### Inspect all data:

```bash
node scripts/inspect-db.js
```

Shows: users, fitness plans, assignments, and login sessions

### View login sessions:

```bash
node scripts/inspect-login-sessions.js
```

Shows: recent logins, login count by user, etc.

### Export data to JSON:

```bash
node scripts/export-db-json.js
```

Creates `/exports/` folder with JSON snapshots

### Import users from file:

```bash
node scripts/import-soldiers-to-db.js
```

Imports all user types from `data/users.json`

---

## Migration Files

All database schema changes are tracked in migrations:

```
prisma/migrations/
├── 20260122040506_init/          (Initial schema)
├── 20260126045303_init/          (User updates)
└── 20260126060038_add_login_sessions/  (NEW - Login tracking)
```

---

## How Login Tracking Works

### Step 1: User logs in

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@gmail.com","password":"password123"}'
```

### Step 2: API validates credentials

- File: `app/api/auth/login/route.ts`
- Checks email and password hash

### Step 3: Session is automatically recorded

- Creates entry in `LoginSession` table
- Captures IP address and browser info
- Timestamp recorded

### Step 4: User receives JWT token

- Token can be used for subsequent requests
- Session is available for audit logs

---

## Running the Application

### Development:

```bash
cd /home/ishaq/Desktop/tracktroopMergedAuth/tracktroopMergedAuth
pnpm install
pnpm dev
```

Server runs on `http://localhost:3001` (or next available port)

### Testing login:

1. Navigate to `/auth/login`
2. Use credentials: `a@gmail.com` / `password123`
3. Check DB: `node scripts/inspect-login-sessions.js`

---

## What's Next (Optional)

- [ ] Import fitness plans (create via UI or use import script)
- [ ] Track assignment history (clerk assigns plan to soldier)
- [ ] Add logout/session end tracking
- [ ] Create admin dashboard to view login analytics
- [ ] Set up database backups
- [ ] Deploy to production (Vercel, Docker, etc.)

---

## Summary

✅ **All user personal data is now stored in the database**
✅ **Login sessions are automatically tracked**
✅ **Database migrations are in version control**
✅ **Inspection and export scripts are available**
✅ **Ready for production use**

Your TrackTroop application now has complete data persistence! 🎯
