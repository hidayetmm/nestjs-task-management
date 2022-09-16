import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/auth/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return role === user.role;
  }
}
