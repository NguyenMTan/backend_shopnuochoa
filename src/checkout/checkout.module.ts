import { Module } from '@nestjs/common';
import { CheckOutController } from './checkout.controller';
import { CheckOutService } from './checkout.service';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { MailModule } from 'src/mail/mail.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [CartModule, ProductModule, OrderModule, MailModule, CustomerModule],
  controllers: [CheckOutController],
  providers: [CheckOutService],
})
export class CheckOutModule {}
