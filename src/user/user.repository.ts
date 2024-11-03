import { Model, Types } from 'mongoose';
import { User } from './model/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create(user: CreateUserDto) {
    const newUser = new this.model({
      _id: new Types.ObjectId(),
      ...user,
    }).save();

    return (await newUser).toJSON();
  }

  async findAll(
    page: number,
    limit: number,
    sort: 'asc' | 'desc',
    keyword: any,
  ) {
    return await this.model
      .find(keyword)
      .skip((page - 1) * limit)
      .sort({ email: sort })
      .limit(limit)
      .select('-password')
      .lean<User[]>(true);
  }

  async findOne(id: string, select: string) {
    return await this.model
      .findOne({ _id: id })
      .select(select)
      .lean<User>(true);
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    return await this.model.findOneAndUpdate({ _id: id }, updateUser, {
      new: true,
    });
  }

  async deleteUser(id: string) {
    return await this.model.findOneAndDelete({ _id: id });
  }

  async updateStatusUser(id: string, status: boolean) {
    return await this.model.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true },
    );
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email }).lean<User>(true);
  }
}
