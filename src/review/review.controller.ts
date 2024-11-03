import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() review: CreateReviewDto) {
    const _id = req.user._id;
    return this.service.create(_id, review);
  }

  @Get('/product/:id')
  getByProduct(@Param('id') id: string) {
    return this.service.getByProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMeReview(@Request() req) {
    const id = req.user._id;
    return this.service.getByReviewMe(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    const customer_id = req.user._id;
    return this.service.deleteById(id, customer_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateReviewDto,
  ) {
    const customer_id = req.user._id;
    return this.service.updateById(id, customer_id, body);
  }
}
