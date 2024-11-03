import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerService } from './customer.service';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination, checkMainFile } from 'src/common/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('register')
  register(@Body() customer: CreateCustomerDto) {
    return this.customerService.create(customer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    const { _id } = req.user;
    return this.customerService.findById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getAll(@Query() params: ParamPaginationDto) {
    const customers = await this.customerService.findAll(params);

    return buildPagination(customers, params);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  update(@Request() req, @Body() customer: UpdateCustomerDto) {
    const { _id } = req.user;
    return this.customerService.updateById(_id, customer);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/change_password')
  updatePassword(@Request() req, @Body() password: ChangePasswordDto) {
    const { oldPassword, newPassword } = password;
    const { _id } = req.user;
    return this.customerService.updatePassword(_id, oldPassword, newPassword);
  }

  @Post('forgot_password')
  forgotPassword(@Body('email') email: string) {
    return this.customerService.forgotPassword(email);
  }

  @Post('reset_password')
  resetPassswordToken(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.customerService.resetPassswordToken(token, password);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
    return this.customerService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/add_main_image')
  @UseInterceptors(FileInterceptor('main_image'))
  async addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkMainFile(file);

    if (!file) {
      throw new BadRequestException('Không nhận được file!');
    }

    const customer = await this.customerService.findById(id);

    this.cloudinaryService
      .uploadFile(file, 'customer/' + customer._id)
      .then((result) => {
        this.customerService.uploadMainImage(customer._id, {
          image_id: result.public_id,
          image_url: result.url,
        });
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @Put(':id/update_main_image')
  @UseInterceptors(FileInterceptor('main_image'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkMainFile(file);

    if (!file) {
      throw new BadRequestException('Không nhận được file!');
    }

    const customer = await this.customerService.findById(id);

    const result = await this.cloudinaryService.uploadFile(
      file,
      'products/' + customer._id,
    );

    if (customer.image_id) {
      await this.cloudinaryService.deleteImage(customer.image_id);
    }

    const newProduct = await this.customerService.uploadMainImage(
      customer._id,
      {
        image_id: result.public_id,
        image_url: result.url,
      },
    );

    return id;
  }
}
