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
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { Category } from './model/category.schema';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('/all')
  getAllGetName() {
    return this.service.findAllGetName();
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  create(@Body() category: CreateCategoryDto) {
    return this.service.createCategory(category);
  }

  @Get()
  async getAll(@Query() params: ParamPaginationDto) {
    const categories = await this.service.findAll(params);

    const rootCategories = categories.filter((category) => {
      return category.parent_id === null;
    });

    return buildPagination<Category>(rootCategories, params, rootCategories);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  getOne(@Param('id') _id: string) {
    return this.service.findById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  deleteOne(@Param('id') _id: string) {
    return this.service.deleteById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  updateOne(@Param('id') _id: string, @Body() update: UpdateCategoryDto) {
    return this.service.updateById(_id, update);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
    return this.service.updateStatusById(id, status);
  }
}
