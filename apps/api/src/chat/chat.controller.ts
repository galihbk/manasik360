import { Controller, Get, Post, Body, Param, Headers, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService
  ) {}

  @Get('conversations')
  async getConversations(
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    return this.chatService.getConversations(user.id);
  }

  @Get('messages/:contactId')
  async getMessages(
    @Param('contactId') contactId: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    
    let resolvedContactId = contactId;
    if (contactId === 'super-admin') {
      const admin = await this.chatService.findSuperAdmin();
      if (!admin) {
        throw new NotFoundException('Super Admin not found in the database.');
      }
      resolvedContactId = admin.id;
    }

    return this.chatService.getMessages(user.id, resolvedContactId);
  }

  @Post('messages')
  async sendMessage(
    @Body() body: { recipientId: string; message: string },
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
    @Headers('x-user-org') userOrg?: string,
    @Headers('x-user-role') userRole?: string
  ) {
    const user = await this.authService.getActiveUser(userName, userEmail, userOrg, userRole);
    
    let resolvedRecipientId = body.recipientId;
    if (body.recipientId === 'super-admin') {
      const admin = await this.chatService.findSuperAdmin();
      if (!admin) {
        throw new NotFoundException('Super Admin not found in the database.');
      }
      resolvedRecipientId = admin.id;
    }

    return this.chatService.sendMessage(user.id, resolvedRecipientId, body.message);
  }
}
