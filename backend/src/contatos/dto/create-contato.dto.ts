import { IsString, IsOptional, IsEmail, IsArray, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from './create-endereco.dto';

export class CreateContatoDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @ValidateIf((o) => o.email !== '' && o.email !== null && o.email !== undefined)
  @IsEmail({}, { message: 'Email deve ser um endereço de e-mail válido' })
  email?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEnderecoDto)
  enderecos?: CreateEnderecoDto[];
}
