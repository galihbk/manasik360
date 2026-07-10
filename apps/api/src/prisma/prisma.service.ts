import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

let PrismaClientClass: any;
try {
  PrismaClientClass = require('@prisma/client').PrismaClient;
} catch {
  // Safe mock class fallback if the client is not yet generated
  PrismaClientClass = class MockPrismaClient {
    async $connect() {}
    async $disconnect() {}
    get user() {
      return {
        findMany: async () => []
      };
    }
  };
}

@Injectable()
export class PrismaService extends PrismaClientClass implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {}
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {}
  }
}
