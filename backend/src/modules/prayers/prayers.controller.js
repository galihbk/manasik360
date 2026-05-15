const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPrayers = async (req, res, next) => {
  try {
    const prayers = await prisma.prayer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: prayers });
  } catch (err) {
    next(err);
  }
};

exports.createPrayer = async (req, res, next) => {
  try {
    const { title, category, arabic, latin, translation, audioUrl } = req.body;
    const newPrayer = await prisma.prayer.create({
      data: { title, category, arabic, latin, translation, audioUrl }
    });
    res.status(201).json({ status: 'success', data: newPrayer });
  } catch (err) {
    next(err);
  }
};
