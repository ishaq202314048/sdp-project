# TROOP TRACK — TEST CASE SCENARIOS (EXCLUDING LOGIN)

---

## Overview

This document contains **5 test case scenarios** for TrackTroop, focusing on core system features **excluding the login system**.

**Format:** Each test case is presented in a clear “boxed” structure (similar to the provided architecture screenshot style) with consistent fields: Preconditions → Steps → Expected Result.

---

## TEST CASE MATRIX (Quick View)

```
┌─────────┬───────────────────────────────────────────────┬───────────────────────────┬──────────┐
│ ID      │ Feature                                       │ Module / Role             │ Priority │
├─────────┼───────────────────────────────────────────────┼───────────────────────────┼──────────┤
│ TC-001  │ Approve/Reject Soldier Account                │ Adjutant → Soldiers        │ High     │
│ TC-002  │ Create Weekly Fitness Plan (Fit/Unfit)        │ Adjutant → Plans           │ High     │
│ TC-003  │ Clerk Sends Report to Adjutant                │ Clerk → Reports            │ Medium   │
│ TC-004  │ Update Profile + BMI Auto-Calculation         │ Soldier → Profile          │ Medium   │
│ TC-005  │ View High-Risk Soldiers (Unfit List)          │ Adjutant/Clerk → Monitoring│ High     │
└─────────┴───────────────────────────────────────────────┴───────────────────────────┴──────────┘
```

---

## TC-001 — Adjutant Approves a Pending Soldier

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST CASE ID   : TC-001                                                      │
│ TITLE          : Approve a pending soldier account                            │
│ MODULE         : Soldier Management (Adjutant Dashboard)                      │
│ API ENDPOINT   : POST /api/soldiers/approve                                   │
│ PRIORITY       : High                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Preconditions

- Adjutant is authenticated and can access the Adjutant Dashboard.
- At least one soldier exists in the database with `approved = false`.

### Test Data

- `soldierId = <pending-soldier-uuid>`
- `action = "approve"`

### Steps

1. Go to **Adjutant Dashboard → Soldiers** page.
2. In **New Soldier Requests**, select a pending soldier.
3. Click **Approve**.

### Expected Result

- API returns **200 OK** with success message.
- The pending soldier disappears from the pending list.
- Soldier appears in the approved soldiers list.
- Database: `User.approved` changes from `false` → `true`.

### Alternate (Reject)

- Use `action = "reject"`.
- Expected: Soldier is removed from pending list AND deleted from database.

---

## TC-002 — Create Weekly Fitness Plan (Fit Soldiers)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST CASE ID   : TC-002                                                      │
│ TITLE          : Create a weekly fitness plan for Fit soldiers                │
│ MODULE         : Fitness Plan Management (Adjutant Dashboard)                 │
│ API ENDPOINT   : POST /api/fitness/plans                                      │
│ PRIORITY       : High                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Preconditions

- Adjutant can access the plan creation UI.
- Database is reachable (SQLite Cloud configured).

### Test Data (Example)

- `title = "Weekly Fit Training Program"`
- `status = "Fit"`
- `createdBy = <adjutant-user-id>`
- `exercises = [{ day: "Sunday", exercises: [{ name:"Push-ups", duration:"30 min", focus:"Strength" }] }, ...]`

### Steps

1. Go to Adjutant Dashboard → **Create Weekly Plan**.
2. Select **Fit Soldiers**.
3. Enter a plan title.
4. Add at least one exercise to at least one day.
5. Click **Create Fit Weekly Plan**.

### Expected Result

- API returns **200 OK** with created plan data.
- Database: a new row is added to `FitnessPlan`.
- `FitnessPlan.exercises` is stored as JSON string.
- The plan is visible when calling:
  - `GET /api/fitness/plans?status=Fit`

### Validation (Negative Test)

- Leave `title` empty and submit.
- Expected: API returns **400** with `missing fields`.

---

