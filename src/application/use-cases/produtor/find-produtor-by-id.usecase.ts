import { NotFoundException, Logger } from '@nestjs/common';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { Produtor } from '../../../domain/entities/produtor.entity';
import { UseCaseBase } from '../base.usecase';

export class FindProdutorByIdUseCase extends UseCaseBase<string, Produtor> {
  private readonly logger = new Logger(FindProdutorByIdUseCase.name);

  constructor(private readonly produtorRepository: IProdutorRepository) {
    super();
  }

  async execute(id: string): Promise<Produtor> {
    this.logger.log(`Buscando produtor com id: ${id}`);

    const produtor = await this.produtorRepository.findByIdWithRelations(id);

    if (!produtor) {
      this.logger.warn(`Produtor não encontrado: ${id}`);
      throw new NotFoundException('Produtor não encontrado');
    }

    this.logger.log(`Produtor encontrado: ${id}`);
    return produtor;
  }
}
