import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const totalTenants = await this.prisma.tenant.count();
    const totalUsers = await this.prisma.user.count();
    const totalVouchers = await this.prisma.voucher.count();
    const revenueAgg = await this.prisma.voucher.aggregate({
      _sum: { pricePaid: true }
    });

    return {
      success: true,
      stats: {
        totalTenants,
        totalUsers,
        totalVouchers,
        totalRevenue: revenueAgg._sum.pricePaid || 0
      }
    };
  }

  async getTenants(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const tenants = await this.prisma.tenant.findMany({
      include: {
        _count: {
          select: { users: true, vouchers: true }
        },
        users: {
          where: { OR: [{ role: 'ORG_ADMIN' }, { role: 'ORG_ADMIN' }, { role: 'ORG ADMIN' }] }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return tenants;
  }

  async getVouchers(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const vouchers = await this.prisma.voucher.findMany({
      include: {
        tenant: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return vouchers;
  }

  async getUsers(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const users = await this.prisma.user.findMany({
      include: {
        tenant: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  }

  async updateVoucherPrice(body: { packageType: string; price: number }, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const { packageType, price } = body;
    if (!packageType || typeof price !== 'number') {
      throw new BadRequestException('packageType and price are required.');
    }

    const updated = await this.prisma.voucherPrice.upsert({
      where: { packageType },
      update: { price },
      create: { packageType, price }
    });

    return { success: true, updated };
  }

  async createTenant(body: { name: string; adminEmail: string; adminName: string }, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const { name, adminEmail, adminName } = body;
    if (!name || !adminEmail || !adminName) {
      throw new BadRequestException('name, adminEmail, and adminName are required.');
    }
    
    const tenant = await this.prisma.tenant.create({
      data: { name }
    });

    const adminUser = await this.prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash: 'dummy-hash',
        role: 'ORG_ADMIN',
        tenantId: tenant.id
      }
    });

    return { success: true, tenant, adminUser };
  }

  // --- BLOG MANAGEMENT METHODS ---

  async getBlogs(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createBlog(body: { title: string; content: string; published?: boolean }, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const { title, content, published } = body;
    if (!title || !content) {
      throw new BadRequestException('title and content are required.');
    }

    const blog = await this.prisma.blogPost.create({
      data: {
        title,
        content,
        published: published ?? false
      }
    });

    return { success: true, blog };
  }

  async updateBlog(id: string, body: { title?: string; content?: string; published?: boolean }, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    const { title, content, published } = body;

    const blog = await this.prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        published
      }
    });

    return { success: true, blog };
  }

  async deleteBlog(id: string, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access denied. Only super administrators can access this resource.');
    }

    await this.prisma.blogPost.delete({
      where: { id }
    });

    return { success: true, message: 'Blog post deleted successfully.' };
  }
}
