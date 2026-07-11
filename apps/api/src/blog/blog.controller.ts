import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('public')
  async getPublicBlogs() {
    const blogs = await this.blogService.getPublicBlogs();
    return { success: true, blogs };
  }

  @Get('public/:id')
  async getPublicBlog(@Param('id') id: string) {
    const blog = await this.blogService.getPublicBlog(id);
    return { success: true, blog };
  }
}
