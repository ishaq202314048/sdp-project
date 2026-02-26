# TrackTroop — 4‑Minute Professional Demo Script (English)

Use this as a teleprompter script. It’s written to be **confident**, **teacher-friendly**, and **time-boxed**.

**Target duration:** ~3:45–4:00  
**Demo type:** Live running app + diagrams + test cases

---

## Scene 1 — Title + Objective (0:00–0:20)

“Hello everyone. I’m presenting **TrackTroop**, a troop fitness tracking system.

The main objective is to **track soldiers’ fitness status**, **record IPFT/fitness tests**, **assign training plans**, and **generate reports** for different stakeholders.

This system uses **role-based access** so each user sees only the features they need.”

---

## Scene 2 — Architecture proof (0:20–0:55)

(Show `diagrams/trooptrack-data-centered-architecture.html`)

“This is the **data-centered architecture**. The database is the single source of truth. Around it we have separate modules: authentication, soldier management, fitness plans, fitness tests, and reporting.

Because everything connects through the same data layer, we avoid duplication and keep reporting consistent.”

(Show `diagrams/trooptrack-dfd-level-0.html` quickly)

“And this is the **DFD context diagram**: external users interact with the system, the system processes requests through APIs, and data is stored and retrieved from the database.”

---

## Scene 3 — Login + role redirect (0:55–1:25)

(Go to `/auth/login`)

“Now I’ll demonstrate the live application. I’m logging in.

After login, the app redirects the user to the correct dashboard based on the stored role: **Adjutant**, **Clerk**, or **Soldier**.

This is important because each role has different responsibilities and permissions.”

**If login fails / no account available (fallback line):**

“If credentials are not available in this environment, the login flow still demonstrates the validation and the API request structure, and I’ll proceed by showing the role dashboards.”

---

## Scene 4 — Adjutant workflow (1:25–2:35)

(Open `/dashboard/adjutant/home`)

“As an **Adjutant**, the focus is unit readiness and oversight. From the home view, I can monitor overall status and key metrics.”

(Open `/dashboard/adjutant/soldiers`)

“Here, the Adjutant manages soldiers, including pending registrations. Approving a soldier is critical because it controls access to the system.”

**If no pending soldier exists (fallback line):**

“If there are no pending soldiers right now, the approval pipeline is still visible here: the system supports onboarding and controlled activation.”

(Open `/dashboard/adjutant/fitness-tests`)

“Next, fitness tests. The Adjutant can create an IPFT or fitness test record for a soldier. After submission, the soldier’s fitness status updates and becomes available in dashboards and reports.”

(Open `/dashboard/adjutant/alert`)

“This alert view lists **high-risk soldiers**—for example, soldiers below a threshold—so leadership can take early action.”

(Open `/dashboard/adjutant/reports`)

“And this is reporting. Charts and summaries are generated directly from stored fitness and soldier data to support data-driven decisions.”

---

## Scene 5 — Soldier view (2:35–3:15)

(Logout → login as Soldier OR directly open soldier pages if already authenticated)

“Now I’ll switch to the **Soldier** role.

On the Soldier side, the system is focused on clarity: upcoming IPFT date, assigned training plan, exercise schedule, and progress history.”

(Open `/dashboard/soldier/home`)

“This home page summarizes the soldier profile and shows assigned activities.”

(Open `/dashboard/soldier/progress` or `/dashboard/soldier/fitness`)

“Here the soldier can see progress trends and historical tests, and also view or download the assigned plan.”

---

## Scene 6 — Test cases evidence (3:15–3:45)

(Open `TrackTroop_Test_Cases.xlsx`)

“Finally, for validation and documentation, I prepared a professional test case file in a standard Excel format.

It includes coverage for **all frontend pages** and **all API endpoints**, including happy-path cases and authorization/negative test scenarios. It’s formatted with wrapping and borders for clean submission.”

---

## Scene 7 — Closing (3:45–4:00)

“To conclude: TrackTroop combines role-based dashboards, centralized data, analytics, and formal test documentation.

Thank you.”
