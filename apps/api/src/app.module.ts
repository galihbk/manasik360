import { Module, Controller, Get } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LearningModule } from './learning/learning.module';
import { AuthModule } from './auth/auth.module';
import { VoucherModule } from './voucher/voucher.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ChatModule } from './chat/chat.module';
import { BlogModule } from './blog/blog.module';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VoucherModule,
    LearningModule,
    SuperAdminModule,
    ChatModule,
    BlogModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
