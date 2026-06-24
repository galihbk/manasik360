const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@bahrain.com';
  const hashedPassword = await bcrypt.hash('Admin360!', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email: adminEmail,
      name: 'Super Admin Bahrain',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin account created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
