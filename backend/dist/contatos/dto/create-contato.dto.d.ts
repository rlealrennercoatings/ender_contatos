import { CreateEnderecoDto } from './create-endereco.dto';
export declare class CreateContatoDto {
    nome: string;
    cargo?: string;
    empresa?: string;
    website?: string;
    email?: string;
    observacoes?: string;
    enderecos?: CreateEnderecoDto[];
}
