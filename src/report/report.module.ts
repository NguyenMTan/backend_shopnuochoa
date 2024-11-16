import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { OrderModule } from 'src/order/order.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [OrderModule, CustomerModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
