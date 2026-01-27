import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { TokenService } from './token.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'seu-secret-key-mudar-em-producao',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
