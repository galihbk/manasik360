const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://bahrain_user:bahrain_password@127.0.0.1:5499/bahrain_db?schema=public"
    }
  }
});

async function main() {
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: 'REDEEM_VOUCHER'
    }
  });
  console.log("=== REDEEM AUDIT LOGS ===");
  console.log(JSON.stringify(auditLogs, null, 2));

  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  console.log(JSON.stringify(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, tenantId: u.tenantId })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
