import { Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
export declare class AuthController {
    private authService;
    private tokenService;
    constructor(authService: AuthService, tokenService: TokenService);
    login(res: Response): Promise<void>;
    callback(code: string, error: string, res: Response, req: any): Promise<void>;
    loginManual(body: {
        email: string;
        groups: string[];
    }): Promise<{
        token: string;
        user: {
            oid: string;
            email: string;
            name: string;
            groups: string[];
        };
    }>;
    getProfile(req: any): any;
    logout(): {
        message: string;
    };
    private getUserGroups;
    private exchangeCodeForToken;
}
