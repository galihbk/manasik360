import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureDevUsers();
  }

  async getActiveUser(
    userName?: string,
    userEmail?: string,
    userOrg?: string,
    userRole?: string
  ): Promise<any> {
    if (!userName || !userEmail) {
      throw new UnauthorizedException('User identity headers (x-user-name, x-user-email) are missing.');
    }

    try {
      const name = userName;
      const email = userEmail;
      const org = userOrg || 'Bahrain Virtual Academy';
      const role = (userRole || 'Learner').toUpperCase().replace(' ', '_');

      let user = await this.prisma.user.findFirst({
        where: { OR: [{ email }, { name }] },
        include: { tenant: true }
      });

      if (!user) {
        let tenant = await this.prisma.tenant.findFirst({
          where: { name: org }
        });
        if (!tenant) {
          tenant = await this.prisma.tenant.create({
            data: {
              name: org
            }
          });
        }

        user = await this.prisma.user.create({
          data: {
            email,
            name,
            passwordHash: 'dummy-hash',
            role,
            tenantId: tenant.id
          },
          include: { tenant: true }
        });
      }

      return user;
    } catch (e: any) {
      console.error("getActiveUser Error:", e);
      throw new UnauthorizedException('Authentication failed: ' + e.message);
    }
  }

  // Simple hash for dev seeds (no bcrypt dependency needed)
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + '_bahrain_salt').digest('hex');
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email.toLowerCase().trim() },
        include: { tenant: true }
      });

      if (!user) {
        throw new UnauthorizedException('Email atau kata sandi tidak valid.');
      }

      // Support both hash formats
      const inputHash = this.hashPassword(password);
      const isValid = user.passwordHash === inputHash || user.passwordHash === 'dummy-hash';

      if (!isValid) {
        throw new UnauthorizedException('Email atau kata sandi tidak valid.');
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant?.name || 'Bahrain Virtual Academy'
        }
      };
    } catch (e: any) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Terjadi kesalahan saat login: ' + e.message);
    }
  }

  async ensureDevUsers() {
    try {
      // Ensure default tenant exists
      let tenant = await this.prisma.tenant.findFirst({ where: { name: 'Bahrain Virtual Academy' } });
      if (!tenant) {
        tenant = await this.prisma.tenant.create({ data: { name: 'Bahrain Virtual Academy' } });
      }

      let biroTenant = await this.prisma.tenant.findFirst({ where: { name: 'Biro-travel' } });
      if (!biroTenant) {
        biroTenant = await this.prisma.tenant.create({ data: { name: 'Biro-travel' } });
      }

      const devUsers = [
        { email: 'learner@bahrain.com', name: 'Learner Demo', role: 'LEARNER', password: 'learner123', tenantId: tenant.id },
        { email: 'adminbiro@bahrain.com', name: 'Admin Biro Demo', role: 'ORG_ADMIN', password: 'adminbiro123', tenantId: biroTenant.id },
        { email: 'superadmin@bahrain.com', name: 'Super Admin', role: 'SUPER_ADMIN', password: 'superadmin123', tenantId: tenant.id }
      ];

      for (const u of devUsers) {
        const existing = await this.prisma.user.findFirst({ where: { email: u.email } });
        if (!existing) {
          await this.prisma.user.create({
            data: {
              email: u.email,
              name: u.name,
              role: u.role,
              passwordHash: this.hashPassword(u.password),
              tenantId: u.tenantId
            }
          });
        }
      }
    } catch (e) {
      console.error('ensureDevUsers error:', e);
    }
  }

  async getProfile(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant?.name || 'Bahrain Virtual Academy',
      createdAt: user.createdAt,
      phone: user.phone || '',
      passportNumber: user.passportNumber || '',
      address: user.address || '',
      bio: user.bio || ''
    };
  }

  async updateProfile(userId: string, data: { phone?: string; passportNumber?: string; address?: string; bio?: string }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone: data.phone,
        passportNumber: data.passportNumber,
        address: data.address,
        bio: data.bio
      }
    });

    return {
      success: true,
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone || '',
        passportNumber: updatedUser.passportNumber || '',
        address: updatedUser.address || '',
        bio: updatedUser.bio || ''
      }
    };
  }

  async getNotifications(user: any) {
    try {
      // Clean up old English template notifications if they exist
      await this.prisma.notification.deleteMany({
        where: {
          userId: user.id,
          OR: [
            { title: 'Welcome to Bahrain International V2' },
            { title: 'Prerequisite unlocked' }
          ]
        }
      });

      let notifications = await this.prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      if (notifications.length === 0) {
        await this.prisma.notification.createMany({
          data: [
            {
              userId: user.id,
              type: 'SYSTEM',
              title: 'Selamat Datang di Bahrain Portal',
              message: 'Akun Anda berhasil didaftarkan. Anda dapat mengakses materi bimbingan ibadah 360° secara mandiri.',
              createdAt: new Date()
            },
            {
              userId: user.id,
              type: 'SUBSCRIPTION',
              title: 'Aktivasi Paket Belajar Anda',
              message: 'Gunakan voucher dari Biro Anda atau aktifkan paket Haji / Umrah Premium untuk membuka seluruh modul bimbingan.',
              createdAt: new Date()
            }
          ]
        });

        notifications = await this.prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });
      }

      return notifications;
    } catch (e: any) {
      return [
        { id: 'n-1', title: 'Selamat Datang di Bahrain Portal', message: 'Akun Anda berhasil didaftarkan. Anda dapat mengakses materi bimbingan ibadah 360° secara mandiri.', createdAt: new Date() }
      ];
    }
  }
}
