import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from './brand.repository';
import { DatabaseModule } from 'src/database/database.module';
import { Brand, BrandSchema } from './model/brand.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandRepository],
})
export class BrandModule {}
