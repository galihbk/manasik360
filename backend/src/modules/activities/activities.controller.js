const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activityHistory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: activities });
  } catch (err) {
    next(err);
  }
};

exports.createActivity = async (req, res, next) => {
  try {
    const { title, type, time, date, color, icon, userId } = req.body;
    const newActivity = await prisma.activityHistory.create({
      data: { title, type, time, date, color, icon, userId }
    });
    res.status(201).json({ status: 'success', data: newActivity });
  } catch (err) {
    next(err);
  }
};
