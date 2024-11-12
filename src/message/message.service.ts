import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserSendMessageDto } from 'src/events/dto/user-message.dto';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    private readonly repository: MessageRepository,
    private readonly conversationService: ConversationService,
  ) {}

  async sendMessage(sendMessage: UserSendMessageDto) {
    const { sender, receiver, message } = sendMessage;

    let conversation = await this.conversationService.getConversation({
      sender_id: sender.id,
      receiver_id: receiver.id,
    });

    if (!conversation) {
      conversation =
        await this.conversationService.createConversation(sendMessage);
    }

    try {
      const newMessage = await this.repository.create({
        _id: new Types.ObjectId(),
        sender: {
          id: sender.id,
          name: sender.name,
          email: sender.email,
        },
        receiver: {
          id: receiver.id,
          name: receiver.name,
          email: receiver.email,
        },
        message,
        created_at: new Date(),
      });
      const newCover = await this.conversationService.updateMessages(
        conversation._id.toHexString(),
        newMessage._id.toHexString(),
      );

      return newMessage;
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(sender_id: string, receiver_id: string) {
    let conversation = await this.conversationService.getConversation({
      sender_id,
      receiver_id,
    });

    return conversation;
  }
}
