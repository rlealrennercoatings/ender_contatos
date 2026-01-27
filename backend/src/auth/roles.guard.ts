import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true; // Se não houver permission definida, permite
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('👮 Roles Guard - Permissão requerida:', requiredPermission);
    console.log('👮 Roles Guard - Grupos do usuário:', user?.groups);

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const hasPermission = this.authService.hasPermission(user.groups, requiredPermission);
    
    console.log('👮 Roles Guard - Tem permissão?', hasPermission);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Permissão '${requiredPermission}' não autorizada para este usuário`,
      );
    }

    return true;
  }
}
