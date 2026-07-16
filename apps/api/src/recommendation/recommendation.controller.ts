import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { RecommendationService } from './recommendation.service';
import { AuthService } from '../auth/auth.service';

function getUploadDir() {
  const paths = [
    join(process.cwd(), 'apps/web/public/uploads'),
    join(process.cwd(), '../web/public/uploads'),
    join(process.cwd(), 'public/uploads')
  ];
  for (const p of paths) {
    const parentDir = join(p, '..');
    if (existsSync(parentDir)) {
      if (!existsSync(p)) {
        mkdirSync(p, { recursive: true });
      }
      return p;
    }
  }
  const fallback = join(process.cwd(), 'uploads');
  if (!existsSync(fallback)) {
    mkdirSync(fallback, { recursive: true });
  }
  return fallback;
}

@Controller('recommendations')
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly authService: AuthService
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, getUploadDir());
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      return { success: false, message: 'Upload failed' };
    }
    const path = `/uploads/${file.filename}`;
    return { success: true, url: path };
  }

  @Get('active')
  async getActiveRecommendations(@Query('target') target: string) {
    const data = await this.recommendationService.getActiveRecommendations(target || 'public');
    return { success: true, recommendations: data };
  }

  @Get()
  async getAllRecommendations(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    const data = await this.recommendationService.getAllRecommendations(user);
    return { success: true, recommendations: data };
  }

  @Post()
  async createRecommendation(
    @Body() body: any,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    const data = await this.recommendationService.createRecommendation(body, user);
    return { success: true, recommendation: data };
  }

  @Put(':id')
  async updateRecommendation(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    const data = await this.recommendationService.updateRecommendation(id, body, user);
    return { success: true, recommendation: data };
  }

  @Delete(':id')
  async deleteRecommendation(
    @Param('id') id: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.recommendationService.deleteRecommendation(id, user);
  }
}
