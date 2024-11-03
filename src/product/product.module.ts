import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { DatabaseModule } from 'src/database/database.module';
import { Product, ProductSchema } from './model/product.schema';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CategoryModule } from 'src/category/category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CloudinaryModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