## TC-003 — Clerk Sends Report to Adjutant

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST CASE ID   : TC-003                                                      │
│ TITLE          : Clerk sends a report/message to Adjutant                     │
│ MODULE         : Reports (Clerk Dashboard → Adjutant Dashboard)               │
│ API ENDPOINT   : POST /api/reports/clerk-report                               │
│ PRIORITY       : Medium                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Preconditions

- Clerk is authenticated and can access the Reports UI.
- Adjutant can access the reports/alerts UI.

### Test Data (Example)

- `title = "Monthly Fitness Summary - Feb 2026"`
- `message = "5 out of 7 soldiers passed..."`
- `sentBy = <clerk-user-id>`
- `sentByName = "Clerk Ahmad"`

### Steps

1. Go to Clerk Dashboard → Reports.
2. Fill in Title and Message.
3. (Optional) attach a file (if supported by UI).
4. Click **Send Report**.

### Expected Result

- API returns **201 Created**.
- Database: new row in `Report` table with:
  - `type = "clerk-report"`
  - `sentTo = "adjutant"`
  - `status = "sent"`
  - `content` stored as JSON (message + optional file data).
- Adjutant sees the report via:
  - `GET /api/reports/clerk-report`

### Validation (Negative Test)

- Missing title OR missing message.
- Expected: API returns **400** with required field error.

---

## TC-004 — Soldier Updates Profile (BMI Auto-Calculated)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST CASE ID   : TC-004                                                      │
│ TITLE          : Update height/weight and auto-calculate BMI                  │
│ MODULE         : Profile (Soldier Dashboard)                                  │
│ API ENDPOINT   : PATCH /api/profile?userId=<id>                               │
│ PRIORITY       : Medium                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Preconditions

- Soldier exists in database.
- Soldier profile page can load user data.

### Test Data

- `userId = <soldier-user-id>`
- Update body: `{ "height": 175, "weight": 80 }`

### Steps

1. Go to Soldier Dashboard → Profile.
2. Change **Height** to 175.
3. Change **Weight** to 80.
4. Click **Save / Update Profile**.

### Expected Result

- API returns **200 OK** with updated profile.
- Database fields updated:
  - `height = 175`, `weight = 80`
  - `bmi` updated using: $BMI = \frac{w}{(h/100)^2}$
- BMI calculation:
  - $BMI = 80 / (1.75^2) = 26.1$ (rounded to 1 decimal)
- UI shows BMI category consistent with BMI chart.

### Validation (Negative Test)

- Send fields not in allowed list.
- Expected: API ignores disallowed fields or returns `No valid fields to update`.

---

## TC-005 — View High-Risk Soldiers (Unfit)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST CASE ID   : TC-005                                                      │
│ TITLE          : Fetch & display all Unfit soldiers as high-risk list         │
│ MODULE         : High-Risk Monitoring (Clerk/Adjutant Dashboard)              │
│ API ENDPOINT   : GET /api/high-risk-soldiers                                  │
│ PRIORITY       : High                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Preconditions

- Database contains at least one soldier with `fitnessStatus = "Unfit"`.

### Steps

1. Open Adjutant or Clerk Dashboard → High-Risk Soldiers section.
2. System calls `GET /api/high-risk-soldiers`.
3. Verify list entries and counts.

### Expected Result

- API returns **200 OK**.
- Response includes:
  - `highRiskSoldiers: [...]`
  - `totalRiskCount: <number>`
- Every soldier in `highRiskSoldiers` has `fitnessStatus = "Unfit"`.
- Soldiers are sorted by name.
- UI shows correct total and renders each soldier with a risk label.

### Edge Case

- If no unfit soldiers exist:
  - `highRiskSoldiers: []`
  - `totalRiskCount: 0`
  - UI shows an empty-state message.

---

## Completion Checklist

```
[ ] TC-001 executed and verified
[ ] TC-002 executed and verified
[ ] TC-003 executed and verified
[ ] TC-004 executed and verified
[ ] TC-005 executed and verified
```
