import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AddCulturasDto } from './dto/add-culturas.dto';
import { AddCulturasUseCase } from '../../application/use-cases/cultura/add-cultura.usecase';
import { Cultura } from '../../domain/entities/cultura.entity';

@ApiTags('culturas')
@Controller('safras/:safraId/culturas')
export class CulturasController {
  constructor(private readonly addCulturas: AddCulturasUseCase) {}

  @Post()
  @ApiParam({ name: 'safraId', description: 'ID da safra onde as culturas serão adicionadas' })
  @ApiResponse({
    status: 201,
    description: 'Culturas adicionadas com sucesso à safra',
    type: [Cultura],
  })
  async add(@Param('safraId') safraId: string, @Body() dto: AddCulturasDto): Promise<Cultura[]> {
    return this.addCulturas.execute({
      safraId,
      nomesCulturas: dto.culturas,
    });
  }
}
