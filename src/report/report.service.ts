import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/order/order.repository';
import {
  ReportCustomersDto,
  ReportItemDto,
  ReportOrderDto,
} from './dto/report-item.dto';
import { CustomerRepository } from 'src/customer/customer.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getReport(lastDate: string) {
    switch (lastDate) {
      case 'last_7_days':
        return await this.getLastOptionDaysOrder(7);
      case 'last_28_days':
        return await this.getLastOptionDaysOrder(28);
      case 'last_year':
        return await this.getLastYearOrder();
      default:
        return await this.getLastOptionDaysOrder(7);
    }
  }

  async getReportOrders(lastDate: string) {
    switch (lastDate) {
      case 'last_7_days':
        return await this.getLastOptionDaysOrderStatus(7);
      case 'last_28_days':
        return await this.getLastOptionDaysOrderStatus(28);
      case 'last_year':
        return await this.getLastYearOrderStatus();
      default:
        return await this.getLastOptionDaysOrderStatus(7);
    }
  }

  async getLastOptionDaysOrder(day: number) {
    let reportItem: ReportItemDto[] = [];
    const currentDate = new Date();

    for (let i = 0; i < day; i++) {
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - i); // Ngày bắt đầu
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // Ngày kết thúc (ngày tiếp theo)

      const orders = await this.orderRepository.getLastOptionDays(
        startDate,
        endDate,
      );

      let gross_sales = 0;
      let net_sales = 0;

      if (orders.length > 0) {
        orders.forEach((order) => {
          gross_sales += order.total;
          net_sales += order.total - order.product_cost - 30000;
        });
      }

      reportItem.push({
        gross_sales: gross_sales,
        net_sales: net_sales,
        orders_count: orders.length,
        date: startDate,
      });
    }

    reportItem.reverse();

    return reportItem;
  }

  async getLastYearOrder() {
    let reportItem: ReportItemDto[] = [];
    const monthCount = 13;
    const currentDate = new Date();

    const startMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 12,
      1,
    );

    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startMonth);
      monthStart.setMonth(startMonth.getMonth() + i);
      const monthEnd = new Date(monthStart);

      monthEnd.setMonth(monthStart.getMonth() + 1);

      const orders = await this.orderRepository.getLastOptionDays(
        monthStart,
        monthEnd,
      );

      let gross_sales = 0;
      let net_sales = 0;

      if (orders.length > 0) {
        orders.forEach((order) => {
          gross_sales += order.total;
          net_sales += order.total - order.product_cost;
        });
      }

      reportItem.push({
        gross_sales: gross_sales,
        net_sales: net_sales,
        orders_count: orders.length,
        date: monthStart,
      });
    }

    return reportItem;
  }

  async getReportCustomer() {
    const customers = await this.customerRepository.findAllNoPagination();
    let reportCustomer: ReportCustomersDto;
    let customerUsed = 0;

    for (const customer of customers) {
      const order = await this.orderRepository.findByCustomer(
        customer._id.toHexString(),
      );
      customerUsed = order.length > 0 ? customerUsed + 1 : customerUsed;
    }

    reportCustomer = {
      customer_used: customerUsed,
      customer_register: customers.length - customerUsed,
    };
    return reportCustomer;
  }

  async getLastOptionDaysOrderStatus(day: number) {
    let reportItem: ReportOrderDto[] = [];
    const currentDate = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(currentDate.getDate() - day);

    const waitOrders = await this.orderRepository.getLastOptionDaysWait(
      daysAgo,
      currentDate,
    );
    const shipOrders = await this.orderRepository.getLastOptionDaysShip(
      daysAgo,
      currentDate,
    );
    const successOrders = await this.orderRepository.getLastOptionDays(
      daysAgo,
      currentDate,
    );
    const falseOrders = await this.orderRepository.getLastOptionDaysFalse(
      daysAgo,
      currentDate,
    );

    if (waitOrders.length > 0) {
      reportItem.push({
        status: 'waiting',
        order_count: waitOrders.length,
      });
    }

    if (shipOrders.length > 0) {
      reportItem.push({
        status: 'shipping',
        order_count: shipOrders.length,
      });
    }

    if (successOrders.length > 0) {
      reportItem.push({
        status: 'success',
        order_count: successOrders.length,
      });
    }

    if (falseOrders.length > 0) {
      reportItem.push({
        status: 'false',
        order_count: falseOrders.length,
      });
    }

    return reportItem;
  }

  async getLastYearOrderStatus() {
    let reportItem: ReportOrderDto[] = [];
    const currentDate = new Date();
    const startMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 12,
      1,
    );

    const waitOrders = await this.orderRepository.getLastOptionDaysWait(
      startMonth,
      currentDate,
    );
    const shipOrders = await this.orderRepository.getLastOptionDaysShip(
      startMonth,
      currentDate,
    );
    const successOrders = await this.orderRepository.getLastOptionDays(
      startMonth,
      currentDate,
    );
    const falseOrders = await this.orderRepository.getLastOptionDaysFalse(
      startMonth,
      currentDate,
    );

    if (waitOrders.length > 0) {
      reportItem.push({
        status: 'waiting',
        order_count: waitOrders.length,
      });
    }

    if (shipOrders.length > 0) {
      reportItem.push({
        status: 'shipping',
        order_count: shipOrders.length,
      });
    }

    if (successOrders.length > 0) {
      reportItem.push({
        status: 'success',
        order_count: successOrders.length,
      });
    }

    if (falseOrders.length > 0) {
      reportItem.push({
        status: 'false',
        order_count: falseOrders.length,
      });
    }

    return reportItem;
  }
}
