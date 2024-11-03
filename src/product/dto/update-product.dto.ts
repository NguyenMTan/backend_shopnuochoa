export class UpdateProductDto {
  name: string;
  short_description: string;
  description: string;
  cost: number;
  price: number;
  sale: number;
  stock: number;
  status: boolean;
  category_id: string;
  brand_id: string;
}
