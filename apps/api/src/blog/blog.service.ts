import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicBlogs() {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPublicBlog(id: string) {
    return this.prisma.blogPost.findFirst({
      where: { id, published: true }
    });
  }
}
