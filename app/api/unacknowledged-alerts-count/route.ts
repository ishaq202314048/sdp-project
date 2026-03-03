import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqlitecloud-client";

// GET - count unacknowledged alerts for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();

    // Get all acknowledged alert IDs for this user
    const acknowledgedRows = await db.sql`SELECT alertId FROM AcknowledgedAlert WHERE acknowledgedBy = ${userId}`;
    const acknowledgedIds = new Set(
      Array.isArray(acknowledgedRows) ? acknowledgedRows.map((r: { alertId: string }) => r.alertId) : []
    );

    // Count potential alerts (same logic as reports page)
    let alertCount = 0;
    const unackedAlerts: string[] = [];

    // Check for unfit soldiers
    const unfitSoldiers = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND fitnessStatus = 'Unfit'`;
    if (Array.isArray(unfitSoldiers) && unfitSoldiers[0]?.count > 0 && !acknowledgedIds.has("unfit-soldiers")) {
      alertCount++;
      unackedAlerts.push("unfit-soldiers");
    }

    // Check for soldiers missing BMI
    const noBmi = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND (bmi IS NULL OR bmi = 0)`;
    if (Array.isArray(noBmi) && noBmi[0]?.count > 0 && !acknowledgedIds.has("missing-bmi")) {
      alertCount++;
      unackedAlerts.push("missing-bmi");
    }

    // Check for soldiers missing medical category
    const noMedCat = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND (medicalCategory IS NULL OR medicalCategory = '')`;
    if (Array.isArray(noMedCat) && noMedCat[0]?.count > 0 && !acknowledgedIds.has("missing-medcat")) {
      alertCount++;
      unackedAlerts.push("missing-medcat");
    }

    // Check IPFT date
    const ipftRows = await db.sql`SELECT date FROM IpftDate ORDER BY createdAt DESC LIMIT 1`;
    if (Array.isArray(ipftRows) && ipftRows.length > 0) {
      const ipftDate = new Date(ipftRows[0].date);
      const daysLeft = Math.ceil((ipftDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft <= 0 && !acknowledgedIds.has("ipft-passed")) {
        alertCount++;
        unackedAlerts.push("ipft-passed");
      } else if (daysLeft <= 7 && daysLeft > 0 && !acknowledgedIds.has("ipft-soon")) {
        alertCount++;
        unackedAlerts.push("ipft-soon");
      } else if (daysLeft <= 30 && daysLeft > 7 && !acknowledgedIds.has("ipft-upcoming")) {
        alertCount++;
        unackedAlerts.push("ipft-upcoming");
      }
    } else {
      if (!acknowledgedIds.has("no-ipft")) {
        alertCount++;
        unackedAlerts.push("no-ipft");
      }
    }

    // Check for missing fitness plans
    const fitPlans = await db.sql`SELECT COUNT(*) as count FROM FitnessPlan WHERE status = 'Fit'`;
    if (Array.isArray(fitPlans) && fitPlans[0]?.count === 0 && !acknowledgedIds.has("no-fit-plan")) {
      alertCount++;
      unackedAlerts.push("no-fit-plan");
    }

    const unfitPlans = await db.sql`SELECT COUNT(*) as count FROM FitnessPlan WHERE status = 'Unfit'`;
    if (Array.isArray(unfitPlans) && unfitPlans[0]?.count === 0 && !acknowledgedIds.has("no-unfit-plan")) {
      alertCount++;
      unackedAlerts.push("no-unfit-plan");
    }

    // Note: Clerk reports are NOT counted for the red dot notification.
    // The red dot only shows for fitness/health alerts (unfit soldiers, missing BMI, MEDCAT, IPFT, plans).

    console.log("[Unacknowledged Alerts Count]", { userId, count: alertCount, unackedAlerts, acknowledged: [...acknowledgedIds] });

    return NextResponse.json({ count: alertCount, unackedAlerts });
  } catch (error) {
    console.error("Error counting unacknowledged alerts:", error);
    return NextResponse.json({ count: 0 });
  }
}
