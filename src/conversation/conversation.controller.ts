import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.conversationService.getAll(id);
  }
}
