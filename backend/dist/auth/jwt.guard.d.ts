import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from './token.service';
export declare class JwtGuard implements CanActivate {
    private tokenService;
    constructor(tokenService: TokenService);
    canActivate(context: ExecutionContext): boolean;
}
