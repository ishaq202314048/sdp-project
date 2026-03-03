import Database from '@sqlitecloud/drivers';

const db = new Database('sqlitecloud://cnmxfagodk.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=jOL95vqFRQe0HEJSHPzpJWbxuGINhRLkvkJPaNJMAjU');

try {
  await db.sql`CREATE TABLE IF NOT EXISTS Notification (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'clerk-report',
    fromUser TEXT,
    fromUserName TEXT,
    reportId TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`;
  console.log('✅ Notification table created successfully');

  const rows = await db.sql`SELECT name FROM sqlite_master WHERE type='table' AND name='Notification'`;
  console.log('Table exists:', rows);
} catch (err) {
  console.error('Error:', err);
}
