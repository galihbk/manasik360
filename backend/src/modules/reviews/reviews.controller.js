const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { name, role, avatar, rating, comment, date, userId } = req.body;
    const newReview = await prisma.review.create({
      data: { name, role, avatar, rating, comment, date, userId }
    });
    res.status(201).json({ status: 'success', data: newReview });
  } catch (err) {
    next(err);
  }
};
