import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateProdutorUseCase } from '../../application/use-cases/produtor/create-produtor.usecase';
import { UpdateProdutorUseCase } from '../../application/use-cases/produtor/update-produtor.usecase';
import { DeleteProdutorUseCase } from '../../application/use-cases/produtor/delete-produtor.usecase';
import { FindProdutorByIdUseCase } from '../../application/use-cases/produtor/find-produtor-by-id.usecase';
import { Produtor } from '../../domain/entities/produtor.entity';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';

@ApiTags('produtores')
@Controller('produtores')
export class ProdutoresController {
  constructor(
    private readonly createProdutor: CreateProdutorUseCase,
    private readonly updateProdutor: UpdateProdutorUseCase,
    private readonly deleteProdutor: DeleteProdutorUseCase,
    private readonly findProdutorById: FindProdutorByIdUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso', type: Produtor })
  async create(@Body() body: CreateProdutorDto): Promise<Produtor> {
    return this.createProdutor.execute(body);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado', type: Produtor })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async update(@Param('id') id: string, @Body() body: UpdateProdutorDto): Promise<Produtor> {
    const produtor = await this.updateProdutor.execute({ id, data: body });
    if (!produtor) throw new NotFoundException(`Produtor com id ${id} não encontrado`);
    return produtor;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.deleteProdutor.execute(id);
    if (!deleted) throw new NotFoundException(`Produtor com id ${id} não encontrado`);
    return { message: 'Produtor deletado com sucesso' };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado', type: Produtor })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(@Param('id') id: string): Promise<Produtor> {
    const produtor = await this.findProdutorById.execute(id);
    if (!produtor) throw new NotFoundException(`Produtor com id ${id} não encontrado`);
    return produtor;
  }
}
