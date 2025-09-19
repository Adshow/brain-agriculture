import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ISafraRepository } from '../../../domain/repositories/safra.repository';
import { ICulturaRepository } from '../../../domain/repositories/cultura.repository';
import { Cultura } from '../../../domain/entities/cultura.entity';
import { v4 as uuidv4 } from 'uuid';
import { UseCaseBase } from '../base.usecase';

export class AddCulturasUseCase extends UseCaseBase<
  { safraId: string; nomesCulturas: string[] },
  Cultura[]
> {
  private readonly logger = new Logger(AddCulturasUseCase.name);

  constructor(
    private readonly safraRepository: ISafraRepository,
    private readonly culturaRepository: ICulturaRepository,
  ) {
    super();
  }

  async execute({ safraId, nomesCulturas }: { safraId: string; nomesCulturas: string[] }): Promise<Cultura[]> {
    try {
      this.logger.log(`Iniciando adição de culturas à safra: ${safraId}`);

      const safra = await this.safraRepository.findById(safraId);
      if (!safra) {
        this.logger.warn(`Tentativa de adicionar culturas em safra inexistente: ${safraId}`);
        throw new NotFoundException('Safra não encontrada. Verifique o ID.');
      }

      if (!nomesCulturas || nomesCulturas.length === 0) {
        this.logger.warn(`Nenhuma cultura fornecida para safra ${safraId}`);
        throw new BadRequestException('É necessário informar ao menos uma cultura para cadastrar.');
      }

      const culturaEntities = nomesCulturas.map(
        (nome) => new Cultura(uuidv4(), nome.trim(), safraId),
      );

      const saved = await this.culturaRepository.bulkCreate(culturaEntities);
      this.logger.log(`Culturas adicionadas com sucesso na safra ${safraId}: ${saved.map(c => c.id).join(', ')}`);

      return saved;
    } catch (error) {
      this.logger.error(`Erro ao adicionar culturas na safra ${safraId}: ${error.message}`, error.stack);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Erro inesperado ao adicionar culturas. Tente novamente mais tarde.',
      );
    }
  }
}
