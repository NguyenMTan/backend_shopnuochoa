import { buildPagination } from './../common/common';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ParamPaginationDto } from '../common/param-pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { User } from './model/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  // Tạo User
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  // Lấy tất cả
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers(@Query() page: ParamPaginationDto) {
    const listUsers = await this.service.getAll(page);
    return buildPagination<User>(listUsers, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    const { _id } = req.user;
    return this.service.getOne(_id);
  }

  // Lấy user theo Id
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  getUserById(@Param('id') _id: string) {
    return this.service.getOne(_id);
  }

  // Sửa User
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.service.updateUser(_id, updateUser);
  }

  // Sửa trạng thái User
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id/status')
  updateStatusUser(@Param('id') _id: string, @Query('status') status: boolean) {
    return this.service.updateStatusUser(_id, status);
  }

  // Xóa User
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') _id: string) {
    await this.service.deleteUser(_id);

    return 'Xoa user thanh cong';
  }
}
