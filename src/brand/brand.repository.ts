import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './model/brand.schema';
import { Model, Types } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandRepository {
  constructor(@InjectModel(Brand.name) private readonly model: Model<Brand>) {}

  async create(brand: CreateBrandDto) {
    const newBrand = new this.model({
      _id: new Types.ObjectId(),
      ...brand,
    }).save();

    return (await newBrand).toJSON();
  }

  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<Brand>(true);
  }

  async findAll(
    page: number,
    limit: number,
    sort: 'asc' | 'desc',
    keyword: any,
  ) {
    return await this.model
      .find(keyword)
      .skip((page - 1) * limit)
      .sort({ name: sort })
      .limit(limit)
      .lean<Brand[]>(true);
  }

  async deleteOne(id: string) {
    await this.model.findOneAndDelete({ _id: id });
    return 'Xóa thương hiệu thành công';
  }

  async updateOne(id: string, brand: UpdateBrandDto) {
    return await this.model.findOneAndUpdate({ _id: id }, brand, { new: true });
  }

  async addProductId(id: string, productId: string) {
    await this.model.findOneAndUpdate(
      { _id: id },
      { $addToSet: { products: productId } },
    );
  }

  async removeProductId(id: Types.ObjectId, productId: Types.ObjectId) {
    await this.model.findOneAndUpdate(
      { _id: id },
      { $pull: { products: productId } },
    );
  }
  async findAllGetName() {
    return await this.model.find({ status: true }).lean<Brand[]>(true);
  }

  async updateStatusById(id: string, status: boolean) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { status }, { new: true })
      .lean<Brand>(true);
  }
}
