import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './model/review.schema';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name) private readonly model: Model<Review>,
  ) {}

  async create(review: Review) {
    return await this.model.create(review);
  }

  async findByCustomerAndProduct(customer_id: string, product_id: string) {
    return await this.model
      .findOne({ customer_id, product_id })
      .lean<Review>(true);
  }

  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<Review>(true);
  }

  async findByProduct(product_id: string) {
    return await this.model
      .find({ product_id })
      .populate('customer_id')
      .lean<Review>(true);
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async update(id: string, body: UpdateReviewDto) {
    return await this.model
      .findByIdAndUpdate(id, body, { new: true })
      .lean<Review>(true);
  }

  async findByMeReview(id: string) {
    return await this.model
      .find({ customer_id: id })
      .populate('product_id')
      .lean<Review[]>(true);
  }
}
