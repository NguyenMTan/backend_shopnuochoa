import { Module } from '@nestjs/common';
import { Message, MessageSchema } from './model/message.schema';
import { DatabaseModule } from 'src/database/database.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { MessageController } from './message.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
