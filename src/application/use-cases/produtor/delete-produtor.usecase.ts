import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { UseCaseBase } from '../base.usecase';

export class DeleteProdutorUseCase extends UseCaseBase<string, { message: string }> {
  private readonly logger = new Logger(DeleteProdutorUseCase.name);

  constructor(private readonly produtorRepository: IProdutorRepository) {
    super();
  }

  async execute(id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`Tentando remover produtor: ${id}`);

      const produtor = await this.produtorRepository.findById(id);
      if (!produtor) {
        this.logger.warn(`Tentativa de remover produtor inexistente: ${id}`);
        throw new NotFoundException('Produtor não encontrado. Verifique o ID e tente novamente.');
      }

      await this.produtorRepository.remove(id);
      this.logger.log(`Produtor removido com sucesso: ${id}`);

      return { message: 'Produtor removido com sucesso' };
    } catch (error) {
      this.logger.error(`Erro ao remover produtor ${id}: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        'Erro inesperado ao remover produtor. Tente novamente mais tarde.',
      );
    }
  }
}
