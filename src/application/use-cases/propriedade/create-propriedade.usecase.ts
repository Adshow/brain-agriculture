import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Propriedade } from '../../../domain/entities/propriedade.entity';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { v4 as uuidv4 } from 'uuid';
import { UseCaseBase } from '../base.usecase';

interface CreatePropriedadeRequest {
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
  produtorId: string;
}

export class CreatePropriedadeUseCase extends UseCaseBase<CreatePropriedadeRequest, Propriedade> {
  private readonly logger = new Logger(CreatePropriedadeUseCase.name);

  constructor(
    private readonly propriedadeRepo: IPropriedadeRepository,
    private readonly produtorRepo: IProdutorRepository,
  ) {
    super();
  }

  async execute(data: CreatePropriedadeRequest): Promise<Propriedade> {
    try {

      const produtor = await this.produtorRepo.findById(data.produtorId);
      if (!produtor) {
        this.logger.warn(`Tentativa de criar propriedade para produtor inexistente: ${data.produtorId}`);
        throw new NotFoundException('Produtor não encontrado. Verifique o ID e tente novamente.');
      }

      const somaAreas = data.areaAgricultavel + data.areaVegetacao;
      this.ensureCondition(
        somaAreas <= data.areaTotal,
        `Áreas inválidas: agricultável (${data.areaAgricultavel}) + vegetação (${data.areaVegetacao}) = ${somaAreas}, que excede a área total (${data.areaTotal}).`,
      );


      const propriedade = new Propriedade(
        uuidv4(),
        data.nome,
        data.cidade,
        data.estado,
        data.areaTotal,
        data.areaAgricultavel,
        data.areaVegetacao,
        data.produtorId,
      );

      const saved = await this.propriedadeRepo.create(propriedade);
      this.logger.log(`Propriedade criada com sucesso: ${saved.id} para produtor ${data.produtorId}`);
      return saved;

    } catch (error) {
      this.logger.error(`Erro ao criar propriedade: ${error.message}`, error.stack);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Erro ao criar propriedade: ${error.message}`,
      );
    }
  }
}
