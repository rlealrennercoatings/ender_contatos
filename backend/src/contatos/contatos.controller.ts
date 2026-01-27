import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Permissions } from '../auth/permissions.decorator';

@Controller('contatos')
@UseGuards(JwtGuard)
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

  @Post()
  @Permissions('CREATE')
  create(@Body() createContatoDto: CreateContatoDto) {
    console.log('📝 POST /contatos - Criando novo contato:', createContatoDto.nome);
    return this.contatosService.create(createContatoDto);
  }

  @Get()
  @Permissions('VIEW')
  findAll(@Query('search') search?: string) {
    return this.contatosService.findAll(search);
  }

  @Get(':id')
  @Permissions('VIEW')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contatosService.findOne(id);
  }

  @Patch(':id')
  @Permissions('EDIT')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContatoDto: UpdateContatoDto,
  ) {
    return this.contatosService.update(id, updateContatoDto);
  }

  @Delete(':id')
  @Permissions('DELETE')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contatosService.remove(id);
  }
}
