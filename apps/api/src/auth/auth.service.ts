import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
