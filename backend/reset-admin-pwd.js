const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  
  const updatedUser = await prisma.user.update({
    where: { email: 'admin@bahrain.com' },
    data: { 
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  
  console.log(`=== BERHASIL RESET PASSWORD SUPER ADMIN ===`);
  console.log(`Email: ${updatedUser.email}`);
  console.log(`Password Baru: adminpassword`);
  console.log(`Role: ${updatedUser.role}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
