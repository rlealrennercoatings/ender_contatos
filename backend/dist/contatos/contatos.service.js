"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContatosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContatosService = class ContatosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createContatoDto) {
        const { enderecos, ...contatoData } = createContatoDto;
        console.log('🔧 ContatosService.create - Iniciando...', {
            nome: createContatoDto.nome,
            temEnderecos: !!enderecos,
            enderecosCount: enderecos?.length || 0
        });
        try {
            const contato = await this.prisma.contato.create({
                data: {
                    ...contatoData,
                    enderecos: enderecos
                        ? {
                            create: enderecos.map(({ telefones, ...endereco }) => ({
                                ...endereco,
                                telefones: telefones
                                    ? {
                                        create: telefones,
                                    }
                                    : undefined,
                            })),
                        }
                        : undefined,
                },
                include: {
                    enderecos: {
                        include: {
                            telefones: true,
                        },
                    },
                },
            });
            console.log('✅ Contato criado com sucesso:', contato.id);
            return contato;
        }
        catch (error) {
            console.error('❌ Erro ao criar contato:', error);
            throw error;
        }
    }
    async findAll(search) {
        if (search) {
            const searchTerm = `%${search}%`;
            return this.prisma.contato.findMany({
                where: {
                    OR: [
                        { nome: { contains: searchTerm, mode: 'insensitive' } },
                        { empresa: { contains: searchTerm, mode: 'insensitive' } },
                        { email: { contains: searchTerm, mode: 'insensitive' } },
                        { cargo: { contains: searchTerm, mode: 'insensitive' } },
                        {
                            enderecos: {
                                some: {
                                    OR: [
                                        { cidade: { contains: searchTerm, mode: 'insensitive' } },
                                        { endereco: { contains: searchTerm, mode: 'insensitive' } },
                                        {
                                            telefones: {
                                                some: {
                                                    numero: { contains: searchTerm },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
                include: {
                    enderecos: {
                        include: {
                            telefones: true,
                        },
                    },
                },
                orderBy: {
                    nome: 'asc',
                },
            });
        }
        return this.prisma.contato.findMany({
            include: {
                enderecos: {
                    include: {
                        telefones: true,
                    },
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id) {
        const contato = await this.prisma.contato.findUnique({
            where: { id },
            include: {
                enderecos: {
                    include: {
                        telefones: true,
                    },
                },
            },
        });
        if (!contato) {
            throw new common_1.NotFoundException(`Contato com ID ${id} não encontrado`);
        }
        return contato;
    }
    async update(id, updateContatoDto) {
        const { enderecos, ...contatoData } = updateContatoDto;
        await this.findOne(id);
        if (enderecos !== undefined) {
            await this.prisma.endereco.deleteMany({
                where: { contatoId: id },
            });
        }
        const contato = await this.prisma.contato.update({
            where: { id },
            data: {
                ...contatoData,
                enderecos: enderecos && enderecos.length > 0
                    ? {
                        create: enderecos.map(({ telefones, ...endereco }) => ({
                            ...endereco,
                            telefones: telefones
                                ? {
                                    create: telefones,
                                }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                enderecos: {
                    include: {
                        telefones: true,
                    },
                },
            },
        });
        return contato;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.contato.delete({
            where: { id },
        });
        return { message: 'Contato removido com sucesso' };
    }
};
exports.ContatosService = ContatosService;
exports.ContatosService = ContatosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContatosService);
//# sourceMappingURL=contatos.service.js.map