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
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { Brand } from './model/brand.schema';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { Role } from 'src/auth/decorator/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('brands')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Get('/all')
  getAllGetName() {
    return this.service.findAllGetName();
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  create(@Body() body: CreateBrandDto) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getAll(@Query() page: ParamPaginationDto) {
    const listBrand = await this.service.getAll(page);
    return buildPagination<Brand>(listBrand, page);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  getBrand(@Param('id') _id: string) {
    return this.service.getById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  delete(@Param('id') _id: string) {
    return this.service.deleteById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  update(@Param('id') _id: string, @Body() body: UpdateBrandDto) {
    return this.service.updateById(_id, body);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
    return this.service.updateStatusById(id, status);
  }
}
