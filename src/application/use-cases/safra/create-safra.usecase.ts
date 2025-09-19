import { NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ISafraRepository } from '../../../domain/repositories/safra.repository';
import { IPropriedadeRepository } from '../../../domain/repositories/propriedade.repository';
import { Safra } from '../../../domain/entities/safra.entity';
import { v4 as uuidv4 } from 'uuid';
import { UseCaseBase } from '../base.usecase';

interface CreateSafraRequest {
  nome: string;
  ano: number;
  propriedadeId: string;
}

export class CreateSafraUseCase extends UseCaseBase<CreateSafraRequest, Safra> {
  private readonly logger = new Logger(CreateSafraUseCase.name);

  constructor(
    private readonly safraRepository: ISafraRepository,
    private readonly propriedadeRepository: IPropriedadeRepository,
  ) {
    super();
  }

  async execute(data: CreateSafraRequest): Promise<Safra> {
    try {
      this.logger.log(`Iniciando criação de safra para propriedade ${data.propriedadeId}`);

      const propriedade = await this.propriedadeRepository.findById(data.propriedadeId);
      if (!propriedade) {
        this.logger.warn(`Tentativa de criar safra para propriedade inexistente: ${data.propriedadeId}`);
        throw new NotFoundException('Propriedade não encontrada. Verifique o ID e tente novamente.');
      }

      const existingSafras = await this.safraRepository.findByPropriedade(data.propriedadeId);
      if (existingSafras.some(s => s.ano === data.ano)) {
        this.logger.warn(`Safra duplicada: já existe safra para ano ${data.ano} na propriedade ${data.propriedadeId}`);
        throw new BadRequestException(
          `Já existe uma safra cadastrada para o ano ${data.ano} nesta propriedade.`,
        );
      }

      const safra = new Safra(
        uuidv4(),
        data.nome,
        data.ano,
        data.propriedadeId,
      );

      const saved = await this.safraRepository.create(safra);
      this.logger.log(`Safra criada com sucesso: ${saved.id} (ano ${saved.ano}) na propriedade ${data.propriedadeId}`);

      return saved;
    } catch (error) {
      this.logger.error(`Erro ao criar safra na propriedade ${data.propriedadeId}: ${error.message}`, error.stack);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Erro inesperado ao criar safra. Tente novamente mais tarde.');
    }
  }
}
