import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { CreatePropriedadeUseCase } from '../../application/use-cases/propriedade/create-propriedade.usecase';
import { Propriedade } from '../../domain/entities/propriedade.entity';

@ApiTags('propriedades')
@Controller('propriedades')
export class PropriedadesController {
  constructor(private readonly createPropriedade: CreatePropriedadeUseCase) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Propriedade criada com sucesso',
    type: Propriedade,
  })
  async create(@Body() dto: CreatePropriedadeDto): Promise<Propriedade> {
    return this.createPropriedade.execute(dto);
  }
}
