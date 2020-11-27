import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from "./role.enum";
import {ROLES_KEY} from "./roles.decorator";
import {UserService} from "../user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const findUser = await this.userService.findById(user.userId);
    if (!findUser || !findUser.roles) {
      return false;
    }
    return requiredRoles.some((role) => findUser.roles?.includes(role));
  }
}
