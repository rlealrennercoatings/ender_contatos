import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.service';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = {
      oid: user.oid,
      email: user.email,
      name: user.name,
      groups: user.groups,
    };

    return this.jwtService.sign(payload);
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
