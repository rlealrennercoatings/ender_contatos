import { CreateContatoDto } from './create-contato.dto';
import { CreateEnderecoDto } from './create-endereco.dto';
declare const UpdateContatoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateContatoDto>>;
export declare class UpdateContatoDto extends UpdateContatoDto_base {
    enderecos?: CreateEnderecoDto[];
}
export {};
