# Fitness Status Auto-Calculator Implementation

## Overview

Implemented automatic fitness status calculation based on soldier's pass rate in the last 7 days.

## What Was Implemented

### 1. New API Endpoint

**File:** `/app/api/fitness/calculate-status/route.ts`

- **Method:** POST
- **Query Parameter:** `userId` (soldier's ID)
- **Logic:**
  - Retrieves all fitness tests from the last 7 days
  - Only counts tests justified by a clerk (`justifiedBy` is not null)
  - Calculates pass rate: (Passed Tests / Total Tests) × 100
  - **Sets status to "Fit"** if pass rate ≥ 80%
  - **Sets status to "Unfit"** if pass rate < 80%
  - Updates User's fitnessStatus in database

**Response:**

```json
{
  "userId": "soldier-id",
  "totalTests": 5,
  "passedTests": 4,
  "failedTests": 1,
  "passRate": 80.0,
  "newStatus": "Fit",
  "message": "Status updated to Fit based on 80.00% pass rate"
}
```

### 2. Updated Clerk Component

**File:** `/app/dashboard/clerk/SoldiersList.tsx`

- Modified `submitMark()` function
- After saving a fitness test, automatically calls the `/api/fitness/calculate-status` endpoint
- Updates soldier's fitness status based on their recent pass rate
- Includes error handling and logging

**Flow:**

1. Clerk marks exercise for soldier (Pass/Fail)
2. Test saved to database via `/api/fitness-test/create`
3. Auto-calculate endpoint triggered: `/api/fitness/calculate-status?userId={soldierUserId}`
4. Soldier's fitness status automatically updated
5. Result logged to console

## How It Works

### Example Scenario 1 - Soldier Becomes Unfit

```
Last 7 days tests:
- Test 1: Push-ups → Fail
- Test 2: Run → Fail
- Test 3: Sit-ups → Pass
- Test 4: Swimming → Pass

Pass Rate: 2/4 = 50%
Result: Status set to "Unfit" ❌
```

### Example Scenario 2 - Soldier Becomes Fit

```
Last 7 days tests:
- Test 1: Push-ups → Pass
- Test 2: Run → Pass
- Test 3: Sit-ups → Pass
- Test 4: Swimming → Pass
- Test 5: Walk → Fail

Pass Rate: 4/5 = 80%
Result: Status set to "Fit" ✅
```

## Technical Details

### Database Interaction

- Uses Prisma ORM to query FitnessTest records
- Filters by:
  - `soldierUserId`: The soldier being evaluated
  - `createdAt >= sevenDaysAgo`: Tests from last 7 days only
  - `justifiedBy != null`: Only clerk-justified tests
- Updates User.fitnessStatus field

### Pass/Fail Logic

- Counts tests where `result === 'Pass'`
- Compares against total test count
- Threshold: 80% pass rate (≥80% = Fit, <80% = Unfit)

### Error Handling

- Returns 400 if userId is missing
- Returns 500 if database query fails
- Includes try-catch blocks
- Logs errors to console for debugging

## Files Modified

1. **`/app/dashboard/clerk/SoldiersList.tsx`**
   - Added call to calculate-status endpoint after submitting a mark
   - Added error handling for status update
   - Added console logging for tracking

2. **Created:** `/app/api/fitness/calculate-status/route.ts`
   - New endpoint for calculating fitness status
   - Full implementation with validation

## Testing the Feature

### Manual Test Steps

1. Navigate to `/dashboard/clerk/home`
2. Select a soldier
3. Mark exercises as Pass/Fail
4. Check console logs for status update message
5. Soldier's fitness status will auto-update based on pass rate

### Verify in Database

```sql
-- Check soldier's fitness status
SELECT id, email, fitnessStatus FROM User WHERE userType='soldier';

-- Check recent fitness tests
SELECT soldierUserId, exerciseName, result, createdAt FROM FitnessTest
WHERE soldierUserId='<soldier-id>'
ORDER BY createdAt DESC
LIMIT 10;
```

## Integration Points

- **Clerk Marks Exercise** → `/api/fitness-test/create`
- **Test Saved** → Auto-triggers `/api/fitness/calculate-status`
- **Status Updated** → User.fitnessStatus changes in database
- **Soldier Views Home** → Shows updated fitness status in badge/overview

## Notes

- Only considers tests from the **last 7 days**
- Only counts tests **justified by clerks** (not provisional/unknown tests)
- Status updates automatically - no manual intervention needed
- System calculates from current date/time
- Changes are persistent in SQLite database
