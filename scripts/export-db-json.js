const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  const outDir = path.resolve(__dirname, '..', 'exports');
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, password: true, userType: true, serviceNo: true, fitnessStatus: true, createdAt: true } });
    const usersSanitized = users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      password_masked: u.password ? String(u.password).slice(0,6) + '...' : null,
      userType: u.userType,
      serviceNo: u.serviceNo,
      fitnessStatus: u.fitnessStatus,
      createdAt: u.createdAt,
    }));
    fs.writeFileSync(path.join(outDir, 'users.json'), JSON.stringify(usersSanitized, null, 2));

    const plans = await prisma.fitnessPlan.findMany({ orderBy: { createdAt: 'desc' } });
    const plansParsed = plans.map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      exercises: p.exercises ? JSON.parse(String(p.exercises)) : [],
      createdBy: p.createdBy,
      createdAt: p.createdAt,
    }));
    fs.writeFileSync(path.join(outDir, 'fitnessPlans.json'), JSON.stringify(plansParsed, null, 2));

    const assigns = await prisma.assignedPlan.findMany({ orderBy: { assignedAt: 'desc' } });
    fs.writeFileSync(path.join(outDir, 'assignedPlans.json'), JSON.stringify(assigns, null, 2));

    console.log('Exported to', outDir);
    console.log('users.json:', usersSanitized.length, 'rows');
    console.log('fitnessPlans.json:', plansParsed.length, 'rows');
    console.log('assignedPlans.json:', assigns.length, 'rows');
  } catch (e) {
    console.error('Export error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
