const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: notifications });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { unread: true },
      data: { unread: false }
    });
    res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
