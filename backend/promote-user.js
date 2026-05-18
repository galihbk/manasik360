const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updatedUser = await prisma.user.update({
    where: { email: 'net.galih7@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log(`=== HORE! USER BERHASIL DIPROMOSIKAN ===`);
  console.log(`Nama: ${updatedUser.name}`);
  console.log(`Email: ${updatedUser.email}`);
  console.log(`Role Baru: ${updatedUser.role}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
