#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const dataFile = path.join(process.cwd(), 'data', 'users.json');

  if (!fs.existsSync(dataFile)) {
    console.log('No data/users.json file found — nothing to migrate.');
    await prisma.$disconnect();
    return;
  }

  const raw = fs.readFileSync(dataFile, 'utf-8');
  let users = [];
  try {
    users = JSON.parse(raw);
    if (!Array.isArray(users)) users = [];
  } catch (err) {
    console.error('Failed to parse data/users.json:', err);
    await prisma.$disconnect();
    process.exit(1);
  }

  let imported = 0;
  for (const u of users) {
    try {
      await prisma.user.upsert({
        where: { email: u.email.toLowerCase() },
        update: {},
        create: {
          id: u.id,
          email: u.email.toLowerCase(),
          password: u.password,
          fullName: u.fullName,
          userType: u.userType,
          serviceNo: u.serviceNo ?? null,
          createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
        },
      });
      imported += 1;
    } catch (err) {
      console.error('Failed to upsert user', u.email, err.message || err);
    }
  }

  console.log(`Imported/updated ${imported} users to Prisma SQLite DB.`);

  // backup the file after successful migration
  const backup = dataFile + '.bak.' + Date.now();
  fs.copyFileSync(dataFile, backup);
  console.log('Original users.json backed up to', backup);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
