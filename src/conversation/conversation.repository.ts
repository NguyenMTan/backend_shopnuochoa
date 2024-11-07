import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './model/conversation.schema';
import { Model, Types } from 'mongoose';
import { ConversationDto } from './dto/conversation.dto';
import { UserSendMessageDto } from 'src/events/dto/user-message.dto';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name) private readonly model: Model<Conversation>,
  ) {}

  async get({ sender_id, receiver_id }: ConversationDto) {
    return await this.model
      .findOne({
        $and: [
          { participants: { $elemMatch: { id: sender_id } } },
          { participants: { $elemMatch: { id: receiver_id } } },
        ],
      })
      .populate('messages');
  }

  async findAll(user_id: string) {
    return await this.model
      .find({
        participants: { $elemMatch: { id: user_id } },
      })
      .populate('messages');
  }

  async create({ sender, receiver }: UserSendMessageDto) {
    return await this.model.create({
      participants: [sender, receiver],
      _id: new Types.ObjectId(),
    });
  }
}
