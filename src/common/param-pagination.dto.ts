import { IsNumber, IsString } from 'class-validator';

export class ParamPaginationDto {
  page: number;

  limit: number;

  @IsString()
  sort: string;

  @IsString()
  keyword: string;
}
