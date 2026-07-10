import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VoucherService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueVoucherCode(prefix: string, length = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      attempts++;
      let randomPart = '';
      for (let i = 0; i < length; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `${prefix}-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}`;

      const existing = await this.prisma.voucher.findUnique({
        where: { code }
      });
      if (!existing) {
        isUnique = true;
      }
    }
    return code;
  }

  async redeemVoucher(code: string, user: any) {
    if (!code) {
      throw new BadRequestException('Voucher code is required.');
    }

    const voucher = await this.prisma.voucher.findUnique({
      where: { code }
    });

    if (!voucher) {
      throw new BadRequestException('Voucher code tidak valid atau tidak terdaftar.');
    }

    if (voucher.currentUses >= voucher.maxUses) {
      throw new BadRequestException('Kuota penukaran voucher ini telah habis.');
    }

    if (voucher.pricePaid === 0) {
      throw new BadRequestException('Voucher ini belum dilunasi oleh Biro Anda.');
    }

    const updatedVoucher = await this.prisma.voucher.update({
      where: { id: voucher.id },
      data: { currentUses: { increment: 1 } }
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId: user.tenantId,
        userId: user.id,
        action: 'REDEEM_VOUCHER',
        entityName: 'Voucher',
        entityId: voucher.id,
        newValues: {
          voucherCode: code,
          userName: user.name,
          userEmail: user.email,
          parentVoucherId: voucher.id,
          parentVoucherCode: voucher.code,
          packageType: voucher.packageType
        }
      }
    });

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SUBSCRIPTION',
        title: 'Aktivasi Paket Berhasil',
        message: `Paket ${voucher.packageType === 'hajj' ? 'Haji' : 'Umrah'} Premium Anda telah berhasil diaktifkan via voucher. Silakan kunjungi menu Pembelajaran Saya.`
      }
    });

    return {
      success: true,
      message: `Voucher "${code}" (${voucher.packageType === 'hajj' ? 'Haji' : 'Umrah'}) berhasil digunakan! Silakan ikuti modul belajar Anda.`,
      voucher: updatedVoucher
    };
  }

  async createVoucher(
    body: { code?: string; maxUses?: number; description?: string; packageType?: 'hajj' | 'umroh'; isPaid?: boolean },
    user: any
  ) {
    const maxUses = body.maxUses || 1;
    const packageType = body.packageType || 'hajj';
    const isPaid = body.isPaid || false;

    const prices = await this.prisma.voucherPrice.findMany();
    const hajjPrice = prices.find((p: any) => p.packageType === 'hajj')?.price || 100000;
    const umrahPrice = prices.find((p: any) => p.packageType === 'umroh')?.price || 100000;
    const pricePerUnit = packageType === 'hajj' ? hajjPrice : umrahPrice;
    const totalPrice = maxUses * pricePerUnit;

    const prefix = packageType === 'hajj' ? 'HAJ' : 'UMR';
    const finalCode = body.code || (await this.generateUniqueVoucherCode(prefix, 8));

    const voucher = await this.prisma.voucher.create({
      data: {
        tenantId: user.tenantId,
        code: finalCode,
        maxUses,
        currentUses: 0,
        packageType,
        pricePaid: isPaid ? totalPrice : 0,
        metadata: {
          description: body.description || 'Pemesanan Rombongan',
          pricePerUnit,
          totalPrice
        }
      }
    });

    const childVouchersData = [];
    const childPrefix = packageType === 'hajj' ? 'HAJ' : 'UMR';
    
    for (let i = 0; i < maxUses; i++) {
      const childCode = await this.generateUniqueVoucherCode(childPrefix, 8);
      childVouchersData.push({
        tenantId: user.tenantId,
        code: childCode,
        maxUses: 1,
        currentUses: 0,
        packageType,
        pricePaid: isPaid ? pricePerUnit : 0,
        metadata: {
          parentVoucherId: voucher.id,
          parentVoucherCode: voucher.code,
          isChild: true,
          description: `Voucher Rombongan ${voucher.code} - Jemaah #${i+1}`
        }
      });
    }

    if (isPaid) {
      await this.prisma.voucher.createMany({
        data: childVouchersData
      });
    }

    return {
      success: true,
      message: isPaid 
        ? `Voucher Group "${finalCode}" (${packageType === 'hajj' ? 'Haji' : 'Umrah'}) berhasil dibuat! Sebanyak ${maxUses} kode voucher individual jemaah telah digenerate.`
        : `Pesanan Rombongan "${finalCode}" (${packageType === 'hajj' ? 'Haji' : 'Umrah'}) berhasil disiapkan. Silakan lakukan pembayaran.`,
      voucher: {
        ...voucher,
        totalPrice,
        pricePerUnit
      }
    };
  }

  async getVoucherPrices() {
    const prices = await this.prisma.voucherPrice.findMany();
    const hajjPrice = prices.find((p: any) => p.packageType === 'hajj')?.price;
    const umrahPrice = prices.find((p: any) => p.packageType === 'umroh')?.price;
    
    if (hajjPrice === undefined || umrahPrice === undefined) {
      throw new BadRequestException('Harga paket belum terdaftar di database.');
    }
    
    return { hajj: hajjPrice, umroh: umrahPrice };
  }

  async deleteVoucher(code: string, user: any) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code }
    });

    if (!voucher) {
      throw new BadRequestException('Voucher code tidak ditemukan.');
    }

    if (voucher.tenantId !== user.tenantId) {
      throw new ForbiddenException('Anda tidak berhak menghapus voucher milik tenant lain.');
    }

    await this.prisma.voucher.delete({
      where: { id: voucher.id }
    });

    return { success: true, message: `Voucher "${code}" berhasil dihapus.` };
  }

  async getSingleVoucher(id: string, user: any) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id }
    });

    if (!voucher) {
      throw new BadRequestException('Voucher tidak ditemukan.');
    }

    if (voucher.tenantId !== user.tenantId) {
      throw new ForbiddenException('Akses ditolak.');
    }

    return voucher;
  }

  async confirmVoucherPayment(id: string, user: any) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id }
    });

    if (!voucher) {
      throw new BadRequestException('Voucher group tidak ditemukan.');
    }

    if (voucher.tenantId !== user.tenantId) {
      throw new ForbiddenException('Akses ditolak.');
    }

    const meta = (voucher.metadata as any) || {};
    const totalPrice = meta.totalPrice || voucher.maxUses * 100000;
    const pricePerUnit = meta.pricePerUnit || 100000;

    const updated = await this.prisma.voucher.update({
      where: { id },
      data: { pricePaid: totalPrice }
    });

    const childVouchersData = [];
    const childPrefix = voucher.packageType === 'hajj' ? 'HAJ' : 'UMR';
    
    for (let i = 0; i < voucher.maxUses; i++) {
      const childCode = await this.generateUniqueVoucherCode(childPrefix, 8);
      childVouchersData.push({
        tenantId: user.tenantId,
        code: childCode,
        maxUses: 1,
        currentUses: 0,
        packageType: voucher.packageType,
        pricePaid: pricePerUnit,
        metadata: {
          parentVoucherId: voucher.id,
          parentVoucherCode: voucher.code,
          isChild: true,
          description: `Voucher Rombongan ${voucher.code} - Jemaah #${i+1}`
        }
      });
    }

    await this.prisma.voucher.createMany({
      data: childVouchersData
    });

    return {
      success: true,
      message: `Pembayaran Voucher Group "${voucher.code}" berhasil dikonfirmasi! Kuota individual aktif.`,
      voucher: updated
    };
  }

  async getOrgDashboard(user: any) {
    // Verify the user is indeed an ORG_ADMIN or has Biro role/permissions
    if (user.role !== 'ORG_ADMIN' && user.role !== 'ORG_ADMIN' && user.role !== 'ORG ADMIN' && !user.name.toLowerCase().includes('biro')) {
      throw new UnauthorizedException('Access denied. Only organization administrators can access the organization dashboard.');
    }

    // Fetch all REDEEM_VOUCHER logs under this Biro's tenant
    const redeemLogs = await this.prisma.auditLog.findMany({
      where: {
        tenantId: user.tenantId,
        action: 'REDEEM_VOUCHER',
        entityName: 'Voucher'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Deduplicate: keep only latest redeem per user per voucher
    const seenUserVoucher = new Set<string>();
    const uniqueRedeemLogs = redeemLogs.filter((log: any) => {
      const key = `${log.userId}-${log.entityId}`;
      if (seenUserVoucher.has(key)) return false;
      seenUserVoucher.add(key);
      return true;
    });

    // Collect all pilgrim userIds from redeem logs
    const pilgrimUserIds = [...new Set(uniqueRedeemLogs.map((l: any) => l.userId).filter(Boolean))] as string[];

    // Fetch actual user records for progress/score data
    const pilgrimUsers = await this.prisma.user.findMany({
      where: { id: { in: pilgrimUserIds } }
    });
    const userMap = new Map<string, any>(pilgrimUsers.map((u: any) => [u.id, u]));

    // Fetch learning progress for all these pilgrims
    const allCompletedLogs = await this.prisma.auditLog.findMany({
      where: { userId: { in: pilgrimUserIds }, action: 'COMPLETE', entityName: 'Lesson' }
    });
    const userCompletedCount = new Map<string, number>();
    allCompletedLogs.forEach((log: any) => {
      if (log.userId) {
        userCompletedCount.set(log.userId, (userCompletedCount.get(log.userId) || 0) + 1);
      }
    });

    const allProgressLogs = await this.prisma.auditLog.findMany({
      where: { userId: { in: pilgrimUserIds }, action: 'LESSON_PROGRESS', entityName: 'Lesson' },
      orderBy: { createdAt: 'desc' }
    });
    const userLatestScores = new Map<string, number[]>();
    allProgressLogs.forEach((log: any) => {
      if (log.userId && log.newValues && typeof (log.newValues as any).quizScore === 'number') {
        const scores = userLatestScores.get(log.userId) || [];
        scores.push((log.newValues as any).quizScore);
        userLatestScores.set(log.userId, scores);
      }
    });

    const totalHajjLessons = 12;
    const mappedPilgrims = uniqueRedeemLogs.map((log: any) => {
      const vals = (log.newValues as any) || {};
      const u = userMap.get(log.userId);
      const completedCount = userCompletedCount.get(log.userId) || 0;
      const progressPercent = Math.round((completedCount / totalHajjLessons) * 100);
      const scores = userLatestScores.get(log.userId) || [];
      const avgQuizScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

      return {
        id: log.userId || log.id,
        name: vals.userName || u?.name || 'Jemaah',
        email: vals.userEmail || u?.email || '-',
        role: u?.role || 'LEARNER',
        progress: progressPercent,
        completedCount,
        avgQuizScore,
        status: progressPercent === 100 ? 'Completed' : progressPercent > 0 ? 'In Progress' : 'Not Started',
        joinedAt: log.createdAt,
        voucherCode: vals.voucherCode || null,
        parentVoucherId: vals.parentVoucherId || null,
        parentVoucherCode: vals.parentVoucherCode || null,
        groupDescription: vals.groupDescription || null,
        packageType: vals.packageType || 'hajj'
      };
    });

    // Fetch all voucher orders created by this Biro
    const biroVouchers = await this.prisma.voucher.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' }
    });

    const groups = biroVouchers.filter((v: any) => !v.metadata?.isChild);
    const pilgrimsWithVouchers = biroVouchers.filter((v: any) => v.metadata?.isChild);

    const stats = {
      totalVouchersOrdered: groups.reduce((acc: number, curr: any) => acc + curr.maxUses, 0),
      totalVouchersRedeemed: pilgrimsWithVouchers.filter((v: any) => v.currentUses > 0).length,
      totalPaymentPaid: groups.reduce((acc: number, curr: any) => acc + (curr.pricePaid > 0 ? curr.pricePaid : 0), 0),
      totalPaymentPending: groups.reduce((acc: number, curr: any) => acc + (curr.pricePaid === 0 ? (curr.metadata?.totalPrice || 0) : 0), 0)
    };

    return {
      success: true,
      stats,
      pilgrims: mappedPilgrims,
      vouchers: groups
    };
  }
}
