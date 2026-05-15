const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@manasik360.com' }
  });
  console.log('DATABASE_RESULT:', JSON.stringify(user ? { email: user.email, role: user.role } : 'NOT FOUND'));
}

check().finally(() => prisma.$disconnect());
