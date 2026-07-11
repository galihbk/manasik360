import { Module } from '@nestjs/common';
import { AuthController, LearningAuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, LearningAuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
