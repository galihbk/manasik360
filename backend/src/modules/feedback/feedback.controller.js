const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createFeedback = async (req, res, next) => {
  try {
    const { subject, message, userId } = req.body;
    const newFeedback = await prisma.feedback.create({
      data: { subject, message, userId }
    });
    res.status(201).json({
      status: 'success',
      data: newFeedback,
      message: 'Feedback sent successfully!'
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: feedbacks });
  } catch (err) {
    next(err);
  }
};
