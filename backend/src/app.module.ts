import { Module } from '@nestjs/common';
import { ContatosModule } from './contatos/contatos.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ContatosModule],
})
export class AppModule {}
