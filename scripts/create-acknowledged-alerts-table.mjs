// Script to create AcknowledgedAlert table in SQLite Cloud
import { Database } from '@sqlitecloud/drivers';

const url = process.env.DATABASE_URL || "sqlitecloud://cnmxfagodk.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=jOL95vqFRQe0HEJSHPzpJWbxuGINhRLkvkJPaNJMAjU";

async function createTable() {
  const db = new Database(url);
  
  try {
    // Create the AcknowledgedAlert table
    await db.sql`
      CREATE TABLE IF NOT EXISTS AcknowledgedAlert (
        id TEXT PRIMARY KEY,
        alertId TEXT NOT NULL,
        acknowledgedBy TEXT NOT NULL,
        acknowledgedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(alertId, acknowledgedBy)
      )
    `;
    
    // Create indexes
    await db.sql`CREATE INDEX IF NOT EXISTS idx_acknowledged_by ON AcknowledgedAlert(acknowledgedBy)`;
    await db.sql`CREATE INDEX IF NOT EXISTS idx_alert_id ON AcknowledgedAlert(alertId)`;
    
    console.log("✅ AcknowledgedAlert table created successfully!");
    
    // Verify table exists
    const tables = await db.sql`SELECT name FROM sqlite_master WHERE type='table' AND name='AcknowledgedAlert'`;
    console.log("Table check:", tables);
    
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

createTable();
