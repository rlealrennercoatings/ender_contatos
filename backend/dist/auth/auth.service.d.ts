export interface User {
    oid: string;
    email: string;
    name: string;
    groups: string[];
}
export declare class AuthService {
    validateUser(profile: any): User;
    hasPermission(groups: string[], requiredPermission: string): boolean;
    validateToken(token: string): any;
}
