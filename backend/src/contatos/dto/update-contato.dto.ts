import { PartialType } from '@nestjs/mapped-types';
import { CreateContatoDto } from './create-contato.dto';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from './create-endereco.dto';

export class UpdateContatoDto extends PartialType(CreateContatoDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEnderecoDto)
  enderecos?: CreateEnderecoDto[];
}
