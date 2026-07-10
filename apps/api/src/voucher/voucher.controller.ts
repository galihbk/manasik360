import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { AuthService } from '../auth/auth.service';

@Controller('learning')
export class VoucherController {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly authService: AuthService
  ) {}

  @Post('vouchers/redeem')
  async redeemVoucher(
    @Body() body: { code: string },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.redeemVoucher(body.code, user);
  }

  @Post('vouchers')
  async createVoucher(
    @Body() body: { code?: string; maxUses?: number; description?: string; packageType?: 'hajj' | 'umroh'; isPaid?: boolean },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.createVoucher(body, user);
  }

  @Get('vouchers/prices')
  async getVoucherPrices() {
    return this.voucherService.getVoucherPrices();
  }

  @Delete('vouchers/:code')
  async deleteVoucher(
    @Param('code') code: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.deleteVoucher(code, user);
  }

  @Get('vouchers/:id')
  async getSingleVoucher(
    @Param('id') id: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.getSingleVoucher(id, user);
  }

  @Post('vouchers/:id/confirm-payment')
  async confirmVoucherPayment(
    @Param('id') id: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.confirmVoucherPayment(id, user);
  }

  @Get('org-dashboard')
  async getOrgDashboard(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.voucherService.getOrgDashboard(user);
  }
}
