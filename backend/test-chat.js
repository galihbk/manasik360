const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.chatMessage.count();
  console.log("=== KONEKSI CHAT DATABASE BERHASIL ===");
  console.log("Jumlah pesan chat di DB:", count);
}

main()
  .catch(err => {
    console.error("=== ERROR KONEKSI CHAT ===");
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
