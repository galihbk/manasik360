const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get messages for a specific session (used by both pilgrim and admin)
exports.getMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ status: 'error', message: 'Session ID is required' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { senderId: sessionId }, // We reuse senderId to store the sessionId for simplicity
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ status: 'success', data: messages });
  } catch (err) {
    next(err);
  }
};

// Send a message (used by pilgrim)
exports.sendMessage = async (req, res, next) => {
  try {
    const { sessionId, senderName, text } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ status: 'error', message: 'Session ID and text are required' });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId: sessionId,
        senderName: senderName || 'Tamu',
        text,
        sender: 'user'
      }
    });

    res.status(201).json({ status: 'success', data: newMessage });
  } catch (err) {
    next(err);
  }
};

// Admin replies to a session
exports.adminReply = async (req, res, next) => {
  try {
    const { sessionId, text } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ status: 'error', message: 'Session ID and text are required' });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId: sessionId,
        senderName: 'Admin Bimbingan',
        text,
        sender: 'admin'
      }
    });

    res.status(201).json({ status: 'success', data: newMessage });
  } catch (err) {
    next(err);
  }
};

// Admin gets all active chat sessions
exports.getSessions = async (req, res, next) => {
  try {
    // Find all unique session IDs and their latest message
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Group by senderId (which is our sessionId)
    const sessionsMap = {};
    messages.forEach(msg => {
      if (!sessionsMap[msg.senderId]) {
        sessionsMap[msg.senderId] = {
          sessionId: msg.senderId,
          senderName: msg.senderName,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unread: msg.sender === 'user' // simple flag if last message was from user
        };
      }
    });

    const sessions = Object.values(sessionsMap);
    res.status(200).json({ status: 'success', data: sessions });
  } catch (err) {
    next(err);
  }
};
