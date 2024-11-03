import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users/login')
  loginUser(@Body() login: LoginDto) {
    return this.authService.validateUser(login);
  }

  @Post('customers/login')
  loginCustomer(@Body() logion: LoginDto) {
    return this.authService.validateCustomer(logion);
  }
}
