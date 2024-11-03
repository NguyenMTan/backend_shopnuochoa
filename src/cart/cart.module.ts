import { CartRepository } from './cart.repository';
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from 'src/database/database.module';
import { Cart, CartSchema } from './model/cart.schema';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService],
})
export class CartModule {}
