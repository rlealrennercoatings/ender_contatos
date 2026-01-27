import { JwtService } from '@nestjs/jwt';
import { User } from './auth.service';
export declare class TokenService {
    private jwtService;
    constructor(jwtService: JwtService);
    generateToken(user: User): string;
    validateToken(token: string): any;
}
