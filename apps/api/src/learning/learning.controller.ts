import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { LearningService } from './learning.service';
import { AuthService } from '../auth/auth.service';

@Controller('learning')
export class LearningController {
  constructor(
    private readonly learningService: LearningService,
    private readonly authService: AuthService
  ) {}

  @Get('paths')
  async getPaths(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.getPaths(user);
  }

  @Post('lessons/:id/complete')
  async completeLesson(
    @Param('id') lessonId: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.completeLesson(lessonId, user);
  }

  @Post('lessons/:id/progress')
  async saveLessonProgress(
    @Param('id') lessonId: string,
    @Body() body: { activeTab: string; maxUnlockedStep: number; quizAnswers?: any; quizScore?: number | null },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.saveLessonProgress(lessonId, body, user);
  }

  @Get('certificates')
  async getCertificates(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.getCertificates(user);
  }

  @Get('subscription')
  async getSubscription(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.getSubscription(user);
  }

  @Post('subscription/buy')
  async buyPackage(
    @Body() body: { packageId: string },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.learningService.buyPackage(body, user);
  }
}
