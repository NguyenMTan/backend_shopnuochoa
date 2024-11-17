import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { OrderModule } from 'src/order/order.module';
import { CustomerModule } from 'src/customer/customer.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [OrderModule, CustomerModule, ProductModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
