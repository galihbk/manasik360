import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { AuthService } from '../auth/auth.service';

@Controller('learning')
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly authService: AuthService
  ) {}

  @Get('super-admin/stats')
  async getSuperAdminStats(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.getStats(user);
  }

  @Get('super-admin/tenants')
  async getSuperAdminTenants(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.getTenants(user);
  }

  @Get('super-admin/vouchers')
  async getSuperAdminVouchers(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.getVouchers(user);
  }

  @Get('super-admin/users')
  async getSuperAdminUsers(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.getUsers(user);
  }

  @Post('super-admin/vouchers/prices')
  async updateSuperAdminVoucherPrice(
    @Body() body: { packageType: string; price: number },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.updateVoucherPrice(body, user);
  }

  @Post('super-admin/tenants')
  async createSuperAdminTenant(
    @Body() body: { name: string; adminEmail: string; adminName: string },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.createTenant(body, user);
  }

  // --- BLOG ENDPOINTS ---

  @Get('super-admin/blogs')
  async getSuperAdminBlogs(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.getBlogs(user);
  }

  @Post('super-admin/blogs')
  async createSuperAdminBlog(
    @Body() body: { title: string; content: string; published?: boolean },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.createBlog(body, user);
  }

  @Post('super-admin/blogs/:id')
  async updateSuperAdminBlog(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; published?: boolean },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.updateBlog(id, body, user);
  }

  @Delete('super-admin/blogs/:id')
  async deleteSuperAdminBlog(
    @Param('id') id: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.superAdminService.deleteBlog(id, user);
  }
}
