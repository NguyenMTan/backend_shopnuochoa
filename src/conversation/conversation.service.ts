import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { ConversationDto } from './dto/conversation.dto';
import { UserSendMessageDto } from 'src/events/dto/user-message.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly repository: ConversationRepository) {}

  async getConversation({ sender_id, receiver_id }: ConversationDto) {
    const conversation = await this.repository.get({ sender_id, receiver_id });
    return conversation;
  }

  async getAll(user_id: string) {
    return await this.repository.findAll(user_id);
  }

  async createConversation(data: UserSendMessageDto) {
    return await this.repository.create(data);
  }

  async updateMessages(id: string, message_id: string) {
    return await this.repository.updateMessage(id, message_id);
  }
}
