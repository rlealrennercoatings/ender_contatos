import { PrismaService } from '../prisma/prisma.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto';
export declare class ContatosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContatoDto: CreateContatoDto): Promise<{
        enderecos: ({
            telefones: {
                numero: string;
                tipo: import(".prisma/client").$Enums.TipoTelefone;
                id: number;
                enderecoId: number;
            }[];
        } & {
            endereco: string | null;
            tipo: import(".prisma/client").$Enums.TipoEndereco;
            apelido: string | null;
            bairro: string | null;
            cidade: string | null;
            cep: string | null;
            uf: string | null;
            pais: string | null;
            id: number;
            contatoId: number;
        })[];
    } & {
        nome: string;
        cargo: string | null;
        empresa: string | null;
        website: string | null;
        email: string | null;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(search?: string): Promise<({
        enderecos: ({
            telefones: {
                numero: string;
                tipo: import(".prisma/client").$Enums.TipoTelefone;
                id: number;
                enderecoId: number;
            }[];
        } & {
            endereco: string | null;
            tipo: import(".prisma/client").$Enums.TipoEndereco;
            apelido: string | null;
            bairro: string | null;
            cidade: string | null;
            cep: string | null;
            uf: string | null;
            pais: string | null;
            id: number;
            contatoId: number;
        })[];
    } & {
        nome: string;
        cargo: string | null;
        empresa: string | null;
        website: string | null;
        email: string | null;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    })[]>;
    findOne(id: number): Promise<{
        enderecos: ({
            telefones: {
                numero: string;
                tipo: import(".prisma/client").$Enums.TipoTelefone;
                id: number;
                enderecoId: number;
            }[];
        } & {
            endereco: string | null;
            tipo: import(".prisma/client").$Enums.TipoEndereco;
            apelido: string | null;
            bairro: string | null;
            cidade: string | null;
            cep: string | null;
            uf: string | null;
            pais: string | null;
            id: number;
            contatoId: number;
        })[];
    } & {
        nome: string;
        cargo: string | null;
        empresa: string | null;
        website: string | null;
        email: string | null;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, updateContatoDto: UpdateContatoDto): Promise<{
        enderecos: ({
            telefones: {
                numero: string;
                tipo: import(".prisma/client").$Enums.TipoTelefone;
                id: number;
                enderecoId: number;
            }[];
        } & {
            endereco: string | null;
            tipo: import(".prisma/client").$Enums.TipoEndereco;
            apelido: string | null;
            bairro: string | null;
            cidade: string | null;
            cep: string | null;
            uf: string | null;
            pais: string | null;
            id: number;
            contatoId: number;
        })[];
    } & {
        nome: string;
        cargo: string | null;
        empresa: string | null;
        website: string | null;
        email: string | null;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
