import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSafraDto } from './dto/create-safra.dto';
import { Safra } from '../../domain/entities/safra.entity';
import { SafraTypeOrmRepository } from '../../infrastructure/database/repositories/safra.orm-repository';
import { CreateSafraUseCase } from '../../application/use-cases/safra/create-safra.usecase';

@ApiTags('safras')
@Controller('safras')
export class SafrasController {
  constructor(
    private readonly safraRepository: SafraTypeOrmRepository,
    private readonly createSafraUseCase: CreateSafraUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso', type: Safra })
  async create(@Body() dto: CreateSafraDto): Promise<Safra> {
    return this.createSafraUseCase.execute(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de todas as safras', type: [Safra] })
  async findAll(): Promise<Safra[]> {
    return this.safraRepository.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Safra encontrada', type: Safra })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  async findOne(@Param('id') id: string): Promise<Safra> {
    const safra = await this.safraRepository.findById(id);
    if (!safra) {
      throw new NotFoundException(`Safra com id ${id} não encontrada`);
    }
    return safra;
  }
}
