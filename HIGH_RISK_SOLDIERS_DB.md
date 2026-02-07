# High Risk Soldiers - Database Integration

## Overview

Updated the High Risk Soldiers box on the clerk home page to display real data from the database instead of hardcoded mock data.

## What Was Implemented

### 1. New API Endpoint

**File:** `/app/api/high-risk-soldiers/route.ts`

- **Method:** GET
- **Purpose:** Fetch high-risk soldiers from the database
- **Logic:**
  - Queries all soldiers with `fitnessStatus = 'Unfit'`
  - Transforms them into HighRiskSoldier format
  - Marks them as "Low Fitness" risk type
  - Returns ordered by name

**Response:**

```json
{
  "highRiskSoldiers": [
    {
      "id": "soldier-id",
      "name": "Sgt. Ahmed",
      "serviceNo": "202114193",
      "rank": "Sergeant",
      "riskType": "Low Fitness",
      "status": "Below fitness threshold - Unfit status",
      "lastTestScore": 0
    }
  ],
  "totalRiskCount": 1
}
```

### 2. Updated Clerk Home Page

**File:** `/app/dashboard/clerk/home/page.tsx`

**Changes:**

1. Changed `highRiskSoldiers` from static state to managed state with `setHighRiskSoldiers`
2. Added new `useEffect` to fetch high-risk soldiers on component mount
3. Automatically updates the stats with actual high-risk soldier count
4. Includes fallback to mock data if API fails
5. Includes proper error handling and logging

**Before:**

```typescript
const [highRiskSoldiers] = useState<HighRiskSoldier[]>(mockHighRiskSoldiers);
```

**After:**

```typescript
const [highRiskSoldiers, setHighRiskSoldiers] = useState<HighRiskSoldier[]>([]);

useEffect(() => {
  const fetchHighRiskSoldiers = async () => {
    const response = await fetch("/api/high-risk-soldiers");
    const data = await response.json();
    setHighRiskSoldiers(data.highRiskSoldiers);
    // Update stats count
    setStats((prevStats) => ({
      ...prevStats,
      highRiskSoldiers: data.highRiskSoldiers.length,
    }));
  };
  fetchHighRiskSoldiers();
}, []);
```

## How It Works

### Data Flow:

1. Clerk home page mounts
2. `useEffect` fetches from `/api/high-risk-soldiers`
3. API queries database for all Unfit soldiers
4. Returns list of high-risk soldiers (all Unfit soldiers)
5. Page displays with dynamic data and count

### Example:

If there are 3 soldiers with "Unfit" status:

- **High Risk Soldiers count:** 3 Alerts
- **Display:** All 3 soldiers shown in the box with:
  - Name, Rank, Service Number
  - Risk Type: "Low Fitness"
  - Status: "Below fitness threshold - Unfit status"

## Benefits

✅ Real-time data from database
✅ Automatically updates as soldiers' fitness status changes
✅ No manual intervention needed
✅ Fallback to mock data if API fails
✅ Proper error handling and logging
✅ Stats count updates automatically

## Integration with Existing Features

- Works seamlessly with fitness status auto-calculation
- When clerk marks exercises, if pass rate drops below 80%, soldier becomes "Unfit"
- Unfit soldiers automatically appear in High Risk Soldiers box
- Stats count updates to reflect current high-risk count

## Testing

To test this feature:

1. Navigate to `/dashboard/clerk/home`
2. View "High Risk Soldiers" box
3. Mark exercises for a soldier with low pass rate
4. Check browser console for fetch logs
5. High Risk Soldiers list will update automatically once status calculation completes
