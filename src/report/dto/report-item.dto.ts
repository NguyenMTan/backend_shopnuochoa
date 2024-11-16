export class ReportItemDto {
  gross_sales: number; //doanh thu
  net_sales: number; //loi nhuan
  orders_count: number; //tong so don hang
  date: Date;
}

export class ReportCustomersDto {
  customer_used: number; //tong so khach hang da mua hang
  customer_register: number; //tong so khach hang da da ki
}

export class ReportOrderDto {
  status: string; // trang thai hoa don
  order_count: number; // tong so hoa don cua trang thai do
}
