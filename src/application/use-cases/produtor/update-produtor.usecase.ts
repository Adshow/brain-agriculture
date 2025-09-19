import { BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { DocumentValidator } from '../../../shared/validators/document.validator';
import { UseCaseBase } from '../base.usecase';

interface UpdateProdutorDTO {
  nome?: string;
  cpfCnpj?: string;
}

export class UpdateProdutorUseCase extends UseCaseBase<
  { id: string; data: UpdateProdutorDTO },
  any
> {
  private readonly logger = new Logger(UpdateProdutorUseCase.name);

  constructor(private readonly produtorRepository: IProdutorRepository) {
    super();
  }

  async execute({ id, data }: { id: string; data: UpdateProdutorDTO }) {
    try {
      this.logger.log(`Iniciando atualização do produtor: ${id}`);

      const produtor = await this.produtorRepository.findById(id);
      this.ensureProdutorExists(produtor, id);

      if (data.cpfCnpj) {
        const normalizedDoc = this.normalizeDocumento(data.cpfCnpj);
        this.validateDocumento(normalizedDoc);
        data.cpfCnpj = normalizedDoc;
      }

      await this.produtorRepository.update(id, data);

      const updated = await this.produtorRepository.findById(id);
      this.logger.log(`Produtor atualizado com sucesso: ${id}`);

      return updated;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar produtor ${id}: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Erro inesperado ao atualizar produtor. Tente novamente mais tarde.',
      );
    }
  }

  private ensureProdutorExists(produtor: any, id: string) {
    if (!produtor) {
      this.logger.warn(`Tentativa de atualizar produtor inexistente: ${id}`);
      throw new NotFoundException('Produtor não encontrado. Verifique o ID.');
    }
  }

  private normalizeDocumento(documento: string): string {
    if (!documento) {
      throw new BadRequestException('Documento (CPF ou CNPJ) é obrigatório');
    }
    return documento.replace(/\D/g, '');
  }

  private validateDocumento(documento: string): void {
    if (!DocumentValidator.isValid(documento)) {
      throw new BadRequestException('CPF ou CNPJ inválido');
    }
  }
}
