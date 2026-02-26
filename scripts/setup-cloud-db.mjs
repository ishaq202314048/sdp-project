// Run this once to create all tables in SQLite Cloud:
// node scripts/setup-cloud-db.mjs

import { Database } from '@sqlitecloud/drivers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple .env loader (no dotenv dependency needed)
try {
  const envContent = readFileSync(join(__dirname, '../.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  }
} catch {
  // .env not found, assume env is already set
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}

const db = new Database(url);

const tables = [
  `CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT NOT NULL,
    userType TEXT NOT NULL,
    serviceNo TEXT UNIQUE,
    rank TEXT,
    unit TEXT,
    phone TEXT,
    address TEXT,
    emergencyContactName TEXT,
    emergencyContact TEXT,
    fitnessStatus TEXT,
    dateOfBirth TEXT,
    dateOfJoining TEXT,
    bloodGroup TEXT,
    height INTEGER,
    weight INTEGER,
    bmi REAL,
    medicalCategory TEXT,
    clerkServiceNo TEXT UNIQUE,
    clerkRank TEXT,
    clerkUnit TEXT,
    clerkRole TEXT,
    clerkDateOfJoining TEXT,
    clerkPhone TEXT,
    clerkAddress TEXT,
    clerkEmergencyContactName TEXT,
    clerkEmergencyContact TEXT,
    adjutantServiceNo TEXT UNIQUE,
    adjutantRank TEXT,
    adjutantUnit TEXT,
    adjutantDateOfJoining TEXT,
    adjutantPhone TEXT,
    adjutantAddress TEXT,
    adjutantEmergencyContactName TEXT,
    adjutantEmergencyContact TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS FitnessPlan (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    exercises TEXT NOT NULL,
    createdBy TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS AssignedPlan (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    planId TEXT NOT NULL,
    assignedBy TEXT,
    assignedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS LoginSession (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    email TEXT NOT NULL,
    userType TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    loginAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS FitnessTest (
    id TEXT PRIMARY KEY,
    soldierUserId TEXT NOT NULL,
    exerciseName TEXT NOT NULL,
    duration TEXT,
    result TEXT NOT NULL,
    score INTEGER,
    justifiedBy TEXT,
    justifiedAt TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS Report (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    sentBy TEXT NOT NULL,
    sentByName TEXT NOT NULL,
    sentTo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS IpftDate (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    setBy TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

async function setupDb() {
  console.log('Connecting to SQLite Cloud...');
  for (const sql of tables) {
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    try {
      await db.sql(sql);
      console.log(`✓ Table "${tableName}" ready`);
    } catch (err) {
      console.error(`✗ Failed to create "${tableName}":`, err);
    }
  }
  console.log('\nDatabase setup complete!');
  process.exit(0);
}

setupDb();
