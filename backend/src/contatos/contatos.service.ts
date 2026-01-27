import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto';

@Injectable()
export class ContatosService {
  constructor(private prisma: PrismaService) {}

  async create(createContatoDto: CreateContatoDto) {
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
    } catch (error) {
      console.error('❌ Erro ao criar contato:', error);
      throw error;
    }
  }

  async findAll(search?: string) {
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

  async findOne(id: number) {
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
      throw new NotFoundException(`Contato com ID ${id} não encontrado`);
    }

    return contato;
  }

  async update(id: number, updateContatoDto: UpdateContatoDto) {
    const { enderecos, ...contatoData } = updateContatoDto;

    // Verifica se o contato existe
    await this.findOne(id);

    // Remove endereços existentes e cria novos
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

  async remove(id: number) {
    await this.findOne(id);
    
    await this.prisma.contato.delete({
      where: { id },
    });

    return { message: 'Contato removido com sucesso' };
  }
}
