# Quick Start: Weekly Fitness Plans

## The Big Picture

Adjutants create weekly workout routines → Saved in database → Soldiers see routines based on their fitness status.

---

## For Adjutants: Create a Routine

1. **Log in as Adjutant**
   - Email: `adjutant@example.com` (or your adjutant account)

2. **Open Adjutant Dashboard**
   - URL: `/dashboard/adjutant`

3. **Scroll to "Create Weekly Plan"**
   - Fill in the form:
   - **Plan Title**: e.g., "January Advanced Training"
   - **Status**: Choose "Fit" (green) or "Unfit" (orange)

4. **Add Exercises for Each Day**
   - Day Selector: Sunday through Saturday
   - Exercise Fields:
     - Name: e.g., "5K Run"
     - Duration: e.g., "30 min"
     - Focus: e.g., "Cardio"
   - Add Multiple: Click "Add Exercise" for more per day
   - Remove: Click remove button to delete exercise

5. **Preview Your Week**
   - Grid shows which days have exercises
   - Days with no exercises are "Rest Days"

6. **Create Plan**
   - Click "Create Fit Weekly Plan" (or Unfit)
   - See success message with plan ID
   - Plan is now saved to database

---

## For Soldiers: View Your Routine

1. **Log in as Soldier**
   - Email: `soldier@example.com` (or your soldier account)

2. **Open Fitness Dashboard**
   - URL: `/dashboard/soldier/fitness`

3. **Check Fitness Status**
   - Top of page: "Fit" or "Unfit" selector
   - Your current status determines which routine you see

4. **Scroll to "Your Weekly Routine"**
   - Card automatically shows routine for your status
   - **Color Coded**:
     - Green: Fit soldiers routine
     - Orange: Unfit soldiers routine

5. **View Your Schedule**
   - 7-day grid layout
   - Each day shows:
     - Exercise name
     - Duration
     - Focus area
   - Rest Days marked as "Rest Day"

6. **Follow Your Routine**
   - Complete exercises as scheduled
   - Progress tracked in fitness page stats

---

## Under the Hood

### Database

- Routines stored in SQLite (`users.db`)
- FitnessPlan table indexed by status
- Fast lookups for Fit vs Unfit plans

### API Endpoints

```
GET /api/fitness/plans?status=Fit
  Get most recent Fit routine

POST /api/fitness/plans
  Create new routine (adjutants)
```

### Frontend

- Adjutant form: Create routine
- Soldier page: Display routine

---

## Example Workflow

### Step 1: Adjutant Creates Plan

```
Adjutant logs in
→ Opens Adjutant Dashboard
→ Scrolls to "Create Weekly Plan"
→ Enters:
  - Title: "January Training"
  - Status: Fit
  - Sunday: 5K Run, 30 min, Cardio
  - Monday: Core Strength, 20 min, Core
  - Rest: Rest Days
→ Clicks "Create Fit Weekly Plan"
→ Success: "Plan created (id: abc123)"
```

### Step 2: Soldier Sees Plan

```
Soldier logs in
→ Opens Fitness Dashboard
→ Fitness status: Fit (green)
→ Scrolls to "Your Weekly Routine"
→ Sees green card: "January Training for Fit Soldiers"
→ Grid shows:
  - Sunday: 5K Run (30 min, Cardio)
  - Monday: Core Strength (20 min, Core)
  - Tuesday-Saturday: Rest Day
→ Soldier follows routine
```

### Step 3: Create Unfit Routine

```
Adjutant creates new plan
→ Title: "Beginner Training"
→ Status: Unfit
→ Add lighter exercises
→ Soldiers with Unfit status see this routine instead
```

---

## Troubleshooting

### Plan Not Showing?

1. Check fitness status (Fit/Unfit selector)
2. Verify adjutant created plan for that status
3. Refresh page (browser refresh)
4. Check browser console for errors

### Plan Not Saving?

1. Verify all fields are filled (title, at least 1 exercise)
2. Check internet connection
3. Check browser console for error messages
4. Verify you're logged in as adjutant

### Wrong Routine Showing?

1. Double-check fitness status selector
2. Verify adjutant created plan for that status
3. Multiple plans? Most recent is shown
4. Clear browser cache and refresh

---

## What's Next?

### Coming Features

- **Plan Assignment**: Assign specific plans to soldier groups
- **Plan History**: See all routines created
- **Plan Editing**: Modify existing routines
- **Analytics**: Track soldier performance on routines

---

## File Locations

**Core Files**:

- Form: `/app/dashboard/adjutant/home/page.tsx`
- Display: `/app/dashboard/soldier/fitness/page.tsx`
- API: `/app/api/fitness/plans/route.ts`
- Database: `/prisma/schema.prisma`

**Documentation**:

- Full technical guide: `WEEKLY_PLAN_INTEGRATION.md`
- Feature overview: `FEATURE_COMPLETE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`

---

## Support

For issues or questions:

1. Check error messages in browser console
2. Review documentation files
3. Verify database is running
4. Check environment variables in `.env`

---

**Status: Ready to Use! 🚀**

All features working, fully tested, and production-ready.
