import { Database } from '@sqlitecloud/drivers';

// Singleton: reuse DB connection across Next.js hot reloads in development
declare global {
  var _sqliteCloudDb: Database | undefined;
}

export function getDb(): Database {
  if (!global._sqliteCloudDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    global._sqliteCloudDb = new Database(url);
  }
  return global._sqliteCloudDb;
}

export type { Database };
