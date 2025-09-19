import {
  BadRequestException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { IProdutorRepository } from '../../../domain/repositories/produtor.repository';
import { Produtor } from '../../../domain/entities/produtor.entity';
import { v4 as uuidv4 } from 'uuid';
import { DocumentValidator } from '../../../shared/validators/document.validator';
import { UseCaseBase } from '../base.usecase';

interface CreateProdutorRequest {
  documento: string;
  nome: string;
}

export class CreateProdutorUseCase extends UseCaseBase<CreateProdutorRequest, Produtor> {
  private readonly logger = new Logger(CreateProdutorUseCase.name);

  constructor(private readonly produtorRepository: IProdutorRepository) {
    super();
  }

  async execute(request: CreateProdutorRequest): Promise<Produtor> {
    try {
      this.logger.log(`Iniciando criação de produtor: ${request.nome}`);

      const normalizedDoc = this.normalizeDocumento(request.documento);
      this.validateDocumento(normalizedDoc);
      await this.ensureDocumentoUnique(normalizedDoc);

      const produtor = this.buildProdutor(normalizedDoc, request.nome);
      const saved = await this.produtorRepository.create(produtor);

      this.logger.log(`Produtor criado com sucesso: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Erro ao criar produtor com documento ${request.documento}: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      throw new BadRequestException(
        'Erro inesperado ao criar produtor. Tente novamente mais tarde.',
      );
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
      throw new BadRequestException('Documento inválido (CPF ou CNPJ)');
    }
  }

  private async ensureDocumentoUnique(documento: string): Promise<void> {
    const existing = await this.produtorRepository.findByDocumento(documento);
    if (existing) {
      throw new ConflictException('Já existe um produtor cadastrado com este documento');
    }
  }

  private buildProdutor(documento: string, nome: string): Produtor {
    return new Produtor(uuidv4(), documento, nome.trim());
  }
}
