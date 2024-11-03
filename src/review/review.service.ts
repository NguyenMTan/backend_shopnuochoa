import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrderService } from 'src/order/order.service';
import { Types } from 'mongoose';
import { Review } from './model/review.schema';
import { checkValisIsObject } from 'src/common/common';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly repositoryReview: ReviewRepository,
    private readonly serviceOder: OrderService,
  ) {}

  async create(customer_id: string, review: CreateReviewDto) {
    const product_id = review.product_id;

    checkValisIsObject(customer_id, 'customer_id');
    checkValisIsObject(product_id, 'product_id');

    const order = await this.serviceOder.findByCustomerAndProduct(
      customer_id,
      product_id,
    );
    const oldReview = await this.repositoryReview.findByCustomerAndProduct(
      customer_id,
      product_id,
    );

    if (order.length <= 0) {
      throw new NotFoundException('khach hang chua mua san pham');
    }

    if (oldReview) {
      throw new NotFoundException('khach hang da danh gia san pham');
    }

    const newReview: Review = {
      _id: new Types.ObjectId(),
      customer_id: new Types.ObjectId(customer_id),
      product_id: new Types.ObjectId(product_id),
      comment: review.comment,
      point: review.point,
    };

    return await this.repositoryReview.create(newReview);
  }

  async getByProduct(product_id: string) {
    checkValisIsObject(product_id, 'product_id');
    return await this.repositoryReview.findByProduct(product_id);
  }

  async deleteById(id: string, customer_id: string) {
    checkValisIsObject(id, 'review_id');
    checkValisIsObject(customer_id, 'customer_id');

    const review = await this.repositoryReview.findOne(id);

    if (!review) {
      throw new NotFoundException('khong tim thay danh gia');
    }

    const customerReview_id = review.customer_id.toHexString();

    if (customerReview_id !== customer_id) {
      throw new NotFoundException('danh gia nay khong phai cua ban');
    }

    return await this.repositoryReview.delete(id);
  }

  async updateById(id: string, customer_id: string, review: UpdateReviewDto) {
    checkValisIsObject(id, 'review_id');

    const oldReview = await this.repositoryReview.findOne(id);

    if (!oldReview) {
      throw new NotFoundException('khong tim thay danh gia');
    }

    const customerReview_id = oldReview.customer_id.toHexString();

    if (customerReview_id !== customer_id) {
      throw new NotFoundException('danh gia nay khong phai cua ban');
    }

    return await this.repositoryReview.update(id, review);
  }

  async getByReviewMe(id: string) {
    checkValisIsObject(id, 'customer_id');
    return await this.repositoryReview.findByMeReview(id);
  }
}
