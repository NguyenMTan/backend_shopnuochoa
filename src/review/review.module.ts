import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';
import { DatabaseModule } from 'src/database/database.module';
import { Review, ReviewSchema } from './model/review.schema';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    OrderModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
