const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("=== DAFTAR USER DI DATABASE ===");
  users.forEach(u => {
    console.log(`Nama: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
