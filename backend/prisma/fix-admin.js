const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'admin@manasik360.com' },
      update: { password: hashedPassword, role: 'ADMIN' },
      create: {
        email: 'admin@manasik360.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user ready. Email: admin@manasik360.com, Password: admin123');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
