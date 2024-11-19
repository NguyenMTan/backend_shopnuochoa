import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { Order } from './model/order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER, Role.CHAT)
  @Get()
  async getAll(@Query() params: ParamPaginationDto) {
    const products = await this.service.findAll(params);
    return buildPagination<Order>(products, params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getOneByCustomer(@Request() req) {
    const { _id } = req.user;
    return await this.service.findByCustomer(_id);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.service.updateOrderStatus(id, status);
  }
}
