import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { CheckOutService } from './checkout.service';

@Controller('checkout')
export class CheckOutController {
  constructor(private readonly checkoutService: CheckOutService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() checkout: CheckoutDto) {
    return this.checkoutService.placeorder(req.user._id, checkout);
  }
}
