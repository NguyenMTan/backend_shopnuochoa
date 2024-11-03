import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CustomerModule } from './customer/customer.module';
import { BrandModule } from './brand/brand.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { CheckOutModule } from './checkout/checkout.module';
import { MailModule } from './mail/mail.module';
import { ReportModule } from './report/report.module';
import { BlogModule } from './blog/blog.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CloudinaryModule,
    CustomerModule,
    BrandModule,
    CartModule,
    OrderModule,
    CheckOutModule,
    MailModule,
    ReportModule,
    BlogModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
