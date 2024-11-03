import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../decorator/role.enum';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RoleAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ROLE.ADMIN va ROLE.USER

    // roles_ADMIN
    // roles_USER
    // Kiem tra co nhung quyen gi
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
