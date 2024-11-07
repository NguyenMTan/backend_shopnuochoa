import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Message } from 'src/message/model/message.schema';

class Person {
  id: string;
  name: string;
  email: string;
}

@Schema({ versionKey: false })
export class Conversation {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: [Person] })
  participants: Person[];

  @Prop([{ type: SchemaTypes.ObjectId, ref: Message.name, default: [] }])
  messages?: Types.ObjectId[];

  @Prop({
    type: Date,
    default: new Date(),
  })
  created_at: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
