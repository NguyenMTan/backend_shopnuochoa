import { JWTStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:
          'vVarX3ETLuR35pAe8LLVSEieaIxvBrz6X2B0eiN1HY4cdf3jYwBUKISJhDDXD60gsZiL9HLTYPoVwrSGa628XGmjJkGF04J3f4On',
        signOptions: {
          expiresIn: '24h',
          algorithm: 'HS256',
        },
      }),
    }),
    UserModule,
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
