# TrackTroop — Recording Checklist (4 min max)

Print or keep this open next to OBS while recording.

## Pre‑record (1 minute before you start)

- [ ] Start dev server (pnpm dev / npm run dev)
- [ ] Browser tabs ready:
  - [ ] http://localhost:3000
  - [ ] http://localhost:3000/auth/login
  - [ ] http://localhost:3000/dashboard/adjutant/home
  - [ ] http://localhost:3000/dashboard/adjutant/soldiers
  - [ ] http://localhost:3000/dashboard/adjutant/fitness-tests
  - [ ] http://localhost:3000/dashboard/adjutant/alert
  - [ ] http://localhost:3000/dashboard/adjutant/reports
  - [ ] http://localhost:3000/dashboard/soldier/home
  - [ ] http://localhost:3000/dashboard/soldier/progress (or /fitness)
- [ ] Local proof tabs ready:
  - [ ] `diagrams/trooptrack-data-centered-architecture.html`
  - [ ] `diagrams/trooptrack-dfd-level-0.html`
- [ ] Open Excel file:
  - [ ] `TrackTroop_Test_Cases.xlsx`

## On‑record timeline (goal: 3:45–4:00)

### 0:00–0:20

- [ ] Landing page: objective statement, scroll once

### 0:20–0:55

- [ ] Data-centered architecture HTML viewer
- [ ] DFD Level‑0 viewer (quick)

### 0:55–1:25

- [ ] Login page
- [ ] Login and show role redirect to adjutant dashboard

### 1:25–2:35 (Adjutant)

- [ ] Home (quick)
- [ ] Soldiers (pending/approve)
- [ ] Fitness tests (create view)
- [ ] Alert (high-risk)
- [ ] Reports (charts/pdf)

### 2:35–3:15 (Soldier)

- [ ] Soldier home
- [ ] Progress (or Fitness plan + PDF)

### 3:15–3:45

- [ ] Open `TrackTroop_Test_Cases.xlsx`
- [ ] Scroll a little; mention full coverage + formatting

### 3:45–4:00

- [ ] Closing summary

## Backup lines (if demo data is missing)

- “If there are no pending soldiers right now, the approval workflow is still visible and supported by the API.”
- “If this environment doesn’t have sample data, the UI still demonstrates the full workflow and endpoints; the charts populate when data exists.”
