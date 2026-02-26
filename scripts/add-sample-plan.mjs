// Add sample fitness plan to database
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const db = new Database('./users.db');

try {
  const id = randomUUID();
  const exercises = JSON.stringify([
    {
      day: "Sunday",
      items: [{ name: "5K Run", duration: "30 min", focus: "Cardio" }],
    },
    {
      day: "Monday",
      items: [{ name: "Core Strength", duration: "20 min", focus: "Core" }],
    },
    {
      day: "Tuesday",
      items: [{ name: "Upper Body", duration: "25 min", focus: "Strength" }],
    },
    {
      day: "Wednesday",
      items: [{ name: "Rest Day", duration: "0 min", focus: "Recovery" }],
    },
    {
      day: "Thursday",
      items: [{ name: "HIIT Workout", duration: "30 min", focus: "Cardio" }],
    },
    {
      day: "Friday",
      items: [{ name: "Lower Body", duration: "25 min", focus: "Strength" }],
    },
    {
      day: "Saturday",
      items: [{ name: "Long Run", duration: "45 min", focus: "Endurance" }],
    },
  ]);

  const stmt = db.prepare(`
    INSERT INTO FitnessPlan (id, title, status, exercises, createdBy, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, "Weekly Fit Routine", "Fit", exercises, "adjutant", new Date());

  console.log("✅ Sample plan created:", id);
  console.log("Title: Weekly Fit Routine");
  console.log("Status: Fit");
} catch (error) {
  console.error("❌ Error creating plan:", error);
} finally {
  db.close();
}
