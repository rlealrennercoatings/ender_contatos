import { IsEnum, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { TipoEndereco } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateTelefoneDto {
  @IsString()
  numero: string;

  @IsEnum(['CELULAR', 'FIXO'])
  tipo: 'CELULAR' | 'FIXO';
}

export class CreateEnderecoDto {
  @IsEnum(TipoEndereco)
  tipo: TipoEndereco;

  @IsOptional()
  @IsString()
  apelido?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  uf?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTelefoneDto)
  telefones?: CreateTelefoneDto[];
}
