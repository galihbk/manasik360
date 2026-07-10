import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(userId: string, contactId: string) {
    if (!userId || !contactId) {
      throw new BadRequestException('Sender and recipient IDs are required.');
    }

    return this.prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: contactId },
          { senderId: contactId, recipientId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        recipient: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async sendMessage(senderId: string, recipientId: string, message: string) {
    if (!senderId || !recipientId || !message.trim()) {
      throw new BadRequestException('Sender, recipient, and non-empty message are required.');
    }

    const newMessage = await this.prisma.chatMessage.create({
      data: {
        senderId,
        recipientId,
        message: message.trim()
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        recipient: { select: { id: true, name: true, role: true } }
      }
    });

    return { success: true, message: newMessage };
  }

  async getConversations(adminId: string) {
    // Return all users who have sent messages to or received messages from this admin
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        OR: [{ senderId: adminId }, { recipientId: adminId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        recipient: { select: { id: true, name: true, email: true, role: true } }
      }
    });

    // Group by contact and keep only the latest message
    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      const contact = msg.senderId === adminId ? msg.recipient : msg.sender;
      if (!contact || contact.id === adminId) continue;

      if (!conversationsMap.has(contact.id)) {
        conversationsMap.set(contact.id, {
          contact,
          lastMessage: {
            id: msg.id,
            message: msg.message,
            createdAt: msg.createdAt,
            senderId: msg.senderId
          }
        });
      }
    }

    return Array.from(conversationsMap.values());
  }

  // Find a super administrator in the system
  async findSuperAdmin() {
    const admin = await this.prisma.user.findFirst({
      where: {
        OR: [
          { role: 'SUPER_ADMIN' },
          { role: 'SUPER ADMIN' }
        ]
      },
      select: { id: true, name: true, email: true }
    });
    return admin;
  }
}
