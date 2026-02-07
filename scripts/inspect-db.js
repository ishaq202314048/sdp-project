const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const tables = await prisma.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    console.log('tables:');
    console.table(tables);

    const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, password: true, userType: true, serviceNo: true, fitnessStatus: true, createdAt: true } });
    console.log('\nusers:');
    if (users.length === 0) console.log('  (no users)');
    else console.table(users.map(u => ({ ...u, password: String(u.password).slice(0,6) + '...' })));

    const plans = await prisma.fitnessPlan.findMany({ orderBy: { createdAt: 'desc' } });
    console.log('\nfitnessPlans:');
    if (plans.length === 0) console.log('  (no plans)');
    else console.table(plans.map(p => ({ id: p.id, title: p.title, status: p.status, exercises_preview: String(p.exercises).slice(0,80) + '...', createdBy: p.createdBy, createdAt: p.createdAt })));

    const assigns = await prisma.assignedPlan.findMany({ orderBy: { assignedAt: 'desc' } });
    console.log('\nassignedPlans:');
    if (assigns.length === 0) console.log('  (no assignments)');
    else console.table(assigns);

    const sessions = await prisma.loginSession.findMany({ orderBy: { loginAt: 'desc' }, take: 10 });
    console.log('\nloginSessions (latest 10):');
    if (sessions.length === 0) console.log('  (no sessions)');
    else console.table(sessions.map(s => ({ userId: s.userId, email: s.email, userType: s.userType, ipAddress: s.ipAddress, loginAt: s.loginAt })));
  } catch (e) {
    console.error('Error inspecting DB:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
