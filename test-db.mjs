import { config } from 'dotenv';
import { Database } from '@sqlitecloud/drivers';

config();

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const db = new Database(process.env.DATABASE_URL);

try {
  const users = await db.sql`SELECT id, email, fullName, userType, password, approved FROM User LIMIT 5`;
  console.log('Users found:', JSON.stringify(users, null, 2));
} catch (error) {
  console.error('Database error:', error.message);
}
