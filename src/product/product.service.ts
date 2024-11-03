import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/category/category.repository';
import { checkValisIsObject } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/model/product.schema';
import { ProductRepository } from 'src/product/product.repository';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandRepository } from 'src/brand/brand.repository';
import { ParamProductDto } from './dto/param-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRespository: BrandRepository,
  ) {}

  async createProduct(createProduct: CreateProductDto) {
    let { category_id, brand_id, ...data } = createProduct;

    checkValisIsObject(category_id, 'category_id');
    checkValisIsObject(brand_id, 'brand_id');

    const category = await this.categoryRepository.findOne(category_id);
    const brand = await this.brandRespository.findOne(brand_id);

    if (!category) {
      throw new NotFoundException('Khong tim thay category');
    }

    if (!brand) {
      throw new NotFoundException('Khong tim thay brand');
    }

    const product = {
      _id: new Types.ObjectId(),
      category_id: Types.ObjectId.createFromHexString(category_id),
      brand_id: Types.ObjectId.createFromHexString(brand_id),
      ...data,
    };

    try {
      const newProduct = await this.productRepository.create(
        product as Product,
      );
      await this.brandRespository.addProductId(
        newProduct.brand_id.toHexString(),
        newProduct._id.toHexString(),
      );
      await this.categoryRepository.addProductId(
        newProduct.category_id.toHexString(),
        newProduct._id.toHexString(),
      );
      return newProduct;
    } catch (error) {
      throw new UnprocessableEntityException('Ten san pham da ton tai');
    }
  }

  uploadMainImage(id: Types.ObjectId, { image_id, image_url }) {
    return this.productRepository.uploadMainFile(id, { image_id, image_url });
  }

  uploadExtraImages(
    id: Types.ObjectId,
    files: { image_id: string; image_url: string },
  ) {
    return this.productRepository.uploadExtraFiles(id, files);
  }

  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;

    const newSort = sort != 'asc' ? 'desc' : 'asc';

    return this.productRepository.findAll(page, limit, newSort, keyword);
  }

  async deleteById(id: string) {
    checkValisIsObject(id, 'product id');
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    try {
      await this.productRepository.deleteOne(id);
      await this.brandRespository.removeProductId(
        product.brand_id,
        product._id,
      );
      await this.categoryRepository.removeProductId(
        product.category_id,
        product._id,
      );
      return product;
    } catch (error) {
      console.log('Error', error);
      throw new NotFoundException('Loi trong try catch');
    }

    // const product = await this.productRepository.deleteOne(id);

    // if (!product) {
    //   throw new NotFoundException('Khong tim thay product');
    // }

    // return product;
  }

  async findById(id: string) {
    checkValisIsObject(id, 'product_id');

    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Khong tim thay product co id ${id}`);
    }

    return product;
  }

  async updateById(id: string, updateProduct: UpdateProductDto) {
    const { category_id, brand_id, ...data } = updateProduct;
    checkValisIsObject(id, 'product id');
    checkValisIsObject(category_id, 'category_id');
    checkValisIsObject(brand_id, 'brand_id');

    const productOld = await this.productRepository.findOne(id);
    const category = await this.categoryRepository.findOne(category_id);
    const brand = await this.brandRespository.findOne(brand_id);

    if (!productOld) {
      throw new NotFoundException('Khong tim thay product');
    }

    if (!category) {
      throw new NotFoundException('Khong tim thay category');
    }

    if (!brand) {
      throw new NotFoundException('Khong tim thay brand');
    }

    try {
      const product = await this.productRepository.updateOne(id, {
        _id: new Types.ObjectId(id),
        category_id: new Types.ObjectId(category_id),
        brand_id: new Types.ObjectId(brand_id),
        ...data,
      });
      await this.brandRespository.removeProductId(
        productOld.brand_id,
        productOld._id,
      );
      await this.brandRespository.addProductId(
        product.brand_id.toHexString(),
        product._id.toHexString(),
      ),
        await this.categoryRepository.removeProductId(
          productOld.category_id,
          productOld._id,
        ),
        await this.categoryRepository.addProductId(
          product.category_id.toHexString(),
          product._id.toHexString(),
        );

      return product;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Loi try catch');
    }
  }

  async deleteExtraImages(id: string, image_id: string[]) {
    checkValisIsObject(id, 'product id');
    const product = await this.productRepository.deleteExtraImages(
      new Types.ObjectId(id),
      image_id,
    );

    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    return product;
  }

  async updateStock(id: string, stock: number) {
    return await this.productRepository.updateStock(
      new Types.ObjectId(id),
      stock,
    );
  }

  async updateStatus(id: string, status: boolean) {
    console.log('status', status);
    checkValisIsObject(id, 'product id');
    const product = await this.productRepository.updateStatus(id, status);

    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    return product;
  }

  async findByCategory(body: ParamProductDto) {
    const { brand_id, category_id, keyword } = body;

    if (category_id === 'all' && brand_id === 'all') {
      return await this.productRepository.findAll(1, 1000, 'asc', keyword);
    }

    if (category_id === 'all') {
      const query: any = {
        $or: [{ name: new RegExp(keyword, 'i') }],
      };
      if (brand_id !== 'all') {
        query.brand_id = brand_id;
      }
      return await this.productRepository.findByCategory(query);
    }

    const category = await this.categoryRepository.findOne(category_id);
    let listProducts: Product[] = [];

    const query: any = {
      category_id,
      $or: [{ name: new RegExp(keyword, 'i') }],
    };
    if (brand_id !== 'all') {
      query.brand_id = brand_id;
    }

    const products = await this.productRepository.findByCategory(query);
    listProducts.push(...products);

    await this.hierarchical(listProducts, category, brand_id, keyword);

    return listProducts;
  }

  private async hierarchical(
    listProducts: Product[],
    category: any,
    brand_id: string,
    keyword: string,
  ) {
    if (category.children.length > 0) {
      for (const child of category.children) {
        const query: any = {
          category_id: child._id,
          $or: [{ name: new RegExp(keyword, 'i') }],
        };
        if (brand_id !== 'all') {
          query.brand_id = brand_id;
        }

        const products = await this.productRepository.findByCategory(query);
        listProducts.push(...products);

        await this.hierarchical(listProducts, child, brand_id, keyword);
      }
    }
  }

  async getSale() {
    const products = await this.productRepository.findSale();

    const productSale = products.filter((product) => product.sale > 0);

    return productSale;
  }
}
