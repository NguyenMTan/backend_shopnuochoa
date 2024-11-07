import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getMessages(
    @Param('id') id: string,
    @Query('receiver_id') receiver_id: string,
  ) {
    return await this.messageService.getMessages(id, receiver_id);
  }
}
