import {
  IsBoolean,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  gender: string;

  @IsString()
  phone_number: string;
}
