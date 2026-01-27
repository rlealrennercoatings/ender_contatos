import { TipoEndereco } from '@prisma/client';
export declare class CreateTelefoneDto {
    numero: string;
    tipo: 'CELULAR' | 'FIXO';
}
export declare class CreateEnderecoDto {
    tipo: TipoEndereco;
    apelido?: string;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
    uf?: string;
    pais?: string;
    telefones?: CreateTelefoneDto[];
}
