import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('🔐 JWT Guard - Path:', request.path, 'Method:', request.method);
    console.log('🔐 JWT Guard - Auth Header:', authHeader ? 'present' : 'MISSING');

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = this.tokenService.validateToken(token);

    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    console.log('🔐 JWT Guard - Token válido, usuário:', payload.email);
    request.user = payload;
    return true;
  }
}
