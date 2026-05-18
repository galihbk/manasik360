const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: posts });
  } catch (err) {
    next(err);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const { title, summary, content, image, category } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ status: 'error', message: 'Title, summary, and content are required' });
    }

    const slug = slugify(title);

    // Format current date in Indonesian (e.g. "18 Mei 2026")
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        image: image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
        category: category || 'Umum',
        date: dateStr
      }
    });

    res.status(201).json({ status: 'success', data: newPost });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, summary, content, image, category } = req.body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Blog post not found' });
    }

    const updateData = {
      title,
      summary,
      content,
      image,
      category
    };

    if (title && title !== existing.title) {
      updateData.slug = slugify(title);
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ status: 'success', data: updatedPost });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Blog post not found' });
    }

    await prisma.blogPost.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
