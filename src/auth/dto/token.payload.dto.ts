import { Role } from '../decorator/role.enum';

export class TokenPayloadDto {
  _id: string;
  email: string;
  name: string;
  role?: Role[];
}
