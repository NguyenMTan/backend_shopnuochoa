import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { ConversationDto } from './dto/conversation.dto';
import { UserSendMessageDto } from 'src/events/dto/user-message.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly repository: ConversationRepository) {}

  async getConversation({ sender_id, receiver_id }: ConversationDto) {
    return await this.repository.get({ sender_id, receiver_id });
  }

  async getAll(user_id: string) {
    return await this.repository.findAll(user_id);
  }

  async createConversation(data: UserSendMessageDto) {
    return await this.repository.create(data);
  }
}
