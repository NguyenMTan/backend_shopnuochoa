import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from 'src/customer/model/customer.schema';
import { Order } from 'src/order/model/order.schema';
import Handlebars from 'handlebars';
import { FeedbackDto } from './dto/feedback.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async placeOrder(order: Order, customer: Customer) {
    Handlebars.registerHelper('formatNumber', function (number) {
      return new Intl.NumberFormat('de-DE').format(number);
    });
    const currentDate = new Date();
    const image = {
      src: 'https://res.cloudinary.com/dwt5jjcjw/image/upload/v1729155153/products/6710d0454d14eb082679ca68/ll714fziezhato0raggt.png',
      name: 'logo',
    };
    const formattedDate =
      currentDate.getDate().toString().padStart(2, '0') +
      '/' +
      (currentDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      currentDate.getFullYear();
    try {
      await this.mailerService.sendMail({
        to: order.email, // list of receivers
        from: 'minhtanvx510@gmail.com', // sender address
        subject: 'Thanh toán hoá đơn thành công ✔', // Subject line
        template: 'place-order', // plaintext body
        context: {
          orderId: order._id, // dữ liệu để truyền vào template
          date: formattedDate,
          image: image,
          customer: {
            name: customer.name,
            address: order.address,
            phone_number: order.phone_number,
          },
          items: order.order_detail,
          total: order.total,
        },
      });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async forgotPassword(email: string, url: string) {
    const image = {
      src: 'https://res.cloudinary.com/dwt5jjcjw/image/upload/v1729155153/products/6710d0454d14eb082679ca68/ll714fziezhato0raggt.png',
      name: 'logo',
    };
    await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'minhtanvx510@gmail.com', // sender address
      subject: 'Thay đổi mật khẩu của bạn', // Subject line
      template: 'forgot-password', // plaintext body
      context: {
        email: email,
        url: url,
        image: image,
      },
    });
  }

  async feedBack(feedback: FeedbackDto) {
    await this.mailerService.sendMail({
      to: feedback.email,
      from: 'minhtanvx510@gmail.com',
      subject: 'Phản hồi khách hàng',
      template: 'feedback',
      context: {
        email: feedback.email,
        phone_number: feedback.phone_number,
        name: feedback.name,
        message: feedback.message,
      },
    });
  }
}
