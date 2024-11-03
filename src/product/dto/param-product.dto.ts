import { IsString } from 'class-validator';

export class ParamProductDto {
  @IsString()
  brand_id: string;

  @IsString()
  category_id: string;

  @IsString()
  keyword: string;
}
