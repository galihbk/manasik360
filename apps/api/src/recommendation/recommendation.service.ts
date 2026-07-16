import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveRecommendations(target: string) {
    const whereClause: any = { isActive: true };

    if (target === 'learner') {
      whereClause.showToLearner = true;
    } else if (target === 'org_admin') {
      whereClause.showToOrgAdmin = true;
    } else if (target === 'public') {
      whereClause.showToPublic = true;
    }

    return this.prisma.recommendation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllRecommendations(user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admin can manage recommendations.');
    }
    return this.prisma.recommendation.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createRecommendation(data: any, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admin can manage recommendations.');
    }
    return this.prisma.recommendation.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        imageUrl: data.imageUrl,
        location: data.location,
        contactNumber: data.contactNumber,
        websiteUrl: data.websiteUrl,
        isPaid: data.isPaid !== undefined ? data.isPaid : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
        showToLearner: data.showToLearner !== undefined ? data.showToLearner : true,
        showToOrgAdmin: data.showToOrgAdmin !== undefined ? data.showToOrgAdmin : true,
        showToPublic: data.showToPublic !== undefined ? data.showToPublic : true,
      }
    });
  }

  async updateRecommendation(id: string, data: any, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admin can manage recommendations.');
    }

    const reco = await this.prisma.recommendation.findUnique({ where: { id } });
    if (!reco) {
      throw new NotFoundException(`Recommendation with ID ${id} not found.`);
    }

    return this.prisma.recommendation.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        imageUrl: data.imageUrl,
        location: data.location,
        contactNumber: data.contactNumber,
        websiteUrl: data.websiteUrl,
        isPaid: data.isPaid !== undefined ? data.isPaid : reco.isPaid,
        isActive: data.isActive !== undefined ? data.isActive : reco.isActive,
        showToLearner: data.showToLearner !== undefined ? data.showToLearner : reco.showToLearner,
        showToOrgAdmin: data.showToOrgAdmin !== undefined ? data.showToOrgAdmin : reco.showToOrgAdmin,
        showToPublic: data.showToPublic !== undefined ? data.showToPublic : reco.showToPublic,
      }
    });
  }

  async deleteRecommendation(id: string, user: any) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admin can manage recommendations.');
    }

    const reco = await this.prisma.recommendation.findUnique({ where: { id } });
    if (!reco) {
      throw new NotFoundException(`Recommendation with ID ${id} not found.`);
    }

    await this.prisma.recommendation.delete({ where: { id } });
    return { success: true, message: 'Recommendation deleted successfully' };
  }
}
