import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { EventsGateway } from './event.gateway';

@Module({
  imports: [MessageModule],
  providers: [EventsGateway],
})
export class EventsModule {}
