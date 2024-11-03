import { IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  oldPassword: string;

  @IsStrongPassword()
  newPassword: string;
}
