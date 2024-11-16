import { Controller, Get, Param } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('customer')
  getCustomer() {
    return this.service.getReportCustomer();
  }

  @Get('order/:period')
  getReportOrder(@Param('period') period: string) {
    return this.service.getReportOrders(period);
  }

  @Get(':period')
  getReport(@Param('period') period: string) {
    return this.service.getReport(period);
  }
}
