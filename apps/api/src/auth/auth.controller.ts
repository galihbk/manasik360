import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('learning')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.authService.getProfile(user);
  }

  @Post('profile')
  async updateProfile(
    @Body() body: { phone?: string; passportNumber?: string; address?: string; bio?: string },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.authService.updateProfile(user.id, body);
  }

  @Get('notifications')
  async getNotifications(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.authService.getNotifications(user);
  }
}
