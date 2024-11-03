import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ParamPaginationDto } from '../common/param-pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/decorator/role.enum';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly repository: UserRepository) {}

  create(user: CreateUserDto) {
    user.password = bcrypt.hashSync(user.password, 10);

    try {
      return this.repository.create(user);
    } catch (error) {
      throw new NotFoundException('Email da ton tai');
    }
  }

  getAll(param: ParamPaginationDto) {
    const { page, limit, sort, keyword } = param;

    const newSort = sort !== 'asc' ? 'desc' : 'asc';

    const filter =
      keyword !== undefined
        ? {
            $or: [
              { name: new RegExp(keyword, 'i') },
              { email: new RegExp(keyword, 'i') },
            ],
          }
        : {};

    return this.repository.findAll(page, limit, newSort, filter);
  }

  async getOne(id: string) {
    const user = await this.repository.findOne(id, '-password');
    if (!user) {
      throw new UnauthorizedException(`Không tìm thấy user id ${id}`);
    }
    return user;
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    const user = await this.repository.updateUser(id, updateUser);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user id ${id}`);
    }
    return user;
  }

  async updateStatusUser(id: string, status: boolean) {
    const user = await this.repository.updateStatusUser(id, status);
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }
    return user;
  }

  async deleteUser(id: string) {
    try {
      return await this.repository.deleteUser(id);
    } catch (error) {
      throw new NotFoundException(`Không tìm thấy user id ${id}`);
    }
  }

  async onModuleInit(): Promise<void> {
    const createUserAdmin: CreateUserDto = {
      email: 'kewtie@gmail.com',
      name: 'Kewtie',
      password: 'Qt123!',
      status: true,
      role: [Role.ADMIN],
    };
    const initInDB = await this.repository.findByEmail(createUserAdmin.email);
    if (!initInDB) {
      await this.repository.create({
        ...createUserAdmin,
        password: await bcrypt.hash(createUserAdmin.password, 10),
      });
    }
  }
}
