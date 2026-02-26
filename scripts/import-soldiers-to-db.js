const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

(async () => {
  const prisma = new PrismaClient();
  try {
    const dataPath = path.resolve(__dirname, '..', 'data', 'users.json');
    if (!fs.existsSync(dataPath)) {
      console.error('data/users.json not found');
      process.exit(1);
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    const arr = JSON.parse(raw);
    // Import ALL user types (soldiers, clerks, adjutants, etc.)
    console.log('Found', arr.length, 'total users in data/users.json');

    let inserted = 0;
    let updated = 0;

    for (const u of arr) {
      const email = (u.email || '').trim().toLowerCase();
      if (!email) continue;

      const createData = {
        email,
        password: u.password,
        fullName: u.fullName || '',
        userType: u.userType || 'soldier',
        serviceNo: u.serviceNo ?? null,
      };
      if (u.id) createData.id = u.id;
      if (u.createdAt) createData.createdAt = new Date(u.createdAt);

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.user.update({ where: { email }, data: createData });
        updated++;
        console.log('Updated', email);
      } else {
        await prisma.user.create({ data: createData });
        inserted++;
        console.log('Inserted', email);
      }
    }

    console.log(`Done. inserted=${inserted}, updated=${updated}`);
  } catch (e) {
    console.error('Import error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
