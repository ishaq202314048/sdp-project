const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const sessions = await prisma.loginSession.findMany({
      orderBy: { loginAt: 'desc' },
      take: 10, // Last 10 sessions
    });

    console.log('\nRecent Login Sessions:');
    console.table(sessions.map(s => ({
      'User ID': s.userId,
      'Email': s.email,
      'User Type': s.userType,
      'IP Address': s.ipAddress,
      'User Agent': s.userAgent?.substring(0, 40) + (s.userAgent?.length > 40 ? '...' : ''),
      'Login Time': s.loginAt.toISOString(),
    })));

    const totalSessions = await prisma.loginSession.count();
    console.log(`\nTotal login sessions recorded: ${totalSessions}`);

    // Group by user
    const sessionsByUser = await prisma.loginSession.groupBy({
      by: ['email'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    console.log('\nSessions by User:');
    console.table(sessionsByUser.map(s => ({
      'Email': s.email,
      'Total Logins': s._count.id,
    })));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
